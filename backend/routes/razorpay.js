const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { prisma } = require('../db');
const { pool } = require('../db');
const fs = require('fs');
const path = require('path');

function auditLog(message) {
    const log = `[${new Date().toISOString()}] ${message}\n`;
    try {
        fs.appendFileSync(path.join(__dirname, '../razorpay_audit.log'), log);
    } catch (e) {
        console.error('Failed to write to audit log:', e);
    }
}

// Initialize Razorpay with settings from database
const getRazorpayInstance = async () => {
    try {
        auditLog('Fetching Razorpay settings...');
        const settings = await prisma.paymentGatewaySetting.findFirst();
        
        if (!settings || !settings.isActive || !settings.razorpayApiKey || !settings.razorpaySecret) {
            auditLog(`Settings Check Failed: ${JSON.stringify({ 
                found: !!settings, 
                active: settings?.isActive, 
                hasKey: !!settings?.razorpayApiKey, 
                hasSecret: !!settings?.razorpaySecret 
            })}`);
            return null;
        }

        auditLog('Settings found. Initializing Razorpay...');
        const instance = new Razorpay({
            key_id: settings.razorpayApiKey.trim(),
            key_secret: settings.razorpaySecret.trim(),
        });
        return { instance, settings };
    } catch (err) {
        auditLog(`getRazorpayInstance Error: ${err.message}`);
        return null;
    }
};

// Create Order for Razorpay
router.post('/create-order', async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt, notes } = req.body;
        auditLog(`Create Order Request Received: amount=${amount}, receipt=${receipt}`);
        
        if (!amount || isNaN(amount)) {
            auditLog('Validation Failed: Invalid amount');
            return res.status(400).json({ error: 'Valid amount is required' });
        }

        const razorpayData = await getRazorpayInstance();
        if (!razorpayData || !razorpayData.instance) {
            auditLog('Aborting: Payment gateway not configured');
            return res.status(400).json({ error: 'Payment gateway is not properly configured. Please check Admin settings.' });
        }
        const { instance } = razorpayData;

        const options = {
            amount: Math.round(parseFloat(amount) * 100),
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
            notes: notes || {}
        };

        auditLog(`Triggering Razorpay API with options: ${JSON.stringify(options)}`);
        const order = await instance.orders.create(options);
        auditLog(`Order Created Successfully: ${order.id}`);
        res.status(200).json(order);
    } catch (err) {
        const errorDetail = err.error ? JSON.stringify(err.error) : (err.description || err.message || JSON.stringify(err));
        auditLog(`Razorpay Create Order Error: ${errorDetail}`);
        res.status(500).json({ error: errorDetail || 'Failed to create Razorpay order' });
    }
});

// Verify Payment and Finalize Enrollment
router.post('/verify-payment', async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            studentDetails,
            courseDetails
        } = req.body;

        // 1. Verify Signature
        const razorpayData = await getRazorpayInstance();
        if (!razorpayData) return res.status(400).json({ error: 'Payment Gateway not configured' });
        const { settings } = razorpayData;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", settings.razorpaySecret)
            .update(body.toString())
            .digest("hex");

        const isSignatureValid = expectedSignature === razorpay_signature;

        if (!isSignatureValid) {
            return res.status(400).json({ error: 'Invalid payment signature' });
        }

        // 2. Payment is valid, let's create the enrollment
        // Process: Create Enquiry -> Create Admission -> Create User Login

        // A. Create Enquiry
        const newEnquiry = await prisma.enquiry.create({
            data: {
                firstName: studentDetails.firstName,
                surname: studentDetails.lastName || studentDetails.surname || '',
                relationship: 'Self',
                dob: studentDetails.dob || '',
                gender: studentDetails.gender || 'Other',
                pincode: studentDetails.pincode || '',
                mobile: studentDetails.mobile,
                email: studentDetails.email,
                address: studentDetails.address || '',
                course: courseDetails.title,
                source: 'Online Purchase',
                status: 'Converted',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        // B. Create Admission
        const studentId = `STU-${Date.now()}`;
        const newAdmission = await prisma.admission.create({
            data: {
                studentId: studentId,
                enquiryId: newEnquiry.id,
                firstName: studentDetails.firstName,
                surname: studentDetails.lastName || studentDetails.surname || '',
                email: studentDetails.email,
                mobile: studentDetails.mobile,
                courseName: courseDetails.title,
                courseType: courseDetails.courseType || 'Certificate',
                courseFee: parseFloat(courseDetails.price) || 0,
                finalAmount: parseFloat(courseDetails.price) || 0,
                admissionFee: parseFloat(courseDetails.price) || 0,
                admissionDate: new Date().toISOString().split('T')[0],
                status: 'Active'
            }
        });

        // C. Create User Login
        if (studentDetails.password) {
            const loginEmail = studentDetails.email;
            
            // Check if user already exists
            const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [loginEmail]);
            
            if (existingUser.rows.length === 0) {
                await pool.query(
                   `INSERT INTO users 
                    (email, password, "fullName", mobile, roles, "createdAt", "updatedAt")
                    VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
                   [
                       loginEmail, 
                       studentDetails.password, 
                       `${studentDetails.firstName} ${studentDetails.lastName || studentDetails.surname || ''}`.trim(), 
                       studentDetails.mobile,
                       ['Student']
                   ]
                );
            }
        }

        // D. Create a payment record (Optional: handle installments)
        await prisma.paymentInstallment.create({
            data: {
                admissionId: newAdmission.id,
                installmentNo: 1,
                amount: parseFloat(courseDetails.price) || 0,
                paidAmount: parseFloat(courseDetails.price) || 0,
                dueDate: new Date(),
                paidDate: new Date(),
                paymentMethod: 'Razorpay',
                transactionId: razorpay_payment_id,
                status: 'Paid'
            }
        });

        res.json({
            success: true,
            message: 'Enrollment successful!',
            admission: newAdmission
        });

    } catch (error) {
        console.error('Error verifying payment:', error);
        auditLog(`Verify Payment Error: ${error.message} - Stack: ${error.stack}`);
        res.status(500).json({ error: error.message || 'Error processing enrollment' });
    }
});

module.exports = router;

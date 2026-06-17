const express = require('express');
const { prisma } = require('../db');
const router = express.Router();
const { pool } = require('../db');

// GET all admissions
router.get('/', async (req, res) => {
    try {
        const admissions = await prisma.admission.findMany({
            orderBy: { createdAt: 'desc' }
        });

        // Manual join to fetch associated Enquiry records
        const enquiryIds = admissions.map(a => a.enquiryId).filter(id => id !== null);
        
        if (enquiryIds.length > 0) {
            const enquiries = await prisma.enquiry.findMany({
                where: { id: { in: enquiryIds } }
            });

            const enrichedAdmissions = admissions.map(adm => ({
                ...adm,
                enquiry: enquiries.find(e => e.id === adm.enquiryId) || null
            }));
            return res.json(enrichedAdmissions);
        }

        res.json(admissions);
    } catch (err) {
        console.error('GET /api/admissions error:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST new admission (convert from enquiry)
router.post('/', async (req, res) => {
    try {
        const data = req.body;
        
        // 1. Create the Admission record
        const newAdmission = await prisma.admission.create({
            data: {
                studentId: data.studentId || `STU-${Date.now()}`,
                enquiryId: data.enquiryId ? parseInt(data.enquiryId) : null,
                firstName: data.firstName,
                surname: data.surname,
                email: data.email || null,
                mobile: data.mobile,
                courseName: data.courseName,
                courseType: data.courseType,
                courseFee: parseFloat(data.courseFee) || 0,
                discountType: data.discountType,
                discountValue: parseFloat(data.discountValue) || 0,
                isGstTaken: data.isGstTaken === true || data.isGstTaken === 'Yes',
                gstAmount: parseFloat(data.gstAmount) || 0,
                finalAmount: parseFloat(data.finalAmount) || 0,
                admissionFee: parseFloat(data.admissionFee) || 0,
                admissionDate: data.admissionDate,
                showFatherName: data.showFatherName !== false,
                showSurname: data.showSurname !== false,
                batch: data.batch,
                referralBy: data.referralBy,
                status: 'Active'
            }
        });

        // 2. If enquiryId is provided, update enquiry status to Converted
        if (data.enquiryId) {
            await prisma.enquiry.update({
                where: { id: parseInt(data.enquiryId) },
                data: { status: 'Converted' }
            });
        }

        // 3. Create Student Login if password provided
        if (data.password && (data.email || data.mobile)) {
             // We use email as the identifier if available, otherwise mobile
             const loginEmail = data.email || `${data.mobile}@tncdc.com`;
             
             // Check if user already exists
             const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [loginEmail]);
             
             if (existingUser.rows.length === 0) {
                 await pool.query(
                    `INSERT INTO users 
                     (email, password, "fullName", mobile, roles, "createdAt", "updatedAt")
                     VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
                    [
                        loginEmail, 
                        data.password, 
                        `${data.firstName} ${data.surname}`, 
                        data.mobile,
                        ['Student']
                    ]
                 );
             }
        }
        res.status(201).json(newAdmission);
    } catch (err) {
        console.error('POST /api/admissions error:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET single admission by ID
router.get('/:id', async (req, res) => {
    try {
        const admission = await prisma.admission.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        if (!admission) return res.status(404).json({ error: 'Admission not found' });
        
        // Fetch enquiry details if exists
        if (admission.enquiryId) {
            const enquiry = await prisma.enquiry.findUnique({
                where: { id: admission.enquiryId }
            });
            return res.json({ ...admission, enquiry });
        }

        res.json(admission);
    } catch (err) {
        console.error('GET /api/admissions/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

// PUT update admission
router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        
        const updatedAdmission = await prisma.admission.update({
            where: { id },
            data: {
                firstName: data.firstName,
                surname: data.surname,
                email: data.email || null,
                mobile: data.mobile,
                courseName: data.courseName,
                courseType: data.courseType,
                courseFee: parseFloat(data.courseFee) || 0,
                discountType: data.discountType,
                discountValue: parseFloat(data.discountValue) || 0,
                isGstTaken: data.isGstTaken === true || data.isGstTaken === 'Yes',
                gstAmount: parseFloat(data.gstAmount) || 0,
                finalAmount: parseFloat(data.finalAmount) || 0,
                admissionFee: parseFloat(data.admissionFee) || 0,
                admissionDate: data.admissionDate,
                showFatherName: data.showFatherName !== false,
                showSurname: data.showSurname !== false,
                batch: data.batch,
                referralBy: data.referralBy,
                status: data.status || 'Active'
            }
        });

        res.json(updatedAdmission);
    } catch (err) {
        console.error('PUT /api/admissions/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET verify student by studentId (publicly accessible)
router.get('/verify/:studentId', async (req, res) => {
    try {
        const admission = await prisma.admission.findUnique({
            where: { studentId: req.params.studentId },
            include: {
                enquiry: {
                    select: {
                        dob: true,
                        profileImage: true,
                        parentName: true,
                        gender: true,
                        address: true,
                        pincode: true,
                        city: true,
                        state: true
                    }
                },
                examResults: {
                    where: { isConfirmed: true },
                    orderBy: { createdAt: 'desc' },
                    take: 1
                },
                certificates: {
                    where: { status: 'Approved' },
                    orderBy: { issuedDate: 'desc' },
                    take: 1
                }
            }
        });

        if (!admission) return res.status(404).json({ error: 'Student record not found' });

        // Flatten the response slightly to match what the frontend expects or just keep it as is
        // We'll provide the latest result and certificate as top-level properties for convenience
        const result = {
            ...admission,
            latestExamResult: admission.examResults[0] || null,
            latestCertificate: admission.certificates[0] || null
        };

        res.json(result);
    } catch (err) {
        console.error('GET /api/admissions/verify/:studentId error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { prisma } = require('../db');

// Get all payment transactions for Payment History page
router.get('/history/all', async (req, res) => {
    try {
        const installments = await prisma.paymentInstallment.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                admission: {
                    select: {
                        firstName: true,
                        surname: true,
                        courseName: true,
                        studentId: true
                    }
                }
            }
        });

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(startOfDay);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        let todayRevenue = 0, todayCount = 0;
        let weekRevenue = 0, weekCount = 0;
        let monthRevenue = 0, monthCount = 0;
        let totalRevenue = 0, totalCount = 0;

        const formatted = installments.map(inst => {
            const paidAmt = inst.paidAmount || 0;
            if (inst.status === 'Paid' || inst.status === 'Partially Paid') {
                const paidDateObj = inst.paidDate ? new Date(inst.paidDate) : null;
                totalRevenue += paidAmt;
                totalCount++;
                if (paidDateObj) {
                    if (paidDateObj >= startOfDay) { todayRevenue += paidAmt; todayCount++; }
                    if (paidDateObj >= startOfWeek) { weekRevenue += paidAmt; weekCount++; }
                    if (paidDateObj >= startOfMonth) { monthRevenue += paidAmt; monthCount++; }
                }
            }
            return {
                id: inst.id,
                studentName: `${inst.admission.firstName} ${inst.admission.surname || ''}`.trim(),
                courseName: inst.admission.courseName,
                studentId: inst.admission.studentId,
                installmentNo: inst.installmentNo,
                amount: inst.amount,
                paidAmount: inst.paidAmount,
                dueDate: inst.dueDate ? inst.dueDate.toISOString().split('T')[0] : null,
                paidDate: inst.paidDate ? inst.paidDate.toISOString().split('T')[0] : null,
                paymentMethod: inst.paymentMethod,
                transactionId: inst.transactionId,
                lateFee: inst.lateFee,
                frequency: inst.frequency,
                status: inst.status
            };
        });

        res.json({
            transactions: formatted,
            stats: {
                todayRevenue, todayCount,
                weekRevenue, weekCount,
                monthRevenue, monthCount,
                totalRevenue, totalCount
            }
        });
    } catch (error) {
        console.error('Error fetching payment history:', error);
        res.status(500).json({ error: 'Failed to fetch payment history' });
    }
});

// Get installments for an admission
router.get('/:admissionId', async (req, res) => {
    try {
        const { admissionId } = req.params;
        const installments = await prisma.paymentInstallment.findMany({
            where: { admissionId: parseInt(admissionId) },
            orderBy: { installmentNo: 'asc' }
        });
        res.json(installments);
    } catch (error) {
        console.error('Error fetching installments:', error);
        res.status(500).json({ error: 'Failed to fetch installments' });
    }
});

// Generate installments for an admission
router.post('/generate', async (req, res) => {
    try {
        const { admissionId, totalAmount, numberOfInstallments, startDate, frequency = 'Monthly', isModify = false } = req.body;
        
        if (!admissionId || !totalAmount || !numberOfInstallments || !startDate) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        let startInstallmentNo = 1;

        if (isModify) {
            const lastPaid = await prisma.paymentInstallment.findFirst({
                where: { admissionId: parseInt(admissionId), status: { not: 'Pending' } },
                orderBy: { installmentNo: 'desc' }
            });
            if (lastPaid) {
                startInstallmentNo = lastPaid.installmentNo + 1;
            }
            
            await prisma.paymentInstallment.deleteMany({
                where: { admissionId: parseInt(admissionId), status: 'Pending' }
            });
        } else {
            // Check if installments already exist
            const existing = await prisma.paymentInstallment.findFirst({
                where: { admissionId: parseInt(admissionId) }
            });

            if (existing) {
                return res.status(400).json({ error: 'Installments already generated for this admission' });
            }
        }

        const installmentAmount = (parseFloat(totalAmount) / parseInt(numberOfInstallments)).toFixed(2);
        const installments = [];
        let currentDate = new Date(startDate);

        for (let i = 0; i < numberOfInstallments; i++) {
            installments.push({
                admissionId: parseInt(admissionId),
                installmentNo: startInstallmentNo + i,
                amount: parseFloat(installmentAmount),
                dueDate: new Date(currentDate),
                status: 'Pending',
                frequency
            });

            // Increment date based on frequency
            if (frequency === 'Weekly') {
                currentDate.setDate(currentDate.getDate() + 7);
            } else if (frequency === 'Yearly') {
                currentDate.setFullYear(currentDate.getFullYear() + 1);
            } else {
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
        }

        const created = await prisma.paymentInstallment.createMany({
            data: installments
        });

        res.status(201).json({ message: 'Installments generated successfully', count: created.count });
    } catch (error) {
        console.error('Error generating installments:', error);
        res.status(500).json({ error: 'Failed to generate installments' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { paidAmount, paymentMethod, transactionId, status, lateFee, paidDate } = req.body;

        const updated = await prisma.paymentInstallment.update({
            where: { id: parseInt(id) },
            data: {
                paidAmount: paidAmount !== undefined ? parseFloat(paidAmount) : undefined,
                paymentMethod: paymentMethod || undefined,
                transactionId: transactionId || undefined,
                status: status || undefined,
                lateFee: lateFee !== undefined ? parseFloat(lateFee) : undefined,
                paidDate: paidDate ? new Date(paidDate) : (status === 'Paid' ? new Date() : undefined)
            }
        });

        res.json(updated);
    } catch (error) {
        console.error('Error updating installment:', error);
        res.status(500).json({ error: 'Failed to update installment' });
    }
});

// Settle all installments for an admission
router.post('/settle-all/:admissionId', async (req, res) => {
    try {
        const { admissionId } = req.params;
        const { paymentMethod, paidDate } = req.body;

        // Fetch all pending installments
        const pendingInstallments = await prisma.paymentInstallment.findMany({
            where: { 
                admissionId: parseInt(admissionId),
                status: { not: 'Paid' }
            }
        });

        // Update each one individually to set paidAmount = amount
        const updates = pendingInstallments.map(inst => 
            prisma.paymentInstallment.update({
                where: { id: inst.id },
                data: {
                    status: 'Paid',
                    paidAmount: inst.amount,
                    paymentMethod: paymentMethod || 'Settle All',
                    paidDate: paidDate ? new Date(paidDate) : new Date()
                }
            })
        );

        await Promise.all(updates);
        
        res.json({ message: 'All installments settled', count: pendingInstallments.length });
    } catch (error) {
        console.error('Error settling installments:', error);
        res.status(500).json({ error: 'Failed to settle installments' });
    }
});

// Reset all installments to unpaid
router.post('/reset-all/:admissionId', async (req, res) => {
    try {
        const { admissionId } = req.params;

        const updated = await prisma.paymentInstallment.updateMany({
            where: { admissionId: parseInt(admissionId) },
            data: {
                status: 'Pending',
                paidAmount: 0,
                paidDate: null,
                paymentMethod: null,
                lateFee: 0
            }
        });

        res.json({ message: 'All installments reset', count: updated.count });
    } catch (error) {
        console.error('Error resetting installments:', error);
        res.status(500).json({ error: 'Failed to reset installments' });
    }
});

// Get all upcoming installments across all admissions
router.get('/upcoming/all', async (req, res) => {
    try {
        const installments = await prisma.paymentInstallment.findMany({
            where: {
                status: 'Pending',
                dueDate: {
                    gte: new Date()
                }
            },
            orderBy: {
                dueDate: 'asc'
            },
            include: {
                admission: {
                    select: {
                        firstName: true,
                        surname: true,
                        courseName: true,
                        studentId: true
                    }
                }
            }
        });

        const formatted = installments.map(inst => ({
            id: inst.id,
            studentName: `${inst.admission.firstName} ${inst.admission.surname}`,
            courseName: inst.admission.courseName,
            rollNumber: inst.admission.studentId,
            amount: inst.amount,
            dueDate: inst.dueDate.toISOString().split('T')[0],
            installmentNo: inst.installmentNo,
            lateFee: inst.lateFee,
            frequency: inst.frequency
        }));

        res.json(formatted);
    } catch (error) {
        console.error('Error fetching all upcoming installments:', error);
        res.status(500).json({ error: 'Failed to fetch upcoming installments' });
    }
});

// Get all paid installments across all admissions
router.get('/paid/all', async (req, res) => {
    try {
        const installments = await prisma.paymentInstallment.findMany({
            where: {
                status: 'Paid'
            },
            orderBy: {
                paidDate: 'desc'
            },
            include: {
                admission: {
                    select: {
                        firstName: true,
                        surname: true,
                        courseName: true,
                        studentId: true
                    }
                }
            }
        });

        const formatted = installments.map(inst => ({
            id: inst.id,
            studentName: `${inst.admission.firstName} ${inst.admission.surname}`,
            courseName: inst.admission.courseName,
            rollNumber: inst.admission.studentId,
            amount: inst.amount,
            paidAmount: inst.paidAmount,
            paidDate: inst.paidDate ? inst.paidDate.toISOString().split('T')[0] : null,
            installmentNo: inst.installmentNo,
            paymentMethod: inst.paymentMethod,
            frequency: inst.frequency
        }));

        res.json(formatted);
    } catch (error) {
        console.error('Error fetching all paid installments:', error);
        res.status(500).json({ error: 'Failed to fetch paid installments' });
    }
});

module.exports = router;

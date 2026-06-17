const express = require('express');
const { prisma } = require('../db');
const router = express.Router();

// Get all payment details
router.get('/', async (req, res) => {
    try {
        const details = await prisma.paymentDetail.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(details);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create payment detail
router.post('/', async (req, res) => {
    try {
        const { type, accountHolderName, bankName, accountNumber, ifscCode, branchName, upiId, qrImageUrl } = req.body;
        const detail = await prisma.paymentDetail.create({
            data: {
                type,
                accountHolderName,
                bankName,
                accountNumber,
                ifscCode,
                branchName,
                upiId,
                qrImageUrl
            }
        });
        res.status(201).json(detail);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update payment detail
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { type, accountHolderName, bankName, accountNumber, ifscCode, branchName, upiId, qrImageUrl, status } = req.body;
        const detail = await prisma.paymentDetail.update({
            where: { id: parseInt(id) },
            data: {
                type,
                accountHolderName,
                bankName,
                accountNumber,
                ifscCode,
                branchName,
                upiId,
                qrImageUrl,
                status
            }
        });
        res.json(detail);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete payment detail
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.paymentDetail.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: "Payment detail deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

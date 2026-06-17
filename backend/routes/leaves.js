const express = require('express');
const router = express.Router();
const { prisma } = require('../db');

// GET /api/leaves
router.get('/', async (req, res) => {
    try {
        const leaves = await prisma.studentLeave.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(leaves);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/leaves
router.post('/', async (req, res) => {
    try {
        const { studentName, studentEmail, startDate, endDate, reason, type } = req.body;
        const newLeave = await prisma.studentLeave.create({
            data: {
                studentName,
                studentEmail,
                startDate,
                endDate,
                reason,
                type: type || 'Sick Leave',
                status: 'Pending'
            }
        });
        res.status(201).json(newLeave);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/leaves/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.studentLeave.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Leave deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/leaves/:id (for status updates if needed later)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedLeave = await prisma.studentLeave.update({
            where: { id: parseInt(id) },
            data: { status }
        });
        res.json(updatedLeave);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

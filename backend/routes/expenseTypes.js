const express = require('express');
const router = express.Router();
const { prisma } = require('../db');

// GET /api/expense-types
router.get('/', async (req, res) => {
    try {
        const expenseTypes = await prisma.expenseType.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(expenseTypes);
    } catch (err) {
        console.error('GET /api/expense-types error:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/expense-types
router.post('/', async (req, res) => {
    try {
        const { name, status } = req.body;
        const expenseType = await prisma.expenseType.create({
            data: {
                name,
                status: status !== undefined ? status : true
            }
        });
        res.status(201).json(expenseType);
    } catch (err) {
        console.error('POST /api/expense-types error:', err);
        if (err.code === 'P2002') {
            return res.status(400).json({ error: 'Expense type already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/expense-types/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (status !== undefined) updateData.status = status;

        const expenseType = await prisma.expenseType.update({
            where: { id: parseInt(id) },
            data: updateData
        });
        res.json(expenseType);
    } catch (err) {
        console.error('PUT /api/expense-types/:id error:', err);
        if (err.code === 'P2002') {
            return res.status(400).json({ error: 'Expense type already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/expense-types/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.expenseType.delete({
            where: { id: parseInt(id) }
        });
        res.json({ success: true });
    } catch (err) {
        console.error('DELETE /api/expense-types/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

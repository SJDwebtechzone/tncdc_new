const express = require('express');
const router = express.Router();
const { prisma } = require('../db');

// GET /api/expense-sub-types
router.get('/', async (req, res) => {
    try {
        const { expenseTypeId } = req.query;
        const whereClause = expenseTypeId ? { expenseTypeId: parseInt(expenseTypeId) } : {};
        
        const expenseSubTypes = await prisma.expenseSubType.findMany({
            where: whereClause,
            include: {
                expenseType: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(expenseSubTypes);
    } catch (err) {
        console.error('GET /api/expense-sub-types error:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/expense-sub-types
router.post('/', async (req, res) => {
    try {
        const { name, expenseTypeId, status } = req.body;
        
        if (!name || !expenseTypeId) {
            return res.status(400).json({ error: 'Name and Expense Type are required' });
        }

        const expenseSubType = await prisma.expenseSubType.create({
            data: {
                name,
                expenseTypeId: parseInt(expenseTypeId),
                status: status !== undefined ? status : true
            },
            include: {
                expenseType: true
            }
        });
        res.status(201).json(expenseSubType);
    } catch (err) {
        console.error('POST /api/expense-sub-types error:', err);
        if (err.code === 'P2002') {
            return res.status(400).json({ error: 'Expense sub type already exists for this type' });
        }
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/expense-sub-types/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, expenseTypeId, status } = req.body;
        const updateData = {};
        
        if (name !== undefined) updateData.name = name;
        if (expenseTypeId !== undefined) updateData.expenseTypeId = parseInt(expenseTypeId);
        if (status !== undefined) updateData.status = status;

        const expenseSubType = await prisma.expenseSubType.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                expenseType: true
            }
        });
        res.json(expenseSubType);
    } catch (err) {
        console.error('PUT /api/expense-sub-types/:id error:', err);
        if (err.code === 'P2002') {
            return res.status(400).json({ error: 'Expense sub type already exists for this type' });
        }
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/expense-sub-types/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.expenseSubType.delete({
            where: { id: parseInt(id) }
        });
        res.json({ success: true });
    } catch (err) {
        console.error('DELETE /api/expense-sub-types/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

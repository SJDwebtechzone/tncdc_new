const express = require('express');
const router = express.Router();
const { prisma } = require('../db');

// GET /api/inventory-categories
router.get('/', async (req, res) => {
    try {
        const categories = await prisma.inventoryCategory.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(categories);
    } catch (err) {
        console.error('GET /api/inventory-categories error:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/inventory-categories
router.post('/', async (req, res) => {
    try {
        const { name, status } = req.body;
        
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const category = await prisma.inventoryCategory.create({
            data: {
                name,
                status: status !== undefined ? status : true
            }
        });
        res.status(201).json(category);
    } catch (err) {
        console.error('POST /api/inventory-categories error:', err);
        if (err.code === 'P2002') {
            return res.status(400).json({ error: 'Inventory category name already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/inventory-categories/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;
        const updateData = {};
        
        if (name !== undefined) updateData.name = name;
        if (status !== undefined) updateData.status = status;

        const category = await prisma.inventoryCategory.update({
            where: { id: parseInt(id) },
            data: updateData
        });
        res.json(category);
    } catch (err) {
        console.error('PUT /api/inventory-categories/:id error:', err);
        if (err.code === 'P2002') {
            return res.status(400).json({ error: 'Inventory category name already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/inventory-categories/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.inventoryCategory.delete({
            where: { id: parseInt(id) }
        });
        res.json({ success: true });
    } catch (err) {
        console.error('DELETE /api/inventory-categories/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

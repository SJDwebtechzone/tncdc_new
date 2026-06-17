const express = require('express');
const router = express.Router();
const { prisma } = require('../db');

// GET /api/languages
router.get('/', async (req, res) => {
    try {
        const languages = await prisma.language.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(languages);
    } catch (err) {
        console.error('GET /api/languages error:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/languages
router.post('/', async (req, res) => {
    try {
        const { name, status } = req.body;
        const language = await prisma.language.create({
            data: {
                name,
                status: status !== undefined ? status : true
            }
        });
        res.status(201).json(language);
    } catch (err) {
        console.error('POST /api/languages error:', err);
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/languages/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (status !== undefined) updateData.status = status;

        const language = await prisma.language.update({
            where: { id: parseInt(id) },
            data: updateData
        });
        res.json(language);
    } catch (err) {
        console.error('PUT /api/languages/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/languages/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.language.delete({
            where: { id: parseInt(id) }
        });
        res.json({ success: true });
    } catch (err) {
        console.error('DELETE /api/languages/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

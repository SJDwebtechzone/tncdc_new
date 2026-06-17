const express = require('express');
const router = express.Router();
const { prisma } = require('../db');

// ─── GET /api/course-award-categories ─────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const categories = await prisma.courseAwardCategory.findMany({
            orderBy: { createdAt: 'asc' }
        });
        res.json(categories);
    } catch (err) {
        console.error('GET /api/course-award-categories error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── POST /api/course-award-categories ────────────────────────────────────────
router.post('/', async (req, res) => {
    try {
        const { name, status } = req.body;
        const category = await prisma.courseAwardCategory.create({
            data: {
                name,
                status: status === 'true' || status === true
            }
        });
        res.status(201).json(category);
    } catch (err) {
        console.error('POST /api/course-award-categories error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── PUT /api/course-award-categories/:id ─────────────────────────────────────
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (status !== undefined) updateData.status = status === 'true' || status === true;

        const category = await prisma.courseAwardCategory.update({
            where: { id: parseInt(id) },
            data: updateData
        });
        res.json(category);
    } catch (err) {
        console.error('PUT /api/course-award-categories/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── DELETE /api/course-award-categories/:id ──────────────────────────────────
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.courseAwardCategory.delete({
            where: { id: parseInt(id) }
        });
        res.json({ success: true });
    } catch (err) {
        console.error('DELETE /api/course-award-categories/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

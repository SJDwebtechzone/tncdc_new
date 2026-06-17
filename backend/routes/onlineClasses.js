const express = require('express');
const router = express.Router();
const { prisma } = require('../db');

// Get all online classes (optionally filtered by course)
router.get('/', async (req, res) => {
    try {
        const { courseId } = req.query;
        const where = courseId ? { courseId: parseInt(courseId) } : {};
        const onlineClasses = await prisma.onlineClass.findMany({
            where,
            include: { course: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(onlineClasses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create online class
router.post('/', async (req, res) => {
    try {
        const { title, date, time, link, courseId } = req.body;
        const onlineClass = await prisma.onlineClass.create({
            data: {
                title,
                date,
                time,
                link,
                courseId: parseInt(courseId)
            },
            include: { course: true }
        });
        res.status(201).json(onlineClass);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update online class
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, date, time, link, courseId, status } = req.body;
        const onlineClass = await prisma.onlineClass.update({
            where: { id: parseInt(id) },
            data: {
                title,
                date,
                time,
                link,
                courseId: parseInt(courseId),
                status: status !== undefined ? status : true
            },
            include: { course: true }
        });
        res.json(onlineClass);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete online class
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.onlineClass.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: "Online class deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

const express = require('express');
const { prisma } = require('../db');
const router = express.Router();

// Get all teachers
router.get('/', async (req, res) => {
    try {
        const teachers = await prisma.teacher.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new teacher
router.post('/', async (req, res) => {
    try {
        const { name, image, designation, description, facebookUrl, twitterUrl, instagramUrl, phone, email, basicSalary } = req.body;
        const teacher = await prisma.teacher.create({
            data: {
                name,
                image,
                designation,
                description,
                facebookUrl,
                twitterUrl,
                instagramUrl,
                phone,
                email,
                basicSalary: parseFloat(basicSalary) || 0
            }
        });
        res.status(201).json(teacher);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update teacher
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image, designation, description, facebookUrl, twitterUrl, instagramUrl, phone, email, basicSalary } = req.body;
        const teacher = await prisma.teacher.update({
            where: { id: parseInt(id) },
            data: {
                name,
                image,
                designation,
                description,
                facebookUrl,
                twitterUrl,
                instagramUrl,
                phone,
                email,
                basicSalary: parseFloat(basicSalary) || 0
            }
        });
        res.json(teacher);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete teacher
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.teacher.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Teacher deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

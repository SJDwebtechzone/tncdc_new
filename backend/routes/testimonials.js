const express = require('express');
const { prisma } = require('../db');
const router = express.Router();

// Get testimonials and settings
router.get('/', async (req, res) => {
    try {
        const testimonials = await prisma.testimonial.findMany({
            orderBy: { createdAt: 'desc' }
        });
        const settings = await prisma.testimonialSettings.findUnique({
            where: { id: 1 }
        });
        res.json({ testimonials, settings: settings || { title: '', subtitle: '' } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new testimonial
router.post('/item', async (req, res) => {
    try {
        const { name, image, role, institute, content } = req.body;
        const testimonial = await prisma.testimonial.create({
            data: { name, image, role, institute, content }
        });
        res.status(201).json(testimonial);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update testimonial
router.put('/item/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image, role, institute, content } = req.body;
        const testimonial = await prisma.testimonial.update({
            where: { id: parseInt(id) },
            data: { name, image, role, institute, content }
        });
        res.json(testimonial);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete testimonial
router.delete('/item/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.testimonial.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Testimonial deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update settings
router.post('/settings', async (req, res) => {
    try {
        const { title, subtitle } = req.body;
        const settings = await prisma.testimonialSettings.upsert({
            where: { id: 1 },
            update: { title, subtitle },
            create: { id: 1, title, subtitle }
        });
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

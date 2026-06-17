const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all performers and settings
router.get('/', async (req, res) => {
    try {
        const performers = await prisma.topPerformer.findMany({
            orderBy: { createdAt: 'desc' }
        });
        let settings = await prisma.topPerformerSettings.findFirst();
        if (!settings) {
            settings = await prisma.topPerformerSettings.create({
                data: {
                    title: "Unmatched Performance Excellence",
                    description: "Delivering exceptional results through cutting-edge solutions and proven methodologies"
                }
            });
        }
        res.json({ performers, settings });
    } catch (error) {
        console.error('Error fetching performers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update banner settings
router.post('/settings', async (req, res) => {
    try {
        const { title, description, bannerUrl } = req.body;
        const settings = await prisma.topPerformerSettings.upsert({
            where: { id: 1 },
            update: { title, description, bannerUrl },
            create: { id: 1, title, description, bannerUrl }
        });
        res.json(settings);
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add a new performer
router.post('/item', async (req, res) => {
    try {
        const { name, image, course, description } = req.body;
        const performer = await prisma.topPerformer.create({
            data: { name, image, course, description }
        });
        res.json(performer);
    } catch (error) {
        console.error('Error creating performer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Edit a performer
router.put('/item/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image, course, description } = req.body;
        const performer = await prisma.topPerformer.update({
            where: { id: parseInt(id) },
            data: { name, image, course, description }
        });
        res.json(performer);
    } catch (error) {
        console.error('Error updating performer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a performer
router.delete('/item/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.topPerformer.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Performer deleted successfully' });
    } catch (error) {
        console.error('Error deleting performer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

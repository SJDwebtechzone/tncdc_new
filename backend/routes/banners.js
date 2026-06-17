const express = require('express');
const { prisma } = require('../db');
const router = express.Router();

// Get Banners
router.get('/', async (req, res) => {
    try {
        const banners = await prisma.websiteBanner.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update single Banner Settings (since there's one settings object in Redux right now)
// But we support multiple banners as per schema
router.post('/', async (req, res) => {
    try {
        const { displayMode, badgeText, badgeIcon, title, description, imageUrl } = req.body;
        // In this implementation, we can just create or update the first one
        // Let's create a new one or update the first one depending on how the frontend sends it
        // The frontend forms a single object for "Banner Settings"
        
        // Find existing or create
        const existing = await prisma.websiteBanner.findFirst();
        let banner;
        if (existing) {
            banner = await prisma.websiteBanner.update({
                where: { id: existing.id },
                data: { displayMode, badgeText, badgeIcon, title, description, imageUrl }
            });
        } else {
            banner = await prisma.websiteBanner.create({
                data: { displayMode, badgeText, badgeIcon, title, description, imageUrl }
            });
        }
        res.json(banner);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Slides
router.get('/slides', async (req, res) => {
    try {
        const slides = await prisma.websiteSlide.findMany({
            orderBy: { order: 'asc' }
        });
        res.json(slides);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create Slide
router.post('/slides', async (req, res) => {
    try {
        const { title, subtitle, link, imageUrl, order } = req.body;
        const slide = await prisma.websiteSlide.create({
            data: { title, subtitle, link, imageUrl, order: parseInt(order) || 1 }
        });
        res.status(201).json(slide);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Slide
router.put('/slides/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subtitle, link, imageUrl, order } = req.body;
        const slide = await prisma.websiteSlide.update({
            where: { id: parseInt(id) },
            data: { title, subtitle, link, imageUrl, order: parseInt(order) || 1 }
        });
        res.json(slide);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Slide
router.delete('/slides/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.websiteSlide.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: "Slide deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

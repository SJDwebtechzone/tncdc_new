const express = require('express');
const { prisma } = require('../db');
const router = express.Router();

// Get FAQs and FAQ Banners
router.get('/', async (req, res) => {
    try {
        const faqs = await prisma.fAQ.findMany({
            orderBy: { createdAt: 'asc' }
        });
        
        const faqBanners = await prisma.fAQBanner.findFirst();
        
        res.json({
            faqs,
            faqBanners: faqBanners || { banner1: '', banner2: '' }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new FAQ
router.post('/item', async (req, res) => {
    try {
        const { question, answer, status } = req.body;
        const faq = await prisma.fAQ.create({
            data: { question, answer, status }
        });
        res.status(201).json(faq);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update FAQ
router.put('/item/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer, status } = req.body;
        const faq = await prisma.fAQ.update({
            where: { id: parseInt(id) },
            data: { question, answer, status }
        });
        res.json(faq);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete FAQ
router.delete('/item/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.fAQ.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'FAQ deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update FAQ Banners
router.post('/banners', async (req, res) => {
    try {
        const { banner1, banner2 } = req.body;
        
        let existing = await prisma.fAQBanner.findFirst();
        let banners;
        
        if (existing) {
            banners = await prisma.fAQBanner.update({
                where: { id: existing.id },
                data: {
                    banner1: banner1 !== undefined ? banner1 : existing.banner1,
                    banner2: banner2 !== undefined ? banner2 : existing.banner2
                }
            });
        } else {
            banners = await prisma.fAQBanner.create({
                data: { banner1: banner1 || '', banner2: banner2 || '' }
            });
        }
        res.json(banners);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

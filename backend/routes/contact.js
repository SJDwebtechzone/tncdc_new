const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get contact settings
router.get('/', async (req, res) => {
    try {
        let settings = await prisma.contactSettings.findUnique({
            where: { id: 1 }
        });

        if (!settings) {
            settings = await prisma.contactSettings.create({
                data: { id: 1 }
            });
        }

        res.json(settings);
    } catch (error) {
        console.error('Error fetching contact settings:', error);
        res.status(500).json({ error: 'Failed to fetch contact settings' });
    }
});

// Update contact settings
router.put('/', async (req, res) => {
    try {
        const { title, phone1, phone2, whatsapp, email1, email2, address, mapIframe } = req.body;
        
        const settings = await prisma.contactSettings.upsert({
            where: { id: 1 },
            update: { title, phone1, phone2, whatsapp, email1, email2, address, mapIframe },
            create: { id: 1, title, phone1, phone2, whatsapp, email1, email2, address, mapIframe }
        });

        res.json(settings);
    } catch (error) {
        console.error('Error updating contact settings:', error);
        res.status(500).json({ error: 'Failed to update contact settings' });
    }
});

module.exports = router;

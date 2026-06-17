const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get Payment Settings
router.get('/', async (req, res) => {
    try {
        let settings = await prisma.paymentGatewaySetting.findUnique({
            where: { id: 1 }
        });
        
        if (!settings) {
            settings = await prisma.paymentGatewaySetting.create({
                data: { id: 1 }
            });
        }
        res.json(settings);
    } catch (error) {
        console.error('Error fetching payment settings:', error);
        res.status(500).json({ error: 'Failed to fetch payment settings' });
    }
});

// Update Payment Settings
router.put('/', async (req, res) => {
    try {
        const { isActive, isTestMode, razorpayApiKey, razorpaySecret, companyName } = req.body;
        
        const settings = await prisma.paymentGatewaySetting.upsert({
            where: { id: 1 },
            update: {
                isActive,
                isTestMode,
                razorpayApiKey,
                razorpaySecret,
                companyName
            },
            create: {
                id: 1,
                isActive: isActive ?? false,
                isTestMode: isTestMode ?? true,
                razorpayApiKey: razorpayApiKey ?? '',
                razorpaySecret: razorpaySecret ?? '',
                companyName: companyName ?? ''
            }
        });
        res.json(settings);
    } catch (error) {
        console.error('Error updating payment settings:', error);
        res.status(500).json({ error: 'Failed to update payment settings' });
    }
});

module.exports = router;

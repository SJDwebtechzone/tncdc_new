const express = require('express');
const { prisma } = require('../db');
const router = express.Router();

// GET attendance settings
router.get('/', async (req, res) => {
    try {
        let settings = await prisma.attendanceSettings.findUnique({
            where: { id: 1 }
        });

        if (!settings) {
            settings = await prisma.attendanceSettings.create({
                data: {
                    id: 1,
                    weekOffDays: ["Saturday", "Sunday"]
                }
            });
        }

        res.json(settings);
    } catch (error) {
        console.error('Error fetching attendance settings:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT update attendance settings
router.put('/', async (req, res) => {
    try {
        const { weekOffDays } = req.body;
        
        const settings = await prisma.attendanceSettings.upsert({
            where: { id: 1 },
            update: {
                weekOffDays,
                updatedAt: new Date()
            },
            create: {
                id: 1,
                weekOffDays,
                updatedAt: new Date()
            }
        });

        res.json(settings);
    } catch (error) {
        console.error('Error updating attendance settings:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

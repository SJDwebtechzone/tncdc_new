const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const { uploadToSupabase } = require('../supabase');

const upload = multer({ storage: multer.memoryStorage() });

const DEFAULT_TEMPLATES = [
    { title: 'certificate image', type: 'PORTRAIT' },
    { title: 'Diploma Image', type: 'PORTRAIT' },
    { title: 'marksheet image', type: 'PORTRAIT' },
    { title: 'admissionform image', type: 'PORTRAIT' },
    { title: 'idcard image', type: 'PORTRAIT' },
    { title: 'Typing Certificate', type: 'PORTRAIT' },
    { title: 'ATC Certificate', type: 'PORTRAIT' },
    { title: 'hallticket image', type: 'PORTRAIT' },
    { title: 'feesreceipt image', type: 'PORTRAIT' },
    { title: 'Performance Card', type: 'PORTRAIT' },
    { title: 'Expense Receipt', type: 'PORTRAIT' },
    { title: 'Birthday Poster', type: 'PORTRAIT' },
];

// GET all background images
router.get('/', async (req, res) => {
    try {
        let items = await prisma.backgroundImage.findMany({
            orderBy: { id: 'asc' }
        });

        // Seed if empty
        if (items.length === 0) {
            await prisma.backgroundImage.createMany({
                data: DEFAULT_TEMPLATES
            });
            items = await prisma.backgroundImage.findMany({
                orderBy: { id: 'asc' }
            });
        }

        res.json(items);
    } catch (error) {
        console.error('Error fetching backgrounds:', error);
        res.status(500).json({ error: 'Failed to fetch background images' });
    }
});

// UPDATE background image
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, type, designSettings } = req.body;
        let imageUrl = req.body.imageUrl;

        if (req.file) {
            imageUrl = await uploadToSupabase(req.file, 'Images');
        }

        const dataToUpdate = {
            title,
            type,
            imageUrl,
            updatedAt: new Date()
        };

        if (designSettings !== undefined) {
            dataToUpdate.designSettings = typeof designSettings === 'string' ? JSON.parse(designSettings) : designSettings;
        }

        const updated = await prisma.backgroundImage.update({
            where: { id: parseInt(id) },
            data: dataToUpdate
        });

        res.json(updated);
    } catch (error) {
        console.error('Error updating background:', error);
        res.status(500).json({ error: error.message || 'Failed to update background image' });
    }
});

module.exports = router;

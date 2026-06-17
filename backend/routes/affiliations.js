const express = require('express');
const { prisma } = require('../db');
const router = express.Router();
const multer = require('multer');
const { supabase, deleteFromSupabase } = require('../supabase');

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

// GET all affiliations
router.get('/', async (req, res) => {
    try {
        const affiliations = await prisma.affiliation.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(affiliations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create affiliation
router.post('/', (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(err.status || 500).json({ error: err.message || 'Upload failed' });
        }
        next();
    });
}, async (req, res) => {
    try {
        const { title, subtitle } = req.body;
        let imageUrl = '';

        if (req.file) {
            const fileName = `affiliation-${Date.now()}-${req.file.originalname}`;
            const { data, error } = await supabase.storage
                .from('Images')
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: false
                });

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('Images')
                .getPublicUrl(fileName);

            imageUrl = publicUrl;
        }

        const affiliation = await prisma.affiliation.create({
            data: {
                title,
                subtitle: subtitle || null,
                image: imageUrl,
                status: true
            }
        });
        res.status(201).json(affiliation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update affiliation
router.put('/:id', (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) return res.status(err.status || 500).json({ error: err.message });
        next();
    });
}, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subtitle, image } = req.body;
        let finalImageUrl = image;

        if (req.file) {
            // Delete old image if exists
            const oldAff = await prisma.affiliation.findUnique({ where: { id: parseInt(id) } });
            if (oldAff?.image) {
                await deleteFromSupabase(oldAff.image);
            }

            const fileName = `affiliation-${Date.now()}-${req.file.originalname}`;
            const { data, error } = await supabase.storage
                .from('Images')
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: false
                });

            if (error) throw error;
            const { data: { publicUrl } } = supabase.storage.from('Images').getPublicUrl(fileName);
            finalImageUrl = publicUrl;
        }

        const affiliation = await prisma.affiliation.update({
            where: { id: parseInt(id) },
            data: {
                title,
                subtitle: subtitle || null,
                image: finalImageUrl
            }
        });
        res.json(affiliation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE affiliation
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const aff = await prisma.affiliation.findUnique({ where: { id: parseInt(id) } });
        
        if (aff?.image) {
            await deleteFromSupabase(aff.image);
        }

        await prisma.affiliation.delete({ where: { id: parseInt(id) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

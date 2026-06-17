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

// GET all sample certificates
router.get('/', async (req, res) => {
    try {
        const certificates = await prisma.sampleCertificate.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(certificates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create sample certificate
router.post('/', (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(err.status || 500).json({ error: err.message || 'Upload failed' });
        }
        next();
    });
}, async (req, res) => {
    try {
        const { name } = req.body;
        let imageUrl = '';

        if (req.file) {
            const fileName = `sample-cert-${Date.now()}-${req.file.originalname}`;
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

        const certificate = await prisma.sampleCertificate.create({
            data: {
                name,
                image: imageUrl,
                status: true
            }
        });
        res.status(201).json(certificate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update sample certificate
router.put('/:id', (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) return res.status(err.status || 500).json({ error: err.message });
        next();
    });
}, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image } = req.body;
        let finalImageUrl = image;

        if (req.file) {
            // Delete old image if exists
            const oldCert = await prisma.sampleCertificate.findUnique({ where: { id: parseInt(id) } });
            if (oldCert?.image) {
                await deleteFromSupabase(oldCert.image);
            }

            const fileName = `sample-cert-${Date.now()}-${req.file.originalname}`;
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

        const certificate = await prisma.sampleCertificate.update({
            where: { id: parseInt(id) },
            data: {
                name,
                image: finalImageUrl
            }
        });
        res.json(certificate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE sample certificate
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cert = await prisma.sampleCertificate.findUnique({ where: { id: parseInt(id) } });
        
        if (cert?.image) {
            await deleteFromSupabase(cert.image);
        }

        await prisma.sampleCertificate.delete({ where: { id: parseInt(id) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

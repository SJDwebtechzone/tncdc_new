const express = require('express');
const router = express.Router();
const { prisma } = require('../db');
const multer = require('multer');
const { uploadToSupabase, deleteFromSupabase } = require('../supabase');

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// GET /api/study-materials
router.get('/', async (req, res) => {
    try {
        const materials = await prisma.studyMaterial.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(materials);
    } catch (err) {
        console.error('GET /api/study-materials error:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/study-materials
router.post('/', upload.single('file'), async (req, res) => {
    try {
        const { title, description } = req.body;
        
        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        let fileUrl = '';
        if (req.file) {
            fileUrl = await uploadToSupabase(req.file, 'Documents').catch(async () => {
                 return await uploadToSupabase(req.file, 'Images');
            });
        }

        const newMaterial = await prisma.studyMaterial.create({
            data: {
                title,
                description,
                fileUrl
            }
        });

        res.status(201).json(newMaterial);
    } catch (err) {
        console.error('POST /api/study-materials error:', err);
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/study-materials/:id
router.put('/:id', upload.single('file'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const existing = await prisma.studyMaterial.findUnique({ where: { id: parseInt(id) } });
        if (!existing) return res.status(404).json({ error: 'Material not found' });

        let fileUrl = existing.fileUrl;
        if (req.file) {
            // Delete old file if exists
            if (existing.fileUrl) {
                await deleteFromSupabase(existing.fileUrl, 'Documents').catch(() => {});
            }
            fileUrl = await uploadToSupabase(req.file, 'Documents').catch(async () => {
                return await uploadToSupabase(req.file, 'Images');
            });
        }

        const updated = await prisma.studyMaterial.update({
            where: { id: parseInt(id) },
            data: {
                title: title || existing.title,
                description: description || existing.description,
                fileUrl
            }
        });

        res.json(updated);
    } catch (err) {
        console.error('PUT /api/study-materials/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/study-materials/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const material = await prisma.studyMaterial.findUnique({ where: { id: parseInt(id) } });
        if (!material) return res.status(404).json({ error: 'Material not found' });

        if (material.fileUrl) {
            await deleteFromSupabase(material.fileUrl, 'Documents').catch(() => {});
        }

        await prisma.studyMaterial.delete({
            where: { id: parseInt(id) }
        });

        res.json({ success: true, message: 'Material deleted successfully' });
    } catch (err) {
        console.error('DELETE /api/study-materials/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { supabase, deleteFromSupabase } = require('../supabase');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─── Multer Setup ─────────────────────────────────────────────────────────────
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

// Helper for Supabase Upload
async function uploadToSupabase(file, folder = 'categories') {
    if (!file) return null;
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;
    const { data, error } = await supabase.storage
        .from('Images')
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from('Images')
        .getPublicUrl(fileName);

    return publicUrl;
}

// ─── GET /api/course-categories ──────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const categories = await prisma.courseCategory.findMany({
            include: {
                courses: {
                    select: { id: true }
                }
            },
            orderBy: { createdAt: 'asc' }
        });
        
        // Transform to return count as a direct property
        const categoriesWithCount = categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            iconUrl: cat.iconUrl,
            status: cat.status,
            createdAt: cat.createdAt,
            updatedAt: cat.updatedAt,
            count: cat.courses ? cat.courses.length : 0
        }));

        res.json(categoriesWithCount);
    } catch (err) {
        console.error('GET /api/course-categories error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── POST /api/course-categories ─────────────────────────────────────────────
router.post('/', upload.single('icon'), async (req, res) => {
    try {
        const { name, status } = req.body;
        const iconUrl = await uploadToSupabase(req.file, 'categories');

        const category = await prisma.courseCategory.create({
            data: {
                name,
                status: status === 'true' || status === true,
                iconUrl
            }
        });
        res.status(201).json(category);
    } catch (err) {
        console.error('POST /api/course-categories error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── PUT /api/course-categories/:id ──────────────────────────────────────────
router.put('/:id', upload.single('icon'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status, count } = req.body;

        const updateData = {};
        if (name !== undefined && name !== 'undefined' && name !== 'null') updateData.name = name;
        if (status !== undefined && status !== 'undefined' && status !== 'null') {
            updateData.status = status === 'true' || status === true;
        }
        if (count !== undefined && count !== 'undefined' && count !== 'null') {
            updateData.count = parseInt(count);
        }
        if (req.file) updateData.iconUrl = await uploadToSupabase(req.file, 'categories');

        const category = await prisma.courseCategory.update({
            where: { id: parseInt(id) },
            data: updateData
        });
        res.json(category);
    } catch (err) {
        console.error('PUT /api/course-categories/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── DELETE /api/course-categories/:id ───────────────────────────────────────
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const category = await prisma.courseCategory.findUnique({ where: { id: parseInt(id) } });

        if (category?.iconUrl) {
            await deleteFromSupabase(category.iconUrl);
        }

        await prisma.courseCategory.delete({
            where: { id: parseInt(id) }
        });
        res.json({ success: true });
    } catch (err) {
        console.error('DELETE /api/course-categories/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

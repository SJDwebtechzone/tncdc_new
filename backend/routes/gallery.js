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

// GET all gallery items
router.get('/', async (req, res) => {
    try {
        const items = await prisma.gallery.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create gallery item
router.post('/', (req, res, next) => {
    console.log('Gallery POST request received');
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('Multer Upload Error:', err);
            return res.status(err.status || 500).json({ error: err.message || 'Upload failed' });
        }
        next();
    });
}, async (req, res) => {
    try {
        const { title, type, mediaUrl, thumbnailUrl } = req.body;
        console.log('Gallery Request Data:', { title, type, mediaUrl });

        let finalMediaUrl = mediaUrl || '';

        // If type is IMAGE and file was uploaded
        if (type === 'IMAGE' && req.file) {
            console.log('Detected IMAGE upload, starting Supabase Storage upload...');
            try {
                const fileName = `${Date.now()}-${req.file.originalname}`;
                const { data, error } = await supabase.storage
                    .from('Images')
                    .upload(fileName, req.file.buffer, {
                        contentType: req.file.mimetype,
                        upsert: false
                    });

                if (error) {
                    throw error;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('Images')
                    .getPublicUrl(fileName);

                finalMediaUrl = publicUrl;
                console.log('Supabase upload success:', finalMediaUrl);
            } catch (uploadError) {
                console.error('Supabase Storage Error:', uploadError);
                return res.status(500).json({ error: `Supabase error: ${uploadError.message}` });
            }
        }

        const item = await prisma.gallery.create({
            data: {
                title,
                type,
                mediaUrl: finalMediaUrl,
                thumbnailUrl: thumbnailUrl || null,
                status: true
            }
        });
        res.status(201).json(item);
    } catch (error) {
        console.error('Prisma Create Error:', error);
        res.status(500).json({ error: error.message });
    }
});
// DELETE gallery item
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.gallery.findUnique({ where: { id: parseInt(id) } });
        
        if (item?.mediaUrl && item.type === 'IMAGE') {
            await deleteFromSupabase(item.mediaUrl);
        }

        await prisma.gallery.delete({ where: { id: parseInt(id) } });
        res.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/gallery/:id error:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT update gallery item
router.put('/:id', (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) return res.status(err.status || 500).json({ error: err.message });
        next();
    });
}, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, type, mediaUrl, thumbnailUrl } = req.body;
        let finalMediaUrl = mediaUrl;

        if (type === 'IMAGE' && req.file) {
            // Delete old image if exists
            const oldItem = await prisma.gallery.findUnique({ where: { id: parseInt(id) } });
            if (oldItem?.mediaUrl) {
                await deleteFromSupabase(oldItem.mediaUrl);
            }

            const fileName = `${Date.now()}-${req.file.originalname}`;
            const { data, error } = await supabase.storage
                .from('Images')
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: false
                });

            if (error) throw error;
            const { data: { publicUrl } } = supabase.storage.from('Images').getPublicUrl(fileName);
            finalMediaUrl = publicUrl;
        }

        const item = await prisma.gallery.update({
            where: { id: parseInt(id) },
            data: {
                title,
                type,
                mediaUrl: finalMediaUrl,
                thumbnailUrl: thumbnailUrl || null
            }
        });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

const express = require('express');
const { prisma } = require('../db');
const router = express.Router();
const multer = require('multer');
const { supabase, deleteFromSupabase } = require('../supabase');

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// GET all posts
router.get('/', async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create post
router.post('/', upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'additionalImages', maxCount: 10 }
]), async (req, res) => {
    try {
        const { title, subheading, description, tags } = req.body;
        let thumbnailUrl = '';
        let additionalImageUrls = [];

        // Upload thumbnail
        if (req.files['thumbnail']) {
            const file = req.files['thumbnail'][0];
            const fileName = `post-thumb-${Date.now()}-${file.originalname}`;
            const { error } = await supabase.storage
                .from('Images')
                .upload(fileName, file.buffer, { contentType: file.mimetype });

            if (error) throw error;
            const { data: { publicUrl } } = supabase.storage.from('Images').getPublicUrl(fileName);
            thumbnailUrl = publicUrl;
        }

        // Upload additional images
        if (req.files['additionalImages']) {
            for (const file of req.files['additionalImages']) {
                const fileName = `post-img-${Date.now()}-${file.originalname}`;
                const { error } = await supabase.storage
                    .from('Images')
                    .upload(fileName, file.buffer, { contentType: file.mimetype });

                if (error) throw error;
                const { data: { publicUrl } } = supabase.storage.from('Images').getPublicUrl(fileName);
                additionalImageUrls.push(publicUrl);
            }
        }

        const post = await prisma.post.create({
            data: {
                title,
                subheading,
                description,
                thumbnail: thumbnailUrl,
                additionalImages: additionalImageUrls,
                tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
                status: true
            }
        });
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update post
router.put('/:id', upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'additionalImages', maxCount: 10 }
]), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subheading, description, tags, existingThumbnail, existingAdditionalImages } = req.body;
        
        let thumbnailUrl = existingThumbnail;
        let additionalImageUrls = Array.isArray(existingAdditionalImages) ? existingAdditionalImages : (existingAdditionalImages ? [existingAdditionalImages] : []);

        const oldPost = await prisma.post.findUnique({ where: { id: parseInt(id) } });

        // Update thumbnail
        if (req.files['thumbnail']) {
            if (oldPost?.thumbnail) await deleteFromSupabase(oldPost.thumbnail);
            
            const file = req.files['thumbnail'][0];
            const fileName = `post-thumb-${Date.now()}-${file.originalname}`;
            const { error } = await supabase.storage
                .from('Images')
                .upload(fileName, file.buffer, { contentType: file.mimetype });

            if (error) throw error;
            const { data: { publicUrl } } = supabase.storage.from('Images').getPublicUrl(fileName);
            thumbnailUrl = publicUrl;
        }

        // Update/Add additional images
        if (req.files['additionalImages']) {
            for (const file of req.files['additionalImages']) {
                const fileName = `post-img-${Date.now()}-${file.originalname}`;
                const { error } = await supabase.storage
                    .from('Images')
                    .upload(fileName, file.buffer, { contentType: file.mimetype });

                if (error) throw error;
                const { data: { publicUrl } } = supabase.storage.from('Images').getPublicUrl(fileName);
                additionalImageUrls.push(publicUrl);
            }
        }

        const post = await prisma.post.update({
            where: { id: parseInt(id) },
            data: {
                title,
                subheading,
                description,
                thumbnail: thumbnailUrl,
                additionalImages: additionalImageUrls,
                tags: Array.isArray(tags) ? tags : (tags ? [tags] : [])
            }
        });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE post
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });
        
        if (post?.thumbnail) await deleteFromSupabase(post.thumbnail);
        if (post?.additionalImages) {
            for (const img of post.additionalImages) {
                await deleteFromSupabase(img);
            }
        }

        await prisma.post.delete({ where: { id: parseInt(id) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

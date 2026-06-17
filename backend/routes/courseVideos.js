const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─── GET /api/course-videos ──────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const videos = await prisma.courseVideo.findMany({
            include: {
                course: true,
                subject: true,
                semester: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(videos);
    } catch (err) {
        console.error('GET /api/course-videos error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── POST /api/course-videos ─────────────────────────────────────────
router.post('/', async (req, res) => {
    try {
        const { title, videoUrl, courseId, subjectId, semesterId } = req.body;
        const newVideo = await prisma.courseVideo.create({
            data: {
                title,
                videoUrl,
                courseId: parseInt(courseId),
                subjectId: parseInt(subjectId),
                semesterId: semesterId ? parseInt(semesterId) : null
            },
            include: {
                course: true,
                subject: true,
                semester: true
            }
        });
        res.json(newVideo);
    } catch (err) {
        console.error('POST /api/course-videos error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── PUT /api/course-videos/:id ──────────────────────────────────────
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, videoUrl, courseId, subjectId, semesterId } = req.body;
        const updatedVideo = await prisma.courseVideo.update({
            where: { id: parseInt(id) },
            data: {
                title,
                videoUrl,
                courseId: parseInt(courseId),
                subjectId: parseInt(subjectId),
                semesterId: semesterId ? parseInt(semesterId) : null
            },
            include: {
                course: true,
                subject: true,
                semester: true
            }
        });
        res.json(updatedVideo);
    } catch (err) {
        console.error('PUT /api/course-videos error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── DELETE /api/course-videos/:id ───────────────────────────────────
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.courseVideo.delete({
            where: { id: parseInt(id) }
        });
        res.json({ success: true });
    } catch (err) {
        console.error('DELETE /api/course-videos error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

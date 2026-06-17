const express = require('express');
const router = express.Router();
const { prisma } = require('../db');
const multer = require('multer');
const { uploadToSupabase, deleteFromSupabase } = require('../supabase');

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit for PDFs
});

// ─── GET /api/course-notes ──────────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const notes = await prisma.courseNote.findMany({
            include: {
                course: true,
                subject: true,
                semester: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(notes);
    } catch (err) {
        console.error('GET /api/course-notes error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── POST /api/course-notes ─────────────────────────────────────────────────
router.post('/', upload.single('file'), async (req, res) => {
    try {
        const { title, courseId, subjectId, semesterId } = req.body;
        
        if (!title || !courseId || !subjectId) {
            return res.status(400).json({ error: 'Title, courseId, and subjectId are required' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'PDF file is required' });
        }

        const fileUrl = await uploadToSupabase(req.file, 'Documents').catch(async () => {
             // Fallback to Images bucket if Documents doesn't exist
             return await uploadToSupabase(req.file, 'Images');
        });

        const newNote = await prisma.courseNote.create({
            data: {
                title,
                fileUrl,
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

        res.status(201).json(newNote);

    } catch (err) {
        console.error('POST /api/course-notes error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── DELETE /api/course-notes/:id ───────────────────────────────────────────
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const note = await prisma.courseNote.findUnique({ where: { id: parseInt(id) } });
        if (!note) return res.status(404).json({ error: 'Note not found' });

        if (note.fileUrl) {
            await deleteFromSupabase(note.fileUrl, 'Documents').catch(async () => {
                await deleteFromSupabase(note.fileUrl, 'Images');
            });
        }

        await prisma.courseNote.delete({
            where: { id: parseInt(id) }
        });

        res.json({ success: true, message: 'Note deleted successfully' });
    } catch (err) {
        console.error('DELETE /api/course-notes/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

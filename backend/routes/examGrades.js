const express = require('express');
const { prisma } = require('../db');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// GET all exam grades
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "exam_grades" ORDER BY "id" ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/exam-grades error:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST new exam grade
router.post('/', async (req, res) => {
    try {
        const { performance, grade, start, end } = req.body;
        const result = await pool.query(
            'INSERT INTO "exam_grades" ("performance", "grade", "start", "end", "updatedAt") VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
            [performance, grade, parseInt(start), parseInt(end)]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/exam-grades error:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE exam grade
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM "exam_grades" WHERE "id" = $1', [parseInt(id)]);
        res.json({ message: 'Exam grade deleted' });
    } catch (err) {
        console.error('DELETE /api/exam-grades error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

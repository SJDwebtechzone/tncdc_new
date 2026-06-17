const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET /api/batches
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM batches ORDER BY "createdAt" DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/batches error:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/batches
router.post('/', async (req, res) => {
    try {
        const { name, fromTime, toTime, timing, totalStudents } = req.body;
        const totalAmount = req.body.totalAmount || "0.00";
        const paidAmount = req.body.paidAmount || "0.00";
        const remainingAmount = req.body.remainingAmount || "0.00";

        const sql = `
            INSERT INTO batches (name, "fromTime", "toTime", timing, "totalStudents", "totalAmount", "paidAmount", "remainingAmount", "updatedAt")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
            RETURNING *
        `;
        const values = [name, fromTime, toTime, timing, totalStudents, totalAmount, paidAmount, remainingAmount];

        const result = await pool.query(sql, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/batches error:', err);
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/batches/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, fromTime, toTime, timing, totalStudents, totalAmount, paidAmount, remainingAmount } = req.body;

        const sql = `
            UPDATE batches 
            SET name = $1, "fromTime" = $2, "toTime" = $3, timing = $4, "totalStudents" = $5, 
                "totalAmount" = $6, "paidAmount" = $7, "remainingAmount" = $8, "updatedAt" = NOW()
            WHERE id = $9
            RETURNING *
        `;
        const values = [name, fromTime, toTime, timing, totalStudents, totalAmount, paidAmount, remainingAmount, parseInt(id)];

        const result = await pool.query(sql, values);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Batch not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/batches/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/batches/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM batches WHERE id = $1', [parseInt(id)]);
        res.json({ success: true });
    } catch (err) {
        console.error('DELETE /api/batches/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

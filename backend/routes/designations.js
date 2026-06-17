const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET /api/designations
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM designations ORDER BY "createdAt" DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/designations error:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/designations
router.post('/', async (req, res) => {
    try {
        const { name, status } = req.body;
        const result = await pool.query(
            'INSERT INTO designations (name, status, "updatedAt") VALUES ($1, $2, NOW()) RETURNING *',
            [name.toUpperCase(), status !== undefined ? status : true]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/designations error:', err);
        if (err.code === '23505') { // Unique violation
            return res.status(400).json({ error: 'Designation name already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/designations/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        let updateQuery = 'UPDATE designations SET "updatedAt" = NOW()';
        let values = [];
        let valueIndex = 1;

        if (name !== undefined) {
            updateQuery += `, name = $${valueIndex}`;
            values.push(name.toUpperCase());
            valueIndex++;
        }
        if (status !== undefined) {
            updateQuery += `, status = $${valueIndex}`;
            values.push(status);
            valueIndex++;
        }

        updateQuery += ` WHERE id = $${valueIndex} RETURNING *`;
        values.push(parseInt(id));

        if (values.length === 1) return res.status(400).json({ error: 'No fields to update' });

        const result = await pool.query(updateQuery, values);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Designation not found' });

        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/designations/:id error:', err);
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Designation name already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/designations/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM designations WHERE id = $1', [parseInt(id)]);
        res.json({ success: true });
    } catch (err) {
        console.error('DELETE /api/designations/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

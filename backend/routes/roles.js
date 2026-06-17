const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET /api/roles
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM roles ORDER BY "createdAt" DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/roles error:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/roles
router.post('/', async (req, res) => {
    try {
        const { name, permissions } = req.body;

        // Ensure permissions is a valid JSON object
        const permissionsJson = typeof permissions === 'string' ? permissions : JSON.stringify(permissions);

        const result = await pool.query(
            'INSERT INTO roles (name, permissions, "updatedAt") VALUES ($1, $2, NOW()) RETURNING *',
            [name.toUpperCase(), permissionsJson]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/roles error:', err);
        if (err.code === '23505') { // Unique violation
            return res.status(400).json({ error: 'Role name already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/roles/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, permissions } = req.body;

        let updateQuery = 'UPDATE roles SET "updatedAt" = NOW()';
        let values = [];
        let valueIndex = 1;

        if (name !== undefined) {
            updateQuery += `, name = $${valueIndex}`;
            values.push(name.toUpperCase());
            valueIndex++;
        }
        if (permissions !== undefined) {
            updateQuery += `, permissions = $${valueIndex}`;
            const permissionsJson = typeof permissions === 'string' ? permissions : JSON.stringify(permissions);
            values.push(permissionsJson);
            valueIndex++;
        }

        updateQuery += ` WHERE id = $${valueIndex} RETURNING *`;
        values.push(parseInt(id));

        if (values.length === 1) return res.status(400).json({ error: 'No fields to update' });

        const result = await pool.query(updateQuery, values);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Role not found' });

        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /api/roles/:id error:', err);
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Role name already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/roles/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM roles WHERE id = $1', [parseInt(id)]);
        res.json({ success: true });
    } catch (err) {
        console.error('DELETE /api/roles/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // 1. Check hardcoded super admin first
        if (email === 'admin@tncdc.in' && password === 'admin123') {
            return res.json({
                success: true,
                user: {
                    id: 0,
                    email: 'admin@tncdc.in',
                    fullName: 'Super Admin',
                    roles: ['ADMIN'],
                    permissions: { '*': { view: true, add: true, edit: true, delete: true } }, // Admin override
                    profilePhoto: '',
                    isAdmin: true,
                }
            });
        }

        // 2. Check users table
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email.trim().toLowerCase()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];

        // Plain-text password comparison (matches how Add User saves it)
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Return user data (never send password)
        const { password: _, ...safeUser } = user;

        // Fetch permissions for the user's roles
        let mergedPermissions = {};
        if (safeUser.roles && safeUser.roles.length > 0) {
            const roleResults = await pool.query(
                'SELECT permissions FROM roles WHERE name = ANY($1)',
                [safeUser.roles]
            );

            roleResults.rows.forEach(row => {
                const perms = typeof row.permissions === 'string' ? JSON.parse(row.permissions) : row.permissions;
                Object.keys(perms).forEach(module => {
                    if (!mergedPermissions[module]) {
                        mergedPermissions[module] = { view: false, add: false, edit: false, delete: false };
                    }
                    mergedPermissions[module].view = mergedPermissions[module].view || perms[module].view;
                    mergedPermissions[module].add = mergedPermissions[module].add || perms[module].add;
                    mergedPermissions[module].edit = mergedPermissions[module].edit || perms[module].edit;
                    mergedPermissions[module].delete = mergedPermissions[module].delete || perms[module].delete;
                });
            });
        }

        return res.json({
            success: true,
            user: {
                ...safeUser,
                role: safeUser.roles && safeUser.roles.length > 0 ? safeUser.roles[0] : null,
                permissions: mergedPermissions,
                isAdmin: false,
            }
        });

    } catch (err) {
        console.error('POST /api/auth/login error:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/auth/change-student-password
router.post('/change-student-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ error: 'Email and new password are required' });
        }

        // 1. Verify existence and update password in users table
        const result = await pool.query(
            'UPDATE users SET password = $1, "updatedAt" = NOW() WHERE email = $2 RETURNING id',
            [newPassword, email.trim().toLowerCase()]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student with this email not found' });
        }

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        console.error('POST /api/auth/change-student-password error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { pool } = require('../db');

const { supabase, deleteFromSupabase } = require('../supabase');

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Helper for Supabase Upload
async function uploadToSupabase(file, folder = 'users') {
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

// ─── GET /api/users ──────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users ORDER BY "createdAt" DESC');
        // Don't send passwords
        const users = result.rows.map(({ password, ...u }) => u);
        res.json(users);
    } catch (err) {
        console.error('GET /api/users error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── POST /api/users ─────────────────────────────────────────────────────────
router.post('/', upload.single('profilePhoto'), async (req, res) => {
    try {
        const {
            email, password, fullName, mobile, employeeId,
            dateOfJoining, department, designation, qualification,
            dateOfBirth, address, roles,
            emergencyContact, paidLeaveAllocation, salaryMode, status, basicSalary
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const profilePhoto = await uploadToSupabase(req.file, 'users/photos');

        // Parse roles array from JSON string or use empty array
        let rolesArray = [];
        if (roles) {
            try {
                rolesArray = typeof roles === 'string' ? JSON.parse(roles) : roles;
            } catch {
                rolesArray = [];
            }
        }

        // Auto-generate employeeId if not provided
        let finalEmployeeId = employeeId;
        if (!finalEmployeeId || finalEmployeeId.trim() === '') {
            const countResult = await pool.query('SELECT COUNT(*) FROM users');
            const userCount = parseInt(countResult.rows[0].count) + 1;
            const currentYear = new Date().getFullYear();
            finalEmployeeId = `EMP-${currentYear}-${String(userCount).padStart(3, '0')}`;
        }

        const result = await pool.query(
            `INSERT INTO users 
             (email, password, "fullName", mobile, "employeeId", "dateOfJoining", 
              department, designation, qualification, "dateOfBirth", address, 
              "profilePhoto", roles, "emergencyContact", "paidLeaveAllocation", "salaryMode", status, "basicSalary", "updatedAt")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW())
             RETURNING *`,
            [
                email, password,
                fullName || '', mobile || '', finalEmployeeId,
                dateOfJoining || '', department || '', designation || '',
                qualification || '', dateOfBirth || '', address || '',
                profilePhoto, rolesArray,
                emergencyContact || '', parseInt(paidLeaveAllocation) || 0, salaryMode || 'Monthly',
                status === undefined ? true : (status === 'true' || status === true),
                parseFloat(basicSalary) || 0
            ]
        );

        const { password: _, ...user } = result.rows[0];
        res.status(201).json(user);
    } catch (err) {
        console.error('POST /api/users error:', err);
        if (err.code === '23505') {
            return res.status(400).json({ error: 'A user with this email already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// ─── PUT /api/users/:id ───────────────────────────────────────────────────────
router.put('/:id', upload.single('profilePhoto'), async (req, res) => {
    try {
        const { id } = req.params;
        const {
            email, fullName, mobile, employeeId, dateOfJoining,
            department, designation, qualification, dateOfBirth, address, roles,
            emergencyContact, paidLeaveAllocation, salaryMode, status, password, basicSalary
        } = req.body;

        const existing = await pool.query('SELECT * FROM users WHERE id = $1', [parseInt(id)]);
        if (existing.rows.length === 0) return res.status(404).json({ error: 'User not found' });

        let rolesArray = existing.rows[0].roles;
        if (roles) {
            try {
                rolesArray = typeof roles === 'string' ? JSON.parse(roles) : roles;
            } catch {
                rolesArray = [];
            }
        }

        const profilePhoto = req.file
            ? await uploadToSupabase(req.file, 'users/photos')
            : existing.rows[0].profilePhoto;

        // Use the new password if provided, otherwise keep the existing password
        const finalPassword = password && password.trim() !== '' ? password : existing.rows[0].password;

        const result = await pool.query(
            `UPDATE users SET
                email = $1, "fullName" = $2, mobile = $3, "employeeId" = $4,
                "dateOfJoining" = $5, department = $6, designation = $7,
                qualification = $8, "dateOfBirth" = $9, address = $10,
                "profilePhoto" = $11, roles = $12, "emergencyContact" = $13,
                "paidLeaveAllocation" = $14, "salaryMode" = $15, status = $16, password = $17, "basicSalary" = $18, "updatedAt" = NOW()
             WHERE id = $19 RETURNING *`,
            [
                email || existing.rows[0].email,
                fullName || '', mobile || '', employeeId || '',
                dateOfJoining || '', department || '', designation || '',
                qualification || '', dateOfBirth || '', address || '',
                profilePhoto, rolesArray,
                emergencyContact || '', parseInt(paidLeaveAllocation) || 0, salaryMode || 'Monthly',
                status === undefined ? existing.rows[0].status : (status === 'true' || status === true),
                finalPassword,
                parseFloat(basicSalary) || existing.rows[0].basicSalary || 0,
                parseInt(id)
            ]
        );

        const { password: _, ...user } = result.rows[0];
        res.json(user);
    } catch (err) {
        console.error('PUT /api/users/:id error:', err);
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Email already in use' });
        }
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /api/users/:id/stats ────────────────────────────────────────────────
router.get('/:id/stats', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Fetch aggregate counts in parallel
        const [attendanceCount, leaveCount, lectureCount, salaryCount, recentSalaries] = await Promise.all([
            pool.query('SELECT COUNT(*) FROM staff_attendance WHERE "userId" = $1', [userId]),
            pool.query('SELECT COUNT(*) FROM staff_leaves WHERE "userId" = $1', [userId]),
            pool.query('SELECT COUNT(*) FROM staff_lectures WHERE "userId" = $1', [userId]),
            pool.query('SELECT COUNT(*) FROM staff_salary_records WHERE "userId" = $1', [userId]),
            pool.query('SELECT * FROM staff_salary_records WHERE "userId" = $1 ORDER BY "paidDate" DESC LIMIT 5', [userId]),
        ]);

        const stats = {
            totalAttendance: parseInt(attendanceCount.rows[0].count) || 0,
            totalLeaves: parseInt(leaveCount.rows[0].count) || 0,
            totalLectures: parseInt(lectureCount.rows[0].count) || 0,
            totalSalaryRecords: parseInt(salaryCount.rows[0].count) || 0,
            recentSalaries: recentSalaries.rows || []
        };

        res.json(stats);
    } catch (err) {
        console.error('GET /api/users/:id/stats error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── DELETE /api/users/:id ────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await pool.query('SELECT "profilePhoto" FROM users WHERE id = $1', [parseInt(id)]);
        if (existing.rows.length > 0 && existing.rows[0].profilePhoto) {
            await deleteFromSupabase(existing.rows[0].profilePhoto);
        }
        await pool.query('DELETE FROM users WHERE id = $1', [parseInt(id)]);
        res.json({ success: true });
    } catch (err) {
        console.error('DELETE /api/users/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

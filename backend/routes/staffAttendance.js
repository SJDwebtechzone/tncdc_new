const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all attendance records with filters
router.get('/', async (req, res) => {
    try {
        const { userId, teacherId, month, year, date } = req.query;
        
        const where = {};
        if (userId && userId !== 'All Active Staff') where.userId = parseInt(userId);
        if (teacherId) where.teacherId = parseInt(teacherId);
        if (date) where.date = date;
        
        if (year && month) {
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let mValue = month;
            if (isNaN(month)) {
                const mIdx = months.indexOf(month) + 1;
                mValue = mIdx.toString().padStart(2, '0');
            }
            where.date = {
                startsWith: `${year}-${mValue}`
            };
        } else if (year) {
            where.date = {
                startsWith: `${year}`
            };
        }

        const attendance = await prisma.staffAttendance.findMany({
            where,
            include: {
                user: {
                    select: {
                        fullName: true,
                        department: true,
                        designation: true,
                        employeeId: true
                    }
                },
                teacher: {
                    select: {
                        name: true,
                        designation: true,
                    }
                }
            },
            orderBy: { date: 'desc' }
        });

        // Flatten the name for the frontend
        const result = attendance.map(a => ({
            ...a,
            staffName: a.user ? a.user.fullName : (a.teacher ? a.teacher.name : 'Unknown'),
            staffType: a.user ? 'Staff' : (a.teacher ? 'Trainer' : 'Unknown')
        }));

        res.json(result);
    } catch (error) {
        console.error('Error fetching staff attendance:', error);
        res.status(500).json({ error: 'Failed to fetch attendance records' });
    }
});

// POST mark individual attendance
router.post('/', async (req, res) => {
    try {
        const { userId, teacherId, date, status, remarks } = req.body;

        if ((!userId && !teacherId) || !date || !status) {
            return res.status(400).json({ error: 'userId or teacherId, date, and status are required' });
        }

        const where = { date };
        if (userId) where.userId = parseInt(userId);
        else where.teacherId = parseInt(teacherId);

        const existing = await prisma.staffAttendance.findFirst({
            where
        });

        let result;
        if (existing) {
            result = await prisma.staffAttendance.update({
                where: { id: existing.id },
                data: { status, remarks, updatedAt: new Date() }
            });
        } else {
            result = await prisma.staffAttendance.create({
                data: {
                    userId: userId ? parseInt(userId) : null,
                    teacherId: teacherId ? parseInt(teacherId) : null,
                    date,
                    status,
                    remarks
                }
            });
        }

        res.status(201).json(result);
    } catch (error) {
        console.error('Error marking staff attendance:', error);
        res.status(500).json({ error: 'Failed to mark attendance' });
    }
});

// POST bulk attendance
router.post('/bulk', async (req, res) => {
    try {
        const { date, attendanceData } = req.body; 

        if (!date || !attendanceData || !Array.isArray(attendanceData)) {
            return res.status(400).json({ error: 'date and attendanceData array are required' });
        }

        await prisma.$transaction(async (tx) => {
            for (const record of attendanceData) {
                const where = { date };
                if (record.staffType === 'Trainer' || record.teacherId) {
                    where.teacherId = parseInt(record.teacherId || record.userId);
                } else {
                    where.userId = parseInt(record.userId);
                }

                const existing = await tx.staffAttendance.findFirst({
                    where
                });

                if (existing) {
                    await tx.staffAttendance.update({
                        where: { id: existing.id },
                        data: { status: record.status, remarks: record.remarks, updatedAt: new Date() }
                    });
                } else {
                    await tx.staffAttendance.create({
                        data: {
                            userId: record.staffType === 'Trainer' ? null : parseInt(record.userId),
                            teacherId: record.staffType === 'Trainer' ? parseInt(record.userId) : null,
                            date,
                            status: record.status,
                            remarks: record.remarks
                        }
                    });
                }
            }
        });

        res.json({ success: true, message: 'Bulk attendance recorded successfully' });
    } catch (error) {
        console.error('Error marking bulk staff attendance:', error);
        res.status(500).json({ error: 'Failed to record bulk attendance' });
    }
});

// DELETE attendance record
router.delete('/:id', async (req, res) => {
    try {
        await prisma.staffAttendance.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting attendance record:', error);
        res.status(500).json({ error: 'Failed to delete attendance record' });
    }
});

module.exports = router;

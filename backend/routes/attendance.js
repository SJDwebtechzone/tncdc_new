const express = require('express');
const router = express.Router();
const { prisma } = require('../db');

// GET /api/attendance/students?batch=...&date=...
router.get('/students', async (req, res) => {
    try {
        const { batch, date } = req.query;
        
        // 1. Fetch students in the batch
        const students = await prisma.admission.findMany({
            where: {
                batch: batch || undefined,
                status: 'Active'
            },
            include: {
                enquiry: {
                    select: {
                        profileImage: true
                    }
                }
            }
        });

        // 2. Fetch existing attendance for these students on this date
        const attendanceRecords = await prisma.studentAttendance.findMany({
            where: {
                date,
                batch: batch || undefined
            }
        });

        // 3. Merge data
        const mergedData = students.map(student => {
            const record = attendanceRecords.find(r => r.admissionId === student.id);
            return {
                ...student,
                attendance: record || null
            };
        });

        res.json(mergedData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/attendance/bulk
router.post('/bulk', async (req, res) => {
    try {
        const { date, batch, attendanceData } = req.body;

        // attendanceData is an array of { admissionId, status, punchIn, punchOut, remarks }
        
        const operations = attendanceData.map(record => {
            return prisma.studentAttendance.upsert({
                where: {
                    // We need a unique constraint if we want upsert to work perfectly by admissionId + date
                    // Since we don't have one, we find and update or create
                    id: record.attendanceId || -1 // dummy id if not exists
                },
                update: {
                    status: record.status,
                    punchIn: record.punchIn,
                    punchOut: record.punchOut,
                    remarks: record.remarks,
                    batch
                },
                create: {
                    admissionId: record.admissionId,
                    date,
                    status: record.status,
                    punchIn: record.punchIn,
                    punchOut: record.punchOut,
                    remarks: record.remarks,
                    batch
                }
            });
        });

        // Actually, upsert is tricky without a unique ID for the pair.
        // Let's just delete existing for that date/batch and re-insert, or find manually.
        
        // Simple approach: Loop and handle
        for (const record of attendanceData) {
            const existing = await prisma.studentAttendance.findFirst({
                where: {
                    admissionId: record.admissionId,
                    date,
                    batch
                }
            });

            if (existing) {
                await prisma.studentAttendance.update({
                    where: { id: existing.id },
                    data: {
                        status: record.status,
                        punchIn: record.punchIn,
                        punchOut: record.punchOut,
                        remarks: record.remarks
                    }
                });
            } else {
                await prisma.studentAttendance.create({
                    data: {
                        admissionId: record.admissionId,
                        date,
                        batch,
                        status: record.status,
                        punchIn: record.punchIn,
                        punchOut: record.punchOut,
                        remarks: record.remarks
                    }
                });
            }
        }

        res.json({ message: 'Attendance recorded successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/attendance/report
router.get('/report', async (req, res) => {
    try {
        const { batch, admissionId, status, fromDate, toDate } = req.query;

        const where = {
            date: {
                gte: fromDate || undefined,
                lte: toDate || undefined
            }
        };

        if (batch && batch !== 'Select Batch') where.batch = batch;
        if (status && status !== 'Select Status') where.status = status;
        if (admissionId && admissionId !== 'Select Student') where.admissionId = parseInt(admissionId);

        const reports = await prisma.studentAttendance.findMany({
            where,
            include: {
                admission: {
                    select: {
                        firstName: true,
                        surname: true,
                        courseName: true,
                        studentId: true
                    }
                }
            },
            orderBy: { date: 'desc' }
        });

        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { prisma } = require('../db');

// GET all salary records
router.get('/', async (req, res) => {
    try {
        const { month, year } = req.query;
        const where = {};
        if (month) where.month = month;
        if (year) where.year = year;

        const salaries = await prisma.staffSalaryRecord.findMany({
            where,
            include: {
                user: {
                    select: { fullName: true, employeeId: true }
                },
                teacher: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const formatted = salaries.map(s => ({
            ...s,
            staffName: s.user ? s.user.fullName : (s.teacher ? s.teacher.name : 'Unknown'),
            staffType: s.user ? 'Staff' : (s.teacher ? 'Trainer' : 'Unknown')
        }));

        res.json(formatted);
    } catch (error) {
        console.error('Error fetching salaries:', error);
        res.status(500).json({ error: 'Failed to fetch salary records' });
    }
});

// GET calculation preview based on attendance
router.get('/preview', async (req, res) => {
    const { userId, teacherId, month, year } = req.query;

    if (!month || !year || (!userId && !teacherId)) {
        return res.status(400).json({ error: 'Missing required parameters (month, year, and staff selection)' });
    }

    try {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        let basicSalary = 0;
        let staffName = '';
        
        if (userId) {
            const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
            if (!user) return res.status(404).json({ error: 'Staff not found' });
            basicSalary = user.basicSalary || 0;
            staffName = user.fullName;
        } else if (teacherId) {
            const teacher = await prisma.teacher.findUnique({ where: { id: parseInt(teacherId) } });
            if (!teacher) return res.status(404).json({ error: 'Trainer not found' });
            basicSalary = teacher.basicSalary || 0;
            staffName = teacher.name;
        }

        // 2. Get Attendance for the month
        const monthNum = (months.indexOf(month) + 1).toString().padStart(2, '0');
        const pattern = `${year}-${monthNum}`;

        const attendance = await prisma.staffAttendance.findMany({
            where: {
                userId: userId ? parseInt(userId) : null,
                teacherId: teacherId ? parseInt(teacherId) : null,
                date: {
                    startsWith: pattern
                }
            }
        });

        // 3. Calculate Days
        const daysInMonth = new Date(parseInt(year), months.indexOf(month) + 1, 0).getDate();
        
        let presentDays = 0;
        attendance.forEach(a => {
            if (a.status === 'Present') presentDays += 1;
            else if (a.status === 'Half Day') presentDays += 0.5;
            else if (a.status === 'Late') presentDays += 0.9;
        });

        // 4. Calculate Net Salary
        const perDaySalary = basicSalary / daysInMonth;
        const netSalary = Math.round(perDaySalary * presentDays);
        const deductions = Math.round(basicSalary - netSalary);

        res.json({
            basicSalary,
            daysInMonth,
            presentCount: attendance.filter(a => a.status === 'Present').length,
            absentCount: attendance.filter(a => a.status === 'Absent').length,
            halfDayCount: attendance.filter(a => a.status === 'Half Day').length,
            lateCount: attendance.filter(a => a.status === 'Late').length,
            calculatedDays: presentDays,
            perDaySalary: perDaySalary.toFixed(2),
            grossSalary: basicSalary,
            deductions,
            netSalary
        });

    } catch (error) {
        console.error('Error calculating salary preview:', error);
        res.status(500).json({ error: 'Failed to calculate salary preview' });
    }
});

// POST save salary record
router.post('/', async (req, res) => {
    try {
        const { 
            userId, teacherId, month, year, grossSalary, deductions, netSalary, status,
            totalDays, presentCount, absentCount, halfDayCount, lateCount, calculatedDays, basicSalary
        } = req.body;

        const record = await prisma.staffSalaryRecord.create({
            data: {
                userId: userId ? parseInt(userId) : null,
                teacherId: teacherId ? parseInt(teacherId) : null,
                month,
                year,
                basicSalary: parseFloat(basicSalary || 0),
                grossSalary: parseFloat(grossSalary),
                deductions: parseFloat(deductions),
                netSalary: parseFloat(netSalary),
                totalDays: parseInt(totalDays || 0),
                presentCount: parseFloat(presentCount || 0),
                absentCount: parseFloat(absentCount || 0),
                halfDayCount: parseFloat(halfDayCount || 0),
                lateCount: parseFloat(lateCount || 0),
                calculatedDays: parseFloat(calculatedDays || 0),
                status: status || 'Paid',
                paidDate: new Date()
            }
        });

        res.status(201).json(record);
    } catch (error) {
        console.error('Error saving salary record:', error);
        res.status(500).json({ error: 'Failed to save salary record' });
    }
});

// DELETE salary record
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.staffSalaryRecord.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Salary record deleted successfully' });
    } catch (error) {
        console.error('Error deleting salary record:', error);
        res.status(500).json({ error: 'Failed to delete salary record' });
    }
});

module.exports = router;

const express = require('express');
const { prisma } = require('../db');
const router = express.Router();

// GET all exam results (enriched with admission and course)
router.get('/', async (req, res) => {
    try {
        const results = await prisma.examResult.findMany({
            include: {
                admission: true
            },
            orderBy: { updatedAt: 'desc' }
        });
        res.json(results);
    } catch (err) {
        console.error('GET /api/exam-results error:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET results by admission ID
router.get('/admission/:admissionId', async (req, res) => {
    try {
        const results = await prisma.examResult.findMany({
            where: { admissionId: parseInt(req.params.admissionId) },
            orderBy: { semesterName: 'asc' }
        });
        res.json(results);
    } catch (err) {
        console.error('GET /api/exam-results/admission/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST/PUT upsert exam result
router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const admissionId = parseInt(data.admissionId);
        const semesterName = data.semesterName || "First Semester";

        // Logic to calculate result and grade
        const totalMarks = data.totalMarks || 100;
        const obtainedMarks = (parseFloat(data.obtainedObjectiveMarks) || 0) + (parseFloat(data.obtainedPracticalMarks) || 0);
        const percentage = (obtainedMarks / totalMarks) * 100;
        
        // Fetch grading rules
        const gradingRules = await prisma.examGrade.findMany({
            orderBy: { start: 'asc' }
        });

        let grade = "N/A";
        let result = "Fail";

        for (const rule of gradingRules) {
            if (percentage >= rule.start && percentage <= rule.end) {
                grade = rule.grade;
                // If grade is not D or below (assuming 35% is pass)
                // Actually result depends on passing percentage which might be per course
                break;
            }
        }

        // Default passing percentage 35
        result = percentage >= 35 ? "pass" : "Fail";

        const examResult = await prisma.examResult.upsert({
            where: {
                // Since we don't have a unique constraint on admissionId+semesterName in schema yet
                // we'll find first or create. 
                // Better: Check if one exists
                id: data.id || -1
            },
            update: {
                obtainedObjectiveMarks: parseFloat(data.obtainedObjectiveMarks) || 0,
                obtainedPracticalMarks: parseFloat(data.obtainedPracticalMarks) || 0,
                totalObjectiveMarks: parseFloat(data.totalObjectiveMarks) || 0,
                totalPracticalMarks: parseFloat(data.totalPracticalMarks) || 0,
                obtainedMarks,
                totalMarks,
                percentage,
                result,
                grade,
                subjects: data.subjects,
                isConfirmed: data.isConfirmed === true,
                semesterName
            },
            create: {
                admissionId,
                semesterName,
                obtainedObjectiveMarks: parseFloat(data.obtainedObjectiveMarks) || 0,
                obtainedPracticalMarks: parseFloat(data.obtainedPracticalMarks) || 0,
                totalObjectiveMarks: parseFloat(data.totalObjectiveMarks) || 0,
                totalPracticalMarks: parseFloat(data.totalPracticalMarks) || 0,
                obtainedMarks,
                totalMarks,
                percentage,
                result,
                grade,
                subjects: data.subjects,
                isConfirmed: data.isConfirmed === true
            }
        });

        res.json(examResult);
    } catch (err) {
        console.error('POST /api/exam-results error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

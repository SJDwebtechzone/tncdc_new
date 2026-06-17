const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get all applications
router.get('/', async (req, res) => {
    try {
        const apps = await prisma.jobApplication.findMany({
            include: { job: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(apps);
    } catch (error) {
        console.error('Error fetching job applications:', error);
        res.status(500).json({ error: 'Failed to fetch job applications' });
    }
});

// Create a new application
router.post('/', async (req, res) => {
    try {
        const { jobId, fullName, email, mobile, experience, skills, coverLetter } = req.body;
        
        const app = await prisma.jobApplication.create({
            data: {
                jobId: parseInt(jobId),
                fullName,
                email,
                mobile,
                experience,
                skills,
                coverLetter,
                status: "Pending"
            }
        });
        
        res.status(201).json(app);
    } catch (error) {
        console.error('Error creating application:', error);
        res.status(500).json({ error: 'Failed to submit application' });
    }
});

// Update an application status
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const app = await prisma.jobApplication.update({
            where: { id: parseInt(id) },
            data: { status }
        });
        
        res.json(app);
    } catch (error) {
        console.error('Error updating application:', error);
        res.status(500).json({ error: 'Failed to update application' });
    }
});

module.exports = router;

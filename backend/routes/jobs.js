const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get all jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await prisma.job.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

// Create a new job
router.post('/', async (req, res) => {
    try {
        const { title, location, jobType, description, requirements, responsibilities, salaryRange, status } = req.body;
        
        const job = await prisma.job.create({
            data: {
                title,
                location,
                jobType: jobType || "Full-time",
                description,
                requirements: Array.isArray(requirements) ? requirements : (requirements ? [requirements] : []),
                responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? [responsibilities] : []),
                salaryRange,
                status: status !== undefined ? (status === 'true' || status === true) : true
            }
        });
        
        res.status(201).json(job);
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ error: 'Failed to create job' });
    }
});

// Update a job
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, location, jobType, description, requirements, responsibilities, salaryRange, status } = req.body;
        
        const job = await prisma.job.update({
            where: { id: parseInt(id) },
            data: {
                title,
                location,
                jobType,
                description,
                requirements: Array.isArray(requirements) ? requirements : (requirements ? [requirements] : []),
                responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? [responsibilities] : []),
                salaryRange,
                status: status !== undefined ? (status === 'true' || status === true) : true
            }
        });
        
        res.json(job);
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ error: 'Failed to update job' });
    }
});

// Delete a job
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.job.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ error: 'Failed to delete job' });
    }
});

module.exports = router;

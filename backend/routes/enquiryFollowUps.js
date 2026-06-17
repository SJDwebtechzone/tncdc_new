const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all follow-ups
router.get('/all', async (req, res) => {
    try {
        const followUps = await prisma.enquiryFollowUp.findMany({
            include: {
                enquiry: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(followUps);
    } catch (error) {
        console.error('Error fetching all follow-ups:', error);
        res.status(500).json({ error: 'Failed to fetch follow-ups' });
    }
});

// Get follow-ups for a specific enquiry
router.get('/:enquiryId/followups', async (req, res) => {
    try {
        const { enquiryId } = req.params;
        const followUps = await prisma.enquiryFollowUp.findMany({
            where: {
                enquiryId: parseInt(enquiryId)
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(followUps);
    } catch (error) {
        console.error('Error fetching follow-ups:', error);
        res.status(500).json({ error: 'Failed to fetch follow-ups' });
    }
});

// Add a new follow-up
router.post('/:enquiryId/followups', async (req, res) => {
    try {
        const { enquiryId } = req.params;
        const { followUpDate, nextFollowUpDate, studentResponse, conversationDetails } = req.body;

        const followUp = await prisma.enquiryFollowUp.create({
            data: {
                enquiryId: parseInt(enquiryId),
                followUpDate,
                nextFollowUpDate,
                studentResponse,
                conversationDetails
            }
        });

        // Optionally update the main Enquiry status based on the follow-up response
        let statusUpdate = {};
        if (studentResponse === 'Interested' || studentResponse === 'Call Back Later') {
            statusUpdate = { status: 'Pending' };
        } else if (studentResponse === 'Not Interested') {
            statusUpdate = { status: 'Lost' }; // Assuming 'Lost' or similar is a valid status
        }
        
        if (Object.keys(statusUpdate).length > 0) {
            await prisma.enquiry.update({
                where: { id: parseInt(enquiryId) },
                data: statusUpdate
            });
        }

        res.status(201).json(followUp);
    } catch (error) {
        console.error('Error creating follow-up:', error);
        res.status(500).json({ error: 'Failed to create follow-up' });
    }
});

module.exports = router;

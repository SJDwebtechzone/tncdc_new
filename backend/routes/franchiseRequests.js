const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create franchise request
router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const newRequest = await prisma.franchiseRequest.create({
            data: {
                institutionName: data.institutionName,
                ownerName: data.ownerName,
                designation: data.designation,
                dob: data.dob,
                email: data.email,
                mobile: data.mobile,
                fullAddress: data.fullAddress,
                taluka: data.taluka,
                pincode: data.pincode,
                city: data.city,
                state: data.state,
                computers: data.computers,
                staff: data.staff,
                status: 'Pending'
            }
        });

        // Also create a notification for the admin
        try {
            await prisma.notification.create({
                data: {
                    title: '🏦 New Franchise Application',
                    message: `"${data.institutionName}" has applied for a New Franchise. Review the details now.`,
                    type: 'franchise_request',
                    link: `/dashboard/franchises/requests?id=${newRequest.id}`
                }
            });
        } catch (notifErr) {
            console.error('Failed to create notification:', notifErr);
        }

        res.status(201).json(newRequest);
    } catch (error) {
        console.error('Franchise request failed:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all franchise requests
router.get('/', async (req, res) => {
    try {
        const requests = await prisma.franchiseRequest.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update request status
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await prisma.franchiseRequest.update({
            where: { id: parseInt(id) },
            data: { status }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

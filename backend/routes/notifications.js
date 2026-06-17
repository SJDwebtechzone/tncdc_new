const express = require('express');
const { prisma } = require('../db');
const router = express.Router();

// GET all notifications (latest first, limited to 50)
router.get('/', async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50
        });
        res.json(notifications);
    } catch (err) {
        console.error('GET /api/notifications error:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET unread count
router.get('/unread-count', async (req, res) => {
    try {
        const count = await prisma.notification.count({
            where: { isRead: false }
        });
        res.json({ count });
    } catch (err) {
        console.error('GET /api/notifications/unread-count error:', err);
        res.status(500).json({ error: err.message });
    }
});

// PUT mark single notification as read
router.put('/:id/read', async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await prisma.notification.update({
            where: { id: parseInt(id) },
            data: { isRead: true }
        });
        res.json(notification);
    } catch (err) {
        console.error('PUT /api/notifications/:id/read error:', err);
        res.status(500).json({ error: err.message });
    }
});

// PUT mark all as read
router.put('/mark-all-read', async (req, res) => {
    try {
        await prisma.notification.updateMany({
            where: { isRead: false },
            data: { isRead: true }
        });
        res.json({ message: 'All notifications marked as read' });
    } catch (err) {
        console.error('PUT /api/notifications/mark-all-read error:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE a notification
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.notification.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Notification deleted' });
    } catch (err) {
        console.error('DELETE /api/notifications/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

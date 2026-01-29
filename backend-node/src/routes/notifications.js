/**
 * Notification Routes
 */

const express = require('express');
const router = express.Router();
const { Notification } = require('../models');

// Get user's notifications
router.get('/', async (req, res) => {
    try {
        const { userId, unreadOnly } = req.query;

        const query = { userId };
        if (unreadOnly === 'true') {
            query.isRead = false;
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create notification (internal API)
router.post('/', async (req, res) => {
    try {
        const { userId, title, message, type, data } = req.body;

        const notification = await Notification.create({
            userId,
            title,
            message,
            type,
            data
        });

        // Send real-time notification via socket
        const io = req.app.get('io');
        io.to(`user:${userId}`).emit('notification:new', notification);

        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark as read
router.patch('/:id/read', async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true, readAt: new Date() },
            { new: true }
        );

        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark all as read
router.patch('/read-all', async (req, res) => {
    try {
        const { userId } = req.body;

        await Notification.updateMany(
            { userId, isRead: false },
            { isRead: true, readAt: new Date() }
        );

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get unread count
router.get('/unread-count', async (req, res) => {
    try {
        const { userId } = req.query;

        const count = await Notification.countDocuments({
            userId,
            isRead: false
        });

        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete notification
router.delete('/:id', async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

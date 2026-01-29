/**
 * Chat Routes
 */

const express = require('express');
const router = express.Router();
const { ChatRoom, Message } = require('../models');
const { v4: uuidv4 } = require('uuid');

// Create or get chat room
router.post('/rooms', async (req, res) => {
    try {
        const { roomType, bookingId, restorationId, studioId, customerId } = req.body;

        // Check if room already exists
        let room = await ChatRoom.findOne({
            roomType,
            ...(bookingId && { bookingId }),
            ...(restorationId && { restorationId }),
            studioId,
            customerId
        });

        if (!room) {
            room = await ChatRoom.create({
                roomType,
                bookingId,
                restorationId,
                studioId,
                customerId,
                participants: [studioId, customerId]
            });
        }

        res.json(room);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's chat rooms
router.get('/rooms', async (req, res) => {
    try {
        const { userId } = req.query;

        const rooms = await ChatRoom.find({
            participants: userId,
            isActive: true
        }).sort({ lastMessageAt: -1 });

        res.json(rooms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get messages for a room
router.get('/rooms/:roomId/messages', async (req, res) => {
    try {
        const { roomId } = req.params;
        const { limit = 50, before } = req.query;

        const query = { roomId };
        if (before) {
            query.createdAt = { $lt: new Date(before) };
        }

        const messages = await Message.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json(messages.reverse());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get unread count
router.get('/unread', async (req, res) => {
    try {
        const { userId } = req.query;

        const count = await Message.countDocuments({
            senderId: { $ne: userId },
            isRead: false
        });

        res.json({ unreadCount: count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

/**
 * MongoDB Models
 */

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Chat Room Schema
const chatRoomSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    roomType: {
        type: String,
        enum: ['booking', 'restoration', 'support'],
        required: true
    },
    bookingId: { type: String },
    restorationId: { type: String },
    participants: [{ type: String }], // User IDs
    studioId: { type: String },
    customerId: { type: String },
    isActive: { type: Boolean, default: true },
    lastMessage: { type: String },
    lastMessageAt: { type: Date }
}, {
    timestamps: true
});

// Message Schema
const messageSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    roomId: { type: String, ref: 'ChatRoom', required: true },
    senderId: { type: String, required: true },
    senderName: { type: String },
    senderType: {
        type: String,
        enum: ['customer', 'studio_owner', 'admin'],
        required: true
    },
    content: { type: String, required: true },
    messageType: {
        type: String,
        enum: ['text', 'image', 'file', 'system'],
        default: 'text'
    },
    attachmentUrl: { type: String },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date }
}, {
    timestamps: true
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    userId: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['booking', 'payment', 'message', 'album', 'restoration', 'general'],
        default: 'general'
    },
    data: { type: mongoose.Schema.Types.Mixed }, // Additional data
    isRead: { type: Boolean, default: false },
    readAt: { type: Date }
}, {
    timestamps: true
});

// Online User Schema (for tracking online status)
const onlineUserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    socketId: { type: String, required: true },
    userType: { type: String },
    connectedAt: { type: Date, default: Date.now },
    lastActiveAt: { type: Date, default: Date.now }
});

// Create models
const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
const Message = mongoose.model('Message', messageSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const OnlineUser = mongoose.model('OnlineUser', onlineUserSchema);

module.exports = {
    ChatRoom,
    Message,
    Notification,
    OnlineUser
};

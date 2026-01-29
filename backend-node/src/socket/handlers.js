/**
 * Socket.io Event Handlers
 */

const { ChatRoom, Message, Notification, OnlineUser } = require('../models');

/**
 * Register all socket event handlers
 */
function registerSocketHandlers(io, socket) {

    // ==================== USER MANAGEMENT ====================

    // User joins (authenticates with socket)
    socket.on('user:join', async (data) => {
        const { userId, userType, userName } = data;

        // Store user in socket
        socket.userId = userId;
        socket.userType = userType;
        socket.userName = userName;

        // Track online status
        await OnlineUser.findOneAndUpdate(
            { userId },
            {
                userId,
                socketId: socket.id,
                userType,
                lastActiveAt: new Date()
            },
            { upsert: true }
        );

        // Join user's personal room for direct notifications
        socket.join(`user:${userId}`);

        console.log(`👤 User ${userName} (${userType}) joined`);

        // Notify about online status
        io.emit('user:online', { userId, userName, userType });
    });

    // ==================== CHAT ====================

    // Join a chat room
    socket.on('chat:join', async (data) => {
        const { roomId } = data;

        socket.join(`room:${roomId}`);
        console.log(`💬 User ${socket.userId} joined room ${roomId}`);

        // Send chat history
        const messages = await Message.find({ roomId })
            .sort({ createdAt: -1 })
            .limit(50);

        socket.emit('chat:history', messages.reverse());
    });

    // Leave chat room
    socket.on('chat:leave', (data) => {
        const { roomId } = data;
        socket.leave(`room:${roomId}`);
        console.log(`💬 User ${socket.userId} left room ${roomId}`);
    });

    // Send message
    socket.on('chat:message', async (data) => {
        const { roomId, content, messageType = 'text', attachmentUrl } = data;

        // Create message
        const message = await Message.create({
            roomId,
            senderId: socket.userId,
            senderName: socket.userName,
            senderType: socket.userType,
            content,
            messageType,
            attachmentUrl
        });

        // Update room's last message
        await ChatRoom.findByIdAndUpdate(roomId, {
            lastMessage: content,
            lastMessageAt: new Date()
        });

        // Broadcast to room
        io.to(`room:${roomId}`).emit('chat:message', message);

        // Send notification to other participants
        const room = await ChatRoom.findById(roomId);
        if (room) {
            room.participants.forEach(participantId => {
                if (participantId !== socket.userId) {
                    io.to(`user:${participantId}`).emit('notification:new', {
                        type: 'message',
                        title: 'New Message',
                        message: `${socket.userName}: ${content.substring(0, 50)}`,
                        data: { roomId }
                    });
                }
            });
        }
    });

    // Typing indicator
    socket.on('chat:typing', (data) => {
        const { roomId, isTyping } = data;
        socket.to(`room:${roomId}`).emit('chat:typing', {
            userId: socket.userId,
            userName: socket.userName,
            isTyping
        });
    });

    // Mark messages as read
    socket.on('chat:read', async (data) => {
        const { roomId } = data;

        await Message.updateMany(
            { roomId, senderId: { $ne: socket.userId }, isRead: false },
            { isRead: true, readAt: new Date() }
        );

        socket.to(`room:${roomId}`).emit('chat:read', { userId: socket.userId });
    });

    // ==================== NOTIFICATIONS ====================

    // Mark notification as read
    socket.on('notification:read', async (data) => {
        const { notificationId } = data;

        await Notification.findByIdAndUpdate(notificationId, {
            isRead: true,
            readAt: new Date()
        });
    });

    // Mark all notifications as read
    socket.on('notification:readAll', async () => {
        await Notification.updateMany(
            { userId: socket.userId, isRead: false },
            { isRead: true, readAt: new Date() }
        );
    });

    // ==================== BOOKING UPDATES ====================

    // Subscribe to booking updates
    socket.on('booking:subscribe', (data) => {
        const { bookingId } = data;
        socket.join(`booking:${bookingId}`);
    });

    // ==================== DISCONNECT ====================

    socket.on('disconnect', async () => {
        if (socket.userId) {
            await OnlineUser.deleteOne({ userId: socket.userId });
            io.emit('user:offline', { userId: socket.userId });
        }
    });
}

module.exports = registerSocketHandlers;

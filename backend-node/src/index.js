/**
 * Studio Real-time Server
 * Node.js + Express + Socket.io + MongoDB
 */

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const chatRoutes = require('./routes/chat');
const notificationRoutes = require('./routes/notifications');

// Import socket handlers
const registerSocketHandlers = require('./socket/handlers');

const app = express();
const server = http.createServer(app);

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8080',
  'http://127.0.0.1:3000',
  /\.onrender\.com$/
];

// Socket.io setup with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// MongoDB Connection with retry logic
const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('❌ MONGODB_URI not set in environment');
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    // Don't crash the server, just log the error
  }
};

connectDB();

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Studio Real-time Server',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Studio Real-time Server is running!' });
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  // Register all socket event handlers
  registerSocketHandlers(io, socket);

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

// Make io accessible to routes
app.set('io', io);

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`🚀 Real-time server running on http://${HOST}:${PORT}`);
  console.log(`📡 Socket.io ready for connections`);
});

module.exports = { app, io };

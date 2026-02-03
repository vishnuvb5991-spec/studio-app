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

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Studio Real-time Server',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
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

// PORT must be parsed as integer and server must start IMMEDIATELY
// This is critical for Render to detect the port binding
const PORT = parseInt(process.env.PORT, 10) || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Real-time server running on port ${PORT}`);
  console.log(`📡 Socket.io ready for connections`);

  // Connect to MongoDB AFTER server is listening
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000
    })
      .then(() => console.log('✅ MongoDB connected'))
      .catch(err => console.error('❌ MongoDB connection error:', err.message));
  } else {
    console.warn('⚠️ MONGODB_URI not set, skipping database connection');
  }
});

module.exports = { app, io };

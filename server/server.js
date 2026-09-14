/**
 * EduHub Prototype - Node.js + Express Backend Server
 * 
 * Includes:
 * - REST API Endpoints for User Auth (JWT), Academic Resources, Project Credits, and Chat
 * - Socket.IO setup for real-time WhatsApp-style group chats, code broadcasting, and reactions
 * - CORS support, Error Handling & Request Logging
 */

require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

// Import Route Handlers
const { router: authRoutes } = require('./routes/auth');
const resourceRoutes = require('./routes/resources');
const creditsRoutes = require('./routes/credits');
const chatRoutes = require('./routes/chat');
const { setupChatSocket } = require('./socket/chatSocket');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/credits', creditsRoutes);
app.use('/api/chat', chatRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'EduHub Backend API & Socket Server',
    version: '1.0.0',
    endpoints: [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/me',
      '/api/resources',
      '/api/credits',
      '/api/chat/groups',
    ],
  });
});

// Create HTTP Server & Initialize Socket.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  pingTimeout: 60000,
});

// Setup Socket.IO Event Handlers for WhatsApp-style Group Chat
setupChatSocket(io);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server (when executed directly: node server.js)
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 EduHub Backend Server running on port ${PORT}`);
    console.log(`📡 Socket.IO Realtime Chat initialized`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
}

module.exports = { app, server, io };

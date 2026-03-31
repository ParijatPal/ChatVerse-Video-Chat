const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS
app.use(cors({
  origin: '*', // Allow all origins (for development)
  credentials: true
}));

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins including file://
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store active rooms and users
const rooms = new Map();

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // Join a room
  socket.on('join-room', (roomId) => {
    console.log(`👤 User ${socket.id} joining room: ${roomId}`);
    
    socket.join(roomId);
    
    // Initialize room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    
    const room = rooms.get(roomId);
    const otherUsers = Array.from(room);
    
    // Add user to room
    room.add(socket.id);
    
    // Notify existing users about the new user
    socket.to(roomId).emit('user-connected', socket.id);
    
    // Send list of existing users to the new user
    socket.emit('existing-users', otherUsers);
    
    console.log(`📊 Room ${roomId} now has ${room.size} users`);
  });

  // Leave a room
  socket.on('leave-room', (roomId) => {
    console.log(`👋 User ${socket.id} leaving room: ${roomId}`);
    
    socket.leave(roomId);
    
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      room.delete(socket.id);
      
      if (room.size === 0) {
        rooms.delete(roomId);
        console.log(`🗑️  Room ${roomId} deleted (empty)`);
      } else {
        console.log(`📊 Room ${roomId} now has ${room.size} users`);
      }
    }
    
    socket.to(roomId).emit('user-disconnected', socket.id);
  });

  // WebRTC signaling: send offer
  socket.on('offer', ({ to, offer }) => {
    console.log(`📤 Sending offer from ${socket.id} to ${to}`);
    io.to(to).emit('offer', {
      from: socket.id,
      offer
    });
  });

  // WebRTC signaling: send answer
  socket.on('answer', ({ to, answer }) => {
    console.log(`📤 Sending answer from ${socket.id} to ${to}`);
    io.to(to).emit('answer', {
      from: socket.id,
      answer
    });
  });

  // WebRTC signaling: send ICE candidate
  socket.on('ice-candidate', ({ to, candidate }) => {
    console.log(`🧊 Sending ICE candidate from ${socket.id} to ${to}`);
    io.to(to).emit('ice-candidate', {
      from: socket.id,
      candidate
    });
  });

  // Chat messages
  socket.on('send-message', ({ roomId, message }) => {
    console.log(`💬 Message in room ${roomId} from ${socket.id}: ${message}`);
    
    io.to(roomId).emit('receive-message', {
      from: socket.id,
      message,
      timestamp: new Date().toISOString()
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
    
    // Remove user from all rooms
    rooms.forEach((users, roomId) => {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        socket.to(roomId).emit('user-disconnected', socket.id);
        
        if (users.size === 0) {
          rooms.delete(roomId);
          console.log(`🗑️  Room ${roomId} deleted (empty)`);
        }
      }
    });
  });

  // Error handling
  socket.on('error', (error) => {
    console.error(`⚠️  Socket error for ${socket.id}:`, error);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    rooms: rooms.size,
    connections: io.sockets.sockets.size
  });
});

// Server info endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Video Chat Socket.io Server',
    version: '1.0.0',
    activeRooms: rooms.size,
    activeConnections: io.sockets.sockets.size
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`\n🚀 Socket.io server running on port ${PORT}`);
  console.log(`📡 Ready to accept connections from clients`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
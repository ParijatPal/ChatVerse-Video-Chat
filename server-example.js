// Backend Example - Node.js with Express and Socket.IO
// Install dependencies: npm install express socket.io cors

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // In production, specify your frontend domain
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Store active rooms and users
const rooms = new Map();

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  // User joins a room
  socket.on("join-room", (data) => {
    const { roomId, userName } = data;
    console.log(`${userName} joining room ${roomId}`);

    // Leave previous room if any
    socket.leaveAll();

    // Join new room
    socket.join(roomId);

    // Store user info
    if (!rooms.has(roomId)) {
      rooms.set(roomId, []);
    }
    const room = rooms.get(roomId);
    room.push({
      id: socket.id,
      userName,
      socketId: socket.id,
    });

    // Notify new user of existing users in room
    socket.emit("room-users", room.filter((user) => user.id !== socket.id));

    // Notify others that new user joined
    socket.to(roomId).emit("user-joined", {
      id: socket.id,
      userName,
    });

    // Log room state
    console.log(`Room ${roomId} now has ${room.length} users`);
  });

  // Chat message
  socket.on("send-message", (data) => {
    const { roomId, message, senderName } = data;
    io.to(roomId).emit("receive-message", {
      message,
      senderName,
      timestamp: new Date(),
    });
  });

  // Offer (WebRTC)
  socket.on("send-offer", (data) => {
    const { roomId, offer, targetUserId } = data;
    io.to(targetUserId).emit("receive-offer", {
      offer,
      senderId: socket.id,
      roomId,
    });
  });

  // Answer (WebRTC)
  socket.on("send-answer", (data) => {
    const { answer, targetUserId } = data;
    io.to(targetUserId).emit("receive-answer", {
      answer,
      senderId: socket.id,
    });
  });

  // ICE Candidate
  socket.on("send-ice-candidate", (data) => {
    const { roomId, candidate, targetUserId } = data;
    io.to(targetUserId).emit("receive-ice-candidate", {
      candidate,
      senderId: socket.id,
    });
  });

  // User leaves room
  socket.on("leave-room", (data) => {
    const { roomId } = data;
    socket.leave(roomId);

    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      const userIndex = room.findIndex((user) => user.id === socket.id);
      if (userIndex > -1) {
        const userName = room[userIndex].userName;
        room.splice(userIndex, 1);

        if (room.length === 0) {
          rooms.delete(roomId);
          console.log(`Room ${roomId} deleted`);
        } else {
          io.to(roomId).emit("user-left", socket.id);
          console.log(`${userName} left room ${roomId}`);
        }
      }
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Remove user from all rooms
    rooms.forEach((room, roomId) => {
      const userIndex = room.findIndex((user) => user.id === socket.id);
      if (userIndex > -1) {
        const userName = room[userIndex].userName;
        room.splice(userIndex, 1);

        if (room.length === 0) {
          rooms.delete(roomId);
        } else {
          io.to(roomId).emit("user-left", socket.id);
          console.log(`${userName} disconnected from room ${roomId}`);
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

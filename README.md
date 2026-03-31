

# Welcome to Chatverse Video Calling Platform

Real-time peer-to-peer video chat built with React, TypeScript, Socket.IO, and WebRTC.

---

## Overview

A **video chat application** for multi-user virtual rooms with video, audio, and text chat capabilities.

**Key Features:**
-  Real-time video/audio communication
-  Multiple users per room
-  Text chat
-  Camera/microphone controls
-  Peer-to-peer connections (low latency)

---

## 🔧 How It Works

### Architecture

```
User A Browser          Socket.IO Server          User B Browser
      |                        |                         |
      |---- join-room ------→  |  ←----- join-room ------|
      |                        |                         |
      |---- offer ----------→  |  ------- offer ------→  |
      |  ←----- answer --------|  ←------ answer --------|
      |                        |                         |
      |←------- Direct WebRTC P2P Connection ----------→ |
      |                                                   |
      |←============ Video/Audio Streams ==============→ |
```

### Key Components

**Socket.IO** - Room management & signaling (who joins/leaves, offer/answer exchange)  
**WebRTC** - Direct peer-to-peer video/audio streaming  
**STUN Servers** - NAT traversal for direct connections

### Flow

1. User joins room → Socket.IO notifies others
2. WebRTC offer/answer exchange via Socket.IO
3. ICE candidates exchanged to find best network path
4. Direct P2P connection established
5. Video/audio streams directly between users

---

##  Tech Stack

**Frontend:** React 18, TypeScript, Vite, Socket.IO Client, WebRTC API, shadcn/ui, Tailwind CSS  
**Backend:** Node.js, Express.js, Socket.IO Server  
**Protocols:** WebRTC, WebSocket

---

##  Project Structure

```
chatvdo-main-test/
├── server/
│   ├── server.js              # Socket.IO server & Express
│   └── package.json
├── src/
│   ├── components/            # UI components
│   ├── context/               # SocketContext
│   ├── hooks/                 # useMediaStream
│   ├── pages/
│   │   └── Room.tsx           # Main room (WebRTC logic)
│   ├── App.tsx
│   └── main.tsx
├── .env                       # VITE_SOCKET_SERVER_URL
└── package.json
```

---

##  Setup

### Prerequisites
- Node.js v16+
- Modern browser with camera/microphone

### Installation

```bash
# 1. Install dependencies
npm install
cd server && npm install && cd ..

# 2. Create .env file
echo "VITE_SOCKET_SERVER_URL=http://localhost:3001" > .env

# 3. Start backend (Terminal 1)
cd server
npm run dev

# 4. Start frontend (Terminal 2)
npm run dev
```

### Expected Output

**Terminal 1 (Backend):**
```
 Server running on port 3001
 Socket.IO ready
```

**Terminal 2 (Frontend):**
```
➜  Local:   http://localhost:8080/
➜  Network: http://192.168.x.x:8080/
```

---

## Usage

### Join a Room
```
http://localhost:8080/room/YOUR_ROOM_NAME
```

Allow camera/microphone when prompted.

### Share with Others
Same computer:
```
http://localhost:8080/room/YOUR_ROOM_NAME
```

Same WiFi network:
```
http://YOUR_IP_ADDRESS:8080/room/YOUR_ROOM_NAME
```

### Controls
-  **Mute/Unmute** microphone
-  **Toggle** camera
-  **Show/Hide** chat
-  **Leave** room

---

## Testing

### Multiple Browsers (Same Computer)

**Browser 1 (Chrome):**
```
http://localhost:8080/room/test123
```

**Browser 2 (Firefox):**
```
http://localhost:8080/room/test123?skipCamera=true
```

*Note: Only one browser can use camera. Use `?skipCamera=true` for additional browsers.*

### Multiple Devices (Recommended)

**Your Computer:**
```
http://localhost:8080/room/test123
```

**Your Phone (same WiFi):**
```
http://YOUR_IP_ADDRESS:8080/room/test123
```

*Find IP: Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux), or check Vite's Network URL*

---

## Troubleshooting

### Backend Won't Start
```bash
# Ensure package.json has:
{
  "scripts": { "dev": "node server.js" }
}
```

### Frontend Can't Connect
1. Check backend is running (port 3001)
2. Verify `.env`: `VITE_SOCKET_SERVER_URL=http://localhost:3001`
3. Restart frontend after changing `.env`

### Camera Not Working
- **Cause:** Already in use by another app/tab
- **Solution:** Close other apps or use `?skipCamera=true`

### No Video Appearing
Check console (F12) for:
-  `Socket connected`
-  `Creating peer connection`
-  `Connection state: connected`

If errors:
- `ICE failed` → Firewall blocking
- `No remote track` → Other user has no camera

### Firewall Issues (Windows)
1. Windows Defender Firewall → Allow an app
2. Add `node.exe` (Private & Public networks)

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

---

## Socket.IO Events

### Client → Server
- `join-room` - Join room
- `leave-room` - Leave room
- `offer` - Send WebRTC offer
- `answer` - Send WebRTC answer
- `ice-candidate` - Send ICE candidate

### Server → Client
- `user-connected` - New user joined
- `user-disconnected` - User left
- `existing-users` - Users already in room
- `offer` - Received offer
- `answer` - Received answer
- `ice-candidate` - Received ICE candidate

---

## Security Notes

**Current (Development):**
-  No authentication
-  HTTP only
-  No room passwords

**Production Recommendations:**
-  Use HTTPS/WSS
-  Add authentication
-  Implement room access control
-  Use TURN servers for NAT traversal

---

##  Resources

- [WebRTC API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [Socket.IO Docs](https://socket.io/docs/v4/)
- [WebRTC for the Curious](https://webrtcforthecurious.com/)

---

**Happy Video Chatting!**



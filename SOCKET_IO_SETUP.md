# Socket.IO Implementation Guide

This guide explains how to use Socket.IO in your chatvdo application for real-time communication.

## Installation

Socket.IO client is already installed. You can verify with:
```bash
npm list socket.io-client
```

## Architecture Overview

### Files Created/Modified:

1. **`src/hooks/useSocket.ts`** - Custom hook for Socket.IO connection
2. **`src/context/SocketContext.tsx`** - React Context for global Socket.IO access
3. **`src/App.tsx`** - Updated with SocketProvider wrapper
4. **`src/pages/Room.tsx`** - Updated to use Socket.IO for room management
5. **`server-example.js`** - Backend example implementation

## How to Use

### 1. Basic Setup

The Socket.IO provider is already wrapped around your app. You can access it anywhere using:

```typescript
import { useSocketContext } from "@/context/SocketContext";

const MyComponent = () => {
  const { emit, on, socket } = useSocketContext();
  
  // Use these in your component
};
```

### 2. Key Methods

#### `emit(event, data?, callback?)`
Send an event to the server:
```typescript
emit("join-room", { roomId: "123", userName: "John" });
```

#### `on(event, handler)`
Listen for events from the server:
```typescript
const unsubscribe = on("user-joined", (user) => {
  console.log("User joined:", user);
});

// Later, unsubscribe if needed:
unsubscribe();
```

#### `once(event, handler)`
Listen for event once:
```typescript
once("initial-data", (data) => {
  console.log("Received initial data:", data);
});
```

### 3. Backend Setup

You need a Node.js backend server. Use the provided `server-example.js`:

#### Step 1: Create a backend directory
```bash
mkdir backend
cd backend
npm init -y
npm install express socket.io cors
```

#### Step 2: Copy the server code
Copy the code from `server-example.js` into your backend `index.js`

#### Step 3: Run the server
```bash
node index.js
```

The server will start on `http://localhost:3001`

### 4. Configuration

You can set the Socket.IO server URL in multiple ways:

#### Option A: Environment Variable (Recommended)
Create `.env` file in your project root:
```
VITE_SOCKET_URL=http://localhost:3001
```

Or in production:
```
VITE_SOCKET_URL=https://your-api.com
```

#### Option B: Direct in SocketProvider
In `src/App.tsx`:
```tsx
<SocketProvider socketUrl="http://localhost:3001">
  {/* rest of app */}
</SocketProvider>
```

### 5. Socket Events Reference

#### Client → Server Events:

- **`join-room`** - User joins a room
  ```typescript
  emit("join-room", { roomId, userName })
  ```

- **`leave-room`** - User leaves a room
  ```typescript
  emit("leave-room", { roomId })
  ```

- **`send-message`** - Send chat message
  ```typescript
  emit("send-message", { roomId, message, senderName })
  ```

- **`send-offer`** - WebRTC offer (for video/audio)
  ```typescript
  emit("send-offer", { roomId, offer, targetUserId })
  ```

- **`send-answer`** - WebRTC answer
  ```typescript
  emit("send-answer", { answer, targetUserId })
  ```

- **`send-ice-candidate`** - ICE candidate for WebRTC
  ```typescript
  emit("send-ice-candidate", { roomId, candidate, targetUserId })
  ```

#### Server → Client Events:

- **`room-users`** - Initial list of users in room
  ```typescript
  on("room-users", (users) => { /* handle */ })
  ```

- **`user-joined`** - New user joined room
  ```typescript
  on("user-joined", (user) => { /* handle */ })
  ```

- **`user-left`** - User left room
  ```typescript
  on("user-left", (userId) => { /* handle */ })
  ```

- **`receive-message`** - New message received
  ```typescript
  on("receive-message", (data) => { /* handle */ })
  ```

- **`receive-offer`** - WebRTC offer received
  ```typescript
  on("receive-offer", (data) => { /* handle */ })
  ```

- **`receive-answer`** - WebRTC answer received
  ```typescript
  on("receive-answer", (data) => { /* handle */ })
  ```

- **`receive-ice-candidate`** - ICE candidate received
  ```typescript
  on("receive-ice-candidate", (data) => { /* handle */ })
  ```

## Example Usage in Components

### Chat Component Example:
```typescript
import { useSocketContext } from "@/context/SocketContext";
import { useState } from "react";

const ChatComponent = ({ roomId }: { roomId: string }) => {
  const { emit, on } = useSocketContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Listen for incoming messages
  on("receive-message", (data) => {
    setMessages((prev) => [...prev, data]);
  });

  const sendMessage = () => {
    emit("send-message", {
      roomId,
      message: input,
      senderName: "User",
    });
    setInput("");
  };

  return (
    <div>
      <div>
        {messages.map((msg, i) => (
          <div key={i}>{msg.senderName}: {msg.message}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
      />
    </div>
  );
};
```

### Video Call Example:
```typescript
import { useSocketContext } from "@/context/SocketContext";

const VideoCallComponent = ({ roomId }: { roomId: string }) => {
  const { emit, on } = useSocketContext();

  // Send offer for video call
  const initiateCall = async (remoteUserId: string) => {
    const offer = await createWebRTCOffer();
    emit("send-offer", {
      roomId,
      offer,
      targetUserId: remoteUserId,
    });
  };

  // Listen for incoming offer
  on("receive-offer", async (data) => {
    const answer = await createWebRTCAnswer(data.offer);
    emit("send-answer", {
      answer,
      targetUserId: data.senderId,
    });
  });

  return (
    <button onClick={() => initiateCall("user-id")}>
      Start Call
    </button>
  );
};
```

## Production Deployment

### Server Deployment (Heroku Example):
```bash
cd backend
git init
git add .
git commit -m "Initial commit"
heroku create your-app-name
git push heroku main
```

### Frontend Deployment:
1. Update `.env` with production Socket.IO URL
2. Build the app:
   ```bash
   npm run build
   ```
3. Deploy to your hosting service (Vercel, Netlify, etc.)

## Common Issues & Solutions

### Issue: Connection Refused
**Solution:** Make sure backend server is running on port 3001

### Issue: CORS Error
**Solution:** Check backend CORS configuration:
```javascript
const io = socketIo(server, {
  cors: {
    origin: "your-frontend-domain",
    methods: ["GET", "POST"],
  },
});
```

### Issue: Socket not connected
**Solution:** Verify the socket URL matches your backend:
```typescript
console.log(socket.connected); // Should be true
```

### Issue: Events not being received
**Solution:** Make sure you're listening before emitting:
```typescript
on("event-name", handler); // Set up listener FIRST
emit("join-room", data);    // Then emit
```

## Debugging

Enable Socket.IO debugging in browser console:
```typescript
localStorage.debug = "socket.io-client:*";
```

Check server logs:
```bash
# In backend terminal
node index.js
# You'll see connection logs
```

## Next Steps

1. Implement WebRTC for actual video/audio streaming
2. Add authentication/authorization
3. Implement message persistence
4. Add room configuration options
5. Implement user presence features

## Additional Resources

- [Socket.IO Documentation](https://socket.io/docs/)
- [Socket.IO Client API](https://socket.io/docs/client-api/)
- [Express.js Documentation](https://expressjs.com/)
- [WebRTC Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)

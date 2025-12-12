# Socket.IO Quick Reference Card

## 🚀 Installation & Setup

### Install Socket.IO Client
```bash
npm install socket.io-client
```

### Wrap App with Provider
```tsx
import { SocketProvider } from "@/context/SocketContext";

<SocketProvider socketUrl="http://localhost:3001">
  <YourApp />
</SocketProvider>
```

---

## 💻 Usage in Components

### Import the Hook
```typescript
import { useSocketContext } from "@/context/SocketContext";
```

### Basic Template
```typescript
import { useSocketContext } from "@/context/SocketContext";
import { useEffect } from "react";

const MyComponent = () => {
  const { emit, on, once } = useSocketContext();

  useEffect(() => {
    // Set up listeners
    const unsub = on("event-name", (data) => {
      console.log("Received:", data);
    });

    // Cleanup
    return unsub;
  }, [on]);

  const sendData = () => {
    emit("send-event", { message: "Hello" });
  };

  return <button onClick={sendData}>Send</button>;
};
```

---

## 📤 Emit Events (Client → Server)

### Join a Room
```typescript
emit("join-room", {
  roomId: "room-123",
  userName: "John Doe"
});
```

### Leave a Room
```typescript
emit("leave-room", {
  roomId: "room-123"
});
```

### Send Message
```typescript
emit("send-message", {
  roomId: "room-123",
  message: "Hello everyone!",
  senderName: "John"
});
```

### Send WebRTC Offer
```typescript
emit("send-offer", {
  roomId: "room-123",
  offer: rtcOffer,
  targetUserId: "socket-id-123"
});
```

### Send WebRTC Answer
```typescript
emit("send-answer", {
  answer: rtcAnswer,
  targetUserId: "socket-id-123"
});
```

### Send ICE Candidate
```typescript
emit("send-ice-candidate", {
  roomId: "room-123",
  candidate: iceCandidate,
  targetUserId: "socket-id-123"
});
```

---

## 📥 Listen to Events (Server → Client)

### On Room Users
```typescript
on("room-users", (users) => {
  console.log("Users in room:", users);
  // users: [{ id, userName }, ...]
});
```

### On User Joined
```typescript
on("user-joined", (user) => {
  console.log("User joined:", user);
  // user: { id, userName }
});
```

### On User Left
```typescript
on("user-left", (userId) => {
  console.log("User left:", userId);
});
```

### On Message Received
```typescript
on("receive-message", (data) => {
  console.log("Message:", data.message);
  console.log("From:", data.senderName);
  // data: { message, senderName, timestamp }
});
```

### On WebRTC Offer
```typescript
on("receive-offer", (data) => {
  console.log("Offer from:", data.senderId);
  const offer = data.offer;
  // Process WebRTC offer
});
```

### On WebRTC Answer
```typescript
on("receive-answer", (data) => {
  console.log("Answer from:", data.senderId);
  const answer = data.answer;
  // Process WebRTC answer
});
```

### On ICE Candidate
```typescript
on("receive-ice-candidate", (data) => {
  console.log("ICE candidate from:", data.senderId);
  const candidate = data.candidate;
  // Add ICE candidate
});
```

---

## 🔌 Socket Connection Info

### Check Connection Status
```typescript
const { socket } = useSocketContext();
console.log(socket?.connected); // true/false
console.log(socket?.id);         // socket ID
console.log(socket?.disconnected); // true/false
```

### Get Socket Instance
```typescript
const { socket } = useSocketContext();
// Now you can use socket directly if needed
```

---

## ⚙️ Configuration

### Via Environment Variable
Create `.env`:
```
VITE_SOCKET_URL=http://localhost:3001
```

Or in production:
```
VITE_SOCKET_URL=https://api.example.com
```

### Via Direct Props
```tsx
<SocketProvider socketUrl="https://api.example.com">
  <App />
</SocketProvider>
```

---

## 🧹 Cleanup Pattern

**IMPORTANT:** Always unsubscribe from events to prevent memory leaks:

```typescript
useEffect(() => {
  // Subscribe
  const unsubscribe = on("event-name", handler);
  
  // Cleanup
  return unsubscribe; // ← Call unsubscribe in return
}, [on]);
```

### Or use multiple listeners:
```typescript
useEffect(() => {
  const unsub1 = on("event1", handler1);
  const unsub2 = on("event2", handler2);
  
  return () => {
    unsub1();
    unsub2();
  };
}, [on]);
```

---

## 🎯 Complete Example: Chat Component

```typescript
import { useSocketContext } from "@/context/SocketContext";
import { useEffect, useState } from "react";

const Chat = ({ roomId }: { roomId: string }) => {
  const { emit, on } = useSocketContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Listen for new messages
  useEffect(() => {
    const unsubscribe = on("receive-message", (data) => {
      setMessages(prev => [...prev, {
        text: data.message,
        sender: data.senderName,
        time: new Date(data.timestamp)
      }]);
    });

    return unsubscribe;
  }, [on]);

  // Send message
  const handleSend = () => {
    if (!input.trim()) return;
    
    emit("send-message", {
      roomId,
      message: input,
      senderName: "You"
    });

    setInput("");
  };

  return (
    <div>
      <div>
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input 
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyPress={e => e.key === "Enter" && handleSend()}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};
```

---

## 🐛 Debugging

### Enable Debug Logs
```javascript
// In browser console:
localStorage.debug = "socket.io-client:*";
```

### Check Connection
```javascript
// In browser console:
const socket = document.querySelector('body').__react_internal_fiber__.memoizedState.memoizedState[0].memoizedState.socket;
console.log(socket?.connected);
```

### Log All Events
```typescript
const { on } = useSocketContext();

['room-users', 'user-joined', 'user-left', 'receive-message'].forEach(event => {
  on(event, (data) => {
    console.log(`[${event}]:`, data);
  });
});
```

---

## 🔒 Security Tips

✅ **Always validate data on server**
✅ **Use HTTPS/WSS in production**
✅ **Add authentication before room join**
✅ **Implement rate limiting**
✅ **Sanitize messages before displaying**
✅ **Use CORS properly**

---

## 📚 Related Files

- **Hook:** `src/hooks/useSocket.ts`
- **Context:** `src/context/SocketContext.tsx`
- **Setup Guide:** `SOCKET_IO_SETUP.md`
- **Quick Start:** `SOCKET_IO_QUICK_START.md`
- **Architecture:** `SOCKET_IO_ARCHITECTURE.md`
- **Backend Example:** `server-example.js`

---

## 🎓 Common Patterns

### Pattern 1: Join Room on Mount
```typescript
useEffect(() => {
  emit("join-room", { roomId, userName: "User-123" });
}, [roomId, emit]);
```

### Pattern 2: Listen and Update State
```typescript
useEffect(() => {
  const unsub = on("room-users", setRemoteUsers);
  return unsub;
}, [on]);
```

### Pattern 3: Send on Button Click
```typescript
const handleClick = () => {
  emit("send-message", { roomId, message: input, senderName: "Me" });
};
```

### Pattern 4: Conditional Emit
```typescript
const sendIfConnected = (event, data) => {
  if (socket?.connected) {
    emit(event, data);
  } else {
    console.error("Socket not connected");
  }
};
```

---

## ❌ Common Mistakes

❌ **Not unsubscribing from events** → Memory leaks  
❌ **Emitting before server is ready** → Data loss  
❌ **Not handling errors** → Silent failures  
❌ **Using wrong event names** → Events not received  
❌ **Forgetting Socket.IO URL** → Can't connect  

---

**Quick Help:** For detailed examples, check `SOCKET_IO_QUICK_START.md`

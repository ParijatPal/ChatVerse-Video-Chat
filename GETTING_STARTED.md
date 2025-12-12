# 🚀 Socket.IO Getting Started Guide

## Welcome! 👋

Socket.IO has been successfully integrated into your chatvdo project. This guide will help you get started in less than 5 minutes.

---

## ⚡ Quick Start (5 Minutes)

### Step 1️⃣: Start Your Backend Server

```bash
# Open a NEW terminal/command prompt

# Create backend folder (if you don't have one)
mkdir chatvdo-backend
cd chatvdo-backend

# Initialize project
npm init -y

# Install dependencies
npm install express socket.io cors

# Create index.js file and copy code from server-example.js
# (in your main project root)

# Run the server
node index.js
```

**Expected Output:**
```
Server running on port 3001
```

✅ **Server is now running!**

---

### Step 2️⃣: Start Your Frontend

```bash
# In your project folder (different terminal)
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in ... ms

  ➜  Local:   http://localhost:8080/
```

✅ **Frontend is now running!**

---

### Step 3️⃣: Test Socket.IO

1. **Open Browser:** http://localhost:8080
2. **Navigate to a room:** Click on a room link or go to http://localhost:8080/room/test-room
3. **Open in another tab:** Open same URL in a new browser tab
4. **See real-time updates:**
   - Both tabs show each other as users in the room
   - Try sending chat messages
   - Messages appear instantly in both tabs

✅ **Socket.IO is working!**

---

## 📚 Documentation Files

Read these in order:

### 1️⃣ **First:** `SOCKET_IO_QUICK_START.md`
- Quick features overview
- How to use in components
- Key events reference

### 2️⃣ **Second:** `SOCKET_IO_REFERENCE.md`
- Copy-paste code examples
- All available methods
- Complete patterns

### 3️⃣ **Third:** `SOCKET_IO_SETUP.md`
- Detailed setup instructions
- Backend deployment
- Troubleshooting

### 4️⃣ **Deep Dive:** `SOCKET_IO_ARCHITECTURE.md`
- How everything works together
- Visual diagrams
- Data flow

---

## 💻 How to Use Socket.IO in Your Code

### Simple Example: Chat Component

```typescript
import { useSocketContext } from "@/context/SocketContext";
import { useEffect, useState } from "react";

const ChatComponent = ({ roomId }: { roomId: string }) => {
  const { emit, on } = useSocketContext();
  const [messages, setMessages] = useState<string[]>([]);

  // Listen for incoming messages
  useEffect(() => {
    const unsubscribe = on("receive-message", (data) => {
      setMessages(prev => [...prev, `${data.senderName}: ${data.message}`]);
    });
    return unsubscribe;
  }, [on]);

  // Send a message
  const sendMessage = (text: string) => {
    emit("send-message", {
      roomId,
      message: text,
      senderName: "You"
    });
  };

  return (
    <div>
      {messages.map((msg, i) => <div key={i}>{msg}</div>)}
      <button onClick={() => sendMessage("Hello!")}>Send</button>
    </div>
  );
};
```

---

## 🔌 Key Socket Events

### What You Can Send (emit)

```typescript
const { emit } = useSocketContext();

// Join a room
emit("join-room", { roomId: "123", userName: "John" });

// Send a message
emit("send-message", { roomId: "123", message: "Hi!", senderName: "John" });

// Leave room
emit("leave-room", { roomId: "123" });
```

### What You Can Receive (on)

```typescript
const { on } = useSocketContext();

// Users in room
on("room-users", (users) => {
  console.log("Users:", users);
});

// New user joined
on("user-joined", (user) => {
  console.log("User joined:", user.userName);
});

// New message
on("receive-message", (data) => {
  console.log(`${data.senderName}: ${data.message}`);
});
```

---

## ⚙️ Configuration

### Change Server URL

**For Development:**
Default is `http://localhost:3001` ✅

**For Production:**
Create `.env` file in project root:
```
VITE_SOCKET_URL=https://your-backend.com
```

---

## 🎯 What's Already Implemented

✅ **Real-time Messaging** - Messages sent instantly to all users  
✅ **Room Management** - Users can join and leave rooms  
✅ **User Tracking** - See who's in the room  
✅ **Automatic Reconnection** - Handles connection drops  
✅ **Clean React Integration** - Easy-to-use hooks

---

## 📁 File Changes Summary

### New Files Created:
- `src/hooks/useSocket.ts` - Socket connection hook
- `src/context/SocketContext.tsx` - Global Socket context
- `server-example.js` - Backend reference
- `SOCKET_IO_*.md` - Documentation files

### Files Updated:
- `src/App.tsx` - Added SocketProvider
- `src/pages/Room.tsx` - Added Socket events
- `src/components/ChatPanel.tsx` - Added Socket messaging

---

## 🐛 Common Issues & Solutions

### ❌ "Cannot connect to server"
**Solution:** Make sure backend is running on port 3001

### ❌ "Events not received"
**Solution:** Make sure you're listening BEFORE emitting
```typescript
// ✅ Correct
useEffect(() => {
  on("event-name", handler); // Set up listener first
}, [on]);
emit("event-name", data);    // Then emit

// ❌ Wrong
emit("event-name", data);    // Emitting before listener ready
on("event-name", handler);
```

### ❌ "CORS Error"
**Solution:** This is normal in development. Backend already handles it.

---

## 📞 Need Help?

| Question | Answer |
|----------|--------|
| How do I use it in a component? | Read `SOCKET_IO_REFERENCE.md` |
| What events are available? | Check `SOCKET_IO_SETUP.md` Events section |
| How does it work? | See `SOCKET_IO_ARCHITECTURE.md` |
| What's wrong? | Check `SOCKET_IO_SETUP.md` Troubleshooting |
| How do I deploy? | See `SOCKET_IO_SETUP.md` Production section |

---

## 🎓 Learning Path

```
Start Here
    ↓
Read: SOCKET_IO_QUICK_START.md
    ↓
Set up backend (copy server-example.js)
    ↓
Test with browser (open in 2 tabs)
    ↓
Read: SOCKET_IO_REFERENCE.md
    ↓
Use in your components
    ↓
Read: SOCKET_IO_ARCHITECTURE.md (optional)
    ↓
Deploy to production!
```

---

## ✨ Next Steps

### Immediate (Do This First)
1. Start backend server (Step 1 above)
2. Start frontend (Step 2 above)
3. Test in browser (Step 3 above)

### Short Term (Next Hour)
1. Read `SOCKET_IO_QUICK_START.md`
2. Try sending messages between tabs
3. Check console for Socket.IO logs

### Medium Term (Next Day)
1. Read `SOCKET_IO_REFERENCE.md`
2. Implement custom events
3. Add more Socket.IO features

### Long Term (Next Week)
1. Read `SOCKET_IO_SETUP.md`
2. Deploy backend to production
3. Update `.env` with production URL

---

## 📊 Project Structure

```
chatvdo/ (Your Frontend)
├── src/
│   ├── hooks/
│   │   └── useSocket.ts ← NEW
│   ├── context/
│   │   └── SocketContext.tsx ← NEW
│   ├── components/
│   │   └── ChatPanel.tsx ← UPDATED
│   └── pages/
│       └── Room.tsx ← UPDATED
└── App.tsx ← UPDATED

chatvdo-backend/ (Backend - Create This)
├── index.js (Copy from server-example.js)
├── package.json
└── node_modules/
```

---

## 🔐 Security Notes

For production, make sure to:
- ✅ Add authentication
- ✅ Validate all messages on server
- ✅ Use HTTPS/WSS (not HTTP/WS)
- ✅ Set proper CORS origins
- ✅ Implement rate limiting

See `SOCKET_IO_SETUP.md` for full security checklist.

---

## 🎉 You're Ready!

Everything is set up. Just follow the Quick Start steps above and you'll have real-time communication working in minutes!

### Key Files to Remember:
- `SOCKET_IO_QUICK_START.md` - Quick overview
- `SOCKET_IO_REFERENCE.md` - Code examples
- `SOCKET_IO_SETUP.md` - Detailed guide
- `server-example.js` - Backend code

---

## 💡 Pro Tips

1. **Use environment variables** for server URL
2. **Always unsubscribe** from events (return from useEffect)
3. **Check socket.connected** before emitting
4. **Enable debug logs** in browser: `localStorage.debug = "socket.io-client:*"`
5. **Keep event names consistent** between client and server

---

## 🚀 Ready? Let's Go!

**Start Now:**
1. Open terminal
2. Run backend: `node index.js`
3. Open second terminal
4. Run frontend: `npm run dev`
5. Open browser to http://localhost:8080
6. Create/join a room
7. Open same room in another tab
8. Watch real-time updates! ✨

**Questions?** Check the documentation files or `SOCKET_IO_SETUP.md`

Happy coding! 🎉

# 🎯 ChatVDO - Quick Reference Guide

## File-by-File Breakdown

### 📄 **Core Files**

| File | Size | Purpose | Key Responsibility |
|------|------|---------|-------------------|
| `main.tsx` | ~5 lines | Entry point | Render React app to DOM |
| `App.tsx` | ~45 lines | Root component | Wrap app with providers, setup routes |
| `index.css` | — | Global styles | Base styling |

### 🎣 **Hooks** (`src/hooks/`)

| File | Size | Purpose | Returns |
|------|------|---------|---------|
| `useSocket.ts` | ~70 lines | Socket.IO management | `{ emit, on, once, socket }` |
| `useMediaStream.ts` | ~60 lines | Media capture | `{ stream, isVideoEnabled, isAudioEnabled, toggleVideo, toggleAudio, error }` |
| `use-toast.ts` | — | Toast notifications | `{ toast }` |

### 🗂️ **Context** (`src/context/`)

| File | Size | Purpose | Exports |
|------|------|---------|---------|
| `SocketContext.tsx` | ~40 lines | Global Socket state | `SocketProvider`, `useSocketContext()` |

### 📄 **Pages** (`src/pages/`)

| File | Size | Purpose | Route |
|------|------|---------|-------|
| `Index.tsx` | ~120 lines | Landing page | `/` |
| `Room.tsx` | ~130 lines | Video chat room | `/room/:roomId` |
| `VideoInfo.tsx` | — | Info page | `/video-info` |
| `ChatInfo.tsx` | — | Info page | `/chat-info` |
| `SecurityInfo.tsx` | — | Info page | `/security-info` |
| `NotFound.tsx` | — | 404 page | `*` |

### 🎨 **Components** (`src/components/`)

| File | Size | Purpose | Props |
|------|------|---------|-------|
| `VideoDisplay.tsx` | ~40 lines | Video player | `userName`, `isLocal`, `isMuted`, `isVideoOff`, `videoRef` |
| `ChatPanel.tsx` | ~120 lines | Chat interface | `roomId` |
| `CallControls.tsx` | ~50 lines | Control buttons | `isMuted`, `isVideoOff`, `isChatOpen`, callbacks |
| `NavLink.tsx` | — | Navigation | — |

### 📦 **UI Components** (`src/components/ui/`)

Pre-built Radix UI components (30+ files):
- `button.tsx` - Button with variants
- `input.tsx` - Text input
- `card.tsx` - Card container
- `scroll-area.tsx` - Scrollable container
- And many more...

### 🛠️ **Utilities** (`src/lib/`)

| File | Purpose |
|------|---------|
| `utils.ts` | Class name utilities (cn function) |

---

## Component Relationship Map

```
App.tsx
  ├── QueryClientProvider
  ├── SocketProvider
  │   └── useSocket hook
  ├── TooltipProvider
  ├── BrowserRouter
  │   └── Routes
  │       ├── Index (home page)
  │       │   └── Features section
  │       ├── Room (main app)
  │       │   ├── VideoDisplay (your video)
  │       │   ├── VideoDisplay (others' videos)
  │       │   ├── ChatPanel
  │       │   │   ├── Messages list
  │       │   │   └── Input area
  │       │   └── CallControls
  │       │       ├── Mute button
  │       │       ├── Video toggle
  │       │       ├── Chat toggle
  │       │       └── Leave button
  │       ├── VideoInfo
  │       ├── ChatInfo
  │       ├── SecurityInfo
  │       └── NotFound
  ├── Toaster (notifications)
  └── Sonner (toast notifications)
```

---

## State Management Map

```
Global Context State:
├── SocketContext
│   ├── socket (Socket.IO instance)
│   ├── emit (send events)
│   ├── on (listen to events)
│   └── once (listen once)

Local Component State:

Room.tsx:
├── remoteUsers (remote user list)
├── isChatOpen (chat visibility)
└── localVideoRef (video element ref)

ChatPanel.tsx:
├── messages (chat messages array)
└── inputValue (current input text)

Index.tsx:
└── roomId (input room code)
```

---

## Data Flow Examples

### **Example 1: User Joins Room**

```
User navigates to /room/abc123
    ↓
Room component mounts
    ↓
emit("join-room", { roomId: "abc123", userName: "User-xyz" })
    ↓
Server receives join-room event
    ↓
Server sends "room-users" to joining user
    ↓
on("room-users", (users) => setRemoteUsers(users))
    ↓
Room displays all users' VideoDisplay components
    ↓
Server broadcasts "user-joined" to others
    ↓
Other users see new user appear
```

### **Example 2: Send Chat Message**

```
User types and presses Enter
    ↓
handleSendMessage()
    ↓
emit("send-message", { roomId, message, senderName })
    ↓
Add message to local state immediately
    ↓
Message appears instantly (optimistic update)
    ↓
Server receives send-message
    ↓
Server broadcasts to room
    ↓
Other users' on("receive-message") triggered
    ↓
Messages appear on their screens
```

### **Example 3: Toggle Microphone**

```
User clicks mute button
    ↓
onToggleMute() in CallControls
    ↓
toggleAudio() from useMediaStream
    ↓
Get audio track from stream
    ↓
Set audioTrack.enabled = !audioTrack.enabled
    ↓
Update isAudioEnabled state
    ↓
CallControls button shows different icon
    ↓
VideoDisplay shows/hides mute indicator
```

---

## Socket.IO Event Reference

### Events You Send (emit)

```typescript
// Join a room
emit("join-room", { roomId: "123", userName: "John" });

// Leave room
emit("leave-room", { roomId: "123" });

// Send message
emit("send-message", { 
  roomId: "123", 
  message: "Hello!", 
  senderName: "John" 
});

// WebRTC offer
emit("send-offer", { 
  roomId: "123", 
  offer: sdpOffer, 
  targetUserId: "socket-id" 
});

// WebRTC answer
emit("send-answer", { 
  answer: sdpAnswer, 
  targetUserId: "socket-id" 
});

// ICE candidate
emit("send-ice-candidate", { 
  roomId: "123", 
  candidate: iceCandidate, 
  targetUserId: "socket-id" 
});
```

### Events You Listen For (on)

```typescript
// Initial users list
on("room-users", (users) => {
  // users: [{ id, userName }, ...]
});

// New user joined
on("user-joined", (user) => {
  // user: { id, userName }
});

// User left
on("user-left", (userId) => {
  // userId: string
});

// Chat message received
on("receive-message", (data) => {
  // data: { message, senderName, timestamp }
});

// WebRTC offer received
on("receive-offer", (data) => {
  // data: { offer, senderId }
});

// WebRTC answer received
on("receive-answer", (data) => {
  // data: { answer, senderId }
});

// ICE candidate received
on("receive-ice-candidate", (data) => {
  // data: { candidate, senderId }
});
```

---

## URL Routes

```
/                    → Landing page (create/join room)
/room/:roomId        → Video chat room
/video-info          → Video information page
/chat-info           → Chat information page
/security-info       → Security information page
*                    → 404 Not Found page
```

---

## Key Technologies

| Technology | Used For | Why |
|-----------|----------|-----|
| React 18 | UI Framework | Modern, component-based |
| TypeScript | Type Safety | Catch errors early |
| Socket.IO | Real-time Communication | WebSocket with fallback |
| React Router | Navigation | Client-side routing |
| Tailwind CSS | Styling | Utility-first CSS |
| Radix UI | UI Components | Accessible components |
| Lucide React | Icons | Modern icon library |
| Zod | Validation | Type-safe validation |

---

## Component Props Summary

### **VideoDisplay**
```typescript
interface VideoDisplayProps {
  userName: string;              // Name to display
  isLocal: boolean;              // Is this local user?
  isMuted: boolean;              // Show mute icon?
  isVideoOff: boolean;           // Show placeholder?
  videoRef?: RefObject<HTMLVideoElement>;
}
```

### **ChatPanel**
```typescript
interface ChatPanelProps {
  roomId: string;                // Current room ID
}
```

### **CallControls**
```typescript
interface CallControlsProps {
  isMuted: boolean;              // Is audio muted?
  isVideoOff: boolean;           // Is video off?
  isChatOpen: boolean;           // Is chat visible?
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleChat: () => void;
  onLeaveCall: () => void;
}
```

---

## Common Patterns

### **Listening to Socket Events**
```typescript
useEffect(() => {
  // Subscribe
  const unsubscribe = on("event-name", (data) => {
    // Handle event
  });
  
  // Cleanup - IMPORTANT!
  return unsubscribe;
}, [on]);
```

### **Sending Socket Events**
```typescript
const handleClick = () => {
  if (socket?.connected) {
    emit("event-name", { payload: "data" });
  } else {
    console.error("Socket not connected");
  }
};
```

### **Updating Remote Users**
```typescript
on("user-joined", (user) => {
  setRemoteUsers(prev => [...prev, user]);
});

on("user-left", (userId) => {
  setRemoteUsers(prev => prev.filter(u => u.id !== userId));
});
```

### **Handling Media Tracks**
```typescript
// Get video track
const videoTrack = stream?.getVideoTracks()[0];
if (videoTrack) {
  videoTrack.enabled = !videoTrack.enabled;
}

// Get audio track
const audioTrack = stream?.getAudioTracks()[0];
if (audioTrack) {
  audioTrack.enabled = !audioTrack.enabled;
}
```

---

## Debugging Tips

### **Check Socket Connection**
```typescript
const { socket } = useSocketContext();
console.log("Connected:", socket?.connected);
console.log("Socket ID:", socket?.id);
```

### **Enable Socket Debug Logs**
```javascript
localStorage.debug = "socket.io-client:*";
```

### **Log Events**
```typescript
on("any-event", (data) => {
  console.log("[any-event]:", data);
});
```

### **Check Media Stream**
```typescript
const { stream, error } = useMediaStream();
console.log("Stream:", stream);
console.log("Video Tracks:", stream?.getVideoTracks());
console.log("Audio Tracks:", stream?.getAudioTracks());
if (error) console.error("Media Error:", error);
```

---

## Environment Configuration

### **.env**
```
VITE_SOCKET_URL=http://localhost:3001
```

In production:
```
VITE_SOCKET_URL=https://your-backend.com
```

Access in code:
```typescript
const url = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";
```

---

## Performance Checklist

- [x] Components properly memoized
- [x] Event listeners cleaned up
- [x] Media tracks stopped on unmount
- [x] No memory leaks from Socket.IO
- [x] Optimistic updates for better UX
- [x] Error boundaries for crashes
- [x] Lazy loading for routes (optional)

---

## Security Checklist

- [ ] Backend validates all messages
- [ ] Use HTTPS/WSS in production
- [ ] Authenticate users before room join
- [ ] Implement rate limiting
- [ ] Sanitize user input
- [ ] Use secure CORS policy
- [ ] Add encryption for sensitive data

---

## Quick Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview build

# Quality
npm run lint         # Run ESLint

# Backend
cd backend
node index.js        # Start backend server
```

---

## File Size Summary

```
Total Code Files: ~600 lines
├── Hooks: ~130 lines
├── Context: ~40 lines
├── Pages: ~250 lines
├── Components: ~180 lines
└── Utils: Small

Total Documentation: 2500+ lines
Total UI Components: 30+ files (from Radix UI)
```

---

**Everything in ChatVDO works together through Socket.IO real-time events and React state management!** 🚀

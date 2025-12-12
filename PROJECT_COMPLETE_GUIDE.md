# 📚 Complete Project Documentation - ChatVDO

## Project Overview

**ChatVDO** is a modern video conferencing application built with React, TypeScript, and Socket.IO. It allows users to create or join video rooms, communicate via real-time chat, and manage their media devices.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    ENTRY POINT                          │
│                  (main.tsx)                             │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │      React DOM Root          │
        │  (index.html #root element)  │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │       App.tsx (Main)         │
        │  - Providers Setup           │
        │  - Route Configuration       │
        └──────────────┬───────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
┌─────────────────┐        ┌──────────────────┐
│  QueryProvider  │        │ SocketProvider   │
│  (React Query)  │        │ (Socket.IO)      │
└─────────────────┘        └──────────────────┘
        │                             │
        └──────────────┬──────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  BrowserRouter               │
        │  - Pages Routing             │
        │  - URL Navigation            │
        └──────────────┬───────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
    ┌────────────┐          ┌──────────────┐
    │   Index    │          │    Room      │
    │  (Home)    │          │  (Video)     │
    └────────────┘          └──────────────┘
```

---

## 📁 File Structure & Purpose

### **1. Entry Point: `main.tsx`**

```typescript
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
```

**Purpose:** 
- Renders the React app into the HTML `#root` element
- Initializes the entire application
- Applies global CSS styles

---

### **2. App Container: `App.tsx`**

**Purpose:** Central component that wraps the entire app with multiple providers

```
App.tsx
├── QueryClientProvider (React Query)
│   └── SocketProvider (Socket.IO)
│       └── TooltipProvider (UI)
│           ├── BrowserRouter (Navigation)
│           │   ├── Routes
│           │   │   ├── / → Index
│           │   │   ├── /room/:roomId → Room
│           │   │   ├── /video-info → VideoInfo
│           │   │   ├── /chat-info → ChatInfo
│           │   │   ├── /security-info → SecurityInfo
│           │   │   └── * → NotFound
│           │   └── Toasters (Notifications)
```

**Key Features:**
- **QueryClientProvider** - Manages data caching & async state (React Query)
- **SocketProvider** - Provides Socket.IO connection globally
- **TooltipProvider** - UI tooltips support
- **BrowserRouter** - URL-based routing
- **Routes** - Page navigation
- **Toasters** - Toast notifications (2 types: native & sonner)

---

## 🎯 Core Hooks

### **1. `useSocket.ts` - Socket.IO Connection Hook**

```typescript
export const useSocket = (options: UseSocketOptions = {})
```

**What it does:**
- Creates and manages WebSocket connection to backend
- Handles automatic reconnection (5 attempts)
- Provides methods to emit and listen to events

**Key Methods:**
```typescript
{
  emit(event, data, callback?) → void
  on(event, handler) → () => void  // Returns unsubscribe function
  once(event, handler) → void
  getSocket() → Socket | null
  socket → Socket instance
}
```

**Configuration:**
```typescript
{
  url: "http://localhost:3001",      // Server URL
  autoConnect: true                  // Auto-connect on mount
}
```

**Lifecycle:**
1. On mount → Creates socket connection
2. Sets up listeners for connect/disconnect/error
3. Returns methods for component usage
4. On unmount → Disconnects socket

---

### **2. `useMediaStream.ts` - Media Capture Hook**

```typescript
export const useMediaStream = ()
```

**What it does:**
- Requests camera & microphone permissions
- Manages media stream state
- Provides toggle functions

**Returns:**
```typescript
{
  stream: MediaStream | null,      // The actual media stream
  isVideoEnabled: boolean,         // Video track state
  isAudioEnabled: boolean,         // Audio track state
  toggleVideo: () => void,         // Toggle video on/off
  toggleAudio: () => void,         // Toggle audio on/off
  error: string | null             // Error message if any
}
```

**How it works:**
```
Request Permission
    ↓
getUserMedia() with constraints
    ↓
Return stream with video/audio tracks
    ↓
Setup toggle functions to enable/disable tracks
```

**Media Constraints:**
- Video: 1280x720 (ideal resolution)
- Audio: Echo cancellation + noise suppression enabled

---

## 🔌 Context: Socket.IO Global State

### **`SocketContext.tsx` - Global Socket Provider**

**Purpose:** Makes Socket.IO available to entire app without prop drilling

**How it works:**
```
SocketProvider (wrapper component)
    ↓
useSocket hook (creates connection)
    ↓
Context.Provider (provides to children)
    ↓
useSocketContext hook (access in any component)
```

**Access in components:**
```typescript
const { emit, on, once } = useSocketContext();

// Now use Socket.IO anywhere
emit("join-room", { roomId: "123" });
on("user-joined", (user) => console.log(user));
```

---

## 🏠 Pages

### **1. Index Page (`pages/Index.tsx`) - Home/Landing**

**Purpose:** Landing page to create or join rooms

**Components:**
- **Hero Section**: Title "ChatVerse" with description
- **Action Cards**:
  - Create Room - Generates random room ID
  - Join Room - Input room code
- **Feature Cards** (3 columns):
  - HD Video (→ /video-info)
  - Live Chat (→ /chat-info)
  - Secure (→ /security-info)

**Interactions:**
1. Click "Create Room" → Generates ID → Navigate to `/room/{id}`
2. Enter code + click "Join Room" → Navigate to `/room/{code}`
3. Click feature icons → Navigate to info pages

---

### **2. Room Page (`pages/Room.tsx`) - Main Video Chat**

**This is the core of the application**

**Structure:**
```
Room
├── Local Video (You)
├── Remote User Videos (Others)
├── Call Controls (Buttons)
└── Chat Panel (Optional)
```

**Key Functionality:**

#### **Step 1: Join Room (on mount)**
```typescript
useEffect(() => {
  emit("join-room", { roomId, userName });
  // Listen for existing users
  on("room-users", setRemoteUsers);
}, [roomId])
```

#### **Step 2: Media Stream Setup**
```typescript
const { stream, isVideoEnabled, isAudioEnabled } = useMediaStream();
// Stream gets attached to <video ref> element
```

#### **Step 3: Real-time User Updates**
```typescript
on("user-joined", (user) => {
  setRemoteUsers(prev => [...prev, user]);
  toast.show(`${user.userName} joined!`);
});

on("user-left", (userId) => {
  setRemoteUsers(prev => prev.filter(u => u.id !== userId));
});
```

**Components Used:**
1. **VideoDisplay** - Shows video or placeholder
2. **CallControls** - Mute, video toggle, chat toggle, leave
3. **ChatPanel** - Real-time messaging

---

## 🎨 Components

### **1. `VideoDisplay.tsx` - Video Renderer**

**Props:**
```typescript
{
  userName: string           // Display name
  isLocal: boolean          // Is this the local user?
  isMuted: boolean          // Show muted indicator?
  isVideoOff: boolean       // Show placeholder instead of video?
  videoRef?: RefObject<HTMLVideoElement>
}
```

**Renders:**
- If videoOff: Shows avatar with initials
- If video on: Shows video stream with name overlay
- Shows mute icon if audio is muted

---

### **2. `ChatPanel.tsx` - Real-time Chat**

**How it works:**

```typescript
useEffect(() => {
  // Listen for incoming messages
  const unsub = on("receive-message", (data) => {
    const newMessage = {
      id: Date.now(),
      text: data.message,
      sender: data.senderName,
      timestamp: new Date(data.timestamp)
    };
    setMessages(prev => [...prev, newMessage]);
  });
  return unsub; // Cleanup
}, [on]);
```

**Send Message:**
```typescript
const handleSendMessage = () => {
  // Emit to server
  emit("send-message", {
    roomId,
    message: inputValue,
    senderName: "You"
  });
  
  // Add to local state immediately (better UX)
  setMessages(prev => [...prev, newMessage]);
  setInputValue("");
};
```

**Layout:**
- Header: Shows room code
- Messages: Scrollable list with timestamps
- Input: Text input + Send button

---

### **3. `CallControls.tsx` - Control Buttons**

**Buttons:**
1. **Mute/Unmute** - Toggles audio
2. **Camera On/Off** - Toggles video
3. **Chat Toggle** - Shows/hides chat panel
4. **Leave Call** - Exits room (red button)

**State Indicators:**
- Red background when muted/video off
- Blue background when chat open

---

## 🔄 Real-time Communication Flow

### **Emit Events (Client → Server)**

```
User Action
    ↓
emit("event-name", data)
    ↓
Socket.IO sends via WebSocket
    ↓
Backend Server receives
    ↓
Backend processes & broadcasts
```

**Available Events:**
- `join-room` - Join a video room
- `leave-room` - Leave a room
- `send-message` - Send chat message
- `send-offer` - WebRTC offer
- `send-answer` - WebRTC answer
- `send-ice-candidate` - ICE candidate

### **Listen Events (Server → Client)**

```
Backend broadcasts
    ↓
WebSocket delivers to client
    ↓
on("event-name", handler)
    ↓
Handler function called with data
    ↓
State updates → UI renders
```

**Available Events:**
- `room-users` - List of users in room
- `user-joined` - New user joined
- `user-left` - User left room
- `receive-message` - New message
- `receive-offer` - WebRTC offer
- `receive-answer` - WebRTC answer
- `receive-ice-candidate` - ICE candidate

---

## 🔐 State Management Strategy

### **Local Component State (useState)**
```typescript
// In Room.tsx
const [remoteUsers, setRemoteUsers] = useState([]);
const [isChatOpen, setIsChatOpen] = useState(true);

// In ChatPanel.tsx
const [messages, setMessages] = useState([]);
const [inputValue, setInputValue] = useState("");
```

### **Global Context State**
```typescript
// Socket.IO connection
const { emit, on } = useSocketContext();

// Media stream
const { stream, isVideoEnabled } = useMediaStream();
```

### **Route Params**
```typescript
const { roomId } = useParams(); // From URL: /room/:roomId
```

---

## 🔄 Data Flow Example: Sending a Message

```
User types message and presses Enter
    ↓
handleSendMessage() triggered
    ↓
emit("send-message", { roomId, message, senderName })
    ↓
Socket.IO sends to server
    ↓
Server receives on("send-message")
    ↓
Server broadcasts to room: io.to(roomId).emit("receive-message", ...)
    ↓
All clients in room receive on("receive-message")
    ↓
Handler adds message to state
    ↓
React re-renders ChatPanel
    ↓
New message appears on screen
```

---

## 📊 Dependencies & Their Roles

| Package | Purpose | Version |
|---------|---------|---------|
| `react` | UI framework | 18.3.1 |
| `react-dom` | DOM renderer | 18.3.1 |
| `react-router-dom` | URL routing | 6.30.1 |
| `socket.io-client` | WebSocket client | 4.8.1 |
| `@tanstack/react-query` | Data caching | 5.90.9 |
| `tailwindcss` | Styling | 3.4.17 |
| `lucide-react` | Icons | 0.462.0 |
| `@radix-ui/*` | UI components | Various |
| `sonner` | Toast notifications | 1.7.4 |
| `zod` | Data validation | 3.25.76 |

---

## 🚀 Data Flow Diagram (Complete)

```
┌─────────────────────────────────────────────────────────┐
│                 USER ACTIONS                            │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
  ┌──────────────┐          ┌──────────────────┐
  │ Create/Join  │          │ Send Message /   │
  │ Room         │          │ Toggle Controls  │
  └──────┬───────┘          └────────┬─────────┘
         │                           │
         │                           │
    emit("join-room")        emit("send-message")
         │                           │
         └───────────────┬───────────┘
                         │
                         ▼
         ┌────────────────────────────┐
         │  Socket.IO Client          │
         │  (socket.io-client)        │
         └────────┬───────────────────┘
                  │ (WebSocket)
                  │
         ┌────────▼───────────────────┐
         │  Backend Server            │
         │  (Node.js + Socket.IO)     │
         └────────┬───────────────────┘
                  │
         ┌────────┴───────────────────┐
         │  Room Management & Broadcast
         └────────┬───────────────────┘
                  │ (WebSocket)
                  │
    ┌─────────────┴──────────────┐
    │                            │
    ▼                            ▼
on("user-joined")    on("receive-message")
    │                            │
    ▼                            ▼
setRemoteUsers()        setMessages()
    │                            │
    └─────────────┬──────────────┘
                  │
                  ▼
        ┌────────────────────┐
        │  React Re-render   │
        │  (Update UI)       │
        └────┬───────────────┘
             │
    ┌────────┴──────────┐
    │                   │
    ▼                   ▼
Display Remote Users  Show Chat Messages
```

---

## 🎯 Key Concepts

### **Component Lifecycle in Room**

1. **Mount**
   - Get media stream (camera/mic)
   - Join socket room
   - Set up event listeners

2. **Update**
   - User joins → Add to remoteUsers
   - Message received → Add to messages
   - User leaves → Remove from remoteUsers

3. **Unmount**
   - Stop all media tracks
   - Leave room
   - Unsubscribe from events
   - Disconnect socket

### **Message Flow Pattern**

```
Action → Emit → Server → Broadcast → Listen → Update State → Re-render
```

### **Error Handling**

1. **Media Access Error**
   - Caught in `useMediaStream`
   - Shown as toast notification
   - App still works without video

2. **Socket Connection Error**
   - Auto-reconnect enabled (5 attempts)
   - Logged to console
   - User sees "waiting for others"

---

## 📈 Performance Optimizations

1. **Component Memoization** - VideoDisplay components memoized
2. **Event Cleanup** - All listeners unsubscribed in useEffect return
3. **Local State Updates** - Messages added locally before server confirms
4. **Media Track Management** - Tracks properly stopped on unmount
5. **Context Optimization** - Socket context only updates when connection changes

---

## 🔒 Security Features

1. **CORS Enabled** - Server allows cross-origin requests
2. **Random Room IDs** - No predictable room codes
3. **WebSocket** - Encrypted in production (WSS)
4. **Input Validation** - Messages checked before display

---

## 🎓 How to Extend

### **Add a New Event:**

1. **Backend** - Add listener:
```javascript
socket.on("new-event", (data) => {
  // Process and broadcast
  io.to(roomId).emit("new-event-response", result);
});
```

2. **Frontend** - Emit and listen:
```typescript
// Emit
emit("new-event", { data });

// Listen
on("new-event-response", (result) => {
  // Handle response
});
```

### **Add a New Page:**

1. Create in `src/pages/NewPage.tsx`
2. Import in `App.tsx`
3. Add route:
```typescript
<Route path="/new-page" element={<NewPage />} />
```

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start frontend
npm run dev

# In separate terminal, start backend
cd backend
node index.js

# Open browser to http://localhost:8080
```

---

## 📝 Summary

**ChatVDO** is a well-architected video conferencing app with:
- ✅ Real-time video display
- ✅ Instant messaging
- ✅ User presence tracking
- ✅ Media device controls
- ✅ Responsive UI
- ✅ Error handling
- ✅ Scalable architecture

Every file has a specific purpose, and data flows smoothly from user actions through Socket.IO to other users. 🎉

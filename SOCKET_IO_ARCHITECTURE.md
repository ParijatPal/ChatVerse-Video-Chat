# Socket.IO Architecture Diagram

## Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      REACT APPLICATION                      │
└─────────────────────────────────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │   App.tsx      │
                    │ (SocketProvider)
                    └───────┬────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
    ┌───────▼──────┐  ┌────▼─────┐ ┌──────▼──────┐
    │    Room.tsx  │  │ChatPanel  │ │ Other Pages │
    │              │  │           │ │             │
    │ - Join room  │  │ - Messages│ │             │
    │ - Leave room │  │ - Send msg│ │             │
    │ - User list  │  │ - Receive │ │             │
    └───────┬──────┘  └────┬──────┘ └─────────────┘
            │               │
            └───────────────┼───────────────┐
                            │               │
                   ┌────────▼────────┐      │
                   │useSocketContext │◄─────┘
                   │                 │
                   │ Methods:        │
                   │- emit()         │
                   │- on()           │
                   │- once()         │
                   └────────┬────────┘
                            │
                   ┌────────▼────────┐
                   │   useSocket()   │
                   │                 │
                   │ - Connection    │
                   │ - Reconnection  │
                   │ - Error handling│
                   └────────┬────────┘
                            │
                            │ socket.io-client
                            │
                   ┌────────▼────────┐
                   │   WS/WSS        │
                   │  Connection     │
                   └────────┬────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
    ┌───▼───┐          ┌────▼─────┐       ┌───▼──┐
    │Browser│          │ Websocket │      │ HTTP │
    │Event  │          │ (Primary) │      │Fallback
    └───────┘          └────┬─────┘       └──────┘
                            │
                   ┌────────▼────────┐
                   │  Node.js Server │
                   │  (localhost:3001)
                   │                 │
                   │ Uses:           │
                   │- Express        │
                   │- Socket.IO      │
                   │- CORS           │
                   └────────┬────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
    ┌───▼────┐        ┌────▼─────┐       ┌────▼────┐
    │ Rooms  │        │ Messages  │      │  Events │
    │ Manager│        │ Broadcast │      │ Handler │
    └────────┘        └───────────┘      └─────────┘
```

## Socket.IO Event Flow

```
┌──────────────────────────────────────────────────────────┐
│                    CLIENT SIDE                           │
└──────────────────────────────────────────────────────────┘
                            
                         emit()
                            │
                   ┌────────▼────────┐
                   │ join-room       │
                   │ send-message    │
                   │ send-offer      │
                   │ etc.            │
                   └────────┬────────┘
                            │
                            │ (WebSocket)
                            │
┌──────────────────────────▼──────────────────────────────┐
│                    SERVER SIDE                          │
└──────────────────────────────────────────────────────────┘

    on('join-room') ──┐
    on('send-message')├──► Process
    on('send-offer')──┤    & Handle
    on('leave-room')──┘
                            │
                   ┌────────▼────────┐
                   │ Broadcast to    │
                   │ room users      │
                   └────────┬────────┘
                            │
                            │ (WebSocket)
                            │
┌──────────────────────────▼──────────────────────────────┐
│                    CLIENT SIDE                          │
└──────────────────────────────────────────────────────────┘

    on('room-users')
    on('user-joined')  ◄──── Receive Updates
    on('user-left')
    on('receive-message')
```

## Component Dependency Chain

```
App.tsx
  └─► SocketProvider
      └─► useSocketContext hook
          ├─► Room.tsx
          │   └─► useSocketContext
          │       ├─► emit('join-room')
          │       ├─► on('room-users')
          │       ├─► on('user-joined')
          │       └─► on('user-left')
          │
          └─► ChatPanel.tsx
              └─► useSocketContext
                  ├─► emit('send-message')
                  └─► on('receive-message')
```

## Backend Server Structure

```
┌──────────────────────────────────┐
│    server-example.js             │
│    (Node.js + Express)           │
└──────────────────────────────────┘
             │
             ├─► HTTP Server (Port 3001)
             │
             ├─► Socket.IO Server
             │   ├─► CORS Configuration
             │   └─► Connection Handling
             │
             └─► Event Handlers
                 ├─► join-room
                 ├─► leave-room
                 ├─► send-message
                 ├─► send-offer
                 ├─► send-answer
                 └─► send-ice-candidate

                 Data Storage:
                 ├─► rooms Map
                 │   └─► { roomId: [user1, user2, ...] }
                 └─► socket instances
```

## Data Models

```
Room Model:
{
  roomId: string,
  users: [
    {
      id: string,           // socket.id
      userName: string,
      socketId: string
    }
  ]
}

Message Model:
{
  roomId: string,
  message: string,
  senderName: string,
  timestamp: Date
}

RemoteUser Model:
{
  id: string,             // socket.id
  userName: string
}
```

## Connection Lifecycle

```
1. Application Loads
   │
   └─► SocketProvider initializes
       │
       └─► useSocket hook creates connection
           │
           └─► Socket connects to server
               │
               ├─► 'connect' event fires
               │   └─► Listen for events
               │
               └─► Ready for emit/on operations

2. User Joins Room
   │
   └─► emit('join-room')
       │
       └─► Server receives event
           │
           ├─► Add user to room
           │
           ├─► Send 'room-users' to joiner
           │
           └─► Broadcast 'user-joined' to others

3. User Sends Message
   │
   └─► emit('send-message')
       │
       └─► Server receives event
           │
           └─► Broadcast 'receive-message' to room

4. User Leaves
   │
   └─► emit('leave-room') OR socket disconnects
       │
       └─► Server receives event
           │
           ├─► Remove user from room
           │
           └─► Broadcast 'user-left' to room

5. Page Unload/Close
   │
   └─► Socket.IO cleanup
       │
       └─► Disconnect event sent to server
           │
           └─► Server cleans up user data
```

## State Management Flow

```
React Component State
        │
        ├─► Local State (useState)
        │   └─► inputValue, messages, etc.
        │
        └─► Socket Context (useSocketContext)
            │
            ├─► socket instance
            │   └─► Managed by useSocket hook
            │
            ├─► emit()
            │   └─► Send to server
            │
            └─► on()
                └─► Listen & Update Local State
                    (via useEffect)
```

## Key Connection Points

```
Frontend Configuration:
├─► package.json
│   └─► socket.io-client dependency
│
├─► .env
│   └─► VITE_SOCKET_URL = http://localhost:3001
│
└─► App.tsx
    └─► SocketProvider socketUrl prop

Backend Configuration:
├─► package.json
│   ├─► express
│   ├─► socket.io
│   └─► cors
│
└─► server-example.js
    ├─► Port: 3001
    ├─► CORS: configured
    └─► Event handlers: defined
```

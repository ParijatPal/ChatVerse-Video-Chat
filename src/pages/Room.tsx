import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { VideoDisplay } from "@/components/VideoDisplay";
import { ChatPanel } from "@/components/ChatPanel";
import { CallControls } from "@/components/CallControls";
import { useMediaStream } from "@/hooks/useMediaStream";
import { useSocketContext } from "@/context/SocketContext";
import { useToast } from "@/hooks/use-toast";

interface RemoteUser {
  id: string;
  userName: string;
  stream?: MediaStream;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { socket, emit, on, isConnected } = useSocketContext();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  
  const {
    stream: localStream,
    isVideoEnabled,
    isAudioEnabled,
    toggleVideo,
    toggleAudio,
    error,
  } = useMediaStream();

  const [isChatOpen, setIsChatOpen] = useState(true);
  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);
  
  // Store peer connections
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());

  // Set local video
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Create peer connection
  const createPeerConnection = (userId: string): RTCPeerConnection => {
    console.log('🔗 Creating peer connection for:', userId);

    const pc = new RTCPeerConnection(ICE_SERVERS);

    // Add local stream tracks
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
        console.log('➕ Added track:', track.kind);
      });
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('🧊 Sending ICE candidate to:', userId);
        emit('ice-candidate', {
          to: userId,
          candidate: event.candidate,
        });
      }
    };

    // Handle incoming stream
    pc.ontrack = (event) => {
      console.log('📺 Received remote track from:', userId);
      setRemoteUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, stream: event.streams[0] } : user
        )
      );
    };

    // Connection state
    pc.onconnectionstatechange = () => {
      console.log(`🔌 Connection state for ${userId}:`, pc.connectionState);
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        removePeerConnection(userId);
      }
    };

    peerConnectionsRef.current.set(userId, pc);
    return pc;
  };

  // Create and send offer
  const createOffer = async (userId: string) => {
    try {
      const pc = createPeerConnection(userId);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      console.log('📤 Sending offer to:', userId);
      emit('offer', { to: userId, offer });
    } catch (error) {
      console.error('❌ Error creating offer:', error);
    }
  };

  // Handle received offer
  const handleOffer = async (from: string, offer: RTCSessionDescriptionInit) => {
    try {
      console.log('📥 Received offer from:', from);
      const pc = createPeerConnection(from);

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      console.log('📤 Sending answer to:', from);
      emit('answer', { to: from, answer });
    } catch (error) {
      console.error('❌ Error handling offer:', error);
    }
  };

  // Handle received answer
  const handleAnswer = async (from: string, answer: RTCSessionDescriptionInit) => {
    try {
      console.log('📥 Received answer from:', from);
      const pc = peerConnectionsRef.current.get(from);
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    } catch (error) {
      console.error('❌ Error handling answer:', error);
    }
  };

  // Handle ICE candidate
  const handleIceCandidate = async (from: string, candidate: RTCIceCandidateInit) => {
    try {
      const pc = peerConnectionsRef.current.get(from);
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
        console.log('🧊 Added ICE candidate from:', from);
      }
    } catch (error) {
      console.error('❌ Error adding ICE candidate:', error);
    }
  };

  // Remove peer connection
  const removePeerConnection = (userId: string) => {
    const pc = peerConnectionsRef.current.get(userId);
    if (pc) {
      pc.close();
      peerConnectionsRef.current.delete(userId);
    }
  };

  // Socket.IO connection and room setup
  useEffect(() => {
    if (!roomId || !isConnected) {
      console.log("Waiting for connection...", { roomId, isConnected });
      return;
    }

    console.log("Joining room:", roomId);
    emit("join-room", roomId);

    // User connected - create offer
    const unsubscribeUserConnected = on("user-connected", (userId: string) => {
      console.log("👤 User connected:", userId);
      setRemoteUsers((prev) => [...prev, { id: userId, userName: `User-${userId.slice(0, 4)}` }]);
      
      // Create offer for new user
      if (localStream) {
        createOffer(userId);
      }
      
      toast({
        title: "User Joined",
        description: `User joined the room`,
      });
    });

    // User disconnected
    const unsubscribeUserDisconnected = on("user-disconnected", (userId: string) => {
      console.log("👋 User disconnected:", userId);
      removePeerConnection(userId);
      setRemoteUsers((prev) => prev.filter((user) => user.id !== userId));
      toast({
        title: "User Left",
        description: "A user left the room",
      });
    });

    // Existing users - create offers
    const unsubscribeExistingUsers = on("existing-users", (users: string[]) => {
      console.log("👥 Existing users:", users);
      const userObjects = users.map(id => ({ id, userName: `User-${id.slice(0, 4)}` }));
      setRemoteUsers(userObjects);
      
      // Create offers for all existing users
      if (localStream) {
        users.forEach(userId => createOffer(userId));
      }
    });

    // WebRTC signaling
    const unsubscribeOffer = on("offer", ({ from, offer }: any) => {
      handleOffer(from, offer);
    });

    const unsubscribeAnswer = on("answer", ({ from, answer }: any) => {
      handleAnswer(from, answer);
    });

    const unsubscribeIceCandidate = on("ice-candidate", ({ from, candidate }: any) => {
      handleIceCandidate(from, candidate);
    });

    return () => {
      console.log("Leaving room:", roomId);
      unsubscribeUserConnected();
      unsubscribeUserDisconnected();
      unsubscribeExistingUsers();
      unsubscribeOffer();
      unsubscribeAnswer();
      unsubscribeIceCandidate();
      emit("leave-room", roomId);
      
      // Close all peer connections
      peerConnectionsRef.current.forEach(pc => pc.close());
      peerConnectionsRef.current.clear();
    };
  }, [roomId, emit, on, toast, isConnected, localStream]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Media Access Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleLeaveCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    
    // Close all peer connections
    peerConnectionsRef.current.forEach(pc => pc.close());
    peerConnectionsRef.current.clear();
    
    if (roomId && isConnected) {
      emit("leave-room", roomId);
    }
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col">
        {/* Video Grid */}
        <div className="flex-1 p-4 grid grid-cols-2 gap-4">
          <VideoDisplay
            userName="You"
            isLocal={true}
            isMuted={!isAudioEnabled}
            isVideoOff={!isVideoEnabled}
            videoRef={localVideoRef}
          />
          {remoteUsers.length > 0 ? (
            remoteUsers.map((user) => (
              <RemoteVideoDisplay
                key={user.id}
                userName={user.userName}
                stream={user.stream}
              />
            ))
          ) : (
            <VideoDisplay
              userName="Waiting for others..."
              isLocal={false}
              isMuted={false}
              isVideoOff={true}
            />
          )}
        </div>

        {/* Controls */}
        <div className="p-6 bg-card/50 backdrop-blur-sm border-t border-border">
          <CallControls
            isMuted={!isAudioEnabled}
            isVideoOff={!isVideoEnabled}
            isChatOpen={isChatOpen}
            onToggleMute={toggleAudio}
            onToggleVideo={toggleVideo}
            onToggleChat={() => setIsChatOpen(!isChatOpen)}
            onLeaveCall={handleLeaveCall}
          />
        </div>
      </div>

      {/* Chat Panel */}
      {isChatOpen && (
        <div className="w-80 border-l border-border">
          <ChatPanel roomId={roomId || ""} />
        </div>
      )}
    </div>
  );
};

// Remote video component
const RemoteVideoDisplay = ({ userName, stream }: { userName: string; stream?: MediaStream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <VideoDisplay
      userName={userName}
      isLocal={false}
      isMuted={false}
      isVideoOff={!stream}
      videoRef={videoRef}
    />
  );
};

export default Room;
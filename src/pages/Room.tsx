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
}

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { emit, on } = useSocketContext();
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

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Socket.IO connection and room setup
  useEffect(() => {
    if (!roomId) return;

    // Join room
    emit("join-room", { roomId, userName: `User-${Math.random().toString(36).substr(2, 9)}` });

    // Listen for users in room
    const unsubscribeUserJoined = on("user-joined", (user: RemoteUser) => {
      setRemoteUsers((prev) => [...prev, user]);
      toast({
        title: "User Joined",
        description: `${user.userName} joined the room`,
      });
    });

    const unsubscribeUserLeft = on("user-left", (userId: string) => {
      setRemoteUsers((prev) => prev.filter((user) => user.id !== userId));
      toast({
        title: "User Left",
        description: "A user left the room",
      });
    });

    const unsubscribeRoomUsers = on("room-users", (users: RemoteUser[]) => {
      setRemoteUsers(users);
    });

    return () => {
      unsubscribeUserJoined();
      unsubscribeUserLeft();
      unsubscribeRoomUsers();
      emit("leave-room", { roomId });
    };
  }, [roomId, emit, on, toast]);

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
    emit("leave-room", { roomId });
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
              <VideoDisplay
                key={user.id}
                userName={user.userName}
                isLocal={false}
                isMuted={false}
                isVideoOff={true}
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

export default Room;

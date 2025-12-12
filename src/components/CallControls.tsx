import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff, MessageSquare, PhoneOff } from "lucide-react";

interface CallControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  isChatOpen: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleChat: () => void;
  onLeaveCall: () => void;
}

export const CallControls = ({
  isMuted,
  isVideoOff,
  isChatOpen,
  onToggleMute,
  onToggleVideo,
  onToggleChat,
  onLeaveCall,
}: CallControlsProps) => {
  return (
    <div className="flex items-center justify-center gap-3">
      <Button
        variant="control"
        size="lg"
        onClick={onToggleMute}
        className={isMuted ? "bg-destructive/20 hover:bg-destructive/30" : ""}
      >
        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </Button>

      <Button
        variant="control"
        size="lg"
        onClick={onToggleVideo}
        className={isVideoOff ? "bg-destructive/20 hover:bg-destructive/30" : ""}
      >
        {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
      </Button>

      <Button
        variant="control"
        size="lg"
        onClick={onToggleChat}
        className={isChatOpen ? "bg-primary/20 hover:bg-primary/30" : ""}
      >
        <MessageSquare className="w-5 h-5" />
      </Button>

      <Button
        variant="destructive"
        size="lg"
        onClick={onLeaveCall}
        className="ml-4"
      >
        <PhoneOff className="w-5 h-5" />
        <span>Leave</span>
      </Button>
    </div>
  );
};

import { Video, VideoOff, Mic, MicOff } from "lucide-react";
import { RefObject } from "react";

interface VideoDisplayProps {
  userName: string;
  isLocal: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  videoRef?: RefObject<HTMLVideoElement>;
}

export const VideoDisplay = ({ userName, isLocal, isMuted, isVideoOff, videoRef }: VideoDisplayProps) => {
  return (
    <div className="relative rounded-lg overflow-hidden bg-secondary aspect-video">
      {isVideoOff ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary to-secondary/50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-4xl font-semibold text-primary">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="text-foreground font-medium">{userName}</p>
          </div>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted={isLocal}
          />
          <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <p className="text-sm font-medium text-foreground">{userName}</p>
          </div>
        </>
      )}

      {/* Muted indicator */}
      {isMuted && (
        <div className="absolute top-4 right-4 bg-destructive/90 backdrop-blur-sm p-2 rounded-full">
          <MicOff className="w-4 h-4 text-destructive-foreground" />
        </div>
      )}
    </div>
  );
};

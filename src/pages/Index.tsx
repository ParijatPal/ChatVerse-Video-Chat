import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, MessageSquare, Lock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(7);
    navigate(`/room/${newRoomId}`);
  };

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      navigate(`/room/${roomId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-20"></div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-6 hover-scale shadow-[0_0_40px_rgba(23,184,190,0.4)]">
            <Video className="w-10 h-10 text-foreground" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-[gradient_8s_ease_infinite] bg-[length:200%_auto]">
            ChatVerse
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect face-to-face with anyone, anywhere. High-quality video calls with integrated chat.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Create Room Card */}
          <Card className="border-border bg-card/50 backdrop-blur-sm hover-scale transition-all hover:shadow-[0_0_30px_rgba(23,184,190,0.3)]">
            <CardHeader>
              <CardTitle className="text-foreground">Start New Meeting</CardTitle>
              <CardDescription>Create a new room and invite others</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleCreateRoom} 
                variant="hero" 
                size="lg" 
                className="w-full"
              >
                Create Room
              </Button>
            </CardContent>
          </Card>

          {/* Join Room Card */}
          <Card className="border-border bg-card/50 backdrop-blur-sm hover-scale transition-all hover:shadow-[0_0_30px_rgba(23,184,190,0.3)]">
            <CardHeader>
              <CardTitle className="text-foreground">Join Meeting</CardTitle>
              <CardDescription>Enter a room code to join</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Enter room code"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleJoinRoom()}
                className="bg-background/50"
              />
              <Button 
                onClick={handleJoinRoom} 
                variant="default" 
                size="lg" 
                className="w-full"
                disabled={!roomId.trim()}
              >
                Join Room
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-3 gap-6 text-center">
          <div 
            className="space-y-2 group cursor-pointer"
            onClick={() => navigate("/video-info")}
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(23,184,190,0.5)]">
                <Video className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110" />
              </div>
            </div>
            <h3 className="font-semibold text-foreground">HD Video</h3>
            <p className="text-sm text-muted-foreground">Crystal clear video quality</p>
          </div>
          <div 
            className="space-y-2 group cursor-pointer"
            onClick={() => navigate("/chat-info")}
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(23,184,190,0.5)]">
                <MessageSquare className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110" />
              </div>
            </div>
            <h3 className="font-semibold text-foreground">Live Chat</h3>
            <p className="text-sm text-muted-foreground">Message while you talk</p>
          </div>
          <div 
            className="space-y-2 group cursor-pointer"
            onClick={() => navigate("/security-info")}
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(23,184,190,0.5)]">
                <Lock className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110" />
              </div>
            </div>
            <h3 className="font-semibold text-foreground">Secure</h3>
            <p className="text-sm text-muted-foreground">Private and encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

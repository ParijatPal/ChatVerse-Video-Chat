import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, ArrowLeft, Camera, Monitor, Wifi } from "lucide-react";

const VideoInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="mb-6 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6 hover-scale">
            <Video className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4 text-white">
            HD Video Quality
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Experience crystal-clear video calls with our advanced streaming technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">1080p Resolution</CardTitle>
              <CardDescription className="text-white/80">Full HD video streaming</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">
                Our platform supports up to 1080p video resolution, ensuring you see every detail clearly during your calls.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Adaptive Streaming</CardTitle>
              <CardDescription className="text-white/80">Optimized for your connection</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">
                Smart bitrate adjustment ensures smooth video even on varying network conditions without interruptions.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <Wifi className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Low Latency</CardTitle>
              <CardDescription className="text-white/80">Real-time communication</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">
                WebRTC technology provides near-instant video transmission with minimal delay for natural conversations.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Camera Controls</CardTitle>
              <CardDescription className="text-white/80">Full control over your feed</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">
                Toggle your camera on/off, adjust settings, and switch between multiple camera sources easily during calls.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Button
            onClick={() => navigate("/room/demo")}
            size="lg"
            className="bg-white text-purple-600 hover:bg-white/90"
          >
            Try Video Call Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoInfo;

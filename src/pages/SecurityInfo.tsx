import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, ArrowLeft, Shield, Key, Eye } from "lucide-react";

const SecurityInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-orange-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
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
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4 text-white">
            Secure Connections
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Your privacy and security are our top priorities
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">End-to-End Encryption</CardTitle>
              <CardDescription className="text-white/80">Military-grade security</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">
                All video and audio streams are encrypted using WebRTC's built-in DTLS-SRTP encryption, ensuring only participants can access the content.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <Key className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Peer-to-Peer Technology</CardTitle>
              <CardDescription className="text-white/80">Direct connections</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">
                WebRTC enables direct peer-to-peer connections between users, meaning your video never passes through our servers.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">No Recording</CardTitle>
              <CardDescription className="text-white/80">Complete privacy</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">
                We don't record or store any of your video calls or messages. Once your session ends, everything is permanently deleted.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Private Room Codes</CardTitle>
              <CardDescription className="text-white/80">Controlled access</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">
                Each room has a unique code that only you can share, ensuring only invited participants can join your calls.
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
            Experience Secure Calls
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecurityInfo;

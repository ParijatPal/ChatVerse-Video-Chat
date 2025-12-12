import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ArrowLeft, Send, Bell, Clock } from "lucide-react";

const ChatInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
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
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4 text-white">
            Live Chat Features
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Stay connected with instant messaging while on video calls
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <Send className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Instant Messaging</CardTitle>
              <CardDescription className="text-white/80">Chat in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">
                Send and receive messages instantly during video calls. Perfect for sharing links, notes, or quick information.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Message Notifications</CardTitle>
              <CardDescription className="text-white/80">Never miss a message</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">
                Get notified when new messages arrive, even when the chat panel is closed or minimized.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Message History</CardTitle>
              <CardDescription className="text-white/80">Access past conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">
                All messages are stored during the call session, so you can scroll back and review previous discussions.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Side-by-Side View</CardTitle>
              <CardDescription className="text-white/80">Video and chat together</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">
                Chat panel slides in alongside your video feeds, allowing you to message without interrupting the video call.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Button
            onClick={() => navigate("/room/demo")}
            size="lg"
            className="bg-white text-blue-600 hover:bg-white/90"
          >
            Start Chatting Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInfo;

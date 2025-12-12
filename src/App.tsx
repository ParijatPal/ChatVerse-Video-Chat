import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocketProvider } from "@/context/SocketContext";
import Index from "./pages/Index";
import Room from "./pages/Room";
import VideoInfo from "./pages/VideoInfo";
import ChatInfo from "./pages/ChatInfo";
import SecurityInfo from "./pages/SecurityInfo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SocketProvider socketUrl={import.meta.env.VITE_SOCKET_URL || "http://localhost:3001"}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/room/:roomId" element={<Room />} />
            <Route path="/video-info" element={<VideoInfo />} />
            <Route path="/chat-info" element={<ChatInfo />} />
            <Route path="/security-info" element={<SecurityInfo />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SocketProvider>
  </QueryClientProvider>
);

export default App;

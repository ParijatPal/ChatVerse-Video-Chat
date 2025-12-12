import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useSocketContext } from "@/context/SocketContext";

interface ChatPanelProps {
  roomId: string;
}

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
}

export const ChatPanel = ({ roomId }: ChatPanelProps) => {
  const { emit, on } = useSocketContext();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Welcome to the call!",
      sender: "System",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  // Listen for incoming messages via Socket.IO
  useEffect(() => {
    const unsubscribe = on("receive-message", (data: any) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: data.message,
        sender: data.senderName,
        timestamp: new Date(data.timestamp),
      };
      setMessages((prev) => [...prev, newMessage]);
    });

    return unsubscribe;
  }, [on]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Emit message via Socket.IO
    emit("send-message", {
      roomId,
      message: inputValue,
      senderName: "You",
    });

    // Add to local messages immediately for UX
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "You",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Chat</h3>
        <p className="text-xs text-muted-foreground">Room: {roomId}</p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-foreground">
                  {message.sender}
                </span>
                <span className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm text-foreground/90">{message.text}</p>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} className="p-2">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

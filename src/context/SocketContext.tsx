import { createContext, useContext, ReactNode } from "react";
import { useSocket } from "@/hooks/useSocket";
import { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  emit: (event: string, data?: any, callback?: (response: any) => void) => void;
  on: (event: string, handler: (...args: any[]) => void) => () => void;
  once: (event: string, handler: (...args: any[]) => void) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{
  children: ReactNode;
  socketUrl?: string;
}> = ({ children, socketUrl = "http://localhost:3001" }) => {
  const { socket, emit, on, once } = useSocket({
    url: socketUrl,
    autoConnect: true,
  });

  const value: SocketContextType = {
    socket,
    emit,
    on,
    once,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within SocketProvider");
  }
  return context;
};

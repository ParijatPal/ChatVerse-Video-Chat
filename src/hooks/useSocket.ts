import { useEffect, useRef, useCallback, useState } from "react";
import io, { Socket } from "socket.io-client";

interface UseSocketOptions {
  url?: string;
  autoConnect?: boolean;
}

export const useSocket = (options: UseSocketOptions = {}) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { url = "http://localhost:3001", autoConnect = true } = options;

  // Initialize socket connection
  useEffect(() => {
    if (!autoConnect) return;

    socketRef.current = io(url, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current?.id);
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socketRef.current.on("error", (error) => {
      console.error("Socket error:", error);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [url, autoConnect]);

  // Emit event with connection check
  const emit = useCallback(
    (event: string, data?: any, callback?: (response: any) => void) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit(event, data, callback);
      } else {
        console.warn(`Socket not connected. Cannot emit event: ${event}`);
      }
    },
    []
  );

  // Listen to event
  const on = useCallback((event: string, handler: (...args: any[]) => void) => {
    socketRef.current?.on(event, handler);

    // Return unsubscribe function
    return () => {
      socketRef.current?.off(event, handler);
    };
  }, []);

  // Listen to event once
  const once = useCallback((event: string, handler: (...args: any[]) => void) => {
    socketRef.current?.once(event, handler);
  }, []);

  // Get socket instance
  const getSocket = useCallback(() => socketRef.current, []);

  return {
    socket: socketRef.current,
    isConnected,
    emit,
    on,
    once,
    getSocket,
  };
};
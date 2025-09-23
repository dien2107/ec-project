import { useRef, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

export const useSocket = (): Socket | null => {
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io(import.meta.env.VITE_API_BASE_URL);
    socketRef.current = s;
    setSocket(s);
    console.log("Connecting to socket:", import.meta.env.VITE_API_BASE_URL);

    return () => {
      if (socketRef.current) {
        socketRef.current?.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return socket;
};

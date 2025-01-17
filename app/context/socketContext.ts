import { type Socket } from "socket.io-client";
import { createContext, useContext } from "react";

export const SocketContext = createContext<Socket | null>(null);

export const useSocket = (): Socket | null => {
  const context = useContext(SocketContext);


  if (!context) {
    console.error("useSocket must be used within a SocketProvider");
  }

  return context;
};

export default SocketContext.Provider;

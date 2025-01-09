import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const SocketContext = createContext<Socket | null>(null);

export const useSocket = (): Socket | null => {
  const context = useContext(SocketContext);

  // if (!context) {
  //   throw new Error("useSocket must be used within a SocketProvider");
  // }
  return context;
};

export default SocketContext.Provider;

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType{
    socket: Socket | null,
    isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false
});

export const useSocket = () => {
    const context = useContext(SocketContext);
    if(!context){
        throw new Error(`useSocket must be used within socket provider`)
    }
    return context;
}

interface SocketProviderProps{
    children: ReactNode
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        const socketInstance = io(process.env.NEXT_PUBLIC_WS_URL, {
            transports: ["websocket", "polling"],
            upgrade: true
        });

        socketInstance.on("connect", () => {
            console.log("Connected to server");
            setIsConnected(true)
        });

        socketInstance.on("disconnect", () => {
            console.log("Disconnected from server");
            setIsConnected(false);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.close();
        }

    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface HackathonSocketData {
    postId: string;
    slotsTotal: number;
    isActive: boolean;
}

export const useHackathonSocket = (postId: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [slotsData, setSlotsData] = useState<HackathonSocketData | null>(null);

    useEffect(() => {
        // Initialize socket connection
        const socketInstance = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000', {
            withCredentials: true
        });

        // Join the room for this specific hackathon post
        socketInstance.emit('join-hackathon-room', postId);

        // Listen for slots updates
        socketInstance.on('slots-updated', (data: HackathonSocketData) => {
            setSlotsData(data);
        });

        setSocket(socketInstance);

        // Cleanup on unmount
        return () => {
            socketInstance.emit('leave-hackathon-room', postId);
            socketInstance.disconnect();
        };
    }, [postId]);

    return { socket, slotsData };
}; 
import { useEffect, useState, useCallback } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

interface HackathonSocketData {
    type: string;
    postId: string;
    slotsTotal: number;
    isActive: boolean;
}

export const useHackathonWebSocket = (postId: string) => {
    const [client, setClient] = useState<W3CWebSocket | null>(null);
    const [slotsData, setSlotsData] = useState<HackathonSocketData | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const connectWebSocket = useCallback(() => {
        const wsClient = new W3CWebSocket(
            `${process.env.REACT_APP_WS_URL || 'ws://localhost:3000'}`,
            'hackathon-protocol'
        );

        wsClient.onopen = () => {
            console.log('WebSocket Client Connected');
            setIsConnected(true);
            setError(null);
            // Join the room for this specific hackathon post
            wsClient.send(JSON.stringify({
                type: 'join-room',
                postId
            }));
        };

        wsClient.onmessage = (message) => {
            if (typeof message.data === 'string') {
                try {
                    const data = JSON.parse(message.data);
                    if (data.type === 'slots-updated') {
                        setSlotsData(data);
                    }
                } catch (error) {
                    console.error('Error parsing message:', error);
                    setError('Failed to parse message');
                }
            }
        };

        wsClient.onerror = (error) => {
            console.error('WebSocket Error:', error);
            setError('WebSocket connection error');
            setIsConnected(false);
        };

        wsClient.onclose = () => {
            console.log('WebSocket Client Closed');
            setIsConnected(false);
            // Attempt to reconnect after 5 seconds
            setTimeout(connectWebSocket, 5000);
        };

        setClient(wsClient);
    }, [postId]);

    useEffect(() => {
        connectWebSocket();

        // Cleanup on unmount
        return () => {
            if (client) {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify({
                        type: 'leave-room',
                        postId
                    }));
                }
                client.close();
            }
        };
    }, [postId, connectWebSocket]);

    const sendMessage = useCallback((message: any) => {
        if (client && client.readyState === client.OPEN) {
            client.send(JSON.stringify(message));
        } else {
            setError('WebSocket is not connected');
        }
    }, [client]);

    return { 
        client, 
        slotsData, 
        isConnected, 
        error,
        sendMessage
    };
}; 
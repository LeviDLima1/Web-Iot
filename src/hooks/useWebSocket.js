import { useState, useEffect, useRef } from 'react';

export const useWebSocket = (url = 'ws://localhost:8080') => {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const wsRef = useRef(null);

    useEffect(() => {
        // Simular WebSocket para demonstração
        // Em produção, você usaria um WebSocket real
        const simulateWebSocket = () => {
            setIsConnected(true);
            
            // Simular recebimento de mensagens
            const interval = setInterval(() => {
                const mockMessage = {
                    type: 'location_update',
                    data: {
                        petId: '00:11:22:33:44:55',
                        petName: 'Rex',
                        location: {
                            lat: -3.7135199999999 + (Math.random() - 0.5) * 0.001,
                            lng: -38.59494856653846 + (Math.random() - 0.5) * 0.001
                        },
                        timestamp: new Date().toISOString(),
                        battery: Math.floor(Math.random() * 20) + 80,
                        signal: 'strong'
                    }
                };
                
                setMessages(prev => [...prev, mockMessage]);
            }, 5000);

            return () => clearInterval(interval);
        };

        const cleanup = simulateWebSocket();
        return cleanup;
    }, []);

    const sendMessage = (message) => {
        if (isConnected) {
            console.log('Enviando mensagem via WebSocket:', message);
            // Em produção, você enviaria via wsRef.current.send()
        }
    };

    const disconnect = () => {
        if (wsRef.current) {
            wsRef.current.close();
        }
        setIsConnected(false);
    };

    return {
        isConnected,
        messages,
        error,
        sendMessage,
        disconnect
    };
}; 
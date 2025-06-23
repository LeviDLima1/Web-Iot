import { useState, useEffect, useRef } from 'react';

export const useWebSocket = (url = 'ws://localhost:8080') => {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const wsRef = useRef(null);

    useEffect(() => {
        // Remover o setInterval automático. Agora só envia localização real ao clicar no botão.
        setIsConnected(true);
        // Nenhum mock automático aqui.
        return () => {};
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
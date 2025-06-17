import { useState, useEffect } from 'react';
import { FaLocationArrow, FaWifi, FaBatteryThreeQuarters, FaPlay, FaPause, FaStop } from 'react-icons/fa';

export default function PetTrackerSimulator() {
    const [isTracking, setIsTracking] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [trackingHistory, setTrackingHistory] = useState([]);
    const [petInfo, setPetInfo] = useState({
        name: 'Rex',
        macId: '00:11:22:33:44:55',
        battery: 85,
        signal: 'strong'
    });
    const [error, setError] = useState(null);

    // Função para obter localização atual
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocalização não é suportada neste navegador');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const location = {
                    lat: latitude,
                    lng: longitude,
                    timestamp: new Date().toISOString(),
                    accuracy: position.coords.accuracy
                };

                setCurrentLocation(location);
                setError(null);

                // Adicionar ao histórico
                setTrackingHistory(prev => [...prev, location]);

                // Enviar dados para o servidor (simulado)
                sendLocationData(location);
            },
            (error) => {
                setError(`Erro ao obter localização: ${error.message}`);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    // Função para enviar dados de localização
    const sendLocationData = async (location) => {
        try {
            // Simular envio para servidor
            const data = {
                petId: petInfo.macId,
                petName: petInfo.name,
                location: location,
                battery: petInfo.battery,
                signal: petInfo.signal,
                timestamp: new Date().toISOString()
            };

            console.log('Enviando dados de localização:', data);

            // Aqui você implementaria a chamada real para sua API
            // await fetch('/api/pet-location', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });

            // Simular consumo de bateria
            setPetInfo(prev => ({
                ...prev,
                battery: Math.max(0, prev.battery - 0.1)
            }));

        } catch (error) {
            console.error('Erro ao enviar dados:', error);
        }
    };

    // Iniciar rastreamento
    const startTracking = () => {
        setIsTracking(true);
        getCurrentLocation();
    };

    // Parar rastreamento
    const stopTracking = () => {
        setIsTracking(false);
        setCurrentLocation(null);
    };

    // Pausar rastreamento
    const pauseTracking = () => {
        setIsTracking(false);
    };

    // Atualização contínua quando rastreamento está ativo
    useEffect(() => {
        let interval;
        if (isTracking) {
            interval = setInterval(() => {
                getCurrentLocation();
            }, 5000); // Atualizar a cada 5 segundos
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isTracking]);

    return (
        <div className="min-h-screen p-4 bg-gradient-to-br from-primary-50 to-primary-100">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="p-6 mb-6 bg-white shadow-lg rounded-2xl">
                    <div className="text-center">
                        <h1 className="mb-2 text-2xl font-bold text-gray-800">Coleira IoT Simulator</h1>
                        <p className="text-gray-600">Simule uma coleira IoT com seu smartphone</p>
                    </div>
                </div>

                {/* Informações do Pet */}
                <div className="p-6 mb-6 bg-white shadow-lg rounded-2xl">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">Informações do Pet</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Nome:</span>
                            <span className="font-medium">{petInfo.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">ID da Coleira:</span>
                            <span className="font-mono text-sm">{petInfo.macId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Bateria:</span>
                            <div className="flex items-center">
                                <FaBatteryThreeQuarters className="mr-1" />
                                <span className={petInfo.battery > 20 ? 'text-green-600' : 'text-red-600'}>
                                    {petInfo.battery.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Sinal:</span>
                            <div className="flex items-center">
                                <FaWifi className="mr-1" />
                                <span className="text-green-600 capitalize">{petInfo.signal}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controles */}
                <div className="p-6 mb-6 bg-white shadow-lg rounded-2xl">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">Controles</h2>
                    <div className="flex space-x-3">
                        <button
                            onClick={startTracking}
                            disabled={isTracking}
                            className="flex items-center justify-center flex-1 px-4 py-3 text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            <FaPlay className="mr-2" />
                            Iniciar
                        </button>
                        <button
                            onClick={pauseTracking}
                            disabled={!isTracking}
                            className="flex items-center justify-center flex-1 px-4 py-3 text-white transition-colors bg-yellow-500 rounded-lg hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            <FaPause className="mr-2" />
                            Pausar
                        </button>
                        <button
                            onClick={stopTracking}
                            className="flex items-center justify-center flex-1 px-4 py-3 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
                        >
                            <FaStop className="mr-2" />
                            Parar
                        </button>
                    </div>
                </div>

                {/* Localização Atual */}
                {currentLocation && (
                    <div className="p-6 mb-6 bg-white shadow-lg rounded-2xl">
                        <h2 className="mb-4 text-lg font-semibold text-gray-800">Localização Atual</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Latitude:</span>
                                <span className="font-mono text-sm">{currentLocation.lat.toFixed(6)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Longitude:</span>
                                <span className="font-mono text-sm">{currentLocation.lng.toFixed(6)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Precisão:</span>
                                <span className="text-sm">±{currentLocation.accuracy.toFixed(1)}m</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Última atualização:</span>
                                <span className="text-sm">{new Date(currentLocation.timestamp).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Status */}
                <div className="p-6 mb-6 bg-white shadow-lg rounded-2xl">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">Status</h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Rastreamento:</span>
                            <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-2 ${isTracking ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                <span className={isTracking ? 'text-green-600' : 'text-gray-600'}>
                                    {isTracking ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Pontos enviados:</span>
                            <span className="font-medium">{trackingHistory.length}</span>
                        </div>
                    </div>
                </div>

                {/* Erro */}
                {error && (
                    <div className="p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {/* Histórico */}
                {trackingHistory.length > 0 && (
                    <div className="p-6 bg-white shadow-lg rounded-2xl">
                        <h2 className="mb-4 text-lg font-semibold text-gray-800">Histórico Recente</h2>
                        <div className="space-y-2 overflow-y-auto max-h-40">
                            {trackingHistory.slice(-5).reverse().map((location, index) => (
                                <div key={index} className="p-3 rounded-lg bg-gray-50">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-mono">
                                            {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                                        </span>
                                        <span className="text-gray-500">
                                            {new Date(location.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 
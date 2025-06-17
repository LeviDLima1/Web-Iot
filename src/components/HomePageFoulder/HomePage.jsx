import Header from "../HeaderFoulder/Header";
import MapRender from "../HomePageFoulder/MapRender";
import RegistredPets from "./RegistredPets";
import DashboardStatsCards from "./DashboardStatsCards";
import RecentAlertsSection from "./RecentAlertsSection";
import RealTimeUpdatesSection from "./RealTimeUpdatesSection";
import { FaClock, FaWifi } from 'react-icons/fa';
import { useState, useEffect, useRef, useCallback, useReducer } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useNotification } from '../../hooks/NotificationContext';
import { usePet } from '../../hooks/PetContext'; // Importa o hook usePet
import { useNavigate } from 'react-router-dom';

// Reducer for realTimeUpdates
const realTimeUpdatesReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_UPDATE':
            // Add new update to the beginning, keep only the 5 most recent
            return [action.payload, ...state].slice(0, 5);
        case 'UPDATE_UPDATE_ADDRESS': // Nova ação para atualizar endereço de uma entrada existente
            return state.map(update =>
                update.petId === action.payload.petId && update.timestamp === action.payload.timestamp
                    ? { ...update, address: action.payload.address }
                    : update
            );
        default:
            return state;
    }
};

export default function HomePage() {
    const { isConnected, messages, sendMessage } = useWebSocket();
    const { addNotification } = useNotification();
    const { allPets, updatePetLocation, updatePetAddress, updatePetHomeArea, updatePet, deletePet } = usePet(); // Usa o hook usePet
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState({
        totalPets: allPets.length, // Usa allPets do contexto
        onlinePets: allPets.filter(p => p.isOnline).length, // Usa allPets do contexto
        offlinePets: allPets.filter(p => !p.isOnline).length, // Usa allPets do contexto
        alertsToday: 0,
        safePets: allPets.filter(p => p.isOnline && p.homeArea).length, // Usa allPets do contexto
        atRiskPets: 0,
        lastUpdate: new Date().toLocaleTimeString()
    });

    const [realTimeUpdates, dispatchRealTimeUpdates] = useReducer(realTimeUpdatesReducer, []);
    const [selectedPetHistory, setSelectedPetHistory] = useState(null);
    const [expandedPets, setExpandedPets] = useState([]);

    const petInZoneStatus = useRef({});
    const lastProcessedMessageIndex = useRef(-1);

    // Inicializa petInZoneStatus com base nos petsData (agora allPets do contexto)
    useEffect(() => {
        const initialStatus = {};
        allPets.forEach(pet => {
            initialStatus[pet.macId] = true;
        });
        petInZoneStatus.current = initialStatus;
    }, [allPets]); // Adiciona allPets como dependência

    const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setDashboardData(prev => ({
                ...prev,
                lastUpdate: new Date().toLocaleTimeString()
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Função para obter rua e bairro a partir de lat/lng (Geocodificação Reversa)
    const getStreetAndNeighborhood = useCallback(async (lat, lng) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
            const data = await response.json();
            if (data && data.address) {
                return {
                    road: data.address.road || 'N/A',
                    suburb: data.address.suburb || data.address.city_district || data.address.town || data.address.village || 'N/A',
                    display_name: data.display_name || 'N/A'
                };
            }
            return null;
        } catch (error) {
            console.error("Erro na geocodificação reversa:", error);
            return null;
        }
    }, []);

    // Main useEffect to process WebSocket messages
    useEffect(() => {
        // Only process if there are new messages
        if (messages.length <= lastProcessedMessageIndex.current) {
            return;
        }

        const processNewMessages = async () => {
            // Process messages from the last processed index + 1 to the current end
            for (let i = lastProcessedMessageIndex.current + 1; i < messages.length; i++) {
                const currentMessage = messages[i];

                if (currentMessage.type === 'location_update') {
                    const { petId, location } = currentMessage.data;

                    // Encontra o pet correspondente
                    const petToUpdate = allPets.find(p => p.macId === petId);
                    if (!petToUpdate) {
                        console.warn(`Pet com ID ${petId} não encontrado.`);
                        continue; // Pula para a próxima mensagem se o pet não for encontrado
                    }

                    // Atualiza a localização do pet usando a função do contexto
                    updatePetLocation(petId, location);

                    // Geofencing logic usando a homeArea do pet
                    const petToUpdateForGeofencing = allPets.find(p => p.macId === petId);
                    if (!petToUpdateForGeofencing) {
                        console.warn(`Pet com ID ${petId} não encontrado para geofencing.`);
                        return; // Sai da função se o pet não for encontrado para geofencing
                    }

                    const homeAreaLat = petToUpdateForGeofencing.homeArea.lat;
                    const homeAreaLng = petToUpdateForGeofencing.homeArea.lng;
                    const homeAreaRadius = petToUpdateForGeofencing.homeArea.radius; // Raio em metros

                    const distance = calculateDistance(
                        homeAreaLat,
                        homeAreaLng,
                        location.lat,
                        location.lng
                    );

                    const isInsideZone = distance <= (homeAreaRadius / 1000);

                    if (isInsideZone) {
                        if (petInZoneStatus.current[petId] === false) {
                            setDashboardData(prev => ({
                                ...prev,
                                safePets: prev.safePets + 1,
                                atRiskPets: prev.atRiskPets - 1,
                            }));
                            addNotification(`Pet ${petToUpdateForGeofencing.name} voltou para a área segura.`, 'success');
                        }
                        petInZoneStatus.current[petId] = true;
                    } else {
                        if (petInZoneStatus.current[petId] !== false) {
                            setDashboardData(prev => ({
                                ...prev,
                                alertsToday: prev.alertsToday + 1,
                                safePets: prev.safePets - 1,
                                atRiskPets: prev.atRiskPets + 1,
                            }));
                            addNotification(`ALERTA: Pet ${petToUpdateForGeofencing.name} saiu da área segura! Distância: ${distance.toFixed(2)} km`, 'error');
                        }
                        petInZoneStatus.current[petId] = false;
                    }

                    const newRealTimeUpdateEntry = { ...currentMessage.data, timestamp: new Date().toISOString() };
                    dispatchRealTimeUpdates({ type: 'ADD_UPDATE', payload: newRealTimeUpdateEntry });

                    getStreetAndNeighborhood(location.lat, location.lng)
                        .then(address => {
                            if (address) {
                                updatePetAddress(petId, address); // Atualiza o endereço do pet usando a função do contexto
                                dispatchRealTimeUpdates({
                                    type: 'UPDATE_UPDATE_ADDRESS',
                                    payload: { petId, timestamp: newRealTimeUpdateEntry.timestamp, address }
                                });
                            }
                        })
                        .catch(error => {
                            console.error("Erro ao buscar endereço para realTimeUpdate:", error);
                            addNotification("Erro ao buscar endereço para atualização.", 'error');
                        });
                }
            }
            lastProcessedMessageIndex.current = messages.length - 1;
        };

        processNewMessages();

    }, [messages, calculateDistance, getStreetAndNeighborhood, allPets, addNotification, updatePetLocation, updatePetAddress]); // Adiciona dependências do contexto

    // useEffect para atualizar dashboardData quando allPets muda
    useEffect(() => {
        setDashboardData(prev => ({
            ...prev,
            totalPets: allPets.length, // Atualiza totalPets
            onlinePets: allPets.filter(p => p.isOnline).length,
            offlinePets: allPets.filter(p => !p.isOnline).length, // Corrigido para contar offline corretamente
        }));
    }, [allPets]); // Depende apenas de allPets

    const toggleExpand = useCallback((petId) => {
        setExpandedPets(prev =>
            prev.includes(petId) ? prev.filter(id => id !== petId) : [...prev, petId]
        );
    }, []);

    const handleViewHistory = useCallback((petId) => {
        const pet = allPets.find(p => p.macId === petId); // Usa allPets do contexto
        if (pet && pet.locationHistory) {
            setSelectedPetHistory(pet.locationHistory);
            console.log(`Visualizando histórico para ${pet.name}:`, pet.locationHistory);
        } else {
            setSelectedPetHistory(null);
            console.log(`Histórico não encontrado para o petId: ${petId}`);
        }
    }, [allPets]); // Adiciona allPets como dependência

    const handleUpdateHomeArea = useCallback((petId, newHomeArea) => {
        updatePetHomeArea(petId, newHomeArea); // Usa a função do contexto
        addNotification(`Zona segura atualizada para ${petId}.`, 'success');
    }, [addNotification, updatePetHomeArea]); // Adiciona updatePetHomeArea como dependência

    const handleEditPet = useCallback((pet) => {
        // Navega para a página de edição do pet
        navigate(`/edit-pet/${pet.id}`);
    }, [navigate]);

    const handleDeletePet = useCallback((petId) => {
        deletePet(petId);
        addNotification('Pet removido com sucesso!', 'success');
    }, [deletePet, addNotification]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
            <Header />

            {/* Dashboard Header */}
            <div className="px-6 py-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="mb-2 text-3xl font-bold text-gray-800">Dashboard</h1>
                                <p className="text-gray-600">Monitoramento em tempo real dos seus pets</p>
                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                    <FaClock className="mr-1" />
                                    Última atualização: {dashboardData.lastUpdate}
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center text-sm">
                                    <FaWifi className={`mr-1 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
                                    <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
                                        {isConnected ? 'Conectado' : 'Desconectado'}
                                    </span>
                                </div>
                                <a
                                    href="/simulator"
                                    className="px-4 py-2 text-sm text-white transition-colors rounded-lg bg-primary-400 hover:bg-primary-500"
                                >
                                    Testar Coleira
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Cards de Estatísticas */}
                    <DashboardStatsCards dashboardData={dashboardData} />

                    {/* Área Principal */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Mapa */}
                        <div className="lg:col-span-2">
                            <div className="p-6 bg-white shadow-lg rounded-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800">Localização em Tempo Real</h2>
                                    <div className="flex items-center space-x-4 text-sm">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 mr-2 bg-green-500 rounded-full"></div>
                                            <span>Online</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 mr-2 bg-red-500 rounded-full"></div>
                                            <span>Offline</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-[500px] rounded-xl overflow-hidden">
                                    <MapRender pets={allPets} historyPath={selectedPetHistory} />
                                </div>
                            </div>
                        </div>

                        {/* Lista de Pets */}
                        <div className="lg:col-span-1">
                            <div className="p-6 bg-white shadow-lg rounded-2xl h-[500px]">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800">Seus Pets</h2>
                                    <div className="text-sm text-gray-500">
                                        {dashboardData.onlinePets}/{dashboardData.totalPets} online
                                    </div>
                                </div>
                                <div className="h-[400px] overflow-y-auto">
                                    <RegistredPets 
                                        pets={allPets} 
                                        toggleExpand={toggleExpand} 
                                        expandedPets={expandedPets} 
                                        onViewHistory={handleViewHistory} 
                                        onUpdateHomeArea={handleUpdateHomeArea}
                                        onEditPet={handleEditPet}
                                        onDeletePet={handleDeletePet}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Área de Alertas Recentes */}
                    <div className="mt-8">
                        <RecentAlertsSection 
                            alertsToday={dashboardData.alertsToday} 
                            atRiskPets={dashboardData.atRiskPets} 
                        />
                    </div>

                    {/* Atualizações em Tempo Real */}
                    <div className="mt-8">
                        <RealTimeUpdatesSection realTimeUpdates={realTimeUpdates} />
                    </div>
                </div>
            </div>
        </div>
    );
}
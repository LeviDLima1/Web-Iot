import Header from "../HeaderFoulder/Header";
import MapRender from "../HomePageFoulder/MapRender";
import RegistredPets from "./RegistredPets";
import DashboardStatsCards from "./DashboardStatsCards";
import RecentAlertsSection from "./RecentAlertsSection";
import RealTimeUpdatesSection from "./RealTimeUpdatesSection";
import { FaClock, FaWifi } from 'react-icons/fa';
import { useState, useEffect, useRef, useCallback, useReducer } from 'react';
import { useNotification } from '../../hooks/NotificationContext';
import { usePet } from '../../hooks/PetContext'; // Importa o hook usePet
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../api';

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

// Função utilitária para normalizar MAC ID (remove ':' e '-', deixa tudo minúsculo)
function normalizeMacId(mac) {
    return (mac || '').toLowerCase().replace(/[:\-]/g, '');
}

export default function HomePage() {
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
    const [selectedPetOnMap, setSelectedPetOnMap] = useState(null);
    const [recentAlerts, setRecentAlerts] = useState([]);

    const petInZoneStatus = useRef({});
    const lastInZoneRef = useRef(null);

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

    // POLLING: Buscar localização apenas do pet selecionado
    useEffect(() => {
        if (!selectedPetOnMap) return;
        const pet = allPets.find(p => p.macId === selectedPetOnMap);
        if (!pet) return;

        const interval = setInterval(async () => {
            try {
                // Troca o fetch direto pelo apiGet
                const updatedPet = await apiGet(`/pets/${pet.id}`);
                if (updatedPet.location) {
                    updatePetLocation(pet.macId, updatedPet.location);
                    // Buscar endereço (rua) via geocodificação reversa
                    let address = null;
                    try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${updatedPet.location.lat}&lon=${updatedPet.location.lng}&zoom=18&addressdetails=1`);
                        const data = await res.json();
                        if (data && data.address) {
                            address = {
                                road: data.address.road || '',
                                suburb: data.address.suburb || '',
                                display_name: data.address.display_name || ''
                            };
                        }
                    } catch (err) {
                        address = null;
                    }
                    // --- ALERTA: Detectar se saiu/entrou na zona segura ---
                    let isInZone = true;
                    if (pet.homeArea && pet.homeArea.lat && pet.homeArea.lng && pet.homeArea.radius) {
                        const R = 6371000;
                        const dLat = (updatedPet.location.lat - pet.homeArea.lat) * Math.PI / 180;
                        const dLon = (updatedPet.location.lng - pet.homeArea.lng) * Math.PI / 180;
                        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                            Math.cos(pet.homeArea.lat * Math.PI / 180) * Math.cos(updatedPet.location.lat * Math.PI / 180) *
                            Math.sin(dLon / 2) * Math.sin(dLon / 2);
                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                        const distancia = R * c;
                        isInZone = distancia <= pet.homeArea.radius;
                    }
                    if (lastInZoneRef.current === null) {
                        // Primeira verificação ao selecionar o pet
                        if (!isInZone) {
                            addNotification(`ALERTA: Pet ${pet.name} está fora da zona segura!`, 'error', 6000);
                            setRecentAlerts(prev => [
                                {
                                    petName: pet.name,
                                    time: new Date().toLocaleTimeString(),
                                    type: 'danger',
                                    address: address?.road || '',
                                },
                                ...prev
                            ].slice(0, 5));
                        }
                    }
                    if (lastInZoneRef.current !== null && lastInZoneRef.current !== isInZone) {
                        const alertType = isInZone ? 'success' : 'danger';
                        const alertMsg = isInZone
                            ? `Pet ${pet.name} voltou para a zona segura.`
                            : `ALERTA: Pet ${pet.name} saiu da zona segura!`;
                        addNotification(alertMsg, alertType === 'danger' ? 'error' : 'success', 6000);
                        setRecentAlerts(prev => [
                            {
                                petName: pet.name,
                                time: new Date().toLocaleTimeString(),
                                type: alertType,
                                address: address?.road || '',
                            },
                            ...prev
                        ].slice(0, 5));
                    }
                    lastInZoneRef.current = isInZone;
                            dispatchRealTimeUpdates({
                        type: 'ADD_UPDATE',
                        payload: {
                            petId: pet.macId,
                            petName: pet.name,
                            location: updatedPet.location,
                            address: address,
                            timestamp: new Date().toISOString(),
                            battery: updatedPet.battery || 100
                        }
                    });
                }
            } catch (err) {
                console.error('Erro ao buscar localização do pet selecionado:', err);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [selectedPetOnMap, allPets, updatePetLocation, addNotification]);

    if (!Array.isArray(allPets) || allPets.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <h2 className="mb-4 text-2xl font-bold text-gray-700">Nenhum pet cadastrado</h2>
                <p className="mb-6 text-gray-500">Cadastre um pet para começar a monitorar!</p>
                <button
                    onClick={() => navigate('/register-pet')}
                    className="px-6 py-3 font-semibold text-white bg-green-500 rounded-xl transition hover:bg-green-600"
                >
                    Cadastrar Pet
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Dashboard Header */}
            <div className="px-6 py-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
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
                                    <FaWifi className={`mr-1`} />
                                    <span>
                                        
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cards de Estatísticas */}
                    <DashboardStatsCards dashboardData={dashboardData} />

                    {/* Área Principal */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Mapa */}
                        <div className="lg:col-span-2">
                            <div className="p-6 bg-white rounded-2xl shadow-lg">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800">Localização em Tempo Real</h2>
                                    <div className="flex items-center space-x-4 text-sm">
                                        <div className="flex items-center">
                                            <div className="mr-2 w-3 h-3 bg-green-500 rounded-full"></div>
                                            <span>Online</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="mr-2 w-3 h-3 bg-red-500 rounded-full"></div>
                                            <span>Offline</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-[500px] rounded-xl overflow-hidden">
                                    <MapRender pets={allPets} historyPath={selectedPetHistory} selectedPetMacId={selectedPetOnMap} />
                                </div>
                            </div>
                        </div>

                        {/* Lista de Pets */}
                        <div className="lg:col-span-1">
                            <div className="p-6 bg-white shadow-lg rounded-2xl h-[500px]">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800">Seus Pets</h2>
                                    <div className="text-sm text-gray-500">
                                        {dashboardData.onlinePets}/{dashboardData.totalPets} online
                                    </div>
                                </div>
                                <div className="h-[400px] overflow-y-auto">
                                    <RegistredPets 
                                        pets={allPets} 
                                        expandedPets={expandedPets} 
                                        toggleExpand={(petId) =>
                                            setExpandedPets(prev =>
                                                prev.includes(petId) ? prev.filter(id => id !== petId) : [...prev, petId]
                                            )
                                        }
                                        onShowOnMap={setSelectedPetOnMap}
                                        selectedPetMacId={selectedPetOnMap}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Área de Alertas Recentes */}
                    <div className="mt-8">
                        <RecentAlertsSection alerts={recentAlerts} />
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
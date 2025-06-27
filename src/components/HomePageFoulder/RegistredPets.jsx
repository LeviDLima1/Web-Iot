import logo from "../../assets/Header-assets/Logo.png"
import { FaAngleDown, FaCircle } from "react-icons/fa6";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

// Função para obter rua a partir de lat/lng (geocodificação reversa)
async function getStreetAndNeighborhood(lat, lng) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
        const data = await response.json();
        if (data && data.address) {
            return data.address.road || data.display_name || 'N/A';
        }
        return 'N/A';
    } catch {
        return 'N/A';
    }
}

function tempoRelativo(dateString) {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutos = Math.floor(diff / 60000);
    if (minutos < 1) return 'agora mesmo';
    if (minutos === 1) return 'há 1 minuto';
    if (minutos < 60) return `há ${minutos} minutos`;
    const horas = Math.floor(minutos / 60);
    if (horas === 1) return 'há 1 hora';
    if (horas < 24) return `há ${horas} horas`;
    return new Date(dateString).toLocaleString();
}

export default function RegistredPets({ pets, toggleExpand, expandedPets, onViewHistory, onUpdateHomeArea, onEditPet, onDeletePet, onShowOnMap, selectedPetMacId }) {
    const navigate = useNavigate();

    const getOnlineStatusColor = (isOnline) => {
        return isOnline ? 'text-green-500' : 'text-red-500';
    };

    const handleEditPet = (pet) => {
        if (onEditPet) {
            onEditPet(pet);
        } else {
            // Fallback: navegar para página de edição
            navigate(`/edit-pet/${pet.id}`);
        }
    };

    const handleDeletePet = (pet) => {
        if (window.confirm(`Tem certeza que deseja remover o pet "${pet.name}"? Esta ação não pode ser desfeita.`)) {
            if (onDeletePet) {
                onDeletePet(pet.id);
            }
        }
    };

    return (
        <div className="space-y-3">
            {pets.map((p) => {
                const [rua, setRua] = useState('');
                useEffect(() => {
                    if (p.location && p.location.lat && p.location.lng) {
                        getStreetAndNeighborhood(p.location.lat, p.location.lng).then(setRua);
                    }
                }, [p.location]);
                const isSelected = selectedPetMacId === p.macId;
                return (
                    <div
                        key={p.id}
                        className={`bg-gray-50 rounded-xl border transition-all cursor-pointer hover:bg-gray-100 ${isSelected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'}`}
                        onClick={() => onShowOnMap(p.macId)}
                    >
                        <div className="flex justify-between items-center px-4 py-3">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <img src={logo} alt={p.name} className="w-10 h-10 rounded-full" />
                                    <FaCircle 
                                        className={`absolute -bottom-1 -right-1 w-3 h-3 ${getOnlineStatusColor(p.isOnline)}`} 
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="font-semibold text-gray-800">{p.name}</h3>
                                    {p.location && p.location.lat && p.location.lng ? (
                                        <>
                                            <span className="text-xs text-gray-600">Rua: {rua || 'Carregando...'}</span>
                                            <span className="text-xs text-gray-500">{tempoRelativo(p.location.updatedAt)}</span>
                                        </>
                                    ) : (
                                        <span className="text-xs text-gray-400">Localização não recebida</span>
                                    )}
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p>{p.breed} • {p.age}</p>
                                </div>
                            </div>
                            <div 
                                className="flex justify-center items-center w-8 h-8 rounded-full transition-all cursor-pointer hover:bg-gray-200"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleExpand(p.id);
                                }}
                            >
                                <FaAngleDown className={`w-4 h-4 transition-transform duration-300 ${expandedPets.includes(p.id) ? 'rotate-180' : ''}`} />
                            </div>
                        </div>
                        
                        {/* Informações expandidas */}
                        {expandedPets.includes(p.id) && (
                            <div className="px-4 py-3 bg-white border-t border-gray-200">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">ID da Coleira:</span>
                                        <span className="font-mono text-gray-800">{p.macId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">Última atualização:</span>
                                        <span className="text-gray-800">{p.lastUpdate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">Conexão:</span>
                                        <span className={getOnlineStatusColor(p.isOnline)}>
                                            {p.isOnline ? 'Online' : 'Offline'}
                                        </span>
                                    </div>

                                    {/* Configuração da Zona Segura */}
                                    <h4 className="mt-4 mb-2 font-semibold text-gray-800 text-md">Zona Segura:</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <label htmlFor={`lat-${p.macId}`} className="w-1/4 text-gray-600">Latitude:</label>
                                            <input
                                                id={`lat-${p.macId}`}
                                                type="number"
                                                step="any"
                                                value={p.homeArea?.lat ?? ""}
                                                onChange={(e) => onUpdateHomeArea(p.macId, { ...(p.homeArea || {}), lat: parseFloat(e.target.value) || 0 })}
                                                className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-400"
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <label htmlFor={`lng-${p.macId}`} className="w-1/4 text-gray-600">Longitude:</label>
                                            <input
                                                id={`lng-${p.macId}`}
                                                type="number"
                                                step="any"
                                                value={p.homeArea?.lng ?? ""}
                                                onChange={(e) => onUpdateHomeArea(p.macId, { ...(p.homeArea || {}), lng: parseFloat(e.target.value) || 0 })}
                                                className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-400"
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <label htmlFor={`radius-${p.macId}`} className="w-1/4 text-gray-600">Raio (m):</label>
                                            <input
                                                id={`radius-${p.macId}`}
                                                type="number"
                                                step="any"
                                                value={p.homeArea?.radius ?? ""}
                                                onChange={(e) => onUpdateHomeArea(p.macId, { ...(p.homeArea || {}), radius: parseFloat(e.target.value) || 0 })}
                                                className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Botões de Ação */}
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (typeof onViewHistory === 'function') {
                                                    onViewHistory(p.macId);
                                                }
                                            }}
                                            className="flex-1 px-3 py-2 text-xs font-medium text-white rounded-lg transition-colors cursor-pointer bg-primary-400 hover:bg-primary-500"
                                        >
                                            Ver Histórico
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
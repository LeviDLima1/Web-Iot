import logo from "../../assets/Header-assets/Logo.png"
import { FaAngleDown, FaCircle } from "react-icons/fa6";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function RegistredPets({ pets, toggleExpand, expandedPets, onViewHistory, onUpdateHomeArea, onEditPet, onDeletePet }) {
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
            {pets.map((p) => (
                <div key={p.id} className="transition-all border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <img src={logo} alt={p.name} className="w-10 h-10 rounded-full" />
                                <FaCircle 
                                    className={`absolute -bottom-1 -right-1 w-3 h-3 ${getOnlineStatusColor(p.isOnline)}`} 
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">{p.name}</h3>
                                <div className="text-sm text-gray-600">
                                    <p>{p.breed} • {p.age}</p>
                                </div>
                            </div>
                        </div>
                        <div 
                            className="flex items-center justify-center w-8 h-8 transition-all rounded-full cursor-pointer hover:bg-gray-200"
                            onClick={() => toggleExpand(p.id)}
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
                                            value={p.homeArea.lat}
                                            onChange={(e) => onUpdateHomeArea(p.macId, { ...p.homeArea, lat: parseFloat(e.target.value) || 0 })}
                                            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <label htmlFor={`lng-${p.macId}`} className="w-1/4 text-gray-600">Longitude:</label>
                                        <input
                                            id={`lng-${p.macId}`}
                                            type="number"
                                            step="any"
                                            value={p.homeArea.lng}
                                            onChange={(e) => onUpdateHomeArea(p.macId, { ...p.homeArea, lng: parseFloat(e.target.value) || 0 })}
                                            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <label htmlFor={`radius-${p.macId}`} className="w-1/4 text-gray-600">Raio (m):</label>
                                        <input
                                            id={`radius-${p.macId}`}
                                            type="number"
                                            step="any"
                                            value={p.homeArea.radius}
                                            onChange={(e) => onUpdateHomeArea(p.macId, { ...p.homeArea, radius: parseFloat(e.target.value) || 0 })}
                                            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                                        />
                                    </div>
                                </div>

                                {/* Botões de Ação */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <button
                                        onClick={() => onViewHistory(p.macId)}
                                        className="flex-1 px-3 py-2 text-xs font-medium text-white transition-colors rounded-lg bg-primary-400 hover:bg-primary-500"
                                    >
                                        Ver Histórico
                                    </button>
                                    <button
                                        onClick={() => handleEditPet(p)}
                                        className="px-3 py-2 text-xs font-medium text-blue-600 transition-colors bg-blue-100 rounded-lg hover:bg-blue-200"
                                    >
                                        <FaEdit className="inline w-3 h-3 mr-1" />
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDeletePet(p)}
                                        className="px-3 py-2 text-xs font-medium text-red-600 transition-colors bg-red-100 rounded-lg hover:bg-red-200"
                                    >
                                        <FaTrash className="inline w-3 h-3 mr-1" />
                                        Remover
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
            <button
                onClick={() => navigate('/register-pet')}
                className="w-full px-4 py-2 mt-4 text-sm font-medium text-white transition-colors bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
            >
                Adicionar Novo Pet
            </button>
        </div>
    )
}
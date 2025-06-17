import React from 'react';
import logo from "../../assets/Header-assets/Logo.png";
import { FaAngleDown, FaCircle } from "react-icons/fa6";
import { getStatusColor, getOnlineStatusColor } from './PetUtils';

export default function PetListItem({ pet, isExpanded, onToggleExpand }) {
    return (
        <div className="transition-all border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <img src={logo} alt={pet.name} className="w-10 h-10 rounded-full" />
                        <FaCircle 
                            className={`absolute -bottom-1 -right-1 w-3 h-3 ${getOnlineStatusColor(pet.isOnline)}`} 
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">{pet.name}</h3>
                        <div className="text-sm text-gray-600">
                            <p>{pet.breed} • {pet.age}</p>
                        </div>
                    </div>
                </div>
                <div 
                    className="flex items-center justify-center w-8 h-8 transition-all rounded-full cursor-pointer hover:bg-gray-200"
                    onClick={() => onToggleExpand(pet.id)}
                >
                    <FaAngleDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </div>
            
            {/* Informações expandidas */}
            {isExpanded && (
                <div className="px-4 py-3 bg-white border-t border-gray-200">
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">ID da Coleira:</span>
                            <span className="font-mono text-gray-800">{pet.macId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Última atualização:</span>
                            <span className="text-gray-800">{pet.lastUpdate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Status:</span>
                            <span className={getStatusColor(pet.status)}>
                                {pet.status}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Conexão:</span>
                            <span className={getOnlineStatusColor(pet.isOnline)}>
                                {pet.isOnline ? 'Online' : 'Offline'}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 
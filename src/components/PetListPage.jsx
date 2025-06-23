import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/Header-assets/Logo.png";
import { FaCircle, FaAngleDown, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { usePet } from '../hooks/PetContext';

function getOnlineStatusColor(isOnline) {
    return isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
}

function getOnlineStatusText(isOnline) {
    return isOnline ? 'Online' : 'Offline';
}

export default function PetListPage() {
    const [expanded, setExpanded] = useState([]);
    const navigate = useNavigate();
    const { allPets, updatePet, deletePet } = usePet();

    const toggleExpand = (id) => {
        setExpanded((prev) =>
            prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
        );
    };

    const handleEdit = (petId) => {
        navigate(`/edit-pet/${petId}`);
    };

    const handleDelete = (petId, petName) => {
        if (window.confirm(`Tem certeza que deseja remover o pet "${petName}"? Esta ação não pode ser desfeita.`)) {
            deletePet(petId);
        }
    };

    return (
        <div className='bg-zinc-100'>
            <div className="px-2 py-10 mx-auto max-w-3xl">
                <div className="flex flex-col gap-4 mb-10 sm:flex-row sm:justify-between sm:items-center">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">Pets Cadastrados</h1>
                    <div className='flex gap-7'>
                        <button
                            onClick={() => navigate('/')}
                            className="flex gap-2 items-center px-5 py-2.5 text-base cursor-pointer font-semibold text-white rounded-lg shadow-lg bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-gray-800"
                        >
                            Início
                        </button>
                        <button
                            onClick={() => navigate('/register-pet')}
                            className="flex gap-2 items-center px-5 py-2.5 text-base cursor-pointer font-semibold text-white rounded-lg shadow-lg bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-gray-800"
                        >
                            <FaPlus className="text-lg" /> Novo Pet
                        </button>
                    </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                    {allPets.map((pet) => (
                        <div
                            key={pet.id}
                            className="overflow-hidden relative bg-white rounded-2xl border border-gray-200 shadow-md transition-all group hover:shadow-xl"
                        >
                            <div className="flex flex-col items-center px-4 pt-6 pb-3">
                                <div className="relative mb-2">
                                    <img
                                        src={logo}
                                        alt={pet.name}
                                        className="object-cover w-20 h-20 bg-white rounded-full border-4 shadow-md border-primary-200"
                                    />
                                    <span
                                        className={`absolute bottom-0 right-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${getOnlineStatusColor(pet.isOnline)} border-white shadow`}
                                        style={{ transform: 'translate(30%, 30%)' }}
                                    >
                                        <FaCircle className={pet.isOnline ? 'text-green-500' : 'text-red-500'} />
                                        {getOnlineStatusText(pet.isOnline)}
                                    </span>
                                </div>
                                <h3 className="mb-1 text-lg font-bold text-gray-800">{pet.name}</h3>
                                <div className="mb-2 text-sm text-center text-gray-600">
                                    {pet.breed || 'Raça não informada'}<br />
                                    {pet.age || 'Idade não informada'}
                                </div>
                                <button
                                    className="flex gap-1 items-center text-sm font-medium cursor-pointer text-primary-500 hover:underline focus:outline-none"
                                    onClick={() => toggleExpand(pet.id)}
                                    aria-label="Expandir detalhes"
                                >
                                    Detalhes
                                    <FaAngleDown className={`transition-transform duration-300 ${expanded.includes(pet.id) ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                            <div
                                className={`transition-all duration-300 bg-primary-50 px-6 py-4 text-sm border-t border-primary-100 ${expanded.includes(pet.id) ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                            >
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium text-gray-600">ID da Coleira:</span>
                                    <span className="font-mono text-gray-800">{pet.macId}</span>
                                </div>
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium text-gray-600">Última atualização:</span>
                                    <span className="text-gray-800">{pet.lastUpdate}</span>
                                </div>
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium text-gray-600">Dono:</span>
                                    <span className="text-gray-800">{pet.owner}</span>
                                </div>
                                <div className='flex justify-end items-center'>
                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => handleEdit(pet.id)}
                                            className="flex gap-1 items-center px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-100 rounded-lg transition-colors hover:bg-blue-200"
                                        >
                                            <FaEdit className="w-4 h-4" /> Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(pet.id, pet.name)}
                                            className="flex gap-1 items-center px-3 py-2 text-xs font-semibold text-red-600 bg-red-100 rounded-lg transition-colors hover:bg-red-200"
                                        >
                                            <FaTrash className="w-4 h-4" /> Excluir
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 rounded-2xl transition-all pointer-events-none group-hover:ring-4 group-hover:ring-primary-200"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 
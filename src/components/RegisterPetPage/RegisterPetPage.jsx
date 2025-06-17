import React from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import Header from "../HeaderFoulder/Header";
import { useNotification } from '../../hooks/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { usePet } from '../../hooks/PetContext';
import { FaPaw, FaMapMarkerAlt, FaShieldAlt, FaUser, FaCog, FaArrowLeft } from 'react-icons/fa';

export default function RegisterPetPage() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            breed: '',
            age: '',
            macId: '',
            owner: '',
            locationLat: 0,
            locationLng: 0,
            homeAreaLat: 0,
            homeAreaLng: 0,
            homeAreaRadius: 15
        }
    });

    const { addNotification } = useNotification();
    const navigate = useNavigate();
    const { addPet } = usePet();

    const onValidSubmit = (data) => {
        const newPetData = {
            id: uuidv4(),
            name: data.name,
            breed: data.breed,
            age: data.age,
            macId: data.macId,
            owner: data.owner,
            location: {
                lat: data.locationLat,
                lng: data.locationLng,
            },
            homeArea: {
                lat: data.homeAreaLat,
                lng: data.homeAreaLng,
                radius: data.homeAreaRadius,
            },
            isOnline: false,
            lastUpdate: new Date().toLocaleTimeString(),
            locationHistory: [],
        };
        
        addPet(newPetData);
        addNotification(`Pet ${newPetData.name} cadastrado com sucesso!`, 'success', 5000);
        reset();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-100 to-accent-50">
            
            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header da Página */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 text-white rounded-full shadow-lg bg-gradient-to-r from-primary-500 to-accent-500">
                            <FaPaw className="w-8 h-8 text-gray-800" />
                        </div>
                        <h1 className="mb-2 text-4xl font-bold text-gray-800">Cadastrar Novo Pet</h1>
                        <p className="text-lg text-gray-600">Adicione seu companheiro ao sistema de monitoramento</p>
                    </div>

                    {/* Botão Voltar */}
                    <div className="mb-6">
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 transition-all bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md hover:bg-gray-50"
                        >
                            <FaArrowLeft className="w-4 h-4 mr-2" />
                            Voltar ao Dashboard
                        </button>
                    </div>

                    <div className="overflow-hidden bg-white shadow-2xl rounded-3xl">
                        <form onSubmit={handleSubmit(onValidSubmit)} className="p-8">
                            {/* Informações Básicas */}
                            <div className="mb-8">
                                <div className="flex items-center mb-6">
                                    <div className="flex items-center justify-center w-10 h-10 mr-3 text-white rounded-lg bg-gradient-to-r from-primary-500 to-primary-600">
                                        <FaUser className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">Informações Básicas</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                                            Nome do Pet *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            placeholder="Ex: Rex, Luna, Thor"
                                            {...register("name", { required: "Nome é obrigatório" })}
                                            className="w-full px-4 py-3 text-gray-700 transition-all border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500">{errors.name.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="breed" className="block text-sm font-semibold text-gray-700">
                                            Raça
                                        </label>
                                        <input
                                            type="text"
                                            id="breed"
                                            placeholder="Ex: Golden Retriever, Persa"
                                            {...register("breed")}
                                            className="w-full px-4 py-3 text-gray-700 transition-all border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="age" className="block text-sm font-semibold text-gray-700">
                                            Idade
                                        </label>
                                        <input
                                            type="text"
                                            id="age"
                                            placeholder="Ex: 3 anos, 6 meses"
                                            {...register("age")}
                                            className="w-full px-4 py-3 text-gray-700 transition-all border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="owner" className="block text-sm font-semibold text-gray-700">
                                            Dono
                                        </label>
                                        <input
                                            type="text"
                                            id="owner"
                                            placeholder="Seu nome"
                                            {...register("owner")}
                                            className="w-full px-4 py-3 text-gray-700 transition-all border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label htmlFor="macId" className="block text-sm font-semibold text-gray-700">
                                            ID da Coleira (MAC ID) *
                                        </label>
                                        <input
                                            type="text"
                                            id="macId"
                                            placeholder="Ex: AA:BB:CC:DD:EE:FF"
                                            {...register("macId", { required: "ID da Coleira é obrigatório" })}
                                            className="w-full px-4 py-3 text-gray-700 transition-all border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                                        />
                                        {errors.macId && (
                                            <p className="text-sm text-red-500">{errors.macId.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Localização Inicial */}
                            <div className="mb-8">
                                <div className="flex items-center mb-6">
                                    <div className="flex items-center justify-center w-10 h-10 mr-3 text-white rounded-lg bg-gradient-to-r from-accent-500 to-accent-600">
                                        <FaMapMarkerAlt className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">Localização Inicial</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label htmlFor="locationLat" className="block text-sm font-semibold text-gray-700">
                                            Latitude
                                        </label>
                                        <input
                                            type="number"
                                            step="any"
                                            id="locationLat"
                                            placeholder="Ex: -23.5505"
                                            {...register("locationLat", { valueAsNumber: true })}
                                            className="w-full px-4 py-3 text-gray-700 transition-all border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="locationLng" className="block text-sm font-semibold text-gray-700">
                                            Longitude
                                        </label>
                                        <input
                                            type="number"
                                            step="any"
                                            id="locationLng"
                                            placeholder="Ex: -46.6333"
                                            {...register("locationLng", { valueAsNumber: true })}
                                            className="w-full px-4 py-3 text-gray-700 transition-all border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Zona Segura */}
                            <div className="mb-8">
                                <div className="flex items-center mb-6">
                                    <div className="flex items-center justify-center w-10 h-10 mr-3 text-white rounded-lg bg-gradient-to-r from-green-500 to-green-600">
                                        <FaShieldAlt className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">Zona Segura</h2>
                                </div>
                                
                                <div className="p-6 border border-green-100 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl">
                                    <p className="mb-4 text-sm text-gray-600">
                                        Configure a área onde seu pet pode circular livremente. Receberá alertas quando ele sair desta zona.
                                    </p>
                                    
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <label htmlFor="homeAreaLat" className="block text-sm font-semibold text-gray-700">
                                                Latitude da Zona
                                            </label>
                                            <input
                                                type="number"
                                                step="any"
                                                id="homeAreaLat"
                                                placeholder="Ex: -23.5505"
                                                {...register("homeAreaLat", { valueAsNumber: true })}
                                                className="w-full px-4 py-3 text-gray-700 transition-all border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="homeAreaLng" className="block text-sm font-semibold text-gray-700">
                                                Longitude da Zona
                                            </label>
                                            <input
                                                type="number"
                                                step="any"
                                                id="homeAreaLng"
                                                placeholder="Ex: -46.6333"
                                                {...register("homeAreaLng", { valueAsNumber: true })}
                                                className="w-full px-4 py-3 text-gray-700 transition-all border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="homeAreaRadius" className="block text-sm font-semibold text-gray-700">
                                                Raio (metros)
                                            </label>
                                            <input
                                                type="number"
                                                step="any"
                                                id="homeAreaRadius"
                                                placeholder="Ex: 15"
                                                {...register("homeAreaRadius", { 
                                                    valueAsNumber: true, 
                                                    min: { value: 0, message: "O raio não pode ser negativo" } 
                                                })}
                                                className="w-full px-4 py-3 text-gray-700 transition-all border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                            />
                                            {errors.homeAreaRadius && (
                                                <p className="text-sm text-red-500">{errors.homeAreaRadius.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Botões de Ação */}
                            <div className="flex flex-col gap-4 pt-6 border-t border-gray-200 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className="px-8 py-3 font-semibold text-gray-700 transition-all bg-gray-100 cursor-pointer rounded-xl hover:bg-gray-200 hover:shadow-md"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-3 font-semibold text-white transition-all transform bg-gray-800 cursor-pointer bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl hover:from-primary-600 hover:to-accent-600 hover:shadow-lg hover:scale-105"
                                >
                                    <FaPaw className="inline w-4 h-4 mr-2" />
                                    Cadastrar Pet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
} 
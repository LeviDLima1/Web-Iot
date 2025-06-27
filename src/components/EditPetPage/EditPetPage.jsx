import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotification } from '../../hooks/NotificationContext';
import { usePet } from '../../hooks/PetContext';
import { FaPaw, FaMapMarkerAlt, FaShieldAlt, FaUser, FaArrowLeft, FaSave } from 'react-icons/fa';

export default function EditPetPage() {
    const { petId } = useParams();
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const { getPetById, updatePet } = usePet();

    const pet = getPetById(petId);

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

    // Preenche o formulário com os dados do pet quando o componente carrega
    useEffect(() => {
        if (pet) {
            reset({
                name: pet.name || '',
                breed: pet.breed || '',
                age: pet.age || '',
                macId: pet.macId || '',
                owner: pet.owner || '',
                locationLat: pet.location?.lat || 0,
                locationLng: pet.location?.lng || 0,
                homeAreaLat: pet.homeArea?.lat || 0,
                homeAreaLng: pet.homeArea?.lng || 0,
                homeAreaRadius: pet.homeArea?.radius || 15
            });
        }
    }, [pet, reset]);

    const onValidSubmit = (data) => {
        const updatedPetData = {
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
        };
        
        updatePet(petId, updatedPetData);
        addNotification(`Pet ${updatedPetData.name} atualizado com sucesso!`, 'success', 5000);
        navigate('/');
    };

    // Se o pet não for encontrado, mostra uma mensagem de erro
    if (!pet) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-accent-50">
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-center">
                        <h1 className="mb-4 text-2xl font-bold text-gray-800">Pet não encontrado</h1>
                        <p className="mb-6 text-gray-600">O pet que você está procurando não existe ou foi removido.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 font-semibold text-white bg-gradient-to-r from-gray-500 rounded-xl transition-all to-accent-500 hover:from-gray-600 hover:to-accent-600"
                        >
                            Voltar ao Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-accent-50">
            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    {/* Header da Página */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex justify-center items-center mb-4 w-16 h-16 text-white bg-gradient-to-r from-gray-500 rounded-full shadow-lg to-accent-500">
                            <FaPaw className="w-8 h-8" />
                        </div>
                        <h1 className="mb-2 text-4xl font-bold text-gray-800">Editar Pet</h1>
                        <p className="text-lg text-gray-600">Atualize as informações do seu companheiro</p>
                    </div>

                    {/* Botão Voltar */}
                    <div className="mb-6">
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-sm transition-all cursor-pointer hover:shadow-md hover:bg-gray-50"
                        >
                            <FaArrowLeft className="mr-2 w-4 h-4" />
                            Voltar ao Dashboard
                        </button>
                    </div>

                    <div className="overflow-hidden bg-white rounded-3xl shadow-2xl">
                        <form onSubmit={handleSubmit(onValidSubmit)} className="p-8">
                            {/* Informações Básicas */}
                            <div className="mb-8">
                                <div className="flex items-center mb-6">
                                    <div className="flex justify-center items-center mr-3 w-10 h-10 text-white bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg">
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
                                            className="px-4 py-3 w-full text-gray-700 rounded-xl border border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
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
                                            className="px-4 py-3 w-full text-gray-700 rounded-xl border border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
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
                                            className="px-4 py-3 w-full text-gray-700 rounded-xl border border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
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
                                            className="px-4 py-3 w-full text-gray-700 rounded-xl border border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
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
                                            className="px-4 py-3 w-full text-gray-700 rounded-xl border border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                        />
                                        {errors.macId && (
                                            <p className="text-sm text-red-500">{errors.macId.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Localização Atual */}
                            <div className="mb-8">
                                <div className="flex items-center mb-6">
                                    <div className="flex justify-center items-center mr-3 w-10 h-10 text-white bg-gradient-to-r rounded-lg from-accent-500 to-accent-600">
                                        <FaMapMarkerAlt className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">Localização Atual</h2>
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
                                            className="px-4 py-3 w-full text-gray-700 rounded-xl border border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
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
                                            className="px-4 py-3 w-full text-gray-700 rounded-xl border border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Zona Segura */}
                            <div className="mb-8">
                                <div className="flex items-center mb-6">
                                    <div className="flex justify-center items-center mr-3 w-10 h-10 text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                                        <FaShieldAlt className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">Zona Segura</h2>
                                </div>
                                
                                <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-100">
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
                                                className="px-4 py-3 w-full text-gray-700 rounded-xl border border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
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
                                                className="px-4 py-3 w-full text-gray-700 rounded-xl border border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
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
                                                className="px-4 py-3 w-full text-gray-700 rounded-xl border border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
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
                                    className="px-8 py-3 font-semibold text-gray-700 bg-gray-100 rounded-xl transition-all cursor-pointer hover:bg-gray-200 hover:shadow-md"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-3 font-semibold text-white bg-gradient-to-r from-gray-500 rounded-xl transition-all transform cursor-pointer to-accent-500 hover:from-gray-600 hover:to-accent-600 hover:shadow-lg hover:scale-105"
                                >
                                    <FaSave className="inline mr-2 w-4 h-4" />
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
} 
import { useState } from 'react';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaEdit, FaCog } from 'react-icons/fa';
import { IoPaw } from "react-icons/io5";
import logo from "../../assets/Header-assets/Logo.png";
import Header from '../HeaderFoulder/Header';
import { Link } from 'react-router-dom';

export default function UserProfile() {
    const [profileData] = useState({
        name: 'João Silva',
        email: 'joao.silva@email.com',
        location: 'São Paulo, SP',
        bio: 'Apaixonado por tecnologia e inovação. Desenvolvedor full-stack com foco em soluções IoT.',
        avatar: null,
        joinDate: 'Janeiro 2024',
        petsCount: 3,
        devicesCount: 5
    });

    // Array de pets do usuário
    const userPets = [
        { id: 1, name: 'Rex', type: 'Cachorro', breed: 'Golden Retriever', status: 'online' },
        { id: 2, name: 'Mia', type: 'Gato', breed: 'Persa', status: 'offline' },
        { id: 3, name: 'Buddy', type: 'Cachorro', breed: 'Labrador', status: 'online' }
    ];

    // Array de dispositivos conectados
    const connectedDevices = [
        { id: 1, name: 'GPS Collar Rex', type: 'GPS Tracker', status: 'active' },
        { id: 2, name: 'Smart Feeder', type: 'Alimentador', status: 'active' },
        { id: 3, name: 'Health Monitor', type: 'Monitor de Saúde', status: 'inactive' }
    ];

    return (
        <>
            <Header />
            <div className="min-h-screen p-4 bg-gradient-to-br from-primary-300 to-primary-400">
                <div className="max-w-4xl mx-auto">
                    {/* Header do Perfil */}
                    <div className="p-6 mb-6 bg-white shadow-xl rounded-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <div className="w-20 h-20 overflow-hidden bg-gray-200 rounded-full">
                                        {profileData.avatar ? (
                                            <img
                                                src={profileData.avatar}
                                                alt="Avatar"
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full">
                                                <FaUser className="text-3xl text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute w-6 h-6 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1"></div>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">{profileData.name}</h1>
                                    <p className="text-gray-600">Membro desde {profileData.joinDate}</p>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <Link
                                    to="/profileConfig"
                                    className="flex items-center px-4 py-2 text-white transition-colors rounded-lg bg-primary-400 hover:bg-primary-500"
                                >
                                    <FaCog className="mr-2" />
                                    Configurações
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Coluna da Esquerda - Informações Pessoais */}
                        <div className="lg:col-span-1">
                            {/* Card de Informações Básicas */}
                            <div className="p-6 mb-6 bg-white shadow-xl rounded-2xl">
                                <h3 className="mb-4 text-lg font-semibold text-gray-800">Informações Pessoais</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <FaEnvelope className="text-gray-400" />
                                        <span className="text-gray-700">{profileData.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <FaMapMarkerAlt className="text-gray-400" />
                                        <span className="text-gray-700">{profileData.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card de Biografia */}
                            <div className="p-6 mb-6 bg-white shadow-xl rounded-2xl">
                                <h3 className="mb-4 text-lg font-semibold text-gray-800">Sobre</h3>
                                <p className="leading-relaxed text-gray-700">{profileData.bio}</p>
                            </div>

                            {/* Card de Estatísticas */}
                            <div className="p-6 bg-white shadow-xl rounded-2xl">
                                <h3 className="mb-4 text-lg font-semibold text-gray-800">Estatísticas</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 text-center rounded-lg bg-gray-50">
                                        <div className="text-2xl font-bold text-primary-400">{profileData.petsCount}</div>
                                        <div className="text-sm text-gray-600">Pets</div>
                                    </div>
                                    <div className="p-4 text-center rounded-lg bg-gray-50">
                                        <div className="text-2xl font-bold text-primary-400">{profileData.devicesCount}</div>
                                        <div className="text-sm text-gray-600">Dispositivos</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Coluna da Direita - Pets e Dispositivos */}
                        <div className="lg:col-span-2">
                            {/* Card de Pets */}
                            <div className="p-6 mb-6 bg-white shadow-xl rounded-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-semibold text-gray-800">Meus Pets</h3>
                                    <IoPaw className="text-2xl text-primary-400" />
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {userPets.map((pet) => (
                                        <div key={pet.id} className="p-4 transition-shadow border border-gray-200 rounded-lg hover:shadow-md">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-gray-800">{pet.name}</h4>
                                                <div className={`w-3 h-3 rounded-full ${pet.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                            </div>
                                            <p className="text-sm text-gray-600">{pet.type} • {pet.breed}</p>
                                            <div className="mt-2 text-xs text-gray-500">
                                                Status: {pet.status === 'online' ? 'Online' : 'Offline'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Card de Dispositivos */}
                            <div className="p-6 bg-white shadow-xl rounded-2xl">
                                <h3 className="mb-6 text-xl font-semibold text-gray-800">Dispositivos Conectados</h3>
                                <div className="space-y-4">
                                    {connectedDevices.map((device) => (
                                        <div key={device.id} className="flex items-center justify-between p-4 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50">
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-3 h-3 rounded-full ${device.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">{device.name}</h4>
                                                    <p className="text-sm text-gray-600">{device.type}</p>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {device.status === 'active' ? 'Ativo' : 'Inativo'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 
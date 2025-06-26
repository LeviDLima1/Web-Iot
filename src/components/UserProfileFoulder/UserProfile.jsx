import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaEdit, FaCog } from 'react-icons/fa';
import { IoPaw } from "react-icons/io5";
import logo from "../../assets/Header-assets/Logo.png";
import Header from '../HeaderFoulder/Header';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import { usePet } from '../../hooks/PetContext';

export default function UserProfile() {
    const { user } = useAuth();
    const [fullUser, setFullUser] = useState(user);
    const { allPets } = usePet();

    useEffect(() => {
        async function fetchUser() {
            if (user?.id) {
                const response = await fetch(`http://localhost:3001/api/users/${user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFullUser(data);
                }
            }
        }
        fetchUser();
    }, [user?.id]);

    return (
        <div className="p-4 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="mx-auto max-w-4xl">
                {/* Header do Perfil */}
                <div className="p-6 mb-6 bg-white rounded-2xl shadow-xl">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <div className="overflow-hidden w-20 h-20 bg-gray-200 rounded-full">
                                    {fullUser?.avatar ? (
                                        <img
                                            src={fullUser.avatar}
                                            alt="Avatar"
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="flex justify-center items-center w-full h-full">
                                            <FaUser className="text-3xl text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -right-1 -bottom-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">{fullUser?.name || 'Usuário'}</h1>
                                <p className="text-gray-600">
                                    Membro desde {fullUser?.createdAt ? new Date(fullUser.createdAt).toLocaleDateString('pt-BR') : '-'}
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <Link
                                to="/profileConfig"
                                className="flex items-center px-4 py-2 text-white bg-gray-400 rounded-lg transition-colors hover:bg-gray-500"
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
                        <div className="p-6 mb-6 bg-white rounded-2xl shadow-xl">
                            <h3 className="mb-4 text-lg font-semibold text-gray-800">Informações Pessoais</h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <FaEnvelope className="text-gray-400" />
                                    <span className="text-gray-700">{fullUser?.email || '-'}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FaUser className="text-gray-400" />
                                    <span className="text-gray-700">{fullUser?.phone || '-'}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FaMapMarkerAlt className="text-gray-400" />
                                    <span className="text-gray-700">
                                        {fullUser?.cep ? `CEP: ${fullUser.cep}` : ''}
                                        {fullUser?.rua ? `, ${fullUser.rua}` : ''}
                                        {fullUser?.numero ? `, Nº ${fullUser.numero}` : ''}
                                        {fullUser?.bairro ? `, ${fullUser.bairro}` : ''}
                                        {fullUser?.cidade ? `, ${fullUser.cidade}` : ''}
                                        {fullUser?.estado ? ` - ${fullUser.estado}` : ''}
                                        {fullUser?.complemento ? `, ${fullUser.complemento}` : ''}
                                        {!fullUser?.cep && !fullUser?.rua && !fullUser?.numero && !fullUser?.bairro && !fullUser?.cidade && !fullUser?.estado ? '-' : ''}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Card de Biografia */}
                        <div className="p-6 mb-6 bg-white rounded-2xl shadow-xl">
                            <h3 className="mb-4 text-lg font-semibold text-gray-800">Sobre</h3>
                            <p className="leading-relaxed text-gray-700">{fullUser?.bio || 'Nenhuma biografia cadastrada.'}</p>
                        </div>

                        {/* Card de Estatísticas */}
                        <div className="p-6 bg-white rounded-2xl shadow-xl">
                            <h3 className="mb-4 text-lg font-semibold text-gray-800">Estatísticas</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 text-center bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-400">{allPets.length}</div>
                                    <div className="text-sm text-gray-600">Pets</div>
                                </div>
                                <div className="p-4 text-center bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-400">{fullUser?.devicesCount ?? '-'}</div>
                                    <div className="text-sm text-gray-600">Dispositivos</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coluna da Direita - Pets e Dispositivos */}
                    <div className="lg:col-span-2">
                        {/* Card de Pets */}
                        <div className="p-6 mb-6 bg-white rounded-2xl shadow-xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-800">Meus Pets</h3>
                                <IoPaw className="text-2xl text-gray-400" />
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {allPets.length === 0 ? (
                                    <div className="text-gray-500">Nenhum pet cadastrado.</div>
                                ) : (
                                    allPets.map((pet) => (
                                        <div key={pet.id} className="p-4 rounded-lg border border-gray-200 transition-shadow hover:shadow-md">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-semibold text-gray-800">{pet.name}</h4>
                                                <div className={`w-3 h-3 rounded-full ${pet.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                            </div>
                                            <p className="text-sm text-gray-600">{pet.type} • {pet.breed}</p>
                                            <div className="mt-2 text-xs text-gray-500">
                                                Status: {pet.isOnline ? 'Online' : 'Offline'}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Card de Dispositivos */}
                        <div className="p-6 bg-white rounded-2xl shadow-xl">
                            <h3 className="mb-6 text-xl font-semibold text-gray-800">Dispositivos Conectados</h3>
                            <div className="space-y-4">
                                {/* Removidos arrays userPets e connectedDevices não utilizados */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
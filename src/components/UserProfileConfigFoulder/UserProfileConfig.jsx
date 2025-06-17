import { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCamera, FaSave, FaEdit, FaTimes } from 'react-icons/fa';
import logo from "../../assets/Header-assets/Logo.png";
import Header from '../HeaderFoulder/Header';

export default function UserProfileConfig() {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: 'João Silva',
        email: 'joao.silva@email.com',
        phone: '(11) 99999-9999',
        address: 'São Paulo, SP',
        bio: 'Apaixonado por tecnologia e inovação. Desenvolvedor full-stack com foco em soluções IoT.',
        avatar: null
    });

    const [tempData, setTempData] = useState({ ...profileData });

    // Array de campos do formulário
    const formFields = [
        { name: 'name', label: 'Nome Completo', type: 'text', icon: FaUser, placeholder: 'Seu nome completo' },
        { name: 'email', label: 'Email', type: 'email', icon: FaEnvelope, placeholder: 'seu@email.com' },
        { name: 'phone', label: 'Telefone', type: 'tel', icon: FaPhone, placeholder: '(11) 99999-9999' },
        { name: 'address', label: 'Endereço', type: 'text', icon: FaMapMarkerAlt, placeholder: 'Sua cidade, estado' }
    ];

    // Array de estatísticas
    const statistics = [
        { label: 'Dispositivos Conectados', value: '5' },
        { label: 'Dias Ativo', value: '127' },
        { label: 'Último Login', value: 'Hoje' }
    ];

    // Array de configurações de segurança
    const securitySettings = [
        { title: 'Alterar Senha', description: 'Atualize sua senha de acesso' },
        { title: 'Autenticação em Duas Etapas', description: 'Adicione uma camada extra de segurança' },
        { title: 'Sessões Ativas', description: 'Gerencie seus dispositivos conectados' }
    ];

    const handleEdit = () => {
        setTempData({ ...profileData });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setTempData({ ...profileData });
        setIsEditing(false);
    };

    const handleSave = () => {
        setProfileData({ ...tempData });
        setIsEditing(false);
        // Aqui você implementará a lógica para salvar no backend
        console.log('Dados salvos:', tempData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTempData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setTempData(prev => ({
                    ...prev,
                    avatar: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen p-4 bg-gradient-to-br from-primary-300 to-primary-400">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="p-6 mb-6 bg-white shadow-xl rounded-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <img src={logo} alt="Logo" className="w-12 h-12" />
                                <h1 className="text-2xl font-bold text-gray-800">Configurações do Perfil</h1>
                            </div>
                            <div className="flex space-x-3">
                                {!isEditing ? (
                                    <button
                                        onClick={handleEdit}
                                        className="flex items-center px-4 py-2 text-white transition-colors rounded-lg bg-primary-400 hover:bg-primary-500"
                                    >
                                        <FaEdit className="mr-2" />
                                        Editar
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            className="flex items-center px-4 py-2 text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600"
                                        >
                                            <FaSave className="mr-2" />
                                            Salvar
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="flex items-center px-4 py-2 text-white transition-colors bg-gray-500 rounded-lg hover:bg-gray-600"
                                        >
                                            <FaTimes className="mr-2" />
                                            Cancelar
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Coluna da Esquerda - Avatar e Informações Básicas */}
                        <div className="lg:col-span-1">
                            {/* Card do Avatar */}
                            <div className="p-6 mb-6 bg-white shadow-xl rounded-2xl">
                                <div className="text-center">
                                    <div className="relative inline-block">
                                        <div className="w-32 h-32 mx-auto mb-4 overflow-hidden bg-gray-200 rounded-full">
                                            {tempData.avatar ? (
                                                <img
                                                    src={tempData.avatar}
                                                    alt="Avatar"
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full">
                                                    <FaUser className="text-4xl text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        {isEditing && (
                                            <label className="absolute bottom-0 right-0 p-2 text-white transition-colors rounded-full cursor-pointer bg-primary-400 hover:bg-primary-500">
                                                <FaCamera />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                    <h2 className="mb-2 text-xl font-semibold text-gray-800">
                                        {isEditing ? tempData.name : profileData.name}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        {isEditing ? tempData.email : profileData.email}
                                    </p>
                                </div>
                            </div>

                            {/* Card de Estatísticas */}
                            <div className="p-6 bg-white shadow-xl rounded-2xl">
                                <h3 className="mb-4 text-lg font-semibold text-gray-800">Estatísticas</h3>
                                <div className="space-y-4">
                                    {statistics.map((stat, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="text-gray-600">{stat.label}</span>
                                            <span className="font-semibold text-primary-400">{stat.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Coluna da Direita - Formulário de Dados */}
                        <div className="lg:col-span-2">
                            <div className="p-6 bg-white shadow-xl rounded-2xl">
                                <h3 className="mb-6 text-xl font-semibold text-gray-800">Informações Pessoais</h3>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {formFields.map((field) => {
                                        const IconComponent = field.icon;
                                        return (
                                            <div key={field.name}>
                                                <label className="block mb-2 text-sm font-semibold text-gray-700">
                                                    {field.label}
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                        <IconComponent className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        type={field.type}
                                                        name={field.name}
                                                        value={isEditing ? tempData[field.name] : profileData[field.name]}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                        placeholder={field.placeholder}
                                                        className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Biografia */}
                                <div className="mt-6">
                                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                                        Biografia
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={isEditing ? tempData.bio : profileData.bio}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        rows="4"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        placeholder="Conte um pouco sobre você..."
                                    />
                                </div>
                            </div>

                            {/* Card de Configurações de Segurança */}
                            <div className="p-6 mt-6 bg-white shadow-xl rounded-2xl">
                                <h3 className="mb-6 text-xl font-semibold text-gray-800">Segurança</h3>
                                <div className="space-y-4">
                                    {securitySettings.map((setting, index) => (
                                        <button key={index} className="w-full p-4 text-left transition-colors border border-gray-200 rounded-lg hover:bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">{setting.title}</h4>
                                                    <p className="text-sm text-gray-600">{setting.description}</p>
                                                </div>
                                                <FaEdit className="text-gray-400" />
                                            </div>
                                        </button>
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
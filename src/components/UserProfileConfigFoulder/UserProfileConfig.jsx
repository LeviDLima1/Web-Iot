import { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCamera, FaSave, FaEdit, FaTimes } from 'react-icons/fa';
import logo from "../../assets/Header-assets/Logo.png";
import Header from '../HeaderFoulder/Header';
import { useAuth } from '../../hooks/AuthContext';
import Cleave from 'cleave.js/react';
import 'cleave.js/dist/addons/cleave-phone.br';

export default function UserProfileConfig() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bio: user?.bio || '',
        avatar: user?.avatar || null,
        cep: user?.cep || '',
        rua: user?.rua || '',
        numero: user?.numero || '',
        bairro: user?.bairro || '',
        cidade: user?.cidade || '',
        estado: user?.estado || '',
        complemento: user?.complemento || ''
    });
    const [tempData, setTempData] = useState({ ...profileData });
    const [feedback, setFeedback] = useState(null);
    const [showEndereco, setShowEndereco] = useState(!!profileData.cep && profileData.cep.length === 8);

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

    // Função para buscar no ViaCEP
    async function buscarEnderecoPorCep(cep) {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (!response.ok) throw new Error('Erro ao buscar CEP');
        return await response.json();
    }

    // Handler do input de CEP
    const handleCepChange = async (e) => {
        const novoCep = e.target.value.replace(/\D/g, '');
        setTempData(prev => ({ ...prev, cep: novoCep }));
        if (novoCep.length === 8) {
            try {
                const data = await buscarEnderecoPorCep(novoCep);
                if (!data.erro) {
                    setTempData(prev => ({
                        ...prev,
                        rua: data.logradouro || '',
                        bairro: data.bairro || '',
                        cidade: data.localidade || '',
                        estado: data.uf || '',
                        complemento: data.complemento || ''
                    }));
                    setShowEndereco(true);
                } else {
                    setShowEndereco(false);
                }
            } catch {
                setShowEndereco(false);
            }
        } else {
            setShowEndereco(false);
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/users/${user.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tempData)
            });
            if (response.ok) {
                const updatedUser = await response.json();
                setProfileData(updatedUser);
                setIsEditing(false);
                setFeedback({ type: 'success', message: 'Dados salvos com sucesso!' });
            } else {
                setFeedback({ type: 'error', message: 'Erro ao salvar dados!' });
            }
        } catch (err) {
            setFeedback({ type: 'error', message: 'Erro de conexão!' });
        }
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
            {feedback && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white ${feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {feedback.message}
                </div>
            )}
            <div className="p-4 min-h-screen bg-gradient-to-br from-gray-200 to-gray-300">
                <div className="mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="p-6 mb-6 bg-white rounded-2xl shadow-xl">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <img src={logo} alt="Logo" className="w-12 h-12" />
                                <h1 className="text-2xl font-bold text-gray-800">Configurações do Perfil</h1>
                            </div>
                            <div className="flex space-x-3">
                                {!isEditing ? (
                                    <button
                                        onClick={handleEdit}
                                        className="flex items-center px-4 py-2 text-white bg-gray-400 rounded-lg transition-colors hover:bg-gray-500"
                                    >
                                        <FaEdit className="mr-2" />
                                        Editar
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            className="flex items-center px-4 py-2 text-white bg-gray-700 rounded-lg transition-colors hover:bg-gray-800"
                                        >
                                            <FaSave className="mr-2" />
                                            Salvar
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="flex items-center px-4 py-2 text-white bg-gray-400 rounded-lg transition-colors hover:bg-gray-500"
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
                            <div className="p-6 mb-6 bg-white rounded-2xl shadow-xl">
                                <div className="text-center">
                                    <div className="inline-block relative">
                                        <div className="overflow-hidden mx-auto mb-4 w-32 h-32 bg-gray-200 rounded-full">
                                            {tempData.avatar ? (
                                                <img
                                                    src={tempData.avatar}
                                                    alt="Avatar"
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <div className="flex justify-center items-center w-full h-full">
                                                    <FaUser className="text-4xl text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        {isEditing && (
                                            <label className="absolute right-0 bottom-0 p-2 text-white bg-gray-400 rounded-full transition-colors cursor-pointer hover:bg-gray-500">
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
                            <div className="p-6 bg-white rounded-2xl shadow-xl">
                                <h3 className="mb-4 text-lg font-semibold text-gray-800">Estatísticas</h3>
                                <div className="space-y-4">
                                    {statistics.map((stat, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <span className="text-gray-600">{stat.label}</span>
                                            <span className="font-semibold text-gray-500">{stat.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Coluna da Direita - Formulário de Dados */}
                        <div className="lg:col-span-2">
                            <div className="p-6 bg-white rounded-2xl shadow-xl">
                                <h3 className="mb-6 text-xl font-semibold text-gray-800">Informações Pessoais</h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Nome, Email, Telefone */}
                                    <div>
                                        <label className="block mb-2 text-sm font-semibold text-gray-700">Nome Completo</label>
                                        <div className="relative">
                                            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                                <FaUser className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                value={isEditing ? tempData.name : profileData.name}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="px-4 py-2 pl-10 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-400"
                                                placeholder="Seu nome completo"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-semibold text-gray-700">Email</label>
                                        <div className="relative">
                                            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                                <FaEnvelope className="text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={isEditing ? tempData.email : profileData.email}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="px-4 py-2 pl-10 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-400"
                                                placeholder="seu@email.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-semibold text-gray-700">Telefone</label>
                                        <div className="relative">
                                            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                                <FaPhone className="text-gray-400" />
                                            </div>
                                            <Cleave
                                                options={{ phone: true, phoneRegionCode: 'BR' }}
                                                value={isEditing ? tempData.phone : profileData.phone}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                type="tel"
                                                name="phone"
                                                className="px-4 py-2 pl-10 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-400"
                                                placeholder="(11) 99999-9999"
                                            />
                                        </div>
                                    </div>

                                    {/* Campo de CEP */}
                                    <div>
                                        <label className="block mb-2 text-sm font-semibold text-gray-700">CEP</label>
                                        <div className="relative">
                                            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                                <FaMapMarkerAlt className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                name="cep"
                                                value={isEditing ? tempData.cep : profileData.cep}
                                                onChange={isEditing ? handleCepChange : undefined}
                                                disabled={!isEditing}
                                                className="px-4 py-2 pl-10 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-400"
                                                placeholder="Digite o CEP"
                                                maxLength={9}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Campos de endereço aparecem com transição */}
                                <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 transition-all duration-500 ${showEndereco ? 'mt-6 opacity-100 max-h-[500px]' : 'overflow-hidden max-h-0 opacity-0'}`}>
                                    <div>
                                        <label className="block mb-2 text-sm font-semibold text-gray-700">Rua</label>
                                        <input
                                            type="text"
                                            name="rua"
                                            value={isEditing ? tempData.rua : profileData.rua}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="px-4 py-2 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-400"
                                            placeholder="Rua"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-semibold text-gray-700">Número</label>
                                        <input
                                            type="text"
                                            name="numero"
                                            value={isEditing ? tempData.numero : profileData.numero}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="px-4 py-2 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-400"
                                            placeholder="Número"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-semibold text-gray-700">Bairro</label>
                                        <input
                                            type="text"
                                            name="bairro"
                                            value={isEditing ? tempData.bairro : profileData.bairro}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="px-4 py-2 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-400"
                                            placeholder="Bairro"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-semibold text-gray-700">Cidade</label>
                                        <input
                                            type="text"
                                            name="cidade"
                                            value={isEditing ? tempData.cidade : profileData.cidade}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="px-4 py-2 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-400"
                                            placeholder="Cidade"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-semibold text-gray-700">Estado</label>
                                        <input
                                            type="text"
                                            name="estado"
                                            value={isEditing ? tempData.estado : profileData.estado}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="px-4 py-2 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-400"
                                            placeholder="Estado"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-semibold text-gray-700">Complemento</label>
                                        <input
                                            type="text"
                                            name="complemento"
                                            value={isEditing ? tempData.complemento : profileData.complemento}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="px-4 py-2 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-400"
                                            placeholder="Complemento"
                                        />
                                    </div>
                                </div>

                                {/* Campo de biografia */}
                                <div className="mt-6">
                                    <label className="block mb-2 text-sm font-semibold text-gray-700">Biografia</label>
                                    <textarea
                                        name="bio"
                                        value={isEditing ? tempData.bio : profileData.bio}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="px-4 py-2 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        placeholder="Conte um pouco sobre você..."
                                        rows={4}
                                    />
                                </div>
                            </div>

                            {/* Card de Configurações de Segurança */}
                            <div className="p-6 mt-6 bg-white rounded-2xl shadow-xl">
                                <h3 className="mb-6 text-xl font-semibold text-gray-800">Segurança</h3>
                                <div className="space-y-4">
                                    {securitySettings.map((setting, index) => (
                                        <button key={index} className="p-4 w-full text-left rounded-lg border border-gray-200 transition-colors hover:bg-gray-50">
                                            <div className="flex justify-between items-center">
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
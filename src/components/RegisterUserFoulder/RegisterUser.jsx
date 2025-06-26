import { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';
import logo from "../../assets/Header-assets/Logo.png";
import { Link, useNavigate } from "react-router-dom"

export default function RegisterUser() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        try {
            const response = await fetch('http://192.168.18.31:3001/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Usuário cadastrado com sucesso! Redirecionando para login...');
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
            } else {
                setError(data.error || 'Erro ao cadastrar usuário.');
            }
        } catch (err) {
            setError('Erro de conexão com o servidor.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="flex justify-center items-center p-4 min-h-screen bg-gradient-to-br from-gray-300 to-gray-400">
            <div className="w-full max-w-md">
                {/* Card de Registro */}
                <div className="overflow-hidden bg-white rounded-2xl shadow-xl">
                    {/* Cabeçalho */}
                    <div className="p-8 text-center">
                        <img src={logo} alt="Logo" className="mx-auto mb-4 w-32 h-32" />
                        <h2 className="mb-2 text-3xl font-bold text-gray-800">Criar Conta</h2>
                        <p className="text-gray-600">Preencha os dados abaixo para criar sua conta</p>
                    </div>

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="p-8">
                        {/* Mensagens de erro e sucesso */}
                        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
                        {success && <div className="mb-4 text-sm text-green-600">{success}</div>}
                        {/* Campo de Nome */}
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-semibold text-gray-700">
                                Nome Completo
                            </label>
                            <div className="relative">
                                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                    <FaUser className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="py-2 pr-3 pl-10 w-full rounded-lg border border-gray-300 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                                    placeholder="Seu nome completo"
                                    required
                                />
                            </div>
                        </div>

                        {/* Campo de Email */}
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-semibold text-gray-700">
                                Email
                            </label>
                            <div className="relative">
                                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                    <FaEnvelope className="text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="py-2 pr-3 pl-10 w-full rounded-lg border border-gray-300 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Campo de Senha */}
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-semibold text-gray-700">
                                Senha
                            </label>
                            <div className="relative">
                                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="py-2 pr-10 pl-10 w-full rounded-lg border border-gray-300 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    className="flex absolute inset-y-0 right-0 items-center pr-3 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <FaEyeSlash className="text-gray-400 cursor-pointer hover:text-gray-600" />
                                    ) : (
                                        <FaEye className="text-gray-400 cursor-pointer hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Campo de Confirmação de Senha */}
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-semibold text-gray-700">
                                Confirmar Senha
                            </label>
                            <div className="relative">
                                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="py-2 pr-10 pl-10 w-full rounded-lg border border-gray-300 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    className="flex absolute inset-y-0 right-0 items-center pr-3 cursor-pointer"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <FaEyeSlash className="text-gray-400 cursor-pointer hover:text-gray-600" />
                                    ) : (
                                        <FaEye className="text-gray-400 cursor-pointer hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Termos e Condições */}
                        <div className="flex items-center mb-6">
                            <input
                                id="terms"
                                type="checkbox"
                                className="w-4 h-4 text-gray-500 rounded border-gray-300 cursor-pointer focus:ring-gray-400"
                                required
                            />
                            <label htmlFor="terms" className="block ml-2 text-sm text-gray-700">
                                Concordo com os{' '}
                                <a href="#" className="text-gray-500 hover:text-gray-700">
                                    Termos de Uso
                                </a>{' '}
                                e{' '}
                                <a href="#" className="text-gray-500 hover:text-gray-700">
                                    Política de Privacidade
                                </a>
                            </label>
                        </div>

                        {/* Botão de Registro */}
                        <button
                            type="submit"
                            className="px-4 py-2 w-full text-white bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                        >
                            Criar Conta
                        </button>

                        {/* Link para Login */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Já tem uma conta?{' '}
                                <Link to={'/login'} className="font-semibold text-gray-500 hover:text-gray-700">Fazer Login</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

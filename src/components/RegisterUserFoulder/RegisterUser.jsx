import { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';
import logo from "../../assets/Header-assets/Logo.png";
import { Link } from "react-router-dom"

export default function RegisterUser() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aqui você implementará a lógica de registro
        console.log('Dados do formulário:', formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-300 to-primary-400">
            <div className="w-full max-w-md">
                {/* Card de Registro */}
                <div className="overflow-hidden bg-white shadow-xl rounded-2xl">
                    {/* Cabeçalho */}
                    <div className="p-8 text-center">
                        <img src={logo} alt="Logo" className="w-32 h-32 mx-auto mb-4" />
                        <h2 className="mb-2 text-3xl font-bold text-gray-800">Criar Conta</h2>
                        <p className="text-gray-600">Preencha os dados abaixo para criar sua conta</p>
                    </div>

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="p-8">
                        {/* Campo de Nome */}
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-semibold text-gray-700">
                                Nome Completo
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <FaUser className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
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
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <FaEnvelope className="text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
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
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
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
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
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
                                className="w-4 h-4 border-gray-300 rounded cursor-pointer text-primary-400 focus:ring-primary-400"
                                required
                            />
                            <label htmlFor="terms" className="block ml-2 text-sm text-gray-700">
                                Concordo com os{' '}
                                <a href="#" className="text-primary-400 hover:text-primary-500">
                                    Termos de Uso
                                </a>{' '}
                                e{' '}
                                <a href="#" className="text-primary-400 hover:text-primary-500">
                                    Política de Privacidade
                                </a>
                            </label>
                        </div>

                        {/* Botão de Registro */}
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-white transition-colors duration-200 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                        >
                            Criar Conta
                        </button>

                        {/* Link para Login */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Já tem uma conta?{' '}
                                <Link to={'/login'} className="font-semibold text-primary-400 hover:text-primary-500">Fazer Login</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

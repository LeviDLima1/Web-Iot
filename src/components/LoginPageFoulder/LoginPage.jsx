import { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from "../../assets/Header-assets/Logo.png";
import { Link } from "react-router-dom"

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aqui você implementará a lógica de login
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
                {/* Card de Login */}
                <div className="overflow-hidden bg-white shadow-xl rounded-2xl">
                    {/* Cabeçalho */}
                    <div className="p-8 text-center">
                        <img src={logo} alt="Logo" className="w-32 h-32 mx-auto mb-4" />
                        <h2 className="mb-2 text-3xl font-bold text-gray-800">Bem-vindo de volta!</h2>
                        <p className="text-gray-600">Entre com suas credenciais para acessar sua conta</p>
                    </div>

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="p-8">
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

                        {/* Links de Ajuda */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    className="w-4 h-4 border-gray-300 rounded cursor-pointer text-primary-400 focus:ring-primary-400"
                                />
                                <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-700">
                                    Lembrar-me
                                </label>
                            </div>
                            <a href="#" className="text-sm text-primary-400 hover:text-primary-500">
                                Esqueceu a senha?
                            </a>
                        </div>

                        {/* Botão de Login */}
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-white transition-colors duration-200 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                        >
                            Entrar
                        </button>

                        {/* Link para Cadastro */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Não tem uma conta?{' '}
                                <Link to={'/register'} className="font-semibold text-primary-400 hover:text-primary-500">Cadastre-se</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

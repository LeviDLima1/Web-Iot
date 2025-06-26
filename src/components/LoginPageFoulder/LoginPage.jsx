import { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from "../../assets/Header-assets/Logo.png";
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from '../../hooks/AuthContext';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        console.log('Enviando dados de login:', formData);
        try {
            const response = await fetch('http://192.168.18.31:3001/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            console.log('Resposta do backend (login):', data);
            if (response.ok) {
                setSuccess('Login realizado com sucesso! Redirecionando...');
                login(data.user, data.token);
                setTimeout(() => {
                    navigate('/');
                }, 1200);
            } else {
                setError(data.error || 'Erro ao fazer login.');
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
                {/* Card de Login */}
                <div className="overflow-hidden bg-white rounded-2xl shadow-xl">
                    {/* Cabeçalho */}
                    <div className="p-8 text-center">
                        <img src={logo} alt="Logo" className="mx-auto mb-4 w-32 h-32" />
                        <h2 className="mb-2 text-3xl font-bold text-gray-800">Bem-vindo de volta!</h2>
                        <p className="text-gray-600">Entre com suas credenciais para acessar sua conta</p>
                    </div>

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="p-8">
                        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
                        {success && <div className="mb-4 text-sm text-green-600">{success}</div>}
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
                                    className="flex absolute inset-y-0 right-0 items-center pr-3"
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
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    className="w-4 h-4 text-gray-400 rounded border-gray-300 cursor-pointer focus:ring-gray-400"
                                />
                                <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-700">
                                    Lembrar-me
                                </label>
                            </div>
                            <a href="#" className="text-sm text-gray-400 hover:text-gray-500">
                                Esqueceu a senha?
                            </a>
                        </div>

                        {/* Botão de Login */}
                        <button
                            type="submit"
                            className="px-4 py-2 w-full text-white bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                        >
                            Entrar
                        </button>

                        {/* Link para Cadastro */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Não tem uma conta?{' '}
                                <Link to={'/register'} className="font-semibold text-gray-400 hover:text-gray-500">Cadastre-se</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

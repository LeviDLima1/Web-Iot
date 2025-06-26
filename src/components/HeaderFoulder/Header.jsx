import Logo from '../../assets/Header-assets/Logo.png'
import { IoPaw } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom'
import { FaUser, FaSignOutAlt, FaCog, FaSignInAlt, FaPaw, FaHome, FaListUl, FaPlus, FaBars, FaTimes } from 'react-icons/fa'
import { useAuth } from '../../hooks/AuthContext';
import { useState } from 'react';

export default function Header({ children }) {
    const { isLogged, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    function handleLogout() {
        logout();
        navigate('/login');
    }

    return (
        <div className="flex min-h-screen">
            {/* Botão menu hamburguer para mobile */}
            <button
                className="fixed top-4 left-4 z-50 p-2 text-white bg-gray-800 rounded shadow-lg md:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Abrir menu"
            >
                <FaBars className="w-6 h-6" />
            </button>
            {/* Sidebar */}
            <aside className={`
                flex flex-col px-4 py-8 w-64 h-auto  text-white bg-gray-800 shadow-lg
                fixed z-40 top-0 left-0 transition-transform duration-300
                md:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:static md:flex md:translate-x-0
                overflow-y-auto
            `}>
                {/* Botão fechar no mobile */}
                <button
                    className="absolute top-4 right-4 p-2 text-white bg-gray-700 rounded md:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Fechar menu"
                >
                    <FaTimes className="w-5 h-5" />
                </button>
                <div className="flex gap-2 items-center mt-8 mb-10 md:mt-0">
                    <IoPaw className="w-8 h-8" />
                    <Link to="/" className="text-2xl font-bold">PetTracker</Link>
                </div>
                <nav className="space-y-2">
                    <Link to="/" className="flex gap-3 items-center px-3 py-2 rounded-lg transition hover:bg-gray-700" onClick={() => setSidebarOpen(false)}>
                        <FaHome className="w-5 h-5" /> Dashboard
                    </Link>
                    <Link to="/pets" className="flex gap-3 items-center px-3 py-2 rounded-lg transition hover:bg-gray-700" onClick={() => setSidebarOpen(false)}>
                        <FaListUl className="w-5 h-5" /> Pets
                    </Link>
                    <Link to="/register-pet" className="flex gap-3 items-center px-3 py-2 rounded-lg transition hover:bg-gray-700" onClick={() => setSidebarOpen(false)}>
                        <FaPlus className="w-5 h-5" /> Cadastrar Pet
                    </Link>
                    {isLogged && (
                        <>
                            <Link to="/profile" className="flex gap-3 items-center px-3 py-2 rounded-lg transition hover:bg-gray-700" onClick={() => setSidebarOpen(false)}>
                                <FaUser className="w-5 h-5" /> Perfil
                            </Link>
                            <Link to="/profileConfig" className="flex gap-3 items-center px-3 py-2 rounded-lg transition hover:bg-gray-700" onClick={() => setSidebarOpen(false)}>
                                <FaCog className="w-5 h-5" /> Configurações
                            </Link>
                        </>
                    )}
                </nav>
                <div className="mt-6 mb-4 md:mb-0">
                    {isLogged ? (
                        <button
                            onClick={() => { handleLogout(); setSidebarOpen(false); }}
                            className="flex gap-3 items-center px-3 py-2 w-full text-left rounded-lg transition cursor-pointer hover:bg-gray-700"
                        >
                            <FaSignOutAlt className="w-5 h-5" /> Sair
                        </button>
                    ) : (
                        <Link to="/login" className="flex gap-3 items-center px-3 py-2 rounded-lg transition cursor-pointer hover:bg-gray-700" onClick={() => setSidebarOpen(false)}>
                            <FaSignInAlt className="w-5 h-5" /> Entrar
                        </Link>
                    )}
                </div>
            </aside>
            {/* Conteúdo principal */}
            <main className="flex-1 w-full min-h-screen bg-gray-50 transition-all duration-300">
                {children}
            </main>
        </div>
    )
}
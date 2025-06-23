import Logo from '../../assets/Header-assets/Logo.png'
import { IoPaw } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom'
import { FaUser, FaSignOutAlt, FaCog, FaSignInAlt, FaPaw, FaHome, FaListUl, FaPlus } from 'react-icons/fa'
import { useAuth } from '../../hooks/AuthContext';

export default function Header({ children }) {
    const { isLogged, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/login');
    }

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="flex fixed flex-col px-4 py-8 w-64 min-h-screen text-white bg-gray-800 shadow-lg">
                <div className="flex gap-2 items-center mb-10">
                    <IoPaw className="w-8 h-8" />
                    <Link to="/" className="text-2xl font-bold">PetTracker</Link>
                </div>
                <nav className="flex-1 space-y-2">
                    <Link to="/" className="flex gap-3 items-center px-3 py-2 rounded-lg transition hover:bg-gray-700">
                        <FaHome className="w-5 h-5" /> Dashboard
                    </Link>
                    <Link to="/pets" className="flex gap-3 items-center px-3 py-2 rounded-lg transition hover:bg-gray-700">
                        <FaListUl className="w-5 h-5" /> Pets
                    </Link>
                    <Link to="/register-pet" className="flex gap-3 items-center px-3 py-2 rounded-lg transition hover:bg-gray-700">
                        <FaPlus className="w-5 h-5" /> Cadastrar Pet
                    </Link>
                    {isLogged && (
                        <>
                            <Link to="/profile" className="flex gap-3 items-center px-3 py-2 rounded-lg transition hover:bg-gray-700">
                                <FaUser className="w-5 h-5" /> Perfil
                            </Link>
                            <Link to="/profileConfig" className="flex gap-3 items-center px-3 py-2 rounded-lg transition hover:bg-gray-700">
                                <FaCog className="w-5 h-5" /> Configurações
                            </Link>
                        </>
                    )}
                </nav>
                <div className="mt-auto">
                    {isLogged ? (
                        <button
                            onClick={handleLogout}
                            className="flex gap-3 items-center px-3 py-2 w-full text-left rounded-lg transition hover:bg-gray-700"
                        >
                            <FaSignOutAlt className="w-5 h-5" /> Sair
                        </button>
                    ) : (
                        <Link to="/login" className="flex gap-3 items-center px-3 py-2 rounded-lg transition hover:bg-gray-700">
                            <FaSignInAlt className="w-5 h-5" /> Entrar
                        </Link>
                    )}
                </div>
            </aside>
            {/* Conteúdo principal */}
            <main className="flex-1 min-h-screen bg-gray-50">
                {children}
            </main>
        </div>
    )
}
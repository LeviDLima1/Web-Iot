import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Páginas Principais
import HomePage from '../components/HomePageFoulder/HomePage'

// Páginas de Autenticação
import LoginPage from '../components/LoginPageFoulder/LoginPage'
import RegisterUser from '../components/RegisterUserFoulder/RegisterUser'

// Páginas do Usuário
import UserProfile from '../components/UserProfileFoulder/UserProfile'
import UserProfileConfig from '../components/UserProfileConfigFoulder/UserProfileConfig'

// Páginas de Gerenciamento de Pets
import RegisterPetPage from '../components/RegisterPetPage/RegisterPetPage'
import EditPetPage from '../components/EditPetPage/EditPetPage'

// Ferramentas de Desenvolvimento
import PetTrackerSimulator from '../components/PetTrackerSimulator/PetTrackerSimulator'

export default function RouterFunction() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ===== ROTAS PRINCIPAIS ===== */}
                <Route path="/" element={<HomePage />} />

                {/* ===== ROTAS DE AUTENTICAÇÃO ===== */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterUser />} />

                {/* ===== ROTAS DO USUÁRIO ===== */}
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/profileConfig" element={<UserProfileConfig />} />

                {/* ===== ROTAS DE GERENCIAMENTO DE PETS ===== */}
                <Route path="/register-pet" element={<RegisterPetPage />} />
                <Route path="/edit-pet/:petId" element={<EditPetPage />} />

                {/* ===== FERRAMENTAS DE DESENVOLVIMENTO ===== */}
                <Route path="/simulator" element={<PetTrackerSimulator />} />

                {/* ===== ROTA 404 - PÁGINA NÃO ENCONTRADA ===== */}
                <Route path="*" element={
                    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-300 to-primary-400">
                        <div className="text-center">
                            <h1 className="mb-4 text-6xl font-bold text-gray-800">404</h1>
                            <p className="mb-8 text-xl text-white">Página não encontrada</p>
                            <a 
                                href="/" 
                                className="px-6 py-3 transition-colors bg-white rounded-lg text-primary-400 hover:bg-gray-100"
                            >
                                Voltar ao Início
                            </a>
                        </div>
                    </div>
                } />
            </Routes>
        </BrowserRouter>
    )
}
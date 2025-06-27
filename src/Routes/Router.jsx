import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom'

// Páginas Principais
const HomePage = React.lazy(() => import('../components/HomePageFoulder/HomePage'));

// Páginas de Autenticação
const LoginPage = React.lazy(() => import('../components/LoginPageFoulder/LoginPage'));
const RegisterUser = React.lazy(() => import('../components/RegisterUserFoulder/RegisterUser'));

// Páginas do Usuário
const UserProfile = React.lazy(() => import('../components/UserProfileFoulder/UserProfile'));
const UserProfileConfig = React.lazy(() => import('../components/UserProfileConfigFoulder/UserProfileConfig'));

// Páginas de Gerenciamento de Pets
const RegisterPetPage = React.lazy(() => import('../components/RegisterPetPage/RegisterPetPage'));
const EditPetPage = React.lazy(() => import('../components/EditPetPage/EditPetPage'));
const PetListPage = React.lazy(() => import('../components/PetListPage'));

export default function RouterFunction() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-screen text-xl text-white bg-gradient-to-br from-gray-300 to-gray-400">
                Carregando...
            </div>
        }>
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
                <Route path="/pets" element={<PetListPage />} />

                {/* ===== ROTA 404 - PÁGINA NÃO ENCONTRADA ===== */}
                <Route path="*" element={
                    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-300 to-gray-400">
                        <div className="text-center">
                            <h1 className="mb-4 text-6xl font-bold text-gray-800">404</h1>
                            <p className="mb-8 text-xl text-white">Página não encontrada</p>
                            <a 
                                href="/" 
                                className="px-6 py-3 text-gray-400 bg-white rounded-lg transition-colors hover:bg-gray-100"
                            >
                                Voltar ao Início
                            </a>
                        </div>
                    </div>
                } />
            </Routes>
        </Suspense>
    )
}
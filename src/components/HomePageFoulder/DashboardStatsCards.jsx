import React from 'react';
import { FaPaw, FaMapMarkerAlt, FaBell, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';

export default function DashboardStatsCards({ dashboardData }) {
    return (
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Total de Pets */}
            <div className="p-6 transition-shadow bg-white shadow-lg rounded-2xl hover:shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Total de Pets</p>
                        <p className="text-3xl font-bold text-gray-800">{dashboardData.totalPets}</p>
                    </div>
                    <div className="p-3 rounded-full bg-primary-100">
                        <FaPaw className="text-2xl text-primary-600" />
                    </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                    <span className="font-medium text-green-600">{dashboardData.onlinePets} online</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="font-medium text-red-600">{dashboardData.offlinePets} offline</span>
                </div>
            </div>

            {/* Pets Online */}
            <div className="p-6 transition-shadow bg-white shadow-lg rounded-2xl hover:shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Pets Online</p>
                        <p className="text-3xl font-bold text-green-600">{dashboardData.onlinePets}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                        <FaMapMarkerAlt className="text-2xl text-green-600" />
                    </div>
                </div>
                <div className="mt-4">
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div 
                            className="h-2 transition-all duration-300 bg-green-500 rounded-full"
                            style={{ width: `${(dashboardData.onlinePets / dashboardData.totalPets) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Alertas Hoje */}
            <div className="p-6 transition-shadow bg-white shadow-lg rounded-2xl hover:shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Alertas Hoje</p>
                        <p className="text-3xl font-bold text-yellow-600">{dashboardData.alertsToday}</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-full">
                        <FaBell className="text-2xl text-yellow-600" />
                    </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                    <FaExclamationTriangle className="mr-1 text-yellow-500" />
                    <span className="text-gray-600">{dashboardData.atRiskPets} pets fora da área</span>
                </div>
            </div>

            {/* Pets Seguros */}
            <div className="p-6 transition-shadow bg-white shadow-lg rounded-2xl hover:shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Pets Seguros</p>
                        <p className="text-3xl font-bold text-blue-600">{dashboardData.safePets}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                        <FaShieldAlt className="text-2xl text-blue-600" />
                    </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                    <span className="font-medium text-green-600">Dentro da área</span>
                </div>
            </div>
        </div>
    );
} 
import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function RecentAlertsSection({ alertsToday, atRiskPets }) {
    return (
        <div className="p-6 bg-white shadow-lg rounded-2xl">
            <h2 className="mb-6 text-xl font-semibold text-gray-800">Alertas Recentes</h2>
            <div className="space-y-4">
                {alertsToday > 0 && (
                    <div className="flex items-start p-4 rounded-lg bg-yellow-50">
                        <FaExclamationTriangle className="flex-shrink-0 mt-1 mr-3 text-yellow-600" />
                        <div>
                            <p className="font-semibold text-yellow-800">Pet fora da área segura!</p>
                            <p className="text-sm text-yellow-700">Um pet foi detectado fora da área demarcada.</p>
                        </div>
                    </div>
                )}
                {alertsToday === 0 && (
                    <p className="text-sm text-gray-500">Nenhum alerta recente.</p>
                )}
            </div>
        </div>
    );
} 
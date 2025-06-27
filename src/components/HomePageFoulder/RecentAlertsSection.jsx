import React from 'react';
import { FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

export default function RecentAlertsSection({ alerts }) {
    return (
        <div className="p-6 bg-white shadow-lg rounded-2xl">
            <h2 className="mb-6 text-xl font-semibold text-gray-800">Alertas Recentes</h2>
            <div className="space-y-4">
                {alerts && alerts.length > 0 ? (
                    alerts.map((alert, idx) => (
                        <div
                            key={idx}
                            className={`flex items-start p-4 rounded-lg ${alert.type === 'danger' ? 'bg-yellow-50' : 'bg-green-50'}`}
                        >
                            {alert.type === 'danger' ? (
                                <FaExclamationTriangle className="flex-shrink-0 mt-1 mr-3 text-yellow-600" />
                            ) : (
                                <FaCheckCircle className="flex-shrink-0 mt-1 mr-3 text-green-600" />
                            )}
                            <div>
                                <p className={`font-semibold ${alert.type === 'danger' ? 'text-yellow-800' : 'text-green-800'}`}>
                                    {alert.type === 'danger' ? 'Pet fora da área segura!' : 'Pet voltou para a área segura!'}
                                </p>
                                <p className="text-sm text-gray-700">
                                    <span className="font-bold">{alert.petName}</span> {alert.type === 'danger' ? 'saiu' : 'voltou'} às {alert.time}
                                    {alert.address && ` — Rua: ${alert.address}`}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">Nenhum alerta recente.</p>
                )}
            </div>
        </div>
    );
} 
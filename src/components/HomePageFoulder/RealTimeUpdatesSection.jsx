import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function RealTimeUpdatesSection({ realTimeUpdates }) {
    return (
        <div className="p-6 bg-white shadow-lg rounded-2xl">
            <h2 className="mb-6 text-xl font-semibold text-gray-800">Atualizações em Tempo Real</h2>
            <div className="space-y-3 overflow-y-auto max-h-60">
                {realTimeUpdates.slice(-5).reverse().map((update, index) => (
                    <div key={index} className="p-4 border border-green-200 rounded-lg bg-green-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-800">
                                    {update.petName} - Nova localização
                                </p>
                                <p className="text-sm text-gray-600">
                                    {update.location.lat}, {update.location.lng}
                                </p>
                                {update.address && (
                                    <p className="mt-1 text-xs text-gray-500">
                                        {update.address.road && `Rua: ${update.address.road}`}
                                        {update.address.road && update.address.suburb && ' • '}
                                        {update.address.suburb && `Bairro: ${update.address.suburb}`}
                                        {!update.address.road && !update.address.suburb && update.address.display_name && `Local: ${update.address.display_name.split(',').slice(0, 2).join(',')}`}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500">
                                    Bateria: {update.battery}% • {new Date(update.timestamp).toLocaleTimeString()}
                                </p>
                            </div>
                            <FaMapMarkerAlt className="text-green-600" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 
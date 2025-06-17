import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet';
import { createCustomIcon } from './MapUtils';

export default function MapRender({ pets = [], historyPath = null }) {
    const pathCoordinates = historyPath ? historyPath.map(loc => [loc.lat, loc.lng]) : [];

    // Determina o centro do mapa: se houver pets, usa a localização do primeiro, caso contrário, um valor padrão.
    const mapCenter = pets.length > 0 ? [pets[0].location.lat, pets[0].location.lng] : [-3.7135199999999, -38.59494856653846];

    return (
        <MapContainer
            center={mapCenter} 
            zoom={23}
            style={{ height: '100%', width: '100%' }}
            className="rounded-xl"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Iterar sobre pets */}
            {pets.map((pet) => (
                <div key={pet.id}>
                    {/* Área da casa */}
                    <Circle
                        center={[pet.homeArea.lat, pet.homeArea.lng]}
                        radius={pet.homeArea.radius}
                        pathOptions={{ 
                            color: pet.isOnline ? '#10B981' : '#9CA3AF',
                            fillColor: pet.isOnline ? '#10B981' : '#9CA3AF',
                            fillOpacity: 0.2
                        }}
                    >
                        <Popup>
                            <div className="p-2">
                                <h3 className="font-semibold">Casa do {pet.owner}</h3>
                                <p className="text-sm">Área permitida para {pet.name}</p>
                                <p className="mt-1 text-xs text-gray-500">
                                    Status: {pet.isOnline ? 'Online' : 'Offline'}
                                </p>
                            </div>
                        </Popup>
                    </Circle>

                    {/* Marcador do pet */}
                    <Marker 
                        position={[pet.location.lat, pet.location.lng]}
                        icon={createCustomIcon('#10B981', pet.isOnline)}
                    >
                        <Popup>
                            <div className="p-2">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">{pet.name}</h3>
                                    <div className={`w-2 h-2 rounded-full ${pet.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <p><span className="font-medium">ID da Coleira:</span> {pet.macId}</p>
                                    <p><span className="font-medium">Dono:</span> {pet.owner}</p>
                                    <p><span className="font-medium">Última atualização:</span> {pet.lastUpdate}</p>
                                    <p><span className="font-medium">Status:</span> 
                                        <span className={pet.isOnline ? 'text-green-600' : 'text-gray-600'}>
                                            {pet.isOnline ? ' Online' : ' Offline'}
                                        </span>
                                    </p>
                                    {pet.macId === pets[pets.length - 1]?.macId && (
                                        <p className="text-xs font-medium text-blue-600">
                                            ⚡ Atualização em tempo real
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                </div>
            ))}

            {/* Desenha o histórico de localização */}
            {pathCoordinates.length > 1 && (
                <Polyline positions={pathCoordinates} color="blue" weight={5} opacity={0.7} />
            )}
        </MapContainer>
    );
}
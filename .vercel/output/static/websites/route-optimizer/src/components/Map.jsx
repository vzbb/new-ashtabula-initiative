import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import './Map.css';

// Custom dark theme marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-cyan.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function Map({ stops, optimizedRoute }) {
  const center = stops.length > 0 ? [stops[0].lat, stops[0].lng] : [41.8651, -80.7898];
  
  const polylinePositions = optimizedRoute.map(stop => [stop.lat, stop.lng]);

  return (
    <div className="map-wrapper">
      <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="map-container-inner">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={center} zoom={12} />
        
        {stops.map((stop, index) => (
          <Marker key={stop.id} position={[stop.lat, stop.lng]} icon={customIcon}>
            <Popup>
              <div className="map-popup">
                <p className="popup-name">{stop.name}</p>
                <p className="popup-address">{stop.address}</p>
                {optimizedRoute.length > 0 && (
                  <p className="popup-stop">
                    Stop #{optimizedRoute.findIndex(s => s.id === stop.id) + 1}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {polylinePositions.length > 1 && (
          <Polyline 
            positions={polylinePositions} 
            color="#00d4ff" 
            weight={4} 
            opacity={0.8} 
            dashArray="10, 10" 
          />
        )}
      </MapContainer>
    </div>
  );
}

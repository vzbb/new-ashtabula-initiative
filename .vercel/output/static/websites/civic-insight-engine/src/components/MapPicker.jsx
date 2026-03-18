import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { MapPin, Navigation, Info } from 'lucide-react';
import { useState } from 'react';
import L from 'leaflet';

// Fix for default Leaflet icon in Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ onSelect }) {
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onSelect(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
    locationfound(e) {
      setPosition(e.latlng);
      onSelect(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export default function MapPicker({ value, onChange }) {
  const center = [41.8797, -80.7891];
  
  const handleMapClick = (latlng) => {
    // Mock geocoding
    const mockAddresses = [
      "4400 Main Ave (Township Hall)",
      "123 Harbor St",
      "Lake Rd & 5th Ave",
      "Saybrook Park Entrance",
      "Walnut St & 3rd St"
    ];
    
    // For MVP, we'll just use a mock address or the coordinates
    const randomAddress = mockAddresses[Math.floor(Math.random() * mockAddresses.length)];
    const formattedLocation = `${randomAddress} (Lat: ${latlng.lat.toFixed(4)}, Lng: ${latlng.lng.toFixed(4)})`;
    onChange(formattedLocation, latlng);
  };

  const useMyLocation = () => {
    // In a real app, this would use the locationfound event
    const randomLoc = [
        [41.8651, -80.7899],
        [41.8964, -80.7963],
        [41.9012, -80.7991]
    ][Math.floor(Math.random() * 3)];
    
    const latlng = { lat: randomLoc[0], lng: randomLoc[1] };
    handleMapClick(latlng);
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden shadow-inner group">
        <MapContainer 
          center={center} 
          zoom={14} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker onSelect={handleMapClick} />
        </MapContainer>

         {/* GPS Button */}
         <button 
           type="button"
           className="absolute top-4 right-4 h-12 w-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/50 hover:bg-blue-700 transition z-[1000] group"
           onClick={useMyLocation}
           title="Use My Location"
         >
            <Navigation className="h-5 w-5 group-hover:scale-110 transition" />
         </button>
         
         <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white shadow-xl z-[1000] pointer-events-none flex items-center gap-2">
            <Info className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Click Map to Pinpoint</span>
         </div>
      </div>

      <div className="flex gap-2 flex-wrap">
         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">Suggestions:</span>
         {["Main Ave Hall", "Harbor St", "Lake Rd"].map(loc => (
           <button 
             key={loc}
             type="button"
             onClick={() => onChange(`${loc} (Auto-pinned)`)}
             className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition ${value.includes(loc) ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300'}`}
           >
              {loc}
           </button>
         ))}
      </div>
    </div>
  );
}

import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { MapPin, Info } from 'lucide-react';
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

export default function IssueMap({ issues }) {
  const center = [41.8797, -80.7891]; // Center of Ashtabula
  
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-slate-50 px-8 py-5 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-widest">
          <MapPin className="h-4 w-4 text-blue-500" />
          Live Issue Map
        </h3>
        <div className="flex gap-4">
           <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-slate-400">
              <div className="h-2 w-2 bg-red-500 rounded-full"></div> Open
           </div>
           <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-slate-400">
              <div className="h-2 w-2 bg-yellow-500 rounded-full"></div> In Progress
           </div>
        </div>
      </div>
      
      <div className="relative h-[400px] w-full bg-slate-100">
        <MapContainer 
          center={center} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {issues.map((issue) => {
            if (!issue.coordinates) return null;
            
            const color = 
              issue.status === 'open' ? '#ef4444' : 
              issue.status === 'in_progress' ? '#f59e0b' : 
              '#10b981';
              
            return (
              <CircleMarker 
                key={issue.id}
                center={issue.coordinates}
                pathOptions={{ color: color, fillColor: color, fillOpacity: 0.8 }}
                radius={8}
              >
                <Popup>
                  <div className="p-1">
                    <div className="font-bold text-slate-900 mb-1">{issue.title}</div>
                    <div className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">{issue.status.replace('_', ' ')}</div>
                    <div className="text-xs text-slate-600 line-clamp-2 mb-3">{issue.description}</div>
                    <a 
                      href={`/issue/${issue.id}`} 
                      className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/issue/${issue.id}`;
                      }}
                    >
                      View Full Report →
                    </a>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white shadow-xl max-w-[240px] z-[1000]">
           <p className="text-[11px] text-slate-700 font-bold leading-relaxed">
             <Info className="h-4 w-4 inline mr-2 text-blue-500" />
             Currently tracking {issues.length} community reports across the township.
           </p>
        </div>
      </div>
    </div>
  );
}

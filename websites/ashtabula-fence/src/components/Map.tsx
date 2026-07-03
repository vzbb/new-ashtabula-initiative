import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Polygon, useMapEvents, useMap } from 'react-leaflet';
import { Layers } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export interface MapFeature {
  id: string;
  type: 'line' | 'polygon';
  points: [number, number][];
  color: string;
  isGate?: boolean;
}

interface MapProps {
  mode: 'line' | 'polygon' | 'none';
  points: [number, number][];
  onPointsChange: (points: [number, number][]) => void;
  center?: [number, number];
  zoom?: number;
  isLocked?: boolean;
  features?: MapFeature[];
  drawingColor?: string;
  isDrawingGate?: boolean;
}

const MIN_DRAW_ZOOM = 18;

function MapEvents({ mode, points, onPointsChange, isLocked }: { mode: 'line' | 'polygon' | 'none', points: [number, number][], onPointsChange: (points: [number, number][]) => void, isLocked: boolean }) {
  const map = useMap();
  
  useMapEvents({
    click(e) {
      if (mode === 'none' || isLocked) return;
      if (map.getZoom() < MIN_DRAW_ZOOM) return;
      onPointsChange([...points, [e.latlng.lat, e.latlng.lng]]);
    },
  });
  return null;
}

function MapUpdater({ center, zoom }: { center?: [number, number], zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
}

function ZoomListener({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  const map = useMapEvents({
    zoomend() {
      onZoomChange(map.getZoom());
    }
  });
  
  // Initialize zoom
  useEffect(() => {
    onZoomChange(map.getZoom());
  }, [map, onZoomChange]);
  
  return null;
}

export default function Map({ 
  mode, 
  points, 
  onPointsChange, 
  center = [41.7648, -80.7634], 
  zoom = 10, 
  isLocked = false,
  features = [],
  drawingColor = '#3b82f6',
  isDrawingGate = false
}: MapProps) {
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [showLabels, setShowLabels] = useState(true);
  
  const handleUndo = () => {
    onPointsChange(points.slice(0, -1));
  };

  const handleClear = () => {
    onPointsChange([]);
  };

  const canDraw = currentZoom >= MIN_DRAW_ZOOM && !isLocked;

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-inner border border-white/10">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="w-full h-full z-0">
        {/* Base Satellite Imagery */}
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxNativeZoom={19}
          maxZoom={22}
        />
        
        {/* Optional Streets and Labels Overlays */}
        {showLabels && (
          <>
            <TileLayer 
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}" 
              maxNativeZoom={19}
              maxZoom={22}
            />
            <TileLayer 
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}" 
              maxNativeZoom={19}
              maxZoom={22}
            />
          </>
        )}

        <MapEvents mode={mode} points={points} onPointsChange={onPointsChange} isLocked={isLocked} />
        <MapUpdater center={center} zoom={zoom} />
        <ZoomListener onZoomChange={setCurrentZoom} />
        
        {/* Render completed features */}
        {features.map((f) => (
          <React.Fragment key={f.id}>
            {f.type === 'line' && (
              <Polyline 
                positions={f.points} 
                color={f.color} 
                weight={f.isGate ? 6 : 4} 
                dashArray={f.isGate ? "10, 10" : undefined} 
              />
            )}
            {f.type === 'polygon' && (
              <Polygon 
                positions={f.points} 
                color={f.color} 
                fillColor={f.color} 
                fillOpacity={0.4} 
                weight={3} 
              />
            )}
          </React.Fragment>
        ))}

        {/* Render current drawing points */}
        {points.map((p, i) => (
          <Marker key={i} position={p} />
        ))}

        {mode === 'line' && points.length > 1 && (
          <Polyline 
            positions={points} 
            color={drawingColor} 
            weight={isDrawingGate ? 6 : 4} 
            dashArray={isDrawingGate ? "10, 10" : undefined} 
          />
        )}

        {mode === 'polygon' && points.length > 2 && (
          <Polygon positions={points} color={drawingColor} fillColor={drawingColor} fillOpacity={0.4} weight={3} />
        )}
        {mode === 'polygon' && points.length === 2 && (
          <Polyline positions={points} color={drawingColor} weight={3} dashArray="5, 10" />
        )}
      </MapContainer>

      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={() => setShowLabels(!showLabels)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-md text-sm font-medium transition-colors backdrop-blur-sm ${
            showLabels ? 'bg-slate-800/90 text-white hover:bg-slate-900' : 'bg-white/90 text-slate-800 hover:bg-white'
          }`}
          title="Toggle Streets & Labels"
        >
          <Layers className="w-4 h-4" />
          {showLabels ? 'Labels On' : 'Labels Off'}
        </button>

        {mode !== 'none' && !isLocked && (
          <>
            <button
              onClick={handleUndo}
              disabled={points.length === 0}
              className="bg-white/90 backdrop-blur-sm text-slate-800 px-3 py-2 rounded-lg shadow-md text-sm font-medium hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Undo Point
            </button>
            <button
              onClick={handleClear}
              disabled={points.length === 0}
              className="bg-red-500/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-md text-sm font-medium hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Clear Current
            </button>
          </>
        )}
      </div>
      
      {mode !== 'none' && !isLocked && points.length === 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md pointer-events-none whitespace-nowrap">
          {canDraw ? 'Click on the map to start drawing' : 'Zoom in closer to start drawing'}
        </div>
      )}
    </div>
  );
}

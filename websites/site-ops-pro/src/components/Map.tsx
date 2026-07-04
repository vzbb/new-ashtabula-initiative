import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Polygon, useMapEvents, useMap, ScaleControl } from 'react-leaflet';
import { Layers, Plus, Minus, Pencil, Square, Minus as LineIcon, MousePointer2, Undo2, Trash2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker for drawing points
const drawIcon = new L.DivIcon({
  className: 'draw-point-marker',
  html: '<div style="width:10px;height:10px;background:#f59e0b;border:2px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>',
  iconSize: [10, 10],
  iconAnchor: [5, 5],
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

const MIN_DRAW_ZOOM = 16;

/* ── Leaflet child components ────────────────── */

function MapEvents({ mode, points, onPointsChange, isLocked, drawingColor }: {
  mode: 'line' | 'polygon' | 'none';
  points: [number, number][];
  onPointsChange: (points: [number, number][]) => void;
  isLocked: boolean;
  drawingColor: string;
}) {
  const map = useMap();

  useMapEvents({
    click(e) {
      if (mode === 'none' || isLocked) return;
      if (map.getZoom() < MIN_DRAW_ZOOM) return;
      onPointsChange([...points, [e.latlng.lat, e.latlng.lng]]);
    },
    dblclick() {
      // Don't add a point on double-click — let double-click zoom work
    },
  });
  return null;
}

function MapUpdater({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (center && zoom) {
      map.flyTo(center, zoom, { duration: 0.8 });
    } else if (center) {
      map.flyTo(center, map.getZoom(), { duration: 0.8 });
    }
  }, [center, zoom, map]);
  return null;
}

function ZoomListener({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  const map = useMapEvents({
    zoomend() {
      onZoomChange(map.getZoom());
    },
  });
  useEffect(() => {
    onZoomChange(map.getZoom());
  }, [map, onZoomChange]);
  return null;
}

/* ── Custom zoom control via sub-components ──── */

function ZoomControl({ map }: { map: L.Map }) {
  return (
    <div className="flex flex-col gap-[1px] shadow-lg rounded-lg overflow-hidden">
      <button
        onClick={() => map.zoomIn(1, { animate: true, duration: 0.3 })}
        className="bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 w-9 h-9 flex items-center justify-center transition-all backdrop-blur-sm border-b border-stone-200/60 active:scale-95"
        title="Zoom in"
        aria-label="Zoom in"
      >
        <Plus className="w-4 h-4" />
      </button>
      <button
        onClick={() => map.zoomOut(1, { animate: true, duration: 0.3 })}
        className="bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 w-9 h-9 flex items-center justify-center transition-all backdrop-blur-sm active:scale-95"
        title="Zoom out"
        aria-label="Zoom out"
      >
        <Minus className="w-4 h-4" />
      </button>
    </div>
  );
}

function ZoomControlMount() {
  const map = useMap();
  return <ZoomControl map={map} />;
}

/* ── Drawing toolbar component ────────────────── */

interface DrawingToolbarProps {
  mode: 'line' | 'polygon' | 'none';
  onModeChange: (mode: 'line' | 'polygon' | 'none') => void;
  points: [number, number][];
  onUndo: () => void;
  onClear: () => void;
  isLocked: boolean;
  currentZoom: number;
}

function DrawingToolbar({
  mode,
  onModeChange,
  points,
  onUndo,
  onClear,
  isLocked,
  currentZoom,
}: DrawingToolbarProps) {
  const canDraw = currentZoom >= MIN_DRAW_ZOOM && !isLocked;
  const hasPoints = points.length > 0;
  const showTooltip = mode !== 'none' && !isLocked && points.length === 0;

  return (
    <>
      {/* Drawing mode toolbar — top center */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-1 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-stone-200/60 p-1 transition-all duration-300">
        <button
          onClick={() => onModeChange('none')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            mode === 'none'
              ? 'bg-stone-800 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-800 hover:bg-stone-100'
          }`}
          title="Pan / Select mode"
        >
          <MousePointer2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Pan</span>
        </button>
        <button
          onClick={() => onModeChange('line')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            mode === 'line'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-800 hover:bg-stone-100'
          }`}
          title="Draw line / distance measurement"
        >
          <LineIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Line</span>
        </button>
        <button
          onClick={() => onModeChange('polygon')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            mode === 'polygon'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-800 hover:bg-stone-100'
          }`}
          title="Draw polygon / area measurement"
        >
          <Square className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Polygon</span>
        </button>

        {/* Vertical divider */}
        {hasPoints && <div className="w-px h-6 bg-stone-200 mx-1" />}

        {hasPoints && (
          <>
            <button
              onClick={onUndo}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 transition-all"
              title="Undo last point"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Undo</span>
            </button>
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all"
              title="Clear all points"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </>
        )}
      </div>

      {/* Point counter badge */}
      {hasPoints && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] bg-stone-900/80 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full border border-white/10 transition-all duration-300">
          {points.length} point{points.length !== 1 ? 's' : ''} placed
          {mode === 'polygon' && points.length >= 3 && ' · polygon ready'}
        </div>
      )}

      {/* Instruction tooltip */}
      {showTooltip && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] transition-all duration-300">
          <div className="bg-black/75 text-white px-4 py-2 rounded-full text-xs font-medium backdrop-blur-md whitespace-nowrap shadow-lg">
            {canDraw
              ? `Click on the map to place ${mode === 'line' ? 'line' : 'polygon'} points`
              : 'Zoom in closer to start drawing'}
          </div>
        </div>
      )}
    </>
  );
}

/* ── Main Map component ──────────────────────── */

export default function Map({
  mode,
  points,
  onPointsChange,
  center = [41.7648, -80.7634],
  zoom = 10,
  isLocked = false,
  features = [],
  drawingColor = '#f59e0b',
  isDrawingGate = false,
}: MapProps) {
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [showLabels, setShowLabels] = useState(true);
  const [internalMode, setInternalMode] = useState<'line' | 'polygon' | 'none'>(mode);
  const mapRef = useRef<L.Map | null>(null);

  // Sync external mode changes
  useEffect(() => {
    setInternalMode(mode);
  }, [mode]);

  const handleUndo = useCallback(() => {
    onPointsChange(points.slice(0, -1));
  }, [points, onPointsChange]);

  const handleClear = useCallback(() => {
    onPointsChange([]);
  }, [onPointsChange]);

  const handleModeChange = useCallback((newMode: 'line' | 'polygon' | 'none') => {
    setInternalMode(newMode);
    // When switching modes, clear current drawing points
    if (newMode !== internalMode && points.length > 0) {
      onPointsChange([]);
    }
  }, [internalMode, points, onPointsChange]);

  const canDraw = currentZoom >= MIN_DRAW_ZOOM && !isLocked;

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-inner border border-white/10 transition-all duration-300">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        zoomControl={false}
        className="w-full h-full z-0 transition-all duration-300"
        ref={mapRef}
      >
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

        {/* Scale control — bottom-left */}
        <ScaleControl position="bottomleft" imperial={true} metric={false} />

        {/* Custom zoom control mount */}
        <ZoomControlMount />

        {/* Event listeners */}
        <MapEvents
          mode={internalMode}
          points={points}
          onPointsChange={onPointsChange}
          isLocked={isLocked}
          drawingColor={drawingColor}
        />
        <MapUpdater center={center} zoom={zoom} />
        <ZoomListener onZoomChange={setCurrentZoom} />

        {/* Completed features */}
        {features.map((f) => (
          <React.Fragment key={f.id}>
            {f.type === 'line' && (
              <Polyline
                positions={f.points}
                color={f.color}
                weight={f.isGate ? 6 : 4}
                dashArray={f.isGate ? '10, 10' : undefined}
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

        {/* Current drawing points */}
        {points.map((p, i) => (
          <Marker key={i} position={p} icon={drawIcon} />
        ))}

        {/* Current line drawing */}
        {internalMode === 'line' && points.length > 1 && (
          <Polyline
            positions={points}
            color={drawingColor}
            weight={isDrawingGate ? 6 : 4}
            dashArray={isDrawingGate ? '10, 10' : undefined}
          />
        )}

        {/* Current polygon drawing */}
        {internalMode === 'polygon' && points.length > 2 && (
          <Polygon
            positions={points}
            color={drawingColor}
            fillColor={drawingColor}
            fillOpacity={0.3}
            weight={3}
          />
        )}
        {internalMode === 'polygon' && points.length === 2 && (
          <Polyline positions={points} color={drawingColor} weight={3} dashArray="5, 10" />
        )}
      </MapContainer>

      {/* Drawing toolbar overlay */}
      <DrawingToolbar
        mode={internalMode}
        onModeChange={handleModeChange}
        points={points}
        onUndo={handleUndo}
        onClear={handleClear}
        isLocked={isLocked}
        currentZoom={currentZoom}
      />

      {/* Labels toggle — top right */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 transition-all duration-300">
        <button
          onClick={() => setShowLabels(!showLabels)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-md text-xs font-medium transition-all backdrop-blur-sm border ${
            showLabels
              ? 'bg-slate-800/80 text-white border-slate-700/50 hover:bg-slate-800'
              : 'bg-white/90 text-stone-700 border-white/20 hover:bg-white'
          }`}
          title="Toggle streets & labels overlay"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{showLabels ? 'Labels' : 'Labels Off'}</span>
        </button>
      </div>
    </div>
  );
}

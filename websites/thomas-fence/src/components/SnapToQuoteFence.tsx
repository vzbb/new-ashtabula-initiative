import React, { useState, useMemo } from 'react';
import { Ruler, MapPin, Shield, CheckCircle2, Plus, X, DoorOpen } from 'lucide-react';
import { motion } from 'motion/react';
import Map, { MapFeature } from './Map';
import { calculateDistance } from '../lib/utils';
import AddressAutocomplete from './AddressAutocomplete';

type FenceType = 'chainlink' | 'wood' | 'vinyl' | 'privacy';
type FenceHeight = '4' | '6' | '8';
type GateType = 'swinging' | 'electronic';
type GateMaterial = 'wood' | 'chainlink' | 'wrought iron';
type GateWidth = 'walkway' | 'single-car' | 'double-car';

interface FenceStructure {
  id: string;
  category: 'fence' | 'gate';
  points: [number, number][];
  color: string;
  
  fenceType?: FenceType;
  height?: FenceHeight;
  linearFootage?: number;
  
  gateType?: GateType;
  gateMaterial?: GateMaterial;
  gateWidth?: GateWidth;
}

const COLORS = ['#228b22', '#4caf50', '#14532d'];
const GATE_COLOR = '#b45309';

export default function SnapToQuoteFence() {
  const [structures, setStructures] = useState<FenceStructure[]>([]);
  const [drawingCategory, setDrawingCategory] = useState<'fence' | 'gate'>('fence');

  const [points, setPoints] = useState<[number, number][]>([]);
  const [fenceType, setFenceType] = useState<FenceType>('wood');
  const [height, setHeight] = useState<FenceHeight>('6');
  
  const [gateType, setGateType] = useState<GateType>('swinging');
  const [gateMaterial, setGateMaterial] = useState<GateMaterial>('wood');
  const [gateWidth, setGateWidth] = useState<GateWidth>('walkway');

  const [address, setAddress] = useState('');
  const [center, setCenter] = useState<[number, number]>([41.7648, -80.7634]);
  const [zoom, setZoom] = useState(10);
  const [isLocationLocked, setIsLocationLocked] = useState(true);

  const handleAddressSelect = (lat: number, lon: number, selectedAddress: string) => {
    setAddress(selectedAddress);
    setCenter([lat, lon]);
    setZoom(19);
    setIsLocationLocked(false);
  };

  const handlePointsChange = (newPoints: [number, number][]) => {
    if (drawingCategory === 'gate' && newPoints.length > 2) {
      return; // Max 2 points for a gate
    }
    setPoints(newPoints);
  };

  const linearFootage = useMemo(() => {
    if (points.length < 2) return 0;
    let total = 0;
    for (let i = 0; i < points.length - 1; i++) {
      total += calculateDistance(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1]);
    }
    return total;
  }, [points]);

  const fenceCount = structures.filter(s => s.category === 'fence').length;
  const canDrawFence = fenceCount < 3;
  const currentDrawingColor = drawingCategory === 'gate' ? GATE_COLOR : COLORS[fenceCount % COLORS.length];

  const handleSaveStructure = () => {
    if (points.length < 2) return;
    
    const newStructure: FenceStructure = {
      id: Math.random().toString(36).substr(2, 9),
      category: drawingCategory,
      points: [...points],
      color: currentDrawingColor,
    };
    
    if (drawingCategory === 'fence') {
      newStructure.fenceType = fenceType;
      newStructure.height = height;
      newStructure.linearFootage = linearFootage;
    } else {
      newStructure.gateType = gateType;
      newStructure.gateMaterial = gateMaterial;
      newStructure.gateWidth = gateWidth;
    }
    
    setStructures([...structures, newStructure]);
    setPoints([]);
  };

  const handleDeleteStructure = (id: string) => {
    setStructures(structures.filter(s => s.id !== id));
  };

  const pricing = {
    'chainlink': { '4': 15, '6': 20, '8': 28 },
    'wood': { '4': 25, '6': 35, '8': 45 },
    'vinyl': { '4': 35, '6': 45, '8': 60 },
    'privacy': { '4': 40, '6': 55, '8': 75 },
  };

  const gatePricing = {
    'walkway': 300,
    'single-car': 600,
    'double-car': 1200,
  };

  const gateMaterialMultiplier = {
    'wood': 1,
    'chainlink': 0.8,
    'wrought iron': 2.5,
  };

  const gateTypeMultiplier = {
    'swinging': 1,
    'electronic': 2.5,
  };

  let totalMin = 0;
  let totalMax = 0;
  let totalFeet = 0;

  structures.forEach(s => {
    if (s.category === 'fence') {
      const costPerFoot = pricing[s.fenceType!][s.height!];
      const cost = s.linearFootage! * costPerFoot;
      totalMin += cost * 0.9;
      totalMax += cost * 1.1;
      totalFeet += s.linearFootage!;
    } else {
      const baseCost = gatePricing[s.gateWidth!];
      const matMult = gateMaterialMultiplier[s.gateMaterial!];
      const typeMult = gateTypeMultiplier[s.gateType!];
      const cost = baseCost * matMult * typeMult;
      totalMin += cost * 0.9;
      totalMax += cost * 1.1;
    }
  });

  if (points.length >= 2) {
    if (drawingCategory === 'fence') {
      const costPerFoot = pricing[fenceType][height];
      const cost = linearFootage * costPerFoot;
      totalMin += cost * 0.9;
      totalMax += cost * 1.1;
      totalFeet += linearFootage;
    } else {
      const baseCost = gatePricing[gateWidth];
      const matMult = gateMaterialMultiplier[gateMaterial];
      const typeMult = gateTypeMultiplier[gateType];
      const cost = baseCost * matMult * typeMult;
      totalMin += cost * 0.9;
      totalMax += cost * 1.1;
    }
  }

  const mapFeatures: MapFeature[] = structures.map(s => ({
    id: s.id,
    type: 'line',
    points: s.points,
    color: s.color,
    isGate: s.category === 'gate'
  }));

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 lg:grid-rows-[auto_minmax(0,1fr)] gap-6 h-full">
      <div className="lg:col-span-4 lg:row-start-1 flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-[color:var(--tf-primary-dark)] tracking-tight">Thomas Fence Co. Quote Builder</h2>
          <p className="text-stone-600 mt-1 text-sm">
            Map your fence lines, gates, and access points for a fast estimate backed by Thomas Fence craftsmanship, fabrication, and field experience.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[color:var(--tf-border)] space-y-4">
          <h3 className="font-semibold text-[color:var(--tf-primary-dark)] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[color:var(--tf-primary)]" />
            Find Your Property
          </h3>
          <div className="flex gap-2">
            <AddressAutocomplete 
              value={address} 
              onChange={setAddress} 
              onSelect={handleAddressSelect} 
              placeholder="Enter your address or street..." 
              theme="blue" 
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 lg:row-span-2 lg:col-start-5 lg:row-start-1 h-[500px] lg:h-full bg-[color:var(--tf-surface)] rounded-2xl overflow-hidden shadow-sm border border-[color:var(--tf-border)] relative">
        {isLocationLocked && (
          <div className="absolute inset-0 z-[1000] bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full text-center">
              <div className="w-12 h-12 bg-[color:var(--tf-surface)] text-[color:var(--tf-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Where is your property?</h3>
              <p className="text-slate-500 text-sm mb-6">Search for your address to zoom in and start drawing your fence line.</p>
              
              <div className="flex gap-2 text-left">
                <AddressAutocomplete 
                  value={address} 
                  onChange={setAddress} 
                  onSelect={handleAddressSelect} 
                  placeholder="Enter address..." 
                  theme="blue" 
                />
              </div>
            </div>
          </div>
        )}
        <Map 
          mode="line" 
          points={points} 
          onPointsChange={handlePointsChange} 
          center={center} 
          zoom={zoom} 
          isLocked={isLocationLocked}
          features={mapFeatures}
          drawingColor={currentDrawingColor}
          isDrawingGate={drawingCategory === 'gate'}
        />
      </div>

      <div className="lg:col-span-4 lg:row-start-2 flex flex-col gap-6 overflow-y-auto pr-2 pb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[color:var(--tf-border)] space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[color:var(--tf-primary-dark)] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[color:var(--tf-primary)]" />
              Build Structure
            </h3>
          </div>

          <div className="flex bg-[color:var(--tf-surface)] rounded-xl p-1 border border-[color:var(--tf-border)]">
            <button
              onClick={() => { setDrawingCategory('fence'); setPoints([]); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                drawingCategory === 'fence'
                  ? 'bg-white shadow-sm text-[color:var(--tf-primary-dark)] border border-[color:var(--tf-border)]'
                  : 'text-stone-500 hover:text-[color:var(--tf-primary-dark)]'
              }`}
            >
              <Shield className="w-4 h-4" /> Fence
            </button>
            <button
              onClick={() => { setDrawingCategory('gate'); setPoints([]); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                drawingCategory === 'gate'
                  ? 'bg-white shadow-sm text-[color:var(--tf-primary-dark)] border border-[color:var(--tf-border)]'
                  : 'text-stone-500 hover:text-[color:var(--tf-primary-dark)]'
              }`}
            >
              <DoorOpen className="w-4 h-4" /> Gate
            </button>
          </div>
          
          {drawingCategory === 'fence' && (
            <>
              {!canDrawFence ? (
                <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-sm border border-amber-200">
                  You have reached the maximum of 3 fence structures.
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[color:var(--tf-primary)] uppercase tracking-wider">Material Style</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'chainlink', label: 'Chainlink' },
                        { id: 'wood', label: 'Wood Picket' },
                        { id: 'vinyl', label: 'Vinyl' },
                        { id: 'privacy', label: 'Privacy Wood' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setFenceType(m.id as any)}
                          className={`py-2 px-2 text-sm font-medium rounded-xl border transition-all ${
                            fenceType === m.id
                              ? 'bg-[color:var(--tf-surface)] border-[color:var(--tf-primary)] text-[color:var(--tf-primary-dark)] shadow-sm'
                              : 'bg-white border-[color:var(--tf-border)] text-stone-600 hover:border-[color:var(--tf-primary)] hover:bg-[color:var(--tf-surface)]'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[color:var(--tf-primary)] uppercase tracking-wider">Height</label>
                    <div className="flex bg-[color:var(--tf-surface)] rounded-xl p-1 border border-[color:var(--tf-border)]">
                      {['4', '6', '8'].map((h) => (
                        <button
                          key={h}
                          onClick={() => setHeight(h as any)}
                          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                            height === h
                              ? 'bg-white shadow-sm text-[color:var(--tf-primary-dark)] border border-[color:var(--tf-border)]'
                              : 'text-stone-500 hover:text-[color:var(--tf-primary-dark)]'
                          }`}
                        >
                          {h} ft
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {drawingCategory === 'gate' && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-medium text-[color:var(--tf-primary)] uppercase tracking-wider">Gate Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'swinging', label: 'Swinging' },
                    { id: 'electronic', label: 'Electronic' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setGateType(m.id as any)}
                      className={`py-2 px-2 text-sm font-medium rounded-xl border transition-all ${
                        gateType === m.id
                          ? 'bg-[color:var(--tf-surface)] border-[color:var(--tf-primary)] text-[color:var(--tf-primary-dark)] shadow-sm'
                          : 'bg-white border-[color:var(--tf-border)] text-stone-600 hover:border-[color:var(--tf-primary)] hover:bg-[color:var(--tf-surface)]'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-[color:var(--tf-primary)] uppercase tracking-wider">Material</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'wood', label: 'Wood' },
                    { id: 'chainlink', label: 'Chainlink' },
                    { id: 'wrought iron', label: 'Iron' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setGateMaterial(m.id as any)}
                      className={`py-2 px-1 text-xs font-medium rounded-xl border transition-all ${
                        gateMaterial === m.id
                          ? 'bg-[color:var(--tf-surface)] border-[color:var(--tf-primary)] text-[color:var(--tf-primary-dark)] shadow-sm'
                          : 'bg-white border-[color:var(--tf-border)] text-stone-600 hover:border-[color:var(--tf-primary)] hover:bg-[color:var(--tf-surface)]'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-[color:var(--tf-primary)] uppercase tracking-wider">Width</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'walkway', label: 'Walkway' },
                    { id: 'single-car', label: '1-Car' },
                    { id: 'double-car', label: '2-Car' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setGateWidth(m.id as any)}
                      className={`py-2 px-1 text-xs font-medium rounded-xl border transition-all ${
                        gateWidth === m.id
                          ? 'bg-[color:var(--tf-surface)] border-[color:var(--tf-primary)] text-[color:var(--tf-primary-dark)] shadow-sm'
                          : 'bg-white border-[color:var(--tf-border)] text-stone-600 hover:border-[color:var(--tf-primary)] hover:bg-[color:var(--tf-surface)]'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {points.length >= 2 && (
            <button 
              onClick={handleSaveStructure} 
              className="w-full bg-[color:var(--tf-primary)] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[color:var(--tf-primary-dark)] transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Save {drawingCategory === 'fence' ? 'Fence Line' : 'Gate'}
            </button>
          )}
        </div>

        {structures.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[color:var(--tf-primary-dark)] px-1">Saved Structures</h4>
            {structures.map(s => (
              <div key={s.id} className="bg-white p-3 rounded-xl border border-[color:var(--tf-border)] flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }}></div>
                  <div>
                    <div className="text-sm font-medium text-[color:var(--tf-primary-dark)] capitalize leading-tight">
                      {s.category === 'fence' ? `${s.fenceType} Fence (${s.height}ft)` : `${s.gateType} Gate`}
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5 capitalize">
                      {s.category === 'fence' ? `${s.linearFootage?.toFixed(1)} ft` : `${s.gateWidth} • ${s.gateMaterial}`}
                    </div>
                  </div>
                </div>
                <button onClick={() => handleDeleteStructure(s.id)} className="text-slate-400 hover:text-red-500 p-1 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[color:var(--tf-primary-dark)] to-[color:var(--tf-primary)] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <h3 className="text-emerald-100 text-sm font-medium mb-4 flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            Estimated Quote
          </h3>
          
          <div className="mb-6">
            <div className="text-4xl font-light tracking-tight">
              ${Math.round(totalMin).toLocaleString()} <span className="text-2xl text-emerald-200">-</span> ${Math.round(totalMax).toLocaleString()}
            </div>
            <div className="text-emerald-100 text-sm mt-2 font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {totalFeet.toFixed(1)} Total Linear Feet
            </div>
          </div>

          <div className="space-y-2 text-sm border-t border-white/20 pt-4">
            <div className="flex justify-between text-emerald-100">
              <span>Structures</span>
              <span className="text-white">{structures.length + (points.length >= 2 ? 1 : 0)}</span>
            </div>
            <div className="flex justify-between text-emerald-100">
              <span>Installation</span>
              <span className="text-white">Included</span>
            </div>
            <div className="flex justify-between text-emerald-100">
              <span>Thomas Promise</span>
              <span className="text-white">Employees Only</span>
            </div>
          </div>

          <button className="w-full mt-6 bg-white text-[color:var(--tf-primary-dark)] hover:bg-[color:var(--tf-surface)] font-semibold py-3 rounded-xl transition-colors shadow-md">
            Schedule In-Person Estimate
          </button>
        </motion.div>
      </div>

      <div className="lg:col-span-8 h-[500px] lg:h-full bg-[color:var(--tf-surface)] rounded-2xl overflow-hidden shadow-sm border border-[color:var(--tf-border)] relative">
        {isLocationLocked && (
          <div className="absolute inset-0 z-[1000] bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full text-center">
              <div className="w-12 h-12 bg-[color:var(--tf-surface)] text-[color:var(--tf-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Where is your property?</h3>
              <p className="text-slate-500 text-sm mb-6">Search for your address to zoom in and start drawing your fence line.</p>
              
              <div className="flex gap-2 text-left">
                <AddressAutocomplete 
                  value={address} 
                  onChange={setAddress} 
                  onSelect={handleAddressSelect} 
                  placeholder="Enter address..." 
                  theme="blue" 
                />
              </div>
            </div>
          </div>
        )}
        <Map 
          mode="line" 
          points={points} 
          onPointsChange={handlePointsChange} 
          center={center} 
          zoom={zoom} 
          isLocked={isLocationLocked}
          features={mapFeatures}
          drawingColor={currentDrawingColor}
          isDrawingGate={drawingCategory === 'gate'}
        />
      </div>
    </div>
  );
}

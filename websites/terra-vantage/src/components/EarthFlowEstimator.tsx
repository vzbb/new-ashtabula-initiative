import React, { useState, useMemo } from 'react';
import { Ruler, MapPin, HardHat, Clock, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import Map from './Map';
import { calculateArea } from '../lib/utils';
import AddressAutocomplete from './AddressAutocomplete';

export default function EarthFlowEstimator() {
  const [points, setPoints] = useState<[number, number][]>([]);
  const [projectType, setProjectType] = useState<'excavation' | 'fill' | 'grading'>('excavation');
  const [depth, setDepth] = useState<number>(12); // inches
  const [address, setAddress] = useState('');
  // Ashtabula County, OH coordinates
  const [center, setCenter] = useState<[number, number]>([41.7648, -80.7634]);
  const [zoom, setZoom] = useState(10);
  const [isLocationLocked, setIsLocationLocked] = useState(true);

  const handleAddressSelect = (lat: number, lon: number, selectedAddress: string) => {
    setAddress(selectedAddress);
    setCenter([lat, lon]);
    setZoom(19);
    setIsLocationLocked(false);
  };

  const areaSqFt = useMemo(() => {
    if (points.length < 3) return 0;
    return calculateArea(points);
  }, [points]);

  // Cubic yards = (Area in sq ft * depth in ft) / 27
  const cubicYards = (areaSqFt * (depth / 12)) / 27;
  const roundedYards = Math.ceil(cubicYards * 10) / 10;

  // Labor estimation (mock logic)
  // Excavation: 0.5 hours per yard
  // Fill: 0.4 hours per yard
  // Grading: 0.2 hours per yard (depth matters less, area matters more)
  const laborRates = {
    excavation: 0.5,
    fill: 0.4,
    grading: 0.2,
  };

  const laborHours = projectType === 'grading' 
    ? Math.ceil((areaSqFt / 1000) * 2) 
    : Math.ceil(roundedYards * laborRates[projectType]);

  const hourlyRate = 120; // $120/hr for crew + equipment
  const materialCostPerYard = projectType === 'fill' ? 25 : 0; // Only fill costs material
  const disposalCostPerYard = projectType === 'excavation' ? 35 : 0; // Excavation costs disposal

  const laborCost = laborHours * hourlyRate;
  const materialCost = roundedYards * materialCostPerYard;
  const disposalCost = roundedYards * disposalCostPerYard;
  const totalCost = laborCost + materialCost + disposalCost;

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 lg:grid-rows-[auto_minmax(0,1fr)] gap-6 h-full">
      <div className="lg:col-span-4 lg:row-start-1 flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">EarthFlow Estimator</h2>
          <p className="text-stone-500 mt-1 text-sm">Professional site volume and labor calculator.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 space-y-4">
          <h3 className="font-semibold text-stone-800 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-600" />
            Job Site Location
          </h3>
          <div className="flex gap-2">
            <AddressAutocomplete 
              value={address} 
              onChange={setAddress} 
              onSelect={handleAddressSelect} 
              placeholder="Enter site address or street..." 
              theme="amber" 
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 lg:row-span-2 lg:col-start-5 lg:row-start-1 h-[500px] lg:h-full bg-stone-100 rounded-2xl overflow-hidden shadow-sm border border-stone-200 relative">
        {isLocationLocked && (
          <div className="absolute inset-0 z-[1000] bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full text-center">
              <div className="w-12 h-12 bg-stone-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">Where is the job site?</h3>
              <p className="text-stone-500 text-sm mb-6">Search for the site address to zoom in and start drawing the project area.</p>
              
              <div className="flex gap-2 text-left">
                <AddressAutocomplete 
                  value={address} 
                  onChange={setAddress} 
                  onSelect={handleAddressSelect} 
                  placeholder="Enter address..." 
                  theme="amber" 
                />
              </div>
            </div>
          </div>
        )}
        <Map mode="polygon" points={points} onPointsChange={setPoints} center={center} zoom={zoom} isLocked={isLocationLocked} />
      </div>

      <div className="lg:col-span-4 lg:row-start-2 flex flex-col gap-6 overflow-y-auto pr-2 pb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 space-y-5">
          <h3 className="font-semibold text-stone-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-600" />
            Project Scope
          </h3>
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Operation Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'excavation', label: 'Excavation' },
                { id: 'fill', label: 'Fill/Import' },
                { id: 'grading', label: 'Grading' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setProjectType(m.id as any)}
                  className={`py-2 px-1 text-xs font-medium rounded-lg border transition-all ${
                    projectType === m.id
                      ? 'bg-amber-50 border-amber-500 text-amber-800 shadow-sm'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">
              {projectType === 'grading' ? 'Grade Change (inches)' : 'Depth/Height (inches)'}
            </label>
            <input
              type="range"
              min="1"
              max="120"
              step="1"
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
            <div className="flex justify-between text-xs text-stone-400 font-mono">
              <span>1"</span>
              <span className="text-amber-600 font-bold">{depth}" ({Math.round(depth/12 * 10)/10} ft)</span>
              <span>120"</span>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <h3 className="text-stone-400 text-sm font-medium mb-4 flex items-center gap-2">
            <HardHat className="w-4 h-4" />
            Project Estimate
          </h3>
          
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="text-4xl font-light tracking-tight">${totalCost.toLocaleString()}</div>
              <div className="text-amber-400 text-sm mt-1 font-mono flex items-center gap-4">
                <span>{roundedYards} CY</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {laborHours} hrs</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm border-t border-stone-800 pt-4">
            <div className="flex justify-between text-stone-400">
              <span>Area</span>
              <span className="text-stone-200">{areaSqFt.toFixed(0)} sq ft</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Labor & Equipment</span>
              <span className="text-stone-200">${laborCost.toLocaleString()}</span>
            </div>
            {projectType === 'fill' && (
              <div className="flex justify-between text-stone-400">
                <span>Material Import</span>
                <span className="text-stone-200">${materialCost.toLocaleString()}</span>
              </div>
            )}
            {projectType === 'excavation' && (
              <div className="flex justify-between text-stone-400">
                <span>Export & Disposal</span>
                <span className="text-stone-200">${disposalCost.toLocaleString()}</span>
              </div>
            )}
          </div>

          <button className="w-full mt-6 bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold py-3 rounded-xl transition-colors">
            Generate Bid Proposal
          </button>
        </motion.div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Info, Layers, Navigation, Download, ExternalLink, Building2 } from 'lucide-react';

export function PropertyLookup() {
  const [address, setAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!address.trim()) return;

    setIsSearching(true);
    // Mock search delay then navigate to results
    setTimeout(() => {
      navigate(`/saybrook-zoning/${encodeURIComponent(address)}`);
      setIsSearching(false);
    }, 800);
  };

  const suggestions = [
    "1101 Bridge Street",
    "4717 Main Avenue",
    "1000 W 5th Street",
    "234 Lake Avenue"
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-ashtabula-secondary/5 rounded-bl-full -mr-10 -mt-10" />
        
        <div className="relative z-10">
          <h3 className="text-3xl font-bold mb-2 text-ashtabula-primary">Property & Zoning Lookup</h3>
          <p className="text-slate-500 mb-8 max-w-2xl">
            Search for any parcel within the City of Ashtabula to identify its saybrook-zoning district, 
            allowed uses, and potential historic constraints.
          </p>
          
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter street address (e.g., 1101 Bridge St)"
                className="w-full pl-14 pr-6 py-4 bg-ashtabula-bg border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-ashtabula-primary/5 focus:border-ashtabula-primary transition-all text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-10 bg-ashtabula-primary text-white font-bold rounded-2xl hover:bg-ashtabula-accent transition-all shadow-lg shadow-ashtabula-primary/20 disabled:opacity-50 h-[60px]"
            >
              {isSearching ? 'Searching...' : 'Search Parcel'}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Suggestions:</span>
            {suggestions.map((s, i) => (
              <button 
                key={i}
                onClick={() => setAddress(s)}
                className="text-sm px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-ashtabula-secondary/10 hover:text-ashtabula-primary transition-colors border border-transparent hover:border-ashtabula-secondary/20"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-slate-200 aspect-video rounded-3xl border border-slate-300 relative overflow-hidden shadow-inner group">
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 flex-col gap-4">
              <div className="p-6 bg-white/50 backdrop-blur-sm rounded-full shadow-sm">
                <MapPin size={48} className="text-ashtabula-primary animate-bounce" />
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-700 text-lg">Interactive GIS Map Interface</p>
                <p className="text-sm max-w-xs mx-auto">Select a parcel directly on the map to view detailed saybrook-zoning information.</p>
              </div>
            </div>
            {/* Map Controls Mock */}
            <div className="absolute top-6 right-6 flex flex-col gap-3">
              <button className="p-3 bg-white rounded-xl shadow-lg hover:bg-slate-50 transition-colors text-ashtabula-primary"><Layers size={20} /></button>
              <button className="p-3 bg-white rounded-xl shadow-lg hover:bg-slate-50 transition-colors text-ashtabula-primary"><Navigation size={20} /></button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-ashtabula-primary rounded-3xl p-8 text-white relative overflow-hidden h-full flex flex-col justify-center">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-ashtabula-secondary/20 rounded-2xl flex items-center justify-center mb-6 border border-ashtabula-secondary/30">
                <Info size={24} className="text-ashtabula-secondary" />
              </div>
              <h4 className="text-2xl font-bold mb-4">Official GIS Data</h4>
              <p className="text-white/70 leading-relaxed mb-8">
                Access official parcel maps, historical documents, and ownership 
                records directly from the Ashtabula County Auditor's GIS portal.
              </p>
              <button className="flex items-center gap-3 text-ashtabula-secondary font-bold hover:text-white transition-colors group">
                Open External GIS Map
                <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
            <Building2 className="absolute -right-10 -bottom-10 opacity-5 w-64 h-64" />
          </div>
        </div>
      </div>
    </div>
  );
}

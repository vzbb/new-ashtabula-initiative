import { useState } from 'react';
import { Search, MapPin, Home, DollarSign, Calendar, Info, ExternalLink } from 'lucide-react';

export default function PropertyLookup() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);

  const mockProperties = [
    {
      parcelId: '01-001-00-001-00',
      address: '4400 Main Ave, Ashtabula, OH 44004',
      owner: 'CITY OF ASHTABULA',
      valuation: '$1,250,000',
      lastSale: 'N/A (Historical)',
      landUse: 'Municipal / Government',
      yearBuilt: '1924',
      sqFt: '12,400',
      zoning: 'C-3 (Central Business)',
      activePermits: 2
    },
    {
      parcelId: '01-005-00-088-00',
      address: '1105 Bridge St, Ashtabula, OH 44004',
      owner: 'BRIDGE STREET RETAIL LLC',
      valuation: '$485,000',
      lastSale: '$410,000 (Jan 12, 2024)',
      landUse: 'Commercial Retail',
      yearBuilt: '1895',
      sqFt: '3,800',
      zoning: 'H-D (Harbor District)',
      activePermits: 1
    },
    {
      parcelId: '05-123-10-045-00',
      address: '123 Harbor St, Ashtabula, OH 44004',
      owner: 'HARBORVIEW DEVELOPMENTS LLC',
      valuation: '$345,000',
      lastSale: '$310,000 (May 12, 2022)',
      landUse: 'Residential Multi-Family',
      yearBuilt: '1910',
      sqFt: '4,200',
      zoning: 'R-T (Residential Transition)',
      activePermits: 0
    },
    {
        parcelId: '02-005-00-015-00',
        address: '422 Lake Rd, Ashtabula, OH 44004',
        owner: 'DAVIS, REBECCA S',
        valuation: '$182,400',
        lastSale: '$155,000 (Nov 15, 2018)',
        landUse: 'Residential Single Family',
        yearBuilt: '1955',
        sqFt: '1,850',
        zoning: 'R-1 (Single Family Residential)',
        activePermits: 1
      },
      {
        parcelId: '03-010-00-089-00',
        address: '89 Main St, Ashtabula, OH 44004',
        owner: 'VALLEY HOLDINGS INC',
        valuation: '$42,000 (Land only)',
        lastSale: '$12,000 (Jan 10, 2005)',
        landUse: 'Vacant Commercial Land',
        yearBuilt: 'N/A',
        sqFt: '0.45 Acres',
        zoning: 'C-1 (Local Business)',
        activePermits: 0
      }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setResult(null);

    // Simulate API delay
    setTimeout(() => {
      const found = mockProperties.find(p => 
        p.address.toLowerCase().includes(query.toLowerCase()) || 
        p.parcelId.includes(query)
      );
      
      setResult(found || 'not_found');
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Property & Parcel Lookup</h1>
        <p className="text-gray-600">Access Ashtabula County auditor data and city permit records in one place.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by address or Parcel ID (e.g., 'Main Ave' or '01-001')"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 min-w-[120px]"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {result === 'not_found' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
          <Info className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-yellow-800">No properties found</h3>
          <p className="text-yellow-700 mt-1">We couldn't find a property matching "{query}". Try a different address or parcel ID.</p>
        </div>
      )}

      {result && result !== 'not_found' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-slate-900 px-8 py-6 text-white flex justify-between items-start">
              <div>
                <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Parcel ID: {result.parcelId}</div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-blue-400" />
                  {result.address}
                </h2>
              </div>
              <button className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition">
                <ExternalLink className="h-5 w-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-px bg-gray-200">
              <div className="bg-white p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center">
                    <Home className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-bold uppercase">Owner</div>
                    <div className="font-semibold">{result.owner}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-bold uppercase">Market Valuation</div>
                    <div className="font-semibold">{result.valuation}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-purple-50 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-bold uppercase">Year Built</div>
                    <div className="font-semibold">{result.yearBuilt}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 font-bold uppercase mb-1">Land Use</div>
                    <div className="text-sm font-medium">{result.landUse}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-bold uppercase mb-1">Square Feet</div>
                    <div className="text-sm font-medium">{result.sqFt} sq ft</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-bold uppercase mb-1">Zoning</div>
                    <div className="text-sm font-medium">{result.zoning}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-bold uppercase mb-1">Active Permits</div>
                    <div className="text-sm font-medium flex items-center gap-1">
                      {result.activePermits > 0 ? (
                        <span className="text-orange-600 flex items-center gap-1">
                           <span className="h-2 w-2 bg-orange-600 rounded-full animate-pulse"></span>
                           {result.activePermits} Active
                        </span>
                      ) : (
                        <span className="text-gray-500">None</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                   <div className="text-xs text-gray-500 font-bold uppercase mb-2">Last Sale</div>
                   <div className="text-sm font-medium">{result.lastSale}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-xs text-gray-400 italic font-medium">Source: Ashtabula County Auditor Real Estate Division (Updated Weekly)</span>
              <button className="text-blue-600 text-sm font-bold hover:underline">View on GIS Map</button>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder info for MVP */}
      {!result && !isSearching && (
        <div className="grid md:grid-cols-3 gap-6 opacity-60">
           <div className="p-4 border border-dashed border-gray-300 rounded-xl text-center">
              <div className="text-xs font-bold text-gray-400 mb-1">TOTAL PARCELS</div>
              <div className="text-xl font-bold text-gray-600">42,512</div>
           </div>
           <div className="p-4 border border-dashed border-gray-300 rounded-xl text-center">
              <div className="text-xs font-bold text-gray-400 mb-1">ASHTABULA CITY</div>
              <div className="text-xl font-bold text-gray-600">9,104</div>
           </div>
           <div className="p-4 border border-dashed border-gray-300 rounded-xl text-center">
              <div className="text-xs font-bold text-gray-400 mb-1">YEAR 2025 PERMITS</div>
              <div className="text-xl font-bold text-gray-600">128</div>
           </div>
        </div>
      )}
    </div>
  );
}

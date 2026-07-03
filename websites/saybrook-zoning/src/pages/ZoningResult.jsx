import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Info, 
  ShieldCheck, 
  AlertCircle, 
  FileText, 
  ArrowLeft,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export function ZoningResult() {
  const { address } = useParams();
  
  // Mock data for demonstration
  const propertyData = {
    address: decodeURIComponent(address),
    parcelId: '48-002-10-045-00',
    zoningDistrict: 'R-1 (Single-Family Residential)',
    description: 'This district is intended to provide for low-density residential development consisting primarily of single-family detached dwellings.',
    allowedUses: ['Single-family detached dwellings', 'Public parks and playgrounds', 'Home occupations (subject to Section 1105.02)'],
    conditionalUses: ['Churches and places of worship', 'Schools', 'Daycare centers'],
    restrictions: [
      'Minimum Lot Size: 7,500 sq ft',
      'Front Setback: 30 ft',
      'Side Setback: 10 ft',
      'Rear Setback: 25 ft',
      'Maximum Height: 35 ft'
    ],
    historicDistrict: address.toLowerCase().includes('bridge') ? 'Harbor Historical District' : null
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-ashtabula-primary hover:text-ashtabula-accent font-semibold transition-colors">
          <ArrowLeft size={20} />
          Back to Search
        </Link>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-ashtabula-primary text-ashtabula-primary rounded-lg font-bold hover:bg-ashtabula-bg transition-colors">
            Download PDF Report
          </button>
          <Link to="/chat" className="px-4 py-2 bg-ashtabula-primary text-white rounded-lg font-bold hover:bg-ashtabula-accent transition-colors">
            Ask Questions
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-ashtabula-primary p-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-ashtabula-secondary font-bold uppercase tracking-widest text-sm mb-2">
                <MapPin size={16} />
                Zoning Determination
              </div>
              <h1 className="text-3xl font-bold">{propertyData.address}</h1>
              <p className="mt-2 text-white/80 font-medium">Parcel ID: {propertyData.parcelId}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center">
              <span className="block text-xs uppercase opacity-70 mb-1">Current Zone</span>
              <span className="text-xl font-bold">{propertyData.zoningDistrict.split(' ')[0]}</span>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h3 className="text-xl font-bold text-ashtabula-primary mb-4 flex items-center gap-2">
                <Info size={22} className="text-ashtabula-secondary" />
                District Overview
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {propertyData.description}
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section>
                <h3 className="text-lg font-bold text-ashtabula-primary mb-4 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-green-500" />
                  Permitted Uses
                </h3>
                <ul className="space-y-3">
                  {propertyData.allowedUses.map((use, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ashtabula-secondary shrink-0" />
                      {use}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-ashtabula-primary mb-4 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-ashtabula-accent" />
                  Conditional Uses
                </h3>
                <ul className="space-y-3">
                  {propertyData.conditionalUses.map((use, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                      {use}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="bg-ashtabula-bg p-6 rounded-xl border border-slate-100">
              <h3 className="text-lg font-bold text-ashtabula-primary mb-4 flex items-center gap-2">
                <FileText size={20} className="text-ashtabula-secondary" />
                Dimensional Requirements
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {propertyData.restrictions.map((res, i) => {
                  const [label, value] = res.split(': ');
                  return (
                    <div key={i}>
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</span>
                      <span className="font-bold text-slate-800">{value}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            {propertyData.historicDistrict && (
              <div className="bg-amber-50 border border-ashtabula-secondary/30 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-ashtabula-primary mb-3 flex items-center gap-2">
                  <AlertCircle size={20} className="text-ashtabula-secondary" />
                  Historic Overlay
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                  This property is located within the <strong>{propertyData.historicDistrict}</strong>. 
                  Any exterior changes require approval from the Architectural Review Board.
                </p>
                <Link to="/chat" className="text-sm font-bold text-ashtabula-primary hover:underline flex items-center gap-1">
                  Learn about the review process <ArrowLeft size={14} className="rotate-180" />
                </Link>
              </div>
            )}

            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold text-ashtabula-primary mb-4">Next Steps</h3>
              <div className="space-y-4">
                <Link to="/permits" className="block w-full p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-ashtabula-secondary transition-all group">
                  <span className="block font-bold text-ashtabula-primary group-hover:text-ashtabula-secondary">Start Permit Wizard</span>
                  <span className="text-xs text-slate-500">Determine required permits for your project.</span>
                </Link>
                <Link to="/chat" className="block w-full p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-ashtabula-secondary transition-all group">
                  <span className="block font-bold text-ashtabula-primary group-hover:text-ashtabula-secondary">Chat with Clerk</span>
                  <span className="text-xs text-slate-500">Ask specific questions about this parcel.</span>
                </Link>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <p className="text-[11px] text-slate-500 leading-relaxed italic text-center">
                Official saybrook-zoning determinations must be obtained from the City of Ashtabula Planning & Community Development Department.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, Info, Search, Filter, Building2 } from 'lucide-react';

export function EligibilityChecker() {
  const [district, setDistrict] = useState('R-1');
  const [searchQuery, setSearchQuery] = useState('');

  const uses = [
    { name: 'Single-Family Dwelling', status: 'Permitted', district: 'R-1, R-2, R-3' },
    { name: 'Multi-Family Dwelling', status: 'Conditional', district: 'R-2, R-3' },
    { name: 'Accessory Structure (Shed)', status: 'Permitted', district: 'All Residential' },
    { name: 'Home Occupation', status: 'Permitted', district: 'R-1, R-2, R-3' },
    { name: 'Retail Store', status: 'Prohibited', district: 'R-1, R-2' },
    { name: 'Professional Office', status: 'Conditional', district: 'R-3' },
    { name: 'Swimming Pool', status: 'Permitted', district: 'All Residential' },
    { name: 'Daycare Center', status: 'Conditional', district: 'R-2, R-3' },
  ];

  const filteredUses = uses.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
          <div>
            <h3 className="text-3xl font-bold text-ashtabula-primary">Use Eligibility Checker</h3>
            <p className="text-slate-500 mt-2">Determine if your planned activity or structure is allowed in your zoning district.</p>
          </div>
          <div className="flex items-center gap-4 bg-ashtabula-bg p-3 rounded-2xl border border-slate-100 shadow-inner">
            <span className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-widest">Active District</span>
            <select 
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-5 py-2.5 text-ashtabula-primary font-bold focus:outline-none focus:ring-4 focus:ring-ashtabula-primary/5 shadow-sm"
            >
              <option value="R-1">R-1 (Low Density Residential)</option>
              <option value="R-2">R-2 (Medium Density Residential)</option>
              <option value="R-3">R-3 (High Density Residential)</option>
              <option value="B-1">B-1 (Neighborhood Business)</option>
              <option value="B-2">B-2 (General Business)</option>
              <option value="M-1">M-1 (Light Industrial)</option>
            </select>
          </div>
        </div>

        <div className="relative mb-8 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-ashtabula-primary transition-colors" size={24} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a use (e.g., 'shed', 'bakery', 'fence')..."
            className="w-full pl-14 pr-6 py-4 bg-ashtabula-bg border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-ashtabula-primary/5 focus:border-ashtabula-primary transition-all text-lg font-medium"
          />
        </div>

        <div className="overflow-hidden border border-slate-100 rounded-2xl shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ashtabula-bg/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Proposed Use</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Eligibility Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Applicable Districts</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUses.map((use, idx) => (
                <tr key={idx} className="hover:bg-ashtabula-bg/30 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="font-bold text-slate-800 group-hover:text-ashtabula-primary transition-colors">{use.name}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      {use.status === 'Permitted' && <CheckCircle2 className="text-emerald-500" size={20} />}
                      {use.status === 'Conditional' && <HelpCircle className="text-ashtabula-secondary" size={20} />}
                      {use.status === 'Prohibited' && <XCircle className="text-rose-500" size={20} />}
                      <span className={cn(
                        "text-sm font-bold",
                        use.status === 'Permitted' ? "text-emerald-600" : 
                        use.status === 'Conditional' ? "text-ashtabula-secondary" : "text-rose-600"
                      )}>
                        {use.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{use.district}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-xs font-bold text-ashtabula-primary hover:text-ashtabula-secondary transition-colors flex items-center gap-1.5 ml-auto">
                      View Code Section
                      <Building2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            title: 'Permitted Use', 
            icon: CheckCircle2, 
            color: 'text-emerald-500', 
            bg: 'bg-emerald-50',
            desc: 'Allowed by right, subject to standard regulations and zoning permit approval.' 
          },
          { 
            title: 'Conditional Use', 
            icon: HelpCircle, 
            color: 'text-ashtabula-secondary', 
            bg: 'bg-amber-50',
            desc: 'Requires a public hearing and approval from the Board of Zoning Appeals (BZA).' 
          },
          { 
            title: 'Prohibited Use', 
            icon: XCircle, 
            color: 'text-rose-500', 
            bg: 'bg-rose-50',
            desc: 'Not allowed within this zoning district under current city ordinances.' 
          },
        ].map((info, i) => (
          <div key={i} className={`${info.bg} p-6 rounded-2xl border border-white shadow-sm`}>
            <div className="flex items-center gap-3 mb-3">
              <info.icon className={info.color} size={24} />
              <h4 className={`font-bold ${info.color.replace('text-', 'text-opacity-90 text-')}`}>{info.title}</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {info.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

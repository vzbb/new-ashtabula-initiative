import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Search, Filter, ExternalLink, CheckSquare, Building2 } from 'lucide-react';

export function DocumentCenter() {
  const [searchQuery, setSearchQuery] = useState('');

  const documents = [
    { name: 'Residential Zoning Permit', type: 'Form', category: 'Permits', size: '245 KB' },
    { name: 'Commercial Zoning Permit', type: 'Form', category: 'Permits', size: '280 KB' },
    { name: 'Application for Review (Historic District)', type: 'Form', category: 'Historic', size: '190 KB' },
    { name: 'Harbor Historic District Design Guidelines', type: 'Guide', category: 'Reference', size: '1.2 MB' },
    { name: 'Zoning Fee Schedule 2026', type: 'PDF', category: 'Reference', size: '150 KB' },
    { name: 'Board of Zoning Appeals Application', type: 'Form', category: 'Appeals', size: '310 KB' },
    { name: 'Sign Permit Application', type: 'Form', category: 'Permits', size: '210 KB' },
    { name: 'Site Plan Checklist', type: 'Checklist', category: 'Requirements', size: '95 KB' },
  ];

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-ashtabula-bg rounded-bl-full -mr-16 -mt-16" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
            <div>
              <h3 className="text-3xl font-bold text-ashtabula-primary mb-2">Document & Form Center</h3>
              <p className="text-slate-500 max-w-lg">Access and download all official zoning documents, applications, and design guidelines for the City of Ashtabula.</p>
            </div>
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-ashtabula-primary transition-colors" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents or categories..."
                className="w-full pl-12 pr-6 py-4 bg-ashtabula-bg border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-ashtabula-primary/5 focus:border-ashtabula-primary transition-all font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc, idx) => (
              <div key={idx} className="group p-6 bg-white border border-slate-100 rounded-2xl hover:border-ashtabula-secondary hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-4 bg-ashtabula-bg rounded-2xl text-ashtabula-primary group-hover:bg-ashtabula-primary group-hover:text-ashtabula-secondary transition-all">
                      <FileText size={28} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-ashtabula-primary/40 bg-ashtabula-bg px-2.5 py-1 rounded-lg">
                      {doc.type}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 mb-2 group-hover:text-ashtabula-primary transition-colors leading-tight" title={doc.name}>{doc.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">Size: {doc.size}</p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-ashtabula-secondary uppercase tracking-widest">{doc.category}</span>
                  <button className="flex items-center gap-2 text-sm font-bold text-ashtabula-primary hover:text-ashtabula-accent transition-colors">
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-ashtabula-primary rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-lg">
            <h3 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h3>
            <p className="text-white/70 mb-8 leading-relaxed text-lg">
              Our AI Assistant can help you locate specific forms or explain which 
              requirements apply to your unique project based on city code.
            </p>
            <Link to="/chat" className="inline-flex items-center gap-3 bg-ashtabula-secondary text-ashtabula-primary px-8 py-3 rounded-xl font-bold hover:bg-white transition-all transform hover:-translate-y-1">
              Ask the Assistant
              <ExternalLink size={18} />
            </Link>
          </div>
          <Building2 className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64 -rotate-12" />
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-ashtabula-primary">
              <div className="p-2 bg-ashtabula-bg rounded-lg">
                <CheckSquare size={20} className="text-ashtabula-secondary" />
              </div>
              Submission Checklist
            </h3>
            <ul className="space-y-4">
              {[
                "Complete all form fields clearly",
                "Include a detailed site plan/drawing",
                "Attach photos of existing conditions",
                "Verify zoning district on GIS map",
                "Check if property is in Historic District"
              ].map((item, idx) => (
                <li key={idx} className="flex gap-4 text-sm group">
                  <div className="w-6 h-6 rounded-lg border-2 border-slate-100 bg-ashtabula-bg flex items-center justify-center shrink-0 group-hover:border-ashtabula-secondary transition-colors">
                    <div className="w-2 h-2 rounded-sm bg-ashtabula-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-slate-600 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Submit to PCD@cityofashtabula.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

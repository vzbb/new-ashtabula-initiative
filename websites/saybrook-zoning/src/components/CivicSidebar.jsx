import React from 'react';
import { ShieldCheck, Activity, Clock } from "lucide-react";

const ASSET_BASE = import.meta.env.BASE_URL || "/";
const saybrookSeal = `${ASSET_BASE}saybrook-seal.png`;

const intakeSteps = [
  { label: "1", title: "Inquiry", copy: "State zoning inquiry for code analysis." },
  { label: "2", title: "Documentation", copy: "Attach reference imagery for staff review." },
  { label: "3", title: "Format", copy: "Validate and format inquiry for municipal processing." },
  { label: "4", title: "Transmission", copy: "Execute formal delivery to township queue." },
];

export function CivicSidebar() {
  return (
    <>
      {/* Mobile Header - Top Anchored Status Bar */}
      <header className="lg:hidden bg-saybrook-forest text-saybrook-cream p-3 sm:p-4 border-b border-white/10 flex items-center justify-between sticky top-0 z-30 shrink-0 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 p-1 bg-white/5 rounded-full border border-white/10 flex items-center justify-center">
            <img 
              src={saybrookSeal} 
              alt="Saybrook Township Seal" 
              className="w-7 h-7 object-contain brightness-110"
            />
          </div>
          <div>
            <h2 className="font-display text-xs sm:text-sm leading-tight">Saybrook Township</h2>
            <p className="text-[7px] sm:text-[8px] uppercase tracking-widest opacity-60 font-black">Municipal Workstation</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-black/20 rounded-full border border-white/5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
          <span className="text-[9px] font-black uppercase tracking-tighter text-emerald-400">Station Live</span>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-80 h-screen bg-saybrook-forest text-saybrook-sand flex-col border-r border-saybrook-forest-deep/20 shrink-0 overflow-y-auto">
        {/* Township Seal & Branding */}
        <div className="p-8 pb-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 mb-4 p-2 bg-white/5 rounded-full border border-white/10 flex items-center justify-center">
              <img 
                src={saybrookSeal} 
                alt="Saybrook Township Seal" 
                className="w-20 h-20 object-contain brightness-110 contrast-125"
              />
            </div>
            <h2 className="font-display text-xl text-saybrook-cream leading-tight">
              Saybrook Township
            </h2>
            <p className="text-[10px] uppercase tracking-widest mt-1 opacity-60 font-bold">
              Municipal Workstation
            </p>
          </div>
        </div>

        {/* Service Status Widget (RAG) */}
        <div className="px-6 mb-8">
          <div className="bg-saybrook-forest-deep/40 rounded-xl p-4 border border-white/5 shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wider font-black opacity-90 text-saybrook-sand">System Status</span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <span className="text-[11px] font-black text-emerald-400 uppercase tracking-tighter">Station Live</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Activity size={14} className="opacity-70 text-saybrook-lake" />
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-saybrook-cream uppercase tracking-tight">Municipal Queue</p>
                  <div className="h-1.5 w-full bg-white/10 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-saybrook-lake w-1/3" />
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold text-emerald-400">NOMINAL</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock size={14} className="opacity-70 text-saybrook-lake" />
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-saybrook-cream uppercase tracking-tight">Processing Window</p>
                </div>
                <span className="text-[10px] font-mono font-bold opacity-80">~24h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Procedures */}
        <div className="flex-1 px-6">
          <h3 className="text-[11px] uppercase tracking-wider font-black opacity-90 mb-4 px-2 text-saybrook-sand">
            Operational Procedures
          </h3>
          <div className="space-y-1">
            {intakeSteps.map((step) => (
              <div 
                key={step.label} 
                className="group p-3 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
              >
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-saybrook-lake/20 text-saybrook-lake text-xs font-bold flex items-center justify-center border border-saybrook-lake/30">
                    {step.label}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-saybrook-cream mb-0.5">{step.title}</p>
                    <p className="text-xs opacity-60 font-medium leading-relaxed">{step.copy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badge Footer */}
        <div className="p-6 mt-auto">
          <div className="bg-saybrook-lake/10 border border-saybrook-lake/20 rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="text-saybrook-lake shrink-0" size={18} />
            <div>
              <p className="text-[11px] font-black text-saybrook-cream leading-tight uppercase tracking-tight">Municipal Intake Terminal</p>
              <p className="text-[10px] opacity-70 mt-1 font-medium">
                Cited zoning code provided for all official responses.
              </p>
            </div>
          </div>
        </div>
    </aside>
    </>
  );
}

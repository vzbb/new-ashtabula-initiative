import React from 'react';
import { ShieldCheck } from "lucide-react";

const ASSET_BASE = import.meta.env.BASE_URL || "/";
const saybrookSeal = `${ASSET_BASE}saybrook-seal.png`;

const simpleSteps = [
  { label: "01", title: "Let's Talk", copy: "Ask any zoning question, simple or complex." },
  { label: "02", title: "Gather Facts", copy: "I'll instantly cross-reference township code." },
  { label: "03", title: "Prepare Files", copy: "We'll organize documentation seamlessly." },
  { label: "04", title: "Official Review", copy: "Submit directly to the zoning office." },
];

export function CivicSidebar() {
  return (
    <aside className="saybrook-sidebar">
      {/* Integrated Anchor Seal */}
      <div className="flex flex-col items-center mb-2 group">
        <div className="relative mb-2">
          <img 
            src={saybrookSeal} 
            alt="Saybrook Township" 
            className="saybrook-seal-anchor transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute -inset-4 bg-saybrook-sand/10 blur-3xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
        
        <div className="text-center">
          <h2 className="font-display font-semibold text-4xl lg:text-5xl px-1 leading-[0.9] tracking-tight">
            Saybrook
          </h2>
          <div className="text-saybrook-sand font-display font-semibold text-3xl lg:text-4xl mt-0 tracking-tight">Township</div>
        </div>
      </div>
      
      <div className="saybrook-sidebar-divider" />

      <div className="flex-1 space-y-12 overflow-y-auto pr-2 custom-scrollbar">
        {/* Friendly Guide */}
        <div className="space-y-8">
          {simpleSteps.map((step) => (
            <div key={step.label} className="saybrook-friendly-step">
              <div className="saybrook-step-number">{step.label}</div>
              <div className="space-y-1">
                <p className="text-base font-bold tracking-tight text-white">{step.title}</p>
                <p className="text-[13px] leading-relaxed text-white/50 font-medium max-w-[220px]">
                  {step.copy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simplified Footer / CTA Area */}
      <div className="pt-10 space-y-6 mt-auto">
        <div className="flex items-center gap-3 text-white/30">
          <ShieldCheck size={18} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Township Secured Service</span>
        </div>
      </div>
    </aside>
  );
}

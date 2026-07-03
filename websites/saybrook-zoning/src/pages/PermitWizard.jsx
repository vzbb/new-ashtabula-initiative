import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  FileText, 
  AlertCircle,
  HardHat,
  Home,
  Waves,
  Store,
  Warehouse,
  Building2
} from 'lucide-react';

const STEPS = [
  { id: 'project', label: 'Project Type' },
  { id: 'details', label: 'Specifics' },
  { id: 'location', label: 'Location' },
  { id: 'result', label: 'Requirements' },
];

export function PermitWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    type: '',
    size: '',
    isHistoric: false,
    address: ''
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const projectTypes = [
    { id: 'shed', label: 'Shed / Outbuilding', icon: Warehouse },
    { id: 'deck', label: 'Deck / Patio', icon: Home },
    { id: 'pool', label: 'Swimming Pool', icon: Waves },
    { id: 'garage', label: 'Garage / Carport', icon: HardHat },
    { id: 'business', label: 'New Business', icon: Store },
    { id: 'renovation', label: 'Major Renovation', icon: Building2 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-ashtabula-primary mb-2">Permit Requirement Wizard</h2>
        <p className="text-slate-500">Answer a few questions to determine what permits your project needs.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex justify-between relative max-w-2xl mx-auto">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0 rounded-full" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-ashtabula-secondary -translate-y-1/2 z-0 transition-all duration-500 rounded-full" 
          style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
        />
        {STEPS.map((step, idx) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center border-4 transition-all duration-300 shadow-sm",
              idx < currentStep ? "bg-ashtabula-primary border-ashtabula-primary text-white" :
              idx === currentStep ? "bg-white border-ashtabula-secondary text-ashtabula-primary" :
              "bg-white border-slate-100 text-slate-300"
            )}>
              {idx < currentStep ? <CheckCircle2 size={24} /> : <span className="font-bold">{idx + 1}</span>}
            </div>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-widest",
              idx === currentStep ? "text-ashtabula-primary" : "text-slate-400"
            )}>{step.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl min-h-[450px] flex flex-col overflow-hidden">
        <div className="p-10 flex-1">
          {currentStep === 0 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-ashtabula-primary">What are you planning to build?</h3>
                <p className="text-slate-500 mt-2">Select the category that best fits your project.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {projectTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setFormData({ ...formData, type: type.id });
                      nextStep();
                    }}
                    className={cn(
                      "p-8 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all hover:border-ashtabula-secondary hover:bg-ashtabula-bg group",
                      formData.type === type.id ? "border-ashtabula-secondary bg-ashtabula-bg" : "border-slate-50"
                    )}
                  >
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors shadow-inner",
                      formData.type === type.id ? "bg-ashtabula-secondary text-ashtabula-primary" : "bg-slate-50 text-slate-400 group-hover:text-ashtabula-secondary"
                    )}>
                      <type.icon size={32} />
                    </div>
                    <span className="font-bold text-slate-700">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div>
                <h3 className="text-2xl font-bold text-ashtabula-primary">Project Specifics</h3>
                <p className="text-slate-500 mt-2">Provide a few more details about the scale of your work.</p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Estimated size (square footage)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 120"
                    className="w-full p-4 bg-ashtabula-bg border border-slate-200 rounded-2xl focus:ring-4 focus:ring-ashtabula-primary/5 focus:border-ashtabula-primary outline-none transition-all text-lg font-semibold"
                    value={formData.size}
                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                  />
                </div>
                <div className="p-6 bg-ashtabula-bg rounded-2xl border border-slate-100">
                  <p className="text-sm text-slate-600 mb-4 font-bold flex items-center gap-2">
                    <AlertCircle size={18} className="text-ashtabula-secondary" />
                    Is this project located in the Harbor Historical District?
                  </p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setFormData({...formData, isHistoric: true})}
                      className={cn(
                        "flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all border-2",
                        formData.isHistoric === true 
                          ? "bg-ashtabula-secondary border-ashtabula-secondary text-ashtabula-primary shadow-lg shadow-ashtabula-secondary/20" 
                          : "bg-white border-white text-slate-500 hover:border-slate-200"
                      )}
                    >
                      Yes, it is
                    </button>
                    <button 
                      onClick={() => setFormData({...formData, isHistoric: false})}
                      className={cn(
                        "flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all border-2",
                        formData.isHistoric === false 
                          ? "bg-ashtabula-primary border-ashtabula-primary text-white shadow-lg shadow-ashtabula-primary/20" 
                          : "bg-white border-white text-slate-500 hover:border-slate-200"
                      )}
                    >
                      No / Not Sure
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div>
                <h3 className="text-2xl font-bold text-ashtabula-primary">Property Address</h3>
                <p className="text-slate-500 mt-2">Where will this project be taking place?</p>
              </div>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                <input 
                  type="text" 
                  placeholder="Street Address, Ashtabula, OH"
                  className="w-full pl-14 pr-6 py-4 bg-ashtabula-bg border border-slate-200 rounded-2xl focus:ring-4 focus:ring-ashtabula-primary/5 focus:border-ashtabula-primary outline-none transition-all text-lg font-semibold"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className="bg-ashtabula-secondary/5 p-6 rounded-2xl border border-ashtabula-secondary/10 flex gap-4">
                <Info className="text-ashtabula-secondary shrink-0" size={24} />
                <p className="text-sm text-slate-600 leading-relaxed">
                  We use the address to verify saybrook-zoning overlays and proximity to historical or environmental protection zones.
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in zoom-in-95">
              <div className="text-center">
                <div className="inline-flex p-4 bg-green-50 text-green-500 rounded-3xl mb-6 shadow-inner">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-3xl font-bold text-ashtabula-primary">Wizard Complete</h3>
                <p className="text-slate-500 mt-2">Here is the preliminary list of requirements for your {formData.type} project.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-ashtabula-primary text-white rounded-3xl shadow-xl relative overflow-hidden">
                  <h4 className="font-bold flex items-center gap-3 mb-6 text-xl">
                    <FileText size={24} className="text-ashtabula-secondary" />
                    Required Documents
                  </h4>
                  <ul className="space-y-4 relative z-10">
                    <li className="flex items-start gap-3 text-white/90">
                      <div className="w-5 h-5 rounded-full bg-ashtabula-secondary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-ashtabula-secondary" />
                      </div>
                      <span>Residential Zoning Permit Application</span>
                    </li>
                    <li className="flex items-start gap-3 text-white/90">
                      <div className="w-5 h-5 rounded-full bg-ashtabula-secondary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-ashtabula-secondary" />
                      </div>
                      <span>Scaled Plot Plan (showing property lines)</span>
                    </li>
                    {formData.isHistoric && (
                      <li className="flex items-start gap-3 p-3 bg-white/10 rounded-xl border border-white/10">
                        <div className="w-5 h-5 rounded-full bg-ashtabula-secondary flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 size={12} className="text-ashtabula-primary" />
                        </div>
                        <span className="text-ashtabula-secondary font-bold">Harbor Historic District Review Application</span>
                      </li>
                    )}
                    {parseInt(formData.size) > 200 && (
                      <li className="flex items-start gap-3 text-white/90">
                        <div className="w-5 h-5 rounded-full bg-ashtabula-secondary/20 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-ashtabula-secondary" />
                        </div>
                        <span>Building Permit (Structural Review Required)</span>
                      </li>
                    )}
                  </ul>
                  <Building2 size={120} className="absolute -right-10 -bottom-10 opacity-5" />
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-ashtabula-bg rounded-2xl border border-slate-100 shadow-sm">
                      <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Estimated Fee</h5>
                      <p className="text-3xl font-bold text-ashtabula-primary">$50.00</p>
                    </div>
                    <div className="p-6 bg-ashtabula-bg rounded-2xl border border-slate-100 shadow-sm">
                      <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Review Time</h5>
                      <p className="text-3xl font-bold text-ashtabula-primary">5-7 Days</p>
                    </div>
                  </div>

                  {formData.isHistoric && (
                    <div className="p-6 bg-amber-50 border border-ashtabula-secondary/20 rounded-2xl flex gap-4">
                      <AlertCircle size={24} className="text-ashtabula-secondary shrink-0" />
                      <p className="text-sm text-slate-700 leading-relaxed">
                        Since you are in the <strong>Historic District</strong>, you must receive a 
                        Certificate of Appropriateness before any work begins.
                      </p>
                    </div>
                  )}

                  <button className="w-full py-4 bg-ashtabula-secondary text-ashtabula-primary font-bold rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-3">
                    <FileText size={20} />
                    Download Application Package
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 border-t flex justify-between bg-ashtabula-bg/50">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-8 py-3 text-slate-500 font-bold hover:text-ashtabula-primary disabled:opacity-0 transition-all"
          >
            <ChevronLeft size={20} />
            Back
          </button>
          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-3 px-10 py-3 bg-ashtabula-primary text-white font-bold rounded-2xl hover:bg-ashtabula-accent transition-all shadow-lg shadow-ashtabula-primary/20"
            >
              Next Step
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="px-10 py-3 bg-ashtabula-secondary text-ashtabula-primary font-bold rounded-2xl hover:shadow-lg transition-all"
            >
              Start New Analysis
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

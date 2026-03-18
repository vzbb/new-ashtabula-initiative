import { useState, useMemo } from "react";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// API Configuration
const API_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Helper: Delay with exponential backoff
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Fetch with timeout
const fetchWithTimeout = async (url, options, timeoutMs) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  }
};

// Helper: API call with retry logic
const callGeminiAPI = async (prompt, retryCount = 0) => {
  try {
    const res = await fetchWithTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      },
      API_TIMEOUT
    );
    
    // Handle rate limiting (429)
    if (res.status === 429) {
      if (retryCount < MAX_RETRIES) {
        const backoffDelay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
        await delay(backoffDelay);
        return callGeminiAPI(prompt, retryCount + 1);
      }
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    }
    
    // Handle other non-OK responses
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API error: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    // Network errors - retry if we haven't exceeded max retries
    if (retryCount < MAX_RETRIES && (error.message.includes('fetch') || error.message.includes('network') || error.name === 'TypeError')) {
      const backoffDelay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
      await delay(backoffDelay);
      return callGeminiAPI(prompt, retryCount + 1);
    }
    throw error;
  }
};

// SVG Icons
const Icons = {
  search: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  ),
  arrowRight: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  ),
  arrowLeft: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
    </svg>
  ),
  sparkle: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  ),
  shield: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  ),
  zap: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  brain: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
    </svg>
  ),
  phone: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  externalLink: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" x2="21" y1="14" y2="3"/>
    </svg>
  ),
  document: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  dollar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" x2="12" y1="2" y2="22"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  home: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  heart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    </svg>
  ),
  alert: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <line x1="12" x2="12" y1="9" y2="13"/>
      <line x1="12" x2="12.01" y1="17" y2="17"/>
    </svg>
  ),
  baby: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/>
      <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3 1 4 1.5"/>
      <path d="M9 9a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v0"/>
      <path d="M5.5 8.5 4 9.5"/>
      <path d="m18.5 8.5 1.5 1"/>
    </svg>
  ),
  userPlus: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <line x1="19" x2="19" y1="8" y2="14"/>
      <line x1="22" x2="16" y1="11" y2="11"/>
    </svg>
  ),
  calendar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
      <line x1="16" x2="16" y1="2" y2="6"/>
      <line x1="8" x2="8" y1="2" y2="6"/>
      <line x1="3" x2="21" y1="10" y2="10"/>
    </svg>
  ),
  accessibility: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="m14.31 8 5.74 9.94"/>
      <path d="M9.69 8h11.48"/>
      <path d="m7.38 12 5.74-9.94"/>
      <path d="M9.69 16 3.95 6.06"/>
      <path d="M14.31 16H2.83"/>
      <path d="m16.62 12-5.74 9.94"/>
    </svg>
  ),
};

const PROGRAMS = [
  {
    id: "snap",
    name: "SNAP (Food Assistance)",
    category: "Food",
    admin: "Ohio Department of Job & Family Services (ODJFS)",
    phone: "(866) 244-0071",
    description: "Monthly food assistance via EBT card for low-income individuals and families.",
    documentation: ["ID", "Proof of income", "Proof of residency", "Expense documentation"],
    applyUrl: "https://benefits.ohio.gov/",
  },
  {
    id: "wic",
    name: "WIC (Women, Infants, and Children)",
    category: "Food/Nutrition",
    admin: "Ashtabula County Community Action Agency (ACCAA)",
    phone: "(440) 998-7515",
    description: "Food vouchers, nutrition education, and breastfeeding support for pregnant/postpartum women and children under 5.",
    documentation: ["ID", "Proof of income", "Proof of residency", "Pregnancy/birth verification"],
    applyUrl: "https://accaa.org/wic/",
  },
  {
    id: "heap",
    name: "HEAP (Energy Assistance)",
    category: "Utilities",
    admin: "Ohio Development Services Agency",
    phone: "211",
    description: "One-time payment toward heating bills during the winter season.",
    documentation: ["Social Security numbers for all members", "Recent utility bills", "Proof of income"],
    applyUrl: "https://development.ohio.gov/is/is_heap.htm",
  },
  {
    id: "pipp",
    name: "PIPP (Percentage of Income Payment Plan)",
    category: "Utilities",
    admin: "ACCAA / Utility Companies",
    phone: "211",
    description: "Ongoing utility payment plan that helps manage monthly costs based on income.",
    documentation: ["Proof of income", "Utility bills", "ID"],
    applyUrl: "https://development.ohio.gov/is/is_pipp.htm",
  },
  {
    id: "medicaid",
    name: "Medicaid",
    category: "Healthcare",
    admin: "Ohio Department of Medicaid",
    phone: "(800) 324-8680",
    description: "Comprehensive medical, dental, and vision coverage for low-income adults and families.",
    documentation: ["ID", "Proof of income", "SSN", "Citizenship/Residency proof"],
    applyUrl: "https://benefits.ohio.gov/",
  },
  {
    id: "housing",
    name: "Housing Choice Voucher (Section 8)",
    category: "Housing",
    admin: "Ashtabula Metropolitan Housing Authority",
    phone: "(440) 992-3156",
    description: "Rental assistance for low-income families to live in privately-owned housing.",
    documentation: ["ID", "Income verification", "Family composition documentation"],
    applyUrl: "https://ashtabulamha.org/",
  },
  {
    id: "emergency-shelter",
    name: "Emergency Shelter",
    category: "Emergency",
    admin: "County Agencies / Non-profits",
    phone: "211",
    description: "Immediate housing assistance for those experiencing homelessness.",
    documentation: ["ID (if available)", "Referral from 211"],
    applyUrl: "tel:211",
  },
  {
    id: "food-pantry",
    name: "Food Pantries",
    category: "Food",
    admin: "Local Churches & Non-profits",
    phone: "211",
    description: "Free groceries from local community distribution points.",
    documentation: ["ID", "Proof of address (sometimes required)"],
    applyUrl: "https://www.foodbank.org/",
  },
];

const INCOME_LIMITS_2025 = {
  snap: [1600, 2100, 2700, 3200, 3700, 4200, 4700, 5200],
  wic: [2300, 3100, 3900, 4600, 5400, 6200, 7000, 7800],
};

const NEED_ICONS = {
  food: Icons.dollar,
  housing: Icons.home,
  utilities: Icons.zap,
  healthcare: Icons.heart,
  emergency: Icons.alert,
};

const COMPOSITION_ICONS = {
  pregnant: Icons.userPlus,
  infant: Icons.baby,
  childUnder5: Icons.baby,
  senior: Icons.calendar,
  disabled: Icons.accessibility,
};

function App() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    householdSize: 1,
    monthlyIncome: 0,
    benefits: { snap: false, medicaid: false, tanf: false },
    needs: { food: false, housing: false, utilities: false, healthcare: false, emergency: false },
    composition: { pregnant: false, infant: false, childUnder5: false, senior: false, disabled: false },
  });

  const [loadingPlan, setLoadingPlan] = useState(false);
  const [aiPlan, setAiPlan] = useState("");

  const eligiblePrograms = useMemo(() => {
    const eligible = [];
    const { householdSize, monthlyIncome, benefits, needs, composition } = formData;
    const idx = Math.min(householdSize - 1, 7);

    if (monthlyIncome <= INCOME_LIMITS_2025.snap[idx]) {
      eligible.push(PROGRAMS.find((p) => p.id === "snap"));
    }

    if (benefits.snap || benefits.medicaid || benefits.tanf ||
      (monthlyIncome <= INCOME_LIMITS_2025.wic[idx] &&
        (composition.pregnant || composition.infant || composition.childUnder5))) {
      eligible.push(PROGRAMS.find((p) => p.id === "wic"));
    }

    if (needs.utilities || monthlyIncome <= INCOME_LIMITS_2025.snap[idx] * 1.5) {
      eligible.push(PROGRAMS.find((p) => p.id === "heap"));
      eligible.push(PROGRAMS.find((p) => p.id === "pipp"));
    }

    if (benefits.snap || monthlyIncome <= INCOME_LIMITS_2025.snap[idx] * 1.33) {
      eligible.push(PROGRAMS.find((p) => p.id === "medicaid"));
    }

    if (needs.housing || monthlyIncome <= INCOME_LIMITS_2025.snap[idx]) {
      eligible.push(PROGRAMS.find((p) => p.id === "housing"));
    }

    if (needs.emergency || needs.housing) {
      eligible.push(PROGRAMS.find((p) => p.id === "emergency-shelter"));
    }

    if (needs.food || monthlyIncome <= INCOME_LIMITS_2025.snap[idx] * 2) {
      eligible.push(PROGRAMS.find((p) => p.id === "food-pantry"));
    }

    return Array.from(new Set(eligible.filter(Boolean)));
  }, [formData]);

  const generateAiPlan = async () => {
    setLoadingPlan(true);
    setAiPlan("");
    try {
      if (!apiKey) {
        throw new Error("API key not configured. Please contact support.");
      }
      const situation = `Household of ${formData.householdSize}, income $${formData.monthlyIncome}, needs: ${Object.entries(formData.needs).filter(([_, v]) => v).map(([k]) => k).join(", ")}.`;
      const prompt = `Create a 5-step aid navigation plan for: ${situation} in Ashtabula County, OH. Mention specific local agencies like ACCAA or JFS. Keep under 150 words. Format as clear steps.`;
      const data = await callGeminiAPI(prompt);
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setAiPlan(text);
    } catch (e) {
      console.error("Aidflow Navigator API Error:", e);
      setAiPlan("Unable to generate custom plan at this time. Please refer to the program list below or try again in a moment.");
    } finally {
      setLoadingPlan(false);
    }
  };

  const handleCheckboxChange = (category, field) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field],
      },
    }));
  };

  const renderScreener = () => (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="glass-panel p-8">
        <h2 className="text-3xl font-display font-bold mb-2">Quick Eligibility Screener</h2>
        <p className="text-white/60 mb-8">Answer a few questions to find programs you may qualify for.</p>

        <div className="space-y-8">
          <section>
            <label className="block text-sm font-medium mb-3 text-white/80 flex items-center gap-2">
              <Icons.users />
              Household Size
            </label>
            <select
              value={formData.householdSize}
              onChange={(e) => setFormData({ ...formData, householdSize: parseInt(e.target.value) })}
              className="w-full"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>)}
            </select>
          </section>

          <section>
            <label className="block text-sm font-medium mb-3 text-white/80 flex items-center gap-2">
              <Icons.dollar />
              Total Monthly Household Income (Gross)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">$</span>
              <input
                type="number"
                value={formData.monthlyIncome}
                onChange={(e) => setFormData({ ...formData, monthlyIncome: parseInt(e.target.value) || 0 })}
                className="w-full pl-8"
                placeholder="0"
              />
            </div>
          </section>

          <section>
            <label className="block text-sm font-medium mb-4 text-white/80">Current Benefits Received</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.keys(formData.benefits).map(key => (
                <button
                  key={key}
                  onClick={() => handleCheckboxChange('benefits', key)}
                  className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${formData.benefits[key]
                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400'
                    : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'}`}
                >
                  {formData.benefits[key] && <Icons.check />}
                  <span className="font-medium uppercase">{key}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <label className="block text-sm font-medium mb-4 text-white/80">Immediate Needs</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.keys(formData.needs).map(key => {
                const Icon = NEED_ICONS[key];
                return (
                  <button
                    key={key}
                    onClick={() => handleCheckboxChange('needs', key)}
                    className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${formData.needs[key]
                      ? 'bg-purple-500/10 border-purple-500/50 text-purple-400'
                      : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'}`}
                  >
                    <Icon />
                    <span className="font-medium capitalize">{key}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <label className="block text-sm font-medium mb-4 text-white/80">Household Composition</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.keys(formData.composition).map(key => {
                const Icon = COMPOSITION_ICONS[key];
                return (
                  <button
                    key={key}
                    onClick={() => handleCheckboxChange('composition', key)}
                    className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${formData.composition[key]
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400'
                      : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'}`}
                  >
                    <Icon />
                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="mt-10 flex justify-end">
          <button onClick={() => setStep(2)} className="btn-primary flex items-center gap-2">
            See Results
            <Icons.arrowRight />
          </button>
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-display font-bold">Your Support Plan</h2>
        <button onClick={() => setStep(1)} className="btn-secondary text-sm">Edit details</button>
      </div>

      <div className="glass-card p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                <Icons.sparkle />
              </div>
              <h3 className="text-xl font-display font-semibold accent-cyan">AI-Powered Guidance</h3>
            </div>
            <p className="text-white/70 mb-6">Let Gemini generate a personalized 5-step navigation plan based on your unique situation.</p>
            {aiPlan ? (
              <div className="glass-panel p-6 whitespace-pre-wrap text-sm leading-relaxed border-l-4 border-cyan-500">
                {aiPlan}
              </div>
            ) : (
              <button onClick={generateAiPlan} disabled={loadingPlan} className="btn-primary">
                {loadingPlan ? "Generating..." : "Generate Custom Plan"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {eligiblePrograms.map((program) => (
          <div key={program.id} className="glass-card p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <span className="tag">{program.category}</span>
              <a href={program.applyUrl} target="_blank" rel="noreferrer" className="text-xs text-white/40 hover:text-cyan-400 flex items-center gap-1 transition-colors">
                Apply <Icons.externalLink />
              </a>
            </div>
            <h4 className="text-xl font-display font-bold mb-3">{program.name}</h4>
            <p className="text-sm text-white/60 mb-6 flex-1">{program.description}</p>

            <div className="mt-auto pt-4 border-t border-white/10 space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2 flex items-center gap-2">
                  <Icons.document />
                  Documents Needed
                </p>
                <div className="flex flex-wrap gap-2">
                  {program.documentation.map(doc => (
                    <span key={doc} className="text-xs bg-white/5 px-3 py-1.5 rounded-lg text-white/70 border border-white/10">{doc}</span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/40">{program.admin}</span>
                <a href={`tel:${program.phone.replace(/\D/g, '')}`} className="font-mono accent-cyan flex items-center gap-1 hover:underline">
                  <Icons.phone />
                  {program.phone}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {eligiblePrograms.length === 0 && (
        <div className="glass-panel p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <Icons.search />
          </div>
          <p className="text-xl text-white/60">No specific programs matched your criteria.</p>
          <p className="text-sm text-white/40 mt-2">We recommend calling 211 for personalized assistance.</p>
        </div>
      )}

      <div className="flex justify-center pt-8">
        <button onClick={() => setStep(3)} className="btn-secondary flex items-center gap-2">
          View Full Resource Directory
          <Icons.arrowRight />
        </button>
      </div>
    </div>
  );

  const renderDirectory = () => (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <button onClick={() => setStep(2)} className="p-3 glass-panel hover:border-white/20 transition-colors rounded-xl">
          <Icons.arrowLeft />
        </button>
        <h2 className="text-4xl font-display font-bold">Resource Directory</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {PROGRAMS.map(program => (
          <div key={program.id} className="glass-card p-5 flex items-center justify-between group">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h5 className="font-display font-bold text-lg">{program.name}</h5>
                <span className="tag text-[10px] py-0.5">{program.category}</span>
              </div>
              <p className="text-xs text-white/40">{program.admin}</p>
            </div>
            <div className="text-right">
              <a href={`tel:${program.phone.replace(/\D/g, '')}`} className="font-mono accent-cyan text-sm hover:underline flex items-center gap-1 justify-end">
                <Icons.phone />
                {program.phone}
              </a>
              <a href={program.applyUrl} target="_blank" rel="noreferrer" className="text-[10px] opacity-0 group-hover:opacity-60 transition-opacity hover:opacity-100 underline flex items-center gap-1 justify-end mt-1">
                Visit Website <Icons.externalLink />
              </a>
            </div>
          </div>
        ))}
        <div className="glass-card p-8 text-center border-l-4 border-l-cyan-500 bg-gradient-to-r from-cyan-500/5 to-transparent">
          <h5 className="font-display font-bold accent-cyan mb-2 text-lg">Need immediate help?</h5>
          <p className="text-sm text-white/70 mb-6">Dial 211 to speak with a specialist who can guide you to local resources in Ashtabula County.</p>
          <a href="tel:211" className="btn-primary inline-flex items-center gap-2">
            <Icons.phone />
            Call 211
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-white selection:bg-cyan-500/30 selection:text-white">
      {/* Animated Orbs */}
      <div className="orb orb-cyan" />
      <div className="orb orb-purple" />
      <div className="orb orb-cyan-2" />

      {/* Header */}
      <nav className="border-b border-white/5 py-5 px-6 mb-8 sticky top-0 z-50 glass-panel rounded-none border-x-0 border-t-0">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setStep(0)}>
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center font-display font-bold text-white shadow-lg shadow-cyan-500/20">
              A
            </div>
            <span className="font-display font-bold tracking-tight text-xl">
              AidFlow <span className="accent-cyan">Navigator</span>
            </span>
          </div>
          <div className="flex gap-6 text-sm text-white/60">
            <button onClick={() => setStep(3)} className="hover:text-white transition-colors">Directory</button>
            <button className="hover:text-white transition-colors">Help</button>
          </div>
        </div>
      </nav>

      <main className="px-6 pb-20 relative z-10">
        {step === 0 && (
          <div className="max-w-5xl mx-auto text-center space-y-12 py-16 animate-fade-in">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                <Icons.sparkle />
                ASHTABULA COUNTY COMMUNITY TOOL
              </span>
              <h1 className="text-5xl md:text-7xl font-display font-black leading-tight tracking-tight">
                Discover assistance <br />
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent italic">made for you.</span>
              </h1>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Anonymous, fast, and local. Screener identifies eligible community programs in under 2 minutes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setStep(1)} className="btn-primary text-lg px-10 py-5 flex items-center justify-center gap-2">
                Start Free Screener
                <Icons.arrowRight />
              </button>
              <button onClick={() => setStep(3)} className="btn-secondary text-lg px-10 py-5">
                Browse Programs
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
              <div className="glass-card p-8 text-left">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                  <Icons.shield />
                </div>
                <div className="text-2xl font-display font-bold accent-cyan mb-2">100%</div>
                <div className="font-display font-bold mb-2">Private & Anonymous</div>
                <p className="text-xs text-white/50">No data is saved on our servers. Your privacy is our priority.</p>
              </div>
              <div className="glass-card p-8 text-left">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                  <Icons.zap />
                </div>
                <div className="text-2xl font-display font-bold accent-purple mb-2">2 Min</div>
                <div className="font-display font-bold mb-2">Fast Results</div>
                <p className="text-xs text-white/50">Quickly screen for SNAP, WIC, HEAP, and other local resources.</p>
              </div>
              <div className="glass-card p-8 text-left">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                  <Icons.brain />
                </div>
                <div className="text-2xl font-display font-bold accent-cyan mb-2">2.5</div>
                <div className="font-display font-bold mb-2">AI Powered</div>
                <p className="text-xs text-white/50">Uses Gemini 2.5 for personalized navigation guidance.</p>
              </div>
            </div>
          </div>
        )}

        {step === 1 && renderScreener()}
        {step === 2 && renderResults()}
        {step === 3 && renderDirectory()}
      </main>

      <footer className="py-12 px-6 border-t border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center font-display font-bold text-white text-sm">A</div>
              <span className="font-display font-bold tracking-tight text-lg">AidFlow</span>
            </div>
            <p className="text-xs text-white/40 max-w-xs">
              This tool provides estimates only and does not guarantee eligibility.
              Always verify with the specific agency during application.
            </p>
          </div>
          <div className="text-right space-y-2">
            <div className="text-xs text-white/40 font-medium tracking-widest">PART OF THE NEW ASHTABULA INITIATIVE</div>
            <div className="text-sm font-display font-bold text-white/70">2026 NOIRSYS ARCHIVES</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

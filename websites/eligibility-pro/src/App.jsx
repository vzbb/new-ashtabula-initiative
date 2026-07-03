import { useState, useRef } from "react";
import { callGeminiAPI, extractResponseText } from "./api-client.js";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Validate API key on load
if (!apiKey) {
  console.warn('VITE_GEMINI_API_KEY is not set. AI features will be disabled.');
}

const FPL_2025_BASE = 15060;
const FPL_2025_PERSON = 5380;

// Validation helpers
const validateZipCode = (zip) => /^\d{5}(-\d{4})?$/.test(zip);
const validateIncome = (income) => !isNaN(income) && income >= 0 && income <= 999999;
const validateHouseholdSize = (size) => !isNaN(size) && size >= 1 && size <= 20;

const PROGRAMS = [
  { id: "heap", name: "HEAP (Heating Assistance)", provider: "ACCAA", threshold: 150, link: "https://accaa.org/heap/", docs: ["Recent utility bill", "Proof of Income (30 days)", "SSNs for all members"], description: "Help with winter heating or summer cooling bills via the Home Energy Assistance Program." },
  { id: "pipp", name: "PIPP Plus", provider: "ACCAA", threshold: 150, link: "https://accaa.org/heap/", docs: ["Most recent electric bill", "Proof of Income", "SSNs for all members"], description: "Pay a percentage of your income toward your utility bills for consistent, manageable payments." },
  { id: "hwap", name: "Weatherization (HWAP)", provider: "ACCAA", threshold: 200, link: "https://accaa.org/weatherization/", docs: ["Proof of Ownership/Landlord Agreement", "Proof of Income", "Recent Utility Bills"], description: "Free home repairs to improve energy efficiency and lower your utility costs." },
  { id: "food", name: "Food Pantry Services", provider: "ACCAA", threshold: 200, link: "https://accaa.org/food-pantry/", docs: ["Photo ID", "Proof of Residency"], description: "Nutritional support through our network of food pantries across Ashtabula County." },
  { id: "headstart", name: "Head Start / Early Head Start", provider: "ACCAA", threshold: 100, link: "https://accaa.org/head-start/", docs: ["Birth Certificate", "Proof of Income", "Immunization Records"], description: "Early childhood education and development for children from birth to age 5.", requires: ["hasChildrenUnder5"] },
  { id: "csbg", name: "Community Services", provider: "ACCAA", threshold: 125, link: "https://accaa.org/", docs: ["Varies by service"], description: "Emergency assistance and support services funded by the Community Services Block Grant." },
];

// ACCAA "Hug" Logo Component
function ACCAALogo({ size = 50 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="25" cy="25" r="23" fill="#ffffff" stroke="#005596" strokeWidth="1" />
      <g transform="translate(13, 13) scale(0.5)">
        <path
          d="M24 4C12.95 4 4 12.95 4 24C4 35.05 12.95 44 24 44C35.05 44 44 35.05 44 24C44 12.95 35.05 4 24 4ZM24 40C15.16 40 8 32.84 8 24C8 15.16 15.16 8 24 8C32.84 8 40 15.16 40 24C40 32.84 32.84 40 24 40Z"
          fill="#D1202F"
        />
        <path
          d="M24 14C18.48 14 14 18.48 14 24C14 29.52 18.48 34 24 34C29.52 34 34 29.52 34 24C34 18.48 29.52 14 24 14ZM24 30C20.69 30 18 27.31 18 24C18 20.69 20.69 18 24 18C27.31 18 30 20.69 30 24C30 27.31 27.31 30 24 30Z"
          fill="#D1202F"
        />
      </g>
      <path d="M15 25 Q25 15 35 25" stroke="#D1202F" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M15 25 Q25 35 35 25" stroke="#005596" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function App() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ householdSize: 1, zipCode: "", monthlyIncome: 0, isPregnant: false, hasChildrenUnder5: false, isSenior: false, isDisabled: false, isUnemployed: false });
  const [errors, setErrors] = useState({});
  const [eligiblePrograms, setEligiblePrograms] = useState([]);
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setData(prev => ({ ...prev, [name]: newValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateStep = (stepNum) => {
    const newErrors = {};
    
    if (stepNum === 1) {
      if (!validateHouseholdSize(parseInt(data.householdSize))) {
        newErrors.householdSize = 'Please enter a household size between 1 and 20';
      }
      if (data.zipCode && !validateZipCode(data.zipCode)) {
        newErrors.zipCode = 'Please enter a valid 5-digit ZIP code';
      }
    }
    
    if (stepNum === 2) {
      if (!validateIncome(parseFloat(data.monthlyIncome))) {
        newErrors.monthlyIncome = 'Please enter a valid monthly income (0 - 999,999)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (nextStep) => {
    if (validateStep(step)) {
      setStep(nextStep);
    }
  };

  const calculateEligibility = () => {
    const annualIncome = data.monthlyIncome * 12;
    const fpl100 = FPL_2025_BASE + (data.householdSize - 1) * FPL_2025_PERSON;
    const fplPercent = (annualIncome / fpl100) * 100;
    const results = PROGRAMS.filter(program => {
      if (program.threshold && fplPercent > program.threshold) {
        if (program.id === "medicaid" && data.isDisabled) return true;
        return false;
      }
      if (program.requires) return program.requires.some(req => data[req]);
      return true;
    });
    setEligiblePrograms(results);
    generateAiAdvice(results);
    setStep(4);
  };

  const generateAiAdvice = async (programs) => {
    if (!apiKey) {
      setAiResponse("AI advice is currently unavailable. Please see the program results below.");
      return;
    }
    
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    try {
      const prompt = `You are a helpful community benefits navigator for the Ashtabula County Community Action Agency (ACCAA). Household size ${data.householdSize}, Monthly income $${data.monthlyIncome}. Circumstances: ${data.isPregnant ? 'Pregnant, ' : ''}${data.isSenior ? 'Senior, ' : ''}${data.isDisabled ? 'Disabled, ' : ''}${data.isUnemployed ? 'Unemployed, ' : ''}. Likely eligible for: ${programs.map(p => p.name).join(', ')}. Provide warm, encouraging summary under 150 words. Mention that ACCAA is here to help change lives.`;
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
      if (!res.ok) {
        throw new Error(`API request failed: ${res.status}`);
      }
      
      const resData = await res.json();
      const adviceText = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!adviceText) {
        throw new Error('Invalid API response structure');
      }
      
      setAiResponse(adviceText);
    } catch (e) {
      if (e.name === 'AbortError') {
        return; // Request was cancelled, don't update state
      }
      console.error('AI advice error:', e);
      setAiResponse("We couldn't generate personalized advice right now, but please see the results below.");
    } finally {
      setLoading(false);
    }
  };

  const allDocs = [...new Set(eligiblePrograms.flatMap(p => p.docs))];

  const steps = [
    { title: "Welcome", subtitle: "See which ACCAA programs can help you and your family today." },
    { title: "Household Basics", subtitle: "Tell us about your household." },
    { title: "Monthly Income", subtitle: "Your income helps determine eligibility." },
    { title: "Your Situation", subtitle: "Check all that apply." },
    { title: "Your Results", subtitle: "Based on your situation, you may qualify for:" }
  ];

  return (
    <div className="app-container">
      <div className="bg-wave-pattern"></div>

      {/* Official Banner */}
      <div className="official-banner">
        <div className="official-banner-content">
          <span className="official-banner-seal">★</span>
          <span>Helping People. Changing Lives.</span>
          <span className="official-banner-seal">★</span>
        </div>
      </div>

      {/* Header */}
      <header className="municipal-header">
        <div className="header-content">
          <div className="city-logo">
            <ACCAALogo size={50} />
            <div className="city-logo-text">
              <span className="city-logo-title">ACCAA</span>
              <span className="city-logo-subtitle">ClientStream Optimizer</span>
            </div>
          </div>
        </div>
      </header>
      <h1 style={{position: "absolute", left: "-9999px"}}>ACCAA ClientStream Optimizer</h1>

      {/* Main Content */}
      <main className="municipal-main">
        <div className="content-container">
          {/* Progress Bar */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', justifyContent: 'center' }}>
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: i <= step ? '#1e3a5f' : '#e2e8f0',
                  color: i <= step ? '#fff' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                {i < 4 && <div style={{
                  width: '40px',
                  height: '2px',
                  background: i < step ? '#d4af37' : '#e2e8f0'
                }} />}
              </div>
            ))}
          </div>

          {/* Card */}
          <div className="municipal-card">
            <div className="municipal-card-header municipal-card-header-gold">
              <span className="municipal-card-title">{steps[step].title}</span>
              <span className="badge badge-gold">Step {step + 1} of 5</span>
            </div>
            <div className="municipal-card-body">
              <p style={{ color: '#64748b', marginBottom: '20px' }}>{steps[step].subtitle}</p>

              {step === 0 && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: '#e8f4f8',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    fontSize: '28px'
                  }}>
                    🧭
                  </div>
                  <p>It takes about 2 minutes and is completely anonymous.</p>
                  <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>We don't save your personal data. Results are estimates only.</p>
                  <button className="btn btn-primary btn-lg" onClick={() => setStep(1)} style={{ marginTop: '16px' }}>
                    Get Started →
                  </button>
                </div>
              )}

              {step === 1 && (
                <>
                  <div className="form-section">
                    <label htmlFor="householdSize" className="form-label">How many people live in your household?</label>
                    <input 
                      type="number" 
                      id="householdSize"
                      name="householdSize" 
                      value={data.householdSize} 
                      onChange={handleChange} 
                      min="1" 
                      max="20" 
                      className={`form-input ${errors.householdSize ? 'input-error' : ''}`}
                      aria-invalid={errors.householdSize ? 'true' : 'false'}
                      aria-describedby={errors.householdSize ? 'householdSize-error' : undefined}
                    />
                    {errors.householdSize && <span id="householdSize-error" className="error-text">{errors.householdSize}</span>}
                  </div>
                  <div className="form-section">
                    <label htmlFor="zipCode" className="form-label">Zip Code (optional)</label>
                    <input 
                      type="text" 
                      id="zipCode"
                      name="zipCode" 
                      value={data.zipCode} 
                      onChange={handleChange} 
                      placeholder="44004" 
                      className={`form-input ${errors.zipCode ? 'input-error' : ''}`}
                      maxLength={10}
                      aria-invalid={errors.zipCode ? 'true' : 'false'}
                      aria-describedby={errors.zipCode ? 'zipCode-error' : undefined}
                    />
                    {errors.zipCode && <span id="zipCode-error" className="error-text">{errors.zipCode}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                    <button className="btn btn-outline" onClick={() => setStep(0)}>← Back</button>
                    <button className="btn btn-primary" onClick={() => handleNext(2)}>Next →</button>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="form-section">
                    <label htmlFor="monthlyIncome" className="form-label">What is your total monthly household income (before taxes)?</label>
                    <input 
                      type="number" 
                      id="monthlyIncome"
                      name="monthlyIncome" 
                      value={data.monthlyIncome} 
                      onChange={handleChange}
                      min="0"
                      max="999999"
                      step="0.01"
                      className={`form-input ${errors.monthlyIncome ? 'input-error' : ''}`}
                      aria-invalid={errors.monthlyIncome ? 'true' : 'false'}
                      aria-describedby={errors.monthlyIncome ? 'monthlyIncome-error' : 'income-hint'}
                    />
                    <p 
                      id="income-hint"
                      className="form-hint"
                      style={{ display: errors.monthlyIncome ? 'none' : 'block' }}
                    >
                      Include all sources like wages, Social Security, and child support.
                    </p>
                    {errors.monthlyIncome && <span id="monthlyIncome-error" className="error-text">{errors.monthlyIncome}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                    <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                    <button className="btn btn-primary" onClick={() => handleNext(3)}>Next →</button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <p style={{ marginBottom: '16px', fontWeight: 600 }}>Check all that apply:</p>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {['isPregnant', 'hasChildrenUnder5', 'isSenior', 'isDisabled', 'isUnemployed'].map((key) => (
                      <label key={key} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}>
                        <input type="checkbox" name={key} checked={data[key]} onChange={handleChange} />
                        <span>
                          {key === 'isPregnant' && 'Pregnant'}
                          {key === 'hasChildrenUnder5' && 'Children under 5'}
                          {key === 'isSenior' && 'Senior (60+)'}
                          {key === 'isDisabled' && 'Disabled'}
                          {key === 'isUnemployed' && 'Unemployed'}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                    <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
                    <button className="btn btn-primary" onClick={calculateEligibility}>See Results</button>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                      <div style={{ fontSize: '24px', marginBottom: '12px' }}>🤔</div>
                      <p>Analyzing your eligibility…</p>
                    </div>
                  ) : (
                    <>
                      <div style={{ background: '#e8f4f8', padding: '16px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #1e3a5f' }}>
                        <h4 style={{ color: '#1e3a5f', marginBottom: '8px' }}>💡 Navigator Advice</h4>
                        <p style={{ margin: 0, color: '#2c3e50' }}>{aiResponse}</p>
                      </div>

                      <h4 style={{ color: '#1e3a5f', marginBottom: '12px' }}>Programs You May Qualify For:</h4>
                      
                      {eligiblePrograms.length > 0 ? (
                        <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
                          {eligiblePrograms.map(program => (
                            <div key={program.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <h5 style={{ margin: 0, color: '#1e3a5f' }}>{program.name}</h5>
                                <span className="badge badge-blue">{program.provider}</span>
                              </div>
                              <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem', color: '#64748b' }}>{program.description}</p>
                              <a href={program.link} target="_blank" rel="noreferrer" className="btn btn-sm btn-secondary">
                                Visit Website →
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>No direct matches found. Call 211 for emergency assistance.</p>
                      )}

                      {eligiblePrograms.length > 0 && (
                        <div style={{ background: '#fefce8', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                          <h4 style={{ color: '#854d0e', marginBottom: '12px' }}>📋 Document Checklist</h4>
                          <ul style={{ margin: 0, paddingLeft: '20px' }}>
                            {allDocs.map((doc, i) => <li key={i} style={{ marginBottom: '4px' }}>{doc}</li>)}
                          </ul>
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button className="btn btn-outline" onClick={() => setStep(0)}>Start Over</button>
                        <button className="btn btn-secondary" onClick={() => window.print()}>Print Results</button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="municipal-footer">
        <div className="footer-content">
          <div className="footer-top">
            <div className="footer-seal">
              <ACCAALogo size={40} />
            </div>
            <div>
              <div className="footer-title">Ashtabula County Community Action Agency</div>
              <div className="footer-subtitle">ClientStream Optimizer — Helping People. Changing Lives.</div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-links">
              <a href="https://accaa.org" className="footer-link">ACCAA Website</a>
              <a href="#" className="footer-link">Contact Us</a>
              <a href="#" className="footer-link">Privacy Policy</a>
            </div>
            <p className="footer-copyright">
              © 2026 ACCAA. Results are estimates only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

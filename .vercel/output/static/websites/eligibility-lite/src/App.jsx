import { useState } from "react";
import { callGeminiAPI, extractResponseText } from "./api-client.js";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const FPL_2025_BASE = 15060;
const FPL_2025_PERSON = 5380;

const PROGRAMS = [
  { id: "snap", name: "SNAP (Food Stamps)", provider: "ODJFS", threshold: 130, link: "https://ssp.benefits.ohio.gov", docs: ["Photo ID", "Proof of Income", "Social Security Cards"], description: "Monthly benefits for groceries on an EBT card." },
  { id: "medicaid", name: "Medicaid", provider: "ODJFS", threshold: 138, link: "https://ssp.benefits.ohio.gov", docs: ["Photo ID", "Proof of Income", "Citizenship/Residency Proof"], description: "Free or low-cost health insurance." },
  { id: "heap", name: "HEAP / PIPP Plus", provider: "Local Energy Assistance", threshold: 150, link: "#", docs: ["Most recent utility bill", "Proof of Income", "SSNs for all members"], description: "Assistance with heating and electric bills." },
  { id: "wic", name: "WIC", provider: "Health Department", threshold: 185, link: "#", docs: ["Proof of Identity", "Proof of Residency", "Immunization Records"], description: "Nutrition support for pregnant women and children under 5.", requires: ["isPregnant", "hasChildrenUnder5"] },
  { id: "owf", name: "Ohio Works First", provider: "ODJFS", threshold: 50, link: "https://ssp.benefits.ohio.gov", docs: ["Photo ID", "Birth Certificates", "Income Verification"], description: "Cash assistance for families with children.", requires: ["hasChildrenUnder5"] },
];

// City of Ashtabula Logo Component
function CityOfAshtabulaLogo({ size = 50 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25 2 L5 10 V22 C5 35 25 48 25 48 C25 48 45 35 45 22 V10 L25 2Z"
        fill="#1e3a5f"
        stroke="#d4af37"
        strokeWidth="1.5"
      />
      <path
        d="M25 5 L8 12 V22 C8 33 25 44 25 44 C25 44 42 33 42 22 V12 L25 5Z"
        fill="none"
        stroke="#d4af37"
        strokeWidth="0.5"
        opacity="0.6"
      />
      <rect x="20" y="28" width="10" height="12" fill="#ffffff" />
      <rect x="22" y="16" width="6" height="12" fill="#ffffff" />
      <path d="M21 16 L25 10 L29 16 Z" fill="#d4af37" />
      <path d="M25 12 L35 8 L25 10 Z" fill="#d4af37" opacity="0.8" />
      <path d="M25 12 L15 8 L25 10 Z" fill="#d4af37" opacity="0.6" />
      <rect x="23" y="34" width="4" height="6" fill="#1e3a5f" />
      <rect x="24" y="20" width="2" height="3" fill="#1e3a5f" />
      <path d="M8 38 Q14 35 20 38 T32 38 T42 36" stroke="#d4af37" strokeWidth="1" fill="none" opacity="0.8" />
      <path d="M10 42 Q16 39 22 42 T34 42 T40 40" stroke="#d4af37" strokeWidth="0.8" fill="none" opacity="0.6" />
    </svg>
  );
}

function App() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ householdSize: 1, zipCode: "", monthlyIncome: 0, isPregnant: false, hasChildrenUnder5: false, isSenior: false, isDisabled: false, isUnemployed: false });
  const [eligiblePrograms, setEligiblePrograms] = useState([]);
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
    setLoading(true);
    try {
      const prompt = `You are a helpful community benefits navigator for the City of Ashtabula, Ohio. Household size ${data.householdSize}, Monthly income $${data.monthlyIncome}. Circumstances: ${data.isPregnant ? 'Pregnant, ' : ''}${data.isSenior ? 'Senior, ' : ''}${data.isDisabled ? 'Disabled, ' : ''}${data.isUnemployed ? 'Unemployed, ' : ''}. Likely eligible for: ${programs.map(p => p.name).join(', ')}. Provide warm, encouraging summary under 150 words.`;
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
      setAiResponse(resData?.candidates?.[0]?.content?.parts?.[0]?.text || "No AI advice available.");
    } catch (e) {
      setAiResponse("We couldn't generate personalized advice right now, but please see the results below.");
    } finally {
      setLoading(false);
    }
  };

  const allDocs = [...new Set(eligiblePrograms.flatMap(p => p.docs))];

  const steps = [
    { title: "Welcome", subtitle: "Find assistance programs you may qualify for in Ashtabula." },
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
          <span>Official Benefits Navigator of the City of Ashtabula</span>
          <span className="official-banner-seal">★</span>
        </div>
      </div>

      {/* Header */}
      <header className="municipal-header">
        <div className="header-content">
          <div className="city-logo">
            <CityOfAshtabulaLogo size={50} />
            <div className="city-logo-text">
              <span className="city-logo-title">City of Ashtabula</span>
              <span className="city-logo-subtitle">Eligibility Lite</span>
            </div>
          </div>
        </div>
      </header>
      <h1 style={{position: "absolute", left: "-9999px"}}>Eligibility Lite</h1>

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
                    <label className="form-label">How many people live in your household?</label>
                    <input type="number" name="householdSize" value={data.householdSize} onChange={handleChange} min="1" max="15" className="form-input" />
                  </div>
                  <div className="form-section">
                    <label className="form-label">Zip Code</label>
                    <input type="text" name="zipCode" value={data.zipCode} onChange={handleChange} placeholder="44004" className="form-input" />
                  </div>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                    <button className="btn btn-outline" onClick={() => setStep(0)}>← Back</button>
                    <button className="btn btn-primary" onClick={() => setStep(2)}>Next →</button>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="form-section">
                    <label className="form-label">What is your total monthly household income (before taxes)?</label>
                    <input type="number" name="monthlyIncome" value={data.monthlyIncome} onChange={handleChange} className="form-input" />
                    <p className="form-hint">Include all sources like wages, Social Security, and child support.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                    <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                    <button className="btn btn-primary" onClick={() => setStep(3)}>Next →</button>
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
              <svg width="24" height="24" viewBox="0 0 50 50" fill="none">
                <path d="M25 5 L8 12 V22 C8 33 25 44 25 44 C25 44 42 33 42 22 V12 L25 5Z" fill="#ffffff" />
                <rect x="22" y="20" width="6" height="16" fill="#1e3a5f" />
                <path d="M21 20 L25 14 L29 20 Z" fill="#d4af37" />
              </svg>
            </div>
            <div>
              <div className="footer-title">City of Ashtabula</div>
              <div className="footer-subtitle">Eligibility Lite — Social Services</div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-links">
              <a href="#" className="footer-link">Social Services</a>
              <a href="#" className="footer-link">Call 211</a>
              <a href="#" className="footer-link">City Website</a>
            </div>
            <p className="footer-copyright">
              © 2026 City of Ashtabula, Ohio. Results are estimates only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

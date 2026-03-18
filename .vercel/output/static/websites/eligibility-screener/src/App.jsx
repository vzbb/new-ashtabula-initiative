import { useState, useEffect } from "react";
import { callGeminiAPI, extractResponseText } from "./api-client.js";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const FPL_2025_BASE = 15060;
const FPL_2025_PERSON = 5380;

const PROGRAMS = [
  { id: "snap", name: "SNAP (Food Assistance)", provider: "ACDJFS", threshold: 130, link: "https://ssp.benefits.ohio.gov", docs: ["Photo ID", "Proof of Income", "Social Security Cards"], description: "Monthly benefits for groceries on an EBT card to help low-income individuals and families." },
  { id: "medicaid", name: "Medicaid (Health Coverage)", provider: "ACDJFS", threshold: 138, link: "https://ssp.benefits.ohio.gov", docs: ["Photo ID", "Proof of Income", "Citizenship/Residency Proof"], description: "Free or low-cost health insurance for children, adults, seniors, and people with disabilities." },
  { id: "owf", name: "Ohio Works First (OWF)", provider: "ACDJFS", threshold: 50, link: "https://ssp.benefits.ohio.gov", docs: ["Photo ID", "Birth Certificates", "Income Verification"], description: "Temporary cash assistance for families with children to help them become self-sufficient." },
  { id: "childcare", name: "Publicly Funded Child Care", provider: "ACDJFS", threshold: 142, link: "https://ssp.benefits.ohio.gov", docs: ["Proof of Employment/Schooling", "Income Verification", "Child's Birth Certificate"], description: "Assistance with child care costs for parents who are working or in school." },
  { id: "omj", name: "OhioMeansJobs (Workforce)", provider: "ACDJFS", threshold: null, link: "https://ohiomeansjobs.ohio.gov", docs: ["Photo ID", "Resume (if available)"], description: "Job search assistance, career coaching, and training opportunities to help you find your next career." },
  { id: "childsupport", name: "Child Support Services", provider: "ACDJFS", threshold: null, link: "https://jfs.ohio.gov/child-support", docs: ["Varies by service"], description: "Help with establishing paternity, locating parents, and ensuring children receive financial support." }
];

// Ashtabula County Seal Logo SVG
const CountySealLogo = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="#003f87" />
    <circle cx="50" cy="50" r="44" fill="none" stroke="#ffd700" strokeWidth="2" />
    <circle cx="50" cy="50" r="40" fill="#f8f6f0" />
    
    <path id="textCurve" d="M 15,50 A 35,35 0 0,1 85,50" fill="none" />
    <text fill="#003f87" fontSize="7" fontWeight="bold" fontFamily="Open Sans, sans-serif">
      <textPath href="#textCurve" startOffset="50%" textAnchor="middle">ASHTABULA COUNTY</textPath>
    </text>
    
    <circle cx="50" cy="50" r="28" fill="none" stroke="#ffd700" strokeWidth="1.5" />
    
    <g transform="translate(50, 38)">
      <path d="M-4 18 L-2 -8 L2 -8 L4 18 Z" fill="#003f87" />
      <path d="M-2 -8 L-5 -12 L-2 -10 Z" fill="#ffd700" />
      <path d="M2 -8 L5 -12 L2 -10 Z" fill="#ffd700" />
      <rect x="-3" y="-10" width="6" height="3" fill="#003f87" />
      <circle cx="0" cy="-8" r="1.5" fill="#ffd700" />
    </g>
    
    <g transform="translate(50, 55)">
      <path d="M-18 12 Q0 -5 18 12" fill="none" stroke="#8b4513" strokeWidth="3" />
      <path d="M-18 12 L-18 16 L18 16 L18 12" fill="#8b4513" />
      <rect x="-20" y="8" width="4" height="10" fill="#654321" />
      <rect x="16" y="8" width="4" height="10" fill="#654321" />
      <path d="M-20 8 L0 -2 L20 8" fill="#8b4513" />
    </g>
    
    <g transform="translate(28, 65)" opacity="0.8">
      <path d="M0 0 Q2 -8 0 -15" stroke="#27ae60" strokeWidth="1.5" fill="none" />
      <ellipse cx="-2" cy="-8" rx="2" ry="4" fill="#ffd700" />
      <ellipse cx="2" cy="-5" rx="2" ry="4" fill="#ffd700" />
      <ellipse cx="0" cy="-12" rx="1.5" ry="3" fill="#ffd700" />
    </g>
    
    <g transform="translate(72, 65)" opacity="0.8">
      <path d="M0 0 Q-2 -8 0 -15" stroke="#27ae60" strokeWidth="1.5" fill="none" />
      <ellipse cx="2" cy="-8" rx="2" ry="4" fill="#ffd700" />
      <ellipse cx="-2" cy="-5" rx="2" ry="4" fill="#ffd700" />
      <ellipse cx="0" cy="-12" rx="1.5" ry="3" fill="#ffd700" />
    </g>
    
    <path d="M25 78 Q35 75 45 78 T65 78 T75 78" fill="none" stroke="#003f87" strokeWidth="1.5" opacity="0.5" />
    <circle cx="50" cy="50" r="2" fill="#ffd700" />
  </svg>
);

function App() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ householdSize: 1, zipCode: "", monthlyIncome: 0, needs: [], isPregnant: false, hasChildrenUnder5: false, isSenior: false, isDisabled: false, isUnemployed: false });
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
      const prompt = `You are a professional benefits navigator for the Ashtabula County Department of Job and Family Services (ACDJFS). Household size ${data.householdSize}, Monthly income $${data.monthlyIncome}. Circumstances: ${data.isPregnant ? 'Pregnant, ' : ''}${data.isSenior ? 'Senior, ' : ''}${data.isDisabled ? 'Disabled, ' : ''}${data.isUnemployed ? 'Unemployed, ' : ''}. Likely eligible for: ${programs.map(p => p.name).join(', ')}. Provide a clear, professional summary under 150 words of what they might qualify for and how to apply. Mention that ACDJFS is here to support Ashtabula County families.`;
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
    { title: "Welcome", subtitle: "This tool helps you find food, healthcare, and utility assistance in Ashtabula County." },
    { title: "Household Basics", subtitle: "Tell us about your household." },
    { title: "Monthly Income", subtitle: "Your income helps determine eligibility." },
    { title: "Your Situation", subtitle: "Check all that apply." },
    { title: "Your Results", subtitle: "Based on your situation, you may qualify for:" }
  ];

  return (
    <div className="page">
      <div className="bg-waves" aria-hidden="true" />

      <header className="header">
        <div className="logo">
          <CountySealLogo />
          <div className="logo-text">
            <span className="logo-title">ACDJFS</span>
            <span className="logo-subtitle">Benefits Navigator</span>
          </div>
        </div>
        <div className="official-badge">Official</div>
      </header>
      <h1 style={{position: "absolute", left: "-9999px"}}>ACDJFS Benefits Navigator</h1>

      <main className="content">
        {step < 4 && (
          <div className="progress-bar">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className={`progress-step ${i < step ? 'complete' : ''} ${i === step ? 'active' : ''}`} />
            ))}
          </div>
        )}

        <div className={step === 4 ? "results-card" : "card"}>
          <div className="card-header">
            <div className="step-indicator">Step {step + 1} of 5</div>
            <h2 className="card-title">{steps[step].title}</h2>
            <p className="card-subtitle">{steps[step].subtitle}</p>
          </div>

          {step === 0 && (
            <div>
              <p style={{ marginBottom: '20px' }}>Welcome to the ACDJFS Benefits Navigator. This tool helps Ashtabula County residents identify which state and local benefits they may qualify for.</p>
              <div className="btn-group">
                <button className="btn btn-primary" onClick={() => setStep(1)}>Get Started →</button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="form-group">
                <label className="form-label">Household Size (including yourself)</label>
                <input type="number" name="householdSize" value={data.householdSize} onChange={handleChange} className="form-input" min="1" />
              </div>
              <div className="form-group">
                <label className="form-label">ZIP Code</label>
                <input type="text" name="zipCode" value={data.zipCode} onChange={handleChange} placeholder="44004" className="form-input" />
              </div>
              <div className="btn-group">
                <button className="btn btn-secondary" onClick={() => setStep(0)}>← Back</button>
                <button className="btn btn-primary" onClick={() => setStep(2)}>Continue →</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="form-group">
                <label className="form-label">Monthly Income (before taxes)</label>
                <input type="number" name="monthlyIncome" value={data.monthlyIncome} onChange={handleChange} className="form-input" placeholder="0" />
              </div>
              <div className="btn-group">
                <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary" onClick={() => setStep(3)}>Continue →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="checkbox-group">
                {[
                  { key: "isPregnant", label: "I am pregnant" },
                  { key: "hasChildrenUnder5", label: "I have children under age 5" },
                  { key: "isSenior", label: "I am 60 years or older" },
                  { key: "isDisabled", label: "I have a disability" },
                  { key: "isUnemployed", label: "I am currently unemployed" }
                ].map(item => (
                  <div key={item.key} className="checkbox-item">
                    <input type="checkbox" id={item.key} name={item.key} checked={data[item.key]} onChange={handleChange} />
                    <label htmlFor={item.key}>{item.label}</label>
                  </div>
                ))}
              </div>
              <div className="btn-group">
                <button className="btn btn-secondary" onClick={() => setStep(2)}>← Back</button>
                <button className="btn btn-primary" onClick={calculateEligibility}>See Results →</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="results-title">You May Be Eligible For:</h3>
              
              {eligiblePrograms.length > 0 ? (
                <div className="program-list">
                  {eligiblePrograms.map(program => (
                    <div key={program.id} className="program-item">
                      <h4>{program.name}</h4>
                      <p>{program.description}</p>
                      <a href={program.link} target="_blank" rel="noopener noreferrer" className="program-link">
                        Apply via {program.provider} →
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Based on your income, you may not qualify for these programs. However, you can still apply as other factors may be considered.</p>
              )}

              {aiResponse && (
                <div className="ai-response">
                  <h4>💡 Personalized Guidance</h4>
                  <p>{aiResponse}</p>
                </div>
              )}

              {allDocs.length > 0 && (
                <div className="documents-list">
                  <h4>📋 Documents You'll Need</h4>
                  <ul>
                    {allDocs.map((doc, i) => <li key={i}>{doc}</li>)}
                  </ul>
                </div>
              )}

              <div className="btn-group">
                <button className="btn btn-secondary" onClick={() => setStep(0)}>Start Over</button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p className="footer-text">Ashtabula County Department of Job and Family Services</p>
        <p className="footer-subtext">Providing support for a stronger Ashtabula County community.</p>
        <p className="footer-subtext">© 2026 ACDJFS. Results are estimates only.</p>
      </footer>
    </div>
  );
}

export default App;

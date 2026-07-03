import { useState } from "react";
import { callGeminiAPI, extractResponseText } from "./api-client.js";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Government building logo
const LogoIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="20" width="32" height="24" rx="2" fill="#1e3a5f"/>
    <rect x="12" y="28" width="6" height="8" rx="1" fill="#60a5fa"/>
    <rect x="21" y="28" width="6" height="8" rx="1" fill="#60a5fa"/>
    <rect x="30" y="28" width="6" height="8" rx="1" fill="#60a5fa"/>
    <path d="M4 20L24 8L44 20H4Z" fill="#1e3a5f"/>
    <rect x="20" y="4" width="8" height="6" rx="1" fill="#f59e0b"/>
    <circle cx="24" cy="14" r="2" fill="#f59e0b"/>
  </svg>
);

// Grid pattern for government/tech theme
const GridPattern = () => (
  <svg className="grid-pattern" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.05">
      <path d="M0 20h100M0 40h100M0 60h100M0 80h100" stroke="#1e3a5f" strokeWidth="1"/>
      <path d="M20 0v100M40 0v100M60 0v100M80 0v100" stroke="#1e3a5f" strokeWidth="1"/>
    </g>
  </svg>
);

function App() {
  const [town, setTown] = useState("Lenox Township");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true); setError(""); setPlan("");
    try {
      const prompt = `Create a concise GovTech-in-a-Box setup plan for ${town}. Include 3 steps and a timeline estimate. 70 words max.`;
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
      setPlan(text);
    } catch (e) { setError(e.message || "Failed to generate."); } finally { setLoading(false); }
  };

  const features = [
    { icon: "🏛️", title: "Municipal Ready", desc: "Designed for townships & villages" },
    { icon: "⚡", title: "Fast Setup", desc: "Deploy in weeks, not months" },
    { icon: "🔒", title: "Secure", desc: "Gov-grade security standards" },
    { icon: "💰", title: "Affordable", desc: "Small town budgets welcome" }
  ];

  return (
    <div className="page">
      <div className="bg-grid" aria-hidden="true">
        <GridPattern />
      </div>

      <header className="header">
        <div className="logo">
          <LogoIcon />
          <div className="logo-text">
            <span className="logo-title">GovTech</span>
            <span className="logo-subtitle">Box</span>
          </div>
        </div>
        <div className="badge-official">Official Municipality Toolkit</div>
      </header>

      <main className="content">
        <div className="hero">
          <h1>Modern government, simplified</h1>
          <p className="sub">Everything your township needs to serve residents digitally — forms, payments, permits, and transparency tools in one package.</p>
        </div>

        <div className="generator-card">
          <div className="input-group">
            <label>Your Municipality</label>
            <div className="input-wrap">
              <span className="input-icon">🏛️</span>
              <input 
                type="text" 
                value={town} 
                onChange={(e) => setTown(e.target.value)}
                placeholder="Enter your township or village name"
              />
            </div>
          </div>

          <button className="generate-btn" onClick={generate} disabled={loading}>
            {loading ? 'Generating Plan...' : 'Generate Setup Plan'}
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {plan && (
          <div className="plan-card">
            <div className="plan-header">
              <div className="plan-icon">📋</div>
              <h3>Setup Plan for {town}</h3>
            </div>            
            <div className="plan-content">
              <pre>{plan}</pre>
            </div>            
            <div className="plan-actions">
              <button className="btn-secondary">📄 Download PDF</button>
              <button className="btn-primary">📞 Schedule Demo</button>
            </div>
          </div>
        )}

        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-item">
              <div className="feature-icon-box">{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="footer">
        <div className="footer-accent" />
        <p>Empowering Ohio Municipalities • New Ashtabula Initiative</p>
      </footer>
    </div>
  );
}

export default App;
import { useState, useEffect } from "react";
import { callGeminiAPI, extractResponseText } from "./api-client.js";
import { initScrollReveal } from "./scrollReveal.js";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

/* ─── Data Board Logo (SVG) ───
   Navy + Gold government crest-inspired mark */

const DataBoardLogo = () => (
  <svg
    className="logo-icon"
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Ashtabula County Data Board"
  >
    {/* Shield base */}
    <path
      d="M22 2L6 10v12c0 8.84 6.84 16.84 16 19 9.16-2.16 16-10.16 16-19V10L22 2z"
      fill="rgba(255,255,255,0.12)"
      stroke="rgba(255,255,255,0.4)"
      strokeWidth="1.5"
    />
    {/* Data bars */}
    <rect x="14" y="18" width="4" height="10" rx="1" fill="url(#goldGrad)" opacity="0.9" />
    <rect x="20" y="14" width="4" height="14" rx="1" fill="url(#goldGrad)" opacity="0.7" />
    <rect x="26" y="17" width="4" height="11" rx="1" fill="url(#goldGrad)" opacity="0.8" />
    {/* Horizontal grid line */}
    <line x1="12" y1="30" x2="32" y2="30" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
    {/* Gradient definition */}
    <defs>
      <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E8B93A" />
        <stop offset="100%" stopColor="#C8960E" />
      </linearGradient>
    </defs>
  </svg>
);

function App() {
  const [departmentName, setDepartmentName] = useState("Ashtabula County Auditor");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ─── Init scroll-reveal on mount ─── */
  useEffect(() => {
    initScrollReveal(".feature-item", 0.2);
  }, []);

  /* ─── Generate IT assessment ─── */
  const generate = async () => {
    setLoading(true);
    setError("");
    setPlan("");
    try {
      const prompt = `Create a concise IT assessment and procurement overview for ${departmentName}. Include 3 recommended action items and a timeline estimate. 70 words max.`;
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
      setPlan(text);
    } catch (e) {
      setError(e.message || "Failed to generate.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: "🛡️", title: "IT Oversight", desc: "Statutory authority over all county technology procurement" },
    { icon: "🔗", title: "25+ Departments", desc: "Unified standards across every county office" },
    { icon: "📊", title: "Strategic Planning", desc: "County-wide technology roadmap and modernization" },
    { icon: "✅", title: "Approved Vendors", desc: "Pre-validated solutions meeting county standards" },
  ];

  return (
    <div className="page">
      {/* ─── Hero Section ─── */}
      <section className="hero-section">
        <header className="header">
          <div className="logo">
            <DataBoardLogo />
            <div className="logo-text">
              <span className="logo-title">Data Board</span>
              <span className="logo-subtitle">Ashtabula County</span>
            </div>
          </div>
          <div className="badge-official">Authority · ORC 307.84</div>
        </header>

        <div className="hero-content">
          <h1>Modernizing County Technology</h1>
          <p className="hero-sub">
            IT procurement oversight, technology standards, and strategic planning
            for 25+ county departments.
          </p>
          <p className="hero-authority">
            Ashtabula County Data Board · Established under Ohio Revised Code 307.84
          </p>

          {/* ─── Generator Card ─── */}
          <div className="generator-card">
            <div className="input-group">
              <label>Your Department</label>
              <div className="input-wrap">
                <span className="input-icon">🏛️</span>
                <input
                  type="text"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  placeholder="Enter your county department or project name"
                />
              </div>
            </div>
            <button
              className={`generate-btn${loading ? " loading" : ""}`}
              onClick={generate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Generating Assessment...
                </>
              ) : (
                "Generate IT Assessment"
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ─── Main Content ─── */}
      <div className="content">
        {error && <div className="alert alert-error">{error}</div>}

        {plan && (
          <div className="plan-card">
            <div className="plan-header">
              <div className="plan-icon">📋</div>
              <h3>IT Assessment for {departmentName}</h3>
            </div>
            <div className="plan-content">
              <pre>{plan}</pre>
            </div>
            <div className="plan-actions">
              <button className="btn-secondary">📄 Download Report</button>
              <button className="btn-primary">📞 Contact Data Board</button>
            </div>
          </div>
        )}

        {/* ─── Features Section (with gradient glow) ─── */}
        <div className="features-section">
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-item reveal">
                <div className="feature-icon-box">{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Footer ─── */}
      <footer className="footer">
        <div className="footer-accent" />
        <p className="brand-line">Ashtabula County Data Board</p>
        <p className="authority-line">Ohio Revised Code 307.84 · 25+ County Departments</p>
        <p className="partner-line">New Ashtabula Initiative</p>
      </footer>
    </div>
  );
}

export default App;

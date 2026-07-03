import { useState, useEffect } from "react";
import { callGeminiAPI, extractResponseText } from "./api-client.js";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const geminiService = {
  async generateContent(prompt) {
    if (!apiKey || apiKey === 'undefined') throw new Error("API key not configured.");
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
    return text;
  }
};

// Barn silhouette logo
const LogoIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M26 4L4 20v28h16V32h12v16h16V20L26 4z" fill="#c0392b"/>
    <rect x="22" y="38" width="8" height="10" fill="#f9f5e7"/>
    <path d="M26 8l-6 6h12l-6-6z" fill="#f9f5e7"/>
    <circle cx="26" cy="20" r="3" fill="#27ae60"/>
  </svg>
);

// Vegetable pattern background
const VegPattern = () => (
  <svg className="veg-pattern" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.08">
      <ellipse cx="30" cy="40" rx="8" ry="12" fill="#27ae60"/>
      <path d="M30 28v-8M26 32h8" stroke="#27ae60" strokeWidth="2"/>
      <circle cx="80" cy="60" r="10" fill="#e67e22"/>
      <ellipse cx="130" cy="35" rx="7" ry="10" fill="#8e44ad"/>
      <circle cx="170" cy="80" r="8" fill="#c0392b"/>
      <ellipse cx="50" cy="100" rx="9" ry="14" fill="#f39c12"/>
      <ellipse cx="110" cy="120" rx="8" ry="12" fill="#27ae60"/>
      <circle cx="160" cy="140" r="9" fill="#e74c3c"/>
      <ellipse cx="25" cy="160" rx="7" ry="11" fill="#9b59b6"/>
      <ellipse cx="90" cy="175" rx="8" ry="10" fill="#f1c40f"/>
      <circle cx="145" cy="185" r="8" fill="#e67e22"/>
    </g>
  </svg>
);

function App() {
  const [day, setDay] = useState("Saturday");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiConfigured, setApiConfigured] = useState(true);

  useEffect(() => {
    if (!apiKey || apiKey === 'undefined') setApiConfigured(false);
  }, []);

  const find = async () => {
    if (!apiConfigured) { setError("API key not configured."); return; }
    setLoading(true); setError(""); setSummary("");
    try {
      const prompt = `Provide a short farm stand list for ${day} in Ashtabula County, OH. Include 2-3 specific local stands and a friendly CTA. 70 words max. Mention seasonal produce.`;
      const text = await geminiService.generateContent(prompt);
      setSummary(text);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  const days = ["Friday", "Saturday", "Sunday"];

  return (
    <div className="page">
      <div className="bg-vegetables" aria-hidden="true">
        <VegPattern />
      </div>

      <header className="header">
        <div className="logo">
          <LogoIcon />
          <div className="logo-text">
            <span className="logo-title">Farm Stand Finder</span>
            <span className="logo-subtitle">Ashtabula County, OH</span>
          </div>
        </div>
        <div className="season-badge">🌽 Harvest Season 2026</div>
      </header>

      <main className="content">
        <div className="hero-card">
          <div className="hero-badge">Local • Fresh • Community</div>          
          <h1>Fresh from the farm to your table</h1>          
          <p className="hero-desc">Discover local farm stands and CSAs in Ashtabula County. Support our local growers and enjoy the freshest seasonal produce.</p>

          <div className="day-selector">
            <p className="selector-label">When are you visiting?</p>
            <div className="day-buttons">
              {days.map(d => (
                <button
                  key={d}
                  className={`day-btn ${day === d ? 'active' : ''}`}
                  onClick={() => setDay(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button className="find-btn" onClick={find} disabled={loading}>
            {loading ? (
              <>🌽 Finding local stands...</>
            ) : (
              <>Find Fresh Stands →</>
            )}
          </button>

          <div className="trust-pills">
            <span className="pill">🌽 Fresh Daily</span>
            <span className="pill">📍 Local Stands</span>
            <span className="pill">✅ Verified</span>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {summary ? (
          <div className="result-card">
            <div className="result-header">
              <span className="result-icon">🚜</span>
              <h3>Nearby Recommendations</h3>
              <span className="ai-badge">AI Powered</span>
            </div>
            <div className="result-content">
              <p>{summary}</p>
            </div>
            <div className="result-actions">
              <button className="btn-secondary">Get Directions</button>
              <button className="btn-primary">Add Your Farm</button>
            </div>
          </div>
        ) : (
          !loading && !error && (
            <div className="info-card">
              <div className="info-icon">🌾</div>
              <p>Select a day and click "Find Fresh Stands" to discover local farm stands with seasonal produce.</p>
            </div>
          )
        )}

        <div className="features">
          <div className="feature-card">
            <div className="feature-icon-wrap">🚜</div>
            <h4>Support Local</h4>
            <p>Directly support Ashtabula farming families and preserve our agricultural heritage.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrap">🍓</div>
            <h4>Seasonal Favorites</h4>
            <p>From spring strawberries to autumn apples, discover what's at its peak right now.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrap">🤝</div>
            <h4>Community First</h4>
            <p>Strengthen our local food economy while discovering hidden gems in our county.</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-ornament">
          <svg viewBox="0 0 100 20" preserveAspectRatio="none">
            <path d="M0,10 Q25,0 50,10 T100,10" fill="none" stroke="#c0392b" strokeWidth="2"/>
          </svg>
        </div>
        <p>© 2026 New Ashtabula Initiative • Promoting Local Agriculture</p>
        <p className="footer-location">🌾 Ashtabula County, Ohio 🌾</p>
      </footer>
    </div>
  );
}

export default App;
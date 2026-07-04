import { useState } from "react";
import "./App.css";

const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

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
const callOpenRouterAPI = async (prompt, retryCount = 0) => {
  try {
    const res = await fetchWithTimeout(
      OPENROUTER_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "NAI - adaptive-reuse-planner",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
        }),
      },
      API_TIMEOUT
    );

    // Handle rate limiting (429)
    if (res.status === 429) {
      if (retryCount < MAX_RETRIES) {
        const backoffDelay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
        await delay(backoffDelay);
        return callOpenRouterAPI(prompt, retryCount + 1);
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
      return callOpenRouterAPI(prompt, retryCount + 1);
    }
    throw error;
  }
};

// SVG Icons
const BuildingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="9" y1="21" x2="9" y2="9"/>
  </svg>
);

const FileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

const ZapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

// Case study icon
const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const DollarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const RulerIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 2l6 6L8 22l-6-6L16 2z"/>
    <path d="M7.5 7.5l3 3"/>
    <path d="M10.5 10.5l3 3"/>
    <path d="M4.5 13.5l3 3"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

function App() {
  const [building, setBuilding] = useState("Historic warehouse, 18k sq ft");
  const [ideas, setIdeas] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    setLoading(true);
    setError("");
    setIdeas("");
    try {
      if (!apiKey) {
        throw new Error("API key not configured. Add VITE_OPENROUTER_API_KEY to your environment.");
      }
      const prompt = `Suggest 3 adaptive reuse concepts for: ${building}. Include a short feasibility note on capital stack considerations and zoning. 90 words max.`;
      const data = await callOpenRouterAPI(prompt);
      const text = data?.choices?.[0]?.message?.content || "";
      if (!text) throw new Error("No response from OpenRouter.");
      setIdeas(text);
    } catch (e) {
      setError(e.message || "Failed to generate. Please check your connection and try again.");
      console.error("Adaptive Reuse Planner API Error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      {/* Logo & Brand Bar */}
      <div className="top-bar">
        <a href="https://www.renewptr.com" className="logo-link" target="_blank" rel="noopener noreferrer">
          <img src="/logo.svg" alt="Renew Partners LLC" />
        </a>
      </div>

      <header className="hero">
        <div>
          <p className="eyebrow">Renew Partners LLC — Adaptive Reuse Development</p>
          <h1>Breathing new life into landmarks across Northeast Ohio</h1>
          <p className="sub">
            Developers of marquee historic, commercial, and industrial buildings.
            From Painesville's Victoria Place to Cleveland's historic Agora —
            we transform dormant landmarks into vibrant, economically productive spaces.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={analyze} disabled={loading}>
              {loading ? "Analyzing..." : "Analyze a Property"}
            </button>
            <button className="ghost">View Our Projects</button>
          </div>
          <div className="trust">
            <span><BuildingIcon /> Capital stack expertise</span>
            <span><FileIcon /> Historic tax credits</span>
            <span><ZapIcon /> 9 services across NE Ohio</span>
          </div>
        </div>
        <div className="hero-card">
          <h3>Describe a property</h3>
          <input value={building} onChange={(e) => setBuilding(e.target.value)} placeholder="e.g. Historic warehouse, 18k sq ft" />
        </div>
      </header>

      <section className="card">
        <div className="card-head">
          <h2>Adaptive Reuse Concepts</h2>
          <span className="pill">AI Feasibility</span>
        </div>
        {error && <div className="error">{error}</div>}
        {ideas ? <pre className="output">{ideas}</pre> : <p className="muted">Enter a property to receive reuse concepts with capital stack and feasibility notes.</p>}
      </section>

      <section className="grid">
        <div className="tile"><h3>Historic Preservation</h3><p>Expert restoration of landmark buildings with historic tax credit financing.</p></div>
        <div className="tile"><h3>Capital Stack Structuring</h3><p>Complex financing woven from tax credits, grants, and conventional debt.</p></div>
        <div className="tile"><h3>Brownfield Remediation</h3><p>Environmental cleanup and redevelopment of challenged industrial sites.</p></div>
        <div className="tile"><h3>Multi-Family Development</h3><p>Market-rate and mixed-income residential in repositioned commercial structures.</p></div>
        <div className="tile"><h3>Hospitality Redevelopment</h3><p>Hotel conversions and new-build hospitality at destination locations.</p></div>
        <div className="tile"><h3>Commercial Property</h3><p>Retail, office, and mixed-use space revitalization across Northeast Ohio.</p></div>
      </section>

      {/* Case Study: Victoria Place */}
      <section className="case-study">
        <h2>Featured Project</h2>
        <div className="case-card">
          <div className="case-visual">
            <div className="stat">$29M</div>
            <div className="stat-label">Project Budget</div>
            <div className="stat">191,000</div>
            <div className="stat-label">Square Feet</div>
            <div className="stat">78</div>
            <div className="stat-label">Market-Rate Apartments</div>
          </div>
          <div className="case-body">
            <h3>Victoria Place</h3>
            <div className="case-location">Painesville Square, Painesville, OH</div>
            <p>
              Formerly a retail mall, Victoria Place is being redeveloped into 78 market-rate
              apartments with vibrant commercial space on the first floor. This $29 million,
              191,000 sq ft adaptive reuse project broke ground in August 2025 and represents
              a landmark redevelopment in Lake County — bringing new residential density to
              Painesville's historic downtown square.
            </p>
            <div className="case-detail">
              <span><MapPinIcon /> Painesville Square</span>
              <span><DollarIcon /> $29M Budget</span>
              <span><RulerIcon /> 191,000 sq ft</span>
              <span><CalendarIcon /> 18&ndash;20 months</span>
            </div>
            <p>
              The project exemplifies Renew Partners' approach to complex capital stack
              structuring — weaving together historic tax credits, brownfield remediation
              grants, and conventional financing to make the numbers work on buildings
              others won't touch.
            </p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <img src="/logo.svg" alt="Renew Partners LLC" />
          </div>
          <div className="footer-name">Renew Partners LLC</div>
          <div className="footer-tagline">Developers of Marquee Historic, Commercial, and Industrial Buildings</div>
          <div className="footer-contact">
            <span>9755 Plank Rd, Montville, OH 44064</span>
            <a href="tel:+14409012030">+1-440-901-2030</a>
            <a href="mailto:info@renewptr.com">info@renewptr.com</a>
            <a href="https://www.renewptr.com" target="_blank" rel="noopener noreferrer">renewptr.com</a>
          </div>
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} Renew Partners LLC. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

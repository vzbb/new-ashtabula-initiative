import { useState } from "react";
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
        throw new Error("API key not configured. Add VITE_GEMINI_API_KEY to your environment.");
      }
      const prompt = `Suggest 3 adaptive reuse concepts for: ${building}. Include a short feasibility note for zoning. 90 words max.`;
      const data = await callGeminiAPI(prompt);
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!text) throw new Error("No response from Gemini.");
      setIdeas(text);
    } catch (e) {
      setError(e.message || "Failed to generate. Please check your connection and try again.");
      // Log to console for debugging but don't expose to user
      console.error("Adaptive Reuse Planner API Error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Adaptive Reuse Planner</p>
          <h1>Turn vacant buildings into revenue-ready concepts</h1>
          <p className="sub">Gemini-powered reuse ideas + zoning hints.</p>
          <div className="hero-actions">
            <button className="primary" onClick={analyze} disabled={loading}>
              {loading ? "Analyzing..." : "Generate Concepts"}
            </button>
            <button className="ghost">Share with council</button>
          </div>
          <div className="trust">
            <span><BuildingIcon /> Gemini API</span>
            <span><FileIcon /> Feasibility notes</span>
            <span><ZapIcon /> 10-second output</span>
          </div>
        </div>
        <div className="hero-card">
          <h3>Building profile</h3>
          <input value={building} onChange={(e) => setBuilding(e.target.value)} />
        </div>
      </header>

      <section className="card">
        <div className="card-head">
          <h2>Reuse Concepts</h2>
          <span className="pill">Gemini API</span>
        </div>
        {error && <div className="error">{error}</div>}
        {ideas ? <pre className="output">{ideas}</pre> : <p className="muted">Concepts appear here.</p>}
      </section>

      <section className="grid">
        <div className="tile"><h3>Economic lift</h3><p>New uses increase tax base.</p></div>
        <div className="tile"><h3>Faster approvals</h3><p>Early zoning fit checks.</p></div>
        <div className="tile"><h3>Stakeholder buy-in</h3><p>Clear, shareable summaries.</p></div>
      </section>

      <footer className="footer">City of Geneva • Ashtabula County, OH</footer>
    </div>
  );
}

export default App;

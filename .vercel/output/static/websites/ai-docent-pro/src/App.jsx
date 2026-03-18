import { useState } from "react";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// API Configuration
const API_TIMEOUT = 30000;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithTimeout = async (url, options, timeoutMs) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') throw new Error('Request timed out. Please try again.');
    throw error;
  }
};

const callGeminiAPI = async (prompt, model = 'gemini-1.5-flash', retryCount = 0) => {
  if (!apiKey) throw new Error('API key not configured. Add VITE_GEMINI_API_KEY to your environment.');
  try {
    const res = await fetchWithTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) },
      API_TIMEOUT
    );
    if (res.status === 429) {
      if (retryCount < MAX_RETRIES) { await delay(INITIAL_RETRY_DELAY * Math.pow(2, retryCount)); return callGeminiAPI(prompt, model, retryCount + 1); }
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    }
    if (!res.ok) { const errorData = await res.json().catch(() => ({})); throw new Error(errorData.error?.message || `API error: ${res.status}`); }
    return await res.json();
  } catch (error) {
    if (retryCount < MAX_RETRIES && (error.message.includes('fetch') || error.message.includes('network') || error.name === 'TypeError')) {
      await delay(INITIAL_RETRY_DELAY * Math.pow(2, retryCount));
      return callGeminiAPI(prompt, model, retryCount + 1);
    }
    throw error;
  }
};

// SVG Icons
const HeadphonesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3"/>
    <path d="M17 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3"/>
    <path d="M5 14H3a2 2 0 0 1-2-2V9a9 9 0 0 1 18 0v3a2 2 0 0 1-2 2h-2"/>
  </svg>
);

const LandmarkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18"/>
    <path d="M5 21V7l8-4 8 4v14"/>
    <path d="M9 21v-6h6v6"/>
  </svg>
);

const ZapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

function App() {
  const [desc, setDesc] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    setStory("");
    try {
      const prompt = `You are a museum docent. Write a 120-word narration plus 5 tags for an exhibit described as: ${desc}. Format: Narration:\n...\nTags: tag1, tag2, ...`;
      const data = await callGeminiAPI(prompt);
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!text) throw new Error("No response from Gemini.");
      setStory(text);
    } catch (e) {
      setError(e.message || "Failed to generate.");
      console.error("AI Docent Pro API Error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">AI Docent Pro</p>
          <h1>Turn artifacts into unforgettable stories</h1>
          <p className="sub">Gemini-powered narration, tags, and exhibit metadata in seconds.</p>
          <div className="hero-actions">
            <button className="primary" onClick={generate} disabled={loading || !desc}>
              {loading ? "Generating..." : "Generate Narration"}
            </button>
            <button className="ghost">Demo in lobby</button>
          </div>
          <div className="trust">
            <span><HeadphonesIcon /> Audio-ready script</span>
            <span><LandmarkIcon /> Exhibit tags</span>
            <span><ZapIcon /> Gemini API</span>
          </div>
        </div>
        <div className="hero-card">
          <h3>Describe the artifact</h3>
          <textarea rows="6" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Copper tools used by harbor workers..." />
        </div>
      </header>

      <section className="card">
        <div className="card-head">
          <h2>Narration Output</h2>
          <span className="pill">Gemini API</span>
        </div>
        {error && <div className="error">{error}</div>}
        {story ? <pre className="output">{story}</pre> : <p className="muted">Narration appears here.</p>}
      </section>

      <section className="grid">
        <div className="tile">
          <h3>Visitor engagement</h3>
          <p>Give staff a ready-to-read story and improve dwell time.</p>
        </div>
        <div className="tile">
          <h3>Exhibit ops</h3>
          <p>Standardize label copy with consistent tone.</p>
        </div>
        <div className="tile">
          <h3>Accessibility</h3>
          <p>Instant audio narration for screen-free tours.</p>
        </div>
      </section>

      <footer className="footer">Ashtabula Maritime Museum • Ashtabula County, OH</footer>
    </div>
  );
}

export default App;

import { useState, useEffect } from "react";
import "./App.css";
import { generatePetRecommendation, validateApiConfig } from "./config/api.js";

function App() {
  const [prefs, setPrefs] = useState("Calm, kid‑friendly, medium size");
  const [match, setMatch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [configError, setConfigError] = useState("");

  // Validate API config on mount
  useEffect(() => {
    const configCheck = validateApiConfig();
    if (!configCheck.valid) {
      setConfigError(configCheck.error);
    }
  }, []);

  const recommend = async () => {
    // Check for config errors
    const configCheck = validateApiConfig();
    if (!configCheck.valid) {
      setError(configCheck.error);
      return;
    }
    
    setLoading(true);
    setError("");
    setMatch("");
    
    try {
      const text = await generatePetRecommendation(prefs);
      setMatch(text);
    } catch (e) {
      setError(e.message || "Failed to generate recommendation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Pet Matchmaker</p>
          <h1>Find the perfect adoption match</h1>
          <p className="sub">Gemini‑powered recommendations + adoption CTA.</p>
          <div className="hero-actions">
            <button className="primary" onClick={recommend} disabled={loading}>
              {loading ? "Matching…" : "Find a Match"}
            </button>
            <button className="ghost">Schedule meet‑and‑greet</button>
          </div>
          <div className="trust">
            <span>🐾 Gemini API</span>
            <span>⚡ 5‑second output</span>
            <span>✅ More adoptions</span>
          </div>
        </div>
        <div className="hero-card">
          <h3>Preferences</h3>
          <label>Notes<input value={prefs} onChange={(e) => setPrefs(e.target.value)} /></label>
        </div>
      </header>
      <section className="card">
        <div className="card-head"><h2>Recommendation</h2><span className="pill">Gemini API</span></div>
        {configError && <div className="error">⚠️ {configError}</div>}
        {error && <div className="error">{error}</div>}
        {match ? <pre className="output">{match}</pre> : <p className="muted">Match appears here.</p>}
      </section>
      <section className="grid">
        <div className="tile"><h3>Better matches</h3><p>Preferences → ideal pet.</p></div>
        <div className="tile"><h3>Faster adoption</h3><p>Reduce browsing time.</p></div>
        <div className="tile"><h3>More engagement</h3><p>Clear CTA to book a visit.</p></div>
      </section>
      <footer className="footer">Local Shelter • Ashtabula County, OH</footer>
    </div>
  );
}

export default App;

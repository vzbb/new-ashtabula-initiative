import { useState } from "react";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// === NAI API Client - Robust Error Handling & Retry Logic ===
const API_CONFIG = {
  TIMEOUT_MS: 30000,
  MAX_RETRIES: 3,
  INITIAL_RETRY_DELAY_MS: 1000,
  MAX_RETRY_DELAY_MS: 10000,
  RATE_LIMIT_STATUS: 429,
  RETRYABLE_STATUS_CODES: [408, 429, 500, 502, 503, 504],
};

const delay = (ms) => {
  const jitter = Math.random() * 200;
  return new Promise(resolve => setTimeout(resolve, ms + jitter));
};

const getBackoffDelay = (retryCount) => {
  const exponentialDelay = API_CONFIG.INITIAL_RETRY_DELAY_MS * Math.pow(2, retryCount);
  return Math.min(exponentialDelay, API_CONFIG.MAX_RETRY_DELAY_MS);
};

const fetchWithTimeout = async (url, options = {}, timeoutMs = API_CONFIG.TIMEOUT_MS) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

const isRetryable = (errorOrResponse) => {
  if (errorOrResponse instanceof Response) {
    return API_CONFIG.RETRYABLE_STATUS_CODES.includes(errorOrResponse.status);
  }
  const errorMessage = errorOrResponse.message?.toLowerCase() || '';
  return (
    errorOrResponse.name === 'TypeError' ||
    errorMessage.includes('fetch') ||
    errorMessage.includes('network') ||
    errorMessage.includes('failed to fetch') ||
    errorMessage.includes('timeout')
  );
};

const callGeminiAPI = async (prompt, model = 'gemini-1.5-flash', retryCount = 0) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('API key not configured. Please check your environment settings.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  };

  try {
    const response = await fetchWithTimeout(url, options, API_CONFIG.TIMEOUT_MS);

    if (response.status === API_CONFIG.RATE_LIMIT_STATUS) {
      if (retryCount < API_CONFIG.MAX_RETRIES) {
        await delay(getBackoffDelay(retryCount));
        return callGeminiAPI(prompt, model, retryCount + 1);
      }
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `API error: ${response.status}`;
      if (API_CONFIG.RETRYABLE_STATUS_CODES.includes(response.status) && retryCount < API_CONFIG.MAX_RETRIES) {
        await delay(getBackoffDelay(retryCount));
        return callGeminiAPI(prompt, model, retryCount + 1);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('No response content received from API.');
    }
    return data;
  } catch (error) {
    if (isRetryable(error) && retryCount < API_CONFIG.MAX_RETRIES) {
      await delay(getBackoffDelay(retryCount));
      return callGeminiAPI(prompt, model, retryCount + 1);
    }

    let userMessage = 'An error occurred while processing your request.';
    if (error.message?.includes('timeout')) {
      userMessage = 'Request timed out. Please check your connection and try again.';
    } else if (error.message?.includes('Rate limit') || error.message?.includes('API key') || error.message?.includes('No response content')) {
      userMessage = error.message;
    }
    throw new Error(userMessage);
  }
};

const extractResponseText = (responseData) => {
  return responseData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
};
// === End NAI API Client ===


function App() {
  const [date, setDate] = useState("");
  const [party, setParty] = useState("4");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const planTrip = async () => {
    if (!date) {
      setError("Please select a date.");
      return;
    }
    setLoading(true);
    setError("");
    setPlan("");
    try {
      const prompt = `Create a short charter trip plan for Lake Erie on ${date} for party size ${party}. Include ideal departure time and a one-line safety note. 80 words max.`;
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!text) throw new Error("No response from Gemini.");
      setPlan(text);
    } catch (e) {
      setError(e.message || "Failed to generate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <nav className="navbar">
        <div className="nav-brand">
          <img src="/charter-booking/images/logo.svg" alt="New Ashtabula Initiative Logo" className="logo" />
          <span className="brand-name">Ashtabula Charters</span>
        </div>
        <div className="nav-links">
          <a href="#charters">Find a Boat</a>
          <a href="#about">About</a>
          <button className="primary-sm">Captain Login</button>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <p className="eyebrow">The Heart of Lake Erie Fishing</p>
          <h1>Premier Fishing Charters in Ashtabula Harbor</h1>
          <p className="sub">Experience the Walleye Capital of the World with local captains and AI-optimized planning.</p>
          <div className="hero-actions">
            <button className="primary" onClick={planTrip} disabled={loading}>
              {loading ? "Planning..." : "Plan Your Adventure"}
            </button>
            <button className="ghost">Browse All Boats</button>
          </div>
          <div className="trust">
            <span>🛡️ USCG Licensed</span>
            <span>⚓ Local Expertise</span>
            <span>⭐ Top Rated</span>
          </div>
        </div>
        <div className="hero-card">
          <h3>Quick Trip Planner</h3>
          <p className="muted-sm">AI-powered itinerary based on current season</p>
          <label>Date
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label>Party size
            <select value={party} onChange={(e) => setParty(e.target.value)}>
              {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Angler' : 'Anglers'}</option>)}
            </select>
          </label>
        </div>
      </header>

      <section id="plan" className="card plan-section">
        <div className="card-head">
          <h2>Your Custom Itinerary</h2>
          <span className="pill">Gemini-Powered</span>
        </div>
        {error && <div className="error">{error}</div>}
        {plan ? (
          <div className="plan-output">
            <pre className="output">{plan}</pre>
            <div className="plan-actions">
              <button className="secondary">Book This Schedule</button>
              <button className="text">Download PDF</button>
            </div>
          </div>
        ) : (
          <div className="placeholder">
            <p className="muted">Enter trip details above to generate your fishing plan.</p>
          </div>
        )}
      </section>

      <section id="charters" className="featured-section">
        <h2>Top-Rated Ashtabula Charters</h2>
        <p className="section-sub">Trusted local operators ready to get you on the fish.</p>
        <div className="grid">
          <div className="tile charter-card">
            <div className="charter-img placeholder-img"></div>
            <h3>Lucky Strike Charters</h3>
            <p className="charter-meta">Walleye • Perch • Steelhead</p>
            <p className="muted-sm">Known for corporate groups and family-friendly outings.</p>
            <button className="outline-sm">View Profile</button>
          </div>
          <div className="tile charter-card">
            <div className="charter-img placeholder-img"></div>
            <h3>Wrek-N-Eyes</h3>
            <p className="charter-meta">Walleye Specialty • Multi-Boat</p>
            <p className="muted-sm">High-performance fleet for serious anglers.</p>
            <button className="outline-sm">View Profile</button>
          </div>
          <div className="tile charter-card">
            <div className="charter-img placeholder-img"></div>
            <h3>Special-Eyes</h3>
            <p className="charter-meta">All Species • Professional Fleet</p>
            <p className="muted-sm">One of the most established names in Lake Erie fishing.</p>
            <button className="outline-sm">View Profile</button>
          </div>
        </div>
      </section>

      <section id="about" className="info-section">
        <div className="info-grid">
          <div className="info-text">
            <h2>Why Fish Ashtabula?</h2>
            <p>Ashtabula Harbor isn't just a port; it's the gateway to the deepest, coldest, and most productive waters of Lake Erie's Central Basin.</p>
            <ul className="check-list">
              <li><strong>Walleye Capital:</strong> Consistent limits throughout the season.</li>
              <li><strong>Deep Water:</strong> Cooler waters mean fish stay active all summer.</li>
              <li><strong>Harbor Life:</strong> Historic restaurants and shops for post-trip relaxing.</li>
            </ul>
          </div>
          <div className="info-visual placeholder-img"></div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img src="/charter-booking/images/logo.svg" alt="Logo" className="logo-muted" />
            <p>New Ashtabula Initiative</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Anglers</h4>
              <a href="#">Search Boats</a>
              <a href="#">Fishing Reports</a>
              <a href="#">FAQ</a>
            </div>
            <div className="link-group">
              <h4>Captains</h4>
              <a href="#">Join the Platform</a>
              <a href="#">Dashboard</a>
              <a href="#">Resources</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 2026 Ashtabula County, OH • All Rights Reserved
        </div>
      </footer>
    </div>
  );
}

export default App;

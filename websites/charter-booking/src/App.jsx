import { useState } from "react";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const logoSrc = `${import.meta.env.BASE_URL}images/logo.svg`;

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

const buildFallbackPlan = (date, party) => {
  const crewLabel = party === "1" ? "1 angler" : `${party} anglers`;
  return `Compensator trip brief for ${crewLabel} on ${date}: target an early Ashtabula Harbor departure for the cleanest water and easiest staging. Keep the day positioned around walleye first, with perch or steelhead as backup depending on the latest bite. Arrive 30 minutes early, confirm cooler space and licenses, and bring layered gear for changing Lake Erie conditions. Safety note: monitor harbor chop and weather shifts before launch.`;
};

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
      if (!apiKey) {
        setPlan(buildFallbackPlan(date, party));
        return;
      }

      const prompt = `Create a short trip plan for Compensator Lake Erie Fishing Charters in Ashtabula Harbor on ${date} for party size ${party}. Keep the tone clear, local, and captain-ready. Include the best departure window, mention walleye/perch/steelhead if relevant, include one prep reminder for the crew, and add one clear Lake Erie safety note. 90 words max.`;
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);

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
          <img src={logoSrc} alt="Compensator Lake Erie Fishing Charters logo" className="logo" />
          <span className="brand-name">Compensator Charters</span>
        </div>
        <div className="nav-links">
          <a href="#trips">Trip Types</a>
          <a href="#about">About</a>
          <button className="primary-sm">Book a Trip</button>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <p className="eyebrow">Ashtabula Harbor • Lake Erie charter trips</p>
          <h1>Compensator Lake Erie Fishing Charters</h1>
          <p className="sub">Book walleye, perch, and steelhead trips with a local Ashtabula Harbor charter that keeps the planning simple, the departure details clear, and the day centered on a serious Lake Erie bite.</p>
          <div className="hero-actions">
            <button className="primary" onClick={planTrip} disabled={loading}>
              {loading ? "Planning..." : "Plan My Trip"}
            </button>
            <button className="ghost">See Trip Types</button>
          </div>
          <div className="trust">
            <span>⚓ Ashtabula Harbor launch</span>
            <span>🎣 Walleye • Perch • Steelhead</span>
            <span>🗓️ Full- &amp; half-day trips</span>
          </div>
          <div className="trust">
            <span>📍 Dock-side meeting details</span>
            <span>🧭 First-timer friendly planning</span>
            <span>🛟 Weather + safety reminders</span>
          </div>
          <p className="hero-note">This pass is framed as a real Compensator booking handoff: fewer pre-launch text threads, cleaner guest prep, and a faster path from inquiry to harbor departure.</p>
        </div>
        <div className="hero-card">
          <h3>Quick Trip Planner</h3>
          <p className="muted-sm">Compensator-ready itinerary for a clean harbor launch, fast trip confirmation, and species-aware planning. If live AI planning is unavailable, the demo still returns a Compensator-specific trip brief.</p>
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
          <h2>Your Lake Erie Trip Plan</h2>
          <span className="pill">Compensator-ready</span>
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
            <p className="muted">Enter trip details above to generate a Compensator fishing plan with departure timing, target species framing, and a prep note for your crew.</p>
          </div>
        )}
      </section>

      <section id="trips" className="featured-section">
        <h2>Why anglers book Compensator</h2>
        <p className="section-sub">A local charter experience shaped around fast planning, clear communication, and a dependable Ashtabula Harbor launch for Lake Erie walleye, perch, and steelhead trips.</p>
        <div className="grid">
          <div className="tile charter-card">
            <div className="charter-img placeholder-img"></div>
            <h3>Walleye runs</h3>
            <p className="charter-meta">Prime Lake Erie season trips</p>
            <p className="muted-sm">Built around the lake’s most popular bite, with simple planning for repeat groups and first-timers alike.</p>
            <button className="outline-sm">See dates</button>
          </div>
          <div className="tile charter-card">
            <div className="charter-img placeholder-img"></div>
            <h3>Full- and half-day trips</h3>
            <p className="charter-meta">Flexible for families and small groups</p>
            <p className="muted-sm">The booking flow makes shorter weekday outings and full-day weekends equally easy to plan.</p>
            <button className="outline-sm">Compare trip lengths</button>
          </div>
          <div className="tile charter-card">
            <div className="charter-img placeholder-img"></div>
            <h3>Steelhead + perch</h3>
            <p className="charter-meta">Clear communication before the launch</p>
            <p className="muted-sm">Guests get a clean trip summary, meeting details, and a tighter plan before they ever head for the harbor.</p>
            <button className="outline-sm">Preview the plan</button>
          </div>
        </div>
      </section>

      <section id="about" className="info-section">
        <div className="info-grid">
          <div className="info-text">
            <h2>Why Compensator?</h2>
            <p>Compensator Lake Erie Fishing Charters is built for anglers who want a straightforward Ashtabula Harbor launch, strong Lake Erie species coverage, and a booking flow that feels like a real charter conversation instead of a generic inquiry form.</p>
            <ul className="check-list">
              <li><strong>Lake Erie species:</strong> Walleye, perch, and steelhead are all part of the core trip story.</li>
              <li><strong>Ashtabula Harbor:</strong> A familiar launch point that keeps the guest experience simple.</li>
              <li><strong>Trip clarity:</strong> Guests get the kind of plan and timing notes that reduce back-and-forth before the trip.</li>
              <li><strong>Captain value:</strong> The workflow is positioned as a real booking and prep tool, not just a public-facing brochure page.</li>
            </ul>
          </div>
          <div className="info-visual placeholder-img"></div>
        </div>
      </section>

      <section className="card plan-section">
        <div className="card-head">
          <h2>Designed for real charter handoff</h2>
          <span className="pill">Captain-friendly</span>
        </div>
        <div className="grid">
          <div className="tile">
            <h3>Before the dock</h3>
            <p className="muted-sm">Guests get a departure window, crew-size confirmation, and a practical prep note before they arrive at the harbor.</p>
          </div>
          <div className="tile">
            <h3>At the launch</h3>
            <p className="muted-sm">The booking flow sets expectations early, which means less back-and-forth and a cleaner dock-side handoff.</p>
          </div>
          <div className="tile">
            <h3>After booking</h3>
            <p className="muted-sm">The same system can extend into reminders, what-to-bring notes, and repeat trip scheduling for returning anglers.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img src={logoSrc} alt="Compensator Lake Erie Fishing Charters logo" className="logo-muted" />
            <p>Compensator Lake Erie Fishing Charters</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Anglers</h4>
              <a href="#">Trip Types</a>
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
          &copy; 2026 Compensator Lake Erie Fishing Charters • Ashtabula Harbor, Ohio
        </div>
      </footer>
    </div>
  );
}

export default App;

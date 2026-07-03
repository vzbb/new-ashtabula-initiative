import { useState } from "react";
import "./App.css";

const RIDGEVIEW = {
  name: "Ridgeview Estates",
  tagline: "Quality, Affordable Living",
  location: "4405 Erie Ridge Road, Ashtabula, OH 44004",
  phone: "330-979-2410",
  applicationFee: "$50 non-refundable fee per applicant",
  approvalWindow: "2-5 business days",
  holdDeposit: "48 hours to bring holding deposit after approval",
};

const POLICIES = [
  "6 months rental history required",
  "No pets unless service animal",
  "Non-smoking facility",
  "First come, first serve parking",
];

const HIGHLIGHTS = [
  {
    title: "Quality, affordable living",
    copy: "Quiet, country-like apartments minutes from State Route 11 and Interstate 90.",
  },
  {
    title: "Fast application flow",
    copy: "A structured application process helps pre-screen renters and reduce vacancy time.",
  },
  {
    title: "Safe and consistent",
    copy: "Clear rules and a non-smoking policy support a calm, well-kept community.",
  },
];

const API_CONFIG = {
  TIMEOUT_MS: 30000,
  MAX_RETRIES: 3,
  INITIAL_RETRY_DELAY_MS: 1000,
  MAX_RETRY_DELAY_MS: 10000,
  RATE_LIMIT_STATUS: 429,
  RETRYABLE_STATUS_CODES: [408, 429, 500, 502, 503, 504],
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms + Math.random() * 200));

const getBackoffDelay = (retryCount) =>
  Math.min(API_CONFIG.INITIAL_RETRY_DELAY_MS * Math.pow(2, retryCount), API_CONFIG.MAX_RETRY_DELAY_MS);

const fetchWithTimeout = async (url, options = {}, timeoutMs = API_CONFIG.TIMEOUT_MS) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
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
  const errorMessage = errorOrResponse.message?.toLowerCase() || "";
  return (
    errorOrResponse.name === "TypeError" ||
    errorMessage.includes("fetch") ||
    errorMessage.includes("network") ||
    errorMessage.includes("failed to fetch") ||
    errorMessage.includes("timeout")
  );
};

const callGeminiAPI = async (prompt, model = "gemini-1.5-flash", retryCount = 0) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API key not configured. Please check your environment settings.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  };

  try {
    const response = await fetchWithTimeout(url, options, API_CONFIG.TIMEOUT_MS);

    if (response.status === API_CONFIG.RATE_LIMIT_STATUS) {
      if (retryCount < API_CONFIG.MAX_RETRIES) {
        await delay(getBackoffDelay(retryCount));
        return callGeminiAPI(prompt, model, retryCount + 1);
      }
      throw new Error("Rate limit exceeded. Please wait a moment and try again.");
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
      throw new Error("No response content received from API.");
    }
    return data;
  } catch (error) {
    if (isRetryable(error) && retryCount < API_CONFIG.MAX_RETRIES) {
      await delay(getBackoffDelay(retryCount));
      return callGeminiAPI(prompt, model, retryCount + 1);
    }

    let userMessage = "An error occurred while processing your request.";
    if (error.message?.includes("timeout")) {
      userMessage = "Request timed out. Please check your connection and try again.";
    } else if (
      error.message?.includes("Rate limit") ||
      error.message?.includes("API key") ||
      error.message?.includes("No response content")
    ) {
      userMessage = error.message;
    }
    throw new Error(userMessage);
  }
};

const extractResponseText = (responseData) => responseData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

const RidgeviewMark = () => (
  <svg className="logo" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="ridgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2b6cb0" />
        <stop offset="100%" stopColor="#38a169" />
      </linearGradient>
    </defs>
    <rect x="10" y="12" width="76" height="72" rx="20" fill="#f7fafc" stroke="url(#ridgeGradient)" strokeWidth="3" />
    <path
      d="M18 58L36 40L48 50L60 34L78 50"
      fill="none"
      stroke="#2b6cb0"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 65H74"
      fill="none"
      stroke="#38a169"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M32 63V48H45V63"
      fill="#ffffff"
      stroke="#718096"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M52 63V42H65V63"
      fill="#ffffff"
      stroke="#718096"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <circle cx="41" cy="55" r="1.8" fill="#38a169" />
    <circle cx="61" cy="55" r="1.8" fill="#38a169" />
  </svg>
);

const buildLocalSummary = (max) => [
  `• Ridgeview Estates fits a ${max ? `$${max}` : "your"} monthly budget by pairing clean, affordable apartments with a calm Ashtabula location.`,
  `• Expect a structured review: ${RIDGEVIEW.approvalWindow}, ${RIDGEVIEW.applicationFee}, and ${RIDGEVIEW.holdDeposit}.`,
  "• Best next step: call 330-979-2410 or visit the office with your ID, application, and fee to start the approval process.",
].join("\n");

function App() {
  const [max, setMax] = useState(1000);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    setLoading(true);
    setError("");
    setSummary("");
    try {
      const prompt = `You are helping a renter evaluate Ridgeview Estates in Ashtabula, Ohio.
Use the real brand cues only:
- Brand: ${RIDGEVIEW.name}
- Tagline: ${RIDGEVIEW.tagline}
- Location: ${RIDGEVIEW.location}
- Phone: ${RIDGEVIEW.phone}
- Policies: ${POLICIES.join(", ")}
- Process: ${RIDGEVIEW.applicationFee}, ${RIDGEVIEW.approvalWindow}, ${RIDGEVIEW.holdDeposit}

Write exactly 3 short bullets and one short CTA. Keep it under 90 words. Make it practical and buyer-specific.
Budget context: maximum monthly rent is $${max}.`;

      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
      setSummary(text || buildLocalSummary(max));
    } catch (e) {
      setError(e.message || "Failed to generate.");
      setSummary(buildLocalSummary(max));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand-lockup">
          <RidgeviewMark />
          <div>
            <div className="brand-name">{RIDGEVIEW.name}</div>
            <div className="brand-sub">{RIDGEVIEW.tagline}</div>
          </div>
        </div>
        <div className="meta-pill">Ashtabula County • Ridgeview-specific availability</div>
      </header>

      <header className="hero">
        <div className="hero-content">
          <span className="eyebrow">Quiet apartments • Fast screening • Clear policies</span>
          <h1>Find a quality, affordable home faster.</h1>
          <p className="sub">
            Built for Ridgeview Estates: a calm, safety-conscious rental finder that speaks the language of
            quality living, structured approvals, and local Ashtabula access.
          </p>

          <div className="stats">
            <div className="stat">
              <span>Location</span>
              <strong>{RIDGEVIEW.location}</strong>
            </div>
            <div className="stat">
              <span>Approval window</span>
              <strong>{RIDGEVIEW.approvalWindow}</strong>
            </div>
            <div className="stat">
              <span>Phone</span>
              <strong>{RIDGEVIEW.phone}</strong>
            </div>
          </div>

          <div className="input-card">
            <h3>Monthly budget</h3>
            <label>Maximum rent you want the summary to fit around</label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(+e.target.value)}
              placeholder="e.g., 1000"
            />
          </div>

          <div className="hero-actions">
            <button className="primary" onClick={analyze} disabled={loading}>
              {loading ? "Checking..." : "Check availability"}
            </button>
            <button
              className="ghost"
              onClick={() => window.open("tel:330-979-2410", "_self")}
              aria-label="Call Ridgeview Estates"
            >
              Call Ridgeview
            </button>
          </div>

          <div className="trust">
            {POLICIES.map((policy) => (
              <span key={policy}>{policy}</span>
            ))}
          </div>
        </div>
      </header>

      <section className="card">
        <div className="card-head">
          <div>
            <h2>Availability snapshot</h2>
            <p>Buyer-specific guidance for Ridgeview Estates, not a generic rental directory.</p>
          </div>
          <span className="pill">Ridgeview pack</span>
        </div>
        {error && <div className="error">⚠️ {error}</div>}
        {summary ? (
          <pre className="output">{summary}</pre>
        ) : (
          <div className="snapshot">
            <p className="snapshot-title">{RIDGEVIEW.tagline}</p>
            <p className="muted">
              Start with a budget to generate a practical, Ridgeview-specific availability summary and next-step
              CTA.
            </p>
          </div>
        )}
      </section>

      <section className="grid">
        {HIGHLIGHTS.map((item) => (
          <div className="tile" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </div>
        ))}
      </section>

      <section className="card policy-card">
        <div className="card-head">
          <div>
            <h2>Application details</h2>
            <p>Use the real process so the page feels credible and ready for a buyer pitch.</p>
          </div>
        </div>
        <div className="policy-grid">
          <div className="policy-item">
            <span>Fee</span>
            <strong>{RIDGEVIEW.applicationFee}</strong>
          </div>
          <div className="policy-item">
            <span>Timeline</span>
            <strong>{RIDGEVIEW.approvalWindow}</strong>
          </div>
          <div className="policy-item">
            <span>Deposit</span>
            <strong>{RIDGEVIEW.holdDeposit}</strong>
          </div>
          <div className="policy-item">
            <span>Standards</span>
            <strong>6 months rental history • no pets unless service animal</strong>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div>{RIDGEVIEW.name} • {RIDGEVIEW.tagline}</div>
        <div className="footer-sub">Ashtabula County • Quality, affordable living</div>
      </footer>
    </div>
  );
}

export default App;

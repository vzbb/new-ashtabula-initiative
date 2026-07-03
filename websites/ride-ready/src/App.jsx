import { useMemo, useState } from "react";
import "./App.css";

const ACTS = {
  name: "Ashtabula County Transportation System",
  shortName: "ACTS",
  phone: "440-992-4411",
  altPhone: "800-445-4140",
  programManager: "Carol Lennon",
  serviceAddress: "425 W. 24th St., Ashtabula, OH 44004",
  adminOffice: "2924 Donahoe Drive, Ashtabula, OH 44004",
  officeHours: "Monday-Friday 8am-4:30pm",
  routeHours: "Monday-Saturday 7am-5pm",
  demandResponseHours: "Monday-Friday 7am-5pm",
};

const RELIARIDE = {
  name: "ReliaRide Medical Transportation",
  tag: "Beyond the Ride",
  phone: "330-244-0657",
  since: 2007,
  ridesCompleted: "450,000+",
  avgReturn: "20 minutes",
};

const bookingModes = [
  {
    title: "Phone booking",
    description: "A friendly call-first flow for seniors who prefer to speak with a real person.",
  },
  {
    title: "Web booking",
    description: "A simple request form with accessibility preferences and caregiver notes.",
  },
  {
    title: "Caregiver portal",
    description: "Family members can book recurring rides and receive status updates on behalf of riders.",
  },
];

const needs = [
  "Wheelchair accessible rides",
  "Walker / assistance notes",
  "Medical appointment reminders",
  "Recurring ride scheduling",
];

const routeCards = [
  {
    label: "Service route hours",
    value: ACTS.routeHours,
    note: "Best for daily trips, errands, and local access.",
  },
  {
    label: "Demand response",
    value: ACTS.demandResponseHours,
    note: "Helpful for riders who need more direct pickup planning.",
  },
  {
    label: "Care promise",
    value: RELIARIDE.tag,
    note: "Heart-centered service framing for medical and accessibility rides.",
  },
];

const tonePoints = [
  "Large, simple interface for seniors",
  "High-contrast copy and clear labels",
  "ACTS-first branding with ReliaRide care cues",
];

const sampleSummary = [
  `• ${ACTS.shortName} can match riders to the right pickup window without forcing them to hunt through a confusing schedule.`,
  `• Include ${ACTS.programManager} and the direct booking number (${ACTS.phone}) so families know exactly who to call.`,
  `• Keep the messaging centered on accessibility, reliability, and medical-trip confidence for ${RELIARIDE.name}.`,
].join("\n");

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
  const message = errorOrResponse.message?.toLowerCase() || "";
  return (
    errorOrResponse.name === "TypeError" ||
    message.includes("fetch") ||
    message.includes("network") ||
    message.includes("failed to fetch") ||
    message.includes("timeout")
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

const BusIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="6" width="18" height="11" rx="3" />
    <path d="M6 17v2M18 17v2M5 10h14M5 13h4M15 13h4" />
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.8 8.5c0 4.5-8.8 11-8.8 11S3.2 13 3.2 8.5A4.5 4.5 0 0 1 7.7 4c1.7 0 3.2.9 4.3 2.3A5.5 5.5 0 0 1 16.3 4a4.5 4.5 0 0 1 4.5 4.5Z" />
    <path d="m9 11 2 2 4-4" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 3l7 3v6c0 4.8-3 7.9-7 9-4-1.1-7-4.2-7-9V6l7-3Z" />
    <path d="m9.5 12 1.7 1.7L15 10" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

function App() {
  const [from, setFrom] = useState("Downtown");
  const [to, setTo] = useState("Hospital");
  const [time, setTime] = useState("Now");
  const [accessibility, setAccessibility] = useState("Wheelchair access");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toneSummary = useMemo(
    () => `${ACTS.shortName} + ${RELIARIDE.name}: reliable, accessible ride coordination for Ashtabula County.`,
    [],
  );

  const lookup = async () => {
    setLoading(true);
    setError("");
    setAnswer("");
    try {
      const prompt = `Write a short, senior-friendly ride booking confirmation for Ashtabula County Transportation System (ACTS).
Use these real details only:
- ACTS phone: ${ACTS.phone}
- Alternate phone: ${ACTS.altPhone}
- Program manager: ${ACTS.programManager}
- Service address: ${ACTS.serviceAddress}
- Office hours: ${ACTS.officeHours}
- Route hours: ${ACTS.routeHours}
- Demand response hours: ${ACTS.demandResponseHours}
- Accessibility need: ${accessibility}
- Trip from: ${from}
- Trip to: ${to}
- Time: ${time}

Write exactly 3 short bullets and one short CTA. Keep it under 90 words. Make it caring, clear, and trust-building for seniors and caregivers.`;

      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
      setAnswer(text || sampleSummary);
    } catch (e) {
      setError(e.message || "Failed to generate.");
      setAnswer(sampleSummary);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark">
            <BusIcon />
          </div>
          <div>
            <div className="brand-name">{ACTS.shortName} Ride Ready</div>
            <div className="brand-sub">{ACTS.name} scheduling demo</div>
          </div>
        </div>
        <div className="meta-pill">ACTS + ReliaRide / Ashtabula County</div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">
            <ShieldIcon />
            <span>Senior-friendly ride scheduling</span>
          </div>
          <h1>Rides when you need them. Care in every mile.</h1>
          <p className="sub">
            Built for ACTS riders, caregivers, and medical-trip coordination, with ReliaRide-inspired trust
            cues that make booking feel safe, clear, and human.
          </p>

          <div className="stats">
            <div className="stat">
              <span>Primary contact</span>
              <strong>{ACTS.programManager}</strong>
            </div>
            <div className="stat">
              <span>Service line</span>
              <strong>{ACTS.phone} / {ACTS.altPhone}</strong>
            </div>
            <div className="stat">
              <span>Care brand cue</span>
              <strong>{RELIARIDE.tag}</strong>
            </div>
          </div>

          <div className="input-card">
            <h3>Ride details</h3>
            <p className="input-hint">Use simple language. The flow is designed for seniors and caregivers first.</p>
            <div className="form-grid">
              <div>
                <label htmlFor="from">From</label>
                <input id="from" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Downtown" />
              </div>
              <div>
                <label htmlFor="to">To</label>
                <input id="to" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Hospital" />
              </div>
              <div>
                <label htmlFor="time">Time</label>
                <input id="time" value={time} onChange={(e) => setTime(e.target.value)} placeholder="Now" />
              </div>
              <div>
                <label htmlFor="accessibility">Accessibility need</label>
                <select id="accessibility" value={accessibility} onChange={(e) => setAccessibility(e.target.value)}>
                  <option>Wheelchair access</option>
                  <option>Walker assistance</option>
                  <option>Caregiver escort</option>
                  <option>Medical appointment</option>
                </select>
              </div>
            </div>
          </div>

          <div className="hero-actions">
            <button className="primary" onClick={lookup} disabled={loading}>
              <ClockIcon />
              <span>{loading ? "Checking ride options..." : "Generate ride confirmation"}</span>
            </button>
            <a className="ghost" href={`tel:${ACTS.phone}`} aria-label="Call ACTS now">
              <span>Call {ACTS.shortName}</span>
            </a>
          </div>

          <div className="trust">
            {tonePoints.map((point) => (
              <span key={point}>
                <HeartIcon />
                <span>{point}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <div>
            <h2>Ride readiness snapshot</h2>
            <p>{toneSummary}</p>
          </div>
          <span className="pill">ACTS-first</span>
        </div>

        {error ? <div className="error">⚠️ {error}</div> : null}

        {answer ? (
          <pre className="output">{answer}</pre>
        ) : (
          <div className="snapshot">
            <p className="snapshot-title">{RELIARIDE.name}</p>
            <p className="muted">
              Start with a trip, time, and accessibility need to generate a simple confirmation tailored to the
              rider or caregiver.
            </p>
            <pre className="output output-sample">{sampleSummary}</pre>
          </div>
        )}
      </section>

      <section className="grid">
        {bookingModes.map((item) => (
          <article className="tile" key={item.title}>
            <div className="tile-icon">
              <HeartIcon />
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      <section className="card">
        <div className="card-head">
          <div>
            <h2>Operational cues</h2>
            <p>These are the details that make the pitch feel like a real county service, not a generic app.</p>
          </div>
        </div>

        <div className="policy-grid">
          {routeCards.map((item) => (
            <div className="policy-item" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="policy-card">
        <div className="card-head">
          <div>
            <h2>What this pass emphasizes</h2>
            <p>The brand is now ACTS-first, with ReliaRide-level care cues for high-trust transportation.</p>
          </div>
        </div>
        <div className="policy-grid policy-grid-tight">
          {needs.map((need) => (
            <div className="policy-item policy-item-compact" key={need}>
              <strong>{need}</strong>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div>{ACTS.shortName} • Ashtabula County Transportation System</div>
        <div className="footer-sub">
          {RELIARIDE.name} • {RELIARIDE.since} • {RELIARIDE.ridesCompleted} rides completed
        </div>
      </footer>
    </div>
  );
}

export default App;

import { useState } from "react";
import "./App.css";
import flawlessWordmark from "./assets/flawless-wordmark.png";
import flawlessOg from "./assets/flawless-og.png";

const API_CONFIG = {
  TIMEOUT_MS: 30000,
  MAX_RETRIES: 3,
  INITIAL_RETRY_DELAY_MS: 1000,
  MAX_RETRY_DELAY_MS: 10000,
  RATE_LIMIT_STATUS: 429,
  RETRYABLE_STATUS_CODES: [408, 429, 500, 502, 503, 504],
};

const packages = [
  {
    name: "Flawless Elite Coating",
    price: "$1,799-$2,099",
    summary: "Full exterior detail, one-step paint correction, and premium long-term ceramic protection.",
  },
  {
    name: "Ceramic Coating Consultation",
    price: "Custom quote",
    summary: "Best fit for owners comparing coating tiers, paint condition, and maintenance expectations.",
  },
  {
    name: "Deep Clean + Paint Enhancement",
    price: "From $799",
    summary: "For vehicles that need correction, gloss recovery, and a clear path to long-term protection.",
  },
];

const vehicleOptions = ["Coupe / Sedan", "SUV / Crossover", "Truck", "Performance / Exotic"];
const conditionOptions = [
  "Already well-kept, wants protection",
  "Light swirl marks and daily-use wear",
  "Needs correction before coating",
  "Unsure and wants expert guidance",
];

const trustPoints = [
  "20+ years of detailing experience",
  "9+ years of ceramic coating expertise",
  "Premium vehicle preservation for Northeast Ohio",
];

const differentiators = [
  {
    title: "Consultation-first booking",
    text: "Built for premium coating work where trust, prep, and vehicle condition matter more than grabbing the cheapest slot.",
  },
  {
    title: "Jonathan-style communication",
    text: "The confirmation flow is written to feel direct, confident, and expertise-driven instead of sounding like a generic auto shop.",
  },
  {
    title: "Higher-ticket service framing",
    text: "Elite coating, correction, and preservation packages are positioned as premium outcomes, not commodity detail add-ons.",
  },
];

const delay = (ms) => {
  const jitter = Math.random() * 200;
  return new Promise((resolve) => setTimeout(resolve, ms + jitter));
};

const getBackoffDelay = (retryCount) => {
  const exponentialDelay = API_CONFIG.INITIAL_RETRY_DELAY_MS * Math.pow(2, retryCount);
  return Math.min(exponentialDelay, API_CONFIG.MAX_RETRY_DELAY_MS);
};

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

      if (
        API_CONFIG.RETRYABLE_STATUS_CODES.includes(response.status) &&
        retryCount < API_CONFIG.MAX_RETRIES
      ) {
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

    return text.trim();
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

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 3l7 3v6c0 4.8-3 7.9-7 9-4-1.1-7-4.2-7-9V6l7-3Z" />
    <path d="m9.5 12 1.7 1.7L15 10" />
  </svg>
);

const SparkIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m12 3-1.8 5.2L5 10l5.2 1.8L12 17l1.8-5.2L19 10l-5.2-1.8Z" />
    <path d="M5 3v3M19 18v3M3 5h3M18 19h3" />
  </svg>
);

const CarIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 16h14l-1.2-5.1a2 2 0 0 0-1.9-1.5H8.1a2 2 0 0 0-1.9 1.5Z" />
    <circle cx="7.5" cy="17.5" r="1.5" />
    <circle cx="16.5" cy="17.5" r="1.5" />
    <path d="M3 16h2M19 16h2" />
  </svg>
);

function App() {
  const [selectedPackage, setSelectedPackage] = useState(packages[0].name);
  const [vehicleType, setVehicleType] = useState(vehicleOptions[1]);
  const [preferredDate, setPreferredDate] = useState("");
  const [paintCondition, setPaintCondition] = useState(conditionOptions[0]);
  const [notes, setNotes] = useState(
    "Black SUV, garage-kept, looking for long-term gloss and easier wash maintenance before summer.",
  );
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const sampleReply =
    "Thanks for reaching out to Flawless Coating & Detailing. Based on your vehicle and goals, the Flawless Elite Coating service looks like the right starting point. Jonathan will review your paint condition, confirm the best protection path, and make sure you understand exactly what prep, correction, and coating coverage your vehicle needs before locking in the appointment. If you send a few photos beforehand, we can make your consultation more precise and keep the process moving.";

  const generateReply = async () => {
    setLoading(true);
    setError("");
    setCopied(false);

    try {
      const prompt = `Write a premium booking confirmation for Flawless Coating & Detailing in Geneva, Ohio.

Business context:
- Brand voice: confident, expertise-driven, direct, premium
- Tagline: The Vehicle Preservation Experts
- Owner: Jonathan
- Focus: ceramic coatings, paint correction, exterior deep cleaning, long-term protection

Customer details:
- Package: ${selectedPackage}
- Vehicle type: ${vehicleType}
- Preferred date: ${preferredDate || "customer's requested date"}
- Paint condition: ${paintCondition}
- Notes: ${notes}

Requirements:
- Keep it under 120 words
- Sound like a high-end ceramic coating consultation confirmation
- Reinforce trust and expertise
- Suggest sending vehicle photos or mention paint-condition review
- Do not sound salesy or generic`;

      const text = await callGeminiAPI(prompt);
      setReply(text);
    } catch (e) {
      setError(e.message || "Failed to generate.");
      setReply("");
    } finally {
      setLoading(false);
    }
  };

  const copyReply = async () => {
    if (!reply) return;

    try {
      await navigator.clipboard.writeText(reply);
      setCopied(true);
    } catch {
      setError("Clipboard access is unavailable in this browser.");
    }
  };

  return (
    <div className="page-shell">
      <div className="page-grid">
        <section className="hero-panel">
          <div className="brand-row">
            <div>
              <p className="eyebrow">Flawless Coating & Detailing</p>
              <img
                className="brand-wordmark"
                src={flawlessWordmark}
                alt="Flawless Coating and Detailing"
              />
              <h1>The vehicle preservation experts, now with a premium online consultation flow.</h1>
            </div>
          </div>

          <p className="hero-copy">
            A buyer-specific booking demo for Flawless that treats ceramic coating as a trust-led,
            high-ticket preservation service, not a generic detail appointment.
          </p>

          <div className="trust-row">
            {trustPoints.map((item) => (
              <div className="trust-chip" key={item}>
                <ShieldIcon />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="package-stack">
            <div className="hero-image-card">
              <img
                className="hero-image"
                src={flawlessOg}
                alt="Flawless Coating & Detailing ceramic coating workspace"
              />
            </div>
            {packages.map((pkg) => (
              <article
                className={`package-card${selectedPackage === pkg.name ? " is-active" : ""}`}
                key={pkg.name}
              >
                <div className="package-head">
                  <h2>{pkg.name}</h2>
                  <span>{pkg.price}</span>
                </div>
                <p>{pkg.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="booking-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Premium intake</p>
              <h2>Build a consultation-ready confirmation.</h2>
            </div>
            <span className="status-pill">Northeast Ohio</span>
          </div>

          <div className="form-grid">
            <label className="field field-wide">
              <span>Service package</span>
              <select
                value={selectedPackage}
                onChange={(event) => setSelectedPackage(event.target.value)}
              >
                {packages.map((pkg) => (
                  <option key={pkg.name} value={pkg.name}>
                    {pkg.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Vehicle type</span>
              <select
                value={vehicleType}
                onChange={(event) => setVehicleType(event.target.value)}
              >
                {vehicleOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Preferred date</span>
              <input
                type="date"
                value={preferredDate}
                onChange={(event) => setPreferredDate(event.target.value)}
              />
            </label>

            <label className="field field-wide">
              <span>Paint condition</span>
              <select
                value={paintCondition}
                onChange={(event) => setPaintCondition(event.target.value)}
              >
                {conditionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="field field-wide">
              <span>Owner notes</span>
              <textarea
                rows="4"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Describe the vehicle, finish goals, current issues, or protection priorities."
              />
            </label>
          </div>

          <div className="prompt-card">
            <SparkIcon />
            <div>
              <strong>What makes this Flawless-specific</strong>
              <p>
                The confirmation emphasizes ceramic coating expertise, paint-condition review,
                and photo-led quoting instead of sounding like a basic wash reminder.
              </p>
            </div>
          </div>

          <div className="action-row">
            <button className="primary-button" onClick={generateReply} disabled={loading}>
              <CalendarIcon />
              <span>{loading ? "Writing premium reply..." : "Generate confirmation"}</span>
            </button>
            <button className="secondary-button" onClick={copyReply} disabled={!reply}>
              <SparkIcon />
              <span>{copied ? "Copied" : "Copy output"}</span>
            </button>
          </div>
        </section>
      </div>

      <section className="output-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Reply preview</p>
            <h2>What Jonathan could send after a high-value inquiry.</h2>
          </div>
          <span className="status-pill">Consultation tone</span>
        </div>

        {error ? <div className="error-banner">{error}</div> : null}

        <div className={`output-card${reply ? " has-output" : ""}`}>
          <p>{reply || sampleReply}</p>
        </div>
      </section>

      <section className="differentiator-grid">
        {differentiators.map((item) => (
          <article className="differentiator-card" key={item.title}>
            <div className="mini-icon">
              <CarIcon />
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <footer className="site-footer">
        <span>Flawless Coating & Detailing</span>
        <span>The Vehicle Preservation Experts</span>
        <span>Geneva, Ohio • serves Northeast Ohio</span>
      </footer>
    </div>
  );
}

export default App;

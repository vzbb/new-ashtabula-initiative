import { useState } from "react";
import "./App.css";

const ACAPL = {
  name: "Ashtabula County Animal Protective League",
  shortName: "ACAPL",
  mission:
    "Provide temporary homes for the parent-less pets of Ashtabula County until we can find them the best possible furever home.",
  values: ["Spay/neuter", "Responsible pet ownership", "Companion pet education"],
  programs: ["Adoption", "Foster", "Rescue", "Volunteer"],
  support: ["Monetary donations", "In-kind donations", "Sponsorships", "Amazon / Chewy wishlists"],
  serviceArea: "Ashtabula County, Ohio",
};

const HIGHLIGHTS = [
  {
    title: "Furever-home matching",
    copy: "Match pets with families based on lifestyle, home setup, and the kind of companion they can truly keep for life.",
  },
  {
    title: "Shelter-first workflow",
    copy: "Give ACAPL a clean way to show adoptable pets, manage foster paths, and route adoption interest without friction.",
  },
  {
    title: "Volunteer and support ready",
    copy: "Make it easy to back the shelter with donations, wishlists, and hands-on volunteer help.",
  },
];

const SAMPLE_PETS = [
  { name: "Milo", type: "Dog", note: "Playful young terrier mix who loves walks and social time." },
  { name: "Maple", type: "Cat", note: "Gentle adult cat who wants a calm, affectionate home." },
  { name: "Juniper", type: "Dog", note: "Family-friendly medium dog with a soft spot for yard time." },
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

const ACAPLMark = () => (
  <svg className="logo" viewBox="0 0 88 88" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="acaplGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ed8936" />
        <stop offset="100%" stopColor="#4a5568" />
      </linearGradient>
    </defs>
    <rect x="8" y="8" width="72" height="72" rx="22" fill="#fffaf0" stroke="url(#acaplGrad)" strokeWidth="3" />
    <path
      d="M24 42c0-7 5.5-13 12.5-13 3.9 0 7.3 1.8 9.5 4.7C48.2 30.8 51.6 29 55.5 29 62.5 29 68 35 68 42c0 13-12 20-24 28C36 62 24 55 24 42Z"
      fill="#ed8936"
      opacity="0.14"
    />
    <path
      d="M20 50c4.8-8.1 11-12.2 18-12.2 2.5 0 4.8.6 7 1.7 2.2-1.1 4.5-1.7 7-1.7 7 0 13.2 4.1 18 12.2"
      fill="none"
      stroke="#4a5568"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M35 48h18" stroke="#4a5568" strokeWidth="3.5" strokeLinecap="round" />
    <circle cx="44" cy="53" r="4.8" fill="#ed8936" />
    <circle cx="44" cy="53" r="1.6" fill="#fffaf0" />
  </svg>
);

const buildFallbackSummary = (petType, experience, yard) =>
  [
    `• ACAPL’s adoption flow works best for families who want a shelter-first match, not a random pet directory.`,
    `• Your selection leans toward ${petType === "any" ? "a flexible adoption search" : `${petType.toLowerCase()}-friendly matches`} and a ${yard} living setup.`,
    `• Good next step: ask ACAPL about pets in foster, adoption applications, and which animals fit your home and experience level (${experience}).`,
  ].join("\n");

function App() {
  const [formData, setFormData] = useState({
    petType: "any",
    size: "any",
    age: "any",
    temperament: "any",
    experience: "some",
    yard: "small",
    name: "",
    email: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setLoading(true);
    setError("");
    setSummary("");

    try {
      const prompt = `You are helping ACAPL in Ashtabula County, Ohio. Use only the real shelter cues below:
- Organization: ${ACAPL.name}
- Mission: ${ACAPL.mission}
- Values: ${ACAPL.values.join(", ")}
- Programs: ${ACAPL.programs.join(", ")}
- Support: ${ACAPL.support.join(", ")}
- Service area: ${ACAPL.serviceArea}

Write exactly 3 short bullets and 1 short CTA that sound like a compassionate shelter-first adoption matching summary for this user:
- pet type: ${formData.petType}
- size: ${formData.size}
- age: ${formData.age}
- temperament: ${formData.temperament}
- experience: ${formData.experience}
- yard: ${formData.yard}

Keep it warm, practical, and demo-ready. Under 90 words.`;

      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
      setSummary(text || buildFallbackSummary(formData.petType, formData.experience, formData.yard));
    } catch (err) {
      setError(err.message || "Failed to generate.");
      setSummary(buildFallbackSummary(formData.petType, formData.experience, formData.yard));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSubmitted(false);
    setSummary("");
    setError("");
  };

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand-lockup">
          <ACAPLMark />
          <div>
            <div className="brand-name">{ACAPL.shortName}</div>
            <div className="brand-sub">Find Your Furever Friend.</div>
          </div>
        </div>
        <div className="meta-pill">Ashtabula County • Shelter-first adoption matching</div>
      </header>

      <header className="hero">
        <div className="hero-content">
          <span className="eyebrow">Compassionate • Family-focused • Rescue-ready</span>
          <h1>Help good pets find the best possible furever home.</h1>
          <p className="sub">
            Built for the Ashtabula County Animal Protective League: a warm, practical matching experience for
            adopters, foster families, volunteers, and donors.
          </p>

          <div className="hero-grid">
            <div className="mission-card">
              <h3>Mission</h3>
              <p>{ACAPL.mission}</p>
            </div>
            <div className="mission-card">
              <h3>Programs</h3>
              <p>{ACAPL.programs.join(" • ")}</p>
              <p className="mini">Volunteer, rescue, foster, and adoption all in one flow.</p>
            </div>
          </div>

          <div className="trust">
            {ACAPL.values.map((value) => (
              <span key={value}>{value}</span>
            ))}
          </div>
        </div>
      </header>

      <section className="card">
        <div className="card-head">
          <div>
            <h2>Adoption match profile</h2>
            <p>Tailor the guidance to the adopter’s real home setup so the page feels shelter-ready, not generic.</p>
          </div>
          <span className="pill">ACAPL pack</span>
        </div>

        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-row two-col">
            <label>
              <span>Pet Type</span>
              <select name="petType" value={formData.petType} onChange={handleChange}>
                <option value="any">Any</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label>
              <span>Size Preference</span>
              <select name="size" value={formData.size} onChange={handleChange}>
                <option value="any">Any Size</option>
                <option value="small">Small (under 25 lbs)</option>
                <option value="medium">Medium (25-60 lbs)</option>
                <option value="large">Large (over 60 lbs)</option>
              </select>
            </label>
          </div>

          <div className="form-row two-col">
            <label>
              <span>Age Preference</span>
              <select name="age" value={formData.age} onChange={handleChange}>
                <option value="any">Any Age</option>
                <option value="baby">Baby (under 1 year)</option>
                <option value="young">Young (1-3 years)</option>
                <option value="adult">Adult (3-8 years)</option>
                <option value="senior">Senior (8+ years)</option>
              </select>
            </label>
            <label>
              <span>Temperament</span>
              <select name="temperament" value={formData.temperament} onChange={handleChange}>
                <option value="any">Any</option>
                <option value="calm">Calm & Gentle</option>
                <option value="active">Active & Playful</option>
                <option value="social">Social & Friendly</option>
                <option value="shy">Shy / Needs time</option>
              </select>
            </label>
          </div>

          <div className="form-row two-col">
            <label>
              <span>Your Experience</span>
              <select name="experience" value={formData.experience} onChange={handleChange}>
                <option value="first">First-time owner</option>
                <option value="some">Some experience</option>
                <option value="experienced">Very experienced</option>
              </select>
            </label>
            <label>
              <span>Living Space</span>
              <select name="yard" value={formData.yard} onChange={handleChange}>
                <option value="apartment">Apartment</option>
                <option value="small">Small yard</option>
                <option value="large">Large yard</option>
                <option value="acreage">Acreage / Farm</option>
              </select>
            </label>
          </div>

          <div className="form-row two-col">
            <label>
              <span>Your Name *</span>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full name" required />
            </label>
            <label>
              <span>Email *</span>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />
            </label>
          </div>

          <div className="form-row">
            <label>
              <span>Phone *</span>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="(440) 555-0123" required />
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary" disabled={loading}>
              {loading ? "Matching..." : "Find My Match"}
            </button>
            <button type="button" className="ghost" onClick={reset}>
              Start Over
            </button>
          </div>
        </form>
      </section>

      {submitted ? (
        <section className="result-card">
          <div className="card-head">
            <div>
              <h2>Adoption guidance</h2>
              <p>Warm, practical next steps for ACAPL families.</p>
            </div>
            <span className="pill">Demo-ready</span>
          </div>

          {error && <div className="error">⚠️ {error}</div>}
          {summary ? <pre className="output">{summary}</pre> : <p className="muted">Preparing your match guidance...</p>}

          <div className="pet-preview">
            <h3>Featured pets you might love</h3>
            <div className="pet-grid">
              {SAMPLE_PETS.map((pet) => (
                <article key={pet.name} className="pet-card">
                  <div className="pet-badge">{pet.type}</div>
                  <strong>{pet.name}</strong>
                  <p>{pet.note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="grid">
        {HIGHLIGHTS.map((item) => (
          <div className="tile" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </div>
        ))}
      </section>

      <section className="card support-card">
        <div className="card-head">
          <div>
            <h2>Ways to help ACAPL</h2>
            <p>Give supporters a clear path to take action instead of just browsing pets.</p>
          </div>
        </div>

        <div className="support-grid">
          {ACAPL.support.map((item) => (
            <div className="support-item" key={item}>
              {item}
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div>{ACAPL.name} • Find Your Furever Friend.</div>
        <div className="footer-sub">{ACAPL.serviceArea}</div>
      </footer>
    </div>
  );
}

export default App;

import { useState } from "react";
import "./App.css";
import pipeIcon from "./assets/pipecreative-icon.png";
import pipeOg from "./assets/pipecreative-og-large.png";

const API_CONFIG = {
  TIMEOUT_MS: 30000,
  MAX_RETRIES: 3,
  INITIAL_RETRY_DELAY_MS: 1000,
  MAX_RETRY_DELAY_MS: 10000,
  RATE_LIMIT_STATUS: 429,
  RETRYABLE_STATUS_CODES: [408, 429, 500, 502, 503, 504],
};

const serviceOptions = [
  "Video Production",
  "Branding & Strategy",
  "Web & Digital",
  "Campaign Creative",
];

const toneOptions = [
  "Confident and strategic",
  "Warm and story-driven",
  "Polished and executive-ready",
  "Bold and creative",
];

const featuredWork = [
  {
    client: "Leadership Ashtabula County",
    discipline: "Full-Scope Marketing",
    summary:
      "Position a local leadership brand with a tighter story, stronger visuals, and a case study that reads like momentum instead of a project recap.",
  },
  {
    client: "Lawrence School",
    discipline: "Video + Print + Advertising",
    summary:
      "Translate a multi-channel engagement into a concise narrative that explains concept, execution, and why the creative landed with the right audience.",
  },
  {
    client: "NEO Fund",
    discipline: "Digital + Web Design",
    summary:
      "Frame the work as a sharp digital story: what problem the team solved, how the experience was shaped, and what confidence it gave the client.",
  },
];

const proofPoints = [
  "Built for agencies balancing video, brand, web, and campaign work",
  "Shaped around PIPE!'s storytelling-with-intent positioning",
  "Built to help PIPE! go above and beyond without adding copywriting drag",
];

const outcomeBullets = [
  "Concept and creative angle",
  "Execution across channels",
  "Outcome language clients actually understand",
];

const delay = (ms) => {
  const jitter = Math.random() * 200;
  return new Promise((resolve) => setTimeout(resolve, ms + jitter));
};

const getBackoffDelay = (retryCount) => {
  const exponentialDelay =
    API_CONFIG.INITIAL_RETRY_DELAY_MS * Math.pow(2, retryCount);
  return Math.min(exponentialDelay, API_CONFIG.MAX_RETRY_DELAY_MS);
};

const fetchWithTimeout = async (
  url,
  options = {},
  timeoutMs = API_CONFIG.TIMEOUT_MS,
) => {
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
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
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

const SparkArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 19L19 4" />
    <path d="M9 4h10v10" />
    <path d="M5.5 7.5l2 1.1 1.1 2 1.1-2 2-1.1-2-1.1-1.1-2-1.1 2z" />
  </svg>
);

const StoryGridIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="3" width="8" height="8" rx="2" />
    <rect x="13" y="3" width="8" height="5" rx="2" />
    <rect x="13" y="10" width="8" height="11" rx="2" />
    <rect x="3" y="13" width="8" height="8" rx="2" />
  </svg>
);

const CopyDeckIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
    <path d="M12 13h5" />
    <path d="M12 16h5" />
  </svg>
);

function App() {
  const [project, setProject] = useState(
    "Campaign launch for a regional nonprofit combining documentary video, social cutdowns, landing page design, and donor messaging.",
  );
  const [serviceLine, setServiceLine] = useState(serviceOptions[0]);
  const [tone, setTone] = useState(toneOptions[0]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const sampleOutput =
    "PIPE! Creative partnered with the client to turn a complex campaign into a clear visual story. The team combined strategic messaging, cinematic production, and digital design to create a cohesive experience across every touchpoint. The result was a portfolio-ready piece that highlights not just what was delivered, but why the work resonated with the audience and advanced the client's goals.";

  const generateDescription = async () => {
    setLoading(true);
    setError("");
    setCopied(false);

    try {
      const prompt = `You are writing portfolio copy for PIPE! Creative, a Northeast Ohio creative agency whose voice is bold, strategic, and rooted in storytelling with intent.

Write one polished portfolio description under 120 words.

Project summary: ${project}
Service line: ${serviceLine}
Desired tone: ${tone}

Requirements:
- Sound like premium case-study copy for a creative agency
- Explain the concept, execution, and outcome
- Avoid filler, hype, or bullet points
- Make the work feel intentional, client-facing, and pitch-ready`;

      const text = await callGeminiAPI(prompt);
      setDescription(text);
    } catch (e) {
      setError(e.message || "Failed to generate.");
      setDescription("");
    } finally {
      setLoading(false);
    }
  };

  const copyDescription = async () => {
    if (!description) {
      return;
    }

    try {
      await navigator.clipboard.writeText(description);
      setCopied(true);
    } catch {
      setError("Clipboard access is unavailable in this browser.");
    }
  };

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-topbar">
          <div className="brand-lockup">
            <img className="logo" src={pipeIcon} alt="PIPE! Creative icon" />
            <div>
              <p className="brand-kicker">PIPE! Creative demo</p>
              <h1>Portfolio descriptions built for storytelling with intent.</h1>
            </div>
          </div>
          <span className="status-pill">Pitch-ready for `/portfolio/`</span>
        </div>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="lead">
              A branded concept for PIPE! Creative that turns video, web, branding,
              and campaign work into case-study copy that sounds strategic instead
              of generic.
            </p>

            <div className="proof-list">
              {proofPoints.map((point) => (
                <div className="proof-item" key={point}>
                  <span className="proof-dot" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="mini-metrics">
              <div>
                <strong>4</strong>
                <span>service-line templates</span>
              </div>
              <div>
                <strong>3</strong>
                <span>case-study moves in every draft</span>
              </div>
              <div>
                <strong>1</strong>
                <span>voice: bold, clear, intentional</span>
              </div>
            </div>
          </div>

          <div className="showcase-panel">
            <div className="panel-label">Featured work types</div>
            <div className="brand-art-card">
              <img
                className="brand-art"
                src={pipeOg}
                alt="PIPE! Creative brand artwork"
              />
            </div>
            {featuredWork.map((item) => (
              <article className="showcase-card" key={item.client}>
                <div className="showcase-head">
                  <h2>{item.client}</h2>
                  <span>{item.discipline}</span>
                </div>
                <p>{item.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="workspace">
        <div className="workspace-head">
          <div>
            <p className="section-kicker">PIPE! portfolio generator</p>
            <h2>Turn raw project notes into polished case-study language.</h2>
          </div>
          <div className="outcome-list">
            {outcomeBullets.map((bullet) => (
              <span key={bullet}>{bullet}</span>
            ))}
          </div>
        </div>

        <div className="form-grid">
          <label className="field field-wide">
            <span>Project summary</span>
            <textarea
              value={project}
              onChange={(event) => setProject(event.target.value)}
              placeholder="Describe the engagement, deliverables, and what made the work matter."
              rows="5"
            />
          </label>

          <label className="field">
            <span>Service line</span>
            <select
              value={serviceLine}
              onChange={(event) => setServiceLine(event.target.value)}
            >
              {serviceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Tone</span>
            <select value={tone} onChange={(event) => setTone(event.target.value)}>
              {toneOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="action-row">
          <button className="primary-button" onClick={generateDescription} disabled={loading}>
            <SparkArrowIcon />
            <span>{loading ? "Writing case-study copy..." : "Generate description"}</span>
          </button>
          <button
            className="secondary-button"
            onClick={copyDescription}
            disabled={!description}
          >
            <CopyDeckIcon />
            <span>{copied ? "Copied" : "Copy output"}</span>
          </button>
        </div>

        {error ? <div className="error-banner">{error}</div> : null}

        <div className="output-shell">
          <div className="output-head">
            <div>
              <p className="section-kicker">Generated case study</p>
              <h3>What PIPE! could paste into a portfolio page today</h3>
            </div>
            <span className="output-pill">{tone}</span>
          </div>

          <div className={`output-card${description ? " has-output" : ""}`}>
            <p>{description || sampleOutput}</p>
          </div>
        </div>
      </section>

      <section className="capabilities">
        <article className="capability-tile">
          <StoryGridIcon />
          <h3>Agency-aware structure</h3>
          <p>
            Writes like a creative team describing strategic work, not a generic
            AI summary.
          </p>
        </article>
        <article className="capability-tile">
          <SparkArrowIcon />
          <h3>Faster pitch prep</h3>
          <p>
            Helps PIPE! move from project notes to proposal decks, portfolio pages,
            and polished recaps quickly.
          </p>
        </article>
        <article className="capability-tile">
          <CopyDeckIcon />
          <h3>Copy-ready output</h3>
          <p>
            Built for websites, one-pagers, and award-style case studies with a
            clear concept-execution-outcome arc.
          </p>
        </article>
      </section>

      <footer className="footer">
        <span>PIPE! Creative</span>
        <span>More Than Marketing. It&apos;s Storytelling with Intent.</span>
        <span>Ashtabula-ready portfolio demo</span>
      </footer>
    </div>
  );
}

export default App;

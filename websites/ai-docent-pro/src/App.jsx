import { useState } from "react";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const museumZones = [
  "Harbor Gallery",
  "Shipwreck Exhibit",
  "Engine Room Collection",
  "Freighter Timeline",
  "Volunteer Archive Desk",
];

const audienceModes = [
  "General visitors",
  "Families with children",
  "Field trip students",
  "History enthusiasts",
];

const fallbackNarration = ({ artifact, zone, audience, duration }) => {
  const cleanedArtifact = artifact.trim() || "maritime artifact";
  return `Narration:
Welcome to the ${zone} at the Ashtabula County Historical Society. This ${cleanedArtifact} helps tell the story of a working Great Lakes harbor where ship crews, dock workers, and local families depended on maritime trade every day. In this quick ${duration}-minute stop, we explain what the object was used for, how it connects to harbor life, and why it mattered to people who worked along Walnut Boulevard and the Ashtabula River. This version is tuned for ${audience.toLowerCase()}, so the story stays clear, vivid, and easy to follow during a self-guided visit.

Tags: Ashtabula Harbor, Great Lakes history, maritime museum, self-guided tour, ACHS`;
};

const callGeminiAPI = async (prompt) => {
  if (!apiKey) return null;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
};

const AudioIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
    <path d="M19 5a10 10 0 0 1 0 14" />
  </svg>
);

const MuseumIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18" />
    <path d="M4 10h16" />
    <path d="M6 21V10" />
    <path d="M10 21V10" />
    <path d="M14 21V10" />
    <path d="M18 21V10" />
    <path d="M12 3 3 7v3h18V7l-9-4Z" />
  </svg>
);

const RouteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="19" r="3" />
    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7H8a4 4 0 0 1 0-8h10" />
    <circle cx="18" cy="5" r="3" />
  </svg>
);

function App() {
  const [artifact, setArtifact] = useState("");
  const [zone, setZone] = useState(museumZones[0]);
  const [audience, setAudience] = useState(audienceModes[0]);
  const [duration, setDuration] = useState("2");
  const [story, setStory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const generateNarration = async () => {
    setLoading(true);
    setError("");

    const prompt = `You are the Ashtabula County Historical Society's AI museum docent. Write a concise, accurate museum-ready audio guide for a self-guided visitor.

Artifact: ${artifact}
Zone: ${zone}
Audience: ${audience}
Tour stop length: ${duration} minutes

Requirements:
- 110 to 140 words
- mention the Ashtabula harbor or Great Lakes context naturally
- sound welcoming, factual, and ready for spoken narration
- end with 5 comma-separated tags
- format exactly as:
Narration:
...

Tags: tag1, tag2, tag3, tag4, tag5`;

    try {
      const text = await callGeminiAPI(prompt);
      if (text) {
        setStory(text);
      } else {
        setStory(fallbackNarration({ artifact, zone, audience, duration }));
      }
    } catch (apiError) {
      setStory(fallbackNarration({ artifact, zone, audience, duration }));
      setError(
        "Live museum AI is unavailable right now, so the demo switched to a local ACHS fallback narration."
      );
      console.error("AI Docent Pro API error:", apiError);
    } finally {
      setLoading(false);
    }
  };

  const toggleSpeech = () => {
    if (!story || !("speechSynthesis" in window)) {
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const narrationOnly = story.split("Tags:")[0].replace("Narration:", "").trim();
    const utterance = new SpeechSynthesisUtterance(narrationOnly);
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="app-container">
      <div className="bg-pattern" />

      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">
              <MuseumIcon />
            </div>
            <div>
              <div className="logo-text">AI Docent</div>
              <p className="logo-subtitle">Ashtabula County Historical Society</p>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="content-wrapper">
          <section className="hero">
            <p className="hero-eyebrow">Self-Guided Museum Audio</p>
            <h1 className="hero-title">Turn every historic stop into a guided harbor story.</h1>
            <p className="hero-subtitle">
              A demo-ready ACHS docent tool for museum rooms, pop-up exhibits, and QR-linked
              historic-site tours across Ashtabula.
            </p>
            <div className="separator" />
            <div className="hero-trust">
              <span><AudioIcon /> Audio-ready narration</span>
              <span><MuseumIcon /> ACHS-branded exhibit flow</span>
              <span><RouteIcon /> Works for museum rooms or historic stops</span>
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Build a tour stop</h2>
              <span className="badge">Museum Pilot</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="artifact">Artifact or site description</label>
              <textarea
                id="artifact"
                className="form-textarea"
                value={artifact}
                onChange={(event) => setArtifact(event.target.value)}
                placeholder="Example: Brass engine telegraph used on Great Lakes freighters docking in Ashtabula Harbor."
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="zone">Museum zone</label>
              <select
                id="zone"
                className="form-select"
                value={zone}
                onChange={(event) => setZone(event.target.value)}
              >
                {museumZones.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="audience">Audience mode</label>
                <select
                  id="audience"
                  className="form-select"
                  value={audience}
                  onChange={(event) => setAudience(event.target.value)}
                >
                  {audienceModes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="duration">Stop length</label>
                <select
                  id="duration"
                  className="form-select"
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                >
                  <option value="1">1 minute</option>
                  <option value="2">2 minutes</option>
                  <option value="3">3 minutes</option>
                </select>
              </div>
            </div>

            <div className="action-row">
              <button
                className={`btn btn-primary${loading ? " is-loading" : ""}`}
                type="button"
                onClick={generateNarration}
                disabled={loading || !artifact.trim()}
              >
                {loading ? (
                  <span className="btn-loading-content">
                    <span className="btn-loading-dots">
                      <span className="dot" /><span className="dot" /><span className="dot" />
                    </span>
                    Generating guide
                  </span>
                ) : "Generate Museum Narration"}
              </button>
              <button className="btn btn-secondary" type="button" onClick={toggleSpeech} disabled={!story}>
                {speaking ? "Stop Audio" : "Play Audio Preview"}
              </button>
            </div>

            <div className="info-list">
              <div className="info-item">
                <strong>Visitor flow:</strong> Scan, listen, and explore without waiting for a docent.
              </div>
              <div className="info-item">
                <strong>Staff value:</strong> Standardizes stories for volunteers, tours, and school groups.
              </div>
              <div className="info-item">
                <strong>Expansion path:</strong> Ready for QR codes at museum rooms, harbor markers, and historic sites.
              </div>
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Pilot framing</h2>
              <span className="badge">ACHS</span>
            </div>
            <div className="pilot-panel">
              <p>
                This pass is framed for the Ashtabula County Historical Society as a self-guided
                museum and historic-site companion, not a generic AI content widget.
              </p>
              <ul className="pilot-points">
                <li>Supports volunteer docents with consistent, visitor-ready narration.</li>
                <li>Fits museum rooms today and outdoor historic markers later.</li>
                <li>Provides an audio-first experience for families, travelers, and school groups.</li>
              </ul>
            </div>
          </section>

          <div className={`output-section${loading ? " is-loading" : ""}`}>
            <div className="output-header">
              <h2 className="output-title">Narration output</h2>
              <span className="badge">{apiKey ? "Live AI + fallback" : "Local demo fallback"}</span>
            </div>
            {error ? <div className="message message-error">{error}</div> : null}
            {story ? (
              <pre className="output animate-in">{story}</pre>
            ) : (
              <div className="output placeholder-output">
                Narration appears here once a museum stop is generated.
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="footer">
        <p className="footer-text">
          Ashtabula County Historical Society • Museum docent pilot for self-guided harbor history
        </p>
      </footer>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const API_CONFIG = {
  TIMEOUT_MS: 30000,
  MAX_RETRIES: 3,
  INITIAL_RETRY_DELAY_MS: 1000,
  RETRYABLE_STATUS_CODES: [408, 429, 500, 502, 503, 504],
};

const HISTORICAL_FIGURES = [
  {
    id: "keeper",
    name: "Keeper Frank Hall",
    era: "1890s",
    role: "Harbor Light Keeper",
    greeting:
      "Evening, visitor. I'm Keeper Frank Hall, keeping watch over fog, freight, and hard weather along Ashtabula's harbor edge.",
  },
  {
    id: "jennie",
    name: "Jennie Munger Gregory",
    era: "19th century",
    role: "County Storykeeper",
    greeting:
      "Welcome in. I'm Jennie Munger Gregory, and I believe every road, farmhouse, and lakefront corner in this county has a memory worth preserving.",
  },
  {
    id: "dockworker",
    name: "Big Mike Dvorak",
    era: "1920s",
    role: "Dock Worker",
    greeting:
      "You made it to the waterfront, friend. I'm Big Mike Dvorak, and I can still hear ore buckets, whistles, and train cars in the back of my mind.",
  },
  {
    id: "builder",
    name: "Gus Weatherby",
    era: "1860s",
    role: "Rail Engineer",
    greeting:
      "Glad you stopped. I'm Gus Weatherby, one of the railroad men who helped turn this county into a crossroads for labor, shipping, and change.",
  },
];

const LANDMARKS = [
  {
    id: "harbor",
    name: "Ashtabula Harbor",
    lat: 41.89,
    lng: -80.79,
    description: "the harbor district, ore docks, and lighthouse corridor",
  },
  {
    id: "bridge-street",
    name: "Bridge Street",
    lat: 41.86,
    lng: -80.78,
    description: "historic Bridge Street and the working waterfront around it",
  },
  {
    id: "museum",
    name: "Maritime Museum",
    lat: 41.89,
    lng: -80.79,
    description:
      "the Maritime Museum exhibits, pilothouse stories, and lifesaving service history",
  },
  {
    id: "smolen",
    name: "Smolen-Gulf Bridge",
    lat: 41.85,
    lng: -80.74,
    description:
      "the covered bridge corridor and the pioneer-era routes that shaped the county",
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms + Math.random() * 200));

async function callGeminiAPI(prompt, model = "gemini-1.5-flash", retryCount = 0) {
  if (!apiKey) {
    throw new Error("API key not configured.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (
        API_CONFIG.RETRYABLE_STATUS_CODES.includes(response.status) &&
        retryCount < API_CONFIG.MAX_RETRIES
      ) {
        await delay(API_CONFIG.INITIAL_RETRY_DELAY_MS * 2 ** retryCount);
        return callGeminiAPI(prompt, model, retryCount + 1);
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (error) {
    clearTimeout(timeoutId);
    if (retryCount < API_CONFIG.MAX_RETRIES) {
      await delay(API_CONFIG.INITIAL_RETRY_DELAY_MS * 2 ** retryCount);
      return callGeminiAPI(prompt, model, retryCount + 1);
    }
    throw error;
  }
}

function fallbackNarration(figure, topic) {
  const subject = topic || "Ashtabula County";
  return `${figure.greeting}

${subject} is exactly the kind of place Historian Pro is built for: somewhere a visitor can stop, look around, and immediately understand the people, labor, and turning points that shaped the county. Through the Ashtabula County Historical Society, this prototype turns a street corner, museum exhibit, dock wall, or bridge overlook into a guided history moment. Keep walking, and the next story is usually closer than you think.`;
}

function App() {
  const [topic, setTopic] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nearestLandmark, setNearestLandmark] = useState(null);
  const [selectedFigure, setSelectedFigure] = useState(HISTORICAL_FIGURES[0]);
  const [showVisitModal, setShowVisitModal] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        let nearest = null;
        let minDistance = Infinity;

        for (const landmark of LANDMARKS) {
          const distance = Math.sqrt(
            (landmark.lat - userLocation.lat) ** 2 +
              (landmark.lng - userLocation.lng) ** 2,
          );
          if (distance < minDistance) {
            minDistance = distance;
            nearest = landmark;
          }
        }

        if (nearest && minDistance < 0.15) {
          setNearestLandmark(nearest);
          setTopic(nearest.description);
        }
      },
      () => {
        setError("Location is optional here. You can still type any county landmark or neighborhood.");
      },
    );
  }, []);

  async function generateStory() {
    setLoading(true);
    setError("");
    setStory("");

    const currentTopic = topic || "Ashtabula County";
    const prompt = `${selectedFigure.greeting}

Tell a first-person local-history story about "${currentTopic}" in Ashtabula County.
Make it grounded, visitor-friendly, and connected to the Ashtabula County Historical Society's mission of helping people discover history wherever they are in the city.
End with a short invitation to keep exploring nearby.
Stay in character as ${selectedFigure.name}, a ${selectedFigure.role}.
Keep it between 90 and 130 words.`;

    try {
      const text = apiKey
        ? await callGeminiAPI(prompt)
        : fallbackNarration(selectedFigure, currentTopic);
      setStory(text);
      if (!apiKey) {
        setError("Live narration is offline, so this preview is using a built-in historical fallback.");
      }
    } catch {
      setError("Live narration is unavailable right now, so we loaded the local historical preview instead.");
      setStory(fallbackNarration(selectedFigure, currentTopic));
    } finally {
      setLoading(false);
    }
  }

  function playAudio() {
    if (!story || !window.speechSynthesis) {
      return;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(story));
  }

  return (
    <div className="page">
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Historian Pro · Ashtabula County Historical Society</p>
          <h1>Turn any stop in the city into a guided history moment</h1>
          <p className="sub">
            A citywide history explorer for streets, museums, harbor landmarks, and hidden stories that deserve more than a plaque.
          </p>

          {nearestLandmark && (
            <div className="location-badge">Near you now: {nearestLandmark.name}</div>
          )}

          <div className="hero-actions">
            <button className="primary" onClick={generateStory} disabled={loading}>
              {loading ? "Searching the archives..." : "Hear This Place"}
            </button>
            <button className="ghost" onClick={() => setShowVisitModal(true)}>
              Plan a Visit
            </button>
          </div>

          <div className="trust">
            <span>citywide location prompts</span>
            <span>persona-led narration</span>
            <span>museum-to-street discovery</span>
          </div>
        </div>

        <div className="hero-card">
          <h3>Choose a Historical Voice</h3>
          <select
            className="figure-select"
            value={selectedFigure.id}
            onChange={(event) =>
              setSelectedFigure(
                HISTORICAL_FIGURES.find((figure) => figure.id === event.target.value),
              )
            }
          >
            {HISTORICAL_FIGURES.map((figure) => (
              <option key={figure.id} value={figure.id}>
                {figure.name} · {figure.role}
              </option>
            ))}
          </select>

          <div className="figure-preview">
            <div className="figure-avatar">{selectedFigure.name[0]}</div>
            <div className="figure-info">
              <strong>{selectedFigure.name}</strong>
              <span>
                {selectedFigure.era} · {selectedFigure.role}
              </span>
            </div>
          </div>

          <h3 className="field-title">Explore a Place</h3>
          <input
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Bridge Street, harbor rail yards, lighthouse, academy..."
          />
        </div>
      </header>

      <section className="card">
        <div className="card-head">
          <h2>Historical Narration Preview</h2>
          <span className="pill">{selectedFigure.name}</span>
        </div>
        {error && <div className="error">{error}</div>}

        {story ? (
          <div className="story-output">
            <div className="story-header">
              <span className="story-speaker">{selectedFigure.name}</span>
              <span className="story-era">{selectedFigure.era}</span>
            </div>
            <div className="story-text">{story}</div>
            <div className="story-actions">
              <button className="btn-small" onClick={playAudio}>
                Play Audio
              </button>
              <button className="btn-small btn-muted" onClick={generateStory}>
                Generate Again
              </button>
            </div>
          </div>
        ) : (
          <div className="placeholder">
            <p>Your guide will appear here.</p>
            <p className="hint">
              Type any county landmark or use your location to preview how Historian Pro would narrate the area.
            </p>
          </div>
        )}
      </section>

      <section className="grid">
        <div className="tile">
          <h3>Street-level discovery</h3>
          <p>Built for the moment someone asks, “What happened here?” while standing in the city.</p>
        </div>
        <div className="tile">
          <h3>Historical Society fit</h3>
          <p>Supports volunteer-run storytelling without requiring a dedicated audio-guide fleet or docent at every stop.</p>
        </div>
        <div className="tile">
          <h3>Photo-first future</h3>
          <p>This pro version naturally grows into a “take a picture, get the backstory” citywide explorer.</p>
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h2>Why It Works for ACHS</h2>
          <span className="pill">Pitch-ready</span>
        </div>
        <div className="grid pitch-grid">
          <div className="tile">
            <h3>Harbor to farmhouse</h3>
            <p>The same product can explain a dock wall, a pioneer property, a bridge corridor, or a museum object.</p>
          </div>
          <div className="tile">
            <h3>Visitor-ready fallback</h3>
            <p>Even when live AI is offline, the demo still proves the user flow and storytelling promise.</p>
          </div>
          <div className="tile">
            <h3>Tourism + education</h3>
            <p>Families, researchers, and day-trippers all get a lighter, more discoverable way into county history.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <strong>Ashtabula County Historical Society</strong>
        <div>Prototype for citywide historical interpretation, museum storytelling, and place-based local discovery.</div>
        <div className="footer-note">
          Designed as a countywide history explorer rather than a single-site museum audio guide.
        </div>
      </footer>

      {showVisitModal && (
        <div className="modal-overlay" onClick={() => setShowVisitModal(false)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowVisitModal(false)}>
              ×
            </button>
            <h3>Plan a History Visit</h3>
            <div className="ticket-options">
              <div className="ticket-option">
                <span>Historical Society properties</span>
                <strong>citywide</strong>
              </div>
              <div className="ticket-option">
                <span>Harbor and lighthouse history</span>
                <strong>walkable</strong>
              </div>
              <div className="ticket-option">
                <span>Museum + field pairing</span>
                <strong>best fit</strong>
              </div>
            </div>
            <button className="primary full" onClick={() => setShowVisitModal(false)}>
              Back to Explorer
            </button>
            <p className="modal-note">
              Historian Pro is designed to send visitors from streets and landmarks back into deeper county history experiences.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

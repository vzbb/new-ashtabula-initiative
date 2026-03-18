import { useState, useEffect } from "react";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// === NAI API Client ===
const API_CONFIG = {
  TIMEOUT_MS: 30000,
  MAX_RETRIES: 3,
  INITIAL_RETRY_DELAY_MS: 1000,
  MAX_RETRY_DELAY_MS: 10000,
  RETRYABLE_STATUS_CODES: [408, 429, 500, 502, 503, 504],
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms + Math.random() * 200));

const callGeminiAPI = async (prompt, model = 'gemini-1.5-flash', retryCount = 0) => {
  if (!apiKey) throw new Error('API key not configured.');
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (API_CONFIG.RETRYABLE_STATUS_CODES.includes(response.status) && retryCount < API_CONFIG.MAX_RETRIES) {
        await delay(API_CONFIG.INITIAL_RETRY_DELAY_MS * Math.pow(2, retryCount));
        return callGeminiAPI(prompt, model, retryCount + 1);
      }
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error) {
    clearTimeout(timeoutId);
    if (retryCount < API_CONFIG.MAX_RETRIES) {
      await delay(API_CONFIG.INITIAL_RETRY_DELAY_MS * Math.pow(2, retryCount));
      return callGeminiAPI(prompt, model, retryCount + 1);
    }
    throw error;
  }
};

// Historical figures for Ashtabula
const HISTORICAL_FIGURES = [
  { id: 'lighthouse_keeper', name: 'Captain Thomas', era: '1870s', role: 'Lighthouse Keeper', 
    greeting: "Ahoy there! I'm Captain Thomas, keeper of the Ashtabula light since 1874." },
  { id: 'dock_worker', name: 'Big Mike', era: '1920s', role: 'Dock Worker', 
    greeting: "Hey there, friend! I'm Big Mike. Worked these docks since the roaring twenties." },
  { id: 'ship_captain', name: 'Captain Sarah Blackwood', era: '1890s', role: 'Great Lakes Captain', 
    greeting: "Greetings, traveler. I'm Captain Blackwood. I've sailed these waters for thirty years." },
  { id: 'bridge_builder', name: 'Gus the Builder', era: '1860s', role: 'Railroad Engineer', 
    greeting: "Well hello! I'm Gus. Me and my crew built the railroad bridge that changed everything." }
];

// Ashtabula landmarks with coordinates
const LANDMARKS = [
  { id: 'harbor', name: 'Ashtabula Harbor', lat: 41.89, lng: -80.79, 
    description: 'Historic port and lighthouse district' },
  { id: 'bridge_street', name: 'Bridge Street', lat: 41.86, lng: -80.78, 
    description: 'Historic downtown with shops and restaurants' },
  { id: 'maritime_museum', name: 'Maritime Museum', lat: 41.89, lng: -80.79, 
    description: 'Home of the historic Coast Guard station' },
  { id: 'covered_bridge', name: 'Smolen-Gulf Bridge', lat: 41.85, lng: -80.74, 
    description: 'Longest covered bridge in the United States' }
];

function App() {
  const [topic, setTopic] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useState(null);
  const [nearestLandmark, setNearestLandmark] = useState(null);
  const [selectedFigure, setSelectedFigure] = useState(HISTORICAL_FIGURES[0]);
  const [showTicketModal, setShowTicketModal] = useState(false);

  // Get user location on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(userLoc);
          findNearestLandmark(userLoc);
        },
        () => setError("Location access denied. You can still enter a topic manually.")
      );
    }
  }, []);

  const findNearestLandmark = (userLoc) => {
    let nearest = null;
    let minDist = Infinity;
    
    LANDMARKS.forEach(landmark => {
      const dist = Math.sqrt(
        Math.pow(landmark.lat - userLoc.lat, 2) + 
        Math.pow(landmark.lng - userLoc.lng, 2)
      );
      if (dist < minDist) {
        minDist = dist;
        nearest = landmark;
      }
    });
    
    // Only set if within reasonable distance (~10km)
    if (minDist < 0.15) {
      setNearestLandmark(nearest);
      setTopic(nearest.description);
    }
  };

  const generate = async () => {
    setLoading(true);
    setError("");
    setStory("");
    
    try {
      const prompt = `${selectedFigure.greeting}

Tell a ${selectedFigure.era} story about "${topic || 'Ashtabula Harbor'}" in Ashtabula County.
Make it engaging, historically accurate, and end with an invitation to explore more.
Stay in character as ${selectedFigure.name}, a ${selectedFigure.role}.
80-120 words. Make it feel personal and authentic.`;

      const text = await callGeminiAPI(prompt);
      setStory(text);
    } catch (e) {
      setError(e.message || "Failed to generate narration.");
    } finally {
      setLoading(false);
    }
  };

  const buyTicket = () => {
    setShowTicketModal(true);
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">🎭 Ashtabula Pocket Historian</p>
          <h1>AI historical figures bring history to life</h1>
          <p className="sub">GPS-guided tours narrated by characters from Ashtabula's past.</p>
          
          {nearestLandmark && (
            <div className="location-badge">
              📍 Near: {nearestLandmark.name}
            </div>
          )}
          
          <div className="hero-actions">
            <button className="primary" onClick={generate} disabled={loading}>
              {loading ? "🎭 Bringing history to life…" : "🎭 Hear from the Past"}
            </button>
            <button className="secondary" onClick={buyTicket}>
              🎟️ Buy Museum Ticket ($8)
            </button>
          </div>
          
          <div className="trust">
            <span>📍 GPS Tours</span>
            <span>🎭 AI Characters</span>
            <span>🏛️ Maritime Museum</span>
          </div>
        </div>
        
        <div className="hero-card">
          <h3>Choose Your Guide</h3>
          <select 
            value={selectedFigure.id} 
            onChange={(e) => setSelectedFigure(HISTORICAL_FIGURES.find(f => f.id === e.target.value))}
            className="figure-select"
          >
            {HISTORICAL_FIGURES.map(fig => (
              <option key={fig.id} value={fig.id}>
                {fig.name} ({fig.era}) — {fig.role}
              </option>
            ))}
          </select>
          
          <div className="figure-preview">
            <div className="figure-avatar">{selectedFigure.name[0]}</div>
            <div className="figure-info">
              <strong>{selectedFigure.name}</strong>
              <span>{selectedFigure.era} • {selectedFigure.role}</span>
            </div>
          </div>
          
          <h3 style={{marginTop: '20px'}}>Tour Topic</h3>
          <input 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)} 
            placeholder="Enter a location or topic..."
          />
        </div>
      </header>

      <section className="card">
        <div className="card-head">
          <h2>🎭 Historical Narration</h2>
          <span className="pill">{selectedFigure.name}</span>
        </div>
        {error && <div className="error">{error}</div>}
        {story ? (
          <div className="story-output animate-in">
            <div className="story-header">
              <span className="story-speaker">{selectedFigure.name}</span>
              <span className="story-era">{selectedFigure.era}</span>
            </div>
            <div className="story-text">{story}</div>
            <div className="story-actions">
              <button className="btn-small" onClick={() => window.speechSynthesis.speak(new SpeechSynthesisUtterance(story))}>
                🔊 Play Audio
              </button>
              <button className="btn-small secondary" onClick={generate}>
                🔄 New Story
              </button>
            </div>
          </div>
        ) : (
          <div className="placeholder">
            <p>Your historical figure will appear here...</p>
            <p className="hint">Enable location for GPS-guided tours, or enter a topic manually.</p>
          </div>
        )}
      </section>

      <section className="grid">
        <div className="tile">
          <h3>📍 GPS Guided</h3>
          <p>Stories trigger automatically as you explore Ashtabula.</p>
        </div>
        <div className="tile">
          <h3>🎭 AI Characters</h3>
          <p>Authentic voices from Ashtabula's past bring history alive.</p>
        </div>
        <div className="tile">
          <h3>🎟️ Museum Tickets</h3>
          <p>Book tickets directly through the app. $8 adults, $5 kids.</p>
        </div>
      </section>

      <footer className="footer">
        <strong>Ashtabula Maritime Museum</strong>
        <div>1071 Walnut Boulevard • Ashtabula, OH 44004</div>
        <div style={{marginTop: '8px'}}>(440) 964-8167 • Open Tue-Sun 10am-4pm</div>
      </footer>

      {/* Ticket Modal */}
      {showTicketModal && (
        <div className="modal-overlay" onClick={() => setShowTicketModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowTicketModal(false)}>×</button>
            <h3>🎟️ Buy Museum Tickets</h3>
            <div className="ticket-options">
              <div className="ticket-option">
                <span>Adult (13+)</span>
                <strong>$8.00</strong>
              </div>
              <div className="ticket-option">
                <span>Child (6-12)</span>
                <strong>$5.00</strong>
              </div>
              <div className="ticket-option">
                <span>Family (2 adults + 2 kids)</span>
                <strong>$22.00</strong>
              </div>
            </div>
            <button className="primary full" onClick={() => window.open('https://ashtabulamaritimemuseum.org/visit', '_blank')}>
              Continue to Payment
            </button>
            <p className="modal-note">You'll be redirected to our secure payment processor.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

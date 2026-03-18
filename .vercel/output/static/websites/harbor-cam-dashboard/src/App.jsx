import { useState, useEffect, useRef } from "react";
import "./App.css";

// Lighthouse/maritime logo
const LogoIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="22" y="12" width="8" height="32" rx="1" fill="#ffffff" stroke="#0c2461" strokeWidth="2"/>
    <path d="M18 12h16l-8-8-8 8z" fill="#e74c3c" stroke="#c0392b" strokeWidth="1"/>
    <rect x="24" y="16" width="4" height="4" fill="#0c2461"/>
    <rect x="24" y="24" width="4" height="4" fill="#0c2461"/>
    <rect x="24" y="32" width="4" height="4" fill="#0c2461"/>
    <path d="M6 44h40" stroke="#78e08f" strokeWidth="4" strokeLinecap="round"/>
    <path d="M10 44q8-4 16-2t16 2" stroke="#3498db" strokeWidth="2" fill="none"/>
  </svg>
);

// Wave pattern
const WavePattern = () => (
  <svg className="wave-pattern" viewBox="0 0 200 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.1">
      <path d="M0 30 Q50 20 100 30 T200 30" fill="none" stroke="#0c2461" strokeWidth="2"/>
      <path d="M0 40 Q50 30 100 40 T200 40" fill="none" stroke="#0c2461" strokeWidth="2"/>
      <path d="M0 50 Q50 40 100 50 T200 50" fill="none" stroke="#3498db" strokeWidth="2"/>
      <path d="M0 60 Q50 50 100 60 T200 60" fill="none" stroke="#78e08f" strokeWidth="2"/>
      <circle cx="150" cy="25" r="15" fill="none" stroke="#0c2461" strokeWidth="1"/>
      <path d="M150 15v20M140 25h20" stroke="#0c2461" strokeWidth="1"/>
    </g>
  </svg>
);

// Available harbor cameras
const CAMERA_SOURCES = [
  { 
    id: 'harbor_main', 
    name: 'Main Harbor Entrance', 
    url: 'https://images.nps.gov/npgallery/GetImage/filename/987b8c7a-1dd8-b71c-0b4b3e4f4b5e9e6a/width/1920/height/1080',
    type: 'static'
  },
  { 
    id: 'lighthouse', 
    name: 'Ashtabula Lighthouse', 
    url: 'https://images.nps.gov/npgallery/GetImage/filename/0e3d6c5a-1dd8-b71c-0b6d7e8f9a0b1c2d/width/1920/height/1080',
    type: 'static'
  },
  { 
    id: 'bridge', 
    name: 'Lift Bridge View', 
    url: 'https://images.nps.gov/npgallery/GetImage/filename/1a2b3c4d-5e6f-7a8b-9c0d1e2f3a4b5c6d/width/1920/height/1080',
    type: 'static'
  }
];

function App() {
  const [conditions, setConditions] = useState({ 
    wind: "12 knots", 
    waves: "2-3 ft", 
    temp: "68°F", 
    visibility: "Good",
    pressure: "30.12 in",
    tide: "Rising"
  });
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeCamera, setActiveCamera] = useState(CAMERA_SOURCES[0]);
  const [cameraError, setCameraError] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const videoRef = useRef(null);

  // Get user location for local conditions
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.log("Location access denied")
      );
    }
  }, []);

  // Simulate live data refresh
  const refreshData = async () => {
    setLoading(true);
    
    // Fetch simulated real-time data
    setTimeout(() => {
      const winds = ["10 knots", "12 knots", "15 knots", "8 knots"];
      const waves = ["1-2 ft", "2-3 ft", "3-4 ft", "2-4 ft"];
      const temps = ["66°F", "68°F", "70°F", "67°F"];
      
      setConditions(prev => ({
        ...prev,
        wind: winds[Math.floor(Math.random() * winds.length)],
        waves: waves[Math.floor(Math.random() * waves.length)],
        temp: temps[Math.floor(Math.random() * temps.length)],
        updated: new Date().toISOString()
      }));
      
      setLastUpdated(new Date());
      setLoading(false);
    }, 1000);
  };

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(refreshData, 300000);
    return () => clearInterval(interval);
  }, []);

  const status = conditions.waves.includes("4") || conditions.wind.includes("25") ? "danger" : 
                 conditions.waves.includes("3") || parseInt(conditions.wind) >= 15 ? "caution" : "good";

  const statusConfig = {
    good: { color: "#27ae60", bg: "#eafaf1", label: "GOOD TO GO", icon: "✓", desc: "Safe boating conditions" },
    caution: { color: "#f39c12", bg: "#fef9e7", label: "CAUTION", icon: "⚠", desc: "Exercise caution on water" },
    danger: { color: "#e74c3c", bg: "#fadbd8", label: "DANGEROUS", icon: "✕", desc: "Avoid boating if possible" }
  };

  return (
    <div className="page">
      <div className="bg-waves" aria-hidden="true">
        <WavePattern />
      </div>

      <header className="header">
        <div className="logo">
          <LogoIcon />
          <div className="logo-text">
            <span className="logo-title">Ashtabula Harbor</span>
            <span className="logo-subtitle">Live Camera & Conditions</span>
          </div>
        </div>        
        <div className="location-badge">
          <span>📍</span> Ashtabula Harbor, OH • Lake Erie
        </div>
      </header>

      <main className="content">
        <div className="status-bar">
          <div className="status-indicator" style={{ background: statusConfig[status].bg, borderColor: statusConfig[status].color }}>
            <span className="status-icon" style={{ color: statusConfig[status].color }}>{statusConfig[status].icon}</span>
            <div className="status-text">
              <span className="status-label" style={{ color: statusConfig[status].color }}>{statusConfig[status].label}</span>
              <span className="status-desc">{statusConfig[status].desc}</span>
            </div>
          </div>          
          
          <button className="refresh-btn" onClick={refreshData} disabled={loading}>
            <span className={loading ? 'spin' : ''}>↻</span> 
            {loading ? 'Updating...' : 'Refresh'}
          </button>
        </div>

        <div className="camera-selector">
          {CAMERA_SOURCES.map(cam => (
            <button
              key={cam.id}
              className={`camera-btn ${activeCamera.id === cam.id ? 'active' : ''}`}
              onClick={() => { setActiveCamera(cam); setCameraError(false); }}
            >
              📹 {cam.name}
            </button>
          ))}
        </div>

        <div className="main-grid">
          <div className="camera-card">
            <div className="card-header">
              <span>📹</span>
              <h3>{activeCamera.name}</h3>
              <span className="live-badge">● LIVE</span>
            </div>            
            
            <div className="camera-feed">
              {cameraError ? (
                <div className="camera-error">
                  <span>📷</span>
                  <p>Camera temporarily unavailable</p>
                  <button onClick={() => setCameraError(false)}>Retry</button>
                </div>
              ) : (
                <img
                  src={activeCamera.url}
                  alt={`${activeCamera.name} view`}
                  className="camera-image"
                  onError={() => setCameraError(true)}
                />
              )}
            </div>            
            
            <div className="camera-meta">
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              <span className="refresh-hint">Auto-refresh every 5 min</span>
            </div>
          </div>

          <div className="conditions-card">
            <div className="card-header">
              <span>🌊</span>
              <h3>Marine Conditions</h3>
            </div>            
            <div className="conditions-grid">
              <div className="condition-item">
                <span className="condition-icon">💨</span>
                <span className="condition-label">Wind</span>
                <span className="condition-value">{conditions.wind}</span>
              </div>
              <div className="condition-item">
                <span className="condition-icon">🌊</span>
                <span className="condition-label">Waves</span>
                <span className="condition-value">{conditions.waves}</span>
              </div>
              <div className="condition-item">
                <span className="condition-icon">🌡️</span>
                <span className="condition-label">Air Temp</span>
                <span className="condition-value">{conditions.temp}</span>
              </div>
              <div className="condition-item">
                <span className="condition-icon">👁️</span>
                <span className="condition-label">Visibility</span>
                <span className="condition-value">{conditions.visibility}</span>
              </div>
              <div className="condition-item">
                <span className="condition-icon">📊</span>
                <span className="condition-label">Pressure</span>
                <span className="condition-value">{conditions.pressure}</span>
              </div>
              <div className="condition-item">
                <span className="condition-icon">🌊</span>
                <span className="condition-label">Tide</span>
                <span className="condition-value">{conditions.tide}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="forecast-card">
          <div className="card-header">
            <span>📋</span>
            <h3>Marine Forecast</h3>
            <span className="zone-badge">LEZ148</span>
          </div>          
          
          <div className="forecast-list">
            <div className="forecast-item">
              <span className="forecast-time">Today</span>
              <span className="forecast-text">West winds 10 to 15 knots. Waves 2 to 4 feet. Partly sunny.</span>
            </div>
            <div className="forecast-item">
              <span className="forecast-time">Tonight</span>
              <span className="forecast-text">Northwest winds 15 to 20 knots. Waves 3 to 5 feet. Chance showers.</span>
            </div>
            <div className="forecast-item">
              <span className="forecast-time">Tomorrow</span>
              <span className="forecast-text">Northwest winds 10 to 15 knots. Waves 2 to 4 feet. Mostly sunny.</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>About Ashtabula Harbor</h3>
          <p>
            Ashtabula Harbor is one of Lake Erie's most historic ports, featuring the iconic 
            Ashtabula Lighthouse (built 1836) and the busiest harbor in the Great Lakes during 
            the iron ore boom. Today it serves recreational boaters and commercial fishing 
            operations alike.
          </p>
          <div className="info-links">
            <a href="https://ashtabulaharbor.org" target="_blank" rel="noopener noreferrer">
              Harbor Website →
            </a>
            <a href="tel:+14409982191">
              Harbor Master: (440) 998-2191
            </a>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div>
            <strong>Ashtabula Harbor Cam</strong>
            <span>Powered by Ashtabula Maritime Partnership</span>
          </div>
          <div className="footer-links">
            <a href="https://ashtabulaharbor.org" target="_blank">Harbor Info</a>
            <a href="https://weather.gov/erh/marine" target="_blank">NWS Marine</a>
            <a href="tel:+14409982191">Harbor Master</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

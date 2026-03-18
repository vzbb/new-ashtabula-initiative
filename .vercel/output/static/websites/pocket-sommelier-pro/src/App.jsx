import { useState, useRef } from "react";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// === QR Code Generator (no external lib needed) ===
const generateQRCode = (text, size = 200) => {
  // Simple QR placeholder using API
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
};

// === NAI API Client ===
const API_CONFIG = {
  TIMEOUT_MS: 30000,
  MAX_RETRIES: 3,
  INITIAL_RETRY_DELAY_MS: 1000,
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

// Sample menu items for Ashtabula restaurants
const MENU_ITEMS = [
  { dish: "Lake Erie Walleye", category: "Seafood", price: 28 },
  { dish: "Prime Rib", category: "Beef", price: 34 },
  { dish: "Pasta Primavera", category: "Vegetarian", price: 22 },
  { dish: "Chicken Piccata", category: "Poultry", price: 24 },
  { dish: "Grilled Lamb Chops", category: "Lamb", price: 36 },
  { dish: "Chocolate Lava Cake", category: "Dessert", price: 12 }
];

function App() {
  const [dish, setDish] = useState("");
  const [pairing, setPairing] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [showQrModal, setShowQrModal] = useState(false);
  const printRef = useRef();

  const recommend = async () => {
    if (!dish.trim()) {
      setError("Please enter a dish name");
      return;
    }
    
    setLoading(true);
    setError("");
    setPairing("");
    setQrCode("");
    
    try {
      const prompt = `You are an expert sommelier at a fine dining restaurant in Ashtabula County, Ohio. 

Recommend a wine pairing for: "${dish}"

Include:
1. Specific wine name, varietal, and vintage suggestion
2. Why it pairs well (flavor profile matching)
3. A gentle upsell to a premium bottle (+$15-25)
4. Brief tasting notes

Keep it under 100 words. Be sophisticated but approachable.`;

      const text = await callGeminiAPI(prompt);
      setPairing(text);
      
      // Generate QR code for tableside
      const qrText = `https://ferrantewinery.com/pairing?dish=${encodeURIComponent(dish)}&rec=${encodeURIComponent(text.substring(0, 100))}`;
      setQrCode(generateQRCode(qrText, 300));
    } catch (e) {
      setError(e.message || "Failed to generate pairing.");
    } finally {
      setLoading(false);
    }
  };

  const generateTableQr = () => {
    const tableData = {
      table: tableNumber || "TBD",
      restaurant: "Ferrante Winery Restaurant",
      url: "https://ferrantewinery.com/digital-menu",
      message: "Scan for wine pairings with every dish"
    };
    const qrText = JSON.stringify(tableData);
    setQrCode(generateQRCode(qrText, 400));
    setShowQrModal(true);
  };

  const printQr = () => {
    window.print();
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">🍷 Ferrante Winery — Tableside Sommelier</p>
          <h1>QR codes + AI pairings for every table</h1>
          <p className="sub">Guests scan, see pairings, order premium bottles. Staff gets instant backup.</p>
          
          <div className="hero-actions">
            <button className="primary" onClick={recommend} disabled={loading}>
              {loading ? "🍷 Finding perfect pairing…" : "🍷 Get Wine Pairing"}
            </button>
            <button className="secondary" onClick={() => setShowQrModal(true)}>
              📱 Generate Table QR
            </button>
          </div>
          
          <div className="trust">
            <span>📱 Table QR Codes</span>
            <span>💵 Upsell Ready</span>
            <span>⚡ 5-Second Output</span>
          </div>
        </div>
        
        <div className="hero-card">
          <h3>🍽️ Dish Input</h3>
          <input 
            value={dish} 
            onChange={(e) => setDish(e.target.value)} 
            placeholder="Enter dish name (e.g., 'Grilled Salmon')"
          />
          <div className="quick-picks">
            <span>Quick picks:</span>
            {MENU_ITEMS.slice(0, 4).map(item => (
              <button 
                key={item.dish} 
                className="chip" 
                onClick={() => setDish(item.dish)}
              >
                {item.dish}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="card">
        <div className="card-head">
          <h2>🍷 Sommelier Recommendation</h2>
          <span className="pill">AI Generated</span>
        </div>
        
        {error && <div className="error">{error}</div>}
        
        {pairing ? (
          <div className="pairing-output animate-in">
            <div className="pairing-text">{pairing}</div>
            
            {qrCode && (
              <div className="qr-section">
                <h4>📱 Table QR Code</h4>
                <img src={qrCode} alt="Table QR Code" className="qr-image" />
                <p className="qr-hint">Guests scan to see this pairing on their phone</p>
                
                <div className="qr-actions">
                  <button className="btn-small" onClick={printQr}>🖨️ Print QR</button>
                  <button className="btn-small secondary" onClick={() => setShowQrModal(true)}>📱 New QR</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="placeholder">
            <p>Enter a dish and click "Get Wine Pairing"</p>
            <p className="hint">Or generate QR codes for tables to let guests browse on their phones.</p>
          </div>
        )}
      </section>

      <section className="grid">
        <div className="tile">
          <h3>📱 QR at Every Table</h3>
          <p>Guests scan, browse pairings, order premium bottles directly.</p>
        </div>
        <div className="tile">
          <h3>💵 Automatic Upsell</h3>
          <p>AI suggests premium bottles (+$15-25) with every pairing.</p>
        </div>
        <div className="tile">
          <h3>👨‍💼 Staff Assist</h3>
          <p>New servers get instant wine knowledge backup.</p>
        </div>
      </section>

      <footer className="footer">
        <strong>Ferrante Winery & Ristorante</strong>
        <div>5585 State Route 307 • Geneva, OH 44041</div>
        <div style={{marginTop: '8px'}}>(440) 466-8466 • Open daily 11am-9pm</div>
      </footer>

      {/* QR Modal */}
      {showQrModal && (
        <div className="modal-overlay" onClick={() => setShowQrModal(false)}>
          <div className="modal-content qr-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowQrModal(false)}>×</button>
            <h3>📱 Generate Table QR Code</h3>
            
            <div className="form-group">
              <label>Table Number</label>
              <input 
                value={tableNumber} 
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="e.g., Table 12 or Patio-3"
              />
            </div>
            
            <button className="primary full" onClick={generateTableQr}>
              Generate QR Code
            </button>
            
            {qrCode && (
              <div className="qr-preview" ref={printRef}>
                <img src={qrCode} alt="Table QR" className="qr-large" />
                <div className="qr-label">
                  <strong>{tableNumber || "Table QR"}</strong>
                  <span>Scan for wine pairings</span>
                </div>
                
                <button className="secondary full" onClick={printQr}>
                  🖨️ Print for Table
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

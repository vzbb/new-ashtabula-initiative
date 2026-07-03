import { useState } from "react";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const baseUrl = import.meta.env.BASE_URL;

const generateQRCode = (text, size = 220) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;

const API_CONFIG = {
  TIMEOUT_MS: 30000,
  MAX_RETRIES: 3,
  INITIAL_RETRY_DELAY_MS: 1000,
  RETRYABLE_STATUS_CODES: [408, 429, 500, 502, 503, 504],
};

const FERRANTE_MENU = [
  {
    dish: "Lobster Ravioli",
    course: "House Specialty",
    pairing: "Ferrante Grand River Valley Chardonnay",
    premium: "Upgrade to Ferrante Reserve Chardonnay",
    notes:
      "The rich butter finish and orchard-fruit acidity lift the lobster without flattening the sauce.",
  },
  {
    dish: "Veal Parmesan",
    course: "Classic Italian",
    pairing: "Ferrante Sangiovese",
    premium: "Upgrade to Ferrante Cabernet Franc",
    notes:
      "Bright cherry and gentle tannin balance the tomato acidity while keeping the veal front and center.",
  },
  {
    dish: "Lake Erie Walleye",
    course: "Regional Favorite",
    pairing: "Ferrante Pinot Grigio",
    premium: "Upgrade to Ferrante Vidal Blanc Ice Wine tasting flight",
    notes:
      "Clean citrus and mineral notes keep the fish crisp and let the lake-catch texture stay delicate.",
  },
  {
    dish: "Braised Short Rib",
    course: "Chef Dinner Feature",
    pairing: "Ferrante Merlot",
    premium: "Upgrade to Ferrante Reserve Cabernet Sauvignon",
    notes:
      "Plum fruit and round tannins soften the braise while the reserve option adds deeper oak and structure.",
  },
  {
    dish: "Wild Mushroom Risotto",
    course: "Vegetarian",
    pairing: "Ferrante Pinot Noir",
    premium: "Upgrade to Ferrante Barbera",
    notes:
      "Earthy red fruit and restrained spice echo the mushrooms without overwhelming the parmesan finish.",
  },
  {
    dish: "Tiramisu",
    course: "Dessert",
    pairing: "Ferrante Late Harvest Riesling",
    premium: "Upgrade to Ferrante Ice Wine pour",
    notes:
      "Honeyed sweetness and acidity mirror the mascarpone while keeping the espresso notes lively.",
  },
];

const TABLE_ZONES = [
  "Dining Room",
  "Bar",
  "Patio",
  "Wine Cellar",
  "Private Event Room",
];

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms + Math.random() * 200));

const callGeminiAPI = async (prompt, model = "gemini-1.5-flash", retryCount = 0) => {
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
        await delay(API_CONFIG.INITIAL_RETRY_DELAY_MS * Math.pow(2, retryCount));
        return callGeminiAPI(prompt, model, retryCount + 1);
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (error) {
    clearTimeout(timeoutId);
    if (retryCount < API_CONFIG.MAX_RETRIES) {
      await delay(API_CONFIG.INITIAL_RETRY_DELAY_MS * Math.pow(2, retryCount));
      return callGeminiAPI(prompt, model, retryCount + 1);
    }
    throw error;
  }
};

const buildFallbackPairing = (dishName) => {
  const normalized = dishName.trim().toLowerCase();
  const match =
    FERRANTE_MENU.find((item) => item.dish.toLowerCase() === normalized) ||
    FERRANTE_MENU.find((item) =>
      normalized.includes(item.dish.toLowerCase().split(" ")[0]),
    ) ||
    FERRANTE_MENU[0];

  return `${match.pairing} pairs beautifully with ${dishName || match.dish}. ${match.notes} Service team prompt: offer ${match.premium} for guests who want a richer cellar pour.`;
};

function App() {
  const [dish, setDish] = useState(FERRANTE_MENU[0].dish);
  const [tableNumber, setTableNumber] = useState("Table 12");
  const [zone, setZone] = useState(TABLE_ZONES[0]);
  const [pairing, setPairing] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("pairing");

  const activeMenuItem =
    FERRANTE_MENU.find((item) => item.dish === dish) || FERRANTE_MENU[0];

  const recommend = async () => {
    if (!dish.trim()) {
      setError("Choose a dish or type one from Ferrante's menu.");
      return;
    }

    setLoading(true);
    setError("");
    setPairing("");
    setMode("pairing");

    const prompt = `You are the digital sommelier for Ferrante Winery & Ristorante in Geneva, Ohio.

The guest is seated in the ${zone} at ${tableNumber}.
Recommend a wine pairing for the dish "${dish}".

Requirements:
1. Recommend a specific Ferrante wine first.
2. Explain the pairing in approachable language.
3. Offer one premium cellar upsell.
4. Mention how a server can present it tableside.
5. Keep it under 95 words and make it feel polished, hospitality-forward, and local.`;

    try {
      const text = apiKey ? await callGeminiAPI(prompt) : buildFallbackPairing(dish);
      setPairing(text);
      const qrText = `https://ferrantewinery.com/pairings?table=${encodeURIComponent(
        tableNumber,
      )}&zone=${encodeURIComponent(zone)}&dish=${encodeURIComponent(dish)}`;
      setQrCode(generateQRCode(qrText, 320));
    } catch {
      setPairing(buildFallbackPairing(dish));
      setQrCode(
        generateQRCode(
          `https://ferrantewinery.com/pairings?table=${encodeURIComponent(
            tableNumber,
          )}&dish=${encodeURIComponent(dish)}`,
          320,
        ),
      );
      setError("Live AI is unavailable, so this preview is showing Ferrante's fallback pairing mode.");
    } finally {
      setLoading(false);
    }
  };

  const generateTableQr = () => {
    setMode("qr");
    setError("");
    const qrText = JSON.stringify({
      venue: "Ferrante Winery & Ristorante",
      table: tableNumber || "Table TBD",
      zone,
      path: `${baseUrl}sommelier-pro/`,
      message: "Scan for Ferrante wine pairings and premium pour suggestions.",
    });
    setQrCode(generateQRCode(qrText, 420));
  };

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Ferrante Winery & Ristorante</p>
          <h1>Sommelier Pro for winery-floor QR pairings and premium bottle prompts.</h1>
          <p className="sub">
            Built for Ferrante's dining room, patio, and event service so guests can scan a code,
            get a pairing, and feel guided toward the right pour without slowing down the floor.
          </p>

          <div className="trust-row">
            <span>Geneva wine-country hospitality</span>
            <span>Table-specific QR flows</span>
            <span>Premium upsell built in</span>
          </div>

          <div className="ferrante-note">
            <strong>Ferrante fit:</strong> Italian cuisine, regional wine identity, private events,
            and staff-friendly pairing support in one guest-facing tool.
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-head">
            <span className="panel-kicker">Tableside setup</span>
            <h2>Launch a pairing in seconds</h2>
          </div>

          <label>
            Dish
            <input
              value={dish}
              onChange={(event) => setDish(event.target.value)}
              placeholder="Choose or type a menu item"
            />
          </label>

          <div className="quick-picks">
            {FERRANTE_MENU.map((item) => (
              <button
                key={item.dish}
                className={dish === item.dish ? "chip active" : "chip"}
                onClick={() => setDish(item.dish)}
                type="button"
              >
                {item.dish}
              </button>
            ))}
          </div>

          <div className="table-grid">
            <label>
              Table
              <input
                value={tableNumber}
                onChange={(event) => setTableNumber(event.target.value)}
                placeholder="Table 12"
              />
            </label>

            <label>
              Zone
              <select value={zone} onChange={(event) => setZone(event.target.value)}>
                {TABLE_ZONES.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="hero-actions">
            <button className="primary" onClick={recommend} disabled={loading} type="button">
              {loading ? "Building Ferrante pairing..." : "Recommend pairing"}
            </button>
            <button className="secondary" onClick={generateTableQr} type="button">
              Generate table QR
            </button>
          </div>
        </div>
      </section>

      <section className="card pairing-card">
        <div className="card-head">
          <div>
            <p className="section-label">Guest-facing output</p>
            <h3>Ferrante pairing recommendation</h3>
          </div>
          <span className="pill">{apiKey ? "Live AI ready" : "Fallback mode active"}</span>
        </div>

        {error ? <div className="error">{error}</div> : null}

        {pairing ? (
          <div className="pairing-layout">
            <div className="pairing-output">
              <p className="pairing-dish">{dish}</p>
              <p className="pairing-text">{pairing}</p>
              <div className="service-hints">
                <span>Table: {tableNumber}</span>
                <span>Zone: {zone}</span>
                <span>Menu lane: {activeMenuItem.course}</span>
              </div>
            </div>
            {qrCode ? (
              <div className="qr-section">
                <img src={qrCode} alt="Ferrante pairing QR code" className="qr-image" />
                <p>Guests scan to reopen this pairing flow on their phone at the table.</p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="placeholder">
            <p>Pick a Ferrante menu item to preview the pairing engine.</p>
            <p className="hint">
              This demo supports both AI output and a hospitality-safe fallback when the key is
              unavailable.
            </p>
          </div>
        )}
      </section>

      <section className="grid">
        <article className="tile">
          <p className="section-label">Why this fits Ferrante</p>
          <h3>Built for winery dining, not generic restaurant software</h3>
          <p>
            The product assumes diners are choosing between estate pours, premium reserve upgrades,
            and table-specific service moments.
          </p>
        </article>

        <article className="tile">
          <p className="section-label">Upsell motion</p>
          <h3>Premium bottle guidance without awkward sales copy</h3>
          <p>
            Every recommendation nudges a cellar upgrade naturally, so the server can step in with
            confidence instead of memorizing pairings.
          </p>
        </article>

        <article className="tile">
          <p className="section-label">Operational use</p>
          <h3>Event, patio, and new-server friendly</h3>
          <p>
            The QR workflow works for busy patios, weddings, and seasonal staff who need fast wine
            support during service.
          </p>
        </article>
      </section>

      <section className="menu-showcase">
        <div className="card-head">
          <div>
            <p className="section-label">Ferrante menu cues</p>
            <h3>Sample house pairings used by the demo</h3>
          </div>
        </div>
        <div className="menu-grid">
          {FERRANTE_MENU.map((item) => (
            <article className="menu-card" key={item.dish}>
              <p className="menu-course">{item.course}</p>
              <h4>{item.dish}</h4>
              <p className="menu-pairing">{item.pairing}</p>
              <p className="menu-notes">{item.notes}</p>
              <p className="menu-premium">{item.premium}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <strong>Ferrante Winery & Ristorante</strong>
        <span>5585 N River Rd W, Geneva, OH 44041</span>
        <span>(440) 466-8466</span>
        <span>{mode === "qr" ? "QR service mode active" : "Pairing service mode active"}</span>
      </footer>
    </div>
  );
}

export default App;

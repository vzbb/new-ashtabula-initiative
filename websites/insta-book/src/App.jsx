import { useState } from "react";
import {
  callGeminiAPI,
  extractResponseText,
  getErrorMessage,
  isAPIConfigured,
} from "./api-client.js";
import "./App.css";

const amenityOptions = [
  "Breakfast basket delivery",
  "Crosswinds Grille dinner",
  "Spa appointment hold",
  "Winery tasting flight",
  "Covered bridge guide",
];

const accommodationOptions = [
  "Inn room",
  "Lakeview suite",
  "Two-bedroom cottage",
];

function formatStayDate(date) {
  if (!date) {
    return "a soon-to-arrive guest";
  }

  const parsed = new Date(`${date}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function buildFallbackConfirmation({ date, nights, accommodation, guestName, addOns }) {
  const arrival = formatStayDate(date);
  const guestLabel = guestName.trim() || "Guest";
  const extras =
    addOns.length > 0
      ? `We have also noted ${addOns.join(", ").toLowerCase()} for your stay.`
      : "We can help add spa, dining, or winery plans whenever you are ready.";

  return `Dear ${guestLabel},

Your ${nights}-night ${accommodation.toLowerCase()} stay at The Lakehouse Inn is confirmed for arrival on ${arrival}. We are preparing a relaxed Geneva-on-the-Lake welcome with lakefront comfort, breakfast basket service, and easy access to our winery, spa, and Crosswinds Grille.

${extras} Reply to this confirmation if you would like us to hold a tasting, dinner reservation, or late checkout request before arrival.`;
}

function App() {
  const assetBase = import.meta.env.BASE_URL;
  const logoSrc = `${assetBase}assets/lakehouse-logo.png`;
  const [date, setDate] = useState("");
  const [nights, setNights] = useState(2);
  const [guestName, setGuestName] = useState("Megan");
  const [accommodation, setAccommodation] = useState(accommodationOptions[1]);
  const [addOns, setAddOns] = useState([
    "Breakfast basket delivery",
    "Winery tasting flight",
  ]);
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiConfigured = isAPIConfigured();

  const toggleAddOn = (item) => {
    setAddOns((current) =>
      current.includes(item)
        ? current.filter((entry) => entry !== item)
        : [...current, item],
    );
  };

  const reserve = async () => {
    setLoading(true);
    setError("");

    const fallback = buildFallbackConfirmation({
      date,
      nights,
      accommodation,
      guestName,
      addOns,
    });

    if (!apiConfigured) {
      setConfirmation(fallback);
      setLoading(false);
      return;
    }

    try {
      const prompt = `Write a polished booking confirmation email for The Lakehouse Inn in Geneva-on-the-Lake, Ohio.
Guest name: ${guestName || "Guest"}
Arrival date: ${date || "soon"}
Length of stay: ${nights} nights
Accommodation: ${accommodation}
Add-ons: ${addOns.join(", ") || "none"}

Requirements:
- Warm boutique-hotel tone
- Mention Lake Erie or Ohio Wine Country naturally
- Reference breakfast basket service and one upsell tied to spa, dinner, or wine tasting
- Keep it under 140 words
- Plain text only`;

      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data).trim();
      setConfirmation(text || fallback);
    } catch (apiError) {
      setConfirmation(fallback);
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page">
        <header className="hero-card">
          <div className="hero-copy">
            <div className="eyebrow">Book Instantly with The Lakehouse Inn</div>
            <div className="brand-row">
              <img
                src={logoSrc}
                alt="The Lakehouse Inn"
                className="lakehouse-mark"
              />
              <div>
                <p className="brand-kicker">Your Ohio Wine Country destination</p>
                <h1>Booking confirmations that feel like part of the stay.</h1>
              </div>
            </div>
            <p className="hero-text">
              A pitch-ready booking confirmation experience for The Lakehouse Inn,
              built around lakeview suites, cottages, winery visits, spa add-ons,
              and the all-in-one Ohio Wine Country getaway.
            </p>
          </div>
        </header>

        <main className="content-grid">
          <section className="booking-card">
            <div className="section-heading">
              <p className="section-label">Guest confirmation studio</p>
              <h2>Preview the message a guest receives before arrival.</h2>
            </div>

            <div className="form-grid">
              <label className="field">
                <span>Guest name</span>
                <input
                  type="text"
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                  placeholder="Guest name"
                />
              </label>

              <label className="field">
                <span>Arrival date</span>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </label>

              <div className="field">
                <span>Length of stay</span>
                <div className="pill-row">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={value === nights ? "pill active" : "pill"}
                      onClick={() => setNights(value)}
                    >
                      {value} night{value > 1 ? "s" : ""}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <span>Stay type</span>
                <div className="pill-row">
                  {accommodationOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={option === accommodation ? "pill active" : "pill"}
                      onClick={() => setAccommodation(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="field">
              <span>Suggested add-ons</span>
              <div className="pill-row">
                {amenityOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={addOns.includes(option) ? "pill active" : "pill"}
                    onClick={() => toggleAddOn(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="cta-row">
              <button className="primary-cta" type="button" onClick={reserve} disabled={loading}>
                {loading ? "Preparing confirmation..." : "Generate guest confirmation"}
              </button>
            </div>

            {error && <div className="alert">{error}</div>}
          </section>

          <section className="confirmation-card">
            <div className="confirmation-header">
              <div>
                <p className="section-label">Confirmation preview</p>
                <h2>Warm, specific, and ready to send.</h2>
              </div>
            </div>

            <div className="confirmation-body">
              {confirmation ? (
                <pre>{confirmation}</pre>
              ) : (
                <div className="empty-state">
                  <h3>Preview a polished arrival note</h3>
                  <p>
                    Generate a sample confirmation to see how The Lakehouse Inn
                    can coordinate lodging, winery, spa, and dining details in
                    a single guest-ready message.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;

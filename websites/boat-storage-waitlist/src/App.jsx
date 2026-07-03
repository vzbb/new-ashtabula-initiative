import { useMemo, useState } from "react";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const marinaDetails = {
  name: "Geneva Marina",
  tagline: "Your Boat. Your Storage. Your Lake Erie Adventure.",
  location: "Geneva State Park, Ohio",
  slips: 379,
  season: "May 1 - October 31",
  phone: "(440) 466-7565",
};

const confirmationTemplates = {
  indoor: ({ length, contact }) =>
    `Thanks for joining the Geneva Marina indoor storage waitlist for your ${length} ft boat. Our team will review space availability and reach out to ${contact || "your preferred contact"} within 2 business days. Ask about winterizing, bottom painting, and spring launch scheduling through The Doc Shop while we hold your request.`,
  trailer: ({ length, contact }) =>
    `You are on the Geneva Marina trailer storage waitlist for a ${length} ft boat. We will confirm placement options and timing with ${contact || "you"} within 2 business days. If you want a faster spring launch, mention trailer staging and launch-day prep in your reply.`,
  wet: ({ length, contact }) =>
    `Your ${length} ft request is now in Geneva Marina's priority storage queue. We will follow up with ${contact || "you"} on next-available timing, access details, and seasonal service add-ons. Our crew can bundle winterizing, tune-ups, and launch prep to keep your Lake Erie season simple.`,
};

const callGeminiAPI = async (prompt) => {
  if (!apiKey) {
    throw new Error("API key not configured.");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("No response content received from API.");
  }

  return text;
};

const AnchorIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="3" />
    <line x1="12" y1="22" x2="12" y2="8" />
    <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const WrenchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a4 4 0 0 0 5 5L10 21l-7-7 9.7-9.7a4 4 0 0 0 2 2Z" />
    <path d="M16 3l5 5" />
  </svg>
);

function App() {
  const [length, setLength] = useState("24");
  const [storageType, setStorageType] = useState("indoor");
  const [contact, setContact] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  const trustItems = useMemo(
    () => [
      `${marinaDetails.slips} slips on Lake Erie`,
      "Ohio Clean Marina Platinum",
      "Winterizing + spring launch add-ons",
    ],
    [],
  );

  const generateConfirmation = async () => {
    setLoading(true);
    setNote("");
    setReply("");

    const fallback = confirmationTemplates[storageType]({
      length,
      contact,
    });

    try {
      if (!apiKey) {
        setReply(fallback);
        setNote("Demo fallback used because the Gemini key is not configured.");
        return;
      }

      const prompt = `Write a concise Geneva Marina boat storage waitlist confirmation for a ${length} ft boat requesting ${storageType} storage. Mention Geneva State Park, next-step timing, and one relevant upsell from The Doc Shop or spring launch services. Keep it under 85 words and make it sound polished and customer-facing.`;
      const aiReply = await callGeminiAPI(prompt);
      setReply(aiReply.trim());
      setNote("Live AI confirmation generated for Geneva Marina.");
    } catch {
      setReply(fallback);
      setNote("Fallback confirmation used so the demo stays presentation-ready.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="hero-shell">
        <section className="hero-copy">
          <p className="eyebrow">Geneva Marina Boat Storage Waitlist</p>
          <h1>{marinaDetails.tagline}</h1>
          <p className="lede">
            A branded intake flow for winter storage, trailer storage, and spring
            launch planning at Geneva State Park's full-service marina.
          </p>
          <div className="trust-row">
            {trustItems.map((item) => (
              <span className="trust-chip" key={item}>
                <AnchorIcon />
                {item}
              </span>
            ))}
          </div>
        </section>

        <aside className="hero-panel">
          <h2>Storage request details</h2>
          <label>
            Boat length (ft)
            <input value={length} onChange={(e) => setLength(e.target.value)} />
          </label>
          <label>
            Storage type
            <select value={storageType} onChange={(e) => setStorageType(e.target.value)}>
              <option value="indoor">Indoor winter storage</option>
              <option value="trailer">Trailer storage</option>
              <option value="wet">Late-season wet slip</option>
            </select>
          </label>
          <label>
            Best contact
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Phone or email"
            />
          </label>
          <button className="primary-button" onClick={generateConfirmation} disabled={loading}>
            {loading ? "Preparing confirmation..." : "Generate Geneva confirmation"}
          </button>
        </aside>
      </div>

      <section className="stats-grid">
        <article className="stat-card">
          <CalendarIcon />
          <h3>Seasonal operation</h3>
          <p>{marinaDetails.season}</p>
        </article>
        <article className="stat-card">
          <WrenchIcon />
          <h3>The Doc Shop support</h3>
          <p>Winterizing, tune-ups, detailing, prop work, and spring-ready service.</p>
        </article>
        <article className="stat-card">
          <AnchorIcon />
          <h3>Lake Erie access</h3>
          <p>{marinaDetails.location} with family-friendly amenities and fuel dock support.</p>
        </article>
      </section>

      <section className="response-card">
        <div className="response-head">
          <div>
            <p className="section-label">Demo response</p>
            <h2>Waitlist confirmation</h2>
          </div>
          <span className="status-pill">{apiKey ? "AI-assisted" : "Demo fallback"}</span>
        </div>
        {note ? <p className="note">{note}</p> : null}
        {reply ? <pre className="response-output">{reply}</pre> : <p className="placeholder">Generate a confirmation to preview the Geneva Marina customer reply.</p>}
      </section>

      <section className="workflow-grid">
        <article className="workflow-card">
          <h3>Why this works for Geneva Marina</h3>
          <ul>
            <li>Captures storage type before the staff callback.</li>
            <li>Frames The Doc Shop upsells naturally inside the response.</li>
            <li>Keeps the experience useful even when no API key is present.</li>
          </ul>
        </article>
        <article className="workflow-card">
          <h3>Operational fit</h3>
          <ul>
            <li>Supports winter storage and trailer storage overflow.</li>
            <li>Sets up spring launch conversations while the lead is warm.</li>
            <li>Matches a marina with 379 slips and full-service support.</li>
          </ul>
        </article>
      </section>

      <footer className="footer">
        <p>{marinaDetails.name} • Geneva State Park • {marinaDetails.phone}</p>
        <p className="footer-subline">Lake Erie boat storage demo aligned to Geneva Marina's family-oriented, full-service brand.</p>
      </footer>
    </div>
  );
}

export default App;

import { useState } from "react";
import "./App.css";
import { callGeminiAPI, extractResponseText } from "../../../shared/api-client.js";

function App() {
  const [service, setService] = useState("Furnace Repair Visit");
  const [phone, setPhone] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateSMS = async () => {
    setLoading(true);
    setError("");
    setReply("");
    try {
      const prompt = `Write a short SMS appointment confirmation from Blank Heating Company Inc (OH LIC #25138, Ashtabula OH) for ${service}. Include arrival window and brief prep note. Keep under 160 characters for SMS.`;
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
      setReply(text);
    } catch (e) {
      setError(e.message || "Failed to generate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="header">
        <img src="/logo.svg" className="brand-logo" alt="Blank Heating Company Inc" />
        <div className="brand-group">
          <span className="brand-title">Blank Heating Company Inc.</span>
          <span className="brand-sub">SMS Scheduling</span>
        </div>
      </div>

      <header className="hero">
        <div className="hero-content">
          <span className="eyebrow">HVAC SMS Scheduling</span>
          <h1>Send Appointment Confirmations via Text</h1>
          <p className="sub">AI-powered SMS confirmations for furnace, AC, and indoor air quality service visits. No apps to download.</p>

          <div className="input-card">
            <h3>Message Details</h3>
            <div className="form-row">
              <div>
                <label>Service Type</label>
                <select value={service} onChange={(e) => setService(e.target.value)}>
                  <option>Furnace Repair Visit</option>
                  <option>A/C Service Call</option>
                  <option>Seasonal System Check-Up</option>
                  <option>Free In-Home Estimate</option>
                </select>
              </div>
              <div>
                <label>Phone Number</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(440) 555-0123" />
              </div>
            </div>
          </div>

          <div className="hero-actions">
            <button className="primary" onClick={generateSMS} disabled={loading}>
              {loading ? "Generating..." : "Generate SMS"}
            </button>
            <button className="ghost">Send Now</button>
          </div>

          <div className="trust">
            <span>HVAC Ready</span>
            <span>AI Powered</span>
            <span>Instant Delivery</span>
          </div>
        </div>
      </header>

      <section className="card">
        <div className="card-head">
          <h2>SMS Preview</h2>
          <span className="pill">160 chars max</span>
        </div>
        {error && <div className="error">Error: {error}</div>}
        <div className="chat-preview">
          {reply ? (
            <div className="chat-bubble sent">
              {reply}
              <div className="chat-time">Sent 2:45 PM</div>
            </div>
          ) : (
            <p className="muted">SMS preview will appear here...</p>
          )}
        </div>
      </section>

      <section className="grid">
        <div className="tile">
          <div className="tile-icon">Wrench</div>
          <h3>HVAC Expertise</h3>
          <p>NATE-certified technicians draft accurate, professional service messages</p>
        </div>
        <div className="tile">
          <div className="tile-icon">Phone</div>
          <h3>98% Open Rate</h3>
          <p>SMS has 98% open rate - customers actually read their confirmations</p>
        </div>
        <div className="tile">
          <div className="tile-icon">Home</div>
          <h3>Family-Owned Service</h3>
          <p>Three generations keeping Ashtabula comfortable since 1954</p>
        </div>
      </section>

      <section className="differentiators">
        <span className="diff-pill">Three Generations Serving Ashtabula</span>
        <span className="diff-pill">OH LIC #25138 - NATE-Certified</span>
        <span className="diff-pill">FREE In-Home Estimates</span>
        <span className="diff-pill">24/7 Emergency Service Available</span>
      </section>

      <footer className="footer">
        <p>Blank Heating Company Inc - Ashtabula, OH - 440-969-1760</p>
        <p className="footer-tagline">Heating - Cooling - Air Quality</p>
      </footer>
    </div>
  );
}

export default App;

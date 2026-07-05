import { useState } from "react";
import "./App.css";
import { callOpenRouterAPI, extractResponseText } from "../../../shared/api-client.js";


// Icons
const CalendarIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;

const ZapIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;

const CheckIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

const FileTextIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;

function App() {
  const [service, setService] = useState("AC Installation & Repair");
  const [date, setDate] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const confirm = async () => {
    setLoading(true);
    setError("");
    setReply("");
    try {
      const prompt = `Write a concise HVAC service appointment confirmation for Blank Heating Company Inc. Service: ${service} on ${date || 'the scheduled date'}. Include arrival window and prep note. 70 words max.`;
      const data = await callOpenRouterAPI(prompt);
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
        <img src="/scheduler/logo.png" alt="Blank Heating Company Inc" className="logo" />
        <span className="brand-name">Blank Heating Company Inc</span>
      </div>

      <header className="hero">
        <div className="hero-content">
          <span className="eyebrow">🔥 Family-Owned Three Generations</span>
          <h1>Book HVAC Service With Blank Heating</h1>
          <p className="sub">NATE-certified technicians • Family-owned since 1940s • FREE in-home estimates</p>
          
          <div className="input-card">
            <h3>📞 Schedule Your Service Appointment</h3>
            <div className="form-row">
              <div>
                <label>Service Type</label>
                <input value={service} onChange={(e) => setService(e.target.value)} placeholder="AC Installation &amp; Repair" />
              </div>
              <div>
                <label>Preferred Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
          </div>
          
          <div className="hero-actions">
            <button className="primary" onClick={confirm} disabled={loading}>
              {loading ? "⏳ Generating…" : "📞 Book Appointment"}
            </button>
            <a href="tel:440-969-1760" className="ghost phone-link">📞 440-969-1760</a>
          </div>
          
          <div className="trust">
            <span><CalendarIcon /> NATE-Certified</span>
            <span><ZapIcon /> Family-Owned</span>
            <span><CheckIcon /> OH LIC #25138</span>
          </div>
        </div>
      </header>

      <section className="card">
        <div className="card-head">
          <h2><FileTextIcon /> Confirmation</h2>
          <span className="pill">AI-Powered Service</span>
        </div>
        {error && <div className="error">⚠️ {error}</div>}
        {reply ? (
          <pre className="output">{reply}</pre>
        ) : (
          <p className="muted">Your appointment confirmation will appear here...</p>
        )}
      </section>

      <section className="grid">
        <div className="tile">
          <div className="tile-icon">🔥</div>
          <h3>Same-Day Service</h3>
          <p>Quick response for urgent heating &amp; AC needs</p>
        </div>
        <div className="tile">
          <div className="tile-icon">✅</div>
          <h3>NATE-Certified</h3>
          <p>Our technicians meet the highest industry standards</p>
        </div>
        <div className="tile">
          <div className="tile-icon">🏠</div>
          <h3>Three Generations</h3>
          <p>Family-owned and operated since the 1940s</p>
        </div>
      </section>

      <footer className="footer">
        <div>Blank Heating Company Inc • Ashtabula, OH</div>
        <div style={{marginTop: '8px', opacity: 0.7}}>📞 440-969-1760</div>
      </footer>
    </div>
  );
}

export default App;

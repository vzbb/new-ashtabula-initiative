import { useState } from "react";
import { callOpenRouterAPI } from "./api-client.js";
import "./App.css";
import blankHeatingLogo from "./assets/blank-heating-logo.png";

// --- Brand Components ---

const HeritageBadge = () => (
  <span className="heritage-badge">
    <span className="heritage-star">★</span>
    Three Generations <span className="heritage-dot">•</span> Ashtabula OH
  </span>
);

const NateBadge = () => (
  <span className="nate-badge">NATE-Certified</span>
);

const FreeEstimateBadge = () => (
  <span className="free-estimate-badge">FREE In-Home Estimates</span>
);

// --- UI Icon Components ---

const MessageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const SmartphoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);

// --- Main App ---

function App() {
  const [formData, setFormData] = useState({
    appointmentDate: "",
    appointmentTime: "",
    clientName: "",
    clientPhone: "",
    reminderTime: "24",
    messageType: "both",
    serviceName: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleAiGenerate = async () => {
    if (!formData.serviceName || !formData.clientName) {
      setAiError("Please fill in the service type and client name above first.");
      return;
    }

    setAiLoading(true);
    setAiError("");
    setAiMessage("");

    try {
      const prompt = `You are an HVAC service scheduler for Blank Heating Company Inc in Ashtabula, OH. Write a brief, friendly SMS reminder message (max 160 characters) for a customer named ${formData.clientName} who has a ${formData.serviceName} appointment on ${formData.appointmentDate} at ${formData.appointmentTime}. Include a note to reply CONFIRM or CANCEL. Keep it warm and professional, reflecting a family-owned business with three generations of service.`;

      const data = await callOpenRouterAPI(prompt, "google/gemini-2.5-flash-lite");
      const text = data?.choices?.[0]?.message?.content || "";
      setAiMessage(text);
    } catch (err) {
      setAiError(err.message || "Could not generate message. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="background-pattern" aria-hidden="true">
        <svg className="bg-pattern" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="smsPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect x="10" y="10" width="20" height="16" rx="3" fill="none" stroke="#F97316" strokeWidth="1" opacity="0.1"/>
              <circle cx="45" cy="45" r="4" fill="#1B2A4A" opacity="0.08"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#smsPattern)"/>
        </svg>
      </div>

      <div className="container">
        <header className="header">
          <div className="brand">
            <img src={blankHeatingLogo} alt="Blank Heating Company Inc" className="brand-logo" />
            <HeritageBadge />
          </div>
        </header>

        <main className="main-content">
          <section className="hero-card">
            <div className="hero-content">
              <p className="eyebrow">Blank Heating Company Inc</p>
              <h1>Schedule Your HVAC Service</h1>
              <p className="sub">
                Book online anytime. Same Blank Heating quality — now with 24/7 convenience.
                We'll text you reminders so you never miss a technician.
              </p>

              <div className="trust">
                <span className="trust-item"><NateBadge /></span>
                <span className="trust-item"><FreeEstimateBadge /></span>
                <span className="trust-item"><BellIcon /> 24/7 Emergency</span>
                <span className="trust-item">OH LIC #25138</span>
              </div>
            </div>

            <div className="input-card">
              <h3>Need Emergency Service?</h3>
              <p className="quote-text">Furnace down? AC out? We answer when it matters.</p>
              <a href="tel:4409691760" className="emergency-phone">(440) 969-1760</a>
              <p className="quote-text emergency-note">Available 24/7 • Same number, any time</p>
            </div>
          </section>

          {submitted ? (
            <section className="result-card success">
              <div className="success-icon">✓</div>
              <h2>Reminder Scheduled!</h2>
              <p>SMS reminders have been configured for this appointment. {formData.clientName} will receive notifications at the scheduled times.</p>
              <button className="primary" onClick={() => { setSubmitted(false); setAiMessage(""); }}>Set Up Another</button>
            </section>
          ) : (
            <>
              <section className="form-card">
                <div className="card-header">
                  <h2>Configure Reminders</h2>
                  <span className="pill">Blank Heating</span>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <label>
                      <span>Service / Appointment Type *</span>
                      <select
                        name="serviceName"
                        value={formData.serviceName}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a service...</option>
                        <option value="Furnace Repair">Furnace Repair</option>
                        <option value="Furnace Installation">Furnace Installation</option>
                        <option value="AC Repair">AC Repair</option>
                        <option value="AC Installation">AC Installation</option>
                        <option value="System Check-Up / Tune-Up">System Check-Up / Tune-Up</option>
                        <option value="Emergency Service (24/7)">Emergency Service (24/7)</option>
                        <option value="Air Purification Installation">Air Purification Installation</option>
                        <option value="Zoning System Installation">Zoning System Installation</option>
                        <option value="Free In-Home Estimate">Free In-Home Estimate</option>
                      </select>
                    </label>
                  </div>

                  <div className="form-row two-col">
                    <label>
                      <span>Appointment Date *</span>
                      <input
                        type="date"
                        name="appointmentDate"
                        value={formData.appointmentDate}
                        onChange={handleChange}
                        required
                      />
                    </label>
                    <label>
                      <span>Appointment Time *</span>
                      <input
                        type="time"
                        name="appointmentTime"
                        value={formData.appointmentTime}
                        onChange={handleChange}
                        required
                      />
                    </label>
                  </div>

                  <div className="form-row two-col">
                    <label>
                      <span>Client Name *</span>
                      <input
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleChange}
                        placeholder="Full name"
                        required
                      />
                    </label>
                    <label>
                      <span>Client Phone *</span>
                      <input
                        type="tel"
                        name="clientPhone"
                        value={formData.clientPhone}
                        onChange={handleChange}
                        placeholder="(440) 555-0123"
                        required
                      />
                    </label>
                  </div>

                  <div className="form-row two-col">
                    <label>
                      <span>Reminder Timing</span>
                      <select name="reminderTime" value={formData.reminderTime} onChange={handleChange}>
                        <option value="1">1 hour before</option>
                        <option value="2">2 hours before</option>
                        <option value="24">24 hours before</option>
                        <option value="48">48 hours before</option>
                        <option value="168">1 week before</option>
                      </select>
                    </label>
                    <label>
                      <span>Message Type</span>
                      <select name="messageType" value={formData.messageType} onChange={handleChange}>
                        <option value="sms">SMS Only</option>
                        <option value="email">Email Only</option>
                        <option value="both">SMS & Email</option>
                      </select>
                    </label>
                  </div>

                  <button type="submit" className="primary">Set Up Reminders</button>
                </form>
              </section>

              <section className="ai-composer-card">
                <div className="card-header">
                  <h2>✏️ AI Message Assistant</h2>
                  <span className="pill pill-orange">AI Powered</span>
                </div>
                <p className="ai-description">
                  Generate a personalized SMS reminder message using AI. Fill in the
                  service type and client name above, then click below.
                </p>
                <button
                  className="secondary ai-generate-btn"
                  onClick={handleAiGenerate}
                  disabled={aiLoading}
                >
                  {aiLoading ? "⏳ Generating..." : "✏️ Generate Reminder Message"}
                </button>
                {aiError && <p className="ai-error">{aiError}</p>}
                {aiMessage && (
                  <div className="ai-result">
                    <h4>Draft Message</h4>
                    <div className="message-preview">
                      <p>{aiMessage}</p>
                    </div>
                    <button
                      className="copy-btn"
                      onClick={() => { navigator.clipboard?.writeText(aiMessage); }}
                    >
                      Copy Message
                    </button>
                  </div>
                )}
              </section>
            </>
          )}

          <section className="features">
            <div className="feature">
              <div className="feature-icon">📲</div>
              <h3>Text Reminders</h3>
              <p>Automatic SMS notifications sent before your appointment. Never miss a service visit.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">✓</div>
              <h3>Confirm or Cancel</h3>
              <p>Clients can confirm or cancel with a simple text reply — no app to download.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🔧</div>
              <h3>HVAC Expertise</h3>
              <p>Backed by three generations of Blank Heating quality and NATE-certified technicians.</p>
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="footer-logo">
            <img src={blankHeatingLogo} alt="Blank Heating Company Inc" className="footer-logo-img" />
          </div>
          <div className="footer-badges">
            <HeritageBadge />
            <NateBadge />
          </div>
          <p className="footer-tagline">Keeping Ashtabula Comfortable Since 1954</p>
          <p className="footer-license">OH LIC #25138</p>
          <p className="footer-phone">
            <a href="tel:4409691760">(440) 969-1760</a> • 24/7 Emergency Service
          </p>
          <p className="footer-copy">
            Blank Heating Company Inc • Family-Owned & Operated • Ashtabula, OH
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;

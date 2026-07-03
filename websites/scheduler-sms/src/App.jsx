import { useState } from "react";
import "./App.css";

// SMS/Message Icon Logo
const LogoIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-icon">
    <rect x="8" y="12" width="48" height="40" rx="6" fill="#8b5cf6" stroke="#7c3aed" strokeWidth="2"/>
    <path d="M20 28h24M20 36h16" stroke="#ffffff" strokeWidth="3" strokeLinecap="round"/>
    <path d="M16 52l8-8h28" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="52" cy="20" r="3" fill="#34d399"/>
  </svg>
);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="page">
      <div className="background-pattern" aria-hidden="true">
        <svg className="bg-pattern" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="smsPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect x="10" y="10" width="20" height="16" rx="3" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.1"/>
              <circle cx="45" cy="45" r="4" fill="#8b5cf6" opacity="0.08"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#smsPattern)"/>
        </svg>
      </div>

      <div className="container">
        <header className="header">
          <div className="brand">
            <LogoIcon />
            <div className="brand-text">
              <span className="brand-name">Scheduler SMS</span>
              <span className="brand-tagline">Appointment Reminders</span>
            </div>
          </div>
        </header>

        <main className="main-content">
          <section className="hero-card">
            <div className="hero-content">
              <p className="eyebrow">Automated Messaging</p>
              <h1>SMS Appointment Reminders</h1>
              <p className="sub">Reduce no-shows with automated text and email reminders. Set up once, and we'll handle the rest.</p>
              
              <div className="trust">
                <span className="trust-item"><MessageIcon /> Text Messages</span>
                <span className="trust-item"><BellIcon /> Auto Reminders</span>
                <span className="trust-item"><SmartphoneIcon /> Mobile Friendly</span>
              </div>
            </div>
            
            <div className="input-card">
              <h3>Need Help?</h3>
              <p className="quote-text">Support available 24/7</p>
              <button className="secondary">(440) 555-0188</button>
            </div>
          </section>

          {submitted ? (
            <section className="result-card success">
              <div className="success-icon">✓</div>
              <h2>Reminder Set Up!</h2>
              <p>SMS reminders have been configured for this appointment. The client will receive notifications at the scheduled times.</p>
              <button className="primary" onClick={() => setSubmitted(false)}>Set Up Another</button>
            </section>
          ) : (
            <section className="form-card">
              <div className="card-header">
                <h2>Configure Reminders</h2>
                <span className="pill">SMS Service</span>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <label>
                    <span>Service/Appointment Name *</span>
                    <input 
                      type="text"
                      name="serviceName" 
                      value={formData.serviceName}
                      onChange={handleChange}
                      placeholder="e.g., Annual Checkup, Consultation"
                      required
                    />
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

                <div className="info-box">
                  <h4>📱 Sample Message</h4>
                  <p>"Hi {formData.clientName || '[Name]'}, this is a reminder of your {formData.serviceName || '[appointment]'} on {formData.appointmentDate || '[date]'} at {formData.appointmentTime || '[time]'}. Reply CONFIRM to confirm or CANCEL to cancel."</p>
                </div>

                <button type="submit" className="primary">Set Up Reminders</button>
              </form>
            </section>
          )}

          <section className="features">
            <div className="feature">
              <div className="feature-icon">📲</div>
              <h3>Text Reminders</h3>
              <p>Automatic SMS notifications sent at your chosen intervals.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">✓</div>
              <h3>Confirmations</h3>
              <p>Clients can confirm or cancel with a simple text reply.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📊</div>
              <h3>Delivery Reports</h3>
              <p>Track message delivery and client responses in real-time.</p>
            </div>
          </section>
        </main>

        <footer className="footer">
          <p>Automated SMS Reminder Service</p>
          <p>Helping businesses reduce no-shows in Ashtabula County</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

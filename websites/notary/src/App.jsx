import { useState } from "react";
import "./App.css";

// Notary Seal Icon
const LogoIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-icon">
    <circle cx="32" cy="32" r="28" fill="#4f46e5" stroke="#3730a3" strokeWidth="2"/>
    <circle cx="32" cy="32" r="20" fill="none" stroke="#ffffff" strokeWidth="2"/>
    <text x="32" y="28" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">NOTARY</text>
    <text x="32" y="40" textAnchor="middle" fill="#ffffff" fontSize="6">PUBLIC</text>
    <path d="M32 8v4M32 52v4M8 32h4M52 32h4" stroke="#c0c0c0" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

function App() {
  const [formData, setFormData] = useState({
    serviceType: "general",
    date: "",
    time: "",
    location: "",
    name: "",
    email: "",
    phone: "",
    notes: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const serviceTypes = [
    { value: "general", label: "General Notarization" },
    { value: "loan", label: "Loan Signing" },
    { value: "real-estate", label: "Real Estate Documents" },
    { value: "power-of-attorney", label: "Power of Attorney" },
    { value: "wills", label: "Wills & Trusts" },
    { value: "affidavit", label: "Affidavits" }
  ];

  return (
    <div className="page">
      <div className="background-pattern" aria-hidden="true">
        <svg className="bg-pattern" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="notaryPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="15" fill="none" stroke="#4f46e5" strokeWidth="1" opacity="0.08"/>
              <circle cx="40" cy="40" r="8" fill="none" stroke="#3730a3" strokeWidth="1" opacity="0.06"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#notaryPattern)"/>
        </svg>
      </div>

      <div className="container">
        <header className="header">
          <div className="brand">
            <LogoIcon />
            <div className="brand-text">
              <span className="brand-name">Mobile Notary</span>
              <span className="brand-tagline">Professional Services</span>
            </div>
          </div>
        </header>

        <main className="main-content">
          <section className="hero-card">
            <div className="hero-content">
              <p className="eyebrow">Licensed & Bonded</p>
              <h1>Notary Services at Your Location</h1>
              <p className="sub">Professional mobile notary services throughout Ashtabula County. We come to your home, office, or any convenient location.</p>
              
              <div className="trust">
                <span className="trust-item"><ClockIcon /> Same Day Service</span>
                <span className="trust-item"><MapPinIcon /> We Come to You</span>
                <span className="trust-item"><ShieldIcon /> Licensed & Insured</span>
              </div>
            </div>
            
            <div className="input-card">
              <h3>Need It Now?</h3>
              <p className="quote-text">Emergency notary available</p>
              <button className="secondary">Call (440) 555-0199</button>
            </div>
          </section>

          {submitted ? (
            <section className="result-card success">
              <div className="success-icon">✓</div>
              <h2>Booking Confirmed!</h2>
              <p>Thank you for your booking request. A mobile notary will contact you shortly to confirm your appointment details.</p>
              <button className="primary" onClick={() => setSubmitted(false)}>Book Another Appointment</button>
            </section>
          ) : (
            <section className="form-card">
              <div className="card-header">
                <h2>Schedule Appointment</h2>
                <span className="pill">Online Booking</span>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <label>
                    <span>Service Type *</span>
                    <select name="serviceType" value={formData.serviceType} onChange={handleChange} required>
                      {serviceTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="form-row two-col">
                  <label>
                    <span>Preferred Date *</span>
                    <input 
                      type="date"
                      name="date" 
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label>
                    <span>Preferred Time *</span>
                    <input 
                      type="time"
                      name="time" 
                      value={formData.time}
                      onChange={handleChange}
                      required
                    />
                  </label>
                </div>

                <div className="form-row">
                  <label>
                    <span>Service Location *</span>
                    <input 
                      type="text"
                      name="location" 
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Enter your address"
                      required
                    />
                  </label>
                </div>

                <div className="form-row two-col">
                  <label>
                    <span>Your Name *</span>
                    <input 
                      type="text"
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full name"
                      required
                    />
                  </label>
                  <label>
                    <span>Phone *</span>
                    <input 
                      type="tel"
                      name="phone" 
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(440) 555-0123"
                      required
                    />
                  </label>
                </div>

                <div className="form-row">
                  <label>
                    <span>Email *</span>
                    <input 
                      type="email"
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                    />
                  </label>
                </div>

                <div className="form-row">
                  <label>
                    <span>Additional Notes</span>
                    <textarea 
                      name="notes" 
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Any special requirements or document details..."
                      rows="3"
                    />
                  </label>
                </div>

                <button type="submit" className="primary">Book Appointment</button>
              </form>
            </section>
          )}

          <section className="features">
            <div className="feature">
              <div className="feature-icon">📋</div>
              <h3>All Documents</h3>
              <p>Wills, trusts, real estate, affidavits, powers of attorney, and more.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🚗</div>
              <h3>Mobile Service</h3>
              <p>We travel to your home, office, hospital, or any location in the county.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Confidential</h3>
              <p>Your documents and personal information are always protected.</p>
            </div>
          </section>
        </main>

        <footer className="footer">
          <p>Licensed Notary Public - State of Ohio</p>
          <p>Serving Ashtabula County and surrounding areas</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

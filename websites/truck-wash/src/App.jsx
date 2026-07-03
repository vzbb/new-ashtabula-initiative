import { useState } from "react";
import "./App.css";

// Truck/Water Logo
const LogoIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-icon">
    <rect x="8" y="20" width="40" height="24" rx="3" fill="#0ea5e9" stroke="#0284c7" strokeWidth="2"/>
    <rect x="48" y="28" width="12" height="16" rx="2" fill="#38bdf8"/>
    <circle cx="18" cy="48" r="5" fill="#334155"/>
    <circle cx="46" cy="48" r="5" fill="#334155"/>
    <path d="M12 28h20M12 36h15" stroke="#e0f2fe" strokeWidth="2" strokeLinecap="round"/>
    <path d="M52 12c0 0-4 4-4 8s4 4 4 4" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <path d="M58 8c0 0-3 3-3 6s3 3 3 3" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
  </svg>
);

const DropletIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

function App() {
  const [formData, setFormData] = useState({
    fleetSize: "1",
    washType: "exterior",
    date: "",
    time: "",
    company: "",
    name: "",
    email: "",
    phone: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const washTypes = [
    { value: "exterior", label: "Exterior Wash - $45", price: 45 },
    { value: "deluxe", label: "Deluxe Wash - $65", price: 65 },
    { value: "premium", label: "Premium Detail - $95", price: 95 },
    { value: "fleet", label: "Fleet Service - Quote", price: 0 }
  ];

  const calculateEstimate = () => {
    const type = washTypes.find(t => t.value === formData.washType);
    if (!type || type.value === "fleet") return "Quote";
    const total = type.price * parseInt(formData.fleetSize);
    return `$${total}`;
  };

  return (
    <div className="page">
      <div className="background-pattern" aria-hidden="true">
        <svg className="bg-pattern" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="washPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="20" fill="none" stroke="#0ea5e9" strokeWidth="1" opacity="0.1"/>
              <path d="M50 30v40M30 50h40" stroke="#0ea5e9" strokeWidth="1" opacity="0.08"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#washPattern)"/>
        </svg>
      </div>

      <div className="container">
        <header className="header">
          <div className="brand">
            <LogoIcon />
            <div className="brand-text">
              <span className="brand-name">Truck Wash</span>
              <span className="brand-tagline">Professional Fleet Cleaning</span>
            </div>
          </div>
        </header>

        <main className="main-content">
          <section className="hero-card">
            <div className="hero-content">
              <p className="eyebrow">Fleet Services</p>
              <h1>Keep Your Fleet Looking Professional</h1>
              <p className="sub">Complete truck washing services for individual vehicles and fleets. Interior and exterior cleaning with eco-friendly products.</p>
              
              <div className="trust">
                <span className="trust-item"><DropletIcon /> Eco-Friendly</span>
                <span className="trust-item"><ClockIcon /> Fast Service</span>
                <span className="trust-item"><StarIcon /> Premium Quality</span>
              </div>
            </div>
            
            <div className="input-card">
              <h3>Quick Quote</h3>
              <p className="quote-text">Fleet discounts available</p>
              <button className="secondary">Call (440) 555-0155</button>
            </div>
          </section>

          {submitted ? (
            <section className="result-card success">
              <div className="success-icon">✓</div>
              <h2>Booking Confirmed!</h2>
              <p>Thank you for your truck wash booking. We've received your request and will confirm your appointment shortly.</p>
              <button className="primary" onClick={() => setSubmitted(false)}>Book Another Wash</button>
            </section>
          ) : (
            <section className="form-card">
              <div className="card-header">
                <h2>Schedule Truck Wash</h2>
                <span className="pill">Online Booking</span>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="form-row two-col">
                  <label>
                    <span>Number of Vehicles *</span>
                    <input 
                      type="number"
                      name="fleetSize" 
                      value={formData.fleetSize}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </label>
                  <label>
                    <span>Wash Package *</span>
                    <select name="washType" value={formData.washType} onChange={handleChange} required>
                      {washTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="estimate-box">
                  <span className="estimate-label">Estimated Total:</span>
                  <span className="estimate-value">{calculateEstimate()}</span>
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
                    <select name="time" value={formData.time} onChange={handleChange} required>
                      <option value="">Select time</option>
                      <option value="morning">Morning (8am-12pm)</option>
                      <option value="afternoon">Afternoon (12pm-5pm)</option>
                      <option value="evening">Evening (5pm-8pm)</option>
                    </select>
                  </label>
                </div>

                <div className="form-row">
                  <label>
                    <span>Company Name</span>
                    <input 
                      type="text"
                      name="company" 
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your company name"
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

                <button type="submit" className="primary">Book Truck Wash</button>
              </form>
            </section>
          )}

          <section className="features">
            <div className="feature">
              <div className="feature-icon">🚚</div>
              <h3>All Truck Sizes</h3>
              <p>From pickup trucks to semi-trailers, we handle vehicles of all sizes.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💧</div>
              <h3>Eco-Friendly</h3>
              <p>Water reclamation systems and biodegradable cleaning products.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">⭐</div>
              <h3>Detail Quality</h3>
              <p>Hand wash and detail service for a showroom-quality finish.</p>
            </div>
          </section>
        </main>

        <footer className="footer">
          <p>Professional Truck Wash Services</p>
          <p>Serving Ashtabula County and Northeast Ohio</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

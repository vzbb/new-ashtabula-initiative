import { useState } from "react";
import "./App.css";

// Gear Icon Logo
const LogoIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-icon">
    <circle cx="32" cy="32" r="16" fill="#5d6d7e" stroke="#34495e" strokeWidth="2"/>
    <circle cx="32" cy="32" r="8" fill="#ecf0f1"/>
    <path d="M32 8v8M32 48v8M8 32h8M48 32h8M15 15l6 6M43 43l6 6M15 49l6-6M43 21l6-6" stroke="#5d6d7e" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

const ClipboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
  </svg>
);

const TruckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

function App() {
  const [formData, setFormData] = useState({
    partDescription: "",
    partNumber: "",
    quantity: "1",
    name: "",
    email: "",
    phone: "",
    company: "",
    priority: "standard"
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
        <svg className="gear-bg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="gearPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="20" fill="none" stroke="#5d6d7e" strokeWidth="1" opacity="0.15"/>
              <circle cx="50" cy="50" r="12" fill="none" stroke="#bdc3c7" strokeWidth="1" opacity="0.1"/>
              <path d="M50 25v10M50 65v10M25 50h10M65 50h10" stroke="#5d6d7e" strokeWidth="2" opacity="0.1" strokeLinecap="round"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gearPattern)"/>
        </svg>
      </div>

      <div className="container">
        <header className="header">
          <div className="brand">
            <LogoIcon />
            <div className="brand-text">
              <span className="brand-name">Parts Request</span>
              <span className="brand-tagline">Custom Parts Sourcing</span>
            </div>
          </div>
        </header>

        <main className="main-content">
          <section className="hero-card">
            <div className="hero-content">
              <p className="eyebrow">Custom Sourcing</p>
              <h1>Can't Find the Part You Need?</h1>
              <p className="sub">Submit a custom parts request and our team will source it for you. We specialize in hard-to-find industrial and automotive parts.</p>
              
              <div className="trust">
                <span className="trust-item"><ClipboardIcon /> Request Tracking</span>
                <span className="trust-item"><TruckIcon /> Fast Delivery</span>
                <span className="trust-item"><PhoneIcon /> Expert Support</span>
              </div>
            </div>
            
            <div className="input-card">
              <h3>Quick Quote</h3>
              <p className="quote-text">Get a quote within 24 hours</p>
              <button className="secondary">Call (440) 555-0123</button>
            </div>
          </section>

          {submitted ? (
            <section className="result-card success">
              <div className="success-icon">✓</div>
              <h2>Request Submitted!</h2>
              <p>Thank you for your parts request. Our team will review your submission and contact you within 24 hours with availability and pricing.</p>
              <button className="primary" onClick={() => setSubmitted(false)}>Submit Another Request</button>
            </section>
          ) : (
            <section className="form-card">
              <div className="card-header">
                <h2>Part Request Form</h2>
                <span className="pill">Free Quote</span>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <label>
                    <span>Part Description *</span>
                    <textarea 
                      name="partDescription" 
                      value={formData.partDescription}
                      onChange={handleChange}
                      placeholder="Describe the part you need (e.g., Hydraulic pump for 2018 Caterpillar excavator)"
                      required
                      rows="3"
                    />
                  </label>
                </div>
                
                <div className="form-row two-col">
                  <label>
                    <span>Part Number (if known)</span>
                    <input 
                      type="text"
                      name="partNumber" 
                      value={formData.partNumber}
                      onChange={handleChange}
                      placeholder="e.g., CAT-12345"
                    />
                  </label>
                  <label>
                    <span>Quantity *</span>
                    <input 
                      type="number"
                      name="quantity" 
                      value={formData.quantity}
                      onChange={handleChange}
                      min="1"
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
                      placeholder="John Smith"
                      required
                    />
                  </label>
                  <label>
                    <span>Company</span>
                    <input 
                      type="text"
                      name="company" 
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Acme Industries"
                    />
                  </label>
                </div>

                <div className="form-row two-col">
                  <label>
                    <span>Email *</span>
                    <input 
                      type="email"
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
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
                    <span>Priority Level</span>
                    <select name="priority" value={formData.priority} onChange={handleChange}>
                      <option value="standard">Standard (3-5 days)</option>
                      <option value="expedited">Expedited (1-2 days)</option>
                      <option value="emergency">Emergency (Same day)</option>
                    </select>
                  </label>
                </div>

                <button type="submit" className="primary">Submit Request</button>
              </form>
            </section>
          )}

          <section className="features">
            <div className="feature">
              <div className="feature-icon">🔍</div>
              <h3>Expert Sourcing</h3>
              <p>Our team has access to nationwide parts databases and supplier networks.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <h3>Fast Response</h3>
              <p>Get quotes within 24 hours for standard requests.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">✓</div>
              <h3>Quality Guaranteed</h3>
              <p>All parts are verified for compatibility and quality.</p>
            </div>
          </section>
        </main>

        <footer className="footer">
          <p>Ashtabula Area Chamber of Commerce</p>
          <p>Building business connections in Ashtabula County, OH</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

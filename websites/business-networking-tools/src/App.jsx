import React from 'react';
import './index.css';
import './App.css';

function App() {
  return (
    <div className="page">
      <header className="hero">
        <div className="hero-content">
          <div className="logo-header">
            <svg className="logo-icon" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fillRule="evenodd">
                <path d="M10 20 L25 12 L40 20 L55 16 L70 20" stroke="#d4af37" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="10" cy="20" r="4" fill="#003366" stroke="#d4af37" strokeWidth="1.5"/>
                <circle cx="25" cy="12" r="4" fill="#003366" stroke="#d4af37" strokeWidth="1.5"/>
                <circle cx="40" cy="20" r="4" fill="#003366" stroke="#d4af37" strokeWidth="1.5"/>
                <circle cx="55" cy="16" r="3" fill="#003366" stroke="#d4af37" strokeWidth="1.5"/>
                <circle cx="70" cy="20" r="4" fill="#003366" stroke="#d4af37" strokeWidth="1.5"/>
              </g>
            </svg>
            <div className="logo-text">
              <div className="logo-title">Ashtabula Chamber</div>
              <div className="logo-subtitle">BUSINESS NETWORK</div>
            </div>
          </div>
          
          <p className="eyebrow">Connect • Collaborate • Grow</p>
          <h1>Business Networking Tools</h1>
          <p className="sub">Connect with fellow Chamber members, discover partnership opportunities, and grow your business through strategic networking.</p>
          
          <div className="hero-actions">
            <button className="primary">Join Network</button>
            <button className="ghost">Explore Members</button>
          </div>
          
          <div className="trust">
            <span>🤝 200+ Members</span>
            <span>📅 Monthly Events</span>
            <span>💼 B2B Matches</span>
          </div>
        </div>
      </header>

      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🔗</div>
          <h3>Member Directory</h3>
          <p>Browse our comprehensive directory of Chamber members. Filter by industry, location, and services offered.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🤝</div>
          <h3>Smart Matching</h3>
          <p>Our AI-powered matching system connects you with complementary businesses for partnerships and referrals.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">📅</div>
          <h3>Events & Meetups</h3>
          <p>Discover networking events, business mixers, and industry meetups happening in Ashtabula County.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">💬</div>
          <h3>Discussion Forums</h3>
          <p>Join industry-specific discussion groups, share insights, and get advice from fellow business owners.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">📢</div>
          <h3>Business Opportunities</h3>
          <p>Post and discover RFPs, subcontracting opportunities, and partnership requests from local businesses.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🏆</div>
          <h3>Success Stories</h3>
          <p>Read about successful Chamber partnerships and learn how networking has helped local businesses grow.</p>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">200+</div>
            <div className="stat-label">Active Members</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Industries</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24</div>
            <div className="stat-label">Annual Events</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">150+</div>
            <div className="stat-label">B2B Matches</div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Expand Your Network?</h2>
        <p>Join the Ashtabula Chamber business network today and start building valuable connections.</p>
        <button className="primary">Get Started</button>
      </section>

      <footer className="footer">
        <p>© 2026 Ashtabula Area Chamber of Commerce. Building business connections that matter.</p>
      </footer>
    </div>
  );
}

export default App;
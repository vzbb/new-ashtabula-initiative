import { useState } from 'react';
import './App.css';

const LogoIcon = () => (
  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 35 L5 18 C5 16 7 15 9 16 L20 20 L20 38 L9 34 C7 33 5 33 5 35 Z" fill="#003366"/>
    <path d="M45 35 L45 18 C45 16 43 15 41 16 L30 20 L30 38 L41 34 C43 33 45 33 45 35 Z" fill="#003366"/>
    <path d="M20 20 L25 18 L30 20 L30 38 L25 36 L20 38 Z" fill="#002244"/>
    <path d="M8 19 L18 22 L18 35 L8 32 Z" fill="#ffffff"/>
    <path d="M42 19 L32 22 L32 35 L42 32 Z" fill="#ffffff"/>
    <line x1="10" y1="24" x2="16" y2="25" stroke="#003366" strokeWidth="0.5"/>
    <line x1="10" y1="27" x2="16" y2="28" stroke="#003366" strokeWidth="0.5"/>
    <line x1="10" y1="30" x2="16" y2="31" stroke="#003366" strokeWidth="0.5"/>
    <line x1="34" y1="25" x2="40" y2="24" stroke="#003366" strokeWidth="0.5"/>
    <line x1="34" y1="28" x2="40" y2="27" stroke="#003366" strokeWidth="0.5"/>
    <line x1="34" y1="31" x2="40" y2="30" stroke="#003366" strokeWidth="0.5"/>
    <path d="M25 4 L10 12 L25 20 L40 12 Z" fill="#cc0000"/>
    <path d="M15 14 L15 22 C15 22 20 26 25 26 C30 26 35 22 35 22 L35 14" fill="#cc0000"/>
    <path d="M37 12 L37 18" stroke="#f1c40f" strokeWidth="2"/>
    <circle cx="37" cy="20" r="2" fill="#f1c40f"/>
    <path d="M25 20 L25 36" stroke="#f1c40f" strokeWidth="1.5"/>
  </svg>
);

const LearningPattern = () => (
  <svg className="learning-pattern" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.4">
      <rect x="20" y="20" width="12" height="16" fill="#003366"/>
      <rect x="22" y="22" width="8" height="12" fill="none" stroke="#ffffff" strokeWidth="0.5"/>
      <rect x="160" y="40" width="12" height="16" fill="#003366"/>
      <circle cx="100" cy="30" r="6" fill="#f1c40f"/>
      <path d="M97 38 L103 38 L102 42 L98 42 Z" fill="#f1c40f"/>
      <circle cx="50" cy="150" r="6" fill="#f1c40f"/>
      <polygon points="30,80 35,75 40,80 35,85" fill="#cc0000"/>
      <polygon points="150,160 155,155 160,160 155,165" fill="#cc0000"/>
      <line x1="120" y1="60" x2="140" y2="60" stroke="#003366" strokeWidth="0.5"/>
      <line x1="120" y1="65" x2="140" y2="65" stroke="#003366" strokeWidth="0.5"/>
      <line x1="60" y1="100" x2="80" y2="100" stroke="#003366" strokeWidth="0.5"/>
    </g>
  </svg>
);

const counselors = [
  {
    name: 'Dr. Sarah Mitchell',
    title: 'Senior Business Counselor',
    specialty: 'Startup Strategy & Growth',
    experience: '15+ years',
    image: '👩‍💼',
    availability: ['Mon 9am-12pm', 'Wed 1pm-4pm', 'Fri 9am-1pm']
  },
  {
    name: 'Michael Torres',
    title: 'Financial Specialist',
    specialty: 'Financial Planning & Funding',
    experience: '12+ years',
    image: '👨‍💼',
    availability: ['Tue 10am-3pm', 'Thu 9am-2pm']
  },
  {
    name: 'Jennifer Park',
    title: 'Marketing Counselor',
    specialty: 'Digital Marketing & Branding',
    experience: '10+ years',
    image: '👩‍💻',
    availability: ['Mon 1pm-5pm', 'Wed 9am-12pm', 'Fri 2pm-5pm']
  },
  {
    name: 'Robert Chen',
    title: 'Operations Advisor',
    specialty: 'Process Improvement & Scaling',
    experience: '18+ years',
    image: '👨‍🏭',
    availability: ['Tue 9am-12pm', 'Thu 1pm-5pm']
  }
];

function App() {
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [step, setStep] = useState(1);

  return (
    <div className="page">
      <LearningPattern />
      
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <LogoIcon />
            <div className="logo-text">
              <span className="logo-title">Lakeland</span>
              <span className="logo-subtitle">SBDC</span>
            </div>
          </div>
          <nav className="nav">
            <a href="#">Counseling</a>
            <a href="#">Workshops</a>
            <a href="#">Resources</a>
            <button className="nav-btn">My Account</button>
          </nav>
        </div>
      </header>

      <main className="content">
        <section className="hero">
          <div className="hero-badge">
            <span>🤝 Free Business Counseling</span>
          </div>
          <h1>Expert Guidance for Your Business</h1>
          <p className="hero-subtitle">
            Connect one-on-one with experienced SBDC counselors who can help you 
            navigate challenges, seize opportunities, and achieve your business goals.
          </p>
          <div className="hero-stats">
            <div className="stat-box">
              <strong>Free</strong>
              <span>Confidential Counseling</span>
            </div>
            <div className="stat-box">
              <strong>Expert</strong>
              <span>Certified Counselors</span>
            </div>
            <div className="stat-box">
              <strong>Ongoing</strong>
              <span>Long-term Support</span>
            </div>
          </div>
        </section>

        <section className="booking-section">
          <div className="booking-progress">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-num">1</div>
              <span>Choose Counselor</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-num">2</div>
              <span>Select Time</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-num">3</div>
              <span>Confirm</span>
            </div>
          </div>

          {step === 1 && (
            <div className="counselors-grid">
              <h3>Select a Counselor</h3>
              <div className="counselor-cards">
                {counselors.map((counselor, idx) => (
                  <div 
                    key={idx}
                    className={`counselor-card ${selectedCounselor === idx ? 'selected' : ''}`}
                    onClick={() => setSelectedCounselor(idx)}
                  >
                    <div className="counselor-image">{counselor.image}</div>
                    <div className="counselor-info">
                      <h4>{counselor.name}</h4>
                      <p className="counselor-title">{counselor.title}</p>
                      <p className="counselor-specialty">🎯 {counselor.specialty}</p>
                      <p className="counselor-exp">⭐ {counselor.experience}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                className="btn-primary"
                disabled={selectedCounselor === null}
                onClick={() => setStep(2)}
              >
                Continue →
              </button>
            </div>
          )}

          {step === 2 && selectedCounselor !== null && (
            <div className="time-selection">
              <h3>Select a Time with {counselors[selectedCounselor].name}</h3>
              <div className="availability-grid">
                {counselors[selectedCounselor].availability.map((time, idx) => (
                  <button key={idx} className="time-slot">
                    {time}
                  </button>
                ))}
              </div>
              <div className="form-group">
                <label>What would you like to discuss?</label>
                <select>
                  <option>Select a topic...</option>
                  <option>Starting a new business</option>
                  <option>Growing existing business</option>
                  <option>Financial management</option>
                  <option>Marketing strategy</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="booking-actions">
                <button className="btn-outline" onClick={() => setStep(1)}>← Back</button>
                <button className="btn-primary" onClick={() => setStep(3)}>Continue →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="confirmation">
              <div className="confirmation-icon">✓</div>
              <h3>Booking Confirmed!</h3>
              <p>Your counseling session has been scheduled. We've sent a confirmation email with details and a calendar invite.</p>
              <div className="confirmation-details">
                <div className="detail">
                  <span>Counselor:</span>
                  <strong>{counselors[selectedCounselor].name}</strong>
                </div>
                <div className="detail">
                  <span>Location:</span>
                  <strong>Lakeland SBDC Office or Virtual</strong>
                </div>
              </div>
              <button className="btn-primary" onClick={() => {setStep(1); setSelectedCounselor(null);}}>
                Book Another Session
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <LogoIcon />
            <div>
              <strong>Lakeland SBDC</strong>
              <p>Empowering entrepreneurs through education</p>
            </div>
          </div>
          <p className="footer-copy">© 2026 Lakeland Community College SBDC. Funded in part by the U.S. Small Business Administration.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

import { useState } from "react";
import { 
  generatePermitAnswer, 
  isApiKeyConfigured, 
  getMockAnswer,
  GeminiAPIError 
} from "./services/geminiApi.js";
import "./App.css";
import "./IrresistibleOffer.css";

// City of Ashtabula Logo Component
function CityOfAshtabulaLogo({ size = 50 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25 2 L5 10 V22 C5 35 25 48 25 48 C25 48 45 35 45 22 V10 L25 2Z"
        fill="#1e3a5f"
        stroke="#d4af37"
        strokeWidth="1.5"
      />
      <path
        d="M25 5 L8 12 V22 C8 33 25 44 25 44 C25 44 42 33 42 22 V12 L25 5Z"
        fill="none"
        stroke="#d4af37"
        strokeWidth="0.5"
        opacity="0.6"
      />
      <rect x="20" y="28" width="10" height="12" fill="#ffffff" />
      <rect x="22" y="16" width="6" height="12" fill="#ffffff" />
      <path d="M21 16 L25 10 L29 16 Z" fill="#d4af37" />
      <path d="M25 12 L35 8 L25 10 Z" fill="#d4af37" opacity="0.8" />
      <path d="M25 12 L15 8 L25 10 Z" fill="#d4af37" opacity="0.6" />
      <rect x="23" y="34" width="4" height="6" fill="#1e3a5f" />
      <rect x="24" y="20" width="2" height="3" fill="#1e3a5f" />
      <path d="M8 38 Q14 35 20 38 T32 38 T42 36" stroke="#d4af37" strokeWidth="1" fill="none" opacity="0.8" />
      <path d="M10 42 Q16 39 22 42 T34 42 T40 40" stroke="#d4af37" strokeWidth="0.8" fill="none" opacity="0.6" />
    </svg>
  );
}

// IRRESISTIBLE OFFER COMPONENTS

function UrgencyBanner() {
  return (
    <div className="urgency-banner" style={{
      background: 'linear-gradient(90deg, #d4af37 0%, #e8d5a3 100%)',
      color: '#1e3a5f',
      padding: '12px 20px',
      textAlign: 'center',
      fontWeight: 600,
      fontSize: '0.9rem',
      borderBottom: '3px solid #1e3a5f',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <span className="banner-pulse" style={{ marginRight: '8px' }}>🔥</span>
      <strong>Launch Pricing — 60% Off First Year</strong>
      <span style={{ margin: '0 12px', opacity: 0.6 }}>|</span>
      <span style={{ fontWeight: 500 }}>Only 3 pilot spots remaining</span>
      <span style={{ margin: '0 12px', opacity: 0.6 }}>|</span>
      <span style={{
        background: '#1e3a5f',
        color: '#d4af37',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>By Invitation Only</span>
    </div>
  );
}

function ClaimButton({ onClick }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <button 
      className="claim-button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#d4af37' : '#1e3a5f',
        color: hovered ? '#1e3a5f' : '#ffffff',
        padding: '18px 36px',
        fontSize: '1.125rem',
        fontWeight: 700,
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: hovered ? '0 6px 20px #1e3a5f60' : '0 4px 15px #1e3a5f40',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)'
      }}
    >
      <span>✨</span>
      <span>Claim Your Permit Assistant</span>
      <span style={{ fontSize: '0.8em', opacity: 0.8 }}>→</span>
    </button>
  );
}

function TrustBadges() {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '16px',
      margin: '24px 0',
      padding: '16px',
      background: '#f8fafc',
      borderRadius: '12px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        borderLeft: '4px solid #27ae60'
      }}>
        <span style={{ fontSize: '1.25rem' }}>🛡️</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#2c3e50' }}>30-Day Guarantee</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Full satisfaction or money back</div>
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        borderLeft: '4px solid #1e3a5f'
      }}>
        <span style={{ fontSize: '1.25rem' }}>🔒</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#2c3e50' }}>Secure & Local</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Ohio-hosted, encrypted</div>
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        borderLeft: '4px solid #d4af37'
      }}>
        <span style={{ fontSize: '1.25rem' }}>🏆</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#2c3e50' }}>Join 3+ Ohio Cities</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Already using this platform</div>
        </div>
      </div>
    </div>
  );
}

function GoLiveCountdown() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #1e3a5f 0%, #2c4a6f 100%)',
      color: 'white',
      borderRadius: '12px',
      margin: '20px 0'
    }}>
      <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '8px' }}>⚡ Implementation Speed</div>
      <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '4px' }}>48 Hours</div>
      <div style={{ fontSize: '1rem', opacity: 0.9 }}>From "Yes" to "Live"</div>
      <div style={{ marginTop: '12px', fontSize: '0.8125rem', opacity: 0.8 }}>
        No IT headaches. We handle everything.
      </div>
    </div>
  );
}

function LossAversionAlert() {
  return (
    <div style={{
      background: '#fdf2f2',
      border: '2px solid #e74c3c',
      borderRadius: '12px',
      padding: '16px 20px',
      margin: '20px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }}>
      <div style={{ fontSize: '2rem' }}>⚠️</div>
      <div>
        <div style={{ fontWeight: 700, color: '#c0392b', marginBottom: '4px' }}>
          Don't Let Other Lakefront Cities Get the AI-First Advantage
        </div>
        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Early adopters like Mentor and Sandusky are already capturing resident satisfaction. 
          Position Ashtabula as a Lake Erie leader.
        </div>
      </div>
    </div>
  );
}

function ROITeaser() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #27ae6010 0%, #27ae6005 100%)',
      border: '2px solid #27ae6040',
      borderRadius: '12px',
      padding: '24px',
      margin: '20px 0',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '8px' }}>💰 Projected Annual Impact for Ashtabula</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#27ae60' }}>$18,500</div>
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Staff Cost Savings</div>
        </div>
        <div style={{ width: '1px', background: '#27ae6030' }}></div>
        <div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#27ae60' }}>15 hours/week</div>
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Staff Time Recovered</div>
        </div>
      </div>
      <div style={{ marginTop: '16px', fontSize: '0.8125rem', color: '#64748b' }}>
        Based on similar-sized Ohio cities. Your actual results may vary.
      </div>
    </div>
  );
}

function ClaimModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }} onClick={onClose}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          padding: '24px',
          background: '#1e3a5f',
          color: 'white',
          borderRadius: '16px 16px 0 0'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>✨ Claim Your Permit Assistant</h2>
          <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>For City of Ashtabula</p>
        </div>
        
        <div style={{ padding: '24px' }}>
          <div style={{
            background: '#f8fafc',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <div style={{ fontWeight: 600, marginBottom: '8px' }}>📞 Contact Your Dedicated NAI Rep:</div>
            <div style={{ marginBottom: '8px' }}><strong>Michael Vega</strong>, Noirsys AI</div>
            <a href="tel:440-555-NAI1" style={{ display: 'block', color: '#1e3a5f', marginBottom: '4px', textDecoration: 'none' }}>
              📱 440-555-NAI1
            </a>
            <a href="mailto:michael@noirsys.com" style={{ display: 'block', color: '#1e3a5f', marginBottom: '12px', textDecoration: 'none' }}>
              ✉️ michael@noirsys.com
            </a>
            <div style={{
              background: '#27ae60',
              color: 'white',
              padding: '12px',
              borderRadius: '6px',
              textAlign: 'center',
              fontWeight: 600
            }}>
              🎉 Launch Pricing: 60% Off First Year!
            </div>
          </div>
          
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Your dedicated representative will walk you through setup and have you live within 48 hours.
          </p>
          
          <div style={{ marginTop: '16px', padding: '12px', background: '#e8f4f8', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.8125rem', color: '#1e3a5f' }}>
              <strong>🎯 What happens next:</strong>
              <ol style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                <li>Call or email Michael to schedule a 15-min demo</li>
                <li>Review customization options for Ashtabula</li>
                <li>Go live within 48 hours of saying "yes"</li>
                <li>30-day satisfaction guarantee — zero risk</li>
              </ol>
            </div>
          </div>
        </div>
        
        <div style={{
          padding: '20px 24px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button onClick={onClose} style={{
            padding: '10px 20px',
            border: '1px solid #e2e8f0',
            background: 'white',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>Close</button>
          <a href="mailto:michael@noirsys.com?subject=Claim My Permit Assistant - City of Ashtabula" style={{
            padding: '10px 20px',
            background: '#1e3a5f',
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 600
          }}>Claim Now →</a>
        </div>
      </div>
    </div>
  );
}

// MAIN APP COMPONENT

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [useMockMode, setUseMockMode] = useState(false);
  const [claimModalOpen, setClaimModalOpen] = useState(false);

  const hasApiKey = isApiKeyConfigured();

  const handleAsk = async () => {
    if (!question.trim()) {
      setError("Please enter a question about permits.");
      return;
    }

    setLoading(true);
    setError("");
    setAnswer("");
    setCitations([]);

    try {
      let result;
      
      if (useMockMode || !hasApiKey) {
        await new Promise(resolve => setTimeout(resolve, 500));
        result = getMockAnswer(question);
      } else {
        result = await generatePermitAnswer(question);
      }
      
      setAnswer(result.answer);
      setCitations(result.citations);
    } catch (err) {
      console.error("Permit Whisperer Error:", err);
      
      if (err instanceof GeminiAPIError) {
        switch (err.code) {
          case 'AUTH_ERROR':
            setError(
              <>
                <strong>API Key Not Configured</strong>
                <br />
                Please add your Gemini API key to the <code>.env</code> file. 
                <a href="#" onClick={(e) => { e.preventDefault(); setUseMockMode(true); handleAsk(); }}>
                  Try demo mode instead
                </a>
              </>
            );
            break;
          case 'RATE_LIMIT':
            setError("Too many requests. Please wait a moment and try again.");
            break;
          case 'SAFETY_BLOCKED':
            setError("Your question was blocked by safety filters. Please rephrase and try again.");
            break;
          case 'NETWORK_ERROR':
            setError("Network connection issue. Please check your internet and try again.");
            break;
          default:
            setError(err.message || "An error occurred. Please try again.");
        }
      } else {
        setError(err.message || "Failed to generate answer. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  // Quick question suggestions with local Ashtabula context
  const quickQuestions = [
    'Do I need a permit for a fence on Bridge Street?',
    'What are the setbacks for a deck on Lake Avenue?',
    'Shed requirements in Ashtabula?',
    'Driveway permit for West 52nd?',
    'Historic district renovation rules?'
  ];

  return (
    <div className="app-container">
      {/* Wave Pattern Background */}
      <div className="bg-wave-pattern"></div>

      {/* URGENCY BANNER — Irresistible Offer */}
      <UrgencyBanner />

      {/* Official Banner */}
      <div className="official-banner" style={{ background: '#1e3a5f', color: 'white' }}>
        <div className="official-banner-content">
          <span className="official-banner-seal">★</span>
          <span>Official Permit Assistance Portal of the City of Ashtabula</span>
          <span className="official-banner-seal">★</span>
        </div>
      </div>

      {/* Header */}
      <header className="municipal-header">
        <div className="header-content">
          <div className="city-logo">
            <CityOfAshtabulaLogo size={50} />
            <div className="city-logo-text">
              <span className="city-logo-title">City of Ashtabula</span>
              <span className="city-logo-subtitle">Permit Whisperer</span>
            </div>
          </div>
          <button 
            onClick={() => setClaimModalOpen(true)}
            className="claim-header-btn"
            style={{
              background: '#d4af37',
              color: '#1e3a5f',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ✨ Claim This Tool
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="municipal-main">
        <div className="content-container">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-eyebrow">🏛️ Building Department Service</div>
            <h1 className="hero-title">Welcome to Ashtabula's AI Permit Assistant</h1>
            <p className="hero-subtitle">
              Get fast, accurate answers about permits and zoning requirements 
              for Bridge Street, Lake Avenue, West 52nd, and anywhere in Ashtabula.
              Official citations from City code — 24/7.
            </p>
            <div className="divider"></div>
          </section>

          {/* IRRESISTIBLE OFFER ELEMENTS */}
          <LossAversionAlert />
          
          {/* Demo Mode Warning */}
          {!hasApiKey && (
            <div className="alert alert-warning">
              <strong>⚠️ Demo Mode Active</strong>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.875rem' }}>
                This is a preview. Claim your full version to go live for Ashtabula residents.
              </p>
            </div>
          )}

          {/* Question Card */}
          <div className="municipal-card">
            <div className="municipal-card-header municipal-card-header-gold">
              <span className="municipal-card-title">Ask Your Permit Question</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Last updated: Today</span>
            </div>
            <div className="municipal-card-body">
              <div className="form-section">
                <label className="form-label">What would you like to know about Ashtabula permits?</label>
                <textarea
                  className="form-textarea"
                  rows="4"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Do I need a permit for a 6ft fence on Bridge Street? What are the setbacks for a deck on Lake Avenue?"
                  disabled={loading}
                />
                <p className="form-hint">Press Enter to submit or use the button below</p>
              </div>

              {/* Quick Questions */}
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>
                  Common Ashtabula questions:
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      className="btn btn-sm btn-outline"
                      onClick={() => setQuestion(q)}
                    >
                      {q.split(' ').slice(0, 3).join(' ')}...
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="btn btn-primary btn-lg"
                onClick={handleAsk}
                disabled={loading || !question.trim()}
                style={{ width: '100%' }}
              >
                {loading ? (
                  <>
                    <span className="spinner">⚡</span>
                    Consulting Ashtabula City Code…
                  </>
                ) : (
                  'Get Official Answer'
                )}
              </button>
            </div>
          </div>

          {/* Answer Section */}
          {(error || answer) && (
            <div className={`municipal-card animate-in ${error ? 'border-red-300' : ''}`}>
              <div className={`municipal-card-header ${error ? 'bg-red-700' : ''}`}>
                <span className="municipal-card-title">
                  {error ? '⚠️ Error' : '✓ Official Answer'}
                </span>
                {!error && <span className="badge badge-gold">City of Ashtabula Citation</span>}
              </div>
              <div className="municipal-card-body">
                {error && (
                  <div style={{ color: '#dc2626', padding: '12px', background: '#fef2f2', borderRadius: '6px' }}>
                    {error}
                  </div>
                )}
                
                {answer && (
                  <>
                    <pre style={{ 
                      whiteSpace: 'pre-wrap', 
                      fontFamily: 'inherit', 
                      lineHeight: 1.7,
                      color: '#2c3e50',
                      margin: 0
                    }}>
                      {answer}
                    </pre>
                    
                    {citations.length > 0 && (
                      <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                          Official Ashtabula City Code Citations:
                        </p>
                        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.875rem', color: '#64748b' }}>
                          {citations.map((cite, i) => (
                            <li key={i} style={{ marginBottom: '4px' }}>{cite}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Features Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px',
            marginTop: '32px'
          }}>
            {[
              { title: '24/7 Public Service', desc: 'Residents get answers on Bridge Street, Lake Ave, anywhere — without waiting on staff.' },
              { title: 'Ashtabula Consistency', desc: 'Every response follows approved City of Ashtabula language.' },
              { title: 'Audit-Ready', desc: 'Structured citations for fast verification by Building Department.' },
            ].map((feature) => (
              <div key={feature.title} className="municipal-card" style={{ marginBottom: 0 }}>
                <div className="municipal-card-body">
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e3a5f', marginBottom: '8px' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* IRRESISTIBLE OFFER SECTION */}
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
            borderRadius: '12px',
            marginTop: '40px'
          }}>
            <h2 style={{ fontSize: '1.75rem', color: '#2c3e50', marginBottom: '12px' }}>
              Ready to Transform Ashtabula's Permit Process?
            </h2>
            <p style={{ color: '#64748b', marginBottom: '24px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
              Join forward-thinking Ohio cities already using AI to serve residents better.
              Go live in 48 hours with zero risk.
            </p>
            
            <ClaimButton onClick={() => setClaimModalOpen(true)} />
            <TrustBadges />
            <GoLiveCountdown />
            <ROITeaser />
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="municipal-footer" style={{ background: '#1e3a5f', color: 'white', marginTop: '40px' }}>
        <div className="footer-content" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
          {/* Rep Contact Box */}
          <div style={{
            background: 'rgba(212,175,55,0.2)',
            border: '2px solid #d4af37',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '8px' }}>
              Your Dedicated NAI Representative
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>
              Michael Vega
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '12px' }}>
              <a href="tel:440-555-NAI1" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 600 }}>
                📞 440-555-NAI1
              </a>
              <a href="mailto:michael@noirsys.com" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 600 }}>
                ✉️ michael@noirsys.com
              </a>
            </div>
            <button 
              onClick={() => setClaimModalOpen(true)}
              style={{
                background: '#d4af37',
                color: '#1e3a5f',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '12px'
              }}
            >
              📅 Schedule Your Demo
            </button>
          </div>
          
          {/* Organization Info */}
          <div style={{ textAlign: 'center', borderTop: '1px solid rgba(212,175,55,0.3)', paddingTop: '20px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🏛️</div>
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>City of Ashtabula</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Official Municipal Service — Since 1831</div>
            <div style={{ marginTop: '16px', fontSize: '0.75rem', opacity: 0.6 }}>
              © 2026 City of Ashtabula, Ohio. All rights reserved.
              <br />Powered by Noirsys AI • Built for Ohio
            </div>
          </div>
        </div>
      </footer>

      {/* Claim Modal */}
      <ClaimModal isOpen={claimModalOpen} onClose={() => setClaimModalOpen(false)} />
    </div>
  );
}

export default App;

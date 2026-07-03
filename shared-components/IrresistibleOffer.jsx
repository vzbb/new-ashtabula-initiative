import React, { useState } from 'react';
import './IrresistibleOffer.css';

// =============================================================================
// URGENCY BANNER — "Launch Pricing — 60% Off First Year"
// =============================================================================

export function UrgencyBanner({ 
  discount = "60%",
  urgency = "Only 3 pilot spots remaining",
  colorScheme = "municipal"
}) {
  const colors = {
    municipal: { bg: "#d4af37", text: "#1e3a5f", accent: "#ffffff" },
    chamber: { bg: "#d4af37", text: "#003366", accent: "#ffffff" },
    sbdc: { bg: "#cc0000", text: "#ffffff", accent: "#f1c40f" },
    county: { bg: "#ffd700", text: "#003f87", accent: "#ffffff" }
  };
  
  const c = colors[colorScheme];
  
  return (
    <div className="urgency-banner" style={{
      background: `linear-gradient(90deg, ${c.bg} 0%, ${c.bg}dd 100%)`,
      color: c.text,
      padding: '12px 20px',
      textAlign: 'center',
      fontWeight: 600,
      fontSize: '0.9rem',
      borderBottom: `3px solid ${c.accent}`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <span className="banner-pulse" style={{ 
        display: 'inline-block',
        marginRight: '8px'
      }}>🔥</span>
      <strong>Launch Pricing — {discount} Off First Year</strong>
      <span style={{ margin: '0 12px', opacity: 0.6 }}>|</span>
      <span style={{ fontWeight: 500 }}>{urgency}</span>
      <span style={{ margin: '0 12px', opacity: 0.6 }}>|</span>
      <span className="by-invitation" style={{
        background: c.text,
        color: c.bg,
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

// =============================================================================
// CLAIM BUTTON — "Claim Your [TOOL]"
// =============================================================================

export function ClaimButton({ 
  toolName = "AI Assistant",
  colorScheme = "municipal",
  onClick,
  size = "large"
}) {
  const colors = {
    municipal: { bg: "#1e3a5f", hover: "#d4af37", text: "#ffffff", hoverText: "#1e3a5f" },
    chamber: { bg: "#003366", hover: "#d4af37", text: "#ffffff", hoverText: "#003366" },
    sbdc: { bg: "#003366", hover: "#cc0000", text: "#ffffff", hoverText: "#ffffff" },
    county: { bg: "#003f87", hover: "#ffd700", text: "#ffffff", hoverText: "#003f87" }
  };
  
  const sizes = {
    small: { padding: "10px 20px", fontSize: "0.875rem" },
    medium: { padding: "14px 28px", fontSize: "1rem" },
    large: { padding: "18px 36px", fontSize: "1.125rem" }
  };
  
  const c = colors[colorScheme];
  const s = sizes[size];
  const [hovered, setHovered] = useState(false);
  
  return (
    <button 
      className="claim-button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? c.hover : c.bg,
        color: hovered ? c.hoverText : c.text,
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: 700,
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: hovered 
          ? `0 6px 20px ${c.bg}60` 
          : `0 4px 15px ${c.bg}40`,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)'
      }}
    >
      <span>✨</span>
      <span>Claim Your {toolName}</span>
      <span style={{ fontSize: '0.8em', opacity: 0.8 }}>→</span>
    </button>
  );
}

// =============================================================================
// TRUST BADGES
// =============================================================================

export function TrustBadges({ 
  colorScheme = "municipal",
  orgType = "city"
}) {
  const orgText = {
    city: "Join 3+ Ohio Cities",
    chamber: "Join 12+ Chamber Members", 
    sbdc: "Join 500+ Entrepreneurs",
    county: "Join County Leaders"
  };
  
  return (
    <div className="trust-badges" style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '16px',
      margin: '24px 0',
      padding: '16px',
      background: '#f8fafc',
      borderRadius: '12px'
    }}>
      <div className="trust-badge" style={{
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
      
      <div className="trust-badge" style={{
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
      
      <div className="trust-badge" style={{
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
          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#2c3e50' }}>{orgText[orgType]}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Already using this platform</div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// GO LIVE COUNTDOWN
// =============================================================================

export function GoLiveCountdown({ 
  hours = 48,
  colorScheme = "municipal"
}) {
  const colors = {
    municipal: { bg: "#1e3a5f", accent: "#d4af37" },
    chamber: { bg: "#003366", accent: "#d4af37" },
    sbdc: { bg: "#003366", accent: "#cc0000" },
    county: { bg: "#003f87", accent: "#ffd700" }
  };
  
  const c = colors[colorScheme];
  
  return (
    <div className="go-live-section" style={{
      textAlign: 'center',
      padding: '20px',
      background: `linear-gradient(135deg, ${c.bg} 0%, ${c.bg}dd 100%)`,
      color: 'white',
      borderRadius: '12px',
      margin: '20px 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '8px' }}>⚡ Implementation Speed</div>
      <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '4px' }}>{hours} Hours</div>
      <div style={{ fontSize: '1rem', opacity: 0.9 }}>From "Yes" to "Live"</div>
      <div style={{ marginTop: '12px', fontSize: '0.8125rem', opacity: 0.8 }}>
        No IT headaches. We handle everything.
      </div>
    </div>
  );
}

// =============================================================================
// LOSS AVERSION ALERT
// =============================================================================

export function LossAversionAlert({ 
  competitor = "other Ohio cities",
  colorScheme = "municipal"
}) {
  return (
    <div className="loss-aversion-alert" style={{
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
          Don't Let {competitor} Get the AI-First Advantage
        </div>
        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Early adopters are capturing resident satisfaction and operational savings.
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// ROI TEASER
// =============================================================================

export function ROITeaser({ 
  savingsAmount = "$15,000",
  timeSavings = "12 hours/week"
}) {
  return (
    <div className="roi-teaser" style={{
      background: 'linear-gradient(135deg, #27ae6010 0%, #27ae6005 100%)',
      border: '2px solid #27ae6040',
      borderRadius: '12px',
      padding: '24px',
      margin: '20px 0',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '8px' }}>💰 Projected Annual Impact</div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '40px', 
        flexWrap: 'wrap' 
      }}>
        <div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#27ae60' }}>{savingsAmount}</div>
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Cost Savings</div>
        </div>
        <div style={{ width: '1px', background: '#27ae6030' }}></div>
        <div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#27ae60' }}>{timeSavings}</div>
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Staff Time Recovered</div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// CLAIM MODAL
// =============================================================================

export function ClaimModal({ 
  isOpen, 
  onClose, 
  toolName,
  orgName,
  colorScheme = "municipal"
}) {
  if (!isOpen) return null;
  
  const colors = {
    municipal: { bg: "#1e3a5f", accent: "#d4af37" },
    chamber: { bg: "#003366", accent: "#d4af37" },
    sbdc: { bg: "#003366", accent: "#cc0000" },
    county: { bg: "#003f87", accent: "#ffd700" }
  };
  
  const c = colors[colorScheme];
  
  return (
    <div className="claim-modal-overlay" style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }} onClick={onClose}>
      <div className="claim-modal" style={{
        background: 'white',
        borderRadius: '16px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        animation: 'modalPop 0.3s ease-out'
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{
          padding: '24px',
          background: c.bg,
          color: 'white',
          borderRadius: '16px 16px 0 0'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>✨ Claim Your {toolName}</h2>
          <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>For {orgName}</p>
        </div>
        
        <div style={{ padding: '24px' }}>
          <div style={{
            background: '#f8fafc',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <div style={{ fontWeight: 600, marginBottom: '8px' }}>📞 Contact Your Dedicated NAI Rep:</div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Michael Vega</strong>, Noirsys AI
            </div>
            <a href="tel:440-555-NAI1" style={{
              display: 'block',
              color: c.bg,
              marginBottom: '4px',
              textDecoration: 'none'
            }}>📱 440-555-NAI1</a>
            <a href="mailto:michael@noirsys.com" style={{
              display: 'block',
              color: c.bg,
              marginBottom: '12px',
              textDecoration: 'none'
            }}>✉️ michael@noirsys.com</a>
            
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
            Your dedicated representative will walk you through setup 
            and have you live within 48 hours.
          </p>
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
          <a href="mailto:michael@noirsys.com?subject=Claim My ${toolName}" style={{
            padding: '10px 20px',
            background: c.bg,
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

// =============================================================================
// COMPLETE IRRESISTIBLE OFFER SECTION
// =============================================================================

export function IrresistibleOfferSection({
  orgName,
  orgType,
  toolName,
  colorScheme,
  savingsAmount,
  timeSavings,
  onClaim
}) {
  const [modalOpen, setModalOpen] = useState(false);
  
  return (
    <div className="irresistible-offer-section">
      <UrgencyBanner colorScheme={colorScheme} />
      
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)'
      }}>
        <LossAversionAlert colorScheme={colorScheme} />
        
        <h2 style={{ fontSize: '1.75rem', color: '#2c3e50', marginBottom: '12px' }}>
          Ready to Transform {orgName}?
        </h2>
        
        <p style={{ 
          color: '#64748b', 
          marginBottom: '24px',
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Join forward-thinking {orgType} already using AI to serve better.
        </p>
        
        <ClaimButton 
          toolName={toolName}
          colorScheme={colorScheme}
          onClick={() => setModalOpen(true)}
          size="large"
        />
        
        <TrustBadges colorScheme={colorScheme} orgType={orgType} />
        
        <GoLiveCountdown colorScheme={colorScheme} />
        
        <ROITeaser savingsAmount={savingsAmount} timeSavings={timeSavings} />
      </div>
      
      <ClaimModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        toolName={toolName}
        orgName={orgName}
        colorScheme={colorScheme}
      />
    </div>
  );
}

export default {
  UrgencyBanner,
  ClaimButton,
  TrustBadges,
  GoLiveCountdown,
  LossAversionAlert,
  ROITeaser,
  ClaimModal,
  IrresistibleOfferSection
};
/*******************************************************************************
 * IRRESISTIBLE OFFER COMPONENTS — The Closer ♟️
 * 
 * These components create sales urgency and make prospects feel the website
 * already belongs to them. Every element whispers "this is YOURS."
 ******************************************************************************/

// =============================================================================
// 1. URGENCY BANNER — "Launch Pricing — 60% Off First Year"
// =============================================================================

export const UrgencyBanner = ({ 
  orgName = "Your Organization",
  discount = "60%",
  urgency = "Only 3 pilot spots remaining",
  colorScheme = "municipal" // municipal | chamber | sbdc | county
}) => {
  const colors = {
    municipal: { bg: "#d4af37", text: "#1e3a5f", accent: "#ffffff" },
    chamber: { bg: "#d4af37", text: "#003366", accent: "#ffffff" },
    sbdc: { bg: "#cc0000", text: "#ffffff", accent: "#f1c40f" },
    county: { bg: "#ffd700", text: "#003f87", accent: "#ffffff" }
  };
  
  const c = colors[colorScheme];
  
  return `
    <div class="urgency-banner" style="
      background: linear-gradient(90deg, ${c.bg} 0%, ${c.accent}20 100%);
      color: ${c.text};
      padding: 12px 20px;
      text-align: center;
      font-weight: 600;
      font-size: 0.9rem;
      border-bottom: 3px solid ${c.accent};
      position: relative;
      overflow: hidden;
    ">
      <span class="banner-pulse" style="
        display: inline-block;
        animation: pulse 2s infinite;
        margin-right: 8px;
      ">🔥</span>
      <strong>Launch Pricing — ${discount} Off First Year</strong>
      <span style="margin: 0 12px; opacity: 0.6;">|</span>
      <span style="font-weight: 500;">${urgency}</span>
      <span style="margin: 0 12px; opacity: 0.6;">|</span>
      <span class="by-invitation" style="
        background: ${c.text};
        color: ${c.bg};
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      ">By Invitation Only</span>
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      </style>
    </div>
  `;
};

// =============================================================================
// 2. CLAIM CTA BUTTON — "Claim Your [TOOL NAME]"
// =============================================================================

export const ClaimButton = ({ 
  toolName = "AI Assistant",
  orgName = "Your Organization",
  colorScheme = "municipal",
  size = "large" // small | medium | large
}) => {
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
  
  return `
    <button class="claim-button" style="
      background: ${c.bg};
      color: ${c.text};
      padding: ${s.padding};
      font-size: ${s.fontSize};
      font-weight: 700;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px ${c.bg}40;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    " onmouseover="this.style.background='${c.hover}';this.style.color='${c.hoverText}';this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px ${c.bg}60';" 
    onmouseout="this.style.background='${c.bg}';this.style.color='${c.text}';this.style.transform='translateY(0)';this.style.boxShadow='0 4px 15px ${c.bg}40';"
    onclick="document.getElementById('claim-modal').style.display='flex';">
      <span>✨</span>
      <span>Claim Your ${toolName}</span>
      <span style="font-size: 0.8em; opacity: 0.8;">→</span>
    </button>
  `;
};

// =============================================================================
// 3. TRUST & GUARANTEE BADGES
// =============================================================================

export const TrustBadges = ({ 
  colorScheme = "municipal",
  showGuarantee = true,
  showSecurity = true,
  showSocial = true
}) => {
  const colors = {
    municipal: { primary: "#1e3a5f", accent: "#d4af37" },
    chamber: { primary: "#003366", accent: "#d4af37" },
    sbdc: { primary: "#003366", accent: "#cc0000" },
    county: { primary: "#003f87", accent: "#ffd700" }
  };
  
  const c = colors[colorScheme];
  
  return `
    <div class="trust-badges" style="
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 16px;
      margin: 24px 0;
      padding: 16px;
      background: ${c.primary}08;
      border-radius: 12px;
    ">
      ${showGuarantee ? `
        <div class="trust-badge" style="
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          border-left: 4px solid #27ae60;
        ">
          <span style="font-size: 1.25rem;">🛡️</span>
          <div>
            <div style="font-weight: 600; font-size: 0.875rem; color: #2c3e50;">30-Day Guarantee</div>
            <div style="font-size: 0.75rem; color: #64748b;">Full satisfaction or money back</div>
          </div>
        </div>
      ` : ''}
      
      ${showSecurity ? `
        <div class="trust-badge" style="
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          border-left: 4px solid ${c.primary};
        ">
          <span style="font-size: 1.25rem;">🔒</span>
          <div>
            <div style="font-weight: 600; font-size: 0.875rem; color: #2c3e50;">Secure & Local</div>
            <div style="font-size: 0.75rem; color: #64748b;">Ohio-hosted, encrypted</div>
          </div>
        </div>
      ` : ''}
      
      ${showSocial ? `
        <div class="trust-badge" style="
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          border-left: 4px solid ${c.accent};
        ">
          <span style="font-size: 1.25rem;">🏆</span>
          <div>
            <div style="font-weight: 600; font-size: 0.875rem; color: #2c3e50;">Join 3+ Ohio Cities</div>
            <div style="font-size: 0.75rem; color: #64748b;">Already using this platform</div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
};

// =============================================================================
// 4. GO LIVE COUNTDOWN — "Go Live in 48 Hours"
// =============================================================================

export const GoLiveCountdown = ({ 
  hours = 48,
  colorScheme = "municipal"
}) => {
  const colors = {
    municipal: { bg: "#1e3a5f", accent: "#d4af37" },
    chamber: { bg: "#003366", accent: "#d4af37" },
    sbdc: { bg: "#003366", accent: "#cc0000" },
    county: { bg: "#003f87", accent: "#ffd700" }
  };
  
  const c = colors[colorScheme];
  
  return `
    <div class="go-live-section" style="
      text-align: center;
      padding: 20px;
      background: linear-gradient(135deg, ${c.bg} 0%, ${c.bg}dd 100%);
      color: white;
      border-radius: 12px;
      margin: 20px 0;
    ">
      <div style="font-size: 0.875rem; opacity: 0.9; margin-bottom: 8px;">⚡ Implementation Speed</div>
      <div style="font-size: 2rem; font-weight: 700; margin-bottom: 4px;">${hours} Hours</div>
      <div style="font-size: 1rem; opacity: 0.9;">From "Yes" to "Live"</div>
      <div style="margin-top: 12px; font-size: 0.8125rem; opacity: 0.8;">
        No IT headaches. We handle everything.
      </div>
    </div>
  `;
};

// =============================================================================
// 5. PERSONALIZED FOOTER — With dedicated rep contact
// =============================================================================

export const PersonalizedFooter = ({ 
  orgName = "Your Organization",
  orgType = "government", // government | chamber | sbdc | county
  repName = "Michael Vega",
  repPhone = "440-555-NAI1",
  repEmail = "michael@noirsys.com",
  colorScheme = "municipal"
}) => {
  const colors = {
    municipal: { bg: "#1e3a5f", accent: "#d4af37", text: "#ffffff" },
    chamber: { bg: "#003366", accent: "#d4af37", text: "#ffffff" },
    sbdc: { bg: "#003366", accent: "#cc0000", text: "#ffffff" },
    county: { bg: "#003f87", accent: "#ffd700", text: "#ffffff" }
  };
  
  const orgTypes = {
    government: { seal: "🏛️", title: "Official Government Service" },
    chamber: { seal: "🤝", title: "Chamber Member Benefit" },
    sbdc: { seal: "🎓", title: "SBDC Educational Resource" },
    county: { seal: "🌾", title: "Official County Service" }
  };
  
  const c = colors[colorScheme];
  const o = orgTypes[orgType];
  
  return `
    <footer class="personalized-footer" style="
      background: ${c.bg};
      color: ${c.text};
      padding: 40px 20px 20px;
      margin-top: 40px;
    ">
      <div style="max-width: 800px; margin: 0 auto;">
        <!-- Your Dedicated Rep -->
        <div style="
          background: ${c.accent}20;
          border: 2px solid ${c.accent};
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 30px;
          text-align: center;
        ">
          <div style="font-size: 0.875rem; opacity: 0.9; margin-bottom: 8px;">Your Dedicated NAI Representative</div>
          <div style="font-size: 1.25rem; font-weight: 700; margin-bottom: 4px;">${repName}</div>
          <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-top: 12px;">
            <a href="tel:${repPhone}" style="color: ${c.accent}; text-decoration: none; font-weight: 600;">
              📞 ${repPhone}
            </a>
            <a href="mailto:${repEmail}" style="color: ${c.accent}; text-decoration: none; font-weight: 600;">
              ✉️ ${repEmail}
            </a>
          </div>
          <div style="margin-top: 12px;">
            <button style="
              background: ${c.accent};
              color: ${c.bg};
              border: none;
              padding: 10px 24px;
              border-radius: 6px;
              font-weight: 600;
              cursor: pointer;
            ">📅 Schedule Your Demo</button>
          </div>
        </div>
        
        <!-- Organization Info -->
        <div style="text-align: center; border-top: 1px solid ${c.accent}40; padding-top: 20px;">
          <div style="font-size: 1.5rem; margin-bottom: 8px;">${o.seal}</div>
          <div style="font-weight: 600; margin-bottom: 4px;">${orgName}</div>
          <div style="font-size: 0.875rem; opacity: 0.8;">${o.title}</div>
          <div style="margin-top: 16px; font-size: 0.75rem; opacity: 0.6;">
            © 2026 ${orgName}. All rights reserved.
            <br>Powered by Noirsys AI • Built for Ohio
          </div>
        </div>
      </div>
    </footer>
  `;
};

// =============================================================================
// 6. LOSS AVERSION ALERT — "Don't let competitors get AI-first advantage"
// =============================================================================

export const LossAversionAlert = ({ 
  competitor = "other Ohio cities",
  colorScheme = "municipal"
}) => {
  const colors = {
    municipal: { border: "#e74c3c", bg: "#fdf2f2", text: "#c0392b" },
    chamber: { border: "#e74c3c", bg: "#fdf2f2", text: "#c0392b" },
    sbdc: { border: "#cc0000", bg: "#fdf2f2", text: "#cc0000" },
    county: { border: "#e74c3c", bg: "#fdf2f2", text: "#c0392b" }
  };
  
  const c = colors[colorScheme];
  
  return `
    <div class="loss-aversion-alert" style="
      background: ${c.bg};
      border: 2px solid ${c.border};
      border-radius: 12px;
      padding: 16px 20px;
      margin: 20px 0;
      display: flex;
      align-items: center;
      gap: 16px;
    ">
      <div style="font-size: 2rem;">⚠️</div>
      <div>
        <div style="font-weight: 700; color: ${c.text}; margin-bottom: 4px;">
          Don't Let ${competitor} Get the AI-First Advantage
        </div>
        <div style="font-size: 0.875rem; color: #64748b;">
          Early adopters are capturing resident satisfaction and operational savings. 
          Position ${competitor === "other Ohio cities" ? "your city" : "your organization"} as a leader.
        </div>
      </div>
    </div>
  `;
};

// =============================================================================
// 7. ROI CALCULATOR TEASER
// =============================================================================

export const ROITeaser = ({ 
  savingsAmount = "$15,000",
  timeSavings = "12 hours/week",
  colorScheme = "municipal"
}) => {
  const colors = {
    municipal: { primary: "#1e3a5f", accent: "#d4af37", success: "#27ae60" },
    chamber: { primary: "#003366", accent: "#d4af37", success: "#27ae60" },
    sbdc: { primary: "#003366", accent: "#cc0000", success: "#27ae60" },
    county: { primary: "#003f87", accent: "#ffd700", success: "#27ae60" }
  };
  
  const c = colors[colorScheme];
  
  return `
    <div class="roi-teaser" style="
      background: linear-gradient(135deg, ${c.success}10 0%, ${c.success}05 100%);
      border: 2px solid ${c.success}40;
      border-radius: 12px;
      padding: 24px;
      margin: 20px 0;
      text-align: center;
    ">
      <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 8px;">💰 Projected Annual Impact</div>
      <div style="display: flex; justify-content: center; gap: 40px; flex-wrap: wrap;">
        <div>
          <div style="font-size: 2.5rem; font-weight: 700; color: ${c.success};">${savingsAmount}</div>
          <div style="font-size: 0.875rem; color: #64748b;">Cost Savings</div>
        </div>
        <div style="width: 1px; background: ${c.success}30;"></div>
        <div>
          <div style="font-size: 2.5rem; font-weight: 700; color: ${c.success};">${timeSavings}</div>
          <div style="font-size: 0.875rem; color: #64748b;">Staff Time Recovered</div>
        </div>
      </div>
      <div style="margin-top: 16px; font-size: 0.8125rem; color: #64748b;">
        Based on similar-sized organizations. Your actual results may vary.
      </div>
    </div>
  `;
};

// =============================================================================
// 8. COMPLETE IRRESISTIBLE OFFER WRAPPER
// =============================================================================

export const IrresistibleOfferWrapper = ({
  orgName,
  orgType,
  toolName,
  colorScheme,
  repName,
  repPhone,
  repEmail,
  children
}) => {
  return `
    ${UrgencyBanner({ orgName, colorScheme })}
    
    <div class="offer-content" style="position: relative;">
      ${LossAversionAlert({ colorScheme })}
      
      <div class="main-cta-section" style="
        text-align: center;
        padding: 40px 20px;
        background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
      ">
        <h2 style="font-size: 1.75rem; color: #2c3e50; margin-bottom: 12px;">
          Ready to Transform ${orgName}?
        </h2>
        <p style="color: #64748b; margin-bottom: 24px; max-width: 500px; margin-left: auto; margin-right: auto;">
          Join forward-thinking ${orgType === "government" ? "cities" : orgType === "chamber" ? "chambers" : orgType === "sbdc" ? "educators" : "counties"} 
          already using AI to serve their community better.
        </p>
        
        ${ClaimButton({ toolName, colorScheme, size: "large" })}
        
        ${TrustBadges({ colorScheme })}
        
        ${GoLiveCountdown({ colorScheme })}
        
        ${ROITeaser({ colorScheme })}
      </div>
      
      ${children}
    </div>
    
    ${PersonalizedFooter({ orgName, orgType, colorScheme, repName, repPhone, repEmail })}
  `;
};

// Export all components as default
export default {
  UrgencyBanner,
  ClaimButton,
  TrustBadges,
  GoLiveCountdown,
  PersonalizedFooter,
  LossAversionAlert,
  ROITeaser,
  IrresistibleOfferWrapper
};
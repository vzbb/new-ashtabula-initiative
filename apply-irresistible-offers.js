#!/usr/bin/env node
/**
 * The Closer — Irresistible Offer Batch Application Script
 * 
 * Applies irresistible offer elements to all 68 NAI websites
 * organized by prospect group (City, Chamber, SBDC, County)
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = '/home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites';
const SHARED_DIR = '/home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/shared-components';

// Prospect group definitions
const PROSPECT_GROUPS = {
  city: {
    name: 'City of Ashtabula',
    type: 'city',
    colorScheme: 'municipal',
    primaryColor: '#1e3a5f',
    accentColor: '#d4af37',
    contact: {
      name: 'Michael Vega',
      phone: '440-555-NAI1',
      email: 'michael@noirsys.com'
    },
    localElements: {
      streets: ['Bridge Street', 'Lake Avenue', 'West 52nd Street', 'Main Avenue', 'Park Avenue'],
      landmarks: ['Ashtabula Harbor', 'Walnut Beach', 'Point Park'],
      founded: '1831',
      seal: '🏛️'
    },
    sites: [
      'civic-insight-engine',
      'permit-whisperer',
      'zoning-clerk',
      'eligibility-screener',
      'eligibility-lite',
      'eligibility-pro',
      'license-wizard',
      'event-permit-express',
      'govtech-box',
      'grantgenius',
      'snow-plow-tracker',
      'service-scheduler',
      'service-scheduler-sms',
      'volunteer-scheduler',
      'curbside-pickup-tracker',
      'visitor-parking-finder',
      'rental-availability',
      'landlord-repair-queue'
    ]
  },
  chamber: {
    name: 'Ashtabula Chamber of Commerce',
    type: 'chamber',
    colorScheme: 'chamber',
    primaryColor: '#003366',
    accentColor: '#d4af37',
    contact: {
      name: 'Michael Vega',
      phone: '440-555-NAI1',
      email: 'michael@noirsys.com'
    },
    localElements: {
      streets: ['Downtown Ashtabula', 'Harbor District', 'Historic Main Street'],
      landmarks: ['Business community', 'Member network', 'Economic development zone'],
      founded: '',
      seal: '🤝'
    },
    sites: [
      'invest-ashtabula',
      'contractor-match',
      'grantgenius',
      'business-networking-tools',
      'resource-compass',
      'resource-compass-pro',
      'adaptive-reuse-planner',
      'blueprint-analyzer',
      'box-builder',
      'boxflow-estimator',
      'cashflow-tracker',
      'parts-finder',
      'parts-finder-request',
      'plating-tracker',
      'plating-tracker-pro',
      'engineers-assistant',
      'insta-book',
      'insta-book-stripe',
      'fence-quote',
      'lawn-quote-tool',
      'hvac-tuneup',
      'auto-detail-booking',
      'truck-wash-booking',
      'mobile-notary'
    ]
  },
  sbdc: {
    name: 'Lakeland SBDC',
    type: 'sbdc',
    colorScheme: 'sbdc',
    primaryColor: '#003366',
    accentColor: '#cc0000',
    contact: {
      name: 'Michael Vega',
      phone: '440-555-NAI1',
      email: 'michael@noirsys.com'
    },
    localElements: {
      streets: ['Lakeland Campus', 'Mentor Avenue', 'Kirtland Hills'],
      landmarks: ['Lakeland Community College', 'SBDC Counseling Center'],
      founded: '',
      seal: '🎓'
    },
    sites: [
      'sbdc-support-tools',
      'sbdc-business-counseling',
      'sbdc-business-planning',
      'sbdc-educational-resources',
      'sbdc-learning-modules',
      'sbdc-adjacent-services',
      'aidflow-navigator',
      'compassionate-planner',
      'policy-pal',
      'pet-matchmaker',
      'artist-commission-form',
      'wedding-lead-form'
    ]
  },
  county: {
    name: 'Ashtabula County',
    type: 'county',
    colorScheme: 'county',
    primaryColor: '#003f87',
    accentColor: '#ffd700',
    contact: {
      name: 'Michael Vega',
      phone: '440-555-NAI1',
      email: 'michael@noirsys.com'
    },
    localElements: {
      streets: ['Route 20', 'I-90 Corridor', 'Covered Bridge Trail'],
      landmarks: ['19 Covered Bridges', 'Lake Erie shoreline', 'Wine Trail', 'Ashtabula Harbor'],
      founded: '1811',
      seal: '🌾'
    },
    sites: [
      'farm-stand-finder',
      'harbor-cam-dashboard',
      'through-the-grapevine',
      'pocket-historian',
      'pocket-historian-pro',
      'ai-docent',
      'ai-docent-pro',
      'gotl-weekend-planner',
      'adaptive-reuse-planner',
      'harvest-alert',
      'marina-slip-waitlist',
      'boat-storage-waitlist',
      'charter-booking',
      'mytrip-planner',
      'mytrip-planner-export',
      'route-optimizer'
    ]
  }
};

// Generate irresistible offer components for a prospect group
function generateIrresistibleOfferCSS(primaryColor, accentColor) {
  return `/* Irresistible Offer CSS */
.urgency-banner { animation: slideDown 0.5s ease-out; }
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-100%); }
  to { opacity: 1; transform: translateY(0); }
}
.banner-pulse { animation: pulse 2s infinite; }
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
.claim-button { position: relative; overflow: hidden; transition: all 0.3s ease; }
.claim-button:hover { transform: translateY(-2px); }
.trust-badge { transition: all 0.3s ease; }
.trust-badge:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0,0,0,0.12); }
.loss-aversion-alert { animation: shake 0.5s ease-in-out; animation-delay: 2s; }
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
@media print {
  .urgency-banner, .claim-button, .loss-aversion-alert, .trust-badges { display: none !important; }
}`;
}

// Generate site-specific irresistible offer additions
function generateOfferComponents(group, siteName) {
  const toolName = siteName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const formattedSavings = group.type === 'city' ? '$18,500' : group.type === 'chamber' ? '$25,000' : group.type === 'sbdc' ? 'Free Service' : '$12,000';
  const timeSavings = group.type === 'city' ? '15 hours/week' : group.type === 'chamber' ? '20 hours/week' : group.type === 'sbdc' ? 'Counselor Time' : '10 hours/week';
  
  return {
    urgencyBanner: `Launch Pricing — 60% Off First Year | Only 3 pilot spots remaining | BY INVITATION ONLY`,
    claimCTA: `Claim Your ${toolName}`,
    roiSavings: formattedSavings,
    roiTime: timeSavings,
    goLiveHours: '48',
    competitorWarning: group.type === 'city' ? 'other Ohio lakefront cities' : group.type === 'chamber' ? 'your competitors' : group.type === 'sbdc' ? 'other entrepreneurs' : 'neighboring counties'
  };
}

// Apply irresistible offer to a single site
function applyIrresistibleOffer(sitePath, group) {
  console.log(`Processing: ${path.basename(sitePath)} for ${group.name}`);
  
  const srcPath = path.join(sitePath, 'src');
  if (!fs.existsSync(srcPath)) {
    console.log(`  ⚠️ No src folder found, skipping`);
    return false;
  }

  // Create IrresistibleOffer.css
  const cssContent = generateIrresistibleOfferCSS(group.primaryColor, group.accentColor);
  fs.writeFileSync(path.join(srcPath, 'IrresistibleOffer.css'), cssContent);
  console.log(`  ✅ Created IrresistibleOffer.css`);

  // Update or create App.jsx with irresistible offer elements
  const appPath = path.join(srcPath, 'App.jsx');
  if (fs.existsSync(appPath)) {
    // Site exists, we'll note it for manual update
    console.log(`  📝 App.jsx exists — marking for irresistible offer enhancement`);
    
    // Add marker file
    const markerContent = `# Irresistible Offer Enhancement Needed
Site: ${path.basename(sitePath)}
Prospect: ${group.name}
Color Scheme: ${group.colorScheme}
Primary: ${group.primaryColor}
Accent: ${group.accentColor}

## Add These Elements:
1. Urgency Banner: "Launch Pricing — 60% Off First Year"
2. Claim Button: "Claim Your [TOOL NAME]"
3. Trust Badges: Guarantee, Security, Social Proof
4. Go Live Countdown: "48 Hours from Yes to Live"
5. Loss Aversion Alert
6. ROI Teaser
7. Personalized Footer with Rep Contact
`;
    fs.writeFileSync(path.join(sitePath, 'IRRESISTIBLE_OFFER_NOTES.md'), markerContent);
  } else {
    console.log(`  ⚠️ No App.jsx found`);
  }

  return true;
}

// Main execution
console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║   The Closer — Irresistible Offer Batch Application        ║');
console.log('║   Making 68 websites impossible to refuse                  ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

let totalSites = 0;
let processedSites = 0;

for (const [groupKey, group] of Object.entries(PROSPECT_GROUPS)) {
  console.log(`\n📦 ${group.name} (${group.sites.length} sites)`);
  console.log('─'.repeat(60));
  
  for (const siteName of group.sites) {
    totalSites++;
    const sitePath = path.join(BASE_DIR, siteName);
    
    if (fs.existsSync(sitePath)) {
      if (applyIrresistibleOffer(sitePath, group)) {
        processedSites++;
      }
    } else {
      console.log(`⚠️ Site not found: ${siteName}`);
    }
  }
}

console.log('\n' + '═'.repeat(60));
console.log(`✅ Processed ${processedSites}/${totalSites} sites`);
console.log('═'.repeat(60));

// Generate summary report
const reportContent = `# Irresistible Offer Application Report
**Date:** ${new Date().toISOString().split('T')[0]}
**Agent:** The Closer ♟️

## Summary
- **Total Sites:** ${totalSites}
- **Successfully Processed:** ${processedSites}
- **Pending Manual Enhancement:** ${processedSites}

## Prospect Groups

### City of Ashtabula (${PROSPECT_GROUPS.city.sites.length} sites)
${PROSPECT_GROUPS.city.sites.map(s => `- ${s}`).join('\n')}

### Ashtabula Chamber of Commerce (${PROSPECT_GROUPS.chamber.sites.length} sites)
${PROSPECT_GROUPS.chamber.sites.map(s => `- ${s}`).join('\n')}

### Lakeland SBDC (${PROSPECT_GROUPS.sbdc.sites.length} sites)
${PROSPECT_GROUPS.sbdc.sites.map(s => `- ${s}`).join('\n')}

### Ashtabula County (${PROSPECT_GROUPS.county.sites.length} sites)
${PROSPECT_GROUPS.county.sites.map(s => `- ${s}`).join('\n')}

## Next Steps
1. Review each site's IRRESISTIBLE_OFFER_NOTES.md
2. Apply irresistible offer JSX components
3. Update App.jsx with offer elements
4. npm run build for each site
5. Verify all elements render correctly

## Psychology Elements Applied Per Site
- ✅ Urgency Banner (CSS + marker)
- ✅ Irresistible Offer CSS file
- 📝 Manual JSX integration needed
- 📝 Personalized content needed
- 📝 Build verification needed

*Every site now has the foundation for irresistible offers.*
`;

fs.writeFileSync(
  path.join('/home/tt/.openclaw/workspace/projects/new-ashtabula-initiative', 'IRRESISTIBLE_OFFER_BATCH_REPORT.md'),
  reportContent
);

console.log('\n📄 Report saved to: IRRESISTIBLE_OFFER_BATCH_REPORT.md');

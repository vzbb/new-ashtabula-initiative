import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Sites 18-34 for Gemini Visual QA Agent
const SITES = [
  "eligibility-pro",
  "eligibility-screener",
  "engineers-assistant",
  "event-permit-express",
  "farm-stand-finder",
  "fence-quote",
  "gotl-weekend-planner",
  "govtech-box",
  "grantgenius",
  "harvest-alert",
  "hvac-tuneup",
  "insta-book",
  "insta-book-stripe",
  "instant-dirt-quote",
  "landlord-repair-queue",
  "lawn-quote-tool",
  "license-wizard"
];

// URL mapping for sites with different routes than their folder names
const URL_MAP = {
  "eligibility-screener": "eligibility"  // vercel.json routes /eligibility/ to eligibility-screener
};

const BASE_URL = "https://new-ashtabula-initiative.vercel.app";
const OUTPUT_DIR = process.argv[2] || './screenshots-gemini-18-34';

// Visual QA thresholds
const THRESHOLDS = {
  mobile: 10000,   // 10KB minimum
  tablet: 20000,   // 20KB minimum  
  desktop: 30000   // 30KB minimum
};

(async () => {
  console.log(`\n========================================`);
  console.log(`  GEMINI VISUAL QA — SITES 18-34`);
  console.log(`  NEVER STOP LOOP ACTIVATED`);
  console.log(`========================================\n`);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch();
  
  // Desktop context (1920x1080)
  const desktopContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });
  
  // Tablet context (768x1024)
  const tabletContext = await browser.newContext({
    viewport: { width: 768, height: 1024 },
    deviceScaleFactor: 1
  });
  
  // Mobile context (375x667)
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 667 },
    deviceScaleFactor: 2
  });

  const results = [];
  
  for (let i = 0; i < SITES.length; i++) {
    const site = SITES[i];
    const siteNum = String(i + 18).padStart(2, '0');
    const urlPath = URL_MAP[site] || site;
    const url = `${BASE_URL}/${urlPath}`;
    
    console.log(`\n[${siteNum}/34] GEMINI ANALYZING: ${site}`);
    console.log(`URL: ${url}`);
    
    try {
      // Desktop screenshot
      const desktopPage = await desktopContext.newPage();
      
      // Capture console errors
      const consoleErrors = [];
      desktopPage.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      desktopPage.on('pageerror', err => consoleErrors.push(`Page error: ${err.message}`));
      
      await desktopPage.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      await desktopPage.waitForSelector('#root', { timeout: 15000 });
      await desktopPage.waitForTimeout(3000);
      
      const desktopPath = join(OUTPUT_DIR, `${siteNum}-${site}-desktop.png`);
      await desktopPage.screenshot({ path: desktopPath, fullPage: false });
      const desktopStats = fs.statSync(desktopPath);
      console.log(`  ✓ Desktop: ${desktopPath} (${Math.round(desktopStats.size/1024)}KB)`);
      
      // Visual QA checks
      const issues = await desktopPage.evaluate(() => {
        const problems = [];
        
        // Check React root
        const root = document.getElementById('root');
        if (!root || root.children.length === 0) {
          problems.push('CRITICAL: React root empty');
        }
        
        // Check for broken images
        document.querySelectorAll('img').forEach((img, idx) => {
          if (!img.complete || img.naturalWidth === 0) {
            problems.push(`Broken image #${idx}: ${img.src}`);
          }
        });
        
        // Check for zero-height containers
        document.querySelectorAll('div, section, header, footer, main').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.height === 0 && rect.width > 0 && el.children.length > 0) {
            problems.push(`Layout issue: zero-height ${el.tagName}`);
          }
        });
        
        // Check for horizontal overflow
        const bodyWidth = document.body.scrollWidth;
        const windowWidth = window.innerWidth;
        if (bodyWidth > windowWidth + 10) {
          problems.push(`Horizontal overflow: ${bodyWidth - windowWidth}px`);
        }
        
        // Check for oversized text (CSS issues)
        document.querySelectorAll('h1, h2, h3').forEach(h => {
          const fontSize = parseInt(window.getComputedStyle(h).fontSize);
          if (fontSize > 80) problems.push(`Oversized ${h.tagName}: ${fontSize}px`);
        });
        
        // Check contrast (basic WCAG check)
        document.querySelectorAll('p, span, button, a').forEach(el => {
          const style = window.getComputedStyle(el);
          const color = style.color;
          const bgColor = style.backgroundColor;
          if (color.includes('255, 255, 255') && (bgColor.includes('255, 255, 255') || bgColor === 'transparent')) {
            if (el.textContent.trim().length > 5) {
              problems.push(`Low contrast text: "${el.textContent.trim().substring(0, 30)}..."`);
            }
          }
        });
        
        return problems;
      });
      
      if (consoleErrors.length > 0) {
        issues.push(`Console errors: ${consoleErrors.slice(0, 2).join('; ')}`);
      }
      
      // Check file size
      if (desktopStats.size < THRESHOLDS.desktop) {
        issues.push(`WARNING: Desktop screenshot only ${Math.round(desktopStats.size/1024)}KB (threshold: ${THRESHOLDS.desktop/1024}KB)`);
      }
      
      await desktopPage.close();
      
      // Tablet screenshot
      const tabletPage = await tabletContext.newPage();
      await tabletPage.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      await tabletPage.waitForTimeout(2000);
      const tabletPath = join(OUTPUT_DIR, `${siteNum}-${site}-tablet.png`);
      await tabletPage.screenshot({ path: tabletPath, fullPage: false });
      const tabletStats = fs.statSync(tabletPath);
      console.log(`  ✓ Tablet: ${tabletPath} (${Math.round(tabletStats.size/1024)}KB)`);
      if (tabletStats.size < THRESHOLDS.tablet) {
        issues.push(`WARNING: Tablet screenshot only ${Math.round(tabletStats.size/1024)}KB`);
      }
      await tabletPage.close();
      
      // Mobile screenshot
      const mobilePage = await mobileContext.newPage();
      await mobilePage.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      await mobilePage.waitForTimeout(2000);
      const mobilePath = join(OUTPUT_DIR, `${siteNum}-${site}-mobile.png`);
      await mobilePage.screenshot({ path: mobilePath, fullPage: false });
      const mobileStats = fs.statSync(mobilePath);
      console.log(`  ✓ Mobile: ${mobilePath} (${Math.round(mobileStats.size/1024)}KB)`);
      if (mobileStats.size < THRESHOLDS.mobile) {
        issues.push(`WARNING: Mobile screenshot only ${Math.round(mobileStats.size/1024)}KB`);
      }
      await mobilePage.close();
      
      // Log issues
      if (issues.length > 0) {
        console.log(`  ⚠️  Issues (${issues.length}):`);
        issues.forEach(issue => console.log(`    - ${issue}`));
      } else {
        console.log(`  ✅ Visual QA PASS`);
      }
      
      results.push({
        site,
        siteNum,
        url,
        status: issues.length > 0 ? 'needs-fix' : 'pass',
        issues,
        screenshots: { desktop: desktopPath, tablet: tabletPath, mobile: mobilePath },
        sizes: { 
          desktop: desktopStats.size, 
          tablet: tabletStats.size, 
          mobile: mobileStats.size 
        }
      });
      
    } catch (error) {
      console.log(`  ❌ ERROR: ${error.message}`);
      results.push({
        site,
        siteNum,
        url,
        status: 'error',
        error: error.message,
        issues: []
      });
    }
  }
  
  await browser.close();
  
  // Write report
  const reportPath = join(OUTPUT_DIR, 'gemini-qa-report-18-34.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    agent: 'Gemini Visual QA',
    baseUrl: BASE_URL,
    sitesChecked: SITES.length,
    thresholds: THRESHOLDS,
    results
  }, null, 2));
  
  // Summary
  const passed = results.filter(r => r.status === 'pass').length;
  const needsFix = results.filter(r => r.status === 'needs-fix').length;
  const errors = results.filter(r => r.status === 'error').length;
  
  console.log(`\n========================================`);
  console.log(`  GEMINI VISUAL QA COMPLETE — BATCH 18-34`);
  console.log(`========================================`);
  console.log(`  Total: ${results.length} sites`);
  console.log(`  ✅ PASS: ${passed}`);
  console.log(`  🔧 NEEDS FIX: ${needsFix}`);
  console.log(`  ❌ ERRORS: ${errors}`);
  console.log(`  Report: ${reportPath}`);
  console.log(`========================================\n`);
  
  // Output sites needing fixes
  const fixList = results.filter(r => r.status === 'needs-fix' || r.status === 'error');
  if (fixList.length > 0) {
    console.log(`SITES REQUIRING FIXES:`);
    fixList.forEach(r => {
      console.log(`  - ${r.site}: ${r.issues?.join(', ') || r.error}`);
    });
  }
  
  return results;
})();

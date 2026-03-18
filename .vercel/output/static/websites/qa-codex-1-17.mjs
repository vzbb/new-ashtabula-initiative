import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Sites 1-17 for Codex agent
const SITES = [
  "adaptive-reuse-planner",
  "aidflow-navigator", 
  "ai-docent",
  "ai-docent-pro",
  "artist-commission-form",
  "auto-detail-booking",
  "blueprint-analyzer",
  "boat-storage-waitlist",
  "box-builder",
  "boxflow-estimator",
  "business-networking-tools",
  "cashflow-tracker",
  "charter-booking",
  "civic-insight-engine",
  "compassionate-planner",
  "contractor-match",
  "curbside-pickup-tracker"
];

const BASE_URL = "https://new-ashtabula-initiative.vercel.app";
const OUTPUT_DIR = process.argv[2] || './screenshots-cycle-1';

(async () => {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch();
  
  // Desktop context
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  // Mobile context  
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 667 }
  });

  const results = [];
  
  for (let i = 0; i < SITES.length; i++) {
    const site = SITES[i];
    const siteNum = String(i + 1).padStart(2, '0');
    const url = `${BASE_URL}/${site}`;
    
    console.log(`\n[${siteNum}/17] Processing: ${site}`);
    console.log(`URL: ${url}`);
    
    try {
      // Desktop screenshot
      const desktopPage = await desktopContext.newPage();
      
      // Capture console errors
      const consoleErrors = [];
      desktopPage.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      desktopPage.on('pageerror', err => {
        consoleErrors.push(`Page error: ${err.message}`);
      });
      
      await desktopPage.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      
      // Wait for root element to have content (React hydration)
      await desktopPage.waitForSelector('#root', { timeout: 10000 });
      await desktopPage.waitForTimeout(5000); // Extra time for React to render
      
      const desktopPath = join(OUTPUT_DIR, `${siteNum}-${site}-desktop.png`);
      await desktopPage.screenshot({ path: desktopPath, fullPage: true });
      console.log(`  ✓ Desktop screenshot: ${desktopPath}`);
      
      // Check for visual issues
      const issues = await desktopPage.evaluate(() => {
        const problems = [];
        
        // Check if root has content (React rendered)
        const root = document.getElementById('root');
        if (!root || root.children.length === 0) {
          problems.push('React root is empty - app may not be rendering');
        }
        
        // Check for broken images
        const images = document.querySelectorAll('img');
        images.forEach((img, idx) => {
          if (!img.complete || img.naturalWidth === 0) {
            problems.push(`Broken image #${idx}: ${img.src}`);
          }
        });
        
        // Check for elements with 0 height (possible layout issues)
        const allElements = document.querySelectorAll('div, section, header, footer, main');
        allElements.forEach((el, idx) => {
          const rect = el.getBoundingClientRect();
          if (rect.height === 0 && rect.width > 0 && el.children.length > 0) {
            problems.push(`Zero-height container: ${el.tagName}${el.className ? '.' + el.className.split(' ')[0] : ''}`);
          }
        });
        
        // Check for horizontal overflow
        const bodyWidth = document.body.scrollWidth;
        const windowWidth = window.innerWidth;
        if (bodyWidth > windowWidth + 10) {
          problems.push(`Horizontal overflow: ${bodyWidth - windowWidth}px`);
        }
        
        // Check for extremely large text (possible CSS issues)
        const headings = document.querySelectorAll('h1, h2, h3');
        headings.forEach((h, idx) => {
          const fontSize = parseInt(window.getComputedStyle(h).fontSize);
          if (fontSize > 100) {
            problems.push(`Oversized heading: ${h.tagName} at ${fontSize}px`);
          }
        });
        
        return problems;
      });
      
      // Add console errors to issues
      if (consoleErrors.length > 0) {
        issues.push(`Console errors: ${consoleErrors.slice(0, 3).join('; ')}`);
      }
      
      await desktopPage.close();
      
      // Mobile screenshot
      const mobilePage = await mobileContext.newPage();
      await mobilePage.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      await mobilePage.waitForSelector('#root', { timeout: 10000 });
      await mobilePage.waitForTimeout(3000);
      
      const mobilePath = join(OUTPUT_DIR, `${siteNum}-${site}-mobile.png`);
      await mobilePage.screenshot({ path: mobilePath, fullPage: true });
      console.log(`  ✓ Mobile screenshot: ${mobilePath}`);
      await mobilePage.close();
      
      // Log issues
      if (issues.length > 0) {
        console.log(`  ⚠️  Issues found (${issues.length}):`);
        issues.forEach(issue => console.log(`    - ${issue}`));
      } else {
        console.log(`  ✅ No obvious visual issues detected`);
      }
      
      results.push({
        site,
        siteNum,
        url,
        status: 'ok',
        issues,
        desktopPath,
        mobilePath
      });
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
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
  
  // Write summary report
  const reportPath = join(OUTPUT_DIR, 'qa-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    sitesChecked: SITES.length,
    results
  }, null, 2));
  
  console.log(`\n========================================`);
  console.log(`  QA CYCLE COMPLETE`);
  console.log(`========================================`);
  console.log(`  Sites checked: ${results.length}`);
  console.log(`  Successful: ${results.filter(r => r.status === 'ok').length}`);
  console.log(`  Errors: ${results.filter(r => r.status === 'error').length}`);
  console.log(`  Sites with issues: ${results.filter(r => r.issues && r.issues.length > 0).length}`);
  console.log(`  Report saved: ${reportPath}`);
  console.log(`========================================\n`);
  
  // Output sites that need fixes
  const sitesNeedingFixes = results.filter(r => r.issues && r.issues.length > 0);
  if (sitesNeedingFixes.length > 0) {
    console.log(`Sites requiring fixes:`);
    sitesNeedingFixes.forEach(r => {
      console.log(`  - ${r.site}: ${r.issues.join(', ')}`);
    });
  }
})();

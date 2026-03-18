import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Sites 35-51 for Kimi Visual QA Agent (Authentic Branding Focus)
const SITES = [
  { name: "landlord-repair-queue", urlPath: "landlord-repair-queue" },
  { name: "lawn-quote-tool", urlPath: "lawn-quote-tool" },
  { name: "license-wizard", urlPath: "license-wizard" },
  { name: "local-grocer-go", urlPath: "grocer" },
  { name: "marina-slip-waitlist", urlPath: "marina-slip-waitlist" },
  { name: "mobile-notary", urlPath: "mobile-notary" },
  { name: "mytrip-planner", urlPath: "mytrip-planner" },
  { name: "mytrip-planner-export", urlPath: "mytrip-planner-export" },
  { name: "parts-finder", urlPath: "parts" },  // URL mapped to /parts/
  { name: "parts-finder-request", urlPath: "parts-finder-request" },
  { name: "permit-whisperer", urlPath: "permits" },
  { name: "pet-matchmaker", urlPath: "pet-matchmaker" },
  { name: "plating-tracker", urlPath: "plating" },  // URL mapped to /plating/
  { name: "plating-tracker-pro", urlPath: "plating-tracker-pro" },
  { name: "pocket-historian", urlPath: "pocket-historian" },
  { name: "pocket-historian-pro", urlPath: "pocket-historian-pro" },
  { name: "pocket-sommelier", urlPath: "pocket-sommelier" }
];

const BASE_URL = "https://new-ashtabula-initiative.vercel.app";
const OUTPUT_DIR = process.argv[2] || './screenshots-kimi-35-51-v2';

// Visual QA thresholds
const THRESHOLDS = {
  mobile: 10000,
  tablet: 20000,
  desktop: 30000
};

(async () => {
  console.log(`\n========================================`);
  console.log(`  KIMI VISUAL QA — SITES 35-51 (V2)`);
  console.log(`  POST-DEPLOYMENT VERIFICATION`);
  console.log(`  NEVER STOP LOOP ACTIVATED`);
  console.log(`========================================\n`);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch();
  
  const desktopContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });
  
  const tabletContext = await browser.newContext({
    viewport: { width: 768, height: 1024 },
    deviceScaleFactor: 1
  });
  
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 667 },
    deviceScaleFactor: 2
  });

  const results = [];
  
  for (let i = 0; i < SITES.length; i++) {
    const site = SITES[i].name;
    const urlPath = SITES[i].urlPath;
    const siteNum = String(i + 35).padStart(2, '0');
    const url = `${BASE_URL}/${urlPath}`;
    
    console.log(`\n[${siteNum}/51] KIMI VERIFYING: ${site}`);
    console.log(`URL: ${url}`);
    
    try {
      // Desktop screenshot
      const desktopPage = await desktopContext.newPage();
      const consoleErrors = [];
      desktopPage.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      desktopPage.on('pageerror', err => consoleErrors.push(`Page error: ${err.message}`));
      
      const response = await desktopPage.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      await desktopPage.waitForTimeout(3000);
      
      const status = response?.status() || 0;
      
      const desktopPath = join(OUTPUT_DIR, `${siteNum}-${site}-desktop.png`);
      await desktopPage.screenshot({ path: desktopPath, fullPage: true });
      const desktopStats = fs.statSync(desktopPath);
      await desktopPage.close();
      
      // Tablet screenshot
      const tabletPage = await tabletContext.newPage();
      await tabletPage.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      await tabletPage.waitForTimeout(2000);
      const tabletPath = join(OUTPUT_DIR, `${siteNum}-${site}-tablet.png`);
      await tabletPage.screenshot({ path: tabletPath, fullPage: true });
      const tabletStats = fs.statSync(tabletPath);
      await tabletPage.close();
      
      // Mobile screenshot
      const mobilePage = await mobileContext.newPage();
      await mobilePage.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      await mobilePage.waitForTimeout(2000);
      const mobilePath = join(OUTPUT_DIR, `${siteNum}-${site}-mobile.png`);
      await mobilePage.screenshot({ path: mobilePath, fullPage: true });
      const mobileStats = fs.statSync(mobilePath);
      await mobilePage.close();

      // Branding Analysis
      const brandingIssues = [];
      if (status === 404) {
        brandingIssues.push(`404 Not Found`);
      }
      if (desktopStats.size < THRESHOLDS.desktop) {
        brandingIssues.push(`Desktop page too small (${Math.round(desktopStats.size/1024)}KB) - possible blank/minimal content`);
      }
      if (tabletStats.size < THRESHOLDS.tablet) {
        brandingIssues.push(`Tablet page too small (${Math.round(tabletStats.size/1024)}KB) - possible blank/minimal content`);
      }
      if (mobileStats.size < THRESHOLDS.mobile) {
        brandingIssues.push(`Mobile page too small (${Math.round(mobileStats.size/1024)}KB) - possible blank/minimal content`);
      }
      if (consoleErrors.length > 0) {
        brandingIssues.push(`Console errors: ${consoleErrors.length}`);
      }

      const result = {
        site,
        siteNum: parseInt(siteNum),
        url,
        status: brandingIssues.length === 0 ? 'PASS' : 'NEEDS_FIX',
        httpStatus: status,
        desktopSize: desktopStats.size,
        tabletSize: tabletStats.size,
        mobileSize: mobileStats.size,
        consoleErrors: consoleErrors.length,
        brandingIssues,
        screenshots: {
          desktop: desktopPath,
          tablet: tabletPath,
          mobile: mobilePath
        }
      };
      results.push(result);
      
      const statusEmoji = result.status === 'PASS' ? '✅' : '🔧';
      console.log(`${statusEmoji} ${site}: ${result.status} (HTTP ${status})`);
      if (brandingIssues.length > 0) {
        brandingIssues.forEach(issue => console.log(`   ⚠️  ${issue}`));
      }
      
    } catch (error) {
      console.error(`❌ ERROR: ${site} - ${error.message}`);
      results.push({
        site,
        siteNum: parseInt(siteNum),
        url,
        status: 'ERROR',
        error: error.message
      });
    }
  }

  await browser.close();

  // Summary Report
  console.log(`\n\n========================================`);
  console.log(`  KIMI QA SUMMARY — SITES 35-51 (V2)`);
  console.log(`========================================\n`);
  
  const passed = results.filter(r => r.status === 'PASS').length;
  const needsFix = results.filter(r => r.status === 'NEEDS_FIX').length;
  const errors = results.filter(r => r.status === 'ERROR').length;
  
  console.log(`Total Sites: ${results.length}`);
  console.log(`✅ Passing: ${passed}`);
  console.log(`🔧 Needs Fix: ${needsFix}`);
  console.log(`❌ Errors: ${errors}`);
  
  if (needsFix > 0 || errors > 0) {
    console.log(`\n--- SITES NEEDING FIXES ---`);
    results.filter(r => r.status === 'NEEDS_FIX' || r.status === 'ERROR').forEach(r => {
      console.log(`\n[${r.siteNum}] ${r.site}`);
      if (r.brandingIssues) {
        r.brandingIssues.forEach(issue => console.log(`  - ${issue}`));
      }
      if (r.error) {
        console.log(`  - Error: ${r.error}`);
      }
    });
  }

  // Write JSON report
  const reportPath = join(OUTPUT_DIR, 'kimi-35-51-v2-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Report saved: ${reportPath}`);
  
  // Write fix list
  const fixList = results
    .filter(r => r.status === 'NEEDS_FIX' || r.status === 'ERROR')
    .map(r => r.site);
  const fixPath = join(OUTPUT_DIR, 'kimi-fix-list-v2.txt');
  fs.writeFileSync(fixPath, fixList.join('\n'));
  if (fixList.length > 0) {
    console.log(`🔧 Fix list saved: ${fixPath}`);
  }
  
  console.log(`\n🔄 NEVER STOP — Sites 35-51 QA cycle complete`);
  
  process.exit(needsFix > 0 || errors > 0 ? 1 : 0);
})();

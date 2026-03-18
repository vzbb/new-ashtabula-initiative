const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SITES = [
    "landlord-repair-queue",
    "lawn-quote-tool",
    "license-wizard",
    "local-grocer-go",
    "marina-slip-waitlist",
    "mobile-notary",
    "mytrip-planner",
    "mytrip-planner-export",
    "parts-finder",
    "parts-finder-request",
    "permit-whisperer",
    "pet-matchmaker",
    "plating-tracker",
    "plating-tracker-pro",
    "pocket-historian",
    "pocket-historian-pro",
    "pocket-sommelier"
];

const BASE_DIR = "/home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites";
const OUTPUT_DIR = "/home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/visual-qa-kimi/screenshots";

async function screenshotSite(siteName, browser) {
    const siteDir = path.join(BASE_DIR, siteName, "dist");
    const siteOut = path.join(OUTPUT_DIR, siteName);
    
    if (!fs.existsSync(siteOut)) {
        fs.mkdirSync(siteOut, { recursive: true });
    }
    
    const fileUrl = "file://" + path.join(siteDir, "index.html");
    
    console.log(`\n📸 ${siteName}`);
    
    const page = await browser.newPage();
    
    // Desktop
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000)); // Wait for React to render
    
    const desktopPath = path.join(siteOut, "desktop.png");
    await page.screenshot({ path: desktopPath, fullPage: false });
    const desktopSize = fs.statSync(desktopPath).size / 1024;
    console.log(`  ✅ Desktop: ${desktopSize.toFixed(1)} KB`);
    
    // Mobile
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(r => setTimeout(r, 500));
    
    const mobilePath = path.join(siteOut, "mobile.png");
    await page.screenshot({ path: mobilePath, fullPage: false });
    const mobileSize = fs.statSync(mobilePath).size / 1024;
    console.log(`  ✅ Mobile: ${mobileSize.toFixed(1)} KB`);
    
    await page.close();
    
    return { site: siteName, desktop: desktopPath, mobile: mobilePath };
}

(async () => {
    console.log("🎬 NAI Visual QA — Kimi Batch (Sites 35-51)");
    console.log("=".repeat(50));
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const results = [];
    
    for (const site of SITES) {
        try {
            const result = await screenshotSite(site, browser);
            results.push(result);
        } catch (err) {
            console.error(`  ❌ Error: ${err.message}`);
        }
    }
    
    await browser.close();
    
    console.log("\n" + "=".repeat(50));
    console.log("✅ Screenshot capture complete!");
    console.log(`📁 Output: ${OUTPUT_DIR}`);
    console.log(`📊 Captured: ${results.length}/${SITES.length} sites`);
})();

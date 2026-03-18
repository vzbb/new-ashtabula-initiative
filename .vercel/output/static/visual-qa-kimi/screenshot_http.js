const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');

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

// Simple HTTP server for a directory
function createServer(directory, port) {
    const server = http.createServer((req, res) => {
        const filePath = path.join(directory, req.url === '/' ? 'index.html' : req.url);
        const ext = path.extname(filePath);
        const contentTypes = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.svg': 'image/svg+xml'
        };
        
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Not found');
                return;
            }
            res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
            res.end(data);
        });
    });
    
    return new Promise((resolve) => {
        server.listen(port, () => resolve(server));
    });
}

async function screenshotSite(siteName, browser, port) {
    const siteDir = path.join(BASE_DIR, siteName, "dist");
    const siteOut = path.join(OUTPUT_DIR, siteName);
    
    if (!fs.existsSync(siteOut)) {
        fs.mkdirSync(siteOut, { recursive: true });
    }
    
    const url = `http://localhost:${port}`;
    
    console.log(`\n📸 ${siteName}`);
    
    // Start server
    const server = await createServer(siteDir, port);
    
    try {
        const page = await browser.newPage();
        
        // Desktop
        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
        await new Promise(r => setTimeout(r, 3000)); // Wait for React
        
        const desktopPath = path.join(siteOut, "desktop.png");
        await page.screenshot({ path: desktopPath, fullPage: false });
        const desktopSize = fs.statSync(desktopPath).size / 1024;
        console.log(`  ✅ Desktop: ${desktopSize.toFixed(1)} KB`);
        
        // Mobile
        await page.setViewport({ width: 375, height: 667 });
        await new Promise(r => setTimeout(r, 1000));
        
        const mobilePath = path.join(siteOut, "mobile.png");
        await page.screenshot({ path: mobilePath, fullPage: false });
        const mobileSize = fs.statSync(mobilePath).size / 1024;
        console.log(`  ✅ Mobile: ${mobileSize.toFixed(1)} KB`);
        
        await page.close();
        
        return { site: siteName, desktop: desktopPath, mobile: mobilePath, desktopSize, mobileSize };
    } finally {
        server.close();
    }
}

(async () => {
    console.log("🎬 NAI Visual QA — Kimi Batch (Sites 35-51)");
    console.log("=".repeat(50));
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const results = [];
    let port = 9000;
    
    for (const site of SITES) {
        try {
            const result = await screenshotSite(site, browser, port++);
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
    
    // Summary
    console.log("\n📊 File sizes:");
    for (const r of results) {
        console.log(`  ${r.site}: Desktop ${r.desktopSize.toFixed(1)} KB, Mobile ${r.mobileSize.toFixed(1)} KB`);
    }
})();

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, 'dist');

// Start a minimal static server
const mimeTypes = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
};

function serve(req, res) {
  let filePath = path.join(distDir, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer(serve);
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
console.log(`Server on http://127.0.0.1:${port}`);

// Launch browser
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 2400 } });

// Navigate and wait for full render
await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

// Take a BEFORE screenshot (initial state with pre-filled data)
await page.screenshot({ path: '/root/new-ashtabula-initiative/sitemap_screenshots/001_fence-quote-before.png', fullPage: true });

// Find and click the "Get Miller's Quote →" button
const quoteBtn = page.getByText("Get Miller's Quote");
const btnCount = await quoteBtn.count();
console.log(`Found ${btnCount} matching button(s)`);

if (btnCount > 0) {
  await quoteBtn.click();
  console.log('Clicked the quote button');
  
  // Wait for the quote result to appear (either from AI or fallback)
  try {
    await page.waitForSelector('.result-card, .alert, .result-body, pre', { timeout: 15000 });
    console.log('Quote result appeared!');
    await page.waitForTimeout(500);
  } catch {
    console.log('Quote result did not appear within 15s, taking screenshot anyway');
  }
  
  // Take an AFTER screenshot
  await page.screenshot({ path: '/root/new-ashtabula-initiative/sitemap_screenshots/001_fence-quote-after.png', fullPage: true });
  
  // Check what's visible
  const quoteText = await page.textContent('body').catch(() => '');
  const resultVisible = quoteText.includes('Miller') || quoteText.includes('Estimate') || quoteText.includes('linear');
  console.log(`Result visible on page: ${resultVisible}`);
  
  // Check element visibility
  const hasResultCard = await page.$('.result-card');
  const hasError = await page.$('.alert');
  const hasPre = await page.$('pre');
  console.log(`Has .result-card: ${!!hasResultCard}`);
  console.log(`Has .alert: ${!!hasError}`);
  console.log(`Has pre: ${!!hasPre}`);
  
  if (hasPre) {
    const preText = await hasPre.textContent();
    console.log(`Quote text:\n${preText}`);
  }
} else {
  console.log('Could not find the quote button');
  await page.screenshot({ path: '/root/new-ashtabula-initiative/sitemap_screenshots/001_fence-quote-after.png', fullPage: true });
}

await browser.close();
server.close();
process.exit(0);

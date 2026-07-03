import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.argv[2] || '5173';
const URL = `http://localhost:${PORT}`;

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();
  
  console.log(`Navigating to ${URL}...`);
  
  // Screenshot 1: Home page
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: join(process.cwd(), 'screenshots/01-home-desktop.png'), fullPage: true });
  console.log('✓ Home page screenshot saved');
  
  // Screenshot 2: Mobile view
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: join(process.cwd(), 'screenshots/02-home-mobile.png'), fullPage: true });
  console.log('✓ Mobile view screenshot saved');
  
  await browser.close();
  console.log('All screenshots captured successfully!');
})();

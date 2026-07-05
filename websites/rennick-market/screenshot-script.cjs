const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  // Extra wait for lazy-loaded images
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshot-mobile-full.png', fullPage: true });
  // Desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshot-desktop-full.png', fullPage: true });
  await browser.close();
})();

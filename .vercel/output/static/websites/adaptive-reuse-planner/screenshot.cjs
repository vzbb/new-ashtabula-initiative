const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  // Desktop screenshot
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.screenshot({ path: 'screenshot-desktop.png', fullPage: true });
  
  // Tablet screenshot
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.screenshot({ path: 'screenshot-tablet.png', fullPage: true });
  
  // Mobile screenshot
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: 'screenshot-mobile.png', fullPage: true });
  
  await browser.close();
  console.log('Screenshots captured: desktop, tablet, mobile');
})();

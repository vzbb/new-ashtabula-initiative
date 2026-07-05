const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('Navigating...');
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle', timeout: 20000 });
  console.log('Page loaded, checking images...');
  
  // Wait for all images to finish loading
  await page.waitForFunction(() => {
    const imgs = document.querySelectorAll('img');
    return Array.from(imgs).length > 0 && Array.from(imgs).every(img => img.complete);
  }, { timeout: 15000 }).catch(() => console.log('Image wait timeout - continuing'));
  
  await page.waitForTimeout(2000);
  
  // Report image status
  const status = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img[src*="rennick"]')).map(img => ({
      src: img.src.split('/').pop(),
      loaded: img.complete && img.naturalWidth > 0,
      w: img.naturalWidth,
      h: img.naturalHeight,
      visible: img.offsetWidth > 0,
      offsetRect: `${img.offsetWidth}x${img.offsetHeight}`
    }));
  });
  
  console.log('Product images:', JSON.stringify(status, null, 2));
  
  await page.screenshot({ path: 'screenshot-desktop-v3.png', fullPage: true });
  console.log('Desktop v3 saved');
  
  // Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(3000);
  
  const mobStatus = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img[src*="rennick"]')).map(img => ({
      src: img.src.split('/').pop(),
      loaded: img.complete && img.naturalWidth > 0,
      w: img.naturalWidth,
      h: img.naturalHeight,
      visible: img.offsetWidth > 0,
      offsetRect: `${img.offsetWidth}x${img.offsetHeight}`
    }));
  });
  
  console.log('Mobile product images:', JSON.stringify(mobStatus, null, 2));
  
  await page.screenshot({ path: 'screenshot-mobile-v3.png', fullPage: true });
  console.log('Mobile v3 saved');
  
  await browser.close();
})();

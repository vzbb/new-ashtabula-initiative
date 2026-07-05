const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  
  // Desktop
  const desk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desk.goto('http://localhost:4000', { waitUntil: 'networkidle', timeout: 15000 });
  await desk.waitForTimeout(2000);
  
  const cards = await desk.$$('button:has(img)');
  console.log('Desktop: found ' + cards.length + ' card buttons with images');
  
  await desk.screenshot({ path: 'screenshot-desktop-final.png', fullPage: true });
  console.log('Desktop screenshot saved');
  
  // Mobile
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mob.goto('http://localhost:4000', { waitUntil: 'networkidle', timeout: 15000 });
  await mob.waitForTimeout(2000);
  
  const mobCards = await mob.$$('button:has(img)');
  console.log('Mobile: found ' + mobCards.length + ' card buttons with images');
  
  await mob.screenshot({ path: 'screenshot-mobile-final.png', fullPage: true });
  console.log('Mobile screenshot saved');
  
  await browser.close();
})();

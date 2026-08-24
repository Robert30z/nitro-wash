const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 851, height: 315 } });
  await page.goto('file:///C:/Users/Roberto%20Mendez/Desktop/HQ/Nitro-Wash/fb-cover-fabrica.html', { waitUntil: 'load' });
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'C:/Users/Roberto Mendez/Desktop/HQ/Nitro-Wash/fb-cover.png' });
  await browser.close();
  console.log('fb-cover.png listo');
})();

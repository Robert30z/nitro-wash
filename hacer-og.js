const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto('file:///C:/Users/Roberto%20Mendez/Desktop/HQ/Nitro-Wash/og-fabrica.html', { waitUntil: 'load' });
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'C:/Users/Roberto Mendez/Desktop/HQ/Nitro-Wash/og.png' });
  await browser.close();
  console.log('og.png generado');
})();

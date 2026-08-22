const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  for (const [w, h, n] of [[390, 844, 'movil'], [1280, 800, 'laptop'], [1920, 1080, 'monitor']]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto('file:///C:/Users/Roberto%20Mendez/Desktop/HQ/Nitro-Wash/index.html', { waitUntil: 'load' });
    await page.waitForTimeout(600);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    const cw = await page.evaluate(() => document.documentElement.clientWidth);
    await page.screenshot({ path: `nw-${n}.png`, fullPage: true });
    console.log(`${n} ${w}px: overflow=${sw > cw ? 'SI ('+sw+')' : 'no'}`);
    await page.close();
  }
  await browser.close();
})();

// playwright no vive en esta carpeta. Se busca donde este, en vez de
// reventar con MODULE_NOT_FOUND segun desde donde se corra el script.
function cargarPlaywright() {
  const rutas = ['playwright', 'C:/Users/Roberto Mendez/ShopFlow/test/node_modules/playwright'];
  for (const r of rutas) { try { return require(r); } catch (e) {} }
  throw new Error('No encontre playwright. Instalalo o arregla la ruta aqui arriba.');
}
const { chromium } = cargarPlaywright();
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 851, height: 315 } });
  await page.goto('file:///C:/Users/Roberto%20Mendez/Desktop/HQ/Nitro-Wash/fb-cover-fabrica.html', { waitUntil: 'load' });
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'C:/Users/Roberto Mendez/Desktop/HQ/Nitro-Wash/fb-cover.png' });
  await browser.close();
  console.log('fb-cover.png listo');
})();

// Rinde el post de temporada. Misma receta que hacer-fb.js.
function cargarPlaywright() {
  const rutas = ['playwright', 'C:/Users/User/ShopFlow/test/node_modules/playwright'];
  for (const r of rutas) { try { return require(r); } catch (e) {} }
  throw new Error('No encontre playwright.');
}
const { chromium } = cargarPlaywright();
const base = 'C:/Users/User/Desktop/HQ/Nitro-Wash';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  await page.goto('file:///' + encodeURI(base + '/fb-post-temporada-fabrica.html'), { waitUntil: 'load' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: base + '/fb-post-temporada.png' });
  // se mide, no se supone: cuantas gotas salieron y donde cae cada bloque de texto
  const m = await page.evaluate(() => {
    const caja = s => { const e = document.querySelector(s); if (!e) return null;
      const r = e.getBoundingClientRect();
      return {izq:Math.round(r.left),der:Math.round(r.right),arriba:Math.round(r.top),abajo:Math.round(r.bottom)}; };
    return { titulo: document.title, gotas: document.querySelectorAll('.gota').length,
             abre: caja('.abre'), dice: caja('.dice'), cta: caja('.cta'), precio: caja('.precio') };
  });
  console.log(JSON.stringify(m, null, 1));
  await browser.close();
})();

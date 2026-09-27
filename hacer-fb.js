// Rinde los dos assets de la pagina de Facebook: portada y foto de perfil.
function cargarPlaywright() {
  const rutas = ['playwright', 'C:/Users/User/ShopFlow/test/node_modules/playwright'];
  for (const r of rutas) { try { return require(r); } catch (e) {} }
  throw new Error('No encontre playwright. Instalalo o arregla la ruta aqui arriba.');
}
const { chromium } = cargarPlaywright();
const base = 'C:/Users/User/Desktop/HQ/Nitro-Wash';
const piezas = [
  { html: 'fb-cover-fabrica.html',  png: 'fb-cover.png',  w: 1640, h: 624 },
  { html: 'fb-post-lanzamiento-fabrica.html', png: 'fb-post-lanzamiento.png', w: 1080, h: 1350 },
];
(async () => {
  const browser = await chromium.launch();
  for (const p of piezas) {
    const page = await browser.newPage({ viewport: { width: p.w, height: p.h } });
    await page.goto('file:///' + encodeURI(base + '/' + p.html), { waitUntil: 'load' });
    await page.waitForTimeout(700);
    await page.screenshot({ path: base + '/' + p.png });
    // el ancho del bloque de texto decide si el movil lo recorta: se mide, no se supone
    const caja = await page.evaluate(() => {
      const b = document.querySelector('.bloque') || document.querySelector('.centro');
      if (!b) return null;
      const r = b.getBoundingClientRect();
      return { izq: Math.round(r.left), der: Math.round(r.right), arriba: Math.round(r.top), abajo: Math.round(r.bottom) };
    });
    console.log(p.png, 'listo', caja ? JSON.stringify(caja) : '');
    await page.close();
  }
  await browser.close();
})();

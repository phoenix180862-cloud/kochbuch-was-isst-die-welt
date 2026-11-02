/* TW Renovierungs-App – Offline-Speicher. Versionsstempel bei jeder Änderung erhöhen. */
const STAND = 'twreno-20261102-2345';
const V = '?v=20261102-2345';
const KERN = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'favicon-32.png', 'apple-touch-icon.png', 'bilder/tw-logo.jpg', 'bilder/korn.png',
  'schrift/oswald-latin-500-normal.woff2', 'schrift/oswald-latin-600-normal.woff2', 'schrift/source-sans-3-latin-400-normal.woff2', 'schrift/source-sans-3-latin-600-normal.woff2', 'schrift/source-sans-3-latin-700-normal.woff2',
  'css/app.css' + V, 'frei-config.js' + V, ...['rechner', 'katalog-basis', 'katalog-waende', 'katalog-boden-sanitaer', 'katalog-haus', 'katalog-innen2', 'katalog-haus2', 'bilder', 'videos', 'stand', 'speicher', 'ki', 'hilfe', 'app'].map(n => 'js/' + n + '.js' + V)];
self.addEventListener('install', e => { e.waitUntil(caches.open(STAND).then(c => c.addAll(KERN)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(l => Promise.all(l.filter(k => k.startsWith('twreno-') && k !== STAND && k !== 'twreno-videos').map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  /* Videos nur bei Bedarf: werden beim Ansehen geladen und erst dann (ganz) zwischengespeichert. Range-Anfragen gehen ans Netz. */
  if (url.pathname.includes('/videos/') && url.pathname.endsWith('.mp4')) {
    e.respondWith(caches.open('twreno-videos').then(async c => {
      const t = await c.match(url.pathname);
      if (t) return t;
      if (!e.request.headers.get('range')) { const a = await fetch(e.request); if (a.ok && a.status === 200) c.put(url.pathname, a.clone()); return a; }
      fetch(url.pathname).then(a => { if (a.ok && a.status === 200) c.put(url.pathname, a); }).catch(() => {});
      return fetch(e.request);
    }));
    return;
  }
  e.respondWith(caches.match(e.request).then(t => t || fetch(e.request).then(a => {
    if (a.ok && !url.pathname.endsWith('.mp4')) { const k = a.clone(); caches.open(STAND).then(c => c.put(e.request, k)); }
    return a;
  }).catch(() => e.request.mode === 'navigate' ? caches.match('index.html') : Response.error())));
});

/* „Was isst die Welt?“ – Offline-Speicher: einmal geöffnete Seiten und Küchen funktionieren auch ohne Netz */
const STAND = 'weltkochbuch-20261028-0800';
const KERN = ['./', 'index.html', 'frei-config.js?v=20261028-0800', 'css/app.css?v=20261028-0800', 'js/kuechen.js?v=20261028-0800', 'js/muster.js?v=20261028-0800',
  'js/bilder.js?v=20261028-0800', 'js/ki.js?v=20261028-0800', 'js/sprache.js?v=20261028-0800', 'js/app.js?v=20261028-0800', 'daten/index.js?v=20261028-0800', 'manifest.json', 'icon-192.png', 'bilder/loeffel.svg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(STAND).then(c => c.addAll(KERN)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(l => Promise.all(l.filter(k => k.startsWith('weltkochbuch-') && k !== STAND).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.hostname === 'generativelanguage.googleapis.com') return;
  e.respondWith(caches.match(e.request).then(treffer => treffer || fetch(e.request).then(antwort => {
    if (antwort.ok && (url.origin === location.origin || url.hostname.endsWith('gstatic.com') || url.hostname.endsWith('googleapis.com'))) {
      const kopie = antwort.clone(); caches.open(STAND).then(c => c.put(e.request, kopie));
    }
    return antwort;
  }).catch(() => caches.match('index.html'))));
});

/* Gym Tracker service worker.
   Bump CACHE when you change any file, so installed phones pick up the update. */
const CACHE = 'gym-tracker-v11';
const MON_IDS = [4,5,6,7,8,9,16,17,18,25,26,58,59,63,64,65,66,67,68,74,75,76,92,93,94,95,129,130,131,133,134,135,136,143,147,148,149,150];
const BOSS_IDS = [45,110,112,121];
const TRAINERS = ['red','leaf','oak','brock','misty','ltsurge','erika','koga','sabrina','blaine','giovanni','lorelei','bruno','agatha','lance','blue'];
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './fonts/press-start-2p.woff2',
  './fonts/vt323.woff2'
]
  .concat(MON_IDS.map((i) => './sprites/' + i + '.png'))
  .concat(MON_IDS.map((i) => './sprites/shiny/' + i + '.png'))
  .concat(MON_IDS.map((i) => './sprites/back/' + i + '.png'))
  .concat(MON_IDS.map((i) => './sprites/back/shiny/' + i + '.png'))
  .concat(BOSS_IDS.map((i) => './sprites/' + i + '.png'))
  .concat(TRAINERS.map((t) => './sprites/trainers/' + t + '.png'));

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // Pages: try network first (so updates arrive), fall back to cache when offline.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Everything else: cache first, then network.
  e.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {
          if (res.ok && new URL(req.url).origin === location.origin) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
    )
  );
});

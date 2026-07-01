/* Gym Tracker service worker.
   Bump CACHE when you change any file, so installed phones pick up the update. */
const CACHE = 'gym-tracker-v16';
/* Catchable lines (have front + shiny + back + back-shiny sprites). */
const MON_IDS = [4,5,6,7,8,9,16,17,18,25,26,27,28,37,38,52,53,54,55,57,58,59,63,64,65,66,67,68,74,75,76,92,93,94,95,96,97,104,105,106,107,112,129,130,131,133,134,135,136,143,147,148,149,150];
/* Boss team members shown front-on only. */
const BOSS_IDS = [31,42,45,49,51,71,78,87,89,100,109,110,114,120,121,124,142];
/* Wild-only species (front + shiny front — 5% of wild spawns are shiny). */
const WILD_IDS = [10,11,13,14,19,21,23,29,32,35,39,41,43,46,48,50,56,60,69,72,77,81,84,86,88,90,98,102,109,111,116,118];
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
  .concat(WILD_IDS.map((i) => './sprites/' + i + '.png'))
  .concat(WILD_IDS.map((i) => './sprites/shiny/' + i + '.png'))
  .concat(TRAINERS.map((t) => './sprites/trainers/' + t + '.png'))
  .concat(['./map/viridian.png']);

self.addEventListener('install', (e) => {
  // Add each asset individually so one missing file can't abort the whole install.
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.all(ASSETS.map((u) => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
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

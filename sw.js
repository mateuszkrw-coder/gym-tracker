/* Gym Tracker service worker.
   Bump CACHE when you change any file, so installed phones pick up the update. */
const CACHE = 'gym-tracker-v27';
const TOWN_MAPS = ['viridian','pewter','cerulean','vermilion','celadon','fuchsia','saffron','cinnabar','indigo'];
const ARENAS = ['gym','grass','water','cave','pond','ice','sand','poison','teal','psychic'];
/* Catchable lines (have front + shiny + back + back-shiny sprites). */
const MON_IDS = [4,5,6,7,8,9,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,81,82,88,89,92,93,94,95,96,97,100,101,104,105,106,107,109,110,111,112,115,120,121,129,130,131,133,134,135,136,142,143,144,145,146,147,148,149,150,151];
/* Boss team members shown front-on only. */
const BOSS_IDS = [87,114,124];
/* Wild-only species (front + shiny front — 5% of wild spawns are shiny). */
const WILD_IDS = [10,11,13,14,84,86,90,98,102,116,118];
const TRAINERS = ['red','leaf','oak','brock','misty','ltsurge','erika','koga','sabrina','blaine','giovanni','lorelei','bruno','agatha','lance','blue',
  'bugcatcher','youngster','lass','hiker','fisherman','picnicker'];
const ITEM_KEYS = ['potion','superpotion','hyperpotion','revive','pokeball','greatball','ultraball','xattack','luckyegg','hpup','protein','iron','calcium','zinc','carbos','rarecandy'];
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
  .concat(ITEM_KEYS.map((k) => './sprites/items/' + k + '.png'))
  .concat(TOWN_MAPS.map((t) => './map/' + t + '.png'))
  .concat(ARENAS.map((a) => './sprites/arenas/' + a + '.png'));

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

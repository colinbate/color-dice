let version = '6.1.0';

let cacheName = "DiceCacheV" + version;

let filesToCache = [
  "/",
  "/index.html",
  "/dice.min.js",
  "/dice.min.css",
  "/icon-dice.css",
  "/wood.jpg",
  "/manifest.json"
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then((cache) =>{
      return cache.addAll(filesToCache);
    }).then(() => {
      console.log('[SW] service worker installed...');
      self.skipWaiting();
    })
  );
  
});

self.addEventListener('fetch', function(event) {
  console.log('[SW] ' + event.request.url);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[SW] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[SW] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    }).then(function() {
      console.log('[SW] Claiming clients for ', cacheName);
      return self.clients.claim();
    })
  );
});
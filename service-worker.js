let version = 1.1;

let cacheName = "DiceCacheV" + version;

let filesToCache = [
  "/",
  "/index.html",
  "/dice.js",
  "/dice.css",
  "/wood.jpg"
];

self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(cacheName).then((cache) =>{
    return cache.addAll(filesToCache);
  }));
  console.log('service worker installed...');
});

self.addEventListener('fetch', function(event) {
  console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('service worker: Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('service worker: Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});
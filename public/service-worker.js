importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js");

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  
  // This line will be replaced and will contain all necessary precache files
  workbox.precaching.precacheAndRoute([]);
  
  workbox.routing.registerRoute(
    new RegExp(/\.(?:html|js|css)$/),
    workbox.strategies.networkFirst({
      cacheName: 'pwa-app',
      networkTimeoutSeconds: 10
    }) 
  );

  workbox.routing.registerRoute(
    new RegExp(/\.(?:png|jpg|jpeg|svg)$/),
    workbox.strategies.cacheFirst({
      cacheName: 'pwa-media',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 20,
          maxAgeSeconds: 60*60*24,
        })
      ]
    })
  );
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

// Make sure the offline page is cached
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('app')
    .then(function(cache) {
      return cache.addAll(['index.html']);
    })
  );
});

// Get offline page from cache when trying to fetch a 'navigate' resource (read page) and it fails (read user is offline)
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(error => {
        return caches.match('index.html');
      })
    );
  }
});
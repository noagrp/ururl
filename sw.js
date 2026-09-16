const CACHE='ururl-v2';
const ASSETS=[
  './',
  './index.html',
  './p1.html',
  './v.html',
  './main.css',
  './app.js',
  './ururl-core.js',
  './block.js',
  './qr.js',
  './blacklist.json',
  './manifest.webmanifest',
  './favicon-32x32.png',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==location.origin)return;

  if(event.request.mode==='navigate'){
    event.respondWith(
      fetch(event.request).then(response=>{
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy));
        return response;
      }).catch(async()=>{
        if(url.pathname.endsWith('/p1.html')) return (await caches.match('./p1.html')) || Response.error();
        if(url.pathname.endsWith('/v.html')) return (await caches.match('./v.html')) || Response.error();
        return (await caches.match('./index.html')) || Response.error();
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put(event.request,copy));
      return response;
    }))
  );
});

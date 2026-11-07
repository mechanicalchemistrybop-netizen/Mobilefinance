/* Money dashboard service worker. Bump VERSION whenever you replace files in /libs or /icons. */
const VERSION='v1.4';
const CACHE='money-'+VERSION;
const SHELL=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png','libs/xlsx.full.min.js','libs/chart.umd.js','libs/chartjs-plugin-datalabels.min.js'];
const CDN='cdn.jsdelivr.net';

self.addEventListener('install',e=>{
  e.waitUntil((async()=>{
    const c=await caches.open(CACHE);
    // add files one by one so a single missing file never blocks installation
    await Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    for(const k of await caches.keys())if(k.startsWith('money-')&&k!==CACHE)await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  const sameOrigin=url.origin===self.location.origin;
  // Never touch live price/NAV feeds, proxies, local helper endpoints or the Excel file itself.
  if(!sameOrigin&&url.hostname!==CDN)return;
  if(sameOrigin&&(/\.xlsx?$/i.test(url.pathname)||url.pathname.startsWith('/api/')||url.pathname.startsWith('/yq')))return;

  // Pages: network first (so updates arrive), cached copy when offline.
  if(req.mode==='navigate'||(sameOrigin&&/\/(index\.html)?$/.test(url.pathname))){
    e.respondWith((async()=>{
      try{
        const fresh=await Promise.race([fetch(req),new Promise((_,rej)=>setTimeout(()=>rej(new Error('slow')),4000))]);
        if(fresh&&fresh.ok){const c=await caches.open(CACHE);c.put('index.html',fresh.clone())}
        return fresh;
      }catch(_){
        return (await caches.match('index.html'))||(await caches.match('./'))||Response.error();
      }
    })());
    return;
  }
  // Libraries, icons, manifest: cache first, fill the cache on first use.
  e.respondWith((async()=>{
    const hit=await caches.match(req);
    if(hit)return hit;
    try{
      const res=await fetch(req);
      if(res&&(res.ok||res.type==='opaque')){const c=await caches.open(CACHE);c.put(req,res.clone())}
      return res;
    }catch(err){return hit||Response.error()}
  })());
});

/* Finance Dashboard PWA service worker · v6.4
   Bump this cache name whenever index.html or bundled app assets change. */
const CACHE='finance-dashboard-shell-v6.4';
const BASE=self.registration.scope;
const shell=[
  BASE,
  new URL('index.html',BASE).href,
  new URL('manifest.webmanifest',BASE).href,
  new URL('libs/xlsx.full.min.js',BASE).href,
  new URL('libs/chart.umd.js',BASE).href,
  new URL('libs/chartjs-plugin-datalabels.min.js',BASE).href,
  new URL('icons/favicon-32.png',BASE).href,
  new URL('icons/apple-touch-icon.png',BASE).href
];

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await Promise.allSettled(shell.map(async url=>{
      try{
        const response=await fetch(url,{cache:'reload'});
        if(response.ok)await cache.put(url,response);
      }catch(error){}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('finance-dashboard-')&&key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  const navigation=request.mode==='navigate';
  const workbook=/\\/finance_data\\.xlsx$/i.test(url.pathname);

  if(navigation||workbook){
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE);
      try{
        const response=await fetch(request,{cache:'no-store'});
        if(response.ok){
          const key=navigation?new URL('index.html',BASE).href:request.url;
          cache.put(key,response.clone()).catch(()=>{});
        }
        return response;
      }catch(error){
        const cached=await cache.match(navigation?new URL('index.html',BASE).href:request);
        return cached||await cache.match(BASE)||Response.error();
      }
    })());
    return;
  }

  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const cached=await cache.match(request);
    const update=fetch(request).then(response=>{
      if(response.ok)cache.put(request,response.clone());
      return response;
    }).catch(()=>null);
    return cached||await update||Response.error();
  })());
});

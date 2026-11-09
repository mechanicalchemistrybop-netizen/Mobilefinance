/* Finance Dashboard PWA service worker */
const CACHE='finance-dashboard-shell-v2';
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
    const c=await caches.open(CACHE);
    await Promise.allSettled(shell.map(async u=>{
      try{const r=await fetch(u,{cache:'reload'});if(r.ok)await c.put(u,r)}catch(e){}
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('finance-dashboard-')&&k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  const isNavigation=req.mode==='navigate';
  const isWorkbook=/\/finance_data\.xlsx$/i.test(url.pathname);
  if(isNavigation||isWorkbook){
    event.respondWith((async()=>{
      const c=await caches.open(CACHE);
      try{
        const r=await fetch(req);
        if(r.ok){const key=isNavigation?new URL('index.html',BASE).href:req.url;c.put(key,r.clone()).catch(()=>{})}
        return r;
      }catch(e){
        const cached=await c.match(isNavigation?new URL('index.html',BASE).href:req);
        return cached||await c.match(BASE)||Response.error();
      }
    })());
    return;
  }
  event.respondWith((async()=>{
    const c=await caches.open(CACHE),hit=await c.match(req);
    const update=fetch(req).then(r=>{if(r.ok)c.put(req,r.clone());return r}).catch(()=>null);
    return hit||await update||Response.error();
  })());
});

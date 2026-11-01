'use strict';
const CACHE='fb-shell-v10';
const RUNTIME='fb-runtime-v10';
const SHELL=['./','index.html','privacidade.html','manifest.json','avisos.json','data/fundos.json','data/puzzles.json','icon-180.png','icon-192.png','icon-512.png','icon-maskable-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE&&k!==RUNTIME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const req=e.request;if(req.method!=='GET')return;const u=new URL(req.url);if(u.origin!==self.location.origin)return;
 const path=u.pathname;const isAsset=/\.(?:jpg|jpeg|webp|png|json)$/i.test(path);
 if(!isAsset&&!SHELL.some(x=>path.endsWith(x.replace('./','/')))&&path!=='/')return;
 e.respondWith((async()=>{const cache=await caches.open(isAsset?RUNTIME:CACHE);try{const res=await fetch(req);if(res&&res.ok){cache.put(req,res.clone()).catch(()=>{});}return res;}catch(err){const hit=await caches.match(req);if(hit)return hit;if(path.endsWith('index.html')||path.endsWith('/'))return (await caches.match('index.html'))||Response.error();return Response.error();}})());
});

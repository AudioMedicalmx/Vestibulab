// VestibuLab · © 2026 Dr. Antonio Aldana Vargas · AudioMedical MX. Todos los derechos reservados.
// Service worker de VestibuLab: guarda la app para usarla sin conexión.
// La página principal se pide primero a internet (para recibir actualizaciones) y, sin conexión, se usa la copia guardada.
const CACHE='vestibulab-v13';
const FILES=['./','index.html','three.min.js','OrbitControls.js','jspdf.umd.min.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon-192-maskable.png','icons/icon-512-maskable.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  const isPage=e.request.mode==='navigate'||(url.origin===self.location.origin&&(url.pathname.endsWith('/')||url.pathname.endsWith('index.html')));
  if(isPage){
    e.respondWith(fetch(e.request,{cache:'no-cache'}).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put('index.html',copy));}return res;})
      .catch(()=>caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{
    if(res.ok&&(url.origin===self.location.origin||url.href.includes('fonts.g'))){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}
    return res;}).catch(()=>caches.match('index.html'))));
});

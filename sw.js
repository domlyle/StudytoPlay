/* StudyRank service worker: makes the app open and work offline.
   Bump CACHE (e.g. 'sr-v2') only if you change the PRECACHE list. */
const CACHE='sr-v1';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
const LIBS=[
 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js',
 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js',
 'https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/sql-asm.js',
 'https://cdn.jsdelivr.net/npm/fzstd@0.1.1/umd/index.js',
 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js',
 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js',
 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Rajdhani:wght@600;700&display=swap'
];
/* Cross-origin hosts whose files are cached the first time they are used (fonts, Firebase SDK, libraries). */
const CDN=['cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com','www.gstatic.com'];

self.addEventListener('install',e=>{
  e.waitUntil((async()=>{
    const c=await caches.open(CACHE);
    await c.addAll(CORE).catch(()=>Promise.allSettled(CORE.map(u=>c.add(u))));
    await Promise.allSettled(LIBS.map(u=>c.add(new Request(u,{mode:'cors'}))));
    self.skipWaiting();
  })());
});

self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    for(const k of await caches.keys())if(k!==CACHE)await caches.delete(k);
    await self.clients.claim();
  })());
});

const ok=r=>r&&(r.ok||r.type==='opaque');
async function put(req,res){if(ok(res)){const c=await caches.open(CACHE);c.put(req,res.clone()).catch(()=>{})}return res}

/* Pages: try the network first (so updates arrive), give up after 3s and use the cached copy. */
function networkFirst(req){
  const cached=caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'));
  return new Promise(resolve=>{
    let done=false;
    const fallback=()=>cached.then(r=>{if(!done&&r){done=true;resolve(r)}});
    const t=setTimeout(fallback,3000);
    fetch(req).then(res=>{clearTimeout(t);if(ok(res)){done=true;put(req,res.clone());resolve(res)}else fallback()}).catch(()=>{clearTimeout(t);fallback().then(()=>{if(!done){done=true;resolve(Response.error())}})});
  });
}
/* Libraries/fonts: cached copy first, fetch and store if missing. */
async function cacheFirst(req){
  const hit=await caches.match(req);
  if(hit)return hit;
  const res=await fetch(req);
  return put(req,res);
}

self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const u=new URL(req.url);
  if(u.origin===location.origin){
    e.respondWith(req.mode==='navigate'?networkFirst(req):
      fetch(req).then(r=>put(req,r)).catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||Response.error())));
  }else if(CDN.includes(u.hostname)){
    e.respondWith(cacheFirst(req).catch(()=>Response.error()));
  }
  /* everything else (AI APIs, Firestore, Google Drive, sign-in) goes straight to the network */
});

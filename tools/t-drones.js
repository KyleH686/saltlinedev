// how often do Gulls end up inside the derrick's footprint? node tools/t-drones.js [file]
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:480,height:270}});
const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
await p.goto('file://'+process.cwd()+'/'+(process.argv[2]||'dist/saltline.html')+'?map=drywell&autostart=1&q=test&noaudio=1');
await p.waitForFunction(()=>window.__ready&&__G.game.state==='playing',null,{timeout:180000});
const r=await p.evaluate(async()=>{const G=__G,P=G.player;G.render.frame=()=>{};P.invulnerable=true;const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 const V=(x,y,z)=>new G.THREE.Vector3(x,y,z);G.enemies.clear();
 for(const [x,z] of [[-14,-12],[14,12],[-12,14],[13,-13],[0,18],[18,0]]) G.enemies.spawn('gull',V(x,6,z),{state:'alert'});
 const out={};let n=0,inside=0,near=0,minD=99;
 for(const [x,y,z] of [[9,0,0],[-8,0,3],[0,0,-9],[2,0,8],[-1.5,2.6,-0.2],[7,0,-7]]){ const t0=performance.now();
  while(performance.now()-t0<9000){ P.pos.set(x,y,z);P.vel.set(0,0,0);P.health=P.maxHealth; for(const e of G.enemies.list){ if(e.type!=='gull'||!e.alive) continue; e.hp=99; const d=Math.hypot(e.pos.x,e.pos.z); if(e.pos.y<16){n++; if(d<4.3)inside++; if(d<6)near++; if(d<minD)minD=d;} } await sleep(50);} }
 out.samples=n;out.insidePct=+(100*inside/n).toFixed(1);out.nearPct=+(100*near/n).toFixed(1);out.minD=+minD.toFixed(1);out.alive=G.enemies.list.filter(e=>e.alive&&e.type==='gull').length;out.modes=G.enemies.list.map(e=>e.mode).join(',');return out;});
console.log(process.argv[2]||'new',JSON.stringify(r),errs.join('|'));await b.close();})();

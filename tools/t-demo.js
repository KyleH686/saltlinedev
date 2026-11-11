// Demolition mode on Dry Well: plant four charges, extract, screenshot the collapse cinematic, retry.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:+(process.env.W||640),height:+(process.env.H||300)}});
const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('ERR: '+m.text().slice(0,300))});
await p.goto('file://'+process.cwd()+'/dist/saltline.html?map=drywell&mode=demolition&autostart=1&q=low&noaudio=1');
await p.waitForFunction(()=>window.__ready,null,{timeout:180000});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await p.evaluate(async()=>{const G=__G;window.__rf=G.render.frame;G.render.frame=()=>{};const w=ms=>new Promise(r=>setTimeout(r,ms));await w(3500);
 for(let i=0;i<4;i++){G.game.debugCut();await w(250);} G.enemies.clear();const ex=G.level.extraction.pos;G.player.pos.set(ex.x,0,ex.z);G.player.vel.set(0,0,0);});
await p.waitForFunction(()=>__G.game.state==='demo',null,{timeout:30000});
const shots=(process.env.SHOTS||'1.6,2.75,4.2,5.2,5.95,6.6,8.6,11').split(',').map(Number);
for(const s of shots){ await p.evaluate((s)=>{__G.game.debugCine(s);const f=__G.render.frame;__G.render.frame=window.__rf;return new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>{__G.render.frame=f;r();})))},s);
 await p.screenshot({path:'demo-'+s+'.png',timeout:120000}); }
const r=await p.evaluate(async()=>{const G=__G,T=G.level.tower;const o={state:G.game.state,rot:+T.lower.rotation.z.toFixed(2),mast:+T.mast.rotation.z.toFixed(2),complete:!!document.querySelector('.menu.show, .m-complete.show, [data-screen="complete"].show'),txt:document.body.innerText.match(/DEBRIEF[\s\S]{0,160}|TOWER[\s\S]{0,80}/i)?.[0]};
 return o;});
console.log(JSON.stringify(r));
const r2=await p.evaluate(async()=>{const G=__G,T=G.level.tower;document.querySelector('[data-s="complete"] [data-act="redeploy"]').click();await new Promise(r=>setTimeout(r,2500));
 return {state:G.game.state,rot:T.lower.rotation.z,y:T.lower.position.y,mast:T.mast.rotation.z,charges:G.level.objectives.map(o=>o.object.visible+':'+o.state).join(' '),fov:G.camera.fov};});
console.log(JSON.stringify(r2)); console.log(errs.slice(0,10).join('\n')); await b.close();})();

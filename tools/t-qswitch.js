// boots on one tier, switches through others from Settings, screenshots each: catches shader rebuild errors
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:960,height:540}});
const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));p.on('console',m=>{if(m.type()==='error'||m.type()==='warning'||/level geometry/.test(m.text()))errs.push(m.type()+': '+m.text().slice(0,300))});
await p.goto('file://'+process.cwd()+'/dist/saltline.html?noaudio=1&autostart=1&dynres=0&q='+(process.argv[2]||'low'),{timeout:240000});
await p.waitForFunction(()=>window.__ready&&__G.game.state==='playing',null,{timeout:400000});
const nf=async n=>{const f=await p.evaluate(()=>__frames);await p.waitForFunction(x=>__frames>=x,f+n,{timeout:300000});};
await p.evaluate(()=>{const P=__G.player;__G.enemies.clear();P.pos.set(-25,0,5);P.yaw=-Math.PI/2;P.pitch=-0.05;});
await nf(3); await p.screenshot({path:'q-'+(process.argv[2]||'low')+'.png',timeout:200000});
for(const q of process.argv.slice(3)){
  await p.evaluate(q=>{document.querySelector('[data-q="'+q+'"]').click();},q);
  await nf(3); await p.screenshot({path:'q-'+q+'.png',timeout:200000});
  console.log(q, JSON.stringify(await p.evaluate(()=>({q:__G.quality.name,taps:__G.quality.shTaps,s:__G.render.stats()}))));
}
console.log(errs.join('\n'));await b.close();})();

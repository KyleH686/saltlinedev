const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:640,height:360}});
const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('ERR: '+m.text().slice(0,300))});
await p.goto('file://'+process.cwd()+'/dist/saltline.html?autostart=1&q=test&noaudio=1&dt=0.04');
await p.waitForFunction(()=>window.__ready,null,{timeout:180000});
await p.evaluate(async()=>{const G=__G;G.enemies.clear();const P=G.player;const h=G.enemies.spawn("hound",new G.THREE.Vector3(P.pos.x+1.7,0,P.pos.z),{state:"patrol"}); P.yaw=-Math.PI/2; P.pitch=-0.25; window.__h=h;});
for(let k=0;k<4;k++){const f=await p.evaluate(()=>__frames);await p.waitForFunction(n=>__frames>n,f,{timeout:60000});}
await p.evaluate(()=>dispatchEvent(new KeyboardEvent("keydown",{code:"KeyF"})));
for(let k=0;k<9;k++){const f=await p.evaluate(()=>__frames);await p.waitForFunction(n=>__frames>n,f,{timeout:60000});
  if(k===1)await p.evaluate(()=>dispatchEvent(new KeyboardEvent("keyup",{code:"KeyF"})));
  await p.screenshot({path:`m${k}.png`,timeout:120000});}
console.log(JSON.stringify(await p.evaluate(()=>({alive:__h.alive,tds:__G.game.extras.st.takedowns,state:__G.weapon.state}))));
console.log(errs.join('\n'));await b.close();})();

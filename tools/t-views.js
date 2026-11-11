// screenshots from a list of player viewpoints: node tools/t-views.js '<query>' out-prefix 'x,y,z,yawDeg,pitchDeg' ...
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:+(process.env.W||960),height:+(process.env.H||540)}});
const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('ERR: '+m.text().slice(0,300))});
await p.goto('file://'+process.cwd()+'/dist/saltline.html'+process.argv[2],{timeout:300000});
await p.waitForFunction(()=>window.__ready&&__G.game.state==='playing',null,{timeout:600000});
await p.evaluate(()=>{__G.enemies.clear();__G.player.invulnerable=true;document.querySelector('.hud')&&(document.querySelector('.hud').style.opacity=process?0:0);}).catch(()=>{});
await p.evaluate(()=>{__G.enemies.clear();__G.player.invulnerable=true;const h=document.querySelector('.hud');if(h)h.style.display='none';});
const nf=async n=>{const f=await p.evaluate(()=>__frames);await p.waitForFunction(x=>__frames>=x,f+n,{timeout:600000});};
let k=0;
for(const v of process.argv.slice(4)){const [x,y,z,yaw,pitch]=v.split(',').map(Number);
  await p.evaluate(([x,y,z,yaw,pitch])=>{const P=__G.player;P.pos.set(x,y,z);P.vel.set(0,0,0);P.yaw=yaw*Math.PI/180;P.pitch=(pitch||0)*Math.PI/180;__G.enemies.clear();P.health=100;},[x,y,z,yaw,pitch]);
  await nf(4); await p.screenshot({path:`${process.argv[3]}-${k++}.png`,timeout:300000});}
console.log(errs.slice(0,10).join('\n'));await b.close();})();

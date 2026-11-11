const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const ctx=await b.newContext({...devices['iPhone 13 landscape']});
const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('ERR: '+m.text().slice(0,300))});
await p.goto('file://'+process.cwd()+'/dist/test-phone.html?q=test&noaudio=1',{timeout:240000});
await p.waitForFunction(()=>window.__ready,null,{timeout:240000});
await p.evaluate(()=>{__G.render.frame=()=>{};});
await p.tap('[data-act=deploy]',{force:true});
await p.waitForFunction(()=>__G.game.state==='playing',null,{timeout:120000});
const cdp=await ctx.newCDPSession(p);
const out={};
async function drag(dx,dy,label){
  await p.evaluate(()=>{const P=__G.player;P.pos.set(-25,0,5);P.vel.set(0,0,0);P.yaw=-Math.PI/2;P.pitch=0;__G.enemies.clear();P.health=100;});
  await p.waitForTimeout(150);
  const p0=await p.evaluate(()=>__G.player.pos.toArray().map(v=>+v.toFixed(1)));
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:150,y:250,id:1}]});
  for(let k=1;k<=6;k++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:150+dx*k/6,y:250+dy*k/6,id:1}]});await p.waitForTimeout(30);}
  await p.waitForTimeout(900);
  out[label]=await p.evaluate(p0=>({move:[+__G.input.move.x.toFixed(2),+__G.input.move.y.toFixed(2)],moved:+Math.hypot(__G.player.pos.x-p0[0],__G.player.pos.z-p0[2]).toFixed(1),speed:+__G.player.speed.toFixed(1),sl:__G.player.sliding,cr:__G.player.crouching}),p0);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]}); await p.waitForTimeout(300);
}
for(const mode of ['hold','toggle','auto']){
  await p.evaluate(m=>{__G.input.sprintMode=m;},mode);
  await drag(0,-25,mode+':half'); await drag(0,-80,mode+':full'); await drag(30,0,mode+':side'); await drag(0,30,mode+':back');
}
await p.evaluate(()=>{__G.input.sprintMode='hold';__G.input.crouchMode='toggle';});
await drag(0,-80,'run'); 
await p.evaluate(()=>{const P=__G.player;P.pos.set(-25,0,5);P.vel.set(0,0,0);P.yaw=-Math.PI/2;});
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:150,y:250,id:1}]});
for(let k=1;k<=6;k++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:150,y:250-80*k/6,id:1}]});await p.waitForTimeout(30);}
await p.waitForTimeout(900);
await p.tap('.t-crouch',{force:true}).catch(e=>out.tapErr=String(e).slice(0,80));
await p.waitForTimeout(1500);
out.afterSlide=await p.evaluate(()=>({move:[__G.input.move.x,__G.input.move.y],speed:+__G.player.speed.toFixed(1),sl:__G.player.sliding,cr:__G.player.crouching}));
await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]}); await p.waitForTimeout(300);
await drag(0,-80,'afterSlideRun'); await drag(0,-25,'afterSlideWalk');
console.log(JSON.stringify(out,null,0).replace(/},/g,'},\n'));
console.log(errs.join('\n'));await b.close();})();

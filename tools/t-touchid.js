// iOS hands out touch identifiers of any sign. Walk with a negative one and with zero.
const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const ctx=await b.newContext({...devices['iPhone 13 landscape']});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
await p.goto('file://'+process.cwd()+'/'+(process.argv[2]||'dist/test-phone.html')+'?q=test&noaudio=1&autostart=1',{timeout:240000});
await p.waitForFunction(()=>window.__ready,null,{timeout:240000});
await p.evaluate(()=>{__G.render.frame=()=>{};});
await p.waitForFunction(()=>__G.game.state==='playing',null,{timeout:120000});
const r=await p.evaluate(async()=>{
  const sleep=ms=>new Promise(r=>setTimeout(r,ms)); const G=__G,P=G.player,c=G.renderer.domElement; const out={};
  const ev=(type,list,changed)=>c.dispatchEvent(new TouchEvent(type,{bubbles:true,cancelable:true,touches:list,targetTouches:list,changedTouches:changed}));
  for(const id of [-1295728768, 0, 7]){
    P.pos.set(-25,0,5); P.vel.set(0,0,0); P.yaw=-Math.PI/2; G.enemies.clear(); await sleep(150);
    const mk=(x,y)=>new Touch({identifier:id,target:c,clientX:x,clientY:y});
    let t=mk(150,250); ev('touchstart',[t],[t]);
    for(let k=1;k<=6;k++){ t=mk(150,250-k*12); ev('touchmove',[t],[t]); await sleep(30); }
    await sleep(900);
    out['id '+id]={move:[G.input.move.x,G.input.move.y],moved:+Math.hypot(P.pos.x+25,P.pos.z-5).toFixed(1),ring:document.querySelector('.t-stick')?.classList.contains('on')};
    ev('touchend',[],[t]); await sleep(200);
    out['id '+id].ringAfterLift=document.querySelector('.t-stick')?.classList.contains('on');
    // look with the right thumb
    const y0=P.yaw; const mk2=(x,y)=>new Touch({identifier:id,target:c,clientX:x,clientY:y});
    let u=mk2(600,200); ev('touchstart',[u],[u]); for(let k=1;k<=5;k++){ u=mk2(600+k*15,200); ev('touchmove',[u],[u]); await sleep(30);} ev('touchend',[],[u]); await sleep(150);
    out['id '+id].lookTurned=Math.abs(P.yaw-y0)>0.02;
  }
  return out;});
console.log(JSON.stringify(r,null,1));console.log(errs.join('\n'));await b.close();})();

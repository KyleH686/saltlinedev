const G=__G; G.render.frame=()=>{}; const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const key=(code,down)=>dispatchEvent(new KeyboardEvent(down?"keydown":"keyup",{code}));
const g=G.game,x=g.extras,P=G.player,E=G.enemies; const out={};
await sleep(500);
E.clear();
const spot=new G.THREE.Vector3(-20,0,8);
async function trial(crouch,dist,behind){
  E.clear(); const h=E.spawn("hound",spot.clone(),{state:"patrol"}); await sleep(100);
  h.passive=false; h.mode="patrol"; h.seeT=0;
  crouch?key("KeyC",true):key("KeyC",false);
  const t0=G.time.t; let res=null;
  for(let k=0;k<120;k++){ const f=h.fwd; const s=behind?-1:1;
    P.pos.set(h.pos.x+f.x*dist*s,0,h.pos.z+f.z*dist*s); P.vel.set(0,0,0);
    await sleep(50); if(h.mode==="engage"){res="engaged";break;} }
  key("KeyC",false);
  return {res:res||"unseen", gameSecs:+(G.time.t-t0).toFixed(1), crouching:P.crouching, susp:+(h.susp||0).toFixed(2), meter:document.querySelector(".sl-detect").className};
}
out.stand8=await trial(false,8);
out.crouch8=await trial(true,8);
out.crouch20=await trial(true,20);
out.behind6=await trial(false,6,true);
// melee takedown from behind
E.clear(); const h=E.spawn("hound",spot.clone(),{state:"patrol"}); await sleep(200);
const g2=E.spawn("gull",new G.THREE.Vector3(-14,6,8),{state:"patrol"}); await sleep(100);
h.mode="patrol";
const f=h.fwd; P.pos.set(h.pos.x-f.x*1.6,0,h.pos.z-f.z*1.6); P.yaw=Math.atan2(-(h.pos.x-P.pos.x),-(h.pos.z-P.pos.z)); P.pitch=-0.2;
await sleep(150);
key("KeyF",true); await sleep(80); key("KeyF",false); await sleep(300);
out.takedown={alive:h.alive, tds:x.st.takedowns, gullMode:g2.mode, msg:document.querySelector(".h-msg")?.textContent};
await sleep(1500);
out.drops=x.st.drops.length;
const w=G.weapon; const r0=w.reserve;
if(x.st.drops[0]){const d=x.st.drops[0].pos; P.pos.set(d.x,d.y,d.z); await sleep(300);}
out.ammo={before:r0, after:w.reserve, drops:x.st.drops.length};
// intel
for(const it of [...x.st.intelItems]){P.pos.set(it.pos.x,it.pos.y+0.05,it.pos.z);P.vel.set(0,0,0);await sleep(250);}
out.intel={got:x.st.intel,left:x.st.intelItems.length, hud:document.querySelector(".h-intel")?.textContent};
// finish
E.clear(); P.health=100; P.invulnerable=true;
for(let k=0;k<3;k++){g.debugCut(); await sleep(100);}
const ex=G.level.extraction.pos; P.pos.set(ex.x,ex.y,ex.z); await sleep(4500);
const q=s=>document.querySelector(s)?.textContent;
out.end={state:g.state, screen:g.menus.screen, rating:q("[data-f=rating]"), d:q("[data-f=dname]"), tds:q("[data-f=tds]"), quiet:q("[data-f=quiet]"), intel:q("[data-f=intel]"), nb:q("[data-f=newbest]"), best:localStorage.getItem("saltline.best.v1")};
out.errs=window.__errors;
return out;

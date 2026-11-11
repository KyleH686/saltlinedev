const G=__G; G.render.frame=()=>{}; const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const key=(c,d)=>dispatchEvent(new KeyboardEvent(d?"keydown":"keyup",{code:c}));
const P=G.player, out={}; await sleep(600); P.invulnerable=true;
out.patrol=G.enemies.list.filter(e=>e.alive).map(e=>e.type+"@"+e.pos.x.toFixed(0)+","+e.pos.z.toFixed(0)).join(" ");
G.enemies.clear();
async function walk(x,y,z,yawDeg,ms){ P.pos.set(x,y,z); P.vel.set(0,0,0); P.yaw=yawDeg*Math.PI/180; P.pitch=0; await sleep(150); key("KeyW",true); await sleep(ms); key("KeyW",false); await sleep(250); return [P.pos.x,P.pos.y,P.pos.z].map(v=>+v.toFixed(2)).join(","); }
out.flight1=await walk(-1.9,0,3.6,-90,1500);
out.toFlight2=await walk(3.6,2.6,2.6,0,2100);
out.strip2=await walk(3.6,5.2,-2,90,500);
out.toFlight3=await walk(2.6,5.2,-3.65,90,2000);
out.ontoDeck3=await walk(-2.2,7.8,-3.7,180,700);
out.topDeckWalk=await walk(-1.2,7.8,-3.6,180,900);
out.contStairs=await walk(5.4,0,12.4,-90,3800);
// rails hold: run at the edge of the top deck
out.railHold=await walk(0,7.8,0,-90,1500);
// nav: every ground spawn can reach the three relays' surroundings and the truck
const nav=G.physics.nav; const tgt=[[-2,4.6],[11,-12],[12.9,13.6],[G.level.extraction.pos.x,G.level.extraction.pos.z],[0,19]];
let bad=[]; for(const s of G.level.enemySpawns.filter(s=>s.type==="ground")){ for(const t of tgt){ let p=null; try{ p=nav.findPath(new G.THREE.Vector3(s.pos.x,0,s.pos.z),new G.THREE.Vector3(t[0],0,t[1])); }catch(e){ p="ERR "+e.message; } if(!p||!p.length) bad.push(s.pos.x.toFixed(0)+","+s.pos.z.toFixed(0)+"->"+t.join(",")); } }
out.navBad=bad; out.cover=G.level.coverPoints.filter(c=>!nav.isWalkable(c.x,c.z)).length;
// mission
const x=G.game.extras; out.intel=x.st.intelItems.map(i=>[i.pos.x,i.pos.y,i.pos.z].map(v=>+v.toFixed(1)).join(","));
for(const it of [...x.st.intelItems]){P.pos.set(it.pos.x,it.pos.y+0.05,it.pos.z);P.vel.set(0,0,0);await sleep(250);}
out.intelGot=x.st.intel;
P.pos.set(-1.5,2.6,-0.2); await sleep(200);
for(let k=0;k<3;k++){G.game.debugCut(); await sleep(1200);} 
out.afterCut={alive:G.enemies.aliveCount(), obj:document.querySelector(".h-obj")?.textContent.replace(/\s+/g," ").slice(0,60)};
await sleep(3000); out.wave=G.enemies.list.filter(e=>e.alive).map(e=>e.type[0]+"@"+e.pos.x.toFixed(0)+","+e.pos.z.toFixed(0)+":"+e.mode).join(" ");
G.enemies.clear(); const ex=G.level.extraction.pos; P.pos.set(ex.x,0,ex.z); await sleep(4500);
const q=s=>document.querySelector(s)?.textContent;
out.end={state:G.game.state, rating:q("[data-f=rating]"), hdr:document.querySelector(".m-screen[data-s=complete] .m-k")?.textContent, best:localStorage.getItem("saltline.best.v1")};
out.errs=window.__errors; return out;

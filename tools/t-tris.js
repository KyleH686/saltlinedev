const G=__G; const sleep=ms=>new Promise(r=>setTimeout(r,ms)); await sleep(5000);
const P=G.player; const r=G.renderer; const orig=r.render.bind(r); let main=null, noShadow=true;
r.render=function(sc,cam){ const far=cam.far>100&&cam.isPerspectiveCamera; if(far&&noShadow) r.shadowMap.needsUpdate=false; const t0=r.info.render.triangles,c0=r.info.render.calls; orig(sc,cam); if(far) main=[r.info.render.triangles-t0, r.info.render.calls-c0]; };
const views={yardEast:[-25,0,5,-Math.PI/2], yardWest:[-10,0,5,Math.PI/2], quayNorth:[20,0,-10,0], centreSouth:[0,0,0,Math.PI], cornerOut:[-36,0,-26,Math.PI*0.75], cornerIn:[-36,0,-26,-Math.PI*0.25]};
const res={};
for(const k in views){ const v=views[k]; P.pos.set(v[0],v[1],v[2]); P.yaw=v[3]; P.pitch=0; for(let n=0;n<2;n++){ const f=__frames; while(__frames===f) await sleep(30);} res[k]=main.join("/"); }
noShadow=false; { const f=__frames; while(__frames<f+2) await sleep(30); res.withShadow=main.join("/"); }
return JSON.stringify(res)

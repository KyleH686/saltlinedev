// usage: node tools/t-prof.js '<query>' '<setup js>'  -> ms per frame (software renderer; relative numbers only)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:+(process.env.W||1280),height:+(process.env.H||720)}});
await p.goto('file://'+process.cwd()+'/'+(process.env.PAGE||'dist/saltline.html')+process.argv[2],{timeout:240000});
await p.waitForFunction(()=>window.__ready,null,{timeout:240000});
const r=await p.evaluate(new Function('return (async()=>{const G=__G;const sleep=ms=>new Promise(r=>setTimeout(r,ms));'+(process.argv[3]||'')+';await sleep(4000);const N=+('+(process.env.N||5)+');let f0=__frames,t0=performance.now();while(__frames<f0+1)await sleep(20);f0=__frames;t0=performance.now();while(__frames<f0+N)await sleep(20);const s=G.render.stats();return {ms:Math.round((performance.now()-t0)/(__frames-f0)),calls:s.calls,tris:s.tris,res:s.res.join("x")};})()'));
console.log(process.argv[2],'|',(process.argv[3]||'').slice(0,60),'=>',JSON.stringify(r));await b.close();})();

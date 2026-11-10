// usage: node t-eval.js '<query>' 'js expr (async fn body)'
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:+(process.env.W||480),height:+(process.env.H||270)}});
const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('ERR: '+m.text().slice(0,400))});
await p.goto('file://'+process.cwd()+'/dist/saltline.html'+(process.argv[2]||'?q=test&noaudio=1'));
await p.waitForFunction(()=>window.__ready,null,{timeout:180000});
const r=await p.evaluate(new Function('return (async()=>{'+process.argv[3]+'})()'));
console.log(typeof r==='string'?r:JSON.stringify(r,null,1));
if(process.argv[4]) await p.screenshot({path:process.argv[4],timeout:120000});
console.log(errs.slice(0,20).join('\n'));await b.close();})();

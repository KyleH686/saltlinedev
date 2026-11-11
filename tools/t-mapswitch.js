// picks the other map on the title screen and checks the page comes back on it, then switches back
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:640,height:360}});
const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('ERR: '+m.text().slice(0,300))});
await p.goto('file://'+process.cwd()+'/dist/saltline.html?q=test&noaudio=1',{timeout:240000});
await p.waitForFunction(()=>window.__ready,null,{timeout:240000});
const info=()=>p.evaluate(()=>({map:__G.level.map||'saltline',premise:document.querySelector('.m-premise').textContent.slice(0,40),pressed:[...document.querySelectorAll('[data-map]')].map(b=>b.dataset.map+':'+b.getAttribute('aria-pressed')).join(' '),saved:JSON.parse(localStorage.getItem('saltline.settings.v1')||'{}').map}));
console.log(JSON.stringify(await info()));
await p.evaluate(()=>{__G.render.frame=()=>{};document.querySelector('[data-map=drywell]').click();});
await p.waitForFunction(()=>window.__ready&&__G.level&&__G.level.map==='drywell',null,{timeout:300000});
console.log(JSON.stringify(await info()));
await p.evaluate(()=>{__G.render.frame=()=>{};document.querySelector('[data-map=saltline]').click();});
await p.waitForFunction(()=>window.__ready&&__G.level&&!__G.level.map,null,{timeout:300000});
console.log(JSON.stringify(await info()));
console.log(errs.join('\n'));await b.close();})();

// are the title-screen buttons actually tappable? elementFromPoint at each button's centre, at several phone sizes
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
for(const [w,h] of [[390,844],[390,664],[430,932],[844,390],[750,342],[932,430],[1280,720]]){
  const ctx=await b.newContext({viewport:{width:w,height:h},hasTouch:true,isMobile:true,deviceScaleFactor:2,userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'});
  const p=await ctx.newPage();
  await p.goto('file://'+process.cwd()+'/'+(process.argv[2]||'dist/test-phone.html')+'?q=test&noaudio=1',{timeout:240000});
  await p.waitForFunction(()=>window.__ready,null,{timeout:240000});
  await p.evaluate(()=>{__G.render.frame=()=>{};});
  await p.waitForTimeout(1500);
  const r=await p.evaluate(()=>[...document.querySelectorAll('.m-screen[data-s="title"] button')].filter(b=>b.offsetParent).map(b=>{const r=b.getBoundingClientRect();const cx=r.left+r.width/2,cy=r.top+r.height/2;const el=document.elementFromPoint(cx,cy);const ok=el===b||b.contains(el);return (b.dataset.act||b.dataset.diff)+':'+(ok?'ok':'BLOCKED by '+(el?(el.className||el.id||el.tagName):'offscreen')+' @'+Math.round(cx)+','+Math.round(cy))}));
  console.log(w+'x'+h, r.join(' | '));
  if(process.argv[3]) await p.screenshot({path:`hit-${w}x${h}.png`,timeout:120000});
  await ctx.close();
}
await b.close();})();

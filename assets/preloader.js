/* ============================================================
   PRELOADER + CUSTOM CURSOR
   ============================================================ */
(function(){
  /* ---- PRELOADER counting 000 -> 100 ---- */
  const pre=document.getElementById('preloader');
  const countEl=document.getElementById('pre-count');
  const bar=document.querySelector('.pre-bar i');
  let n=0;
  const dur=1500, t0=performance.now();
  function tick(now){
    const p=Math.min(1,(now-t0)/dur);
    const eased=1-Math.pow(1-p,3);
    n=Math.round(eased*100);
    countEl.textContent=String(n).padStart(3,'0');
    if(bar)bar.style.transform=`scaleX(${eased})`;
    if(p<1){requestAnimationFrame(tick);}
    else{
      setTimeout(()=>{
        pre.classList.add('done');
        document.documentElement.dispatchEvent(new Event('preloaded'));
      },260);
    }
  }
  requestAnimationFrame(tick);

  /* ---- CUSTOM CURSOR ---- */
  if(matchMedia('(hover:hover)').matches){
    const dot=document.createElement('div');dot.className='cursor-dot';
    const ring=document.createElement('div');ring.className='cursor-ring';
    document.body.append(dot,ring);
    let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
    addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`;});
    (function loop(){rx+=(mx-rx)*.18;ry+=(my-ry)*.18;ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;requestAnimationFrame(loop);})();
    const hov='a,button,.hcard,.rec-row,.msite,.sfchip,.cf-more,.crow,.lang button';
    document.addEventListener('mouseover',e=>{if(e.target.closest(hov))ring.classList.add('hover');});
    document.addEventListener('mouseout',e=>{if(e.target.closest(hov))ring.classList.remove('hover');});
  }
})();

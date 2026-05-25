/* ============================================================
   MAIN — rendering, GSAP choreography, interactions
   ============================================================ */
(function(){
  const D=window.DOSSIER;
  const L=()=>document.documentElement.lang==='es'?'es':'en';
  let activeCountry=null, activeRegion=null, showAll=false;
  const COLLAPSE=6;

  /* ---------- LANGUAGE ---------- */
  window.setLang=function(l){
    document.documentElement.lang=l;
    document.getElementById('lng-en').classList.toggle('on',l==='en');
    document.getElementById('lng-es').classList.toggle('on',l==='es');
    renderRecord();renderCases();renderPubs();renderPractice();renderFigures();buildFilterbar();
  };

  /* ---------- ENTRY 02: PRACTICE (horizontal cards) ---------- */
  function renderPractice(){
    const tr=document.getElementById('htrack');if(!tr)return;
    const lang=L();
    let cap=`<div class="hcard hcard-intro"><div class="hcard-idx"><span>${lang==='es'?'Áreas de práctica':'Practice areas'}</span><span><b>04</b></span></div>
      <h3>${lang==='es'?'Cómo <em>trabaja</em>':'How she <em>works</em>'}</h3>
      <p>${lang==='es'?'Cuatro áreas tejidas a través de política, programa y campo. Desliza para avanzar.':'Four areas, woven across policy, programme and field. Scroll to advance.'}</p>
      <ul><li>${lang==='es'?'Arrastra · desliza':'Drag · scroll'}</li></ul></div>`;
    const cards=D.PRACTICE.map(p=>`
      <div class="hcard">
        <div class="hcard-idx"><span>${p.tag[lang]}</span><span><b>${p.idx}</b> / 04</span></div>
        <h3>${p.title[lang]}</h3>
        <p>${p.body[lang]}</p>
        <ul>${p.pts[lang].map(x=>`<li>${x}</li>`).join('')}</ul>
      </div>`).join('');
    tr.innerHTML=cap+cards;
  }

  /* ---------- ENTRY 03: FIGURES + MARQUEE ---------- */
  function renderFigures(){
    const g=document.getElementById('figGrid');if(!g)return;const lang=L();
    g.innerHTML=D.FIGURES.map(f=>`
      <div class="fig"><div class="fnum" data-to="${f.n}">0<span class="sup">${f.suf}</span></div>
      <div class="flab">${f.lab[lang]}</div></div>`).join('');
  }

  /* ---------- ENTRY 04: RECORD ---------- */
  function renderRecord(){
    const w=document.getElementById('recTable');if(!w)return;const lang=L();
    w.innerHTML=`<div class="rec-headrow"><span>${lang==='es'?'Año':'Year'}</span><span>${lang==='es'?'Título y resumen':'Title & abstract'}</span><span>${lang==='es'?'Tipo':'Venue'}</span></div>`+
      D.RECORD.map(r=>`<div class="rec-row">
        <span class="rr-year">${r.y}</span>
        <div><div class="rr-title">${r.t[lang]}</div><div class="rr-abstract">${r.ab[lang]}</div>
          <div class="rr-tags">${r.tags[lang].map(t=>`<span>${t}</span>`).join('')}</div></div>
        <span class="rr-venue">${r.v} <span class="arrow">↗</span></span>
      </div>`).join('');
  }

  /* ---------- ENTRY 05: MAP + CASE FILES ---------- */
  function buildMap(){
    const svg=document.getElementById('dossier-map');if(!svg)return;
    const land=[
      "M120 95 L255 70 L300 120 L270 175 L230 250 L195 250 L150 200 L110 150 Z",
      "M230 250 L262 268 L252 292 L228 274 Z",
      "M285 280 L345 270 L370 320 L355 400 L320 455 L300 420 L285 350 Z",
      "M470 95 L560 80 L600 120 L575 165 L500 160 L465 130 Z",
      "M480 175 L595 175 L610 250 L560 360 L515 360 L490 270 Z",
      "M600 160 L660 165 L640 230 L600 215 Z",
      "M620 95 L860 80 L880 175 L770 220 L680 200 L640 150 Z",
      "M720 215 L790 215 L780 270 L730 265 Z",
      "M790 350 L880 340 L900 400 L820 430 L780 395 Z"
    ];
    let h='<g>'+land.map(d=>`<path class="mland" d="${d}"/>`).join('')+'</g><g>';
    for(const [name,info] of Object.entries(D.COUNTRIES)){
      h+=`<g class="msite" data-c="${name}" data-r="${info.r}" transform="translate(${info.x},${info.y})">
        <circle class="mpulse" r="5"/><circle class="mring" r="8.5"/><circle class="mcore" r="4"/></g>`;
    }
    h+='</g>';svg.innerHTML=h;
    const tip=document.getElementById('mapTip');
    svg.querySelectorAll('.msite').forEach(m=>{
      const name=m.dataset.c, info=D.COUNTRIES[name];
      m.addEventListener('mouseenter',()=>{const r=svg.getBoundingClientRect();
        tip.textContent=name;tip.style.left=(info.x/1000)*r.width+'px';tip.style.top=((info.y/500)*r.height-14)+'px';tip.classList.add('show');});
      m.addEventListener('mouseleave',()=>tip.classList.remove('show'));
      m.addEventListener('click',()=>{activeCountry=activeCountry===name?null:name;activeRegion=null;afterFilter();});
    });
  }
  function markMap(){document.querySelectorAll('.msite').forEach(m=>{
    const on=(activeCountry&&activeCountry===m.dataset.c)||(activeRegion&&activeRegion===m.dataset.r);
    m.classList.toggle('on',!!on);});}

  function buildFilterbar(){
    const bar=document.getElementById('filterbar');if(!bar)return;const lang=L();
    let h=`<button class="sfchip ${!activeRegion&&!activeCountry?'on':''}" data-r="__all">${lang==='es'?'Todas':'All sites'}</button>`;
    D.REGIONS.forEach(r=>{
      const n=D.CASES.filter(a=>a.c.some(c=>D.COUNTRIES[c]?.r===r)).length;if(!n)return;
      h+=`<button class="sfchip ${activeRegion===r?'on':''}" data-r="${r}">${r}<span class="c">${n}</span></button>`;
    });
    bar.innerHTML=h;
    bar.querySelectorAll('.sfchip').forEach(ch=>ch.addEventListener('click',()=>{
      const r=ch.dataset.r;
      if(r==='__all'){activeRegion=null;activeCountry=null;}
      else{activeRegion=activeRegion===r?null:r;activeCountry=null;}
      afterFilter();
    }));
  }
  function match(a){
    if(activeCountry)return a.c.includes(activeCountry);
    if(activeRegion)return a.c.some(c=>D.COUNTRIES[c]?.r===activeRegion);
    return true;
  }
  function renderCases(){
    const wrap=document.getElementById('casefiles');if(!wrap)return;const lang=L();
    let list=D.CASES.filter(match);const total=list.length;
    if(!showAll && !activeCountry && !activeRegion)list=list.slice(0,COLLAPSE);
    const state=document.getElementById('cfState');
    if(activeCountry)state.innerHTML=(lang==='es'?'Sitio · ':'Field site · ')+`<b>${activeCountry}</b> — ${total} ${lang==='es'?'casos':'files'}`;
    else if(activeRegion)state.innerHTML=(lang==='es'?'Región · ':'Region · ')+`<b>${activeRegion}</b> — ${total} ${lang==='es'?'casos':'files'}`;
    else state.innerHTML=lang==='es'?'Casos seleccionados con sitio verificable':'Selected files with a verifiable field site';
    document.getElementById('cfClear').style.display=(activeCountry||activeRegion)?'inline':'none';

    const body=document.getElementById('cfBody');
    if(!list.length){body.innerHTML=`<div class="cf-empty">${lang==='es'?'Sin casos para este filtro.':'No files for this filter.'}</div>`;}
    else body.innerHTML=list.map(a=>`<div class="cf">
      <div class="cf-year">${a.y}</div>
      <div><h4>${a.t[lang]}</h4>
        <div class="cf-meta"><span class="client">${a.client}</span><span class="role">${a.role[lang]}</span>${a.c.map(c=>`<span class="loc">${c}</span>`).join('')}</div>
        <p>${a.d[lang]}</p></div></div>`).join('');

    const more=document.getElementById('cfMore');
    if(activeCountry||activeRegion){more.style.display='none';}
    else{more.style.display=D.CASES.length>COLLAPSE?'inline':'none';
      more.textContent=showAll?(lang==='es'?'Ver menos':'Show fewer'):(lang==='es'?`Ver los ${D.CASES.length} casos`:`Show all ${D.CASES.length} files`);}
  }
  function afterFilter(){markMap();buildFilterbar();renderCases();
    if(activeCountry||activeRegion)document.getElementById('casefiles').scrollIntoView({behavior:'smooth',block:'start'});}
  window.cfClear=function(){activeCountry=null;activeRegion=null;afterFilter();};
  window.cfToggle=function(){showAll=!showAll;renderCases();};

  /* ---------- ENTRY 06: PUBS ---------- */
  function renderPubs(){
    const g=document.getElementById('pubGrid');if(!g)return;const lang=L();
    g.innerHTML=D.PUBS.map(p=>`<div class="pub"><span class="pyear">${p.y}</span><span class="ptext">${p.t[lang]}</span></div>`).join('');
  }

  /* ---------- COUNTERS ---------- */
  function runCounter(el){
    const to=+el.dataset.to, sup=el.querySelector('.sup');
    const dur=1400,t0=performance.now();
    function tk(now){const p=Math.min(1,(now-t0)/dur);const v=Math.round((1-Math.pow(1-p,3))*to);
      el.firstChild.textContent=v;if(sup&&!el.contains(sup))el.appendChild(sup);if(p<1)requestAnimationFrame(tk);}
    el.firstChild.textContent='0';requestAnimationFrame(tk);
  }

  /* ---------- GSAP CHOREOGRAPHY ---------- */
  function choreograph(){
    if(!window.gsap){fallbackReveal();return;}
    gsap.registerPlugin(ScrollTrigger);

    // hero lines rise
    gsap.set('.hero-row',{yPercent:115});
    gsap.to('.hero-row',{yPercent:0,duration:1.1,ease:'power4.out',stagger:.09,delay:.15});
    gsap.from('.hero-overline,.hero-sub,.hero-meta,.hero-foot',{opacity:0,y:24,duration:.9,ease:'power3.out',stagger:.12,delay:.6});

    // generic reveal for chapter heads + blocks
    gsap.utils.toArray('[data-rise]').forEach(el=>{
      gsap.from(el,{opacity:0,y:40,duration:1,ease:'power3.out',
        scrollTrigger:{trigger:el,start:'top 84%'}});
    });
    // chapter titles split-line rise
    gsap.utils.toArray('.ch-title').forEach(el=>{
      gsap.from(el,{opacity:0,yPercent:30,duration:1.1,ease:'power4.out',
        scrollTrigger:{trigger:el,start:'top 88%'}});
    });

    // counters
    ScrollTrigger.create({trigger:'#figGrid',start:'top 80%',once:true,
      onEnter:()=>document.querySelectorAll('.fnum').forEach(runCounter)});

    // marquee scroll-linked
    const mt=document.getElementById('mtrack');
    if(mt){gsap.to(mt,{xPercent:-50,ease:'none',
      scrollTrigger:{trigger:'.reckon',start:'top bottom',end:'bottom top',scrub:1}});}

    // horizontal pin (Entry 02)
    if(matchMedia('(min-width:761px)').matches){
      const track=document.getElementById('htrack');
      const pin=document.getElementById('hpin');
      const dist=()=>track.scrollWidth-window.innerWidth+ (window.innerWidth*0.06);
      gsap.to(track,{x:()=>-dist(),ease:'none',
        scrollTrigger:{trigger:pin,start:'top top',end:()=>'+='+dist(),pin:true,scrub:1,invalidateOnRefresh:true,
          onUpdate:s=>{const p=document.querySelector('.hpin-prog i');if(p)p.style.width=(s.progress*100)+'%';
            document.querySelectorAll('.hcard').forEach((c,i)=>{const r=c.getBoundingClientRect();c.classList.toggle('in',r.left<window.innerWidth*.7);});}}});
    }

    // record rows
    gsap.utils.toArray('.rec-row').forEach(el=>{
      gsap.from(el,{opacity:0,y:28,duration:.8,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%'}});
    });
  }
  function fallbackReveal(){
    document.querySelectorAll('.hero-row').forEach(r=>r.style.transform='none');
    document.querySelectorAll('.fnum').forEach(runCounter);
  }

  /* ---------- NAV shrink ---------- */
  addEventListener('scroll',()=>{document.getElementById('nav').classList.toggle('shrink',scrollY>60);});

  /* ---------- INIT ---------- */
  function init(){
    renderPractice();renderFigures();renderRecord();buildMap();buildFilterbar();renderCases();renderPubs();markMap();
    document.getElementById('yr').textContent=new Date().getFullYear();
    choreograph();
  }
  // wait for preloader to release, then init (so GSAP measures correct layout)
  document.documentElement.addEventListener('preloaded',()=>{setTimeout(init,60);});
  // safety: if preloader event never fires
  setTimeout(()=>{if(!document.getElementById('figGrid').children.length)init();},3000);
})();

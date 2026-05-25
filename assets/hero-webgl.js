/* ============================================================
   HERO — RAW WEBGL TOPOGRAPHIC CONTOUR FIELD
   A full-screen fragment shader: drifting sienna iso-contours
   over warm paper, mouse-reactive. Subtle by design.
   Falls back to the 2D canvas if WebGL is unavailable.
   ============================================================ */
(function(){
  const cv=document.getElementById('hero-canvas');
  if(!cv) return;

  // ---- try to acquire a WebGL context ----
  let gl=null;
  try{
    gl = cv.getContext('webgl',{antialias:true,alpha:true,premultipliedAlpha:false})
       || cv.getContext('experimental-webgl',{antialias:true,alpha:true});
  }catch(e){gl=null;}

  if(!gl){ startCanvasFallback(); return; }

  /* ---------------- SHADERS ---------------- */
  const VERT = `
    attribute vec2 p;
    void main(){ gl_Position = vec4(p,0.0,1.0); }
  `;

  // value-noise + fbm, then iso-contour lines via fract() banding.
  // Colors are pulled from the page palette (warm paper / sienna).
  const FRAG = `
    precision highp float;
    uniform vec2  u_res;
    uniform float u_time;
    uniform vec2  u_mouse;   // -0.5..0.5
    uniform vec3  u_paper;
    uniform vec3  u_ink;

    // hash + value noise
    float hash(vec2 x){ return fract(sin(dot(x,vec2(127.1,311.7)))*43758.5453123); }
    float noise(vec2 x){
      vec2 i=floor(x), f=fract(x);
      float a=hash(i), b=hash(i+vec2(1.0,0.0)), c=hash(i+vec2(0.0,1.0)), d=hash(i+vec2(1.0,1.0));
      vec2 u=f*f*(3.0-2.0*f);
      return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
    }
    float fbm(vec2 x){
      float v=0.0, a=0.5;
      mat2 r=mat2(0.8,-0.6,0.6,0.8);
      for(int i=0;i<5;i++){ v+=a*noise(x); x=r*x*2.0; a*=0.5; }
      return v;
    }

    void main(){
      vec2 uv = gl_FragCoord.xy/u_res.xy;
      float aspect = u_res.x/u_res.y;
      vec2 p = uv; p.x*=aspect;

      // slow drift + gentle mouse parallax
      vec2 q = p*2.6;
      q += vec2(u_time*0.025, -u_time*0.018);
      q += u_mouse*0.55;

      // domain-warp for organic, map-like ridges
      float w = fbm(q + fbm(q*0.5 + u_time*0.03));
      float field = fbm(q*1.4 + w*1.2);

      // iso-contour banding: thin lines where the field crosses levels
      float bands = field*9.0;
      float edge = abs(fract(bands)-0.5);
      // line thickness scales with screen-space derivative for crisp lines
      float aa = fwidth(bands)*1.2 + 0.012;
      float line = smoothstep(aa, 0.0, edge*0.5);

      // faint elevation tint so it reads as terrain, not just lines
      float tint = smoothstep(0.25,0.95,field)*0.04;

      vec3 col = u_paper;
      col = mix(col, u_ink, line*0.10 + tint);   // very subtle sienna lines

      // vignette toward edges keeps the type area clean-ish
      float vig = smoothstep(1.25,0.2,length(uv-0.5));
      col = mix(u_paper, col, 0.55 + 0.45*vig);

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  // derivatives extension (for fwidth); harmless if unsupported
  gl.getExtension('OES_standard_derivatives');

  function compile(type,src){
    const s=gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){ console.warn('shader',gl.getShaderInfoLog(s)); return null; }
    return s;
  }
  // inject derivatives pragma for the fragment shader
  const FRAG_FULL = "#extension GL_OES_standard_derivatives : enable\n" + FRAG;
  const vs=compile(gl.VERTEX_SHADER,VERT);
  let fs=compile(gl.FRAGMENT_SHADER,FRAG_FULL);
  if(!fs){ fs=compile(gl.FRAGMENT_SHADER,FRAG); }   // retry without extension pragma
  if(!vs||!fs){ startCanvasFallback(); return; }

  const prog=gl.createProgram();
  gl.attachShader(prog,vs); gl.attachShader(prog,fs); gl.linkProgram(prog);
  if(!gl.getProgramParameter(prog,gl.LINK_STATUS)){ startCanvasFallback(); return; }
  gl.useProgram(prog);

  // full-screen quad (two triangles)
  const buf=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(prog,'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);

  const U={
    res:gl.getUniformLocation(prog,'u_res'),
    time:gl.getUniformLocation(prog,'u_time'),
    mouse:gl.getUniformLocation(prog,'u_mouse'),
    paper:gl.getUniformLocation(prog,'u_paper'),
    ink:gl.getUniformLocation(prog,'u_ink')
  };

  // read palette from CSS variables so it auto-matches the theme
  function cssRGB(name,fallback){
    const v=getComputedStyle(document.documentElement).getPropertyValue(name).trim()||fallback;
    // accept #rrggbb
    const m=v.match(/#([0-9a-f]{6})/i);
    if(!m) return fallback;
    const n=parseInt(m[1],16);
    return [((n>>16)&255)/255,((n>>8)&255)/255,(n&255)/255];
  }
  let paper=cssRGB('--paper',[0.94,0.91,0.85]);
  let ink  =cssRGB('--terra',[0.69,0.29,0.16]);

  let DPR=Math.min(2,devicePixelRatio||1);
  function resize(){
    DPR=Math.min(2,devicePixelRatio||1);
    const w=cv.clientWidth||cv.offsetWidth||innerWidth;
    const h=cv.clientHeight||cv.offsetHeight||innerHeight;
    cv.width=Math.max(1,Math.floor(w*DPR));
    cv.height=Math.max(1,Math.floor(h*DPR));
    gl.viewport(0,0,cv.width,cv.height);
  }
  resize();
  addEventListener('resize',resize);
  document.documentElement.addEventListener('preloaded',()=>setTimeout(resize,80));

  let mx=0,my=0, tmx=0,tmy=0;
  addEventListener('mousemove',e=>{ tmx=(e.clientX/innerWidth-0.5); tmy=(e.clientY/innerHeight-0.5); });

  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const t0=performance.now();
  let raf;
  function frame(now){
    mx+=(tmx-mx)*0.05; my+=(tmy-my)*0.05;
    const t=reduce?0:(now-t0)*0.001;
    gl.uniform2f(U.res,cv.width,cv.height);
    gl.uniform1f(U.time,t);
    gl.uniform2f(U.mouse,mx,-my);
    gl.uniform3fv(U.paper,paper);
    gl.uniform3fv(U.ink,ink);
    gl.drawArrays(gl.TRIANGLES,0,6);
    raf=requestAnimationFrame(frame);
  }
  raf=requestAnimationFrame(frame);

  // if the GL context is lost, drop to canvas fallback
  cv.addEventListener('webglcontextlost',e=>{ e.preventDefault(); cancelAnimationFrame(raf); startCanvasFallback(true); });

  /* ---------------- 2D CANVAS FALLBACK ---------------- */
  function startCanvasFallback(contextWasLost){
    // if WebGL never worked, the canvas 2D context is still clean.
    // if context was lost we need a fresh canvas because the element is tainted.
    let target=cv;
    if(contextWasLost){
      const c2=cv.cloneNode(false); cv.parentNode.replaceChild(c2,cv); target=c2;
    }
    const ctx=target.getContext('2d'); if(!ctx) return;
    let W,H,D;
    function size(){ D=Math.min(2,devicePixelRatio||1); W=target.clientWidth||innerWidth; H=target.clientHeight||innerHeight;
      target.width=W*D; target.height=H*D; ctx.setTransform(D,0,0,D,0,0); }
    size(); addEventListener('resize',size);
    document.documentElement.addEventListener('preloaded',()=>setTimeout(size,80));
    const red=matchMedia('(prefers-reduced-motion:reduce)').matches;
    let mxn=0,myn=0; addEventListener('mousemove',e=>{mxn=e.clientX/innerWidth-0.5;myn=e.clientY/innerHeight-0.5;});
    function nz(x,y,t){return Math.sin(x*0.6+t)*0.5+Math.sin(y*0.9-t*0.7)*0.4+Math.sin((x+y)*0.45+t*0.5)*0.35;}
    let t=0;
    (function loop(){
      ctx.clearRect(0,0,W,H);
      const step=14, cols=Math.ceil(W/step)+2, rows=Math.ceil(H/step)+2;
      for(let L=0;L<8;L++){
        ctx.beginPath(); ctx.strokeStyle=`rgba(143,58,30,${0.06+(L/8)*0.05})`; ctx.lineWidth=1;
        for(let gy=0;gy<=rows;gy++){ let started=false;
          for(let gx=0;gx<=cols;gx++){ const x=gx*step,y=gy*step;
            const v=nz(gx*0.18+mxn*2,gy*0.18+myn*2,t+L*0.55);
            const yy=y+v*16+Math.sin(t*0.4+L)*4;
            started?ctx.lineTo(x,yy):(ctx.moveTo(x,yy),started=true);
          }}
        ctx.stroke();
      }
      if(!red)t+=0.006; requestAnimationFrame(loop);
    })();
  }
})();

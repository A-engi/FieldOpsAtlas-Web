/* FieldOps Atlas — cinematic RF panorama layer
 * File: FieldOpsAtlas/Features/RF/3D Graphics/background-mountains.js
 * Version: 2.0.2-no-compass
 * Replaces the three discrete mountain attempts without changing the approved
 * WebGL river plot, its camera, transmitters, geometry or controls.
 */
(()=>{
  "use strict";

  const VERSION="2.0.2-no-compass";
  const TARGETS=new Set(["mount-a_b-comp-scene","mount-a_a-comp-scene"]);
  const DRAG=0.34,INERTIA=0.05,DECAY=0.92,TAU=Math.PI*2;
  const REDUCED=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wrap=(v,n)=>((v%n)+n)%n;
  const lerp=(a,b,t)=>a+(b-a)*t;

  function noise(seed){
    const value=Math.sin(seed*12.9898+78.233)*43758.5453;
    return value-Math.floor(value);
  }

  function profile(seed,count,power){
    const result=[];
    for(let i=0;i<=count;i+=1){
      const x=i/count;
      let y=(Math.sin((x+seed*.071)*TAU)+1)*.23;
      y+=(Math.sin((x*2.27+seed*.113)*TAU)+1)*.15;
      y+=(Math.sin((x*5.13+seed*.197)*TAU)+1)*.06;
      y+=noise(seed*31+i*.73)*.12;
      result.push([x,Math.pow(Math.max(0,Math.min(1,y)),power)]);
    }
    result[result.length-1][1]=result[0][1];
    return result;
  }

  const BANDS=[
    {h:.535,a:.145,p:1.34,k:.055,o:.62,t:"#071723",b:"#01060a",e:"rgba(43,119,140,.21)",g:"rgba(26,103,126,.12)",q:profile(3.2,64,1.55)},
    {h:.615,a:.188,p:1.16,k:.105,o:.76,t:"#092735",b:"#02090e",e:"rgba(56,158,176,.30)",g:"rgba(31,137,157,.15)",q:profile(7.7,68,1.36)},
    {h:.710,a:.155,p:.98,k:.165,o:.86,t:"#0a3440",b:"#01070b",e:"rgba(71,193,207,.36)",g:"rgba(39,169,186,.18)",q:profile(12.4,72,1.20)}
  ];

  const MASTS=[
    {x:.08,h:.120,b:0,c:"rgba(244,174,74,.78)",a:"255,160,46"},
    {x:.34,h:.086,b:1,c:"rgba(81,213,224,.70)",a:"49,206,222"},
    {x:.62,h:.108,b:0,c:"rgba(244,174,74,.76)",a:"255,160,46"},
    {x:.84,h:.078,b:1,c:"rgba(81,213,224,.64)",a:"49,206,222"}
  ];

  function sample(band,value){
    const scaled=wrap(value,1)*(band.q.length-1);
    const i=Math.floor(scaled),j=Math.min(band.q.length-1,i+1);
    return lerp(band.q[i][1],band.q[j][1],scaled-i);
  }

  function terrainY(band,x,w,h,angle){
    const period=w*band.p;
    return h*band.h-h*band.a*sample(band,(x+angle*w*band.k/180)/period);
  }

  function sky(ctx,w,h){
    const fill=ctx.createLinearGradient(0,0,0,h);
    fill.addColorStop(0,"rgba(0,4,8,.98)");
    fill.addColorStop(.42,"rgba(2,12,20,.95)");
    fill.addColorStop(.70,"rgba(5,27,40,.88)");
    fill.addColorStop(1,"rgba(1,7,11,.96)");
    ctx.fillStyle=fill;ctx.fillRect(0,0,w,h);

    const glow=ctx.createRadialGradient(w*.5,h*.58,0,w*.5,h*.58,w*.62);
    glow.addColorStop(0,"rgba(26,109,131,.16)");
    glow.addColorStop(.45,"rgba(12,63,82,.09)");
    glow.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
  }

  function ridge(ctx,band,w,h,angle){
    const step=Math.max(3,Math.round(w/105));
    ctx.save();ctx.globalAlpha=band.o;
    ctx.beginPath();ctx.moveTo(0,h);ctx.lineTo(0,terrainY(band,0,w,h,angle));
    for(let x=step;x<w;x+=step)ctx.lineTo(x,terrainY(band,x,w,h,angle));
    ctx.lineTo(w,terrainY(band,w,w,h,angle));ctx.lineTo(w,h);ctx.closePath();
    const fill=ctx.createLinearGradient(0,h*(band.h-band.a),0,h);
    fill.addColorStop(0,band.t);fill.addColorStop(.58,band.b);fill.addColorStop(1,"#010408");
    ctx.fillStyle=fill;ctx.shadowColor=band.g;ctx.shadowBlur=Math.max(4,w*.012);ctx.fill();
    ctx.shadowBlur=0;ctx.beginPath();ctx.moveTo(0,terrainY(band,0,w,h,angle));
    for(let x=step;x<w;x+=step)ctx.lineTo(x,terrainY(band,x,w,h,angle));
    ctx.lineTo(w,terrainY(band,w,w,h,angle));ctx.strokeStyle=band.e;
    ctx.lineWidth=Math.max(1,w*.00125);ctx.stroke();ctx.restore();
  }

  function fog(ctx,w,h,angle,time){
    const drift=(REDUCED?0:Math.sin(time*.0001+angle*.008))*w*.025;
    const fill=ctx.createLinearGradient(0,h*.42,0,h*.82);
    fill.addColorStop(0,"rgba(73,180,194,0)");
    fill.addColorStop(.42,"rgba(73,180,194,.045)");
    fill.addColorStop(.70,"rgba(19,85,104,.075)");
    fill.addColorStop(1,"rgba(2,12,18,0)");
    ctx.save();ctx.translate(drift,0);ctx.fillStyle=fill;ctx.fillRect(-w*.08,0,w*1.16,h);ctx.restore();
  }

  function mast(ctx,item,w,h,angle,time){
    const band=BANDS[item.b],period=w*band.p,slide=angle*w*band.k/180;
    for(const raw of [item.x*period-slide-period,item.x*period-slide,item.x*period-slide+period,item.x*period-slide+period*2]){
      const x=wrap(raw,w+period)-period*.5;
      if(x<-20||x>w+20)continue;
      const base=terrainY(band,x,w,h,angle)+h*.012;
      const height=h*item.h,top=base-height;
      ctx.save();ctx.strokeStyle=item.c;ctx.lineWidth=Math.max(1,w*.0014);ctx.lineCap="round";
      ctx.beginPath();ctx.moveTo(x,base);ctx.lineTo(x,top);
      ctx.moveTo(x-height*.11,base);ctx.lineTo(x,top+height*.16);ctx.lineTo(x+height*.11,base);
      ctx.moveTo(x-height*.075,base-height*.38);ctx.lineTo(x+height*.075,base-height*.38);
      ctx.moveTo(x-height*.05,base-height*.63);ctx.lineTo(x+height*.05,base-height*.63);ctx.stroke();
      const pulse=REDUCED?.70:.58+.22*Math.sin(time*.003+item.x*TAU);
      const halo=ctx.createRadialGradient(x,top,0,x,top,Math.max(8,w*.020));
      halo.addColorStop(0,`rgba(${item.a},${pulse})`);halo.addColorStop(.3,`rgba(${item.a},.22)`);halo.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=halo;ctx.beginPath();ctx.arc(x,top,Math.max(8,w*.020),0,TAU);ctx.fill();
      ctx.fillStyle="rgba(255,244,214,.92)";ctx.beginPath();ctx.arc(x,top,Math.max(1.2,w*.0024),0,TAU);ctx.fill();ctx.restore();
    }
  }

  function signal(ctx,w,h,angle,time){
    const shift=angle*w*.0009,pulse=REDUCED?.32:.28+.12*Math.sin(time*.0018),y=h*.755;
    ctx.save();ctx.strokeStyle=`rgba(222,151,45,${pulse})`;ctx.lineWidth=Math.max(1,w*.002);
    ctx.shadowColor="rgba(231,153,45,.28)";ctx.shadowBlur=Math.max(4,w*.010);ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(-w*.05+shift,y+h*.035);
    ctx.bezierCurveTo(w*.22+shift,y-h*.02,w*.36+shift,y+h*.048,w*.53+shift,y-h*.01);
    ctx.bezierCurveTo(w*.68+shift,y-h*.058,w*.84+shift,y+h*.028,w*1.05+shift,y-h*.026);ctx.stroke();ctx.restore();
  }

  function revealPlot(ctx,w,h){
    ctx.save();ctx.globalCompositeOperation="destination-out";
    ctx.translate(w*.5,h*.62);ctx.scale(w*.43,h*.41);
    const feather=ctx.createRadialGradient(0,0,.52,0,0,1);
    feather.addColorStop(0,"rgba(0,0,0,1)");feather.addColorStop(.82,"rgba(0,0,0,1)");feather.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle=feather;ctx.beginPath();ctx.arc(0,0,1,0,TAU);ctx.fill();ctx.restore();

    ctx.save();ctx.globalCompositeOperation="destination-out";
    const floor=ctx.createLinearGradient(0,h*.69,0,h);
    floor.addColorStop(0,"rgba(0,0,0,0)");floor.addColorStop(.3,"rgba(0,0,0,.78)");floor.addColorStop(1,"rgba(0,0,0,1)");
    ctx.fillStyle=floor;ctx.beginPath();ctx.moveTo(w*.05,h);ctx.lineTo(w*.10,h*.76);
    ctx.quadraticCurveTo(w*.25,h*.61,w*.42,h*.66);ctx.quadraticCurveTo(w*.52,h*.61,w*.64,h*.64);
    ctx.quadraticCurveTo(w*.79,h*.61,w*.91,h*.77);ctx.lineTo(w*.96,h);ctx.closePath();ctx.fill();ctx.restore();
  }

  function vignette(ctx,w,h){
    const fill=ctx.createRadialGradient(w*.5,h*.55,w*.1,w*.5,h*.55,w*.72);
    fill.addColorStop(0,"rgba(0,0,0,0)");fill.addColorStop(.67,"rgba(0,0,0,.08)");fill.addColorStop(1,"rgba(0,0,0,.58)");
    ctx.fillStyle=fill;ctx.fillRect(0,0,w,h);
  }

  function mount(root,scene,api){
    if(!TARGETS.has(scene?.id))return api;
    const webgl=root.querySelector("canvas");if(!webgl)return api;
    if(getComputedStyle(root).position==="static")root.style.position="relative";
    root.style.isolation="isolate";root.style.overflow="hidden";root.style.background="#01090e";
    webgl.style.position="relative";webgl.style.zIndex="1";

    const layer=document.createElement("canvas");layer.className="rf-cinematic-panorama-layer";layer.setAttribute("aria-hidden","true");
    layer.style.cssText="position:absolute;inset:0;z-index:2;width:100%;height:100%;display:block;pointer-events:none";root.appendChild(layer);
    const ctx=layer.getContext("2d",{alpha:true,desynchronized:true});if(!ctx){layer.remove();return api;}
    const state={angle:Number(scene.initialAngle)||0,velocity:0,dragging:false,pointer:null,x:0,frame:0,destroyed:false,w:0,h:0};

    function resize(){
      const box=root.getBoundingClientRect(),mobile=matchMedia("(max-width:760px)").matches;
      const ratio=Math.min(devicePixelRatio||1,mobile?1.20:1.50),w=Math.max(1,Math.round(box.width*ratio)),h=Math.max(1,Math.round(box.height*ratio));
      if(w===state.w&&h===state.h)return;state.w=layer.width=w;state.h=layer.height=h;
    }
    function paint(time=performance.now()){
      resize();const w=state.w,h=state.h;ctx.clearRect(0,0,w,h);

      // Draw a full-width moving landscape behind the approved centre plot.
      // There is no compass or instrument overlay in this layer.
      sky(ctx,w,h);
      for(const band of BANDS)ridge(ctx,band,w,h,state.angle);
      fog(ctx,w,h,state.angle,time);
      for(const item of MASTS)mast(ctx,item,w,h,state.angle,time);
      signal(ctx,w,h,state.angle,time);
      revealPlot(ctx,w,h);
      vignette(ctx,w,h);

      root.dataset.rfBackgroundMountains="0";
      root.dataset.rfBackgroundLayer="cinematic-panorama-no-compass";
      root.dataset.rfBackgroundLayerVersion=VERSION;
    }
    function schedule(){if(!state.frame)state.frame=requestAnimationFrame(tick);}
    function tick(time){
      state.frame=0;if(state.destroyed)return;
      if(!state.dragging&&Math.abs(state.velocity)>.001){state.angle+=state.velocity;state.velocity*=DECAY;}
      paint(time);if(state.dragging||Math.abs(state.velocity)>.001)schedule();
    }
    function down(event){state.dragging=true;state.pointer=event.pointerId;state.x=event.clientX;state.velocity=0;schedule();}
    function move(event){if(!state.dragging||event.pointerId!==state.pointer)return;const d=event.clientX-state.x;state.x=event.clientX;state.angle+=d*DRAG;state.velocity=d*INERTIA;paint();}
    function up(event){if(event.pointerId!==state.pointer)return;state.dragging=false;state.pointer=null;schedule();}
    function key(event){if(!["ArrowLeft","ArrowRight"].includes(event.key))return;state.angle+=event.key==="ArrowLeft"?-8:8;state.velocity=0;paint();}
    function reset(){state.angle=Number(scene.initialAngle)||0;state.velocity=0;paint();}

    webgl.addEventListener("pointerdown",down);webgl.addEventListener("pointermove",move);webgl.addEventListener("pointerup",up);
    webgl.addEventListener("pointercancel",up);webgl.addEventListener("keydown",key);webgl.addEventListener("dblclick",reset);
    const observer=new ResizeObserver(()=>paint());observer.observe(root);paint();
    const originalSet=api.setAngle?.bind(api),originalDestroy=api.destroy?.bind(api);
    if(originalSet)api.setAngle=value=>{state.angle=Number(value)||0;state.velocity=0;originalSet(value);paint();};
    api.destroy=()=>{
      if(state.destroyed)return;state.destroyed=true;if(state.frame)cancelAnimationFrame(state.frame);observer.disconnect();
      webgl.removeEventListener("pointerdown",down);webgl.removeEventListener("pointermove",move);webgl.removeEventListener("pointerup",up);
      webgl.removeEventListener("pointercancel",up);webgl.removeEventListener("keydown",key);webgl.removeEventListener("dblclick",reset);
      layer.remove();originalDestroy?.();
    };
    return api;
  }

  function install(){
    const renderer=globalThis.FieldOps3DRenderer;
    if(!renderer?.create||renderer.__cinematicPanoramaInstalled)return false;
    const create=renderer.create.bind(renderer);renderer.create=(root,scene)=>mount(root,scene,create(root,scene));
    renderer.__cinematicPanoramaInstalled=true;renderer.cinematicPanoramaVersion=VERSION;return true;
  }

  if(!install()){document.addEventListener("fieldops3dassetready",install,{once:true});queueMicrotask(install);}
  globalThis.FieldOpsBackgroundMountains=Object.freeze({VERSION,count:0,mode:"cinematic-panorama-no-compass"});
})();

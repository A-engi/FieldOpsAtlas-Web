/* FieldOps Atlas — round-plate 2D mountain arc
 * Version: 1.2.1-floor-snapped
 *
 * Update:
 * - keeps the rear 2D mountains snapped to a dedicated floor arc
 * - avoids the front-view floating effect
 * - preserves the sideways billboard movement around the rear of the scene
 */
(()=>{
  "use strict";

  const VERSION="1.2.1-floor-snapped";
  const TARGET_SCENES=new Set([
    "mount-a_b-comp-scene",
    "mount-a_a-comp-scene"
  ]);

  const ANGLE_PER_PIXEL=0.34;
  const INERTIA_PER_PIXEL=0.05;
  const ARC_RESPONSE=1.0;
  const VISIBLE_LIMIT=1.46;

  const MOUNTAINS=Object.freeze([
    Object.freeze({
      id:"left-ridge",
      phase:-1.23,
      width:0.205,
      height:0.180,
      lift:0.002,
      size:0.95,
      opacity:0.72,
      fillTop:"#0a3441",
      fillBottom:"#020a10",
      edge:"rgba(48,191,208,.46)",
      ridge:"rgba(39,151,172,.34)",
      profile:Object.freeze([
        [0.00,0.00],[0.07,0.09],[0.14,0.20],[0.22,0.15],
        [0.30,0.40],[0.38,0.31],[0.46,0.66],[0.53,0.44],
        [0.60,0.52],[0.68,0.29],[0.78,0.39],[0.87,0.15],
        [0.95,0.19],[1.00,0.00]
      ]),
      ridges:Object.freeze([
        [[0.46,0.66],[0.35,0.25],[0.15,0.03]],
        [[0.46,0.66],[0.57,0.25],[0.82,0.03]],
        [[0.30,0.40],[0.24,0.16],[0.07,0.02]],
        [[0.78,0.39],[0.71,0.14],[0.94,0.02]]
      ])
    }),
    Object.freeze({
      id:"far-centre-peak",
      phase:-0.86,
      width:0.265,
      height:0.255,
      lift:-0.010,
      size:1.22,
      opacity:0.48,
      fillTop:"#071f2a",
      fillBottom:"#01080d",
      edge:"rgba(40,137,159,.30)",
      ridge:"rgba(33,110,132,.24)",
      profile:Object.freeze([
        [0.00,0.00],[0.06,0.07],[0.13,0.18],[0.20,0.13],
        [0.28,0.31],[0.35,0.27],[0.42,0.53],[0.48,0.71],
        [0.52,1.00],[0.57,0.66],[0.63,0.40],[0.70,0.46],
        [0.77,0.24],[0.85,0.31],[0.92,0.09],[1.00,0.00]
      ]),
      ridges:Object.freeze([
        [[0.52,1.00],[0.43,0.47],[0.24,0.04]],
        [[0.52,1.00],[0.60,0.48],[0.78,0.04]],
        [[0.42,0.53],[0.33,0.20],[0.12,0.02]],
        [[0.70,0.46],[0.77,0.18],[0.92,0.02]]
      ])
    }),
    Object.freeze({
      id:"right-twin",
      phase:-0.48,
      width:0.195,
      height:0.172,
      lift:0.002,
      size:0.92,
      opacity:0.68,
      fillTop:"#0a303d",
      fillBottom:"#020a10",
      edge:"rgba(50,185,202,.42)",
      ridge:"rgba(42,145,164,.31)",
      profile:Object.freeze([
        [0.00,0.00],[0.08,0.12],[0.16,0.08],[0.25,0.35],
        [0.34,0.67],[0.43,0.39],[0.51,0.29],[0.59,0.55],
        [0.67,0.80],[0.75,0.42],[0.84,0.28],[0.93,0.10],
        [1.00,0.00]
      ]),
      ridges:Object.freeze([
        [[0.34,0.67],[0.26,0.20],[0.07,0.02]],
        [[0.34,0.67],[0.45,0.19],[0.58,0.03]],
        [[0.67,0.80],[0.61,0.31],[0.52,0.04]],
        [[0.67,0.80],[0.77,0.24],[0.94,0.02]]
      ])
    })
  ]);

  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  const smoothstep=(a,b,value)=>{
    const t=clamp((value-a)/(b-a),0,1);
    return t*t*(3-2*t);
  };

  function drawMountain(context,mountain,centreX,baseY,width,height,visibility){
    if(visibility<=0.001)return;

    const left=centreX-width/2;
    const points=mountain.profile.map(([x,y])=>[
      left+x*width,
      baseY-y*height
    ]);

    context.save();
    context.globalAlpha=mountain.opacity*visibility;
    context.shadowColor="rgba(0,8,12,.86)";
    context.shadowBlur=Math.max(4,context.canvas.width*0.012);

    const fill=context.createLinearGradient(0,baseY-height,0,baseY);
    fill.addColorStop(0,mountain.fillTop);
    fill.addColorStop(0.55,"#051722");
    fill.addColorStop(1,mountain.fillBottom);

    context.beginPath();
    context.moveTo(left,baseY);
    for(const point of points)context.lineTo(point[0],point[1]);
    context.lineTo(left+width,baseY);
    context.closePath();
    context.fillStyle=fill;
    context.fill();

    context.shadowBlur=0;
    context.lineCap="round";
    context.lineJoin="round";
    context.lineWidth=Math.max(1,context.canvas.width*0.0017);
    context.strokeStyle=mountain.ridge;

    for(const ridge of mountain.ridges){
      context.beginPath();
      ridge.forEach(([x,y],index)=>{
        const px=left+x*width;
        const py=baseY-y*height;
        if(index===0)context.moveTo(px,py);
        else context.lineTo(px,py);
      });
      context.stroke();
    }

    context.strokeStyle=mountain.edge;
    context.lineWidth=Math.max(1,context.canvas.width*0.0011);
    context.beginPath();
    points.forEach((point,index)=>{
      if(index===0)context.moveTo(point[0],point[1]);
      else context.lineTo(point[0],point[1]);
    });
    context.stroke();
    context.restore();
  }

  function outsideRoundMask(context,width,height,outer){
    context.save();
    context.fillStyle="#01090e";
    context.beginPath();
    context.rect(0,0,width,height);
    context.ellipse(outer.cx,outer.cy,outer.rx,outer.ry,0,0,Math.PI*2);
    context.fill("evenodd");
    context.restore();
  }

  function clearForeground(context,width,height,inner){
    context.save();
    context.globalCompositeOperation="destination-out";

    context.beginPath();
    context.ellipse(inner.cx,inner.cy,inner.rx,inner.ry,0,0,Math.PI*2);
    context.fill();

    context.beginPath();
    context.moveTo(width*0.10,height*0.79);
    context.lineTo(width*0.14,height*0.65);
    context.quadraticCurveTo(width*0.22,height*0.48,width*0.29,height*0.37);
    context.quadraticCurveTo(width*0.35,height*0.49,width*0.43,height*0.58);
    context.quadraticCurveTo(width*0.54,height*0.52,width*0.64,height*0.33);
    context.quadraticCurveTo(width*0.72,height*0.45,width*0.82,height*0.61);
    context.lineTo(width*0.91,height*0.79);
    context.lineTo(width*0.91,height);
    context.lineTo(width*0.10,height);
    context.closePath();
    context.fill();
    context.restore();
  }

  function drawPlateRims(context,width,height,outer,inner){
    context.save();
    context.lineCap="round";

    const outerGlow=context.createLinearGradient(
      outer.cx-outer.rx,outer.cy,
      outer.cx+outer.rx,outer.cy
    );
    outerGlow.addColorStop(0,"rgba(28,151,170,.18)");
    outerGlow.addColorStop(0.5,"rgba(219,156,58,.42)");
    outerGlow.addColorStop(1,"rgba(28,151,170,.18)");

    context.strokeStyle="rgba(3,31,42,.85)";
    context.lineWidth=Math.max(3,width*0.008);
    context.beginPath();
    context.ellipse(outer.cx,outer.cy,outer.rx,outer.ry,0,0,Math.PI*2);
    context.stroke();

    context.strokeStyle=outerGlow;
    context.lineWidth=Math.max(1,width*0.0024);
    context.beginPath();
    context.ellipse(outer.cx,outer.cy,outer.rx,outer.ry,0,0,Math.PI*2);
    context.stroke();

    context.strokeStyle="rgba(40,175,193,.20)";
    context.lineWidth=Math.max(1,width*0.0018);
    context.beginPath();
    context.ellipse(inner.cx,inner.cy,inner.rx,inner.ry,0,Math.PI,Math.PI*2);
    context.stroke();

    context.strokeStyle="rgba(216,149,49,.28)";
    context.lineWidth=Math.max(1,width*0.0012);
    context.beginPath();
    context.ellipse(inner.cx,inner.cy,inner.rx*1.05,inner.ry*1.04,0,Math.PI,Math.PI*2);
    context.stroke();
    context.restore();
  }

  function floorArcFor(width,height,outer){
    return {
      cx:outer.cx,
      cy:height*0.70,
      rx:outer.rx*0.82,
      ry:height*0.13
    };
  }

  function mountainBasePoint(arc,floorArc,mountain,height){
    const depth=Math.max(0,Math.cos(arc));
    const centreX=floorArc.cx+Math.sin(arc)*floorArc.rx;
    const baseY=floorArc.cy-depth*floorArc.ry+height*mountain.lift;
    return {centreX,baseY,depth};
  }

  function mountRoundArc(root,scene,api){
    if(!TARGET_SCENES.has(scene?.id))return api;

    const webglCanvas=root.querySelector("canvas");
    if(!webglCanvas)return api;

    const computed=getComputedStyle(root);
    if(computed.position==="static")root.style.position="relative";
    root.style.isolation="isolate";
    root.style.overflow="hidden";
    root.style.background="#01090e";

    webglCanvas.style.position="relative";
    webglCanvas.style.zIndex="1";

    const layer=document.createElement("canvas");
    layer.className="rf-round-background-mountain-arc";
    layer.setAttribute("aria-hidden","true");
    layer.style.cssText=[
      "position:absolute",
      "inset:0",
      "z-index:2",
      "width:100%",
      "height:100%",
      "display:block",
      "pointer-events:none"
    ].join(";");
    root.appendChild(layer);

    const context=layer.getContext("2d",{alpha:true});
    const state={
      angle:Number(scene.initialAngle)||0,
      velocity:0,
      dragging:false,
      pointer:null,
      x:0,
      frame:0,
      destroyed:false,
      width:0,
      height:0
    };

    function resize(){
      const box=root.getBoundingClientRect();
      const ratio=Math.min(devicePixelRatio||1,1.5);
      const width=Math.max(1,Math.round(box.width*ratio));
      const height=Math.max(1,Math.round(box.height*ratio));
      if(width===state.width&&height===state.height)return false;
      state.width=layer.width=width;
      state.height=layer.height=height;
      return true;
    }

    function paint(){
      resize();
      const width=state.width;
      const height=state.height;
      context.clearRect(0,0,width,height);

      const outer={
        cx:width*0.50,
        cy:height*0.58,
        rx:width*0.485,
        ry:height*0.505
      };
      const inner={
        cx:width*0.50,
        cy:height*0.69,
        rx:width*0.385,
        ry:height*0.305
      };
      const floorArc=floorArcFor(width,height,outer);

      outsideRoundMask(context,width,height,outer);

      context.save();
      context.beginPath();
      context.ellipse(outer.cx,outer.cy,outer.rx,outer.ry,0,0,Math.PI*2);
      context.clip();

      const orbitRadians=state.angle*Math.PI/180*ARC_RESPONSE;

      for(const mountain of MOUNTAINS){
        const arc=mountain.phase-orbitRadians;
        const absolute=Math.abs(arc);
        if(absolute>=VISIBLE_LIMIT)continue;

        const visibility=1-smoothstep(1.15,VISIBLE_LIMIT,absolute);
        const {centreX,baseY,depth}=mountainBasePoint(arc,floorArc,mountain,height);
        const perspectiveScale=(0.82+depth*0.20)*mountain.size;
        const mountainWidth=width*mountain.width*perspectiveScale;
        const mountainHeight=height*mountain.height*perspectiveScale;

        drawMountain(
          context,mountain,
          centreX,baseY,
          mountainWidth,mountainHeight,
          visibility
        );
      }
      context.restore();

      clearForeground(context,width,height,inner);
      drawPlateRims(context,width,height,outer,inner);

      root.dataset.rfBackgroundMountains="3";
      root.dataset.rfBackgroundMountainMode="round-arc-front-floor-snapped";
      root.dataset.rfBackgroundMountainVersion=VERSION;
    }

    function schedule(){
      if(!state.frame)state.frame=requestAnimationFrame(tick);
    }

    function tick(){
      state.frame=0;
      if(state.destroyed)return;
      if(!state.dragging&&Math.abs(state.velocity)>0.001){
        state.angle+=state.velocity;
        state.velocity*=0.92;
      }
      paint();
      if(state.dragging||Math.abs(state.velocity)>0.001)schedule();
    }

    function pointerDown(event){
      state.dragging=true;
      state.pointer=event.pointerId;
      state.x=event.clientX;
      state.velocity=0;
      schedule();
    }

    function pointerMove(event){
      if(!state.dragging||event.pointerId!==state.pointer)return;
      const delta=event.clientX-state.x;
      state.x=event.clientX;
      state.angle+=delta*ANGLE_PER_PIXEL;
      state.velocity=delta*INERTIA_PER_PIXEL;
      paint();
    }

    function pointerUp(event){
      if(event.pointerId!==state.pointer)return;
      state.dragging=false;
      state.pointer=null;
      schedule();
    }

    function keyDown(event){
      if(!["ArrowLeft","ArrowRight"].includes(event.key))return;
      state.angle+=event.key==="ArrowLeft"?-8:8;
      state.velocity=0;
      paint();
    }

    function reset(){
      state.angle=Number(scene.initialAngle)||0;
      state.velocity=0;
      paint();
    }

    webglCanvas.addEventListener("pointerdown",pointerDown);
    webglCanvas.addEventListener("pointermove",pointerMove);
    webglCanvas.addEventListener("pointerup",pointerUp);
    webglCanvas.addEventListener("pointercancel",pointerUp);
    webglCanvas.addEventListener("keydown",keyDown);
    webglCanvas.addEventListener("dblclick",reset);

    const observer=new ResizeObserver(paint);
    observer.observe(root);
    paint();

    const originalSetAngle=api.setAngle?.bind(api);
    const originalDestroy=api.destroy?.bind(api);

    if(originalSetAngle){
      api.setAngle=value=>{
        state.angle=Number(value)||0;
        state.velocity=0;
        originalSetAngle(value);
        paint();
      };
    }

    api.destroy=()=>{
      if(state.destroyed)return;
      state.destroyed=true;
      if(state.frame)cancelAnimationFrame(state.frame);
      observer.disconnect();
      webglCanvas.removeEventListener("pointerdown",pointerDown);
      webglCanvas.removeEventListener("pointermove",pointerMove);
      webglCanvas.removeEventListener("pointerup",pointerUp);
      webglCanvas.removeEventListener("pointercancel",pointerUp);
      webglCanvas.removeEventListener("keydown",keyDown);
      webglCanvas.removeEventListener("dblclick",reset);
      layer.remove();
      originalDestroy?.();
    };

    return api;
  }

  function install(){
    const renderer=globalThis.FieldOps3DRenderer;
    if(!renderer?.create||renderer.__roundBackgroundMountainArcInstalled)return false;

    const originalCreate=renderer.create.bind(renderer);
    renderer.create=(root,scene)=>mountRoundArc(root,scene,originalCreate(root,scene));
    renderer.__roundBackgroundMountainArcInstalled=true;
    renderer.roundBackgroundMountainArcVersion=VERSION;
    return true;
  }

  if(!install()){
    document.addEventListener("fieldops3dassetready",install,{once:true});
    queueMicrotask(install);
  }

  globalThis.FieldOpsBackgroundMountains=Object.freeze({
    VERSION,
    count:3,
    mode:"round-arc-front-floor-snapped"
  });
})();

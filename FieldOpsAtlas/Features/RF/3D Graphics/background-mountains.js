/* FieldOps Atlas — 2D parallax background mountain slider
 * Version: 1.1.0-billboard-slider
 *
 * Three screen-facing 2D mountains sit behind the rotating WebGL scene.
 * They never turn. Dragging the live scene moves the repeated mountain band
 * sideways with matching inertia, like a manual chevron/cluster slider.
 *
 * Layout:
 * - left: broad split-ridge silhouette
 * - centre: larger, taller and farther back
 * - right: narrow twin-peak silhouette
 */
(()=>{
  "use strict";

  const VERSION="1.1.0-billboard-slider";
  const TARGET_SCENES=new Set([
    "mount-a_b-comp-scene",
    "mount-a_a-comp-scene"
  ]);

  const PARALLAX_PIXELS_PER_DEGREE=1.65;
  const PATTERN_WIDTH=1.34;

  const SHAPES=Object.freeze([
    Object.freeze({
      id:"left-broad-ridge",
      centre:0.16,
      width:0.26,
      baseY:0.615,
      height:0.185,
      opacity:0.72,
      depth:0,
      profile:Object.freeze([
        [0.00,0.00],[0.06,0.10],[0.13,0.24],[0.20,0.18],
        [0.28,0.43],[0.36,0.30],[0.45,0.62],[0.53,0.42],
        [0.61,0.50],[0.69,0.28],[0.79,0.38],[0.88,0.14],
        [0.95,0.19],[1.00,0.00]
      ]),
      ridges:Object.freeze([
        [[0.45,0.62],[0.35,0.22],[0.16,0.02]],
        [[0.45,0.62],[0.56,0.24],[0.82,0.03]],
        [[0.28,0.43],[0.22,0.17],[0.06,0.02]],
        [[0.79,0.38],[0.72,0.14],[0.94,0.02]]
      ])
    }),
    Object.freeze({
      id:"centre-far-peak",
      centre:0.50,
      width:0.34,
      baseY:0.565,
      height:0.255,
      opacity:0.52,
      depth:1,
      profile:Object.freeze([
        [0.00,0.00],[0.07,0.08],[0.14,0.19],[0.22,0.15],
        [0.30,0.34],[0.37,0.29],[0.44,0.58],[0.50,1.00],
        [0.56,0.63],[0.63,0.39],[0.70,0.45],[0.78,0.24],
        [0.86,0.30],[0.93,0.09],[1.00,0.00]
      ]),
      ridges:Object.freeze([
        [[0.50,1.00],[0.43,0.46],[0.27,0.05]],
        [[0.50,1.00],[0.58,0.47],[0.77,0.05]],
        [[0.44,0.58],[0.34,0.21],[0.13,0.03]],
        [[0.63,0.39],[0.72,0.17],[0.91,0.02]]
      ])
    }),
    Object.freeze({
      id:"right-twin-peak",
      centre:0.84,
      width:0.25,
      baseY:0.610,
      height:0.180,
      opacity:0.68,
      depth:0,
      profile:Object.freeze([
        [0.00,0.00],[0.08,0.13],[0.16,0.09],[0.25,0.37],
        [0.34,0.66],[0.43,0.39],[0.51,0.30],[0.59,0.57],
        [0.67,0.78],[0.75,0.41],[0.84,0.29],[0.92,0.11],
        [1.00,0.00]
      ]),
      ridges:Object.freeze([
        [[0.34,0.66],[0.26,0.20],[0.07,0.02]],
        [[0.34,0.66],[0.45,0.19],[0.58,0.03]],
        [[0.67,0.78],[0.61,0.30],[0.52,0.05]],
        [[0.67,0.78],[0.76,0.25],[0.94,0.02]]
      ])
    })
  ]);

  function wrap(value,size){
    return ((value%size)+size)%size;
  }

  function drawMountain(context,shape,centreX,width,height){
    const baseY=context.canvas.height*shape.baseY;
    const left=centreX-width/2;
    const topPoints=shape.profile.map(([x,y])=>[
      left+x*width,
      baseY-y*height
    ]);

    context.save();
    context.globalAlpha=shape.opacity;
    context.shadowColor=shape.depth
      ? "rgba(0,20,28,.80)"
      : "rgba(0,12,18,.88)";
    context.shadowBlur=shape.depth?18:10;

    const fill=context.createLinearGradient(0,baseY-height,0,baseY);
    if(shape.depth){
      fill.addColorStop(0,"#08222d");
      fill.addColorStop(.48,"#061923");
      fill.addColorStop(1,"#020a10");
    }else{
      fill.addColorStop(0,"#0a3441");
      fill.addColorStop(.52,"#07212c");
      fill.addColorStop(1,"#020b11");
    }

    context.beginPath();
    context.moveTo(left,baseY);
    for(const point of topPoints)context.lineTo(point[0],point[1]);
    context.lineTo(left+width,baseY);
    context.closePath();
    context.fillStyle=fill;
    context.fill();

    context.shadowBlur=0;
    context.lineCap="round";
    context.lineJoin="round";
    context.lineWidth=Math.max(1,context.canvas.width*0.0016);
    context.strokeStyle=shape.depth
      ? "rgba(34,126,146,.30)"
      : "rgba(48,180,198,.42)";

    for(const ridge of shape.ridges){
      context.beginPath();
      ridge.forEach(([x,y],index)=>{
        const px=left+x*width;
        const py=baseY-y*height;
        if(index===0)context.moveTo(px,py);
        else context.lineTo(px,py);
      });
      context.stroke();
    }

    context.strokeStyle=shape.depth
      ? "rgba(53,157,176,.22)"
      : "rgba(69,205,220,.32)";
    context.lineWidth=Math.max(1,context.canvas.width*0.0011);
    context.beginPath();
    for(let index=0;index<topPoints.length;index+=1){
      const point=topPoints[index];
      if(index===0)context.moveTo(point[0],point[1]);
      else context.lineTo(point[0],point[1]);
    }
    context.stroke();
    context.restore();
  }

  function mountBackground(root,scene,api){
    if(!TARGET_SCENES.has(scene?.id))return api;

    const webglCanvas=root.querySelector("canvas");
    if(!webglCanvas)return api;

    const computed=getComputedStyle(root);
    if(computed.position==="static")root.style.position="relative";
    root.style.isolation="isolate";
    root.style.overflow="hidden";
    root.style.background="#01090e";

    const layer=document.createElement("canvas");
    layer.className="rf-background-mountain-slider";
    layer.setAttribute("aria-hidden","true");
    layer.style.cssText=[
      "position:absolute",
      "inset:0",
      "z-index:0",
      "width:100%",
      "height:100%",
      "display:block",
      "pointer-events:none",
      "background:#01090e"
    ].join(";");

    webglCanvas.style.position="relative";
    webglCanvas.style.zIndex="1";
    webglCanvas.style.background="transparent";
    webglCanvas.style.mixBlendMode="screen";

    root.insertBefore(layer,webglCanvas);

    const context=layer.getContext("2d",{alpha:false});
    const state={
      angle:Number(scene.initialAngle)||0,
      velocity:0,
      dragging:false,
      pointer:null,
      x:0,
      frame:0,
      destroyed:false,
      width:0,
      height:0,
      cssWidth:0,
      cssHeight:0
    };

    function resize(){
      const box=root.getBoundingClientRect();
      const ratio=Math.min(devicePixelRatio||1,1.5);
      const width=Math.max(1,Math.round(box.width*ratio));
      const height=Math.max(1,Math.round(box.height*ratio));
      if(width===state.width&&height===state.height)return false;
      state.width=layer.width=width;
      state.height=layer.height=height;
      state.cssWidth=Math.max(1,box.width);
      state.cssHeight=Math.max(1,box.height);
      return true;
    }

    function paint(){
      resize();
      const width=state.width;
      const height=state.height;
      const ratio=width/state.cssWidth;
      const pattern=width*PATTERN_WIDTH;
      const slide=state.angle*PARALLAX_PIXELS_PER_DEGREE*ratio;
      const phase=wrap(slide,pattern);

      const sky=context.createLinearGradient(0,0,0,height);
      sky.addColorStop(0,"#01070c");
      sky.addColorStop(.46,"#031018");
      sky.addColorStop(1,"#01090e");
      context.fillStyle=sky;
      context.fillRect(0,0,width,height);

      // Draw the farther centre mountain first, then the two nearer side shapes.
      const ordered=[SHAPES[1],SHAPES[0],SHAPES[2]];
      for(const shape of ordered){
        for(const repeat of [-1,0,1]){
          const centre=(shape.centre*pattern)-phase+(repeat*pattern);
          drawMountain(
            context,
            shape,
            centre,
            shape.width*width,
            shape.height*height
          );
        }
      }

      root.dataset.rfBackgroundMountains="3";
      root.dataset.rfBackgroundMountainMode="2d-billboard-slider";
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
      state.angle+=delta*0.34;
      state.velocity=delta*0.05;
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
    if(!renderer?.create||renderer.__backgroundMountainSliderInstalled)return false;

    const originalCreate=renderer.create.bind(renderer);
    renderer.create=(root,scene)=>mountBackground(root,scene,originalCreate(root,scene));
    renderer.__backgroundMountainSliderInstalled=true;
    renderer.backgroundMountainSliderVersion=VERSION;
    return true;
  }

  if(!install()){
    document.addEventListener("fieldops3dassetready",install,{once:true});
    queueMicrotask(install);
  }

  globalThis.FieldOpsBackgroundMountains=Object.freeze({
    VERSION,
    count:3,
    mode:"2d-billboard-slider"
  });
})();

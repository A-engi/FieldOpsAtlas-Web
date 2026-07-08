/* FieldOps Atlas — exact old-mountain inside-box background relief
 * File: FieldOpsAtlas/Features/RF/3D Graphics/background-mountains.js
 * Version: 2.1.0-exact-box-wall-relief
 *
 * The approved centre river scene, its transmitters, path, geometry, camera and
 * controls are not replaced. This module samples the exact earlier RF mountain
 * mesh into a compact depth surface and applies one copy to each inside wall of
 * an imaginary square box. The mountain starts at the same y=0 floor plane;
 * there is no base strip or added line along the floor edge.
 */
(()=>{
  "use strict";

  const VERSION="2.1.0-exact-box-wall-relief";
  const TARGETS=new Set(["mount-a_b-comp-scene","mount-a_a-comp-scene"]);
  const GRID_W=56,GRID_H=36;
  const DEPTH_B64="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";
  const MASK_B64="AAAAAAAAAP7//////3/+//////8//P//////P/z//////x/4//////8f8P//////D+D//////weA//////8BAPj///8fAADw////DwAA8P///wcAAOD///8HAADg////AwAAwP///wMAAMD///8BAAAA////AAAAAPz/HwAAAAD4/x8AAAAA+P8PAAAAAPD/DwAAAADw/w8AAAAA4P8DAAAAAMD/AQAAAACA/wAAAAAAgP8AAAAAAAD/AAAAAAAA/wAAAAAAAH4AAAAAAAA+AAAAAAAAPgAAAAAAABwAAAAAAAAcAAAAAAAAHAAAAAAAAAwAAAAAAAAAAAAA";
  const HORIZ=30.47511292,HEIGHT=17.73700333,RELIEF=3.89257908;
  const WALL=16.25,CAMERA_EDGE=11.4,CAMERA_HEIGHT=14.6;
  const TARGET=[0,1.15,0];
  const DRAG=.34,INERTIA=.05,DECAY=.92;
  let geometryCache=null;

  function decodeBytes(text){
    const binary=atob(text),bytes=new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i+=1)bytes[i]=binary.charCodeAt(i);
    return bytes;
  }

  function decodeDepth(){
    const bytes=decodeBytes(DEPTH_B64);
    return new Uint16Array(bytes.buffer,bytes.byteOffset,bytes.byteLength/2);
  }

  function decodeMask(){
    const packed=decodeBytes(MASK_B64),mask=new Uint8Array(GRID_W*GRID_H);
    for(let i=0;i<mask.length;i+=1)mask[i]=(packed[i>>3]>>(i&7))&1;
    return mask;
  }

  function buildGeometry(){
    if(geometryCache)return geometryCache;
    const depth=decodeDepth(),mask=decodeMask(),positions=[],barycentric=[],ribs=[];
    const point=(x,y)=>[x/(GRID_W-1),y/(GRID_H-1),depth[y*GRID_W+x]/65535];
    const triangle=(a,b,c)=>{
      positions.push(...a,...b,...c);
      barycentric.push(1,0,0,0,1,0,0,0,1);
    };

    for(let y=0;y<GRID_H-1;y+=1)for(let x=0;x<GRID_W-1;x+=1){
      const i=y*GRID_W+x,i1=i+1,i2=i+GRID_W,i3=i2+1;
      if(!(mask[i]&&mask[i1]&&mask[i2]&&mask[i3]))continue;
      const a=point(x,y),b=point(x+1,y),c=point(x+1,y+1),d=point(x,y+1);
      if((x+y)&1){triangle(a,b,d);triangle(b,c,d);}
      else{triangle(a,b,c);triangle(a,c,d);}
    }

    for(let y=1;y<GRID_H-1;y+=2)for(let x=1;x<GRID_W-1;x+=2){
      const i=y*GRID_W+x;if(!mask[i])continue;
      const hash=((x*73856093)^(y*19349663))>>>0;
      const v=y/(GRID_H-1),chance=(hash%1000)/1000;
      if(chance>.25+.18*v)continue;
      const p=point(x,y),length=.018+.028*v+((hash>>>10)%1000)/1000*.028;
      ribs.push(...p,p[0],p[1],Math.min(1.06,p[2]+length));
    }

    geometryCache=Object.freeze({
      positions:new Float32Array(positions),
      barycentric:new Float32Array(barycentric),
      ribs:new Float32Array(ribs),
      vertexCount:positions.length/3,
      ribVertexCount:ribs.length/3
    });
    return geometryCache;
  }

  function compile(gl,type,source){
    const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
      const message=gl.getShaderInfoLog(shader);gl.deleteShader(shader);throw new Error(message);
    }
    return shader;
  }

  function createProgram(gl,vertexSource,fragmentSource){
    const handle=gl.createProgram(),vertex=compile(gl,gl.VERTEX_SHADER,vertexSource),fragment=compile(gl,gl.FRAGMENT_SHADER,fragmentSource);
    gl.attachShader(handle,vertex);gl.attachShader(handle,fragment);gl.linkProgram(handle);
    gl.deleteShader(vertex);gl.deleteShader(fragment);
    if(!gl.getProgramParameter(handle,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(handle));
    return handle;
  }

  function multiply(a,b){
    const output=new Float32Array(16);
    for(let column=0;column<4;column+=1)for(let row=0;row<4;row+=1){
      output[column*4+row]=a[row]*b[column*4]+a[4+row]*b[column*4+1]+a[8+row]*b[column*4+2]+a[12+row]*b[column*4+3];
    }
    return output;
  }

  function perspective(fov,aspect,near,far){
    const f=1/Math.tan(fov/2),nf=1/(near-far);
    return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(near+far)*nf,-1,0,0,2*near*far*nf,0]);
  }

  function lookAt(eye,target){
    let zx=eye[0]-target[0],zy=eye[1]-target[1],zz=eye[2]-target[2],length=Math.hypot(zx,zy,zz)||1;
    zx/=length;zy/=length;zz/=length;
    let xx=zz,xy=0,xz=-zx;length=Math.hypot(xx,xz)||1;xx/=length;xz/=length;
    const yx=zy*xz,yy=zz*xx-zx*xz,yz=-zy*xx;
    return new Float32Array([
      xx,yx,zx,0,xy,yy,zy,0,xz,yz,zz,0,
      -(xx*eye[0]+xy*eye[1]+xz*eye[2]),
      -(yx*eye[0]+yy*eye[1]+yz*eye[2]),
      -(zx*eye[0]+zy*eye[1]+zz*eye[2]),1
    ]);
  }

  const transform=`
    vec3 wallPosition(vec3 p){
      float lx=(p.x-.5)*30.47511292;
      float ly=p.y*17.73700333;
      float relief=p.z*3.89257908;
      if(uWall==0)return vec3(lx,ly,-16.2500+relief);
      if(uWall==1)return vec3(-lx,ly,16.2500-relief);
      if(uWall==2)return vec3(16.2500-relief,ly,lx);
      return vec3(-16.2500+relief,ly,-lx);
    }
  `;

  const reveal=`
    float revealMask(vec2 fragment,vec2 resolution){
      vec2 css=vec2(fragment.x/resolution.x,1.0-fragment.y/resolution.y);
      vec2 ellipse=vec2((css.x-.5)/.43,(css.y-.60)/.40);
      float outsideCentre=smoothstep(.76,1.04,length(ellipse));
      float side=abs(css.x-.5)*2.0;
      float lowerSides=smoothstep(.48,.82,side)*smoothstep(.53,.84,css.y);
      return clamp(max(outsideCentre,lowerSides),0.0,1.0);
    }
  `;

  const meshVertex=`
    precision highp float;
    attribute vec3 aPosition,aBarycentric;
    uniform mat4 uViewProjection;
    uniform int uWall;
    varying vec3 vWorld,vBarycentric;
    varying float vHeight;
    ${transform}
    void main(){
      vec3 world=wallPosition(aPosition);
      vWorld=world;vBarycentric=aBarycentric;vHeight=aPosition.y;
      gl_Position=uViewProjection*vec4(world,1.0);
    }
  `;

  const meshFragment=`
    #extension GL_OES_standard_derivatives : enable
    precision highp float;
    varying vec3 vWorld,vBarycentric;
    varying float vHeight;
    uniform vec2 uResolution;
    ${reveal}
    void main(){
      vec3 normal=normalize(cross(dFdx(vWorld),dFdy(vWorld)));
      if(!gl_FrontFacing)normal=-normal;
      vec3 key=normalize(vec3(-.42,.78,.46)),fillLight=normalize(vec3(.62,.23,.75));
      float shade=.22+max(dot(normal,key),0.0)*.55+max(dot(normal,fillLight),0.0)*.12+max(normal.y,0.0)*.11;
      vec3 low=vec3(.005,.043,.058),high=vec3(.018,.29,.32);
      vec3 face=mix(low,high,clamp(vHeight*.72+shade*.40,0.0,1.0));
      vec3 width=fwidth(vBarycentric),smoothEdge=smoothstep(vec3(0.0),width*1.25,vBarycentric);
      float edge=pow(1.0-min(min(smoothEdge.x,smoothEdge.y),smoothEdge.z),.72);
      vec3 cyan=mix(vec3(.03,.46,.52),vec3(.52,1.0,.97),vHeight);
      vec3 colour=mix(face,cyan,edge*.64)+cyan*edge*.10;
      float alpha=(.54+edge*.26)*revealMask(gl_FragCoord.xy,uResolution);
      if(alpha<.012)discard;
      gl_FragColor=vec4(colour,alpha);
    }
  `;

  const ribVertex=`
    precision highp float;
    attribute vec3 aPosition;
    uniform mat4 uViewProjection;
    uniform int uWall;
    varying float vHeight;
    ${transform}
    void main(){
      vec3 world=wallPosition(aPosition);vHeight=aPosition.y;
      gl_Position=uViewProjection*vec4(world,1.0);
    }
  `;

  const ribFragment=`
    precision highp float;
    varying float vHeight;
    uniform vec2 uResolution;
    ${reveal}
    void main(){
      vec3 colour=mix(vec3(.07,.55,.61),vec3(.60,1.0,.96),vHeight);
      float alpha=(.18+.34*vHeight)*revealMask(gl_FragCoord.xy,uResolution);
      if(alpha<.012)discard;
      gl_FragColor=vec4(colour,alpha);
    }
  `;

  function buffer(gl,data){
    const handle=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,handle);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);return handle;
  }

  function mount(root,scene,api){
    if(!TARGETS.has(scene?.id))return api;
    const webgl=root.querySelector("canvas");if(!webgl)return api;
    if(getComputedStyle(root).position==="static")root.style.position="relative";
    root.style.isolation="isolate";root.style.overflow="hidden";root.style.background="#01090e";
    webgl.style.position="relative";webgl.style.zIndex="1";

    const layer=document.createElement("canvas");layer.className="rf-exact-box-wall-relief-layer";layer.setAttribute("aria-hidden","true");
    layer.style.cssText="position:absolute;inset:0;z-index:2;width:100%;height:100%;display:block;pointer-events:none";root.appendChild(layer);
    const gl=layer.getContext("webgl",{alpha:true,antialias:true,depth:true,premultipliedAlpha:true,powerPreference:"high-performance"});
    if(!gl||!gl.getExtension("OES_standard_derivatives")){layer.remove();return api;}

    let meshProgram,ribProgram;
    try{meshProgram=createProgram(gl,meshVertex,meshFragment);ribProgram=createProgram(gl,ribVertex,ribFragment);}
    catch(error){console.error("FieldOps exact background mountain shader failed",error);layer.remove();return api;}

    const geometry=buildGeometry(),positionBuffer=buffer(gl,geometry.positions),barycentricBuffer=buffer(gl,geometry.barycentric),ribBuffer=buffer(gl,geometry.ribs);
    const state={angle:Number(scene.initialAngle)||0,velocity:0,dragging:false,pointer:null,x:0,frame:0,destroyed:false,w:0,h:0};
    const meshLocations={
      position:gl.getAttribLocation(meshProgram,"aPosition"),barycentric:gl.getAttribLocation(meshProgram,"aBarycentric"),
      viewProjection:gl.getUniformLocation(meshProgram,"uViewProjection"),wall:gl.getUniformLocation(meshProgram,"uWall"),resolution:gl.getUniformLocation(meshProgram,"uResolution")
    };
    const ribLocations={
      position:gl.getAttribLocation(ribProgram,"aPosition"),viewProjection:gl.getUniformLocation(ribProgram,"uViewProjection"),
      wall:gl.getUniformLocation(ribProgram,"uWall"),resolution:gl.getUniformLocation(ribProgram,"uResolution")
    };

    function resize(){
      const box=root.getBoundingClientRect(),mobile=matchMedia("(max-width:760px)").matches;
      const ratio=Math.min(devicePixelRatio||1,mobile?1:1.25),w=Math.max(1,Math.round(box.width*ratio)),h=Math.max(1,Math.round(box.height*ratio));
      if(w===state.w&&h===state.h)return;state.w=layer.width=w;state.h=layer.height=h;
    }

    function matrix(){
      const aspect=state.w/Math.max(1,state.h),fov=(aspect<.72?58:aspect<1.1?54:49)*Math.PI/180;
      const angle=state.angle*Math.PI/180,s=Math.sin(angle),c=Math.cos(angle),boundary=CAMERA_EDGE/Math.max(Math.abs(s),Math.abs(c),.0001);
      return multiply(perspective(fov,aspect,.08,120),lookAt([s*boundary,CAMERA_HEIGHT,c*boundary],TARGET));
    }

    function draw(){
      resize();const viewProjection=matrix();
      gl.viewport(0,0,state.w,state.h);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

      gl.useProgram(meshProgram);gl.uniformMatrix4fv(meshLocations.viewProjection,false,viewProjection);gl.uniform2f(meshLocations.resolution,state.w,state.h);
      gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);gl.enableVertexAttribArray(meshLocations.position);gl.vertexAttribPointer(meshLocations.position,3,gl.FLOAT,false,0,0);
      gl.bindBuffer(gl.ARRAY_BUFFER,barycentricBuffer);gl.enableVertexAttribArray(meshLocations.barycentric);gl.vertexAttribPointer(meshLocations.barycentric,3,gl.FLOAT,false,0,0);
      for(let wall=0;wall<4;wall+=1){gl.uniform1i(meshLocations.wall,wall);gl.drawArrays(gl.TRIANGLES,0,geometry.vertexCount);}

      gl.useProgram(ribProgram);gl.uniformMatrix4fv(ribLocations.viewProjection,false,viewProjection);gl.uniform2f(ribLocations.resolution,state.w,state.h);
      gl.bindBuffer(gl.ARRAY_BUFFER,ribBuffer);gl.enableVertexAttribArray(ribLocations.position);gl.vertexAttribPointer(ribLocations.position,3,gl.FLOAT,false,0,0);
      for(let wall=0;wall<4;wall+=1){gl.uniform1i(ribLocations.wall,wall);gl.drawArrays(gl.LINES,0,geometry.ribVertexCount);}

      root.dataset.rfBackgroundMountains="4";
      root.dataset.rfBackgroundLayer="exact-old-mountain-box-wall-relief";
      root.dataset.rfBackgroundLayerVersion=VERSION;
    }

    function schedule(){if(!state.frame)state.frame=requestAnimationFrame(tick);}
    function tick(){
      state.frame=0;if(state.destroyed)return;
      if(!state.dragging&&Math.abs(state.velocity)>.001){state.angle+=state.velocity;state.velocity*=DECAY;}
      draw();if(state.dragging||Math.abs(state.velocity)>.001)schedule();
    }
    function down(event){state.dragging=true;state.pointer=event.pointerId;state.x=event.clientX;state.velocity=0;schedule();}
    function move(event){if(!state.dragging||event.pointerId!==state.pointer)return;const delta=event.clientX-state.x;state.x=event.clientX;state.angle+=delta*DRAG;state.velocity=delta*INERTIA;draw();}
    function up(event){if(event.pointerId!==state.pointer)return;state.dragging=false;state.pointer=null;schedule();}
    function key(event){if(!["ArrowLeft","ArrowRight"].includes(event.key))return;state.angle+=event.key==="ArrowLeft"?-8:8;state.velocity=0;draw();}
    function reset(){state.angle=Number(scene.initialAngle)||0;state.velocity=0;draw();}

    webgl.addEventListener("pointerdown",down);webgl.addEventListener("pointermove",move);webgl.addEventListener("pointerup",up);
    webgl.addEventListener("pointercancel",up);webgl.addEventListener("keydown",key);webgl.addEventListener("dblclick",reset);
    const observer=new ResizeObserver(draw);observer.observe(root);draw();
    const originalSet=api.setAngle?.bind(api),originalDestroy=api.destroy?.bind(api);
    if(originalSet)api.setAngle=value=>{state.angle=Number(value)||0;state.velocity=0;originalSet(value);draw();};
    api.destroy=()=>{
      if(state.destroyed)return;state.destroyed=true;if(state.frame)cancelAnimationFrame(state.frame);observer.disconnect();
      webgl.removeEventListener("pointerdown",down);webgl.removeEventListener("pointermove",move);webgl.removeEventListener("pointerup",up);
      webgl.removeEventListener("pointercancel",up);webgl.removeEventListener("keydown",key);webgl.removeEventListener("dblclick",reset);
      gl.deleteBuffer(positionBuffer);gl.deleteBuffer(barycentricBuffer);gl.deleteBuffer(ribBuffer);gl.deleteProgram(meshProgram);gl.deleteProgram(ribProgram);
      layer.remove();originalDestroy?.();
    };
    return api;
  }

  function install(){
    const renderer=globalThis.FieldOps3DRenderer;
    if(!renderer?.create||renderer.__exactBoxWallReliefInstalled)return false;
    const create=renderer.create.bind(renderer);renderer.create=(root,scene)=>mount(root,scene,create(root,scene));
    renderer.__exactBoxWallReliefInstalled=true;renderer.exactBoxWallReliefVersion=VERSION;return true;
  }

  if(!install()){document.addEventListener("fieldops3dassetready",install,{once:true});queueMicrotask(install);}
  globalThis.FieldOpsBackgroundMountains=Object.freeze({VERSION,count:4,mode:"exact-old-mountain-box-wall-relief"});
})();

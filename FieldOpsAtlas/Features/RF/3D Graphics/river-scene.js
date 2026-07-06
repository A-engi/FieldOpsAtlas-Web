/* FieldOps Atlas — River and standalone RF scenes
 * Version: 1.6.21-mountain-geometry-fix
 * Owns loading, adapting, positioning and assembling scene objects.
 */
(()=>{
  "use strict";

  const VERSION="1.6.21-mountain-geometry-fix";
  const MOUNTAIN_BASE="./3D Graphics/";
  const OBJECT_BASE="./3D Graphics/";
  const DEFAULT_CENTRE=[0.131281376,-0.0197811127];
  const IDENTITY=Object.freeze({position:[0,0,0],rotation:[0,0,0],scale:[1,1,1]});
  const sourceCache=new Map();
  const assetCache=new Map();
  const scriptCache=new Map();
  const OBJECT_CACHE_VERSION="1.6.21-mountain-geometry-fix";

  const RIVER_CAMERA=Object.freeze({
    size:[57,23,42],
    // Hold the approved side-view eye height and target through the orbit.
    // The front now opens mainly by distance instead of dropping, lifting and
    // changing aim at the same time.
    target:[0,9.69,0],
    lift:7.95,
    fov:42,
    distanceScale:0.88,
    screenOffsetY:0,
    orbitMotion:{
      frequency:1,phase:0,targetX:0,targetY:0,targetZ:0,
      lift:0,dolly:0,screenY:0,
      sideTargetY:0,
      sideLift:0,
      // 0.88 × 0.82 preserves the approved side distance. Moving toward the
      // front now mostly zooms out, with only the side separation pitch left.
      sideDolly:-0.18,
      sideRoll:0,
      sideScenePitch:0.44,
      sideScenePivot:[0,5.2,0],
      sideScreenY:0.18
    }
  });

  const LEFT=Object.freeze({position:[-13.35,0.015,0.8],rotation:[0,0,0],scale:[0.82,0.90,0.90],mirror:true});
  const RIGHT=Object.freeze({position:[13.35,0.015,-1.8],rotation:[0,Math.PI,0],scale:[0.82,0.90,0.90],mirror:true});
  const TRANSMITTER_TIP_CLEARANCE=2.35;
  const TRANSMITTER_FOOTPRINT_FILL=1.08;
  const TRANSMITTER_MIN_HEIGHT_SCALE=0.34;
  const TRANSMITTER_MAX_HEIGHT_SCALE=1.02;
  const TRANSMITTER_FLAT_Y=24*Math.PI/180;

  // The compressed mountain sources contain the original square mounting blocks.
  // Full mountain sources do not, so these exact eight-vertex blocks are used as
  // their non-destructive fallback. The mountain geometry itself is untouched.
  const MOUNT_BLOCKS=Object.freeze({
    A:Object.freeze({
      positions:Object.freeze([
        3.8299999237060547,6.820000171661377,4.130000114440918,
        5.670000076293945,6.820000171661377,4.130000114440918,
        5.670000076293945,6.820000171661377,5.96999979019165,
        3.8299999237060547,6.820000171661377,5.96999979019165,
        3.8299999237060547,1.100000023841858,4.130000114440918,
        5.670000076293945,1.100000023841858,4.130000114440918,
        5.670000076293945,1.100000023841858,5.96999979019165,
        3.8299999237060547,1.100000023841858,5.96999979019165
      ]),
      centre:Object.freeze([4.75,5.049999952316284]),
      size:Object.freeze([1.8400001525878906,1.8399996757507324]),
      topY:6.820000171661377,
      bottomY:1.100000023841858
    }),
    B:Object.freeze({
      positions:Object.freeze([
        2.5799999237060547,5.799999713897705,1.0799999237060547,
        4.420000076293945,5.799999713897705,1.0799999237060547,
        4.420000076293945,5.799999713897705,2.919999599456787,
        2.5799999237060547,5.799999713897705,2.919999599456787,
        2.5799999237060547,1.100000023841858,1.0799999237060547,
        4.420000076293945,1.100000023841858,1.0799999237060547,
        4.420000076293945,1.100000023841858,2.919999599456787,
        2.5799999237060547,1.100000023841858,2.919999599456787
      ]),
      centre:Object.freeze([3.5,1.999999761581421]),
      size:Object.freeze([1.8400001525878906,1.8399996757507324]),
      topY:5.799999713897705,
      bottomY:1.100000023841858
    })
  });
  const MOUNT_INDICES=Object.freeze([0,1,2,0,2,3,4,5,1,4,1,0,5,6,2,5,2,1,6,7,3,6,3,2,7,4,0,7,0,3]);
  const MOUNT_COLOURS=Object.freeze([1,1,0,0,0,0,0,0,0,0]);

  const TAG_GLYPHS=Object.freeze({
    "0":Object.freeze(["11111","10001","10011","10101","11001","10001","11111"]),
    "1":Object.freeze(["00100","01100","00100","00100","00100","00100","01110"]),
    "2":Object.freeze(["11110","00001","00001","11110","10000","10000","11111"]),
    "3":Object.freeze(["11110","00001","00001","01110","00001","00001","11110"]),
    "4":Object.freeze(["10010","10010","10010","11111","00010","00010","00010"]),
    "5":Object.freeze(["11111","10000","10000","11110","00001","00001","11110"]),
    "6":Object.freeze(["01111","10000","10000","11110","10001","10001","01110"]),
    "7":Object.freeze(["11111","00001","00010","00100","01000","01000","01000"]),
    "8":Object.freeze(["01110","10001","10001","01110","10001","10001","01110"]),
    "9":Object.freeze(["01110","10001","10001","01111","00001","00001","11110"]),
    E:Object.freeze(["11111","10000","10000","11110","10000","10000","11111"]),
    L:Object.freeze(["10000","10000","10000","10000","10000","10000","11111"]),
    V:Object.freeze(["10001","10001","10001","10001","10001","01010","00100"]),
    M:Object.freeze(["10001","11011","10101","10101","10001","10001","10001"]),
    "-":Object.freeze(["00000","00000","00000","11111","00000","00000","00000"]),
    " ":Object.freeze(["00000","00000","00000","00000","00000","00000","00000"])
  });

  const riverVariant=(id,label,quality,baseFile,baseAsset,transmitterFile,transmitterAsset,mountains)=>Object.freeze({
    id,label,quality,camera:RIVER_CAMERA,baseFile,baseAsset,transmitterFile,transmitterAsset,
    attachTransmitters:true,transmitters:Object.freeze([]),mountains:Object.freeze(mountains)
  });
  const mountainVariant=(id,label,quality,file,asset,mount)=>Object.freeze({
    id,label,quality,mountains:Object.freeze([
      Object.freeze({file,asset,mount,transform:IDENTITY,includePlatform:true})
    ]),transmitters:Object.freeze([])
  });

  const VARIANTS=Object.freeze({
    "mount-a_b-full-scene":riverVariant(
      "mount-a_b-full-scene","Mountain A + B — full scene","full",
      "scene-base-full.js","scene-base-full","transmitter-gold-full.js","transmitter-gold-full",[
        Object.freeze({file:"mountain-a-full.js",asset:"mountain-a-full-object",mount:"A",transform:LEFT,includePlatform:true}),
        Object.freeze({file:"mountain-b-full.js",asset:"mountain-b-full-object",mount:"B",transform:RIGHT,includePlatform:true})
      ]
    ),
    "mount-a_b-comp-scene":riverVariant(
      "mount-a_b-comp-scene","Mountain A + B — compressed scene","compressed",
      "scene-base-comp.js","scene-base-comp","transmitter-gold-quarter.js","transmitter-gold-quarter",[
        Object.freeze({file:"mountain-a-compressed.js",asset:"mountain-a-comp-object",mount:"A",transform:LEFT,includePlatform:true}),
        Object.freeze({file:"mountain-b-compressed.js",asset:"mountain-b-comp-object",mount:"B",transform:RIGHT,includePlatform:true})
      ]
    ),
    "mount-a_a-comp-scene":riverVariant(
      "mount-a_a-comp-scene","Mountain A duplicated — compressed scene","compressed",
      "scene-base-comp.js","scene-base-comp","transmitter-gold-quarter.js","transmitter-gold-quarter",[
        Object.freeze({file:"mountain-a-compressed.js",asset:"mountain-a-comp-object",mount:"A",transform:LEFT,includePlatform:true}),
        Object.freeze({file:"mountain-a-compressed.js",asset:"mountain-a-comp-object",mount:"A",transform:RIGHT,includePlatform:true})
      ]
    ),
    "mount-a-full-scene":mountainVariant(
      "mount-a-full-scene","Mountain A — full","full","mountain-a-full.js","mountain-a-full-standalone","A"
    ),
    "mount-b-full-scene":mountainVariant(
      "mount-b-full-scene","Mountain B — full","full","mountain-b-full.js","mountain-b-full-standalone","B"
    ),
    "mount-a-comp-scene":mountainVariant(
      "mount-a-comp-scene","Mountain A — compressed","compressed","mountain-a-compressed.js","mountain-a-comp-standalone","A"
    ),
    "mount-b-comp-scene":mountainVariant(
      "mount-b-comp-scene","Mountain B — compressed","compressed","mountain-b-compressed.js","mountain-b-comp-standalone","B"
    ),
    "transmitter-scene":Object.freeze({
      id:"transmitter-scene",label:"Transmitter",quality:"full",
      transmitterFile:"transmitter-gold-full.js",transmitterAsset:"transmitter-gold-full",
      transmitters:Object.freeze([IDENTITY]),mountains:Object.freeze([])
    })
  });

  function loadScript(file){
    const assetUrl=new URL(OBJECT_BASE+file,document.baseURI);
    assetUrl.searchParams.set("v",OBJECT_CACHE_VERSION);
    const url=assetUrl.href;
    if(scriptCache.has(url))return scriptCache.get(url);
    const promise=new Promise((resolve,reject)=>{
      const existing=[...document.scripts].find(script=>script.src===url);
      if(existing?.dataset.loaded==="true"){resolve(existing);return;}
      if(existing){
        existing.addEventListener("load",()=>resolve(existing),{once:true});
        existing.addEventListener("error",()=>reject(new Error(`Unable to load ${file}`)),{once:true});
        return;
      }
      const script=document.createElement("script");
      script.src=url;script.async=true;script.dataset.fieldopsRiverObject=file;
      script.addEventListener("load",()=>{script.dataset.loaded="true";resolve(script);},{once:true});
      script.addEventListener("error",()=>reject(new Error(`Unable to load ${file}`)),{once:true});
      document.head.appendChild(script);
    });
    scriptCache.set(url,promise);return promise;
  }

  const fakeDocument=Object.freeze({
    readyState:"complete",querySelectorAll:()=>[],querySelector:()=>null,
    addEventListener:()=>{},removeEventListener:()=>{},
    createElement:()=>{throw new Error("Mountain source attempted to create a canvas during scene extraction");}
  });
  const fakeConsole=Object.freeze({log:()=>{},warn:()=>{},error:()=>{}});

  function injectCapture(source,format){
    const capture=format==="full"
      ?";globalThis.__fieldopsCapture={data:w,palettes:C,view:B};"
      :";globalThis.__fieldopsCapture={data:P,palettes:L,centre:C,view:W};";
    const replaced=source.replace(/\}\)\(\);?\s*$/,`${capture}})();`);
    if(replaced===source)throw new Error("Mountain source ending was not recognised");
    return replaced;
  }

  function evaluateMountain(source,format){
    const sandbox={__fieldopsCapture:null,FieldOpsRFBuilder3:null,FieldOps3DAssetQueue:[],document:fakeDocument,console:fakeConsole};
    sandbox.globalThis=sandbox;sandbox.window=sandbox;
    const execute=new Function("globalThis","window","document","console","Float32Array","Uint8Array","Uint16Array","Uint32Array","Int32Array","Array","Object","String","Number","Boolean","Math",injectCapture(source,format));
    execute(sandbox,sandbox,fakeDocument,fakeConsole,Float32Array,Uint8Array,Uint16Array,Uint32Array,Int32Array,Array,Object,String,Number,Boolean,Math);
    if(!sandbox.__fieldopsCapture?.data)throw new Error(`No ${format} mountain geometry was captured`);
    return sandbox.__fieldopsCapture;
  }

  const fullLayer=layer=>layer?{format:layer.format,v:layer.vertices,f:layer.faces,b:layer.colourBits,n:layer.normals?1:0,p:layer.position,i:layer.index,c:layer.colour}:null;
  const compressedLayer=layer=>layer?{format:layer.format||"q16d",v:layer.v,f:layer.f,b:layer.b,n:layer.n?1:0,o:layer.o,s:layer.s,p:layer.p,i:layer.i,c:layer.c}:null;
  const decodeBytes=text=>{
    const binary=atob(text),output=new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i+=1)output[i]=binary.charCodeAt(i);
    return output;
  };
  const readVarint=(data,state)=>{
    let value=0,factor=1;
    while(true){
      const byte=data[state.offset++];
      value+=(byte&127)*factor;
      if((byte&128)===0)return value;
      factor*=128;
    }
  };
  const zigzag=value=>value%2===0?value/2:-(value+1)/2;

  function sourcePositions(layer,format){
    if(!layer)return null;
    if(layer.positions)return layer.positions;
    const data=decodeBytes(layer.p||layer.position),state={offset:0};
    if(format==="compressed"){
      const previous=[0,0,0],output=new Float32Array(layer.v*3);
      for(let i=0;i<output.length;i+=1){
        const axis=i%3,value=previous[axis]+zigzag(readVarint(data,state));
        previous[axis]=value;
        output[i]=layer.o[axis]+value*layer.s[axis];
      }
      return output;
    }
    const words=new Uint32Array(layer.vertices*3),previous=[0,0,0];
    for(let i=0;i<words.length;i+=1){
      const axis=i%3,value=(previous[axis]+zigzag(readVarint(data,state)))>>>0;
      previous[axis]=value;
      words[i]=value;
    }
    return new Float32Array(words.buffer);
  }

  function positionBounds(positions){
    const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
    for(let i=0;i<positions.length;i+=3){
      for(let axis=0;axis<3;axis+=1){
        const value=positions[i+axis];
        if(value<min[axis])min[axis]=value;
        if(value>max[axis])max[axis]=value;
      }
    }
    return {min,max};
  }

  function fallbackPlatform(mount){
    const block=MOUNT_BLOCKS[mount];
    if(!block)return null;
    return {
      format:"raw-indexed",normals:true,
      positions:new Float32Array(block.positions),
      indices:new Uint32Array(MOUNT_INDICES),
      faceColours:new Uint8Array(MOUNT_COLOURS)
    };
  }

  function mountainAsset(capture,format,{includePlatform=false,mount}={}){
    const map=format==="full"?fullLayer:compressedLayer;
    const layers={shell:map(capture.data.shell),ridge:map(capture.data.ridge)};
    const sourcePlatform=capture.data.platform||null;
    if(includePlatform)layers.platform=sourcePlatform
      ?map(sourcePlatform)
      :fallbackPlatform(mount);

    const shellBounds=positionBounds(sourcePositions(capture.data.shell,format));
    const ridgeBounds=positionBounds(sourcePositions(capture.data.ridge,format));
    const peakY=Math.max(shellBounds.max[1],ridgeBounds.max[1]);
    let block=MOUNT_BLOCKS[mount]||null;
    if(sourcePlatform){
      const bounds=positionBounds(sourcePositions(sourcePlatform,format));
      block={
        centre:[(bounds.min[0]+bounds.max[0])/2,(bounds.min[2]+bounds.max[2])/2],
        size:[bounds.max[0]-bounds.min[0],bounds.max[2]-bounds.min[2]],
        topY:bounds.max[1]
      };
    }

    return {
      centre:capture.centre||DEFAULT_CENTRE,mirror:true,view:capture.view,
      palettes:{shell:capture.palettes.shell,ridge:capture.palettes.ridge},layers,
      mountPoint:block?Object.freeze({centre:[...block.centre],size:[...block.size],topY:block.topY,peakY}):null
    };
  }

  async function readMountain(file){
    const url=new URL(MOUNTAIN_BASE+file,document.baseURI).href;
    if(!sourceCache.has(url))sourceCache.set(url,fetch(url,{cache:"force-cache"}).then(response=>{
      if(!response.ok)throw new Error(`Unable to fetch ${file}: ${response.status}`);
      return response.text();
    }));
    return sourceCache.get(url);
  }

  async function loadMountain(definition,quality){
    if(globalThis.FieldOps3DAssets?.has?.(definition.asset))return globalThis.FieldOps3DAssets.get(definition.asset);
    if(!assetCache.has(definition.asset))assetCache.set(definition.asset,(async()=>{
      const source=await readMountain(definition.file);
      const capture=evaluateMountain(source,quality);
      const asset=mountainAsset(capture,quality,{includePlatform:Boolean(definition.includePlatform),mount:definition.mount});
      globalThis.FieldOps3DAssets.register(definition.asset,asset);
      return asset;
    })());
    return assetCache.get(definition.asset);
  }

  function uniqueMountains(items=[]){
    const seen=new Set();
    return items.filter(item=>{if(seen.has(item.asset))return false;seen.add(item.asset);return true;});
  }

  const object=(asset,transform=IDENTITY,mirror)=>({
    asset,position:[...transform.position],rotation:[...transform.rotation],scale:[...transform.scale],
    ...(mirror===undefined?{}:{mirror})
  });

  function transformPoint(transform,point){
    const [px,py,pz]=transform.position||[0,0,0];
    const [rx,ry,rz]=transform.rotation||[0,0,0];
    const [sx,sy,sz]=transform.scale||[1,1,1];
    const cx=Math.cos(rx),sxr=Math.sin(rx),cy=Math.cos(ry),syr=Math.sin(ry),cz=Math.cos(rz),szr=Math.sin(rz);
    const [x,y,z]=point;
    return [
      (cy*cz)*sx*x+(-cy*szr)*sy*y+syr*sz*z+px,
      (sxr*syr*cz+cx*szr)*sx*x+(-sxr*syr*szr+cx*cz)*sy*y+(-sxr*cy)*sz*z+py,
      (-cx*syr*cz+sxr*szr)*sx*x+(cx*syr*szr+sxr*cz)*sy*y+(cx*cy)*sz*z+pz
    ];
  }

  function assetBounds(asset){
    const layer=asset?.layers?.shell;
    if(!layer)return null;
    if(layer.positions)return positionBounds(layer.positions);
    if(layer.format==="raw-expanded")return positionBounds(layer.positions);
    return null;
  }

  function transmitterOnMountain(scene,mountain,heightScale){
    const mountainAsset=globalThis.FieldOps3DAssets.get(mountain.asset);
    const transmitterAsset=globalThis.FieldOps3DAssets.get(scene.transmitterAsset);
    const mount=mountainAsset?.mountPoint;
    const transmitterBounds=assetBounds(transmitterAsset);
    if(!mount||!transmitterBounds)throw new Error(`A transmitter mount could not be resolved for ${mountain.asset}`);

    const top=transformPoint(mountain.transform,[mount.centre[0],mount.topY,mount.centre[1]]);
    const mountainScale=mountain.transform.scale||[1,1,1];
    const verticalScale=Math.abs(mountainScale[1]??1);
    const mountainPeak=(mountain.transform.position?.[1]||0)+mount.peakY*verticalScale;
    const transmitterHeight=transmitterBounds.max[1]-transmitterBounds.min[1];
    const transmitterWidth=transmitterBounds.max[0]-transmitterBounds.min[0];
    const transmitterDepth=transmitterBounds.max[2]-transmitterBounds.min[2];
    const platformWidth=mount.size[0]*Math.abs(mountainScale[0]??1);
    const platformDepth=mount.size[1]*Math.abs(mountainScale[2]??1);
    const footprintScale=TRANSMITTER_FOOTPRINT_FILL*Math.min(
      platformWidth/transmitterWidth,
      platformDepth/transmitterDepth
    );
    const requiredHeightScale=Math.max(TRANSMITTER_MIN_HEIGHT_SCALE,Math.min(TRANSMITTER_MAX_HEIGHT_SCALE,
      (mountainPeak+TRANSMITTER_TIP_CLEARANCE-top[1])/transmitterHeight
    ));

    return Object.freeze({
      position:[top[0],top[1]-transmitterBounds.min[1]*heightScale,top[2]],
      rotation:[
        mountain.transform.rotation?.[0]||0,
        (mountain.transform.rotation?.[1]||0)+TRANSMITTER_FLAT_Y,
        mountain.transform.rotation?.[2]||0
      ],
      scale:[footprintScale,heightScale,footprintScale],
      requiredHeightScale
    });
  }

  function commonTransmitterHeightScale(scene){
    const required=(scene.mountains||[]).map(mountain=>{
      const probe=transmitterOnMountain(scene,mountain,1);
      return probe.requiredHeightScale;
    });
    return Math.max(TRANSMITTER_MIN_HEIGHT_SCALE,Math.min(TRANSMITTER_MAX_HEIGHT_SCALE,...required));
  }

  function appendRectangle(layer,x0,y0,x1,y1,z,colour){
    const index=layer.positions.length/3;
    layer.positions.push(x0,y0,z,x1,y0,z,x1,y1,z,x0,y1,z);
    layer.indices.push(index,index+1,index+2,index,index+2,index+3);
    layer.faceColours.push(colour,colour);
  }

  function appendBitmapText(layer,text,{centerX=0,centerY,height,maxWidth,z,colour,insetRatio=0.035}){
    const value=String(text||"").toUpperCase();
    if(!value)return;
    const columns=value.length*5+Math.max(0,value.length-1);
    let cell=height/7;
    if(columns*cell>maxWidth)cell=maxWidth/columns;
    const width=columns*cell;
    const actualHeight=7*cell;
    let x=centerX-width/2;
    const top=centerY+actualHeight/2;
    const inset=cell*insetRatio;

    for(const character of value){
      const glyph=TAG_GLYPHS[character]||TAG_GLYPHS[" "];
      for(let row=0;row<7;row+=1){
        for(let column=0;column<5;column+=1){
          if(glyph[row][column]!=="1")continue;
          const x0=x+column*cell+inset;
          const x1=x+(column+1)*cell-inset;
          const y1=top-row*cell-inset;
          const y0=top-(row+1)*cell+inset;
          appendRectangle(layer,x0,y0,x1,y1,z,colour);
        }
      }
      x+=6*cell;
    }
  }

  function elevationTagAsset(endpoint,direction){
    const width=5.8,height=2.25,depth=0.12;
    const x=width/2,y=height/2,z=depth/2;
    const shellPositions=new Float32Array([
      -x,-y,-z, x,-y,-z, x,y,-z, -x,y,-z,
      -x,-y,z,  x,-y,z,  x,y,z,  -x,y,z
    ]);
    const shellIndices=new Uint32Array([
      0,2,1,0,3,2,
      4,5,6,4,6,7,
      0,4,7,0,7,3,
      1,2,6,1,6,5,
      0,1,5,0,5,4,
      3,7,6,3,6,2
    ]);
    const shellColours=new Uint8Array([0,0,1,1,0,0,0,0,0,0,0,0]);
    const ridge={positions:[],indices:[],faceColours:[]};
    const faceZ=z+0.004;
    const trench=0.11;
    const edge=0.03;
    const label=endpoint?.elevationTagLabel||"ELEV";
    const value=endpoint?.elevationTagText||`${Math.round(Number(endpoint?.elevationM)||0)} M`;

    appendRectangle(ridge,-x+0.10,y-0.14,x-0.10,y-0.14+trench,faceZ,0);
    appendRectangle(ridge,-x+0.10,-y+0.14-trench,x-0.10,-y+0.14,faceZ,0);
    appendRectangle(ridge,-x+0.10,-y+0.14,-x+0.10+trench,y-0.14,faceZ,0);
    appendRectangle(ridge,x-0.10-trench,-y+0.14,x-0.10,y-0.14,faceZ,0);

    appendRectangle(ridge,-x+0.23,y-0.28,x-0.23,y-0.28+edge,faceZ+0.002,1);
    appendRectangle(ridge,-x+0.23,-y+0.28-edge,x-0.23,-y+0.28,faceZ+0.002,1);
    appendRectangle(ridge,-x+0.23,-y+0.28,-x+0.23+edge,y-0.28,faceZ+0.002,1);
    appendRectangle(ridge,x-0.23-edge,-y+0.28,x-0.23,y-0.28,faceZ+0.002,1);

    // A small direction accent remains coloured, while the lettering itself is
    // high-contrast pale gold so it stays readable at the 45-degree plaque angle.
    appendRectangle(ridge,-1.55,-0.96,1.55,-0.89,faceZ+0.003,4);

    appendBitmapText(ridge,label,{
      centerX:0.045,centerY:0.48,height:0.48,maxWidth:3.15,
      z:faceZ+0.003,colour:0,insetRatio:0.02
    });
    appendBitmapText(ridge,label,{
      centerY:0.52,height:0.48,maxWidth:3.15,
      z:faceZ+0.006,colour:2,insetRatio:0.035
    });

    appendBitmapText(ridge,value,{
      centerX:0.055,centerY:-0.28,height:1.02,maxWidth:4.75,
      z:faceZ+0.004,colour:0,insetRatio:0.02
    });
    appendBitmapText(ridge,value,{
      centerY:-0.23,height:1.02,maxWidth:4.75,
      z:faceZ+0.008,colour:3,insetRatio:0.035
    });

    return {
      centre:[0,0],mirror:false,
      palettes:{
        shell:["01141b","063743"],
        ridge:[
          "001016",
          "c79a48",
          "ffe2a0",
          "fff8df",
          direction==="from"?"69d995":"e98d84"
        ]
      },
      layers:{
        shell:{format:"raw-indexed",normals:true,positions:shellPositions,indices:shellIndices,faceColours:shellColours},
        ridge:{
          format:"raw-indexed",normals:false,
          positions:new Float32Array(ridge.positions),
          indices:new Uint32Array(ridge.indices),
          faceColours:new Uint8Array(ridge.faceColours)
        }
      }
    };
  }

  function tagTransform(mountain){
    const position=mountain.transform?.position||[0,0,0];

    // The lower edge still meets the river, but the whole plaque is raised
    // enough to stop the face and lettering sinking into the terrain.
    return Object.freeze({
      position:[position[0]||0,0.72,(position[2]||0)+11.5],
      rotation:[-45*Math.PI/180,0,0],
      scale:[0.95,0.95,0.95]
    });
  }

  function elevationTagObjects(scene,path){
    const mountains=scene.mountains||[];
    if(!scene.baseAsset||!path||!mountains.length)return [];
    const output=[];

    mountains.slice(0,2).forEach((mountain,index)=>{
      const direction=index===0?"from":"to";
      const endpoint=mountains.length===1&&mountain.mount==="B"?path.to:path[direction];
      if(!Number.isFinite(Number(endpoint?.elevationM)))return;
      const assetId=`rf-elevation-tag-${direction}`;
      globalThis.FieldOps3DAssets.register(assetId,elevationTagAsset(endpoint,direction));
      output.push(object(assetId,tagTransform(mountain),false));
    });

    return output;
  }

  function objectsFor(scene,path){
    const objects=[];
    if(scene.baseAsset)objects.push({asset:scene.baseAsset,position:[0,0,0],rotation:[0,0,0],scale:[1,1,1],mirror:false});
    objects.push(...(scene.mountains||[]).map(item=>object(item.asset,item.transform,item.transform?.mirror)));
    objects.push(...elevationTagObjects(scene,path));

    if(scene.attachTransmitters&&scene.transmitterAsset){
      const sharedHeightScale=commonTransmitterHeightScale(scene);
      objects.push(...(scene.mountains||[]).map(item=>
        object(scene.transmitterAsset,transmitterOnMountain(scene,item,sharedHeightScale))
      ));
    }
    if(scene.transmitterAsset){
      objects.push(...(scene.transmitters||[]).map(transform=>object(scene.transmitterAsset,transform)));
    }
    return objects;
  }

  async function build(root,{variant="mount-a_b-comp-scene",path=null}={}){
    if(!root)throw new Error("Scene graph mount was not found");
    const scene=VARIANTS[variant]||VARIANTS["mount-a_b-comp-scene"];
    if(!globalThis.FieldOps3DRenderer?.create)throw new Error("3d-render.js must load before river-scene.js builds");

    root.setAttribute("aria-busy","true");
    root.dataset.rfSceneOwnerVersion=VERSION;
    root.dataset.rfSceneVariant=scene.id;

    const scripts=[scene.baseFile,scene.transmitterFile].filter(Boolean);
    await Promise.all(scripts.map(loadScript));
    const mountains=uniqueMountains(scene.mountains);
    await Promise.all(mountains.map(item=>loadMountain(item,scene.quality)));

    const required=[scene.baseAsset,scene.transmitterAsset,...mountains.map(item=>item.asset)].filter(Boolean);
    for(const id of required){
      if(!globalThis.FieldOps3DAssets?.has?.(id))throw new Error(`Scene asset was not registered: ${id}`);
    }

    const rendererScene={
      id:scene.id,label:scene.label,background:"#01090e",initialAngle:0,objects:objectsFor(scene,path)
    };
    if(scene.camera)rendererScene.camera=scene.camera;

    const instance=globalThis.FieldOps3DRenderer.create(root,rendererScene);
    root.setAttribute("aria-busy","false");
    root.dataset.rfScene=scene.id;
    root.dataset.rfSceneObjects=rendererScene.objects.map(item=>item.asset).join(",");
    root.dataset.rfElevationFrom=Number.isFinite(Number(path?.from?.elevationM))?String(Math.round(Number(path.from.elevationM))):"";
    root.dataset.rfElevationTo=Number.isFinite(Number(path?.to?.elevationM))?String(Math.round(Number(path.to.elevationM))):"";
    return instance;
  }

  globalThis.FieldOpsRiverScene=Object.freeze({VERSION,VARIANTS,build});
})();

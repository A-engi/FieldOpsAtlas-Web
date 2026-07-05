/* FieldOps Atlas — River and standalone RF scenes
 * Version: 1.6.0-scene-catalog
 * Owns loading, adapting, positioning and assembling scene objects.
 */
(()=>{
  "use strict";

  const VERSION="1.6.0-scene-catalog";
  const MOUNTAIN_BASE="./3D Graphics/";
  const OBJECT_BASE="./3D Graphics/";
  const DEFAULT_CENTRE=[0.131281376,-0.0197811127];
  const IDENTITY=Object.freeze({position:[0,0,0],rotation:[0,0,0],scale:[1,1,1]});
  const sourceCache=new Map();
  const assetCache=new Map();
  const scriptCache=new Map();

  const RIVER_CAMERA=Object.freeze({
    size:[57,23,42],
    target:[0,7.15,0],
    lift:8.2,
    fov:42,
    distanceScale:1.02,
    bottomAnchorPoints:[[-26,0,-19],[0,0,-19],[26,0,-19],[-26,0,0],[26,0,0],[-26,0,19],[0,0,19],[26,0,19]],
    bottomNdc:-0.985,
    orbitMotion:{frequency:1,targetX:1.15,targetY:1.75,targetZ:0.7,lift:0.8,dolly:0.018,phase:-0.35}
  });

  const LEFT=Object.freeze({position:[-13.35,0.015,0.8],rotation:[0,0,0],scale:[0.82,0.90,0.90],mirror:true});
  const RIGHT=Object.freeze({position:[13.35,0.015,-1.8],rotation:[0,Math.PI,0],scale:[0.82,0.90,0.90],mirror:true});
  const TX_FRONT=Object.freeze({position:[-8.2,9.65,3.4],rotation:[0,0.18,0],scale:[0.31,0.31,0.31]});
  const TX_REAR=Object.freeze({position:[8.8,11.75,-6.8],rotation:[0,-0.28,0],scale:[0.29,0.29,0.29]});

  const riverVariant=(id,label,quality,baseFile,baseAsset,transmitterFile,transmitterAsset,mountains)=>Object.freeze({
    id,label,quality,camera:RIVER_CAMERA,baseFile,baseAsset,transmitterFile,transmitterAsset,
    transmitters:Object.freeze([TX_FRONT,TX_REAR]),mountains:Object.freeze(mountains)
  });
  const mountainVariant=(id,label,quality,file,asset)=>Object.freeze({
    id,label,quality,mountains:Object.freeze([
      Object.freeze({file,asset,transform:IDENTITY,includePlatform:true})
    ]),transmitters:Object.freeze([])
  });

  const VARIANTS=Object.freeze({
    "mount-a_b-full-scene":riverVariant(
      "mount-a_b-full-scene","Mountain A + B — full scene","full",
      "scene-base-full.js","scene-base-full","transmitter-gold-full.js","transmitter-gold-full",[
        Object.freeze({file:"mountain-a-full.js",asset:"mountain-a-full-object",transform:LEFT}),
        Object.freeze({file:"mountain-b-full.js",asset:"mountain-b-full-object",transform:RIGHT})
      ]
    ),
    "mount-a_b-comp-scene":riverVariant(
      "mount-a_b-comp-scene","Mountain A + B — compressed scene","compressed",
      "scene-base-comp.js","scene-base-comp","transmitter-gold-quarter.js","transmitter-gold-quarter",[
        Object.freeze({file:"mountain-a-compressed.js",asset:"mountain-a-comp-object",transform:LEFT}),
        Object.freeze({file:"mountain-b-compressed.js",asset:"mountain-b-comp-object",transform:RIGHT})
      ]
    ),
    "mount-a_a-comp-scene":riverVariant(
      "mount-a_a-comp-scene","Mountain A duplicated — compressed scene","compressed",
      "scene-base-comp.js","scene-base-comp","transmitter-gold-quarter.js","transmitter-gold-quarter",[
        Object.freeze({file:"mountain-a-compressed.js",asset:"mountain-a-comp-object",transform:LEFT}),
        Object.freeze({file:"mountain-a-compressed.js",asset:"mountain-a-comp-object",transform:RIGHT})
      ]
    ),
    "mount-a-full-scene":mountainVariant(
      "mount-a-full-scene","Mountain A — full","full","mountain-a-full.js","mountain-a-full-standalone"
    ),
    "mount-b-full-scene":mountainVariant(
      "mount-b-full-scene","Mountain B — full","full","mountain-b-full.js","mountain-b-full-standalone"
    ),
    "mount-a-comp-scene":mountainVariant(
      "mount-a-comp-scene","Mountain A — compressed","compressed","mountain-a-compressed.js","mountain-a-comp-standalone"
    ),
    "mount-b-comp-scene":mountainVariant(
      "mount-b-comp-scene","Mountain B — compressed","compressed","mountain-b-compressed.js","mountain-b-comp-standalone"
    ),
    "transmitter-scene":Object.freeze({
      id:"transmitter-scene",label:"Transmitter",quality:"full",
      transmitterFile:"transmitter-gold-full.js",transmitterAsset:"transmitter-gold-full",
      transmitters:Object.freeze([IDENTITY]),mountains:Object.freeze([])
    })
  });

  function loadScript(file){
    const url=new URL(OBJECT_BASE+file,document.baseURI).href;
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
      ? ";globalThis.__fieldopsCapture={data:w,palettes:C,view:B};"
      : ";globalThis.__fieldopsCapture={data:P,palettes:L,centre:C,view:W};";
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

  function mountainAsset(capture,format,{includePlatform=false}={}){
    const map=format==="full"?fullLayer:compressedLayer;
    const layers={shell:map(capture.data.shell),ridge:map(capture.data.ridge)};
    if(includePlatform&&capture.data.platform)layers.platform=map(capture.data.platform);
    return {
      centre:capture.centre||DEFAULT_CENTRE,mirror:true,view:capture.view,
      palettes:{shell:capture.palettes.shell,ridge:capture.palettes.ridge},layers
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
      const asset=mountainAsset(capture,quality,{includePlatform:Boolean(definition.includePlatform)});
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

  function objectsFor(scene){
    const objects=[];
    if(scene.baseAsset)objects.push({asset:scene.baseAsset,position:[0,0,0],rotation:[0,0,0],scale:[1,1,1],mirror:false});
    objects.push(...(scene.mountains||[]).map(item=>object(item.asset,item.transform,item.transform?.mirror)));
    objects.push(...(scene.transmitters||[]).map(transform=>object(scene.transmitterAsset,transform)));
    return objects;
  }

  async function build(root,{variant="mount-a_b-comp-scene"}={}){
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
      id:scene.id,label:scene.label,background:"#01090e",initialAngle:0,objects:objectsFor(scene)
    };
    if(scene.camera)rendererScene.camera=scene.camera;

    const instance=globalThis.FieldOps3DRenderer.create(root,rendererScene);
    root.setAttribute("aria-busy","false");
    root.dataset.rfScene=scene.id;
    root.dataset.rfSceneObjects=rendererScene.objects.map(item=>item.asset).join(",");
    return instance;
  }

  globalThis.FieldOpsRiverScene=Object.freeze({VERSION,VARIANTS,build});
})();

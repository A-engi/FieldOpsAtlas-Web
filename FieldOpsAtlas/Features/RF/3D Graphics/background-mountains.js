/* FieldOps Atlas — repeated background mountain band
 * Version: 1.0.0-existing-mountain-band
 *
 * Reuses the already-loaded compressed Mountain A and Mountain B assets.
 * Three darker copies sit behind the live foreground mountains.
 * They keep fixed object rotations; the camera orbit makes the band slide
 * sideways while the repeated A/B/A pattern remains continuous.
 */
(()=>{
  "use strict";

  const VERSION="1.0.0-existing-mountain-band";
  const TARGET_SCENES=new Set([
    "mount-a_b-comp-scene",
    "mount-a_a-comp-scene"
  ]);

  const SOURCE_A="mountain-a-comp-object";
  const SOURCE_B="mountain-b-comp-object";
  const BACKDROP_A="mountain-a-comp-background";
  const BACKDROP_B="mountain-b-comp-background";

  const BACKGROUND_OBJECTS=Object.freeze([
    Object.freeze({
      asset:BACKDROP_A,
      position:[-27.5,4.25,-17.0],
      rotation:[0,0,0],
      scale:[0.50,0.50,0.42],
      mirror:true
    }),
    Object.freeze({
      asset:BACKDROP_B,
      position:[0,4.85,-19.5],
      rotation:[0,Math.PI,0],
      scale:[0.56,0.56,0.46],
      mirror:true
    }),
    Object.freeze({
      asset:BACKDROP_A,
      position:[27.5,4.15,-17.5],
      rotation:[0,0,0],
      scale:[0.49,0.49,0.41],
      mirror:true
    })
  ]);

  function darkenHex(value,factor,blueLift=0){
    const text=String(value||"000000").replace("#","").padStart(6,"0").slice(-6);
    const red=Math.max(0,Math.min(255,Math.round(parseInt(text.slice(0,2),16)*factor)));
    const green=Math.max(0,Math.min(255,Math.round(parseInt(text.slice(2,4),16)*factor)));
    const blue=Math.max(0,Math.min(255,Math.round(
      parseInt(text.slice(4,6),16)*factor+blueLift
    )));
    return [red,green,blue]
      .map(channel=>channel.toString(16).padStart(2,"0"))
      .join("");
  }

  function backdropPalette(values,factor,blueLift){
    return (values||["071018"]).map(value=>darkenHex(value,factor,blueLift));
  }

  function registerBackdrop(sourceId,targetId){
    if(globalThis.FieldOps3DAssets?.has?.(targetId))return true;

    const source=globalThis.FieldOps3DAssets?.get?.(sourceId);
    if(!source)return false;

    globalThis.FieldOps3DAssets.register(targetId,{
      centre:source.centre,
      mirror:source.mirror,
      view:source.view,
      palettes:{
        shell:backdropPalette(source.palettes?.shell,0.24,4),
        ridge:backdropPalette(source.palettes?.ridge,0.30,8)
      },
      // Deliberately exclude the transmitter mounting platform.
      layers:{
        shell:source.layers?.shell,
        ridge:source.layers?.ridge
      }
    });

    return true;
  }

  function backdropObjects(scene){
    if(!TARGET_SCENES.has(scene?.id))return [];
    if(!registerBackdrop(SOURCE_A,BACKDROP_A))return [];
    if(!registerBackdrop(SOURCE_B,BACKDROP_B))return [];
    return BACKGROUND_OBJECTS.map(item=>({
      asset:item.asset,
      position:[...item.position],
      rotation:[...item.rotation],
      scale:[...item.scale],
      mirror:item.mirror,
      backgroundMountain:true
    }));
  }

  function install(){
    const renderer=globalThis.FieldOps3DRenderer;
    if(!renderer?.create||renderer.__backgroundMountainBandInstalled)return false;

    const originalCreate=renderer.create.bind(renderer);

    renderer.create=(root,scene)=>{
      const backgrounds=backdropObjects(scene);

      if(!backgrounds.length){
        return originalCreate(root,scene);
      }

      const originalObjects=Array.isArray(scene.objects)?scene.objects:[];
      const base=originalObjects.length?[originalObjects[0]]:[];
      const foreground=originalObjects.length?originalObjects.slice(1):[];

      const extendedScene={
        ...scene,
        objects:[
          ...base,
          ...backgrounds,
          ...foreground
        ]
      };

      root.dataset.rfBackgroundMountains=String(backgrounds.length);
      root.dataset.rfBackgroundMountainVersion=VERSION;

      return originalCreate(root,extendedScene);
    };

    renderer.__backgroundMountainBandInstalled=true;
    renderer.backgroundMountainBandVersion=VERSION;
    return true;
  }

  if(!install()){
    document.addEventListener("fieldops3dassetready",install,{once:true});
    queueMicrotask(install);
  }

  globalThis.FieldOpsBackgroundMountains=Object.freeze({
    VERSION,
    count:BACKGROUND_OBJECTS.length
  });
})();

/* FieldOps Atlas — RF scene selector
 * Version: 1.5.1-builder-selects-scene
 * Selects a scene; assembly remains inside river-scene.js.
 */
(()=>{
  "use strict";
  const VERSION="1.5.1-builder-selects-scene";
  const DEFAULT_SCENE="mount-a_b-comp-scene";
  const ALIASES=Object.freeze({
    "mount-a_b-full-scene":"mount-a_b-full-scene",
    "mount-a_b-comp-scene":"mount-a_b-comp-scene",
    "mount-a_a-comp-scene":"mount-a_a-comp-scene",
    "ab-full":"mount-a_b-full-scene",
    "ab-compressed":"mount-a_b-comp-scene",
    "aa-compressed":"mount-a_a-comp-scene",
    "full":"mount-a_b-full-scene",
    "compressed":"mount-a_b-comp-scene",
    "duplicate-a":"mount-a_a-comp-scene"
  });
  let active=null;

  function normalise(value){
    return ALIASES[String(value||"").trim().toLowerCase()]||DEFAULT_SCENE;
  }

  function requested(root){
    const params=new URLSearchParams(location.search);
    const pageDefault=document.querySelector("[data-rf-scene-default]")?.dataset.rfSceneDefault;
    return normalise(root?.dataset.rfSceneRequest||params.get("scene")||pageDefault||DEFAULT_SCENE);
  }

  async function build(root=document.querySelector("[data-rf-graph]"),forced){
    if(!root)return null;
    const sceneName=forced?normalise(forced):requested(root);
    root.dataset.rfBuilderVersion=VERSION;
    root.dataset.rfSceneRequest=sceneName;
    try{
      if(!globalThis.FieldOpsRiverScene?.build)throw new Error("river-scene.js is unavailable");
      active?.destroy?.();
      active=await globalThis.FieldOpsRiverScene.build(root,{variant:sceneName});
      document.dispatchEvent(new CustomEvent("fieldops:rf-scene-ready",{
        detail:{version:VERSION,scene:sceneName}
      }));
      return active;
    }catch(error){
      root.setAttribute("aria-busy","false");
      root.dataset.rfBuilder3Ready="false";
      root.dataset.rfScene="load-error";
      root.textContent="3D graph could not load.";
      console.error("FieldOps RF scene selection failed",error);
      return null;
    }
  }

  function select(sceneName,root=document.querySelector("[data-rf-graph]")){
    return build(root,sceneName);
  }

  function initAll(){
    document.querySelectorAll("[data-rf-graph]").forEach(root=>build(root));
  }

  globalThis.FieldOpsGraphBuilder=Object.freeze({VERSION,DEFAULT_SCENE,build,select,initAll});
  globalThis.FieldOpsRFGraph=globalThis.FieldOpsGraphBuilder;
  document.readyState==="loading"
    ? document.addEventListener("DOMContentLoaded",initAll,{once:true})
    : initAll();
})();

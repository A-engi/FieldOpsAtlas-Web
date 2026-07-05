/* FieldOps Atlas — RF scene selector
 * Version: 1.6.0-scene-dropdown
 * Selects scenes and binds any [data-rf-scene-select] control to the nearest graph.
 */
(()=>{
  "use strict";

  const VERSION="1.6.0-scene-dropdown";
  const DEFAULT_SCENE="mount-a_b-comp-scene";
  const SCENES=Object.freeze([
    Object.freeze({id:"mount-a_b-full-scene",label:"mount-a_b-full-scene"}),
    Object.freeze({id:"mount-a_b-comp-scene",label:"mount-a_b-comp-scene"}),
    Object.freeze({id:"mount-a_a-comp-scene",label:"mount-a_a-comp-scene"}),
    Object.freeze({id:"mount-a-full-scene",label:"mount a"}),
    Object.freeze({id:"mount-b-full-scene",label:"mount b"}),
    Object.freeze({id:"mount-a-comp-scene",label:"mount a comp"}),
    Object.freeze({id:"mount-b-comp-scene",label:"mount b comp"}),
    Object.freeze({id:"transmitter-scene",label:"transmitter"})
  ]);
  const IDS=new Set(SCENES.map(scene=>scene.id));
  const ALIASES=Object.freeze({
    "mount-a_b-full-scene":"mount-a_b-full-scene",
    "mount-a_b-comp-scene":"mount-a_b-comp-scene",
    "mount-a_a-comp-scene":"mount-a_a-comp-scene",
    "mount-a-full-scene":"mount-a-full-scene",
    "mount-b-full-scene":"mount-b-full-scene",
    "mount-a-comp-scene":"mount-a-comp-scene",
    "mount-b-comp-scene":"mount-b-comp-scene",
    "transmitter-scene":"transmitter-scene",
    "mount a":"mount-a-full-scene",
    "mount b":"mount-b-full-scene",
    "mount a comp":"mount-a-comp-scene",
    "mount b comp":"mount-b-comp-scene",
    "transmitter":"transmitter-scene",
    "ab-full":"mount-a_b-full-scene",
    "ab-compressed":"mount-a_b-comp-scene",
    "aa-compressed":"mount-a_a-comp-scene",
    "full":"mount-a_b-full-scene",
    "compressed":"mount-a_b-comp-scene",
    "duplicate-a":"mount-a_a-comp-scene"
  });

  let active=null;

  function normalise(value){
    const key=String(value||"").trim().toLowerCase();
    return ALIASES[key]||DEFAULT_SCENE;
  }

  function requested(root){
    const params=new URLSearchParams(location.search);
    const pageDefault=document.querySelector("[data-rf-scene-default]")?.dataset.rfSceneDefault;
    return normalise(root?.dataset.rfSceneRequest||params.get("scene")||pageDefault||DEFAULT_SCENE);
  }

  function graphFor(control){
    return control?.closest?.("[data-rf-scene-scope]")?.querySelector?.("[data-rf-graph]")
      || control?.closest?.(".rf-network")?.querySelector?.("[data-rf-graph]")
      || document.querySelector("[data-rf-graph]");
  }

  function syncSelectors(sceneName,{busy=false}={}){
    const selected=normalise(sceneName);
    document.querySelectorAll("[data-rf-scene-select]").forEach(control=>{
      if(IDS.has(selected))control.value=selected;
      control.disabled=busy;
      control.setAttribute("aria-busy",String(busy));
      control.dataset.rfSceneSelectorVersion=VERSION;
    });
  }

  async function build(root=document.querySelector("[data-rf-graph]"),forced){
    if(!root)return null;
    const sceneName=forced?normalise(forced):requested(root);
    root.dataset.rfBuilderVersion=VERSION;
    root.dataset.rfSceneRequest=sceneName;
    root.setAttribute("aria-busy","true");
    syncSelectors(sceneName,{busy:true});

    try{
      if(!globalThis.FieldOpsRiverScene?.build)throw new Error("river-scene.js is unavailable");
      active?.destroy?.();
      active=await globalThis.FieldOpsRiverScene.build(root,{variant:sceneName});
      root.setAttribute("aria-busy","false");
      syncSelectors(sceneName,{busy:false});
      document.dispatchEvent(new CustomEvent("fieldops:rf-scene-ready",{
        detail:{version:VERSION,scene:sceneName}
      }));
      return active;
    }catch(error){
      root.setAttribute("aria-busy","false");
      root.dataset.rfBuilder3Ready="false";
      root.dataset.rfScene="load-error";
      root.textContent="3D graph could not load.";
      syncSelectors(sceneName,{busy:false});
      console.error("FieldOps RF scene selection failed",error);
      return null;
    }
  }

  function select(sceneName,root=document.querySelector("[data-rf-graph]")){
    return build(root,sceneName);
  }

  function bindSelector(control){
    if(!control||control.dataset.rfSceneSelectorBound===VERSION)return;
    control.dataset.rfSceneSelectorBound=VERSION;
    control.addEventListener("change",()=>{
      const sceneName=normalise(control.value);
      const root=graphFor(control);
      if(root)root.dataset.rfSceneRequest=sceneName;
      select(sceneName,root);
    });
  }

  function bindSelectors(root=document){
    root.querySelectorAll?.("[data-rf-scene-select]").forEach(bindSelector);
  }

  function initAll(){
    bindSelectors();
    document.querySelectorAll("[data-rf-graph]").forEach(root=>build(root));
  }

  globalThis.FieldOpsGraphBuilder=Object.freeze({
    VERSION,DEFAULT_SCENE,SCENES,normalise,build,select,bindSelectors,initAll
  });
  globalThis.FieldOpsRFGraph=globalThis.FieldOpsGraphBuilder;

  document.addEventListener("fieldops:rf-interface-ready",()=>bindSelectors());
  document.readyState==="loading"
    ? document.addEventListener("DOMContentLoaded",initAll,{once:true})
    : initAll();
})();

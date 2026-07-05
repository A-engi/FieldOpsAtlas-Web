/* FieldOps Atlas — RF scene selector and selected-path binding
 * Version: 1.8.0-path-distance-elevation
 * Selects scenes, binds scene controls, and maps the active path endpoints to
 * the left and right mountain/transmitter pairs.
 */
(()=>{
  "use strict";

  const VERSION="1.8.0-path-distance-elevation";
  const DEFAULT_SCENE="mount-a_b-comp-scene";
  const STYLE_ID="fieldops-rf-scene-endpoint-style";
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
  let activePath=null;

  function normalise(value){
    const key=String(value||"").trim().toLowerCase();
    return ALIASES[key]||DEFAULT_SCENE;
  }

  function clean(value,fallback=""){
    const text=String(value??"").replace(/\s+/g," ").trim();
    return text||fallback;
  }

  function numberOrNull(value){
    const number=Number(value);
    return Number.isFinite(number)?number:null;
  }

  function normaliseEndpoint(value,fallback){
    const source=value&&typeof value==="object"?value:{};
    return {
      siteId:clean(source.siteId||source.id,fallback.siteId),
      name:clean(source.name||source.label,fallback.name),
      role:clean(source.role||source.siteRole,fallback.role),
      elevationM:numberOrNull(source.elevationM??source.elevation),
      lat:numberOrNull(source.lat??source.latitude),
      lng:numberOrNull(source.lng??source.lon??source.longitude)
    };
  }

  function normalisePath(value){
    const source=value&&typeof value==="object"?value:{};
    return {
      id:clean(source.id||source.pathId,"default-rf-path"),
      clusterId:clean(source.clusterId,""),
      serviceType:clean(source.serviceType||source.service,"dtt").toLowerCase(),
      distanceKm:numberOrNull(source.distanceKm),
      from:normaliseEndpoint(source.from||source.feeding,{
        siteId:"site-from",name:"Site From",role:"Source Site"
      }),
      to:normaliseEndpoint(source.to||source.receiving,{
        siteId:"site-to",name:"Site To",role:"Destination Site"
      })
    };
  }

  function selectedPath(){
    if(activePath)return activePath;
    if(globalThis.FieldOpsRFPathBuilder?.getSelectedPath){
      activePath=normalisePath(globalThis.FieldOpsRFPathBuilder.getSelectedPath());
      return activePath;
    }
    activePath=normalisePath(globalThis.ATLAS_RF_SELECTED_PATH);
    return activePath;
  }

  function requested(root){
    const params=new URLSearchParams(location.search);
    const pageDefault=document.querySelector("[data-rf-scene-default]")?.dataset.rfSceneDefault;
    return normalise(root?.dataset.rfSceneRequest||params.get("scene")||pageDefault||DEFAULT_SCENE);
  }

  function graphFor(control){
    return control?.closest?.("[data-rf-scene-scope]")?.querySelector?.("[data-rf-graph]")
      ||control?.closest?.(".rf-network")?.querySelector?.("[data-rf-graph]")
      ||document.querySelector("[data-rf-graph]");
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

  function ensureBindingStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement("style");
    style.id=STYLE_ID;
    style.textContent=`
      .rf-scene-endpoints{position:absolute;inset:0;z-index:4;pointer-events:none}
      .rf-scene-endpoint{position:absolute;top:8px;max-width:42%;padding:5px 7px;border:1px solid rgba(237,191,99,.56);border-radius:8px;background:rgba(1,14,22,.76);color:#f8ecd2;box-shadow:0 4px 10px rgba(0,0,0,.24);font:700 8px/1.12 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .rf-scene-endpoint small{display:block;margin-bottom:2px;color:rgba(255,220,150,.8);font-size:6px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
      .rf-scene-endpoint strong{display:block;overflow:hidden;text-overflow:ellipsis}
      .rf-scene-endpoint span{display:block;margin-top:3px;color:#ffe0a0;font-size:6.5px;font-weight:850}
      .rf-scene-endpoint.is-from{left:8px;text-align:left}
      .rf-scene-endpoint.is-to{right:8px;text-align:right}
      .rf-scene-distance{position:absolute;top:9px;left:50%;max-width:30%;padding:4px 7px;border:1px solid rgba(237,191,99,.56);border-radius:999px;background:rgba(1,14,22,.82);color:#ffe0a0;box-shadow:0 4px 10px rgba(0,0,0,.24);font:850 7px/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;white-space:nowrap;transform:translateX(-50%)}
    `;
    document.head.appendChild(style);
  }

  function elevationText(value){
    const number=numberOrNull(value);
    return number===null?"Elevation loading…":`Elevation ${Math.round(number)} m`;
  }

  function distanceText(value){
    const number=numberOrNull(value);
    return number===null?"Distance —":`${number.toFixed(number<10?2:1)} km`;
  }

  function endpointLabel(endpoint,direction){
    const label=document.createElement("span");
    label.className=`rf-scene-endpoint is-${direction}`;
    label.dataset.rfSceneEndpoint=direction;
    label.dataset.rfSiteId=endpoint.siteId;
    const small=document.createElement("small");
    small.textContent=direction==="from"?"From · left":"To · right";
    const strong=document.createElement("strong");
    strong.textContent=endpoint.name;
    const elevation=document.createElement("span");
    elevation.textContent=elevationText(endpoint.elevationM);
    label.append(small,strong,elevation);
    return label;
  }

  function distanceLabel(path){
    const label=document.createElement("span");
    label.className="rf-scene-distance";
    label.dataset.rfSceneDistance="true";
    label.textContent=distanceText(path.distanceKm);
    return label;
  }

  function pairScene(sceneName){
    return ["mount-a_b-full-scene","mount-a_b-comp-scene","mount-a_a-comp-scene"].includes(sceneName);
  }

  function renderPathBinding(root,pathValue,sceneName=requested(root)){
    if(!root)return null;
    const path=normalisePath(pathValue||selectedPath());
    activePath=path;
    ensureBindingStyle();
    root.querySelector("[data-rf-scene-endpoints]")?.remove();
    root.dataset.rfPathId=path.id;
    root.dataset.rfPathClusterId=path.clusterId;
    root.dataset.rfPathService=path.serviceType;
    root.dataset.rfFromSiteId=path.from.siteId;
    root.dataset.rfToSiteId=path.to.siteId;
    root.setAttribute("aria-label",`RF path scene from ${path.from.name} to ${path.to.name}`);

    const layer=document.createElement("div");
    layer.className="rf-scene-endpoints";
    layer.dataset.rfSceneEndpoints="true";
    layer.dataset.rfPathId=path.id;
    layer.appendChild(endpointLabel(path.from,"from"));
    if(pairScene(sceneName)){
      layer.appendChild(distanceLabel(path));
      layer.appendChild(endpointLabel(path.to,"to"));
    }
    root.appendChild(layer);
    return path;
  }

  async function build(root=document.querySelector("[data-rf-graph]"),forced,pathValue){
    if(!root)return null;
    const sceneName=forced?normalise(forced):requested(root);
    const path=normalisePath(pathValue||selectedPath());
    root.dataset.rfBuilderVersion=VERSION;
    root.dataset.rfSceneRequest=sceneName;
    root.setAttribute("aria-busy","true");
    syncSelectors(sceneName,{busy:true});

    try{
      if(!globalThis.FieldOpsRiverScene?.build)throw new Error("river-scene.js is unavailable");
      active?.destroy?.();
      active=await globalThis.FieldOpsRiverScene.build(root,{variant:sceneName,path});
      root.setAttribute("aria-busy","false");
      renderPathBinding(root,path,sceneName);
      syncSelectors(sceneName,{busy:false});
      document.dispatchEvent(new CustomEvent("fieldops:rf-scene-ready",{
        detail:{version:VERSION,scene:sceneName,pathId:path.id,from:path.from,to:path.to}
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
    return build(root,sceneName,selectedPath());
  }

  function bindPath(pathValue,root=document.querySelector("[data-rf-graph]")){
    activePath=normalisePath(pathValue);
    if(root&&root.querySelector("canvas"))renderPathBinding(root,activePath,requested(root));
    return activePath;
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
    selectedPath();
    document.querySelectorAll("[data-rf-graph]").forEach(root=>build(root));
  }

  globalThis.FieldOpsGraphBuilder=Object.freeze({
    VERSION,DEFAULT_SCENE,SCENES,normalise,build,select,bindPath,bindSelectors,initAll
  });
  globalThis.FieldOpsRFGraph=globalThis.FieldOpsGraphBuilder;

  document.addEventListener("fieldops:rf-interface-ready",()=>bindSelectors());
  document.addEventListener("fieldops:rf-path-details-rendered",event=>{
    if(event.detail?.selectedPath)bindPath(event.detail.selectedPath);
  });
  document.addEventListener("fieldops:rf-selected-path-change",event=>{
    if(event.detail?.selectedPath)bindPath(event.detail.selectedPath);
  });

  document.readyState==="loading"
    ?document.addEventListener("DOMContentLoaded",initAll,{once:true})
    :initAll();
})();

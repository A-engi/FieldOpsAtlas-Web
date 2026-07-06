/* FieldOps Atlas — RF scene selector and selected-path binding
 * Version: 1.9.0-synthetic-elevation-tags
 * Selects scenes, binds scene controls, maps the active path endpoints to the
 * left and right mountain/transmitter pairs, and supplies stable demo elevations.
 */
(()=>{
  "use strict";

  const VERSION="1.9.0-synthetic-elevation-tags";
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
  let scenePathSignature="";
  let syncingBuilderElevations=false;

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

  function hashText(value){
    let hash=2166136261;
    const text=String(value||"");
    for(let index=0;index<text.length;index+=1){
      hash^=text.charCodeAt(index);
      hash=Math.imul(hash,16777619);
    }
    return hash>>>0;
  }

  function syntheticElevation(source,siteId,name,lat,lng){
    const supplied=numberOrNull(source?.elevationM??source?.elevation);
    const suppliedSource=clean(source?.elevationSource,"").toLowerCase();
    const authoritative=/^(manual|surveyed|authoritative|site-data)$/.test(suppliedSource);
    if(authoritative&&supplied!==null)return Math.round(supplied);

    const words=clean(name,siteId).toLowerCase();
    let base=115;
    let span=285;
    if(/ridge|hill|moor|shelf|peak|summit|stone/.test(words)){
      base=265;
      span=255;
    }else if(/coast|shore|harbour|cove|river|pool|valley|hollow|cave/.test(words)){
      base=45;
      span=220;
    }
    const coordinateKey=[
      Number.isFinite(lat)?lat.toFixed(5):"",
      Number.isFinite(lng)?lng.toFixed(5):""
    ].join(",");
    return base+(hashText(`${siteId}|${words}|${coordinateKey}`)%span);
  }

  function normaliseEndpoint(value,fallback){
    const source=value&&typeof value==="object"?value:{};
    const siteId=clean(source.siteId||source.id,fallback.siteId);
    const name=clean(source.name||source.label,fallback.name);
    const role=clean(source.role||source.siteRole,fallback.role);
    const lat=numberOrNull(source.lat??source.latitude);
    const lng=numberOrNull(source.lng??source.lon??source.longitude);
    const suppliedSource=clean(source.elevationSource,"").toLowerCase();
    const elevationM=syntheticElevation(source,siteId,name,lat,lng);
    const elevationSource=/^(manual|surveyed|authoritative|site-data)$/.test(suppliedSource)
      ? suppliedSource
      :"synthetic-demo";
    return {
      siteId,name,role,elevationM,elevationSource,lat,lng,
      elevationTagLabel:"ELEV",
      elevationTagText:`${Math.round(elevationM)} M`
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

  function clone(value){
    return JSON.parse(JSON.stringify(value||{}));
  }

  function builderEndpoint(value,direction){
    if(direction==="from")return value?.from||value?.feeding||{};
    return value?.to||value?.receiving||{};
  }

  function needsElevationSync(rawEndpoint,normalisedEndpoint){
    return numberOrNull(rawEndpoint?.elevationM??rawEndpoint?.elevation)!==normalisedEndpoint.elevationM
      ||clean(rawEndpoint?.elevationSource,"").toLowerCase()!==normalisedEndpoint.elevationSource;
  }

  function syncElevationsToPathBuilder(rawPath,normalisedPath){
    const builder=globalThis.FieldOpsRFPathBuilder;
    if(syncingBuilderElevations||!builder?.setSelectedPath||!rawPath)return;
    const rawFrom=builderEndpoint(rawPath,"from");
    const rawTo=builderEndpoint(rawPath,"to");
    if(!needsElevationSync(rawFrom,normalisedPath.from)&&!needsElevationSync(rawTo,normalisedPath.to))return;

    const next=clone(rawPath);
    next.from={...(next.from||next.feeding||{}),elevationM:normalisedPath.from.elevationM,elevationSource:normalisedPath.from.elevationSource};
    next.to={...(next.to||next.receiving||{}),elevationM:normalisedPath.to.elevationM,elevationSource:normalisedPath.to.elevationSource};
    delete next.feeding;
    delete next.receiving;

    syncingBuilderElevations=true;
    try{
      builder.setSelectedPath(next,{persist:true,render:true});
    }finally{
      syncingBuilderElevations=false;
    }
  }

  function pathSignature(path){
    return [
      path.id,path.from.siteId,path.from.elevationM,path.to.siteId,path.to.elevationM
    ].join("|");
  }

  function selectedPath(){
    if(activePath)return activePath;
    const raw=globalThis.FieldOpsRFPathBuilder?.getSelectedPath
      ?globalThis.FieldOpsRFPathBuilder.getSelectedPath()
      :globalThis.ATLAS_RF_SELECTED_PATH;
    activePath=normalisePath(raw);
    syncElevationsToPathBuilder(raw,activePath);
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
    return number===null?"Elevation unavailable":`Elevation ${Math.round(number)} m`;
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
    const signature=pathSignature(path);
    scenePathSignature=signature;
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
      if(scenePathSignature===signature)scenePathSignature="";
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
    const path=normalisePath(pathValue);
    syncElevationsToPathBuilder(pathValue,path);
    activePath=path;
    if(root&&root.querySelector("canvas")){
      renderPathBinding(root,activePath,requested(root));
      const signature=pathSignature(activePath);
      if(signature!==scenePathSignature)build(root,requested(root),activePath);
    }
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

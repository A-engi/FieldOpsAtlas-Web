/* FieldOps Atlas — RF 3D scene builder
 * File: FieldOpsAtlas/Features/RF/graph-builder.js
 * Version: 1.2.0-mountain-scenes
 */
(() => {
  "use strict";
  const VERSION = "1.2.0-mountain-scenes";
  const BASE = "./3D Graphics/";
  const SCENES = {
    A: { id:"mountain-a", label:"Mountain A", files:{ compressed:"mountain-a-compressed.js", full:"mountain-a-full.js" } },
    B: { id:"mountain-b", label:"Mountain B", files:{ compressed:"mountain-b-compressed.js", full:"mountain-b-full.js" } }
  };
  let active = null;

  const choice = root => {
    const params = new URLSearchParams(location.search);
    const requested = String(root?.dataset.mountain || params.get("mountain") || "A").toUpperCase();
    const mountain = requested === "B" || requested === "2" ? "B" : "A";
    const requestedQuality = String(root?.dataset.mountainQuality || params.get("quality") || "compressed").toLowerCase();
    const quality = ["full","uncompressed","lossless","3mb"].includes(requestedQuality) ? "full" : "compressed";
    return { mountain, quality };
  };

  const loadScript = file => new Promise((resolve,reject) => {
    const existing = document.querySelector(`script[data-fieldops-3d-asset="${file}"]`);
    if (existing?.dataset.loaded === "true") return resolve();
    if (existing) { existing.addEventListener("load",resolve,{once:true}); existing.addEventListener("error",reject,{once:true}); return; }
    const script=document.createElement("script"); script.src=new URL(BASE+file,location.href).href; script.defer=true; script.dataset.fieldops3dAsset=file;
    script.addEventListener("load",()=>{script.dataset.loaded="true";resolve();},{once:true}); script.addEventListener("error",()=>reject(new Error(`Unable to load ${file}`)),{once:true}); document.head.appendChild(script);
  });

  async function build(root=document.querySelector("[data-rf-graph]")) {
    if (!root) return null;
    const { mountain, quality } = choice(root);
    const definition = SCENES[mountain];
    const file = definition.files[quality];
    const assetId = `${definition.id}-${quality}`;
    root.dataset.mountain = mountain;
    root.dataset.mountainQuality = quality;
    root.dataset.rfBuilderVersion = VERSION;
    root.setAttribute("aria-busy","true");
    try {
      await loadScript(file);
      if (!globalThis.FieldOps3DAssets?.has(assetId)) throw new Error(`Asset did not register: ${assetId}`);
      active?.destroy?.();
      active = globalThis.FieldOps3DRenderer.create(root, {
        id:`${definition.id}-${quality}-scene`, label:`${definition.label} 3D scene`, background:"#01090e",
        objects:[{ asset:assetId, position:[0,0,0], rotation:[0,0,0], scale:[1,1,1] }]
      });
      root.setAttribute("aria-busy","false");
      return active;
    } catch (error) {
      root.setAttribute("aria-busy","false");
      root.dataset.rfBuilder3Ready="false";
      root.textContent="3D graph could not load.";
      console.error("FieldOps RF 3D scene failed",error);
      return null;
    }
  }

  function initAll() { document.querySelectorAll("[data-rf-graph]").forEach(root=>build(root)); }
  globalThis.FieldOpsGraphBuilder = { VERSION, SCENES, build, initAll };
  globalThis.FieldOpsRFGraph = globalThis.FieldOpsGraphBuilder;
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded",initAll,{once:true}) : initAll();
})();

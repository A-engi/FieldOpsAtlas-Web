/* FieldOps Atlas — RF scene selector
 * Version: 1.5.2-builder-loads-scene
 * Selects and loads the scene. Scene assembly remains inside river-scene.js.
 */
(() => {
  "use strict";

  const VERSION = "1.5.2-builder-loads-scene";
  const DEFAULT_SCENE = "mount-a_b-comp-scene";
  const SCENE_FILE = "./river-scene.js";
  const FALLBACK_FILE = "./3D Graphics/mountain-a-compressed.js";

  const ALIASES = Object.freeze({
    "mount-a_b-full-scene": "mount-a_b-full-scene",
    "mount-a_b-comp-scene": "mount-a_b-comp-scene",
    "mount-a_a-comp-scene": "mount-a_a-comp-scene",
    "ab-full": "mount-a_b-full-scene",
    "ab-compressed": "mount-a_b-comp-scene",
    "aa-compressed": "mount-a_a-comp-scene",
    "full": "mount-a_b-full-scene",
    "compressed": "mount-a_b-comp-scene",
    "duplicate-a": "mount-a_a-comp-scene"
  });

  const scriptLoads = new Map();
  let active = null;

  function normalise(value) {
    return ALIASES[String(value || "").trim().toLowerCase()] || DEFAULT_SCENE;
  }

  function requested(root) {
    const params = new URLSearchParams(location.search);
    return normalise(root?.dataset.rfSceneRequest || params.get("scene") || DEFAULT_SCENE);
  }

  function loadScript(file, marker) {
    const url = new URL(file, location.href).href;
    if (scriptLoads.has(url)) return scriptLoads.get(url);

    const promise = new Promise((resolve, reject) => {
      const existing = [...document.scripts].find(script => script.src === url);
      if (existing?.dataset.loaded === "true") {
        resolve(existing);
        return;
      }
      if (existing) {
        existing.addEventListener("load", () => resolve(existing), { once: true });
        existing.addEventListener("error", () => reject(new Error(`Unable to load ${file}`)), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      script.dataset[marker] = file;
      script.addEventListener("load", () => {
        script.dataset.loaded = "true";
        resolve(script);
      }, { once: true });
      script.addEventListener("error", () => reject(new Error(`Unable to load ${file}`)), { once: true });
      document.head.appendChild(script);
    });

    scriptLoads.set(url, promise);
    return promise;
  }

  async function loadSceneOwner() {
    if (globalThis.FieldOpsRiverScene?.build) return globalThis.FieldOpsRiverScene;
    await loadScript(SCENE_FILE, "fieldopsSceneFile");
    if (!globalThis.FieldOpsRiverScene?.build) {
      throw new Error("river-scene.js loaded without registering FieldOpsRiverScene");
    }
    return globalThis.FieldOpsRiverScene;
  }

  async function restoreMountainA(root, originalError) {
    try {
      await loadScript(FALLBACK_FILE, "fieldopsFallbackFile");
      const fallback = root._rfBuilder3 || globalThis.FieldOpsRFBuilder3?.init?.(root) || null;
      if (!fallback) throw new Error("Mountain A fallback did not initialise");
      active = fallback;
      root.setAttribute("aria-busy", "false");
      root.dataset.rfScene = "mountain-a-fallback";
      root.dataset.rfSceneError = String(originalError?.message || originalError || "Scene load failed");
      return fallback;
    } catch (fallbackError) {
      root.setAttribute("aria-busy", "false");
      root.dataset.rfBuilder3Ready = "false";
      root.dataset.rfScene = "load-error";
      console.error("FieldOps RF scene and fallback both failed", originalError, fallbackError);
      return null;
    }
  }

  async function build(root = document.querySelector("[data-rf-graph]"), forced) {
    if (!root) return null;

    const sceneName = forced ? normalise(forced) : requested(root);
    root.dataset.rfBuilderVersion = VERSION;
    root.dataset.rfSceneRequest = sceneName;
    root.setAttribute("aria-busy", "true");

    try {
      const owner = await loadSceneOwner();
      const next = await owner.build(root, { variant: sceneName });

      if (active && active !== next) active.destroy?.();
      active = next;

      delete root.dataset.rfSceneError;
      document.dispatchEvent(new CustomEvent("fieldops:rf-scene-ready", {
        detail: { version: VERSION, scene: sceneName }
      }));
      return active;
    } catch (error) {
      console.error("FieldOps RF scene selection failed", error);
      return restoreMountainA(root, error);
    }
  }

  function select(sceneName, root = document.querySelector("[data-rf-graph]")) {
    return build(root, sceneName);
  }

  function initAll() {
    document.querySelectorAll("[data-rf-graph]").forEach(root => build(root));
  }

  globalThis.FieldOpsGraphBuilder = Object.freeze({
    VERSION,
    DEFAULT_SCENE,
    build,
    select,
    initAll
  });
  globalThis.FieldOpsRFGraph = globalThis.FieldOpsGraphBuilder;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll, { once: true });
  } else {
    initAll();
  }
})();

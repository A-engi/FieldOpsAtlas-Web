/* ========================================================================== 
   FieldOps Atlas RF graph adapter
   File: FieldOpsAtlas/Features/RF/rf-graph-builder-3.js
   Version: 1.2.2-quarter-dock-adapter

   This file is intentionally small. The Three renderer, mirrored mountain and
   fixed docking anchor live in 3d-render.js.
   ========================================================================== */
(() => {
  "use strict";

  const VERSION = "1.2.2-quarter-dock-adapter";
  const MODE = "three-quarter-mirror-dock";
  const MOUNT_SELECTOR = "[data-rf-graph]";
  const RENDERED_EVENT = "fieldops:rf-graph-rendered";
  const SELECTED_PATH_ID = "site-1-to-site-2";
  const instances = new Map();

  function rendererApi() {
    const api = window.FieldOpsRF3DRenderer;
    if (!api) {
      throw new Error("3d-render.js did not load.");
    }
    return api;
  }

  function defaultMount() {
    return document.querySelector(MOUNT_SELECTOR);
  }

  function requireMount(element = defaultMount()) {
    if (!(element instanceof Element)) {
      throw new Error("No RF graph mount is available.");
    }
    return element;
  }

  function showFallback(element, error) {
    console.error("FieldOps RF renderer failed:", error);
    const status = document.createElement("div");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.textContent = "RF renderer unavailable";
    status.style.cssText = [
      "display:grid",
      "place-items:center",
      "width:100%",
      "height:100%",
      "min-height:220px",
      "background:#01090e",
      "color:rgba(201,251,255,.76)",
      "font:700 11px/1.2 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif"
    ].join(";");
    element.replaceChildren(status);
    element.dataset.rfGraphLoaded = "fallback";
    element.dataset.rfGraphVersion = VERSION;
    element.dataset.rfGraphMode = "fallback";
  }

  async function init(element, options = {}) {
    if (!(element instanceof Element)) return null;

    instances.get(element)?.destroy?.();
    element.dataset.rfGraphInit = VERSION;

    try {
      const instance = await rendererApi().mount(element, options);
      instances.set(element, instance);
      element.dataset.rfGraphLoaded = "true";
      element.dataset.rfGraphVersion = VERSION;
      element.dataset.rfGraphMode = MODE;
      element.dispatchEvent(new CustomEvent(RENDERED_EVENT, {
        bubbles: true,
        detail: {
          version: VERSION,
          rendererVersion: rendererApi().VERSION,
          selectedPathId: SELECTED_PATH_ID,
          mode: MODE,
          quarterCount: 4,
          dockingSurface: true
        }
      }));
      return instance;
    } catch (error) {
      showFallback(element, error);
      return null;
    }
  }

  function initAll(root = document, options = {}) {
    return Promise.all(
      [...root.querySelectorAll(MOUNT_SELECTOR)].map((element) => init(element, options))
    );
  }

  async function ensureInstance(element) {
    const mount = requireMount(element);
    if (!instances.has(mount)) {
      await init(mount);
    }
    return mount;
  }

  async function setImages(images, element = defaultMount()) {
    const mount = await ensureInstance(element);
    await rendererApi().setImages(mount, images);
  }

  async function getDockAnchor(element = defaultMount()) {
    const mount = await ensureInstance(element);
    return rendererApi().getDockAnchor(mount);
  }

  async function attachObject(object3D, options = {}, element = defaultMount()) {
    const mount = await ensureInstance(element);
    return rendererApi().attachObject(mount, object3D, options);
  }

  async function detachObject(object3D, element = defaultMount()) {
    const mount = await ensureInstance(element);
    return rendererApi().detachObject(mount, object3D);
  }

  async function clearDock(element = defaultMount()) {
    const mount = await ensureInstance(element);
    rendererApi().clearDock(mount);
  }

  async function invalidate(element = defaultMount()) {
    const mount = await ensureInstance(element);
    rendererApi().invalidate(mount);
  }

  function destroy(element) {
    if (!(element instanceof Element)) return;
    rendererApi().destroy(element);
    instances.delete(element);
    delete element.dataset.rfGraphInit;
    delete element.dataset.rfGraphLoaded;
    delete element.dataset.rfGraphVersion;
    delete element.dataset.rfGraphMode;
  }

  function destroyAll() {
    for (const element of [...instances.keys()]) destroy(element);
  }

  window.FieldOpsRFGraph = Object.freeze({
    VERSION,
    MODE,
    init,
    initAll,
    setImages,
    getDockAnchor,
    attachObject,
    detachObject,
    clearDock,
    invalidate,
    destroy,
    destroyAll,
    renderMeshes: 5
  });

  const start = () => initAll().catch((error) => console.error("RF graph init failed:", error));
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();

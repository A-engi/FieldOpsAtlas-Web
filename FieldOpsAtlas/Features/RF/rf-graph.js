/* ==========================================================================
   FieldOps Atlas RF graph renderer
   File: FieldOpsAtlas/Features/RF/rf-graph.js
   Version: 1.1.92-mountain-turntable

   Purpose:
   - Keep the existing RF graph mount contract used by rf-interface.js.
   - Replace the dynamic node/link graph with the interactive mountain TX SVG.
   - Keep the RF page structure unchanged and only swap the graph content.
   - Remove the old graph key when the turntable scene is mounted.
   ========================================================================== */
(() => {
  "use strict";

  const VERSION = "1.1.92-mountain-turntable";
  const MOUNT_SELECTOR = "[data-rf-graph]";
  const MAP_PAPER_SELECTOR = ".rf-map-paper";
  const LEGACY_KEY_SELECTOR = ".rf-graph-key";
  const SVG_FILE = "./mountain-w-tx-turnable.svg?v=1.1.1-mountain-turntable";
  const RENDERED_EVENT = "fieldops:rf-graph-rendered";
  const SELECTED_PATH_ID = "site-1-to-site-2";

  function removeLegacyKey(mount) {
    const mapPaper = mount.closest(MAP_PAPER_SELECTOR);
    if (!mapPaper) {
      return;
    }

    mapPaper
      .querySelectorAll(`:scope > ${LEGACY_KEY_SELECTOR}`)
      .forEach((node) => node.remove());

    mapPaper.dataset.rfGraphKeyInit = "false";
  }

  function buildSceneObject(mount) {
    const object = document.createElement("object");
    object.type = "image/svg+xml";
    object.data = SVG_FILE;
    object.className = "rf-turntable-scene-object";
    object.setAttribute(
      "aria-label",
      mount.getAttribute("aria-label") || "RF mountain transmitter turntable"
    );
    object.setAttribute("tabindex", "-1");
    object.style.display = "block";
    object.style.width = "100%";
    object.style.height = "100%";
    object.style.border = "0";
    object.style.background = "transparent";

    return object;
  }

  function buildFallbackImage(mount) {
    const image = document.createElement("img");
    image.src = SVG_FILE;
    image.alt = mount.getAttribute("aria-label") || "RF mountain transmitter turntable";
    image.className = "rf-turntable-scene-image";
    image.decoding = "async";
    image.loading = "eager";
    image.style.display = "block";
    image.style.width = "100%";
    image.style.height = "100%";
    image.style.objectFit = "contain";
    image.style.objectPosition = "center center";

    return image;
  }

  function renderMount(mount) {
    if (!mount) {
      return;
    }

    removeLegacyKey(mount);

    const frame = document.createElement("div");
    frame.className = "rf-turntable-scene-frame";
    frame.style.width = "100%";
    frame.style.height = "100%";
    frame.style.display = "grid";
    frame.style.placeItems = "stretch";
    frame.style.overflow = "hidden";
    frame.style.background = "transparent";

    const sceneObject = buildSceneObject(mount);
    sceneObject.addEventListener("error", () => {
      frame.replaceChildren(buildFallbackImage(mount));
    });

    frame.appendChild(sceneObject);
    mount.replaceChildren(frame);
    mount.dataset.rfGraphLoaded = "true";
    mount.dataset.rfGraphVersion = VERSION;
    mount.dataset.rfGraphMode = "mountain-turntable";

    mount.dispatchEvent(
      new CustomEvent(RENDERED_EVENT, {
        bubbles: true,
        detail: {
          version: VERSION,
          selectedPathId: SELECTED_PATH_ID,
          mode: "mountain-turntable"
        }
      })
    );
  }

  function initMount(mount) {
    if (!mount || mount.dataset.rfGraphInit === "true") {
      return;
    }

    mount.dataset.rfGraphInit = "true";
    renderMount(mount);
  }

  function initAll(root = document) {
    root.querySelectorAll(MOUNT_SELECTOR).forEach(initMount);
  }

  window.FieldOpsRFGraph = {
    VERSION,
    init: initMount,
    initAll
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initAll(), { once: true });
  } else {
    initAll();
  }
})();

/* Destination: FieldOpsAtlas/Features/RF/rf-graph.js */
/* End of file: FieldOpsAtlas/Features/RF/rf-graph.js */

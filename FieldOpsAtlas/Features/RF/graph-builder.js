/* FieldOps Atlas — RF 3D scene builder
 * File: FieldOpsAtlas/Features/RF/graph-builder.js
 * Version: 1.3.1-river-default
 */
(() => {
  "use strict";

  const VERSION = "1.3.1-river-default";
  const BASE = "./3D Graphics/";

  const SCENES = {
    A: {
      id: "mountain-a",
      label: "Mountain A",
      files: {
        compressed: "mountain-a-compressed.js",
        full: "mountain-a-full.js"
      },
      assetId: quality => `mountain-a-${quality}`
    },
    B: {
      id: "mountain-b",
      label: "Mountain B",
      files: {
        compressed: "mountain-b-compressed.js",
        full: "mountain-b-full.js"
      },
      assetId: quality => `mountain-b-${quality}`
    },
    RIVER: {
      id: "river-floor",
      label: "River and mountain floor",
      files: {
        compressed: "river-scene.js",
        full: "river-scene.js"
      },
      assetId: "river-floor",
      registeredOnly: true
    }
  };

  let active = null;

  function normaliseObject(value) {
    const requested = String(value || "A").trim().toUpperCase();

    if (["B", "2", "MOUNTAIN-B", "MOUNTAIN B"].includes(requested)) {
      return "B";
    }

    if (["R", "RIVER", "WATER", "RIVER-FLOOR", "RIVER FLOOR"].includes(requested)) {
      return "RIVER";
    }

    return "A";
  }

  function choice(root) {
    const params = new URLSearchParams(location.search);
    const object = normaliseObject(
      root?.dataset.rfObject ||
      params.get("scene") ||
      root?.dataset.mountain ||
      params.get("mountain") ||
      "RIVER"
    );

    const requestedQuality = String(
      root?.dataset.mountainQuality ||
      root?.dataset.rfQuality ||
      params.get("quality") ||
      "compressed"
    ).toLowerCase();

    const quality = ["full", "uncompressed", "lossless", "3mb"].includes(requestedQuality)
      ? "full"
      : "compressed";

    return { object, quality };
  }

  function loadScript(file) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[data-fieldops-3d-asset="${file}"]`);

      if (existing?.dataset.loaded === "true") {
        resolve(existing);
        return;
      }

      if (existing) {
        existing.addEventListener("load", () => resolve(existing), { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = new URL(BASE + file, location.href).href;
      script.async = true;
      script.dataset.fieldops3dAsset = file;
      script.addEventListener("load", () => {
        script.dataset.loaded = "true";
        resolve(script);
      }, { once: true });
      script.addEventListener("error", () => {
        reject(new Error(`Unable to load ${file}`));
      }, { once: true });
      document.head.appendChild(script);
    });
  }

  function assetIdFor(definition, quality) {
    return typeof definition.assetId === "function"
      ? definition.assetId(quality)
      : definition.assetId || `${definition.id}-${quality}`;
  }

  function registeredAssetAvailable(assetId) {
    return Boolean(globalThis.FieldOps3DAssets?.has?.(assetId));
  }

  function clearActive(root) {
    const standalone = root._rfBuilder3 || null;

    if (standalone) {
      standalone.destroy?.();
    }

    if (active && active !== standalone) {
      active.destroy?.();
    }

    active = null;
  }

  function createRegisteredScene(root, definition, quality, assetId) {
    if (!globalThis.FieldOps3DRenderer?.create) {
      throw new Error("Reusable 3D renderer is unavailable");
    }

    clearActive(root);

    return globalThis.FieldOps3DRenderer.create(root, {
      id: `${definition.id}-${quality}-scene`,
      label: `${definition.label} 3D scene`,
      background: "#01090e",
      objects: [
        {
          asset: assetId,
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1]
        }
      ]
    });
  }

  function adoptStandaloneScene(root, definition, quality) {
    if (!globalThis.FieldOpsRFBuilder3?.init) {
      throw new Error("Loaded mountain file did not initialise or register a scene");
    }

    clearActive(root);
    const instance = globalThis.FieldOpsRFBuilder3.init(root);

    if (!instance) {
      throw new Error("Loaded mountain file did not initialise a standalone scene");
    }

    root.dataset.rfBuilder3Ready = root.dataset.rfBuilder3Ready || "true";
    root.dataset.rfScene = `${definition.id}-${quality}-scene`;
    return instance;
  }

  async function build(root = document.querySelector("[data-rf-graph]")) {
    if (!root) return null;

    const { object, quality } = choice(root);
    const definition = SCENES[object];
    const file = definition.files[quality];
    const assetId = assetIdFor(definition, quality);

    root.dataset.rfObject = object;
    root.dataset.rfQuality = quality;
    root.dataset.rfBuilderVersion = VERSION;

    if (object === "A" || object === "B") {
      root.dataset.mountain = object;
      root.dataset.mountainQuality = quality;
    } else {
      delete root.dataset.mountain;
      delete root.dataset.mountainQuality;
    }

    root.setAttribute("aria-busy", "true");

    try {
      await loadScript(file);

      const registered = registeredAssetAvailable(assetId);

      if (!registered && definition.registeredOnly) {
        throw new Error(`3D asset did not register: ${assetId}`);
      }

      active = registered
        ? createRegisteredScene(root, definition, quality, assetId)
        : adoptStandaloneScene(root, definition, quality);

      root.setAttribute("aria-busy", "false");
      root.dataset.rfScene = `${definition.id}-${quality}-scene`;

      document.dispatchEvent(new CustomEvent("fieldops:rf-scene-ready", {
        detail: {
          version: VERSION,
          object,
          quality,
          scene: root.dataset.rfScene,
          source: registered ? "registered-asset" : "standalone-compat"
        }
      }));

      return active;
    } catch (error) {
      root.setAttribute("aria-busy", "false");
      root.dataset.rfBuilder3Ready = "false";
      root.dataset.rfScene = "load-error";
      root.textContent = "3D graph could not load.";
      console.error("FieldOps RF 3D scene failed", error);
      return null;
    }
  }

  function select(
    object,
    quality = "compressed",
    root = document.querySelector("[data-rf-graph]")
  ) {
    if (!root) return Promise.resolve(null);

    root.dataset.rfObject = normaliseObject(object);
    root.dataset.rfQuality = quality;
    return build(root);
  }

  function initAll() {
    document.querySelectorAll("[data-rf-graph]").forEach(root => {
      build(root);
    });
  }

  globalThis.FieldOpsGraphBuilder = {
    VERSION,
    SCENES,
    build,
    select,
    initAll
  };
  globalThis.FieldOpsRFGraph = globalThis.FieldOpsGraphBuilder;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll, { once: true });
  } else {
    initAll();
  }
})();

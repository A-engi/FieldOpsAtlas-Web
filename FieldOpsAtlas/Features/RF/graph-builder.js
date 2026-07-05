/* FieldOps Atlas — RF 3D scene builder
 * File: FieldOpsAtlas/Features/RF/graph-builder.js
 * Version: 1.2.1-scene-compat
 */
(() => {
  "use strict";

  const VERSION = "1.2.1-scene-compat";
  const BASE = "./3D Graphics/";
  const SCENES = {
    A: {
      id: "mountain-a",
      label: "Mountain A",
      files: {
        compressed: "mountain-a-compressed.js",
        full: "mountain-a-full.js"
      }
    },
    B: {
      id: "mountain-b",
      label: "Mountain B",
      files: {
        compressed: "mountain-b-compressed.js",
        full: "mountain-b-full.js"
      }
    }
  };

  let active = null;

  function choice(root) {
    const params = new URLSearchParams(location.search);
    const requestedMountain = String(
      root?.dataset.mountain || params.get("mountain") || "A"
    ).toUpperCase();
    const mountain = requestedMountain === "B" || requestedMountain === "2" ? "B" : "A";

    const requestedQuality = String(
      root?.dataset.mountainQuality || params.get("quality") || "compressed"
    ).toLowerCase();
    const quality = ["full", "uncompressed", "lossless", "3mb"].includes(requestedQuality)
      ? "full"
      : "compressed";

    return { mountain, quality };
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

  function registeredAssetAvailable(assetId) {
    return Boolean(globalThis.FieldOps3DAssets?.has?.(assetId));
  }

  function createRegisteredScene(root, definition, quality, assetId) {
    if (!globalThis.FieldOps3DRenderer?.create) {
      throw new Error("Reusable 3D renderer is unavailable");
    }

    root._rfBuilder3?.destroy?.();
    if (active && active !== root._rfBuilder3) active.destroy?.();

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
    let instance = root._rfBuilder3 || null;

    if (!instance && globalThis.FieldOpsRFBuilder3?.init) {
      instance = globalThis.FieldOpsRFBuilder3.init(root);
    }

    if (!instance) {
      throw new Error("Loaded mountain file did not initialise or register a scene");
    }

    if (active && active !== instance) active.destroy?.();

    root.dataset.rfBuilder3Ready = root.dataset.rfBuilder3Ready || "true";
    root.dataset.rfScene = `${definition.id}-${quality}-scene`;
    return instance;
  }

  async function build(root = document.querySelector("[data-rf-graph]")) {
    if (!root) return null;

    const { mountain, quality } = choice(root);
    const definition = SCENES[mountain];
    const file = definition.files[quality];
    const assetId = `${definition.id}-${quality}`;

    root.dataset.mountain = mountain;
    root.dataset.mountainQuality = quality;
    root.dataset.rfBuilderVersion = VERSION;
    root.setAttribute("aria-busy", "true");

    try {
      await loadScript(file);

      active = registeredAssetAvailable(assetId)
        ? createRegisteredScene(root, definition, quality, assetId)
        : adoptStandaloneScene(root, definition, quality);

      root.setAttribute("aria-busy", "false");
      root.dataset.rfScene = `${definition.id}-${quality}-scene`;

      document.dispatchEvent(new CustomEvent("fieldops:rf-scene-ready", {
        detail: {
          version: VERSION,
          mountain,
          quality,
          scene: root.dataset.rfScene,
          source: registeredAssetAvailable(assetId) ? "registered-asset" : "standalone-compat"
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

  function initAll() {
    document.querySelectorAll("[data-rf-graph]").forEach((root) => {
      build(root);
    });
  }

  globalThis.FieldOpsGraphBuilder = { VERSION, SCENES, build, initAll };
  globalThis.FieldOpsRFGraph = globalThis.FieldOpsGraphBuilder;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll, { once: true });
  } else {
    initAll();
  }
})();

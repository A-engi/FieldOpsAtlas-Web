/* FieldOps Atlas — Builder 2 repeated background wall
 * File: FieldOpsAtlas/Features/RF/3D Graphics/background-mountains.js
 * Version: 2.3.0-builder2-repeated-background
 *
 * Preserves the approved river scene, transmitters, and foreground geometry,
 * keeps the dark floor extension and square-edge camera profile, and replaces
 * the old scene-owned mountain wall relief with a repeated background layer
 * derived from the RF Builder 2 front-facing preview.
 */
(() => {
  "use strict";

  const VERSION = "2.3.0-builder2-repeated-background";
  const FLOOR_ASSET = "rf-box-floor-extension";
  const TARGETS = new Set(["mount-a_b-comp-scene", "mount-a_a-comp-scene"]);
  const STYLE_ID = "fieldops-rf-builder2-repeated-background";
  const BACKGROUND_CLASS = "rf-map-builder2-background";
  const PREVIEW_TILE = "data:image/webp;base64,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";

  const WALL_HALF = 31.5;

  let assetsRegistered = false;

  function buildFloorAsset() {
    const half = WALL_HALF;
    const positions = new Float32Array([
      -half, 0, -half,  half, 0, -half,  half, 0, half,
      -half, 0, -half,  half, 0, half, -half, 0, half
    ]);
    const colours = new Float32Array(18).fill(0);
    const normals = new Float32Array(18);
    for (let index = 0; index < 6; index += 1) {
      colours[index * 3] = 0.0016;
      colours[index * 3 + 1] = 0.0095;
      colours[index * 3 + 2] = 0.0130;
      normals[index * 3 + 1] = 1;
    }
    return Object.freeze({
      centre: [0, 0],
      mirror: false,
      palettes: { shell: new Float32Array([1, 1, 1]) },
      layers: {
        shell: {
          format: "raw-expanded",
          positions,
          colours,
          normals,
          count: 6
        }
      }
    });
  }

  function registerAssets() {
    if (assetsRegistered) return true;
    const registry = globalThis.FieldOps3DAssets;
    if (!registry?.register) return false;
    if (!registry.has?.(FLOOR_ASSET)) registry.register(FLOOR_ASSET, buildFloorAsset());
    assetsRegistered = true;
    return true;
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .rf-map-paper .${BACKGROUND_CLASS} {
        position: absolute;
        top: 0;
        right: var(--path-handle-width);
        bottom: 0;
        left: 0;
        z-index: 2;
        overflow: hidden;
        border-radius: 12px 0 0 0;
        pointer-events: none;
        background:
          radial-gradient(circle at 50% 10%, rgba(46, 240, 255, 0.06), transparent 34%),
          linear-gradient(180deg, rgba(0, 10, 17, 0.04) 0%, rgba(0, 8, 14, 0.28) 100%),
          #021019;
      }

      .rf-map-paper .${BACKGROUND_CLASS}::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image: url("${PREVIEW_TILE}");
        background-repeat: repeat-x;
        background-position: center calc(100% + 8px);
        background-size: auto 74%;
        opacity: 0.84;
        filter: saturate(0.92) brightness(0.84);
      }

      .rf-map-paper .${BACKGROUND_CLASS}::after {
        content: "";
        position: absolute;
        inset: 0;
        background:
          linear-gradient(180deg, rgba(0, 7, 12, 0.78) 0%, rgba(0, 7, 12, 0.16) 26%, rgba(0, 7, 12, 0) 46%, rgba(0, 7, 12, 0.34) 100%);
      }

      .rf-map-stage {
        z-index: 3;
      }
    `;
    document.head.appendChild(style);
  }

  function removeBackground(root) {
    const paper = root?.closest?.(".rf-map-paper");
    if (!paper) return;
    paper.querySelector(`:scope > .${BACKGROUND_CLASS}`)?.remove();
    delete root.dataset.rfBackgroundLayer;
    delete root.dataset.rfBackgroundLayerVersion;
    delete root.dataset.rfBackgroundMountains;
  }

  function ensureBackground(root) {
    const paper = root?.closest?.(".rf-map-paper");
    if (!paper) return;

    let layer = paper.querySelector(`:scope > .${BACKGROUND_CLASS}`);
    if (!layer) {
      layer = document.createElement("div");
      layer.className = BACKGROUND_CLASS;
      root.insertAdjacentElement("beforebegin", layer);
    }

    layer.dataset.rfBackgroundLayer = "builder2-repeated-preview";
    layer.dataset.rfBackgroundLayerVersion = VERSION;
    root.dataset.rfBackgroundLayer = "builder2-repeated-preview";
    root.dataset.rfBackgroundLayerVersion = VERSION;
  }

  function enhancedCamera(camera = {}) {
    return Object.freeze({
      ...camera,
      size: camera.size || [57, 23, 42],
      target: [0, 3.5, 0],
      lift: 25,
      fov: 58,
      distanceScale: 0.55,
      screenOffsetY: 0,
      bottomAnchorPoints: null,
      orbitShape: "square",
      orbitMotion: Object.freeze({
        frequency: 1,
        phase: 0,
        targetX: 0,
        targetY: 0,
        targetZ: 0,
        lift: 0,
        dolly: 0,
        screenY: 0,
        sideThreshold: 0,
        sideTargetX: 0,
        sideTargetY: 0,
        sideTargetZ: 0,
        sideLift: 0,
        sideDolly: 0,
        sideRoll: 0,
        sideScenePitch: 0,
        sideScenePivot: [0, 0, 0],
        sideScreenY: 0
      })
    });
  }

  function enhanceScene(scene) {
    const objects = [
      Object.freeze({
        asset: FLOOR_ASSET,
        position: [0, -0.06, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1]
      }),
      ...(scene.objects || [])
    ];

    return Object.freeze({
      ...scene,
      camera: enhancedCamera(scene.camera),
      objects: Object.freeze(objects)
    });
  }

  function install() {
    const renderer = globalThis.FieldOps3DRenderer;
    if (!renderer?.create || renderer.__builder2RepeatedBackgroundInstalled) return false;
    if (!registerAssets()) return false;

    const originalCreate = renderer.create.bind(renderer);
    renderer.create = (root, scene) => {
      if (!TARGETS.has(scene?.id)) {
        removeBackground(root);
        return originalCreate(root, scene);
      }
      ensureStyles();
      const api = originalCreate(root, enhanceScene(scene));
      ensureBackground(root);
      root.dataset.rfBackgroundMountains = "builder2-repeated";
      return api;
    };

    renderer.__builder2RepeatedBackgroundInstalled = true;
    renderer.builder2RepeatedBackgroundVersion = VERSION;
    return true;
  }

  if (!install()) {
    document.addEventListener("fieldops3dassetready", install, { once: true });
    queueMicrotask(install);
  }

  globalThis.FieldOpsBackgroundMountains = Object.freeze({
    VERSION,
    count: 1,
    mode: "builder2-repeated-background"
  });
})();

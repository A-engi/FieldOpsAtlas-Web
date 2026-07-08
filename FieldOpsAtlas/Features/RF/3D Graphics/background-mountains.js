/* FieldOps Atlas — scene-owned old-mountain box walls
 * File: FieldOpsAtlas/Features/RF/3D Graphics/background-mountains.js
 * Version: 2.2.0-scene-owned-box-wall
 *
 * Registers the earlier single-centre-peak RF mountain as a normal renderer
 * asset, adds one shallow-relief copy to each inner wall, extends the dark
 * floor underneath the approved river plot, and supplies the raised square-edge
 * camera profile. Everything is rendered in the main WebGL scene and therefore
 * shares its camera and depth buffer. The river geometry and transmitters are
 * not rebuilt or repositioned here.
 */
(() => {
  "use strict";

  const VERSION = "2.2.0-scene-owned-box-wall";
  const WALL_ASSET = "rf-old-mountain-box-wall";
  const FLOOR_ASSET = "rf-box-floor-extension";
  const TARGETS = new Set(["mount-a_b-comp-scene", "mount-a_a-comp-scene"]);

  const GRID_W = 56;
  const GRID_H = 36;
  const DEPTH_B64 = "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";
  const MASK_B64 = "AAAAAAAAAP7//////3/+//////8//P//////P/z//////x/4//////8f8P//////D+D//////weA//////8BAPj///8fAADw////DwAA8P///wcAAOD///8HAADg////AwAAwP///wMAAMD///8BAAAA////AAAAAPz/HwAAAAD4/x8AAAAA+P8PAAAAAPD/DwAAAADw/w8AAAAA4P8DAAAAAMD/AQAAAACA/wAAAAAAgP8AAAAAAAD/AAAAAAAA/wAAAAAAAH4AAAAAAAA+AAAAAAAAPgAAAAAAABwAAAAAAAAcAAAAAAAAHAAAAAAAAAwAAAAAAAAAAAAA";

  const MOUNTAIN_WIDTH = 30.47511292;
  const MOUNTAIN_HEIGHT = 17.73700333;
  const MOUNTAIN_RELIEF = 3.89257908;

  const WALL_HALF = 31.5;
  const WALL_SCALE_X = 2.067;
  const WALL_SCALE_Y = 1.16;
  const WALL_SCALE_Z = 0.92;

  let assetsRegistered = false;

  const decodeBytes = text => {
    const binary = atob(text);
    const output = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      output[index] = binary.charCodeAt(index);
    }
    return output;
  };

  const decodeDepth = () => {
    const bytes = decodeBytes(DEPTH_B64);
    return new Uint16Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / 2);
  };

  const decodeMask = () => {
    const packed = decodeBytes(MASK_B64);
    const mask = new Uint8Array(GRID_W * GRID_H);
    for (let index = 0; index < mask.length; index += 1) {
      mask[index] = (packed[index >> 3] >> (index & 7)) & 1;
    }
    return mask;
  };

  const pushColour = (target, height, relief, boost = 0) => {
    const h = Math.max(0, Math.min(1, height));
    const d = Math.max(0, Math.min(1, relief));
    target.push(
      0.0025 + h * 0.010 + d * 0.004 + boost,
      0.0240 + h * 0.104 + d * 0.048 + boost * 1.6,
      0.0340 + h * 0.126 + d * 0.060 + boost * 1.8
    );
  };

  const addTriangle = (positions, colours, normals, a, b, c) => {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy;
    let ny = uz * vx - ux * vz;
    let nz = ux * vy - uy * vx;
    const length = Math.hypot(nx, ny, nz) || 1;
    nx /= length; ny /= length; nz /= length;

    for (const point of [a, b, c]) {
      positions.push(...point);
      pushColour(
        colours,
        point[1] / MOUNTAIN_HEIGHT,
        point[2] / MOUNTAIN_RELIEF
      );
      normals.push(nx, ny, nz);
    }
  };

  const addRibbon = (positions, colours, a, b, width = 0.021, lift = 0.045) => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const length = Math.hypot(dx, dy) || 1;
    const ox = -dy / length * width;
    const oy = dx / length * width;
    const az = a[2] + lift;
    const bz = b[2] + lift;
    const p0 = [a[0] - ox, a[1] - oy, az];
    const p1 = [a[0] + ox, a[1] + oy, az];
    const p2 = [b[0] + ox, b[1] + oy, bz];
    const p3 = [b[0] - ox, b[1] - oy, bz];
    const colour = point => {
      const h = Math.max(0, Math.min(1, point[1] / MOUNTAIN_HEIGHT));
      colours.push(0.035 + h * 0.05, 0.30 + h * 0.36, 0.34 + h * 0.38);
    };
    positions.push(...p0, ...p1, ...p2, ...p0, ...p2, ...p3);
    for (const point of [p0, p1, p2, p0, p2, p3]) colour(point);
  };

  const addRib = (positions, colours, point, length, width = 0.025) => {
    const start = [point[0], point[1], point[2] + 0.05];
    const end = [point[0], point[1], point[2] + length];
    const quads = [
      [
        [start[0] - width, start[1], start[2]],
        [start[0] + width, start[1], start[2]],
        [end[0] + width, end[1], end[2]],
        [end[0] - width, end[1], end[2]]
      ],
      [
        [start[0], start[1] - width, start[2]],
        [start[0], start[1] + width, start[2]],
        [end[0], end[1] + width, end[2]],
        [end[0], end[1] - width, end[2]]
      ]
    ];
    for (const [a, b, c, d] of quads) {
      positions.push(...a, ...b, ...c, ...a, ...c, ...d);
      for (let index = 0; index < 6; index += 1) {
        const h = Math.max(0, Math.min(1, point[1] / MOUNTAIN_HEIGHT));
        colours.push(0.045 + h * 0.05, 0.34 + h * 0.34, 0.38 + h * 0.38);
      }
    }
  };

  function buildMountainAsset() {
    const depth = decodeDepth();
    const mask = decodeMask();
    const pointCache = new Array(GRID_W * GRID_H);
    const point = (x, y) => {
      const index = y * GRID_W + x;
      if (!pointCache[index]) {
        pointCache[index] = [
          (x / (GRID_W - 1) - 0.5) * MOUNTAIN_WIDTH,
          y / (GRID_H - 1) * MOUNTAIN_HEIGHT,
          depth[index] / 65535 * MOUNTAIN_RELIEF
        ];
      }
      return pointCache[index];
    };

    const shellPositions = [];
    const shellColours = [];
    const shellNormals = [];
    const ridgePositions = [];
    const ridgeColours = [];
    const edgeKeys = new Set();

    const addEdge = (ax, ay, bx, by) => {
      const first = ay * GRID_W + ax;
      const second = by * GRID_W + bx;
      const low = Math.min(first, second);
      const high = Math.max(first, second);
      const key = `${low}:${high}`;
      if (edgeKeys.has(key)) return;
      edgeKeys.add(key);
      addRibbon(ridgePositions, ridgeColours, point(ax, ay), point(bx, by));
    };

    for (let y = 0; y < GRID_H - 1; y += 1) {
      for (let x = 0; x < GRID_W - 1; x += 1) {
        const i0 = y * GRID_W + x;
        const i1 = i0 + 1;
        const i2 = i0 + GRID_W;
        const i3 = i2 + 1;
        if (!(mask[i0] && mask[i1] && mask[i2] && mask[i3])) continue;

        const a = point(x, y);
        const b = point(x + 1, y);
        const c = point(x + 1, y + 1);
        const d = point(x, y + 1);

        if ((x + y) & 1) {
          addTriangle(shellPositions, shellColours, shellNormals, a, b, d);
          addTriangle(shellPositions, shellColours, shellNormals, b, c, d);
          addEdge(x, y, x + 1, y);
          addEdge(x + 1, y, x, y + 1);
          addEdge(x, y + 1, x, y);
          addEdge(x + 1, y, x + 1, y + 1);
          addEdge(x + 1, y + 1, x, y + 1);
        } else {
          addTriangle(shellPositions, shellColours, shellNormals, a, b, c);
          addTriangle(shellPositions, shellColours, shellNormals, a, c, d);
          addEdge(x, y, x + 1, y);
          addEdge(x + 1, y, x + 1, y + 1);
          addEdge(x + 1, y + 1, x, y);
          addEdge(x + 1, y + 1, x, y + 1);
          addEdge(x, y + 1, x, y);
        }
      }
    }

    for (let y = 1; y < GRID_H - 1; y += 2) {
      for (let x = 1; x < GRID_W - 1; x += 2) {
        const index = y * GRID_W + x;
        if (!mask[index]) continue;
        const hash = ((x * 73856093) ^ (y * 19349663)) >>> 0;
        const height = y / (GRID_H - 1);
        if ((hash % 1000) / 1000 > 0.25 + 0.18 * height) continue;
        const length = 0.22 + 0.24 * height + ((hash >>> 10) % 1000) / 1000 * 0.42;
        addRib(ridgePositions, ridgeColours, point(x, y), length);
      }
    }

    return Object.freeze({
      centre: [0, 0],
      mirror: false,
      palettes: {
        shell: new Float32Array([1, 1, 1]),
        ridge: new Float32Array([1, 1, 1])
      },
      layers: {
        shell: {
          format: "raw-expanded",
          positions: new Float32Array(shellPositions),
          colours: new Float32Array(shellColours),
          normals: new Float32Array(shellNormals),
          count: shellPositions.length / 3
        },
        ridge: {
          format: "raw-expanded",
          positions: new Float32Array(ridgePositions),
          colours: new Float32Array(ridgeColours),
          count: ridgePositions.length / 3
        }
      }
    });
  }

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
    if (!registry.has?.(WALL_ASSET)) registry.register(WALL_ASSET, buildMountainAsset());
    if (!registry.has?.(FLOOR_ASSET)) registry.register(FLOOR_ASSET, buildFloorAsset());
    assetsRegistered = true;
    return true;
  }

  const wallObjects = () => Object.freeze([
    Object.freeze({
      asset: WALL_ASSET,
      position: [0, 0, -WALL_HALF],
      rotation: [0, 0, 0],
      scale: [WALL_SCALE_X, WALL_SCALE_Y, WALL_SCALE_Z]
    }),
    Object.freeze({
      asset: WALL_ASSET,
      position: [0, 0, WALL_HALF],
      rotation: [0, Math.PI, 0],
      scale: [WALL_SCALE_X, WALL_SCALE_Y, WALL_SCALE_Z]
    }),
    Object.freeze({
      asset: WALL_ASSET,
      position: [WALL_HALF, 0, 0],
      rotation: [0, -Math.PI / 2, 0],
      scale: [WALL_SCALE_X, WALL_SCALE_Y, WALL_SCALE_Z]
    }),
    Object.freeze({
      asset: WALL_ASSET,
      position: [-WALL_HALF, 0, 0],
      rotation: [0, Math.PI / 2, 0],
      scale: [WALL_SCALE_X, WALL_SCALE_Y, WALL_SCALE_Z]
    })
  ]);

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
      ...(scene.objects || []),
      ...wallObjects()
    ];
    return Object.freeze({
      ...scene,
      camera: enhancedCamera(scene.camera),
      objects: Object.freeze(objects)
    });
  }

  function install() {
    const renderer = globalThis.FieldOps3DRenderer;
    if (!renderer?.create || renderer.__sceneOwnedBoxWallInstalled) return false;
    if (!registerAssets()) return false;

    const originalCreate = renderer.create.bind(renderer);
    renderer.create = (root, scene) => {
      if (!TARGETS.has(scene?.id)) return originalCreate(root, scene);
      const api = originalCreate(root, enhanceScene(scene));
      root.dataset.rfBackgroundMountains = "4";
      root.dataset.rfBackgroundLayer = "scene-owned-exact-box-wall-relief";
      root.dataset.rfBackgroundLayerVersion = VERSION;
      return api;
    };

    renderer.__sceneOwnedBoxWallInstalled = true;
    renderer.sceneOwnedBoxWallVersion = VERSION;
    return true;
  }

  if (!install()) {
    document.addEventListener("fieldops3dassetready", install, { once: true });
    queueMicrotask(install);
  }

  globalThis.FieldOpsBackgroundMountains = Object.freeze({
    VERSION,
    count: 4,
    mode: "scene-owned-exact-box-wall-relief"
  });
})();

/* ==========================================================================
   FieldOps Atlas RF 3D orbit renderer
   File: FieldOpsAtlas/Features/RF/rf-graph.js
   Version: 1.1.186-no-gltf-procedural

   Purpose:
   - Remove the external glTF model and GLTFLoader dependency completely.
   - Generate a compact two-mountain terrain, central valley, diagonal river,
     dot skin, broken chevrons, and foreground radar grid directly in JavaScript.
   - Preserve 360-degree drag orbit, fallback, mount selector, and rendered
     event contract.
   ========================================================================== */
(() => {
  "use strict";

  const VERSION = "1.1.186-no-gltf-procedural";
  const MOUNT_SELECTOR = "[data-rf-graph]";
  const MAP_PAPER_SELECTOR = ".rf-map-paper";
  const LEGACY_KEY_SELECTOR = ".rf-graph-key";
  const RENDERED_EVENT = "fieldops:rf-graph-rendered";
  const SELECTED_PATH_ID = "site-1-to-site-2";
  const MODE = "three-procedural-broken-connected-wireframe";
  const THREE_MODULE_URL = "three";
  const DEG = Math.PI / 180;
  const FRONT_AZIMUTH = 0;

  let dependencyPromise = null;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function hash01(value) {
    const raw = Math.sin(value * 12.9898 + 78.233) * 43758.5453;
    return raw - Math.floor(raw);
  }

  function removePreloadBackground(mount) {
    const paper = mount.closest(MAP_PAPER_SELECTOR);
    paper?.querySelectorAll(":scope > .rf-map-background").forEach((node) => node.remove());
  }

  function removeLegacyKey(mount) {
    const paper = mount.closest(MAP_PAPER_SELECTOR);
    if (!paper) return;
    paper.querySelectorAll(`:scope > ${LEGACY_KEY_SELECTOR}`).forEach((node) => node.remove());
    paper.dataset.rfGraphKeyInit = "false";
  }

  function buildFallback(mount) {
    const fallback = document.createElement("div");
    fallback.setAttribute("role", "img");
    fallback.setAttribute("aria-label", "Static RF mountain fallback graphic.");
    fallback.style.cssText =
      "display:grid;place-items:center;width:100%;height:100%;min-height:300px;background:#010a12;overflow:hidden";
    fallback.innerHTML = `
      <svg viewBox="0 0 1000 620" width="100%" height="100%" aria-hidden="true">
        <rect width="1000" height="620" fill="#010a12"/>
        <path d="M-50 570 90 520 195 445 305 258 415 420 505 520 590 466 710 300 825 432 1050 570Z" fill="#06202c"/>
        <g fill="none" stroke="#55dce9" stroke-width="3" opacity=".55">
          <path d="M35 535C190 490 315 390 475 525"/>
          <path d="M520 525C650 445 735 360 930 510"/>
          <path d="M430 552C505 505 530 430 565 338" stroke="#9afaff"/>
        </g>
      </svg>`;
    mount.replaceChildren(fallback);
    mount.dataset.rfGraphLoaded = "fallback";
    mount.dataset.rfGraphVersion = VERSION;
    mount.dataset.rfGraphMode = "fallback";
    return fallback;
  }

  function buildFrame(mount) {
    const frame = document.createElement("div");
    frame.className = "rf-webgl-orbit-frame";
    frame.style.cssText = [
      "position:relative",
      "width:100%",
      "height:100%",
      "overflow:hidden",
      "background-color:#010a12",
      "background-image:linear-gradient(rgba(29,145,165,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(29,145,165,.045) 1px,transparent 1px)",
      "background-size:56px 56px,56px 56px",
      "touch-action:none",
      "user-select:none"
    ].join(";");

    const canvas = document.createElement("canvas");
    canvas.className = "rf-webgl-orbit-canvas";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Interactive procedural RF terrain. Drag left or right to orbit 360 degrees.");
    canvas.setAttribute("tabindex", "0");
    canvas.style.cssText = "display:block;width:100%;height:100%;touch-action:none;cursor:grab;outline:none";

    const hint = document.createElement("div");
    hint.className = "rf-webgl-orbit-hint";
    hint.textContent = "Drag to rotate 360°";
    hint.style.cssText = [
      "position:absolute",
      "left:50%",
      "bottom:10px",
      "transform:translateX(-50%)",
      "padding:5px 9px",
      "border:1px solid rgba(116,228,244,.35)",
      "border-radius:999px",
      "background:rgba(2,16,31,.72)",
      "color:rgba(218,249,255,.9)",
      "font:700 9px/1.1 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif",
      "letter-spacing:.04em",
      "pointer-events:none",
      "transition:opacity .35s ease"
    ].join(";");

    const badge = document.createElement("div");
    badge.className = "rf-webgl-orbit-badge";
    badge.textContent = "Building terrain…";
    badge.style.cssText = [
      "position:absolute",
      "top:10px",
      "left:10px",
      "padding:5px 8px",
      "border:1px solid rgba(116,228,244,.24)",
      "border-radius:999px",
      "background:rgba(2,16,31,.70)",
      "color:rgba(218,249,255,.88)",
      "font:700 9px/1.1 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif",
      "pointer-events:none",
      "transition:opacity .25s ease"
    ].join(";");

    frame.append(canvas, badge, hint);
    mount.replaceChildren(frame);
    return { frame, canvas, hint, badge };
  }

  function hideHint(hint) {
    hint.style.opacity = "0";
  }

  function setBadge(badge, text, dim = false) {
    badge.textContent = text;
    badge.style.opacity = dim ? "0.42" : "1";
  }

  async function loadDependencies() {
    if (!dependencyPromise) {
      dependencyPromise = import(THREE_MODULE_URL);
    }
    return dependencyPromise;
  }

  function mountainHeight(x, z) {
    const leftCore = 18.4 * Math.exp(-(((x + 17.5) / 13.4) ** 2 + ((z + 0.8) / 12.2) ** 2));
    const leftRidge = 6.3 * Math.exp(-(((x + 9.0) / 19.5) ** 2 + ((z - 1.5) / 7.2) ** 2));
    const rightCore = 15.4 * Math.exp(-(((x - 17.0) / 12.6) ** 2 + ((z + 2.2) / 11.6) ** 2));
    const rightRidge = 4.8 * Math.exp(-(((x - 8.0) / 17.0) ** 2 + ((z - 1.0) / 7.0) ** 2));
    const valleyAxis = -1.8 + z * 0.095;
    const valley = 5.0 * Math.exp(-(((x - valleyAxis) / 5.2) ** 2 + ((z + 0.5) / 17.0) ** 2));
    const sideNoise =
      Math.sin(x * 0.31 + z * 0.17) * 0.50 +
      Math.sin(x * 0.14 - z * 0.37) * 0.36 +
      Math.sin((x + z) * 0.49) * 0.22;
    const edgeFade = clamp(1 - Math.max(Math.abs(x) / 38, Math.abs(z) / 22), 0, 1);
    return Math.max(0, (leftCore + leftRidge + rightCore + rightRidge - valley + sideNoise) * edgeFade);
  }

  function buildTerrain(THREE) {
    const columns = 58;
    const rows = 38;
    const xMin = -39;
    const xMax = 39;
    const zMin = -21;
    const zMax = 21;
    const positions = [];
    const indices = [];

    for (let row = 0; row <= rows; row += 1) {
      const v = row / rows;
      const z = zMin + (zMax - zMin) * v;
      for (let column = 0; column <= columns; column += 1) {
        const u = column / columns;
        const x = xMin + (xMax - xMin) * u;
        positions.push(x, mountainHeight(x, z), z);
      }
    }

    const stride = columns + 1;
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const a = row * stride + column;
        const b = a + 1;
        const c = a + stride;
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    const material = new THREE.MeshBasicMaterial({
      color: 0x02090f,
      side: THREE.DoubleSide,
      depthWrite: true,
      depthTest: true
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.rfDecoration = false;
    return { mesh, geometry, columns, rows, xMin, xMax, zMin, zMax };
  }

  function buildSkin(THREE, terrain, compactViewport) {
    const position = terrain.geometry.getAttribute("position");
    const normal = terrain.geometry.getAttribute("normal");
    const dotPositions = [];
    const dotColours = [];
    const chevrons = [];
    const links = [];
    const colour = new THREE.Color();
    const point = new THREE.Vector3();
    const surfaceNormal = new THREE.Vector3();
    const downhill = new THREE.Vector3();
    const side = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    const selected = [];

    for (let index = 0; index < position.count; index += 1) {
      point.fromBufferAttribute(position, index);
      surfaceNormal.fromBufferAttribute(normal, index).normalize();
      const heightRatio = clamp(point.y / 20, 0, 1);
      const topFacing = clamp(surfaceNormal.y, 0, 1);
      const peakLift = Math.pow(clamp((heightRatio - 0.60) / 0.40, 0, 1), 1.25);
      const brightness = clamp(0.16 + topFacing * 0.55 + heightRatio * 0.12 + peakLift * 0.20, 0.12, 1);

      if (index % (compactViewport ? 2 : 1) === 0) {
        dotPositions.push(point.x, point.y + 0.055, point.z);
        colour.set(0x16414c).lerp(new THREE.Color(0xc9fbff), brightness);
        dotColours.push(colour.r, colour.g, colour.b);
      }

      const row = Math.floor(index / (terrain.columns + 1));
      const column = index % (terrain.columns + 1);
      const selector = hash01(index * 0.731 + point.x * 0.11 + point.z * 0.19);
      if (row < 2 || row > terrain.rows - 2 || column < 2 || column > terrain.columns - 2 || selector < 0.69 || point.y < 1.1) {
        continue;
      }

      downhill.set(-surfaceNormal.x, 0, -surfaceNormal.z);
      if (downhill.lengthSq() < 0.01) downhill.set(0, 0, -1);
      downhill.normalize();
      side.crossVectors(up, downhill).normalize();
      const scale = 0.55 + selector * 0.50;
      const apex = point.clone().addScaledVector(downhill, -scale * 0.72).addScaledVector(surfaceNormal, 0.075);
      const left = point.clone().addScaledVector(downhill, scale * 0.42).addScaledVector(side, scale * 0.52).addScaledVector(surfaceNormal, 0.075);
      const right = point.clone().addScaledVector(downhill, scale * 0.42).addScaledVector(side, -scale * 0.52).addScaledVector(surfaceNormal, 0.075);
      chevrons.push(left.x, left.y, left.z, apex.x, apex.y, apex.z, apex.x, apex.y, apex.z, right.x, right.y, right.z);
      selected.push({ index, row, column, point: point.clone(), apex, left, right, brightness, selector });
    }

    const buckets = new Map(selected.map((entry, index) => [`${entry.row}:${entry.column}`, index]));
    selected.forEach((entry, entryIndex) => {
      if (entry.selector < 0.80) return;
      const candidates = [
        buckets.get(`${entry.row}:${entry.column + 2}`),
        buckets.get(`${entry.row + 2}:${entry.column}`),
        buckets.get(`${entry.row + 2}:${entry.column + 2}`)
      ].filter((value) => Number.isInteger(value));
      const targetIndex = candidates[Math.floor(hash01(entry.index * 1.37) * candidates.length)];
      if (!Number.isInteger(targetIndex) || targetIndex === entryIndex) return;
      const target = selected[targetIndex];
      links.push(entry.apex.x, entry.apex.y, entry.apex.z, target.apex.x, target.apex.y, target.apex.z);
    });

    const group = new THREE.Group();
    group.userData.rfDecoration = true;

    const dotGeometry = new THREE.BufferGeometry();
    dotGeometry.setAttribute("position", new THREE.Float32BufferAttribute(dotPositions, 3));
    dotGeometry.setAttribute("color", new THREE.Float32BufferAttribute(dotColours, 3));
    const dotMaterial = new THREE.PointsMaterial({
      size: compactViewport ? 2.35 : 2.65,
      sizeAttenuation: false,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending
    });
    group.add(new THREE.Points(dotGeometry, dotMaterial));

    const chevronMaterial = new THREE.LineBasicMaterial({
      color: 0x70d9e8,
      transparent: true,
      opacity: 0.30,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const chevronGeometry = new THREE.BufferGeometry();
    chevronGeometry.setAttribute("position", new THREE.Float32BufferAttribute(chevrons, 3));
    group.add(new THREE.LineSegments(chevronGeometry, chevronMaterial));

    const linkMaterial = new THREE.LineBasicMaterial({
      color: 0x4da7b8,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const linkGeometry = new THREE.BufferGeometry();
    linkGeometry.setAttribute("position", new THREE.Float32BufferAttribute(links, 3));
    group.add(new THREE.LineSegments(linkGeometry, linkMaterial));

    return { group, materials: [dotMaterial, chevronMaterial, linkMaterial] };
  }

  function buildRiver(THREE) {
    const points = [];
    for (let index = 0; index < 54; index += 1) {
      const t = index / 53;
      const z = 18 - t * 36;
      const x = -4.8 + t * 6.8 + Math.sin(t * Math.PI * 2.2 + 0.4) * 0.9;
      points.push(new THREE.Vector3(x, mountainHeight(x, z) + 0.11, z));
    }
    const curve = new THREE.CatmullRomCurve3(points, false, "centripetal");
    const ribbonMaterial = new THREE.MeshBasicMaterial({
      color: 0x22ddeb,
      transparent: true,
      opacity: 0.025,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xa4fbff,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const ribbon = new THREE.Mesh(new THREE.TubeGeometry(curve, 80, 0.11, 6, false), ribbonMaterial);
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(120)), lineMaterial);
    return { objects: [ribbon, line], materials: [ribbonMaterial, lineMaterial] };
  }

  function buildForegroundGrid(THREE) {
    const positions = [];
    const xMin = -43;
    const xMax = 43;
    const zFront = 22;
    const zBack = 11;
    const y = 0.08;
    const columns = 18;
    const rows = 7;

    for (let column = 0; column <= columns; column += 1) {
      const x = xMin + ((xMax - xMin) * column) / columns;
      positions.push(x, y, zFront, x, y, zBack);
    }
    for (let row = 0; row <= rows; row += 1) {
      const z = zFront + ((zBack - zFront) * row) / rows;
      positions.push(xMin, y, z, xMax, y, z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    const material = new THREE.LineBasicMaterial({
      color: 0x5db9d0,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    return { object: new THREE.LineSegments(geometry, material), material };
  }

  async function initialiseThreeViewer(mount, elements, token) {
    const { frame, canvas, hint, badge } = elements;
    const THREE = await loadDependencies();
    if (token.destroyed) return { destroy() {} };

    const compactViewport = window.matchMedia("(max-width: 760px)").matches;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !compactViewport,
      powerPreference: "high-performance"
    });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x021221, 25, 70);
    const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 140);
    const root = new THREE.Group();
    scene.add(root);

    const terrain = buildTerrain(THREE);
    root.add(terrain.mesh);
    const skin = buildSkin(THREE, terrain, compactViewport);
    root.add(skin.group);
    const river = buildRiver(THREE);
    river.objects.forEach((object) => root.add(object));
    const grid = buildForegroundGrid(THREE);
    root.add(grid.object);

    root.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const target = new THREE.Vector3(center.x, box.min.y + size.y * 0.04, center.z);
    const orbitRadiusBase = Math.max(size.x, size.z) * 0.74;
    const targetLift = size.y * 0.04;
    const pulseMaterials = [...river.materials, grid.material];

    const state = {
      azimuth: FRONT_AZIMUTH,
      velocity: 0,
      dragging: false,
      pointerId: null,
      lastX: 0,
      lastTime: 0,
      width: 0,
      height: 0,
      animationFrame: 0,
      destroyed: false
    };

    function resize() {
      const rect = frame.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, compactViewport ? 1.25 : 1.75);
      const width = Math.max(1, Math.round(rect.width * pixelRatio));
      const height = Math.max(1, Math.round(rect.height * pixelRatio));
      if (state.width === width && state.height === height) return;
      state.width = width;
      state.height = height;
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function render(time = 0) {
      if (state.destroyed) return;
      resize();
      if (!state.dragging && Math.abs(state.velocity) > 0.001) {
        state.azimuth += state.velocity;
        state.velocity *= 0.92;
      }

      const pulse = 0.5 + Math.sin(time * 0.00135) * 0.5;
      pulseMaterials.forEach((material, index) => {
        const base = material.userData.rfBaseOpacity ?? material.opacity;
        material.userData.rfBaseOpacity ??= base;
        material.opacity = clamp(base + pulse * (index === 0 ? 0.012 : 0.008), 0, 1);
      });

      const angle = (state.azimuth % 360) * DEG;
      const aspect = state.width / Math.max(1, state.height);
      const portraitBoost = clamp((1.05 - aspect) * 2.3, 0, 1.5);
      const orbitRadius = orbitRadiusBase + portraitBoost * 3.0;
      camera.fov = aspect < 0.82 ? 48 : aspect < 1.12 ? 45 : 42;
      camera.updateProjectionMatrix();
      camera.position.set(
        target.x + Math.sin(angle) * orbitRadius,
        target.y + targetLift,
        target.z + Math.cos(angle) * orbitRadius
      );
      camera.lookAt(target);
      renderer.render(scene, camera);
      state.animationFrame = window.requestAnimationFrame(render);
    }

    function onPointerDown(event) {
      hideHint(hint);
      state.dragging = true;
      state.pointerId = event.pointerId;
      state.lastX = event.clientX;
      state.lastTime = performance.now();
      state.velocity = 0;
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
      event.preventDefault();
    }

    function onPointerMove(event) {
      if (!state.dragging || event.pointerId !== state.pointerId) return;
      const now = performance.now();
      const deltaX = event.clientX - state.lastX;
      const deltaTime = Math.max(1, now - state.lastTime);
      const deltaAngle = deltaX * 0.30;
      state.azimuth += deltaAngle;
      state.velocity = (deltaAngle / deltaTime) * 16;
      state.lastX = event.clientX;
      state.lastTime = now;
      event.preventDefault();
    }

    function onPointerUp(event) {
      if (event.pointerId !== state.pointerId) return;
      state.dragging = false;
      state.pointerId = null;
      canvas.style.cursor = "grab";
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    }

    function onKeyDown(event) {
      if (!["ArrowLeft", "ArrowRight", "Home"].includes(event.key)) return;
      hideHint(hint);
      if (event.key === "Home") {
        state.azimuth = FRONT_AZIMUTH;
        state.velocity = 0;
      } else {
        state.azimuth += event.key === "ArrowLeft" ? -8 : 8;
      }
      event.preventDefault();
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("keydown", onKeyDown);
    canvas.addEventListener("dblclick", () => {
      state.azimuth = FRONT_AZIMUTH;
      state.velocity = 0;
      hideHint(hint);
    });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(frame);

    setBadge(badge, "Procedural RF terrain loaded", true);
    window.setTimeout(() => { badge.style.opacity = "0"; }, 1600);
    window.setTimeout(() => hideHint(hint), 2600);

    mount.dataset.rfGraphLoaded = "true";
    mount.dataset.rfGraphVersion = VERSION;
    mount.dataset.rfGraphMode = MODE;
    mount.dispatchEvent(new CustomEvent(RENDERED_EVENT, {
      bubbles: true,
      detail: { version: VERSION, selectedPathId: SELECTED_PATH_ID, mode: MODE }
    }));

    state.animationFrame = window.requestAnimationFrame(render);

    return {
      destroy() {
        state.destroyed = true;
        token.destroyed = true;
        window.cancelAnimationFrame(state.animationFrame);
        resizeObserver.disconnect();
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointercancel", onPointerUp);
        canvas.removeEventListener("keydown", onKeyDown);
        renderer.dispose();
        scene.traverse((node) => {
          node.geometry?.dispose?.();
          if (Array.isArray(node.material)) node.material.forEach((material) => material?.dispose?.());
          else node.material?.dispose?.();
        });
      }
    };
  }

  async function initialiseMount(mount) {
    if (!mount || mount.dataset.rfGraphInit === VERSION) return;
    mount._rfGraphViewer?.destroy?.();
    mount.dataset.rfGraphInit = VERSION;
    removePreloadBackground(mount);
    removeLegacyKey(mount);
    const token = { destroyed: false };
    const elements = buildFrame(mount);

    try {
      mount._rfGraphViewer = await initialiseThreeViewer(mount, elements, token);
    } catch (error) {
      console.error("FieldOps RF procedural viewer failed:", error);
      buildFallback(mount);
    }
  }

  function initAll(root = document) {
    root.querySelectorAll(MOUNT_SELECTOR).forEach((mount) => initialiseMount(mount));
  }

  window.FieldOpsRFGraph = { VERSION, init: initialiseMount, initAll };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initAll(), { once: true });
  } else {
    initAll();
  }
})();

/* Destination: FieldOpsAtlas/Features/RF/rf-graph.js */
/* End of file: FieldOpsAtlas/Features/RF/rf-graph.js */

/* ==========================================================================
   FieldOps Atlas RF 3D orbit renderer
   File: FieldOpsAtlas/Features/RF/rf-graph.js
   Version: 1.1.163-text-gltf

   Purpose:
   - Replace the procedural curved terrain with the uploaded ready-made glTF
     mountain asset.
   - Preserve the RF graph mount selector, 360-degree drag orbit, fallback,
     and rendered-event contract.
   - Add dark terrain shading, cyan wire overlay, a glowing valley route, and
     two gold RF tower markers.
   ========================================================================== */
(() => {
  "use strict";

  const VERSION = "1.1.163-text-gltf";
  const MOUNT_SELECTOR = "[data-rf-graph]";
  const MAP_PAPER_SELECTOR = ".rf-map-paper";
  const LEGACY_KEY_SELECTOR = ".rf-graph-key";
  const RENDERED_EVENT = "fieldops:rf-graph-rendered";
  const SELECTED_PATH_ID = "site-1-to-site-2";
  const MODE = "three-gltf-mountain-orbit";
  const MODEL_URL = "../../Feature/RF/scene-mobile-v1.1.163.gltf";
  const THREE_MODULE_URL = "three";
  const GLTF_LOADER_URL = "three/addons/loaders/GLTFLoader.js";

  const DEG = Math.PI / 180;
  const FRONT_AZIMUTH = 0;

  let dependencyPromise = null;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function removeLegacyKey(mount) {
    const mapPaper = mount.closest(MAP_PAPER_SELECTOR);
    if (!mapPaper) return;

    mapPaper
      .querySelectorAll(`:scope > ${LEGACY_KEY_SELECTOR}`)
      .forEach((node) => node.remove());

    mapPaper.dataset.rfGraphKeyInit = "false";
  }

  function buildFallback(mount) {
    const fallback = document.createElement("div");
    fallback.setAttribute("role", "img");
    fallback.setAttribute(
      "aria-label",
      "Static RF mountain fallback graphic."
    );
    fallback.style.cssText =
      "display:grid;place-items:center;width:100%;height:100%;min-height:300px;background:#010a12;overflow:hidden";
    fallback.innerHTML = `
      <svg viewBox="0 0 1000 620" width="100%" height="100%" aria-hidden="true">
        <defs>
          <linearGradient id="rfFallbackLeft" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#0d7e88"/>
            <stop offset="1" stop-color="#031724"/>
          </linearGradient>
          <linearGradient id="rfFallbackRight" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#0a6975"/>
            <stop offset="1" stop-color="#02131e"/>
          </linearGradient>
        </defs>
        <rect width="1000" height="620" fill="#010a12"/>
        <path d="M-60 560 L42 530 L132 496 L220 444 L300 385 L364 332 L438 316 L508 352 L584 412 L670 486 L754 560 Z" fill="url(#rfFallbackLeft)"/>
        <path d="M394 560 L496 520 L586 472 L678 406 L748 344 L816 314 L892 334 L954 388 L1010 446 L1084 560 Z" fill="url(#rfFallbackRight)"/>
        <path d="M502 556 C450 512 548 466 500 416 C456 368 532 324 486 276" fill="none" stroke="#75effa" stroke-width="5"/>
      </svg>
    `;
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
      "background-image:linear-gradient(rgba(29,145,165,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(29,145,165,.055) 1px,transparent 1px),radial-gradient(ellipse at 50% 73%,rgba(0,190,211,.16),transparent 52%)",
      "background-size:56px 56px,56px 56px,100% 100%",
      "touch-action:none",
      "user-select:none"
    ].join(";");

    const canvas = document.createElement("canvas");
    canvas.className = "rf-webgl-orbit-canvas";
    canvas.setAttribute("role", "img");
    canvas.setAttribute(
      "aria-label",
      "Interactive 3D RF mountain model. Drag left or right to orbit 360 degrees."
    );
    canvas.setAttribute("tabindex", "0");
    canvas.style.cssText =
      "display:block;width:100%;height:100%;touch-action:none;cursor:grab;outline:none";

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
    badge.textContent = "Loading 3D terrain…";
    badge.style.cssText = [
      "position:absolute",
      "top:10px",
      "left:10px",
      "max-width:min(70%, 210px)",
      "padding:5px 8px",
      "border:1px solid rgba(116,228,244,.24)",
      "border-radius:999px",
      "background:rgba(2,16,31,.70)",
      "color:rgba(218,249,255,.88)",
      "font:700 9px/1.1 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif",
      "letter-spacing:.03em",
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
      dependencyPromise = Promise.all([
        import(THREE_MODULE_URL),
        import(GLTF_LOADER_URL)
      ]).then(([THREE, loaders]) => ({
        THREE,
        GLTFLoader: loaders.GLTFLoader
      }));
    }

    return dependencyPromise;
  }

  function createLineSegments(THREE, segments, colour, opacity = 1) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(segments, 3)
    );

    const material = new THREE.LineBasicMaterial({
      color: colour,
      transparent: opacity < 1,
      opacity,
      depthWrite: false
    });

    return new THREE.LineSegments(geometry, material);
  }

  function createPointCloud(THREE, points, colour, size, opacity = 1) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3)
    );

    const material = new THREE.PointsMaterial({
      color: colour,
      size,
      transparent: opacity < 1,
      opacity,
      sizeAttenuation: true,
      depthWrite: false
    });

    return new THREE.Points(geometry, material);
  }

  function createTowerGroup(THREE, origin, height, baseRadius, radarSide = 1) {
    const group = new THREE.Group();
    const lineSegments = [];
    const pointPositions = [];

    function addSegment(a, b) {
      lineSegments.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }

    function addPoint(point) {
      pointPositions.push(point.x, point.y, point.z);
    }

    function legPoint(leg, level, levels) {
      const t = level / levels;
      const radius = baseRadius * (1 - t * 0.78);
      const angle = Math.PI * 0.25 + leg * Math.PI * 0.5;
      return new THREE.Vector3(
        origin.x + Math.cos(angle) * radius,
        origin.y + t * height,
        origin.z + Math.sin(angle) * radius
      );
    }

    const levels = 14;
    for (let level = 0; level < levels; level += 1) {
      for (let leg = 0; leg < 4; leg += 1) {
        const a = legPoint(leg, level, levels);
        const b = legPoint(leg, level + 1, levels);
        const c = legPoint((leg + 1) % 4, level, levels);
        const d = legPoint((leg + 1) % 4, level + 1, levels);
        addSegment(a, b);
        addSegment(a, c);
        addSegment(a, d);
        addSegment(b, c);
        addPoint(a);
      }
    }

    const top = new THREE.Vector3(origin.x, origin.y + height, origin.z);
    const mast = new THREE.Vector3(origin.x, origin.y + height + height * 0.18, origin.z);
    for (let leg = 0; leg < 4; leg += 1) {
      addSegment(legPoint(leg, levels, levels), top);
    }
    addSegment(top, mast);
    addPoint(mast);

    const panelBands = [0.38, 0.54, 0.69, 0.82];
    panelBands.forEach((fraction, index) => {
      const y = origin.y + height * fraction;
      const reach = baseRadius * (1.28 - index * 0.09);
      const halfHeight = height * 0.05;
      const halfWidth = baseRadius * 0.12;
      for (let side = -1; side <= 1; side += 2) {
        const cx = origin.x + side * reach;
        const p1 = new THREE.Vector3(cx - halfWidth, y - halfHeight, origin.z);
        const p2 = new THREE.Vector3(cx - halfWidth, y + halfHeight, origin.z);
        const p3 = new THREE.Vector3(cx + halfWidth, y + halfHeight, origin.z);
        const p4 = new THREE.Vector3(cx + halfWidth, y - halfHeight, origin.z);
        addSegment(p1, p2);
        addSegment(p2, p3);
        addSegment(p3, p4);
        addSegment(p4, p1);
        addSegment(new THREE.Vector3(origin.x, y, origin.z), new THREE.Vector3(cx, y, origin.z));
      }
    });

    const side = radarSide < 0 ? -1 : 1;
    const dishAnchor = new THREE.Vector3(
      origin.x + side * baseRadius * 1.4,
      origin.y + height * 0.76,
      origin.z
    );
    const dishRadius = baseRadius * 0.55;
    const dishDepth = baseRadius * 0.22;
    const ringCount = 3;
    const segmentCount = 16;
    for (let ring = 1; ring <= ringCount; ring += 1) {
      const fraction = ring / ringCount;
      let previous = null;
      for (let segment = 0; segment <= segmentCount; segment += 1) {
        const angle = (segment / segmentCount) * Math.PI * 2;
        const radial = dishRadius * fraction;
        const point = new THREE.Vector3(
          dishAnchor.x - side * dishDepth * fraction * fraction,
          dishAnchor.y + Math.sin(angle) * radial,
          dishAnchor.z + Math.cos(angle) * radial
        );
        if (previous) addSegment(previous, point);
        previous = point;
      }
    }
    addSegment(new THREE.Vector3(origin.x + side * baseRadius * 0.4, origin.y + height * 0.74, origin.z), dishAnchor);
    addPoint(dishAnchor);

    const lines = createLineSegments(THREE, lineSegments, 0xffbf4d, 0.96);
    const glow = createPointCloud(THREE, pointPositions, 0xff8c1a, baseRadius * 0.55, 0.82);
    group.add(lines, glow);
    return group;
  }

  function buildTerrainDecorations(THREE, terrainRoot) {
    const box = new THREE.Box3().setFromObject(terrainRoot);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const topY = box.max.y;
    const baseY = box.min.y;
    const target = new THREE.Vector3(center.x, baseY + size.y * 0.28, center.z);

    const peakState = {
      left: null,
      right: null
    };
    const pointPositions = [];

    terrainRoot.updateMatrixWorld(true);

    terrainRoot.traverse((node) => {
      if (!node.isMesh || !node.geometry || !node.geometry.attributes.position) return;

      const position = node.geometry.attributes.position;
      const sampleStep = Math.max(1, Math.ceil(position.count / 1800));
      const probe = new THREE.Vector3();

      for (let index = 0; index < position.count; index += sampleStep) {
        probe.fromBufferAttribute(position, index).applyMatrix4(node.matrixWorld);
        pointPositions.push(probe.x, probe.y + size.y * 0.002, probe.z);

        const side = probe.x < center.x ? "left" : "right";
        if (!peakState[side] || probe.y > peakState[side].y) {
          peakState[side] = probe.clone();
        }
      }
    });

    if (pointPositions.length) {
      const terrainPoints = createPointCloud(
        THREE,
        pointPositions,
        0x6beaf5,
        Math.max(size.x * 0.0032, 0.045),
        0.42
      );
      terrainPoints.renderOrder = 2;
      terrainRoot.add(terrainPoints);
    }

    const leftPeak = peakState.left || new THREE.Vector3(
      center.x - size.x * 0.2,
      topY,
      center.z + size.z * 0.08
    );
    const rightPeak = peakState.right || new THREE.Vector3(
      center.x + size.x * 0.2,
      topY * 0.96,
      center.z - size.z * 0.08
    );

    const leftTower = createTowerGroup(
      THREE,
      new THREE.Vector3(leftPeak.x, leftPeak.y + 0.06, leftPeak.z),
      Math.max(size.y * 0.28, 2.8),
      Math.max(size.x * 0.018, 0.28),
      1
    );

    const rightTower = createTowerGroup(
      THREE,
      new THREE.Vector3(rightPeak.x, rightPeak.y + 0.06, rightPeak.z),
      Math.max(size.y * 0.19, 2.0),
      Math.max(size.x * 0.014, 0.22),
      -1
    );

    const pathSamples = [];
    const pathSteps = 34;
    const zStart = box.max.z - size.z * 0.08;
    const zEnd = box.min.z + size.z * 0.14;

    for (let index = 0; index < pathSteps; index += 1) {
      const t = index / (pathSteps - 1);
      pathSamples.push(
        new THREE.Vector3(
          center.x + Math.sin(t * Math.PI * 2.4) * size.x * 0.035,
          baseY + size.y * (0.10 + Math.sin(t * Math.PI) * 0.05),
          zStart + (zEnd - zStart) * t
        )
      );
    }

    const curve = new THREE.CatmullRomCurve3(pathSamples);
    const ribbon = new THREE.Mesh(
      new THREE.TubeGeometry(
        curve,
        54,
        Math.max(size.x * 0.0025, 0.07),
        6,
        false
      ),
      new THREE.MeshBasicMaterial({
        color: 0x2aeffc,
        transparent: true,
        opacity: 0.24,
        depthWrite: false
      })
    );

    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pathSamples),
      new THREE.LineBasicMaterial({
        color: 0x84f7ff,
        transparent: true,
        opacity: 0.94,
        depthWrite: false
      })
    );

    const markerPositions = [];
    for (let index = 0; index < pathSamples.length; index += 3) {
      const point = pathSamples[index];
      markerPositions.push(point.x, point.y, point.z);
    }

    const markers = createPointCloud(
      THREE,
      markerPositions,
      0xb2fdff,
      Math.max(size.x * 0.009, 0.11),
      0.82
    );

    terrainRoot.add(ribbon, line, markers, leftTower, rightTower);

    return {
      box,
      size,
      target,
      topY,
      baseY,
      center
    };
  }

  function normaliseTerrainModel(THREE, model) {
    const rawBox = new THREE.Box3().setFromObject(model);
    const rawSize = rawBox.getSize(new THREE.Vector3());
    const rawCenter = rawBox.getCenter(new THREE.Vector3());
    const targetSpan = 35;
    const scaleFactor = targetSpan / Math.max(rawSize.x || 1, rawSize.z || 1);

    model.position.sub(rawCenter);
    model.scale.setScalar(scaleFactor);
    model.updateMatrixWorld(true);

    const scaledBox = new THREE.Box3().setFromObject(model);
    model.position.y -= scaledBox.min.y;
    model.updateMatrixWorld(true);

    return model;
  }

  async function loadModel(GLTFLoader) {
    const loader = new GLTFLoader();

    return new Promise((resolve, reject) => {
      loader.load(
        MODEL_URL,
        (gltf) => resolve(gltf),
        undefined,
        (error) => reject(error)
      );
    });
  }

  async function initialiseThreeViewer(mount, elements, token) {
    const { frame, canvas, hint, badge } = elements;
    const { THREE, GLTFLoader } = await loadDependencies();

    if (token.destroyed) {
      return {
        destroy() {}
      };
    }

    const compactViewport = window.matchMedia("(max-width: 760px)").matches;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !compactViewport,
      powerPreference: "high-performance"
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, compactViewport ? 1.25 : 1.75)
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x021221, 18, 48);

    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 120);

    const ambient = new THREE.HemisphereLight(0x94eaf2, 0x03111d, 1.15);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xb3ffff, 1.7);
    key.position.set(-18, 20, 10);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x3ec7e0, 0.55);
    fill.position.set(12, 8, -16);
    scene.add(fill);

    const terrainRoot = new THREE.Group();
    scene.add(terrainRoot);

    const groundGlow = new THREE.Mesh(
      new THREE.CircleGeometry(18, 60),
      new THREE.MeshBasicMaterial({
        color: 0x0d4e62,
        transparent: true,
        opacity: 0.14,
        depthWrite: false
      })
    );
    groundGlow.rotation.x = -Math.PI * 0.5;
    groundGlow.position.y = -0.02;
    scene.add(groundGlow);

    setBadge(badge, "Loading 3D terrain…");

    const gltf = await loadModel(GLTFLoader);
    if (token.destroyed) {
      renderer.dispose();
      return {
        destroy() {}
      };
    }

    const model = gltf.scene || gltf.scenes?.[0];
    if (!model) {
      throw new Error("The uploaded glTF scene is empty.");
    }

    const terrainMaterial = new THREE.MeshStandardMaterial({
      color: 0x0d3f52,
      emissive: 0x041c2e,
      emissiveIntensity: 0.42,
      roughness: 0.94,
      metalness: 0.04,
      transparent: true,
      opacity: 0.97,
      side: THREE.DoubleSide
    });

    model.traverse((node) => {
      if (!node.isMesh) return;
      node.castShadow = false;
      node.receiveShadow = false;
      node.material = terrainMaterial;
    });

    normaliseTerrainModel(THREE, model);
    terrainRoot.add(model);

    const decor = buildTerrainDecorations(THREE, terrainRoot);
    const target = decor.target;
    const size = decor.size;
    const orbitRadiusBase = Math.max(size.x, size.z) * 0.72;
    const targetLift = size.y * 0.30;

    const state = {
      azimuth: FRONT_AZIMUTH,
      velocity: 0,
      dragging: false,
      pointerId: null,
      lastX: 0,
      lastTime: 0,
      destroyed: false,
      width: 0,
      height: 0,
      animationFrame: 0
    };

    function resize() {
      const rect = frame.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * pixelRatio));
      const height = Math.max(1, Math.round(rect.height * pixelRatio));

      if (state.width === width && state.height === height) return;

      state.width = width;
      state.height = height;
      renderer.setSize(rect.width, rect.height, false);
      renderer.setPixelRatio(pixelRatio);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function render() {
      if (state.destroyed) return;

      resize();

      if (!state.dragging && Math.abs(state.velocity) > 0.001) {
        state.azimuth += state.velocity;
        state.velocity *= 0.92;
      }

      const angle = (state.azimuth % 360) * DEG;
      const aspect = state.width / Math.max(1, state.height);
      const portraitBoost = clamp((1.05 - aspect) * 2.5, 0, 1.6);
      const orbitRadius = orbitRadiusBase + portraitBoost * 3.4;
      camera.fov = aspect < 0.82 ? 52 : aspect < 1.12 ? 48 : 45;
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
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
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
      hideHint(hint);
      state.azimuth = FRONT_AZIMUTH;
      state.velocity = 0;
    });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(frame);

    setBadge(badge, "3D terrain loaded", true);
    window.setTimeout(() => {
      badge.style.opacity = "0";
    }, 1800);
    window.setTimeout(() => {
      hideHint(hint);
    }, 2600);

    mount.dataset.rfGraphLoaded = "true";
    mount.dataset.rfGraphVersion = VERSION;
    mount.dataset.rfGraphMode = MODE;
    mount.dispatchEvent(
      new CustomEvent(RENDERED_EVENT, {
        bubbles: true,
        detail: {
          version: VERSION,
          selectedPathId: SELECTED_PATH_ID,
          mode: MODE
        }
      })
    );

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
          if (node.geometry && typeof node.geometry.dispose === "function") {
            node.geometry.dispose();
          }
          if (node.material) {
            if (Array.isArray(node.material)) {
              node.material.forEach((material) => {
                if (material && typeof material.dispose === "function") {
                  material.dispose();
                }
              });
            } else if (typeof node.material.dispose === "function") {
              node.material.dispose();
            }
          }
        });
      }
    };
  }

  async function initialiseMount(mount) {
    if (!mount || mount.dataset.rfGraphInit === VERSION) return;

    if (
      mount._rfGraphViewer &&
      typeof mount._rfGraphViewer.destroy === "function"
    ) {
      mount._rfGraphViewer.destroy();
    }

    mount.dataset.rfGraphInit = VERSION;
    removeLegacyKey(mount);

    const token = { destroyed: false };
    const elements = buildFrame(mount);

    try {
      mount._rfGraphViewer = await initialiseThreeViewer(mount, elements, token);
    } catch (error) {
      console.error("FieldOps RF glTF viewer failed:", error);
      buildFallback(mount);
    }
  }

  function initAll(root = document) {
    root.querySelectorAll(MOUNT_SELECTOR).forEach((mount) => {
      initialiseMount(mount);
    });
  }

  window.FieldOpsRFGraph = {
    VERSION,
    init: initialiseMount,
    initAll
  };

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => initAll(),
      { once: true }
    );
  } else {
    initAll();
  }
})();

/* Destination: FieldOpsAtlas/Features/RF/rf-graph.js */
/* End of file: FieldOpsAtlas/Features/RF/rf-graph.js */

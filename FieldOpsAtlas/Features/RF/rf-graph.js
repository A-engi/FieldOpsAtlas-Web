/* ==========================================================================
   FieldOps Atlas RF 3D orbit renderer
   File: FieldOpsAtlas/Features/RF/rf-graph.js
   Version: 1.1.167-aim-rim-glow

   Purpose:
   - Keep the uploaded ready-made glTF mountain geometry unchanged.
   - Derive contour bands, facet edges, and short downhill runoff strokes from
     the mountain mesh itself so the linework stays attached through 360 orbit.
   - Preserve the RF graph mount selector, fallback, orbit interaction, and
     rendered-event contract.
   ========================================================================== */
(() => {
  "use strict";

  const VERSION = "1.1.167-aim-rim-glow";
  const MOUNT_SELECTOR = "[data-rf-graph]";
  const MAP_PAPER_SELECTOR = ".rf-map-paper";
  const LEGACY_KEY_SELECTOR = ".rf-graph-key";
  const RENDERED_EVENT = "fieldops:rf-graph-rendered";
  const SELECTED_PATH_ID = "site-1-to-site-2";
  const MODE = "three-gltf-aim-rim-glow";
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
      "Static RF mountain fallback graphic with contour lines."
    );
    fallback.style.cssText =
      "display:grid;place-items:center;width:100%;height:100%;min-height:300px;background:#010a12;overflow:hidden";
    fallback.innerHTML = `
      <svg viewBox="0 0 1000 620" width="100%" height="100%" aria-hidden="true">
        <defs>
          <linearGradient id="rfFallbackMountain" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#0b5366"/>
            <stop offset="1" stop-color="#021521"/>
          </linearGradient>
          <filter id="rfContourGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="1000" height="620" fill="#010a12"/>
        <path d="M-70 570 L72 522 L176 470 L266 380 L350 246 L430 342 L520 432 L624 520 L760 570 Z" fill="url(#rfFallbackMountain)"/>
        <g fill="none" stroke="#45e8ff" stroke-width="3" opacity=".72" filter="url(#rfContourGlow)">
          <path d="M72 522 C196 482 270 452 350 412 C420 378 490 400 572 470"/>
          <path d="M120 486 C216 442 282 406 350 360 C418 326 478 354 534 414"/>
          <path d="M190 438 C256 396 312 350 350 306 C398 294 440 320 478 362"/>
          <path d="M270 372 C314 334 340 294 350 252 C376 280 400 308 424 336"/>
          <path d="M214 476 L306 384 M286 438 L356 344 M390 402 L452 448"/>
        </g>
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
      "Interactive 3D RF mountain model with dark filled faces, live contour lines, and edge glow. Drag left or right to orbit 360 degrees."
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
      transparent: true,
      opacity,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending
    });

    const lines = new THREE.LineSegments(geometry, material);
    lines.renderOrder = 4;
    return lines;
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
      transparent: true,
      opacity,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const cloud = new THREE.Points(geometry, material);
    cloud.renderOrder = 4;
    return cloud;
  }

  function collectTerrainMeshes(root) {
    const meshes = [];
    root.updateMatrixWorld(true);
    root.traverse((node) => {
      if (node.isMesh && node.geometry?.attributes?.position) {
        meshes.push(node);
      }
    });
    return meshes;
  }

  function readWorldVertex(THREE, mesh, attribute, index, target) {
    target.fromBufferAttribute(attribute, index).applyMatrix4(mesh.matrixWorld);
    return target;
  }

  function forEachWorldTriangle(THREE, meshes, callback) {
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const c = new THREE.Vector3();

    meshes.forEach((mesh) => {
      const geometry = mesh.geometry;
      const position = geometry.attributes.position;
      const index = geometry.index;
      const triangleCount = index
        ? Math.floor(index.count / 3)
        : Math.floor(position.count / 3);
      const step = Math.max(1, Math.ceil(triangleCount / 9000));

      for (let triangle = 0; triangle < triangleCount; triangle += step) {
        const offset = triangle * 3;
        const ia = index ? index.getX(offset) : offset;
        const ib = index ? index.getX(offset + 1) : offset + 1;
        const ic = index ? index.getX(offset + 2) : offset + 2;

        readWorldVertex(THREE, mesh, position, ia, a);
        readWorldVertex(THREE, mesh, position, ib, b);
        readWorldVertex(THREE, mesh, position, ic, c);
        callback(a, b, c, triangle, mesh);
      }
    });
  }

  function intersectTriangleAtHeight(THREE, a, b, c, level, epsilon) {
    const intersections = [];

    function intersectEdge(start, end) {
      const startDelta = start.y - level;
      const endDelta = end.y - level;

      if (Math.abs(startDelta) < 0.000001 && Math.abs(endDelta) < 0.000001) {
        return;
      }

      if ((startDelta > 0 && endDelta > 0) || (startDelta < 0 && endDelta < 0)) {
        return;
      }

      const denominator = end.y - start.y;
      if (Math.abs(denominator) < 0.000001) return;
      const t = clamp((level - start.y) / denominator, 0, 1);
      intersections.push(
        new THREE.Vector3(
          start.x + (end.x - start.x) * t,
          level + epsilon,
          start.z + (end.z - start.z) * t
        )
      );
    }

    intersectEdge(a, b);
    intersectEdge(b, c);
    intersectEdge(c, a);

    if (intersections.length < 2) return null;

    let bestA = intersections[0];
    let bestB = intersections[1];
    let bestDistance = bestA.distanceToSquared(bestB);

    for (let i = 0; i < intersections.length; i += 1) {
      for (let j = i + 1; j < intersections.length; j += 1) {
        const distance = intersections[i].distanceToSquared(intersections[j]);
        if (distance > bestDistance) {
          bestDistance = distance;
          bestA = intersections[i];
          bestB = intersections[j];
        }
      }
    }

    return bestDistance > 0.000001 ? [bestA, bestB] : null;
  }

  function createElevationContours(THREE, meshes, box, size) {
    const segments = [];
    const levelCount = 14;
    const epsilon = Math.max(size.y * 0.0042, 0.016);
    const levels = [];
    const centroid = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const edgeAB = new THREE.Vector3();
    const edgeAC = new THREE.Vector3();

    for (let index = 0; index < levelCount; index += 1) {
      const t = index / (levelCount - 1);
      levels.push(box.min.y + size.y * (0.18 + t * 0.68));
    }

    forEachWorldTriangle(THREE, meshes, (a, b, c) => {
      centroid.copy(a).add(b).add(c).multiplyScalar(1 / 3);
      const heightRatio = (centroid.y - box.min.y) / Math.max(size.y, 0.0001);
      edgeAB.subVectors(b, a);
      edgeAC.subVectors(c, a);
      normal.crossVectors(edgeAB, edgeAC).normalize();
      if (normal.y < 0) normal.multiplyScalar(-1);
      const slope = 1 - clamp(normal.y, 0, 1);

      if (heightRatio < 0.18 || slope < 0.10) return;

      const minY = Math.min(a.y, b.y, c.y);
      const maxY = Math.max(a.y, b.y, c.y);

      levels.forEach((level) => {
        if (level <= minY || level >= maxY) return;
        const segment = intersectTriangleAtHeight(
          THREE,
          a,
          b,
          c,
          level,
          epsilon
        );
        if (!segment) return;
        segments.push(
          segment[0].x,
          segment[0].y,
          segment[0].z,
          segment[1].x,
          segment[1].y,
          segment[1].z
        );
      });
    });

    return segments;
  }

  function createRunoffSegments(THREE, meshes, box, size) {
    const segments = [];
    const normal = new THREE.Vector3();
    const edgeAB = new THREE.Vector3();
    const edgeAC = new THREE.Vector3();
    const centroid = new THREE.Vector3();
    const downhill = new THREE.Vector3();
    const down = new THREE.Vector3(0, -1, 0);
    const maxSegments = 220;
    const epsilon = Math.max(size.y * 0.006, 0.022);

    forEachWorldTriangle(THREE, meshes, (a, b, c, triangle) => {
      if (segments.length / 6 >= maxSegments) return;

      edgeAB.subVectors(b, a);
      edgeAC.subVectors(c, a);
      normal.crossVectors(edgeAB, edgeAC).normalize();
      if (normal.y < 0) normal.multiplyScalar(-1);

      const slope = 1 - clamp(normal.y, 0, 1);
      centroid.copy(a).add(b).add(c).multiplyScalar(1 / 3);
      const heightRatio = (centroid.y - box.min.y) / Math.max(size.y, 0.0001);

      const selector = Math.abs(
        Math.sin(
          centroid.x * 12.9898 +
          centroid.z * 78.233 +
          triangle * 0.173
        )
      );

      if (
        heightRatio < 0.22 ||
        heightRatio > 0.92 ||
        slope < 0.36 ||
        selector < 0.953
      ) {
        return;
      }

      downhill.copy(down).addScaledVector(normal, normal.y).normalize();
      if (!Number.isFinite(downhill.x) || downhill.lengthSq() < 0.01) return;

      const length = size.x * (0.010 + slope * 0.018) * (0.68 + selector * 0.24);
      const start = centroid
        .clone()
        .addScaledVector(downhill, -length * 0.24)
        .addScaledVector(normal, epsilon);
      const end = centroid
        .clone()
        .addScaledVector(downhill, length * 0.76)
        .addScaledVector(normal, epsilon);

      segments.push(start.x, start.y, start.z, end.x, end.y, end.z);
    });

    return segments;
  }

  function addFacetEdges(THREE, meshes, terrainRoot) {
    const materials = [];

    meshes.forEach((mesh) => {
      const softMaterial = new THREE.LineBasicMaterial({
        color: 0x1ecce5,
        transparent: true,
        opacity: 0.20,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      const hardMaterial = new THREE.LineBasicMaterial({
        color: 0x67efff,
        transparent: true,
        opacity: 0.68,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });

      const softEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(mesh.geometry, 10),
        softMaterial
      );
      const hardEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(mesh.geometry, 24),
        hardMaterial
      );

      softEdges.renderOrder = 3;
      hardEdges.renderOrder = 4;
      softEdges.scale.setScalar(1.0015);
      hardEdges.scale.setScalar(1.0022);
      mesh.add(softEdges, hardEdges);
      materials.push(softMaterial, hardMaterial);
    });

    terrainRoot.updateMatrixWorld(true);
    return materials;
  }

  function addRimGlow(THREE, model, terrainRoot) {
    const materials = [];

    model.traverse((node) => {
      if (!node.isMesh || node.userData.rfDecoration) return;

      const rimMaterial = new THREE.MeshBasicMaterial({
        color: 0x67efff,
        transparent: true,
        opacity: 0.09,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });

      const rim = new THREE.Mesh(node.geometry, rimMaterial);
      rim.userData.rfDecoration = true;
      rim.renderOrder = 2;
      rim.scale.setScalar(1.01);
      node.add(rim);
      materials.push(rimMaterial);
    });

    terrainRoot.updateMatrixWorld(true);
    return materials;
  }

  function buildSurfaceRoute(THREE, terrainRoot, box, size, center) {
    const raycaster = new THREE.Raycaster();
    const down = new THREE.Vector3(0, -1, 0);
    const origin = new THREE.Vector3();
    const pathSamples = [];
    const pathSteps = 38;
    const zStart = box.max.z - size.z * 0.07;
    const zEnd = box.min.z + size.z * 0.16;
    const offset = Math.max(size.y * 0.012, 0.035);

    for (let index = 0; index < pathSteps; index += 1) {
      const t = index / (pathSteps - 1);
      const x =
        center.x +
        Math.sin(t * Math.PI * 2.55) * size.x * 0.034 +
        Math.sin(t * Math.PI * 5.1) * size.x * 0.008;
      const z = zStart + (zEnd - zStart) * t;
      origin.set(x, box.max.y + size.y * 0.40, z);
      raycaster.set(origin, down);
      const hit = raycaster.intersectObject(terrainRoot, true).find((entry) => {
        return entry.object?.isMesh && !entry.object.userData.rfDecoration;
      });

      if (hit) {
        pathSamples.push(hit.point.clone().addScaledVector(hit.face?.normal || new THREE.Vector3(0, 1, 0), offset));
      } else {
        pathSamples.push(
          new THREE.Vector3(
            x,
            box.min.y + size.y * (0.08 + Math.sin(t * Math.PI) * 0.04),
            z
          )
        );
      }
    }

    const curve = new THREE.CatmullRomCurve3(pathSamples, false, "centripetal");
    const ribbonMaterial = new THREE.MeshBasicMaterial({
      color: 0x22ddeb,
      transparent: true,
      opacity: 0.09,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x9afaff,
      transparent: true,
      opacity: 0.76,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const ribbon = new THREE.Mesh(
      new THREE.TubeGeometry(
        curve,
        64,
        Math.max(size.x * 0.0022, 0.055),
        6,
        false
      ),
      ribbonMaterial
    );
    ribbon.userData.rfDecoration = true;
    ribbon.renderOrder = 5;

    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(96)),
      lineMaterial
    );
    line.userData.rfDecoration = true;
    line.renderOrder = 6;

    const markerPositions = [];
    pathSamples.forEach((point, index) => {
      if (index % 4 === 0) {
        markerPositions.push(point.x, point.y, point.z);
      }
    });
    const markers = createPointCloud(
      THREE,
      markerPositions,
      0xc4fdff,
      Math.max(size.x * 0.0065, 0.075),
      0.70
    );
    markers.userData.rfDecoration = true;

    return {
      objects: [ribbon, line, markers],
      pulseMaterials: [ribbonMaterial, lineMaterial, markers.material]
    };
  }

  function buildTerrainDecorations(THREE, terrainRoot) {
    terrainRoot.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(terrainRoot);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const target = new THREE.Vector3(
      center.x,
      box.min.y + size.y * 0.31,
      center.z
    );
    const meshes = collectTerrainMeshes(terrainRoot).filter((mesh) => {
      return !mesh.userData.rfDecoration;
    });
    const pulseMaterials = [];

    const contourSegments = createElevationContours(
      THREE,
      meshes,
      box,
      size
    );
    if (contourSegments.length) {
      const contours = createLineSegments(
        THREE,
        contourSegments,
        0x6cefff,
        0.34
      );
      contours.userData.rfDecoration = true;
      terrainRoot.add(contours);
      pulseMaterials.push(contours.material);
    }

    const runoffSegments = createRunoffSegments(
      THREE,
      meshes,
      box,
      size
    );
    if (runoffSegments.length) {
      const runoffGlow = createLineSegments(
        THREE,
        runoffSegments,
        0x24d4ef,
        0.14
      );
      const runoffLines = createLineSegments(
        THREE,
        runoffSegments,
        0xb8fbff,
        0.46
      );
      runoffGlow.userData.rfDecoration = true;
      runoffLines.userData.rfDecoration = true;
      runoffGlow.renderOrder = 4;
      runoffLines.renderOrder = 5;
      terrainRoot.add(runoffGlow, runoffLines);
      pulseMaterials.push(runoffGlow.material, runoffLines.material);
    }

    pulseMaterials.push(...addFacetEdges(THREE, meshes, terrainRoot));
    pulseMaterials.push(...addRimGlow(THREE, terrainRoot, terrainRoot));

    const route = buildSurfaceRoute(
      THREE,
      terrainRoot,
      box,
      size,
      center
    );
    route.objects.forEach((object) => terrainRoot.add(object));
    pulseMaterials.push(...route.pulseMaterials);

    return {
      box,
      size,
      center,
      target,
      pulseMaterials
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
      return { destroy() {} };
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
    scene.fog = new THREE.Fog(0x021221, 18, 50);

    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 120);

    const ambient = new THREE.HemisphereLight(0x94eaf2, 0x03111d, 1.08);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xb3ffff, 1.55);
    key.position.set(-18, 20, 10);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x3ec7e0, 0.48);
    fill.position.set(12, 8, -16);
    scene.add(fill);

    const terrainRoot = new THREE.Group();
    scene.add(terrainRoot);


    setBadge(badge, "Loading 3D terrain…");

    const gltf = await loadModel(GLTFLoader);
    if (token.destroyed) {
      renderer.dispose();
      return { destroy() {} };
    }

    const model = gltf.scene || gltf.scenes?.[0];
    if (!model) {
      throw new Error("The uploaded glTF scene is empty.");
    }

    const terrainMaterial = new THREE.MeshStandardMaterial({
      color: 0x133e50,
      emissive: 0x041a27,
      emissiveIntensity: 0.34,
      roughness: 0.93,
      metalness: 0.02,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
      flatShading: true
    });

    model.traverse((node) => {
      if (!node.isMesh) return;
      node.castShadow = false;
      node.receiveShadow = false;
      node.material = terrainMaterial;
      node.userData.rfDecoration = false;
    });

    normaliseTerrainModel(THREE, model);
    terrainRoot.add(model);
    terrainRoot.updateMatrixWorld(true);

    const decor = buildTerrainDecorations(THREE, terrainRoot);
    const target = decor.target;
    const size = decor.size;
    const orbitRadiusBase = Math.max(size.x, size.z) * 0.72;
    const targetLift = size.y * 0.31;

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
      const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        compactViewport ? 1.25 : 1.75
      );
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

    function render(time = 0) {
      if (state.destroyed) return;

      resize();

      if (!state.dragging && Math.abs(state.velocity) > 0.001) {
        state.azimuth += state.velocity;
        state.velocity *= 0.92;
      }

      const pulse = 0.5 + Math.sin(time * 0.00135) * 0.5;
      decor.pulseMaterials.forEach((material, index) => {
        const base = material.userData.rfBaseOpacity ?? material.opacity;
        if (material.userData.rfBaseOpacity === undefined) {
          material.userData.rfBaseOpacity = base;
        }
        const amount = index % 3 === 0 ? 0.09 : 0.045;
        material.opacity = clamp(base + pulse * amount, 0, 1);
      });
      terrainMaterial.emissiveIntensity = 0.30 + pulse * 0.05;

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

    setBadge(badge, "Aim-style contours loaded", true);
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
      mount._rfGraphViewer = await initialiseThreeViewer(
        mount,
        elements,
        token
      );
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

/* ==========================================================================
   FieldOps Atlas RF 3D orbit renderer
   File: FieldOpsAtlas/Features/RF/rf-graph.js
   Version: 1.1.184-bottom-anchored

   Purpose:
   - Keep the uploaded ready-made glTF mountain geometry unchanged.
   - Cover the uploaded mountain with evenly spaced dots plus broken connected
     chevrons.
   - Estimate moon exposure from a bird's-eye/top-down pass first, then render
     the result back on the sideways mountain so main summits and ridge peaks
     catch more light without blowing the whole surface out.
   - Remove the pre-load RF background image before WebGL initialises.
   - Preserve the RF graph mount selector, error fallback, orbit interaction,
     and rendered-event contract.
   ========================================================================== */
(() => {
  "use strict";

  const VERSION = "1.1.184-bottom-anchored";
  const MOUNT_SELECTOR = "[data-rf-graph]";
  const MAP_PAPER_SELECTOR = ".rf-map-paper";
  const LEGACY_KEY_SELECTOR = ".rf-graph-key";
  const RENDERED_EVENT = "fieldops:rf-graph-rendered";
  const SELECTED_PATH_ID = "site-1-to-site-2";
  const MODE = "three-gltf-broken-connected-wireframe";
  const MODEL_URL = "../../Feature/RF/scene-mobile-v1.1.163.gltf";
  const THREE_MODULE_URL = "three";
  const GLTF_LOADER_URL = "three/addons/loaders/GLTFLoader.js";

  const DEG = Math.PI / 180;
  const FRONT_AZIMUTH = 0;

  let dependencyPromise = null;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function removePreloadBackground(mount) {
    const mapPaper = mount.closest(MAP_PAPER_SELECTOR);
    if (!mapPaper) return;

    mapPaper
      .querySelectorAll(":scope > .rf-map-background")
      .forEach((node) => node.remove());
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
      "background-image:linear-gradient(rgba(29,145,165,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(29,145,165,.045) 1px,transparent 1px)",
      "background-size:56px 56px,56px 56px",
      "touch-action:none",
      "user-select:none"
    ].join(";");

    const canvas = document.createElement("canvas");
    canvas.className = "rf-webgl-orbit-canvas";
    canvas.setAttribute("role", "img");
    canvas.setAttribute(
      "aria-label",
      "Interactive 3D RF terrain reusing the current mountains, widened to fill the frame with a lower composition, a flat foreground radar grid, and a diagonal glowing river path through the valley. Drag left or right to orbit 360 degrees."
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
      const step = 1;

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
    const levelCount = 10;
    const epsilon = Math.max(size.y * 0.0042, 0.016);
    const levels = [];
    const centroid = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const edgeAB = new THREE.Vector3();
    const edgeAC = new THREE.Vector3();

    for (let index = 0; index < levelCount; index += 1) {
      const t = index / (levelCount - 1);
      levels.push(box.min.y + size.y * (0.22 + t * 0.60));
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
    const maxSegments = 145;
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
        selector < 0.972
      ) {
        return;
      }

      downhill.copy(down).addScaledVector(normal, normal.y).normalize();
      if (!Number.isFinite(downhill.x) || downhill.lengthSq() < 0.01) return;

      const length = size.x * (0.008 + slope * 0.014) * (0.64 + selector * 0.20);
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
      const secondaryMaterial = new THREE.LineBasicMaterial({
        color: 0x1c8797,
        transparent: true,
        opacity: 0.018,
        depthWrite: false,
        depthTest: true,
        blending: THREE.NormalBlending
      });
      const majorMaterial = new THREE.LineBasicMaterial({
        color: 0x61d9e8,
        transparent: true,
        opacity: 0.095,
        depthWrite: false,
        depthTest: true,
        blending: THREE.AdditiveBlending
      });

      const secondaryEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(mesh.geometry, 18),
        secondaryMaterial
      );
      const majorEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(mesh.geometry, 38),
        majorMaterial
      );

      secondaryEdges.userData.rfDecoration = true;
      majorEdges.userData.rfDecoration = true;
      secondaryEdges.renderOrder = 3;
      majorEdges.renderOrder = 4;
      secondaryEdges.scale.setScalar(1.0009);
      majorEdges.scale.setScalar(1.0014);
      mesh.add(secondaryEdges, majorEdges);
      materials.push(secondaryMaterial, majorMaterial);
    });

    terrainRoot.updateMatrixWorld(true);
    return materials;
  }

  function addRimGlow(THREE, model, terrainRoot) {
    const materials = [];

    model.traverse((node) => {
      if (!node.isMesh || node.userData.rfDecoration) return;

      const rimMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uColour: { value: new THREE.Color(0x78e7f3) },
          uOpacity: { value: 0.24 }
        },
        vertexShader: `
          varying vec3 vNormalView;
          varying vec3 vViewDirection;

          void main() {
            vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
            vNormalView = normalize(normalMatrix * normal);
            vViewDirection = normalize(-viewPosition.xyz);
            gl_Position = projectionMatrix * viewPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 uColour;
          uniform float uOpacity;
          varying vec3 vNormalView;
          varying vec3 vViewDirection;

          void main() {
            float facing = max(dot(normalize(vNormalView), normalize(vViewDirection)), 0.0);
            float rim = pow(1.0 - facing, 3.4);
            float alpha = smoothstep(0.26, 0.92, rim) * uOpacity;
            if (alpha < 0.006) discard;
            gl_FragColor = vec4(uColour, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        depthTest: true,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending
      });

      const rim = new THREE.Mesh(node.geometry, rimMaterial);
      rim.userData.rfDecoration = true;
      rim.renderOrder = 3;
      rim.scale.setScalar(1.0018);
      node.add(rim);
      materials.push(rimMaterial);
    });

    terrainRoot.updateMatrixWorld(true);
    return materials;
  }

  function buildPeakDots(THREE, meshes, box, size) {
    const summitHaloPositions = [];
    const summitGlowPositions = [];
    const summitCorePositions = [];
    const centroid = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const edgeAB = new THREE.Vector3();
    const edgeAC = new THREE.Vector3();
    const lifted = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    const bitangent = new THREE.Vector3();

    forEachWorldTriangle(THREE, meshes, (a, b, c, triangle) => {
      centroid.copy(a).add(b).add(c).multiplyScalar(1 / 3);
      edgeAB.subVectors(b, a);
      edgeAC.subVectors(c, a);
      normal.crossVectors(edgeAB, edgeAC).normalize();
      if (normal.y < 0) normal.multiplyScalar(-1);

      const slope = 1 - clamp(normal.y, 0, 1);
      const heightRatio = (centroid.y - box.min.y) / Math.max(size.y, 0.0001);
      if (heightRatio < 0.62 || slope < 0.10) return;

      const selector = Math.abs(
        Math.sin(
          centroid.x * 9.613 +
          centroid.y * 5.841 +
          centroid.z * 3.917 +
          triangle * 0.173
        )
      );

      const summitThreshold = heightRatio > 0.90 ? 0.42 : heightRatio > 0.82 ? 0.56 : heightRatio > 0.72 ? 0.70 : 0.84;
      if (selector < summitThreshold) return;

      tangent.copy(edgeAB).normalize();
      bitangent.copy(normal).cross(tangent).normalize();
      lifted.copy(centroid).addScaledVector(normal, Math.max(size.y * 0.0035, 0.014));

      const angle = selector * Math.PI * 2.0 + triangle * 0.131;
      const dir = tangent.clone().multiplyScalar(Math.cos(angle)).add(bitangent.clone().multiplyScalar(Math.sin(angle))).normalize();
      const spreadBase = Math.max(size.x * 0.0013, 0.017);
      const outerSpread = spreadBase * (0.85 + (1 - heightRatio) * 0.95);
      const innerSpread = spreadBase * (0.30 + (1 - heightRatio) * 0.35);
      const halo = lifted.clone().addScaledVector(dir, outerSpread);
      const glowA = lifted.clone().addScaledVector(dir, innerSpread);
      const glowB = lifted.clone().addScaledVector(dir, -innerSpread * 0.72);

      summitHaloPositions.push(halo.x, halo.y, halo.z);
      summitGlowPositions.push(lifted.x, lifted.y, lifted.z);

      if (heightRatio > 0.72 || selector > 0.82) {
        summitGlowPositions.push(glowA.x, glowA.y, glowA.z);
      }

      if (heightRatio > 0.80 && selector > 0.74) {
        summitGlowPositions.push(glowB.x, glowB.y, glowB.z);
      }

      if (heightRatio > 0.86 && selector > 0.84) {
        const core = lifted.clone().addScaledVector(dir, innerSpread * 0.18);
        summitCorePositions.push(core.x, core.y, core.z);
      }
    });

    const objects = [];

    if (summitHaloPositions.length) {
      const haloDots = createPointCloud(
        THREE,
        summitHaloPositions,
        0x4fb4c7,
        Math.max(size.x * 0.0026, 0.034),
        0.065
      );
      haloDots.userData.rfDecoration = true;
      haloDots.renderOrder = 4;
      objects.push(haloDots);
    }

    if (summitGlowPositions.length) {
      const glowDots = createPointCloud(
        THREE,
        summitGlowPositions,
        0x72ddec,
        Math.max(size.x * 0.0022, 0.029),
        0.16
      );
      glowDots.userData.rfDecoration = true;
      glowDots.renderOrder = 5;
      objects.push(glowDots);
    }

    if (summitCorePositions.length) {
      const coreDots = createPointCloud(
        THREE,
        summitCorePositions,
        0xe2feff,
        Math.max(size.x * 0.00145, 0.020),
        0.54
      );
      coreDots.userData.rfDecoration = true;
      coreDots.renderOrder = 6;
      objects.push(coreDots);
    }

    return objects;
  }

  function buildRadarTriangles(THREE, meshes, box, size) {
    const positions = [];
    const up = new THREE.Vector3(0, 1, 0);
    const centroid = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const edgeAB = new THREE.Vector3();
    const edgeAC = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    const bitangent = new THREE.Vector3();
    const centre = new THREE.Vector3();
    const p1 = new THREE.Vector3();
    const p2 = new THREE.Vector3();
    const p3 = new THREE.Vector3();

    forEachWorldTriangle(THREE, meshes, (a, b, c, triangle) => {
      centroid.copy(a).add(b).add(c).multiplyScalar(1 / 3);
      edgeAB.subVectors(b, a);
      edgeAC.subVectors(c, a);
      normal.crossVectors(edgeAB, edgeAC).normalize();
      if (normal.y < 0) normal.multiplyScalar(-1);

      const slope = 1 - clamp(normal.y, 0, 1);
      const heightRatio = (centroid.y - box.min.y) / Math.max(size.y, 0.0001);
      if (heightRatio < 0.18 || heightRatio > 0.74 || slope < 0.14) return;

      const selector = Math.abs(
        Math.sin(
          centroid.x * 11.121 +
          centroid.y * 6.173 +
          centroid.z * 3.417 +
          triangle * 0.191
        )
      );
      if (selector < 0.76) return;

      tangent.crossVectors(Math.abs(normal.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : up, normal).normalize();
      bitangent.crossVectors(normal, tangent).normalize();

      const angle = selector * Math.PI * 2.0 + triangle * 0.13;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const dirA = tangent.clone().multiplyScalar(cos).add(bitangent.clone().multiplyScalar(sin)).normalize();
      const dirB = tangent.clone().multiplyScalar(Math.cos(angle + Math.PI * 2 / 3)).add(bitangent.clone().multiplyScalar(Math.sin(angle + Math.PI * 2 / 3))).normalize();
      const dirC = tangent.clone().multiplyScalar(Math.cos(angle + Math.PI * 4 / 3)).add(bitangent.clone().multiplyScalar(Math.sin(angle + Math.PI * 4 / 3))).normalize();

      const radius = Math.max(size.x * (0.0018 + selector * 0.0018), 0.020) * (0.78 + heightRatio * 0.55);
      centre.copy(centroid).addScaledVector(normal, Math.max(size.y * 0.0026, 0.010));
      p1.copy(centre).addScaledVector(dirA, radius);
      p2.copy(centre).addScaledVector(dirB, radius);
      p3.copy(centre).addScaledVector(dirC, radius);

      positions.push(
        p1.x, p1.y, p1.z,
        p2.x, p2.y, p2.z,
        p3.x, p3.y, p3.z
      );
    });

    if (!positions.length) return null;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.computeVertexNormals();

    const material = new THREE.MeshBasicMaterial({
      color: 0x56b9c9,
      transparent: true,
      opacity: 0.095,
      depthWrite: false,
      depthTest: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.rfDecoration = true;
    mesh.renderOrder = 4;
    return mesh;
  }

  function buildMoonDotField(THREE, meshes, box, size, compactViewport) {
    const samples = [];
    const occupied = new Set();
    const edgeAB = new THREE.Vector3();
    const edgeAC = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const point = new THREE.Vector3();
    const lifted = new THREE.Vector3();
    const spacing = Math.max(size.x / 98, 0.25);
    const cellSize = spacing * 0.82;
    const targetArea = spacing * spacing * 0.86;
    const epsilon = Math.max(size.y * 0.0028, 0.010);
    const maxPoints = compactViewport ? 7200 : 9800;

    function hash01(value) {
      const raw = Math.sin(value * 12.9898 + 78.233) * 43758.5453;
      return raw - Math.floor(raw);
    }

    function cellKey(position) {
      return [
        Math.round(position.x / cellSize),
        Math.round(position.y / cellSize),
        Math.round(position.z / cellSize)
      ].join(":");
    }

    forEachWorldTriangle(THREE, meshes, (a, b, c, triangle) => {
      edgeAB.subVectors(b, a);
      edgeAC.subVectors(c, a);
      normal.crossVectors(edgeAB, edgeAC);
      const doubleArea = normal.length();
      if (doubleArea < 0.000001) return;
      normal.multiplyScalar(1 / doubleArea);
      if (normal.y < 0) normal.multiplyScalar(-1);

      const area = doubleArea * 0.5;
      const expected = area / targetArea;
      let count = Math.floor(expected);
      const seed =
        triangle * 0.731 +
        (a.x + b.x + c.x) * 0.173 +
        (a.z + b.z + c.z) * 0.219;

      if (hash01(seed + 1.7) < expected - count) {
        count += 1;
      }
      count = Math.min(7, count);
      if (count === 0) return;

      for (let sample = 0; sample < count; sample += 1) {
        const u = hash01(seed + sample * 2.417 + 0.31);
        const v = hash01(seed + sample * 3.193 + 1.17);
        const rootU = Math.sqrt(u);
        const weightA = 1 - rootU;
        const weightB = rootU * (1 - v);
        const weightC = rootU * v;

        point.set(
          a.x * weightA + b.x * weightB + c.x * weightC,
          a.y * weightA + b.y * weightB + c.y * weightC,
          a.z * weightA + b.z * weightB + c.z * weightC
        );
        lifted.copy(point).addScaledVector(normal, epsilon);

        const key = cellKey(lifted);
        if (occupied.has(key)) continue;
        occupied.add(key);

        samples.push({
          position: lifted.clone(),
          normal: normal.clone(),
          heightRatio: clamp(
            (point.y - box.min.y) / Math.max(size.y, 0.0001),
            0,
            1
          )
        });
      }
    });

    if (!samples.length) return null;

    if (samples.length > maxPoints) {
      const thinned = [];
      const stride = samples.length / maxPoints;
      for (let index = 0; index < maxPoints; index += 1) {
        thinned.push(samples[Math.floor(index * stride)]);
      }
      samples.length = 0;
      samples.push(...thinned);
    }

    const gridSize = 56;
    const heightGrid = new Float32Array(gridSize * gridSize);
    heightGrid.fill(-Infinity);

    function gridCoordinate(position) {
      const gx = clamp(
        Math.floor(((position.x - box.min.x) / Math.max(size.x, 0.0001)) * gridSize),
        0,
        gridSize - 1
      );
      const gz = clamp(
        Math.floor(((position.z - box.min.z) / Math.max(size.z, 0.0001)) * gridSize),
        0,
        gridSize - 1
      );
      return [gx, gz];
    }

    samples.forEach((sample) => {
      const [gx, gz] = gridCoordinate(sample.position);
      const index = gz * gridSize + gx;
      heightGrid[index] = Math.max(heightGrid[index], sample.position.y);
    });

    const moonDirections = [
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0.24, 0.97, 0).normalize(),
      new THREE.Vector3(-0.24, 0.97, 0).normalize(),
      new THREE.Vector3(0, 0.97, 0.24).normalize(),
      new THREE.Vector3(0, 0.97, -0.24).normalize(),
      new THREE.Vector3(0.17, 0.97, 0.17).normalize(),
      new THREE.Vector3(-0.17, 0.97, 0.17).normalize(),
      new THREE.Vector3(0.17, 0.97, -0.17).normalize(),
      new THREE.Vector3(-0.17, 0.97, -0.17).normalize()
    ];

    const positions = [];
    const brightnessValues = [];
    const chevronPositions = [];
    const chevronBrightnessValues = [];
    const continuationPositions = [];
    const continuationBrightnessValues = [];
    const chevronRecords = [];
    const shadowRange = Math.max(size.y * 0.20, 0.001);
    const worldDown = new THREE.Vector3(0, -1, 0);
    const fallbackAxis = new THREE.Vector3(1, 0, 0);
    const downhill = new THREE.Vector3();
    const uphill = new THREE.Vector3();
    const side = new THREE.Vector3();
    const apex = new THREE.Vector3();
    const leftBase = new THREE.Vector3();
    const rightBase = new THREE.Vector3();

    samples.forEach((sample, sampleIndex) => {
      const [gx, gz] = gridCoordinate(sample.position);      let nearbyMaximum = sample.position.y;
      let nearbySum = sample.position.y;
      let nearbyCount = 1;

      for (let dz = -4; dz <= 4; dz += 1) {
        for (let dx = -4; dx <= 4; dx += 1) {
          if (dx === 0 && dz === 0) continue;
          const nx = gx + dx;
          const nz = gz + dz;
          if (nx < 0 || nx >= gridSize || nz < 0 || nz >= gridSize) continue;
          const candidate = heightGrid[nz * gridSize + nx];
          if (Number.isFinite(candidate)) {
            nearbyMaximum = Math.max(nearbyMaximum, candidate);
            nearbySum += candidate;
            nearbyCount += 1;
          }
        }
      }

      let broadMoon = 0;
      moonDirections.forEach((direction) => {
        broadMoon += Math.max(sample.normal.dot(direction), 0);
      });
      broadMoon /= moonDirections.length;
      broadMoon = Math.pow(clamp(broadMoon, 0, 1), 0.72);

      const nearbyMean = nearbySum / Math.max(nearbyCount, 1);
      const localDrop = Math.max(nearbyMaximum - sample.position.y, 0);
      const localShadow = clamp(localDrop / shadowRange, 0, 1);
      const shadowTransmission = 1 - localShadow * 0.24;
      const topFacing = clamp(sample.normal.y, 0, 1);
      const moonSpread = clamp(0.24 + broadMoon * 0.82, 0, 1);
      const summitProximity = clamp(
        1 - localDrop / Math.max(shadowRange * 0.28, 0.001),
        0,
        1
      );
      const ridgeProminence = clamp(
        (sample.position.y - nearbyMean) / Math.max(shadowRange * 0.58, 0.001),
        0,
        1
      );
      const summitBoost = Math.max(
        summitProximity * 0.75,
        ridgeProminence * 0.95
      ) * (0.38 + topFacing * 0.62);
      const peakCap = Math.pow(
        clamp((sample.heightRatio - 0.76) / 0.24, 0, 1),
        1.35
      );
      const heightLift = sample.heightRatio * 0.050;
      const brightness = clamp(
        0.115 +
          moonSpread * 0.60 * shadowTransmission +
          summitBoost * 0.29 +
          ridgeProminence * 0.08 +
          heightLift +
          peakCap * 0.08,
        0.10,
        1
      );

      positions.push(
        sample.position.x,
        sample.position.y,
        sample.position.z
      );
      brightnessValues.push(brightness);

      const chevronSelector = hash01(
        sampleIndex * 0.619 +
        sample.position.x * 0.173 +
        sample.position.y * 0.197 +
        sample.position.z * 0.229
      );

      if (chevronSelector > 0.42) {
        downhill
          .copy(worldDown)
          .addScaledVector(
            sample.normal,
            -worldDown.dot(sample.normal)
          );

        if (downhill.lengthSq() < 0.0025) {
          downhill.crossVectors(sample.normal, fallbackAxis);
          if (downhill.lengthSq() < 0.0025) {
            downhill.set(0, 0, -1);
          }
        }

        downhill.normalize();
        uphill.copy(downhill).multiplyScalar(-1);
        side.crossVectors(sample.normal, uphill).normalize();

        const sizeNoise = hash01(sampleIndex * 1.731 + 9.17);
        const widthNoise = hash01(sampleIndex * 2.119 + 4.63);
        const chevronScale = spacing * (1.26 + sizeNoise * 0.62);
        const halfWidth = chevronScale * (0.46 + widthNoise * 0.22);
        const rise = chevronScale * (0.70 + sizeNoise * 0.22);
        const baseDrop = rise * 0.52;
        const surfaceLift = epsilon * 0.72;

        apex
          .copy(sample.position)
          .addScaledVector(uphill, rise * 0.58)
          .addScaledVector(sample.normal, surfaceLift);
        leftBase
          .copy(sample.position)
          .addScaledVector(uphill, -baseDrop)
          .addScaledVector(side, halfWidth)
          .addScaledVector(sample.normal, surfaceLift);
        rightBase
          .copy(sample.position)
          .addScaledVector(uphill, -baseDrop)
          .addScaledVector(side, -halfWidth)
          .addScaledVector(sample.normal, surfaceLift);

        chevronPositions.push(
          leftBase.x, leftBase.y, leftBase.z,
          apex.x, apex.y, apex.z,
          apex.x, apex.y, apex.z,
          rightBase.x, rightBase.y, rightBase.z
        );

        const chevronBrightness = clamp(0.12 + brightness * 0.84, 0.12, 0.96);
        chevronBrightnessValues.push(
          chevronBrightness,
          chevronBrightness,
          chevronBrightness,
          chevronBrightness
        );

        chevronRecords.push({
          position: sample.position.clone(),
          apex: apex.clone(),
          left: leftBase.clone(),
          right: rightBase.clone(),
          uphill: uphill.clone(),
          side: side.clone(),
          brightness,
          selector: chevronSelector,
          gx,
          gz,
          index: sampleIndex
        });
      }
    });

    const chevronBuckets = new Map();
    function bucketKey(gx, gz) {
      return `${gx}:${gz}`;
    }

    chevronRecords.forEach((record, recordIndex) => {
      const key = bucketKey(record.gx, record.gz);
      if (!chevronBuckets.has(key)) {
        chevronBuckets.set(key, []);
      }
      chevronBuckets.get(key).push(recordIndex);
    });

    const offset = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const usedPairs = new Set();

    chevronRecords.forEach((record, recordIndex) => {
      const linkBudget = record.selector > 0.74 ? 2 : 1;
      const candidates = [];

      for (let dz = -2; dz <= 2; dz += 1) {
        for (let dx = -2; dx <= 2; dx += 1) {
          const bucket = chevronBuckets.get(bucketKey(record.gx + dx, record.gz + dz));
          if (!bucket) continue;

          bucket.forEach((neighborIndex) => {
            if (neighborIndex === recordIndex) return;
            const neighbor = chevronRecords[neighborIndex];
            offset.subVectors(neighbor.position, record.position);
            const distance = offset.length();
            if (distance < spacing * 0.45 || distance > spacing * 2.15) return;
            direction.copy(offset).normalize();

            const sideAlignment = Math.abs(direction.dot(record.side));
            const uphillAlignment = Math.abs(direction.dot(record.uphill));
            const continuity = Math.max(sideAlignment * 0.92, uphillAlignment * 0.82);
            if (continuity < 0.34) return;

            const hash = hash01(record.index * 0.143 + neighbor.index * 0.271 + distance * 0.77);
            const score =
              continuity * 0.72 +
              ((record.brightness + neighbor.brightness) * 0.5) * 0.18 +
              (1 - distance / (spacing * 2.15)) * 0.10 +
              hash * 0.04;

            candidates.push({
              neighborIndex,
              score,
              sideAlignment,
              uphillAlignment,
              directionX: direction.dot(record.side),
              directionUp: direction.dot(record.uphill)
            });
          });
        }
      }

      candidates.sort((a, b) => b.score - a.score);
      let linksMade = 0;

      for (const candidate of candidates) {
        if (linksMade >= linkBudget) break;
        const pairKey = recordIndex < candidate.neighborIndex
          ? `${recordIndex}:${candidate.neighborIndex}`
          : `${candidate.neighborIndex}:${recordIndex}`;
        if (usedPairs.has(pairKey)) continue;

        const neighbor = chevronRecords[candidate.neighborIndex];
        let startPoint;
        let endPoint;

        if (candidate.sideAlignment >= candidate.uphillAlignment) {
          if (candidate.directionX >= 0) {
            startPoint = record.right;
            endPoint = neighbor.left;
          } else {
            startPoint = record.left;
            endPoint = neighbor.right;
          }
        } else {
          startPoint = record.apex;
          if (candidate.directionUp >= 0) {
            endPoint = neighbor.apex;
          } else {
            endPoint = candidate.directionX >= 0 ? neighbor.left : neighbor.right;
          }
        }

        const linkHash = hash01(record.index * 0.913 + neighbor.index * 0.377);
        if (linkHash < 0.38) continue;

        continuationPositions.push(
          startPoint.x, startPoint.y, startPoint.z,
          endPoint.x, endPoint.y, endPoint.z
        );
        const continuationBrightness = clamp(
          ((record.brightness + neighbor.brightness) * 0.5) * 0.78,
          0.08,
          0.82
        );
        continuationBrightnessValues.push(
          continuationBrightness,
          continuationBrightness
        );
        usedPairs.add(pairKey);
        linksMade += 1;
      }
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setAttribute(
      "aBrightness",
      new THREE.Float32BufferAttribute(brightnessValues, 1)
    );
    geometry.computeBoundingSphere();

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uPointSize: { value: compactViewport ? 2.45 : 2.70 },
        uDarkColour: { value: new THREE.Color(0x16414c) },
        uBrightColour: { value: new THREE.Color(0xc9fbff) }
      },
      vertexShader: `
        attribute float aBrightness;
        varying float vBrightness;
        uniform float uPointSize;

        void main() {
          vBrightness = aBrightness;
          vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * viewPosition;
          gl_PointSize = uPointSize * (0.92 + aBrightness * 0.16);
        }
      `,
      fragmentShader: `
        uniform vec3 uDarkColour;
        uniform vec3 uBrightColour;
        varying float vBrightness;

        void main() {
          float distanceFromCentre = length(gl_PointCoord - vec2(0.5));
          if (distanceFromCentre > 0.5) discard;

          float core = smoothstep(0.50, 0.12, distanceFromCentre);
          float halo = smoothstep(0.50, 0.28, distanceFromCentre);
          float lightLevel = pow(clamp(vBrightness, 0.0, 1.0), 1.18);
          vec3 colour = mix(uDarkColour, uBrightColour, lightLevel);
          float alpha = (0.23 + lightLevel * 0.80) * (core * 0.78 + halo * 0.22);
          gl_FragColor = vec4(colour, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending,
      toneMapped: false
    });

    const points = new THREE.Points(geometry, material);
    points.userData.rfDecoration = true;
    points.renderOrder = 5;
    points.frustumCulled = true;

    const surfaceField = new THREE.Group();
    surfaceField.userData.rfDecoration = true;
    surfaceField.add(points);

    if (chevronPositions.length) {
      const chevronGeometry = new THREE.BufferGeometry();
      chevronGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(chevronPositions, 3)
      );
      chevronGeometry.setAttribute(
        "aBrightness",
        new THREE.Float32BufferAttribute(chevronBrightnessValues, 1)
      );
      chevronGeometry.computeBoundingSphere();

      const chevronMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uDarkColour: { value: new THREE.Color(0x103b47) },
          uBrightColour: { value: new THREE.Color(0x9ceff6) }
        },
        vertexShader: `
          attribute float aBrightness;
          varying float vBrightness;

          void main() {
            vBrightness = aBrightness;
            vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * viewPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 uDarkColour;
          uniform vec3 uBrightColour;
          varying float vBrightness;

          void main() {
            float lightLevel = pow(clamp(vBrightness, 0.0, 1.0), 1.10);
            vec3 colour = mix(uDarkColour, uBrightColour, lightLevel);
            float alpha = 0.100 + lightLevel * 0.45;
            gl_FragColor = vec4(colour, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        depthTest: true,
        blending: THREE.AdditiveBlending,
        toneMapped: false
      });

      const chevrons = new THREE.LineSegments(
        chevronGeometry,
        chevronMaterial
      );
      chevrons.userData.rfDecoration = true;
      chevrons.renderOrder = 4;
      chevrons.frustumCulled = true;
      surfaceField.add(chevrons);
    }

    if (continuationPositions.length) {
      const continuationGeometry = new THREE.BufferGeometry();
      continuationGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(continuationPositions, 3)
      );
      continuationGeometry.setAttribute(
        "aBrightness",
        new THREE.Float32BufferAttribute(continuationBrightnessValues, 1)
      );
      continuationGeometry.computeBoundingSphere();

      const continuationMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uDarkColour: { value: new THREE.Color(0x0d3340) },
          uBrightColour: { value: new THREE.Color(0x8fe7f1) }
        },
        vertexShader: `
          attribute float aBrightness;
          varying float vBrightness;

          void main() {
            vBrightness = aBrightness;
            vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * viewPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 uDarkColour;
          uniform vec3 uBrightColour;
          varying float vBrightness;

          void main() {
            float lightLevel = pow(clamp(vBrightness, 0.0, 1.0), 1.08);
            vec3 colour = mix(uDarkColour, uBrightColour, lightLevel);
            float alpha = 0.062 + lightLevel * 0.34;
            gl_FragColor = vec4(colour, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        depthTest: true,
        blending: THREE.AdditiveBlending,
        toneMapped: false
      });

      const continuationLines = new THREE.LineSegments(
        continuationGeometry,
        continuationMaterial
      );
      continuationLines.userData.rfDecoration = true;
      continuationLines.renderOrder = 3;
      continuationLines.frustumCulled = true;
      surfaceField.add(continuationLines);
    }

    return surfaceField;
  }

  function buildSurfaceRoute(THREE, terrainRoot, box, size, center) {
    const raycaster = new THREE.Raycaster();
    const down = new THREE.Vector3(0, -1, 0);
    const origin = new THREE.Vector3();
    const pathSamples = [];
    const pathSteps = 48;
    const zStart = box.max.z - size.z * 0.03;
    const zEnd = box.min.z + size.z * 0.18;
    const xStart = center.x - size.x * 0.12;
    const xEnd = center.x + size.x * 0.015;
    const offset = Math.max(size.y * 0.0042, 0.020);

    for (let index = 0; index < pathSteps; index += 1) {
      const t = index / (pathSteps - 1);
      const x =
        xStart + (xEnd - xStart) * t +
        Math.sin(t * Math.PI * 2.10 + 0.25) * size.x * 0.012 +
        Math.sin(t * Math.PI * 4.40 + 0.65) * size.x * 0.0035;
      const z = zStart + (zEnd - zStart) * t;
      origin.set(x, box.max.y + size.y * 0.34, z);
      raycaster.set(origin, down);
      const hit = raycaster.intersectObject(terrainRoot, true).find((entry) => {
        return entry.object?.isMesh && !entry.object.userData.rfDecoration;
      });

      if (hit) {
        pathSamples.push(
          hit.point.clone().addScaledVector(
            hit.face?.normal || new THREE.Vector3(0, 1, 0),
            offset
          )
        );
      } else {
        pathSamples.push(
          new THREE.Vector3(
            x,
            box.min.y + size.y * (0.050 + Math.sin(t * Math.PI) * 0.020),
            z
          )
        );
      }
    }

    const curve = new THREE.CatmullRomCurve3(pathSamples, false, "centripetal");
    const ribbonMaterial = new THREE.MeshBasicMaterial({
      color: 0x22ddeb,
      transparent: true,
      opacity: 0.020,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x9afaff,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const ribbon = new THREE.Mesh(
      new THREE.TubeGeometry(
        curve,
        88,
        Math.max(size.x * 0.0030, 0.078),
        8,
        false
      ),
      ribbonMaterial
    );
    ribbon.userData.rfDecoration = true;
    ribbon.renderOrder = 5;

    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(132)),
      lineMaterial
    );
    line.userData.rfDecoration = true;
    line.renderOrder = 6;

    return {
      objects: [ribbon, line],
      pulseMaterials: [ribbonMaterial, lineMaterial]
    };
  }

  function buildForegroundGrid(THREE, box, size) {
    const positions = [];
    const pointPositions = [];
    const xMin = box.min.x - size.x * 0.08;
    const xMax = box.max.x + size.x * 0.08;
    const zFront = box.max.z + size.z * 0.015;
    const zBack = box.max.z - size.z * 0.22;
    const y = box.min.y + size.y * 0.010;
    const columns = 16;
    const rows = 9;

    for (let c = 0; c <= columns; c += 1) {
      const x = xMin + ((xMax - xMin) * c) / columns;
      positions.push(x, y, zFront, x, y, zBack);
    }

    for (let r = 0; r <= rows; r += 1) {
      const z = zFront + ((zBack - zFront) * r) / rows;
      positions.push(xMin, y, z, xMax, y, z);
    }

    for (let c = 0; c <= columns; c += 1) {
      const x = xMin + ((xMax - xMin) * c) / columns;
      for (let r = 0; r <= rows; r += 1) {
        const z = zFront + ((zBack - zFront) * r) / rows;
        pointPositions.push(x, y, z);
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x5db9d0,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    lines.userData.rfDecoration = true;
    lines.renderOrder = 3;

    const points = createPointCloud(
      THREE,
      pointPositions,
      0x8fefff,
      Math.max(size.x * 0.0024, 0.038),
      0.055
    );
    points.userData.rfDecoration = true;
    points.renderOrder = 4;

    return {
      objects: [lines, points],
      pulseMaterials: [lineMaterial, points.material]
    };
  }

  function buildTerrainDecorations(THREE, terrainRoot, compactViewport) {
    terrainRoot.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(terrainRoot);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const target = new THREE.Vector3(
      center.x,
      box.min.y + size.y * 0.02,
      center.z
    );
    const meshes = collectTerrainMeshes(terrainRoot).filter((mesh) => {
      return !mesh.userData.rfDecoration;
    });
    const pulseMaterials = [];

    const moonSurface = buildMoonDotField(
      THREE,
      meshes,
      box,
      size,
      compactViewport
    );
    if (moonSurface) {
      terrainRoot.add(moonSurface);
    }

    const foregroundGrid = buildForegroundGrid(THREE, box, size);
    foregroundGrid.objects.forEach((object) => terrainRoot.add(object));
    pulseMaterials.push(...foregroundGrid.pulseMaterials);

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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.62;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x021221, 20, 56);

    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 120);

    const ambient = new THREE.HemisphereLight(0x5d8791, 0x01060a, 0.24);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0x9adce7, 1.45);
    key.position.set(-20, 24, 14);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x244f5c, 0.055);
    fill.position.set(12, 6, -18);
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

    const terrainMaterial = new THREE.MeshBasicMaterial({
      color: 0x02090f,
      transparent: false,
      opacity: 1,
      side: THREE.DoubleSide,
      depthWrite: true,
      depthTest: true
    });

    model.traverse((node) => {
      if (!node.isMesh) return;
      node.castShadow = false;
      node.receiveShadow = false;
      node.material = terrainMaterial;
      node.userData.rfDecoration = false;
    });

    normaliseTerrainModel(THREE, model);
    model.updateMatrixWorld(true);

    const sourceBox = new THREE.Box3().setFromObject(model);
    const sourceSize = sourceBox.getSize(new THREE.Vector3());

    const primaryModel = model;
    primaryModel.scale.multiplyScalar(1.22);
    primaryModel.position.x -= sourceSize.x * 0.54;
    primaryModel.position.z += sourceSize.z * 0.06;
    primaryModel.rotation.y = 0;
    primaryModel.updateMatrixWorld(true);
    terrainRoot.add(primaryModel);

    const secondaryModel = model.clone(true);
    secondaryModel.traverse((node) => {
      if (!node.isMesh) return;
      node.castShadow = false;
      node.receiveShadow = false;
      node.material = terrainMaterial;
      node.userData.rfDecoration = false;
    });
    secondaryModel.scale.multiplyScalar(1.08);
    secondaryModel.position.set(
      sourceSize.x * 0.52,
      0,
      -sourceSize.z * 0.04
    );
    secondaryModel.rotation.y = Math.PI;
    secondaryModel.updateMatrixWorld(true);
    terrainRoot.add(secondaryModel);
    terrainRoot.updateMatrixWorld(true);

    const decor = buildTerrainDecorations(THREE, terrainRoot, compactViewport);
    const target = decor.target;
    const size = decor.size;
    const orbitRadiusBase = Math.max(size.x, size.z) * 0.72;
    const targetLift = size.y * 0.03;

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
        const amount = index % 3 === 0 ? 0.018 : 0.010;
        material.opacity = clamp(base + pulse * amount, 0, 1);
      });

      const angle = (state.azimuth % 360) * DEG;
      const aspect = state.width / Math.max(1, state.height);
      const portraitBoost = clamp((1.05 - aspect) * 2.5, 0, 1.6);
      const orbitRadius = orbitRadiusBase + portraitBoost * 2.4;
      camera.fov = aspect < 0.82 ? 47 : aspect < 1.12 ? 45 : 43;
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

    setBadge(badge, "Moon dot-and-chevron terrain loaded", true);
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
    removePreloadBackground(mount);
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

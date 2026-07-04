/* ========================================================================== 
   FieldOps Atlas RF Three renderer
   File: FieldOpsAtlas/Features/RF/rf-three-solid-core.js
   Version: 1.2.1-quarter-dock

   Owns only:
   - Loading the Three.js module.
   - Building one mountain quarter and reusing it four times.
   - Creating the fixed docking surface and attachment anchor.
   - Managing the WebGL scene, image layers, input and cleanup.
   ========================================================================== */
(() => {
  "use strict";

  const VERSION = "1.2.1-quarter-dock";
  const THREE_MODULE_URL = "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.min.js";
  const QUARTER_TURN = Math.PI * 0.5;

  const DEFAULT_OPTIONS = Object.freeze({
    background: 0x01090e,
    mountainRadius: 1.05,
    mountainHeight: 1.15,
    quarterSegments: 22,
    quarterRings: 26,
    cameraAzimuth: 22,
    cameraElevation: 22,
    pixelRatioLimit: 1.75,
    dockX: 0.62,
    dockZ: 0.62,
    dockTop: -0.08,
    dockWidth: 0.22,
    dockDepth: 0.22,
    dockBase: -0.39,
    images: []
  });

  const instances = new Map();
  let threePromise = null;

  function loadThree() {
    if (!threePromise) {
      threePromise = import(THREE_MODULE_URL);
    }

    return threePromise;
  }

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function smoothstep(edge0, edge1, value) {
    if (edge0 === edge1) return value >= edge1 ? 1 : 0;
    const amount = clamp((value - edge0) / (edge1 - edge0), 0, 1);
    return amount * amount * (3 - 2 * amount);
  }

  function finiteNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function quarterPeakField(radius, quarterAngle) {
    const summit = Math.pow(Math.max(0, 1 - radius), 1.58);
    const ridgeGate = smoothstep(0.08, 0.3, radius) * (1 - smoothstep(0.77, 1, radius));
    const mainRidge = Math.sin(quarterAngle * 4 + radius * 7.5) * 0.07;
    const fineRidge = Math.sin(quarterAngle * 8 - radius * 9) * 0.024;
    const shoulderAngle = quarterAngle - Math.PI * 0.25;
    const shoulder = Math.exp(-Math.pow(shoulderAngle / 0.24, 2))
      * Math.exp(-Math.pow((radius - 0.43) / 0.18, 2))
      * 0.22;
    const edgeTaper = 1 - smoothstep(0.79, 1, radius);

    return Math.max(
      0,
      (summit + (mainRidge + fineRidge) * ridgeGate + shoulder) * edgeTaper
    );
  }

  function createQuarterGeometry(THREE, options) {
    const segments = Math.max(4, Math.round(options.quarterSegments));
    const rings = Math.max(4, Math.round(options.quarterRings));
    const positions = [];
    const colours = [];
    const indices = [];
    const colour = new THREE.Color();
    const low = new THREE.Color(0x06131a);
    const mid = new THREE.Color(0x087487);
    const high = new THREE.Color(0x5be8f5);

    function pushVertex(x, y, z, heightRatio) {
      positions.push(x, y, z);

      const mix = clamp(heightRatio, 0, 1);
      colour.copy(low).lerp(mid, smoothstep(0.05, 0.58, mix));
      colour.lerp(high, smoothstep(0.56, 1, mix));
      colours.push(colour.r, colour.g, colour.b);
    }

    pushVertex(0, quarterPeakField(0, 0) * options.mountainHeight - 0.34, 0, 1);

    for (let ring = 1; ring <= rings; ring += 1) {
      const radiusRatio = ring / rings;
      const radius = radiusRatio * options.mountainRadius;

      for (let segment = 0; segment <= segments; segment += 1) {
        const angle = segment / segments * QUARTER_TURN;
        const heightRatio = quarterPeakField(radiusRatio, angle);
        const height = heightRatio * options.mountainHeight - 0.34;
        const irregularity = 1 + Math.sin(angle * 8 + ring * 0.73) * 0.012;

        pushVertex(
          Math.cos(angle) * radius * irregularity,
          height,
          Math.sin(angle) * radius * irregularity,
          heightRatio
        );
      }
    }

    for (let segment = 0; segment < segments; segment += 1) {
      indices.push(0, 1 + segment, 1 + segment + 1);
    }

    const rowLength = segments + 1;

    for (let ring = 1; ring < rings; ring += 1) {
      const current = 1 + (ring - 1) * rowLength;
      const next = current + rowLength;

      for (let segment = 0; segment < segments; segment += 1) {
        const a = current + segment;
        const b = a + 1;
        const c = next + segment;
        const d = c + 1;

        indices.push(a, c, b, b, c, d);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colours, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    geometry.userData.rfQuarterGeometry = true;
    geometry.userData.rfQuarterCount = 4;
    return geometry;
  }

  function createDock(THREE, options) {
    const group = new THREE.Group();
    group.name = "rf-docking-place";

    const supportHeight = Math.max(0.02, options.dockTop - options.dockBase);
    const supportGeometry = new THREE.BoxGeometry(
      options.dockWidth,
      supportHeight,
      options.dockDepth
    );
    const supportMaterial = new THREE.MeshStandardMaterial({
      color: 0x06131a,
      metalness: 0.18,
      roughness: 0.76
    });
    const support = new THREE.Mesh(supportGeometry, supportMaterial);
    support.name = "rf-dock-support-block";
    support.position.set(
      options.dockX,
      options.dockBase + supportHeight * 0.5,
      options.dockZ
    );
    group.add(support);

    const surfaceGeometry = new THREE.PlaneGeometry(options.dockWidth, options.dockDepth);
    const surfaceMaterial = new THREE.MeshStandardMaterial({
      color: 0x2393a4,
      emissive: 0x062b34,
      emissiveIntensity: 0.42,
      metalness: 0.28,
      roughness: 0.52,
      side: THREE.DoubleSide
    });
    const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
    surface.name = "rf-dock-upper-face";
    surface.rotation.x = -Math.PI * 0.5;
    surface.position.set(options.dockX, options.dockTop + 0.001, options.dockZ);
    surface.renderOrder = 2;
    group.add(surface);

    const anchor = new THREE.Group();
    anchor.name = "rf-dock-anchor";
    anchor.position.set(options.dockX, options.dockTop + 0.004, options.dockZ);
    anchor.userData.rfDockAnchor = true;
    anchor.userData.rfDockVersion = VERSION;
    group.add(anchor);

    group.userData.anchor = anchor;
    group.userData.surface = surface;
    return group;
  }

  function createMountain(THREE, options) {
    const group = new THREE.Group();
    group.name = "rf-quarter-mirrored-mountain";

    const quarterGeometry = createQuarterGeometry(THREE, options);
    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      metalness: 0.12,
      roughness: 0.72,
      side: THREE.DoubleSide
    });

    for (let quadrant = 0; quadrant < 4; quadrant += 1) {
      const quarter = new THREE.Mesh(quarterGeometry, material);
      quarter.name = `rf-mountain-quarter-${quadrant + 1}`;
      quarter.rotation.y = quadrant * QUARTER_TURN;
      quarter.userData.rfSharedQuarterGeometry = true;
      group.add(quarter);
    }

    const dock = createDock(THREE, options);
    group.add(dock);
    group.userData.dockAnchor = dock.userData.anchor;
    group.userData.sharedQuarterGeometry = quarterGeometry;
    group.userData.sharedMaterial = material;
    return group;
  }

  class RFThreeRenderer {
    constructor(element, THREE, options) {
      this.element = element;
      this.THREE = THREE;
      this.options = { ...DEFAULT_OPTIONS, ...options };
      this.destroyed = false;
      this.pointerId = null;
      this.pointerX = 0;
      this.pointerY = 0;
      this.azimuth = this.options.cameraAzimuth;
      this.elevation = this.options.cameraElevation;
      this.frame = 0;
      this.imageGeneration = 0;

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(this.options.background);
      this.scene.fog = new THREE.Fog(this.options.background, 3.1, 6.5);

      this.camera = new THREE.PerspectiveCamera(42, 1, 0.05, 20);
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance"
      });
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.04;

      this.canvas = this.renderer.domElement;
      this.canvas.className = "rf-three-renderer-canvas";
      this.canvas.setAttribute("role", "img");
      this.canvas.setAttribute(
        "aria-label",
        "Interactive four-quarter RF terrain renderer with a fixed docking surface. Drag to rotate."
      );
      this.canvas.tabIndex = 0;
      this.canvas.style.cssText = [
        "display:block",
        "width:100%",
        "height:100%",
        "touch-action:none",
        "cursor:grab",
        "outline:none"
      ].join(";");

      this.world = new THREE.Group();
      this.world.name = "rf-renderer-world";
      this.mountain = createMountain(THREE, this.options);
      this.dockAnchor = this.mountain.userData.dockAnchor;
      this.imageGroup = new THREE.Group();
      this.imageGroup.name = "rf-image-layers";
      this.world.add(this.mountain, this.imageGroup);
      this.world.rotation.y = 20 * Math.PI / 180;
      this.scene.add(this.world);

      this.scene.add(new THREE.HemisphereLight(0xb8f7ff, 0x03131b, 1.3));
      const keyLight = new THREE.DirectionalLight(0xe7fdff, 2.1);
      keyLight.position.set(2.6, 3.8, 2.2);
      this.scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0x0bbbd0, 1.25);
      rimLight.position.set(-3.2, 1.4, -2.6);
      this.scene.add(rimLight);

      this.element.replaceChildren(this.canvas);
      this.bindEvents();
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.element);
      this.resize();
      this.setView(this.azimuth, this.elevation);
    }

    bindEvents() {
      this.onPointerDown = (event) => {
        if (this.destroyed) return;
        this.pointerId = event.pointerId;
        this.pointerX = event.clientX;
        this.pointerY = event.clientY;
        this.canvas.setPointerCapture(event.pointerId);
        this.canvas.style.cursor = "grabbing";
        event.preventDefault();
      };

      this.onPointerMove = (event) => {
        if (this.pointerId !== event.pointerId) return;
        const deltaX = event.clientX - this.pointerX;
        const deltaY = event.clientY - this.pointerY;
        this.pointerX = event.clientX;
        this.pointerY = event.clientY;
        this.setView(
          this.azimuth + deltaX * 0.34,
          clamp(this.elevation - deltaY * 0.24, 8, 55)
        );
        event.preventDefault();
      };

      this.onPointerEnd = (event) => {
        if (this.pointerId !== event.pointerId) return;
        if (this.canvas.hasPointerCapture(event.pointerId)) {
          this.canvas.releasePointerCapture(event.pointerId);
        }
        this.pointerId = null;
        this.canvas.style.cursor = "grab";
      };

      this.onKeyDown = (event) => {
        if (event.key === "Home") {
          this.setView(this.options.cameraAzimuth, this.options.cameraElevation);
          event.preventDefault();
          return;
        }

        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          this.setView(this.azimuth + (event.key === "ArrowLeft" ? -8 : 8), this.elevation);
          event.preventDefault();
        }

        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
          this.setView(
            this.azimuth,
            clamp(this.elevation + (event.key === "ArrowUp" ? 4 : -4), 8, 55)
          );
          event.preventDefault();
        }
      };

      this.onDoubleClick = () => {
        this.setView(this.options.cameraAzimuth, this.options.cameraElevation);
      };

      this.canvas.addEventListener("pointerdown", this.onPointerDown);
      this.canvas.addEventListener("pointermove", this.onPointerMove);
      this.canvas.addEventListener("pointerup", this.onPointerEnd);
      this.canvas.addEventListener("pointercancel", this.onPointerEnd);
      this.canvas.addEventListener("keydown", this.onKeyDown);
      this.canvas.addEventListener("dblclick", this.onDoubleClick);
    }

    resize() {
      if (this.destroyed) return;
      const bounds = this.element.getBoundingClientRect();
      const width = Math.max(1, bounds.width);
      const height = Math.max(1, bounds.height);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, this.options.pixelRatioLimit);

      this.renderer.setPixelRatio(pixelRatio);
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.requestRender();
    }

    setView(azimuth, elevation) {
      this.azimuth = azimuth;
      this.elevation = elevation;

      const azimuthRadians = azimuth * Math.PI / 180;
      const elevationRadians = elevation * Math.PI / 180;
      const distance = 3.2;
      const horizontal = Math.cos(elevationRadians) * distance;

      this.camera.position.set(
        Math.sin(azimuthRadians) * horizontal,
        0.16 + Math.sin(elevationRadians) * distance,
        Math.cos(azimuthRadians) * horizontal
      );
      this.camera.lookAt(0, 0.03, 0);
      this.requestRender();
    }

    requestRender() {
      if (this.destroyed || this.frame) return;
      this.frame = window.requestAnimationFrame(() => {
        this.frame = 0;
        if (!this.destroyed) this.renderer.render(this.scene, this.camera);
      });
    }

    getDockAnchor() {
      return this.dockAnchor;
    }

    attachObject(object3D, options = {}) {
      if (!object3D?.isObject3D) {
        throw new TypeError("Docked RF content must be a Three.js Object3D.");
      }

      const position = Array.isArray(options.position) ? options.position : [0, 0, 0];
      const rotation = Array.isArray(options.rotation) ? options.rotation : [0, 0, 0];
      const scale = Array.isArray(options.scale)
        ? options.scale
        : [finiteNumber(options.scale, 1), finiteNumber(options.scale, 1), finiteNumber(options.scale, 1)];

      if (options.replace !== false) {
        this.clearDock();
      }

      this.dockAnchor.add(object3D);
      object3D.position.set(
        finiteNumber(position[0], 0),
        finiteNumber(position[1], 0),
        finiteNumber(position[2], 0)
      );
      object3D.rotation.set(
        finiteNumber(rotation[0], 0),
        finiteNumber(rotation[1], 0),
        finiteNumber(rotation[2], 0)
      );
      object3D.scale.set(
        finiteNumber(scale[0], 1),
        finiteNumber(scale[1], 1),
        finiteNumber(scale[2], 1)
      );
      this.requestRender();
      return object3D;
    }

    detachObject(object3D) {
      if (object3D?.parent === this.dockAnchor) {
        this.dockAnchor.remove(object3D);
        this.requestRender();
      }
      return object3D;
    }

    clearDock() {
      for (const child of [...this.dockAnchor.children]) {
        this.dockAnchor.remove(child);
      }
      this.requestRender();
    }

    clearImages() {
      for (const child of [...this.imageGroup.children]) {
        this.imageGroup.remove(child);
        child.geometry?.dispose?.();
        child.material?.map?.dispose?.();
        child.material?.dispose?.();
      }
    }

    async setImages(images = []) {
      const generation = ++this.imageGeneration;
      this.clearImages();
      if (!Array.isArray(images) || !images.length) {
        this.requestRender();
        return;
      }

      const loader = new this.THREE.TextureLoader();
      const loaded = await Promise.all(images.map(async (image, index) => {
        if (!image?.src) return null;

        let texture;
        try {
          texture = await loader.loadAsync(image.src);
        } catch (error) {
          console.warn(`RF image layer failed to load: ${image.src}`, error);
          return null;
        }

        texture.colorSpace = this.THREE.SRGBColorSpace;

        const width = finiteNumber(image.width, 0.55);
        const height = finiteNumber(image.height, width);
        const geometry = new this.THREE.PlaneGeometry(width, height);
        const material = new this.THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: clamp(finiteNumber(image.opacity, 1), 0, 1),
          depthWrite: false,
          side: this.THREE.DoubleSide,
          toneMapped: false
        });
        const mesh = new this.THREE.Mesh(geometry, material);
        mesh.name = image.id || `rf-image-${index + 1}`;
        mesh.position.set(
          finiteNumber(image.x, 0),
          finiteNumber(image.y, 0.55),
          finiteNumber(image.z, 0)
        );
        mesh.rotation.set(
          finiteNumber(image.rotationX, 0),
          finiteNumber(image.rotationY, 0),
          finiteNumber(image.rotationZ, 0)
        );
        mesh.renderOrder = finiteNumber(image.renderOrder, 10 + index);
        return mesh;
      }));

      if (generation !== this.imageGeneration || this.destroyed) {
        for (const mesh of loaded.filter(Boolean)) {
          mesh.geometry.dispose();
          mesh.material.map?.dispose?.();
          mesh.material.dispose();
        }
        return;
      }

      this.imageGroup.add(...loaded.filter(Boolean));
      this.requestRender();
    }

    destroy() {
      if (this.destroyed) return;
      this.destroyed = true;
      this.imageGeneration += 1;
      window.cancelAnimationFrame(this.frame);
      this.resizeObserver.disconnect();
      this.canvas.removeEventListener("pointerdown", this.onPointerDown);
      this.canvas.removeEventListener("pointermove", this.onPointerMove);
      this.canvas.removeEventListener("pointerup", this.onPointerEnd);
      this.canvas.removeEventListener("pointercancel", this.onPointerEnd);
      this.canvas.removeEventListener("keydown", this.onKeyDown);
      this.canvas.removeEventListener("dblclick", this.onDoubleClick);
      this.clearDock();
      this.clearImages();

      const geometries = new Set();
      const materials = new Set();
      this.scene.traverse((object) => {
        if (object.geometry) geometries.add(object.geometry);
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => materials.add(material));
        } else if (object.material) {
          materials.add(object.material);
        }
      });

      geometries.forEach((geometry) => geometry.dispose?.());
      materials.forEach((material) => material.dispose?.());
      this.renderer.dispose();
      this.canvas.remove();
    }
  }

  async function mount(element, options = {}) {
    if (!(element instanceof Element)) {
      throw new TypeError("RF Three renderer requires a mount element.");
    }

    instances.get(element)?.destroy();
    const THREE = await loadThree();
    const instance = new RFThreeRenderer(element, THREE, options);
    instances.set(element, instance);
    await instance.setImages(options.images || []);
    return instance;
  }

  async function mountAll(root = document, options = {}) {
    const elements = [...root.querySelectorAll("[data-rf-graph]")];
    return Promise.all(elements.map((element) => mount(element, options)));
  }

  function instanceFor(element) {
    const instance = instances.get(element);
    if (!instance) throw new Error("RF Three renderer is not mounted on this element.");
    return instance;
  }

  async function setImages(element, images) {
    await instanceFor(element).setImages(images);
  }

  function getDockAnchor(element) {
    return instanceFor(element).getDockAnchor();
  }

  function attachObject(element, object3D, options = {}) {
    return instanceFor(element).attachObject(object3D, options);
  }

  function detachObject(element, object3D) {
    return instanceFor(element).detachObject(object3D);
  }

  function clearDock(element) {
    instanceFor(element).clearDock();
  }

  function invalidate(element) {
    instanceFor(element).requestRender();
  }

  function destroy(element) {
    const instance = instances.get(element);
    if (!instance) return;
    instance.destroy();
    instances.delete(element);
  }

  function destroyAll() {
    for (const [element, instance] of instances.entries()) {
      instance.destroy();
      instances.delete(element);
    }
  }

  const api = Object.freeze({
    VERSION,
    THREE_MODULE_URL,
    mount,
    mountAll,
    setImages,
    getDockAnchor,
    attachObject,
    detachObject,
    clearDock,
    invalidate,
    destroy,
    destroyAll,
    ready: loadThree
  });

  window.FieldOpsRFThreeRenderer = api;
  window.FieldOpsRFThreeSolidCore = api;
})();

/* ========================================================================== 
   FieldOps Atlas RF Three.js inset solid-core adapter
   File: FieldOpsAtlas/Features/RF/rf-three-solid-core.js
   Version: 1.1.251-builder-3-inset-background-core

   Purpose:
   - Keep Builder 3's exterior mountain geometry and colours unchanged.
   - Remove Builder 3's repeated internal occlusion duplicate.
   - Add one smaller, smooth, closed core behind the exterior surface.
   - Keep the core below the highest Builder 3 points.
   - Render the core in the same dark background/neutral terrain colour.
   - Preserve 360-degree orbit interaction and normal depth occlusion.
   ========================================================================== */

import * as THREEBase from "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";
export * from "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";

const VERSION = "1.1.251-builder-3-inset-background-core";
const CORE_XZ_SCALE = 0.94;
const CORE_Y_SCALE = 0.90;
const CORE_TOP_RATIO = 0.90;
const ANGLE_SEGMENTS = 144;
const RADIAL_SEGMENTS = 54;
const NEAREST_SAMPLE_COUNT = 18;
const POINT_GRID_DIVISOR = 58;
const POSITION_QUANTISATION = 100000;
const RADIAL_EXPONENT = 1.10;
const SMOOTHING_PASSES = 2;
const CORE_COLOUR = 0x06131a;
const CORE_RGB = Object.freeze([6 / 255, 19 / 255, 26 / 255]);

const OriginalMesh = THREEBase.Mesh;
const OriginalShaderMaterial = THREEBase.ShaderMaterial;

function materialList(material) {
  return Array.isArray(material) ? material : [material];
}

function isBuilderMountainShader(parameters) {
  const vertexShader = parameters?.vertexShader;
  const fragmentShader = parameters?.fragmentShader;

  return typeof vertexShader === "string"
    && typeof fragmentShader === "string"
    && vertexShader.includes("attribute vec3 barycentric;")
    && fragmentShader.includes("float triangleEdgeMask()")
    && fragmentShader.includes(
      "float layer1Area = circularAreaMask(0, vModelPosition);"
    );
}

function isBuilderMountainGeometry(geometry, material) {
  if (!geometry?.userData?.rfTwoLayerTopologyForks360Mesh) return false;

  const position = geometry.getAttribute?.("position");
  const colour = geometry.getAttribute?.("color");
  const barycentric = geometry.getAttribute?.("barycentric");
  const colourMask = geometry.getAttribute?.("colourMask");
  const interiorMask = geometry.getAttribute?.("interiorMask");
  const materials = materialList(material);

  return Boolean(
    position
    && colour
    && barycentric
    && colourMask
    && interiorMask
    && position.count === colour.count
    && materials.length === 1
    && materials[0]
    && materials[0].wireframe !== true
  );
}

function isWireframeMaterial(material) {
  return materialList(material).some((entry) => entry?.wireframe === true);
}

function insertOnce(source, search, replacement, label) {
  if (!source.includes(search)) {
    console.warn(`FieldOps RF shader patch skipped missing ${label}.`);
    return source;
  }

  return source.replace(search, replacement);
}

function patchBuilderVertexShader(source) {
  let shader = source;

  if (!shader.includes("attribute float colourMask;")) {
    shader = insertOnce(
      shader,
      "attribute vec3 barycentric;",
      "attribute vec3 barycentric;\n        attribute float colourMask;",
      "colourMask attribute"
    );
  }

  if (!shader.includes("varying float vColourMask;")) {
    shader = insertOnce(
      shader,
      "varying vec3 vBarycentric;",
      "varying vec3 vBarycentric;\n        varying float vColourMask;",
      "colourMask varying"
    );
  }

  if (!shader.includes("vColourMask = colourMask;")) {
    shader = insertOnce(
      shader,
      "vBarycentric = barycentric;",
      "vBarycentric = barycentric;\n          vColourMask = colourMask;",
      "colourMask assignment"
    );
  }

  return shader;
}

function patchBuilderFragmentShader(source) {
  let shader = source;

  if (!shader.includes("varying float vColourMask;")) {
    shader = insertOnce(
      shader,
      "varying vec3 vBarycentric;",
      "varying vec3 vBarycentric;\n        varying float vColourMask;",
      "fragment colourMask varying"
    );
  }

  if (!shader.includes("layer1Area *= vColourMask;")) {
    shader = insertOnce(
      shader,
      "layer2Branch = clamp(layer2Branch, 0.0, 1.0);",
      [
        "layer2Branch = clamp(layer2Branch, 0.0, 1.0);",
        "",
        "          layer1Area *= vColourMask;",
        "          layer1Band *= vColourMask;",
        "          layer1Vein *= vColourMask;",
        "          layer2Area *= vColourMask;",
        "          layer2Band *= vColourMask;",
        "          layer2Branch *= vColourMask;"
      ].join("\n"),
      "colourMask application"
    );
  }

  if (!shader.includes("#include <tonemapping_fragment>")) {
    shader = insertOnce(
      shader,
      "gl_FragColor = vec4(colour, 1.0);",
      [
        "gl_FragColor = vec4(colour, 1.0);",
        "          #include <tonemapping_fragment>",
        "          #include <colorspace_fragment>"
      ].join("\n"),
      "tone mapping and colour-space output"
    );
  }

  return shader;
}

function patchBuilderShaderParameters(parameters) {
  if (!isBuilderMountainShader(parameters)) return parameters;

  return {
    ...parameters,
    transparent: false,
    opacity: 1,
    depthWrite: true,
    depthTest: true,
    vertexShader: patchBuilderVertexShader(parameters.vertexShader),
    fragmentShader: patchBuilderFragmentShader(parameters.fragmentShader)
  };
}

function exteriorVertexCount(geometry, totalCount) {
  const retainedFaces = Number(geometry.userData?.rfRetainedFaceCount);

  if (Number.isFinite(retainedFaces) && retainedFaces > 0) {
    return Math.min(totalCount, Math.floor(retainedFaces) * 3);
  }

  const occlusionFaces = Number(
    geometry.userData?.rfIntegratedOcclusionFaceCount
  );

  if (
    Number.isFinite(occlusionFaces)
    && occlusionFaces > 0
    && totalCount >= occlusionFaces * 6
  ) {
    return Math.floor(totalCount / 2);
  }

  return totalCount;
}

function cloneAttributeRange(attribute, count) {
  const valueCount = count * attribute.itemSize;
  const sourceArray = attribute.array;
  const copiedArray = typeof sourceArray.slice === "function"
    ? sourceArray.slice(0, valueCount)
    : new sourceArray.constructor(Array.from(sourceArray).slice(0, valueCount));

  return new THREEBase.BufferAttribute(
    copiedArray,
    attribute.itemSize,
    attribute.normalized
  );
}

function extractExteriorGeometry(sourceGeometry) {
  const position = sourceGeometry.getAttribute("position");
  const count = exteriorVertexCount(sourceGeometry, position.count);
  const geometry = new THREEBase.BufferGeometry();

  Object.entries(sourceGeometry.attributes).forEach(([name, attribute]) => {
    geometry.setAttribute(name, cloneAttributeRange(attribute, count));
  });

  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  geometry.userData = {
    ...sourceGeometry.userData,
    rfExteriorOnly: true,
    rfExteriorVertexCount: count,
    rfIntegratedOcclusionRemoved: true
  };

  return geometry;
}

function median(values) {
  if (!values.length) return 0;
  const ordered = [...values].sort((left, right) => left - right);
  const middle = Math.floor(ordered.length / 2);
  return ordered.length % 2
    ? ordered[middle]
    : (ordered[middle - 1] + ordered[middle]) * 0.5;
}

function spatialKey(column, row) {
  return `${column}:${row}`;
}

function collectSamples(exteriorGeometry) {
  const position = exteriorGeometry.getAttribute("position");
  const groups = new Map();
  const bounds = {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity,
    minZ: Infinity,
    maxZ: -Infinity
  };

  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const y = position.getY(index);
    const z = position.getZ(index);

    if (![x, y, z].every(Number.isFinite)) continue;

    bounds.minX = Math.min(bounds.minX, x);
    bounds.maxX = Math.max(bounds.maxX, x);
    bounds.minY = Math.min(bounds.minY, y);
    bounds.maxY = Math.max(bounds.maxY, y);
    bounds.minZ = Math.min(bounds.minZ, z);
    bounds.maxZ = Math.max(bounds.maxZ, z);

    const key = `${Math.round(x * POSITION_QUANTISATION)}:`
      + `${Math.round(z * POSITION_QUANTISATION)}`;
    const group = groups.get(key) || { x, z, heights: [] };
    group.heights.push(y);
    groups.set(key, group);
  }

  const samples = Array.from(groups.values()).map((group) => ({
    x: group.x,
    y: median(group.heights),
    z: group.z
  }));

  if (samples.length < 32) {
    throw new Error("Builder 3 does not contain enough exterior points for the core.");
  }

  const width = bounds.maxX - bounds.minX;
  const depth = bounds.maxZ - bounds.minZ;
  const maximumSpan = Math.max(width, depth, 0.001);
  const cellSize = maximumSpan / POINT_GRID_DIVISOR;
  const cells = new Map();

  samples.forEach((sample, sampleIndex) => {
    const column = Math.floor(sample.x / cellSize);
    const row = Math.floor(sample.z / cellSize);
    const key = spatialKey(column, row);
    const bucket = cells.get(key) || [];
    bucket.push(sampleIndex);
    cells.set(key, bucket);
  });

  return {
    samples,
    bounds,
    maximumSpan,
    cellSize,
    cells,
    heightRange: Math.max(bounds.maxY - bounds.minY, 0.001)
  };
}

function nearestSamples(x, z, surface) {
  const originColumn = Math.floor(x / surface.cellSize);
  const originRow = Math.floor(z / surface.cellSize);
  const candidateIndices = new Set();

  for (let radius = 0; radius <= 10; radius += 1) {
    for (let column = originColumn - radius;
      column <= originColumn + radius;
      column += 1) {
      for (let row = originRow - radius;
        row <= originRow + radius;
        row += 1) {
        if (
          radius > 0
          && column > originColumn - radius
          && column < originColumn + radius
          && row > originRow - radius
          && row < originRow + radius
        ) {
          continue;
        }

        const bucket = surface.cells.get(spatialKey(column, row));
        if (bucket) bucket.forEach((index) => candidateIndices.add(index));
      }
    }

    if (candidateIndices.size >= NEAREST_SAMPLE_COUNT) break;
  }

  return Array.from(candidateIndices)
    .map((index) => {
      const sample = surface.samples[index];
      return {
        sample,
        distanceSquared: (sample.x - x) ** 2 + (sample.z - z) ** 2
      };
    })
    .sort((left, right) => left.distanceSquared - right.distanceSquared)
    .slice(0, NEAREST_SAMPLE_COUNT);
}

function robustHeight(x, z, surface) {
  const neighbours = nearestSamples(x, z, surface);

  if (!neighbours.length) return surface.bounds.minY;

  const heights = neighbours
    .map(({ sample }) => sample.y)
    .sort((left, right) => left - right);
  const lower = heights[Math.min(2, heights.length - 1)];
  const upper = heights[Math.max(0, heights.length - 3)];
  let weightedHeight = 0;
  let totalWeight = 0;

  neighbours.forEach(({ sample, distanceSquared }) => {
    const clippedHeight = Math.min(upper, Math.max(lower, sample.y));
    const weight = 1 / Math.pow(
      Math.max(distanceSquared, surface.maximumSpan ** 2 * 1e-8),
      0.72
    );
    weightedHeight += clippedHeight * weight;
    totalWeight += weight;
  });

  return weightedHeight / Math.max(totalWeight, 1e-9);
}

function angularIndex(x, z, origin) {
  const angle = Math.atan2(z - origin.z, x - origin.x);
  const normalised = (angle + Math.PI * 2) % (Math.PI * 2);
  return Math.floor(normalised / (Math.PI * 2) * ANGLE_SEGMENTS)
    % ANGLE_SEGMENTS;
}

function buildBoundary(surface, origin) {
  const boundary = new Float32Array(ANGLE_SEGMENTS);
  let globalMaximum = 0;

  surface.samples.forEach((sample) => {
    const radius = Math.hypot(sample.x - origin.x, sample.z - origin.z);
    const index = angularIndex(sample.x, sample.z, origin);
    boundary[index] = Math.max(boundary[index], radius);
    globalMaximum = Math.max(globalMaximum, radius);
  });

  for (let index = 0; index < ANGLE_SEGMENTS; index += 1) {
    if (boundary[index] > 0) continue;

    for (let step = 1; step < ANGLE_SEGMENTS / 2; step += 1) {
      const before = boundary[
        (index - step + ANGLE_SEGMENTS) % ANGLE_SEGMENTS
      ];
      const after = boundary[(index + step) % ANGLE_SEGMENTS];

      if (before > 0 || after > 0) {
        boundary[index] = before > 0 && after > 0
          ? (before + after) * 0.5
          : Math.max(before, after);
        break;
      }
    }

    if (boundary[index] <= 0) boundary[index] = globalMaximum;
  }

  for (let pass = 0; pass < 2; pass += 1) {
    const smoothed = new Float32Array(ANGLE_SEGMENTS);

    for (let index = 0; index < ANGLE_SEGMENTS; index += 1) {
      const previous = boundary[
        (index - 1 + ANGLE_SEGMENTS) % ANGLE_SEGMENTS
      ];
      const next = boundary[(index + 1) % ANGLE_SEGMENTS];
      smoothed[index] = (
        boundary[index] * 0.70 + (previous + next) * 0.15
      ) * CORE_XZ_SCALE;
    }

    boundary.set(smoothed);
  }

  return boundary;
}

function corePoint(x, z, sourceX, sourceZ, surface, coreMaximumY) {
  const sourceHeight = robustHeight(sourceX, sourceZ, surface);
  const insetHeight = surface.bounds.minY
    + (sourceHeight - surface.bounds.minY) * CORE_Y_SCALE;

  return {
    x,
    y: Math.min(insetHeight, coreMaximumY),
    z,
    colour: CORE_RGB,
    colourMask: 0,
    interiorMask: 1
  };
}

function smoothCore(rings, center) {
  for (let pass = 0; pass < SMOOTHING_PASSES; pass += 1) {
    const replacements = [];

    rings.forEach((ring, ringIndex) => {
      ring.forEach((point, angleIndex) => {
        const previous = ring[
          (angleIndex - 1 + ANGLE_SEGMENTS) % ANGLE_SEGMENTS
        ];
        const next = ring[(angleIndex + 1) % ANGLE_SEGMENTS];
        const inner = ringIndex > 0
          ? rings[ringIndex - 1][angleIndex]
          : center;
        const outer = ringIndex + 1 < rings.length
          ? rings[ringIndex + 1][angleIndex]
          : point;
        const average = (
          previous.y + next.y + inner.y + outer.y
        ) * 0.25;

        replacements.push({
          point,
          height: point.y * 0.72 + average * 0.28
        });
      });
    });

    replacements.forEach(({ point, height }) => {
      point.y = height;
    });
  }
}

function triangleNormal(a, b, c) {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const abz = b.z - a.z;
  const acx = c.x - a.x;
  const acy = c.y - a.y;
  const acz = c.z - a.z;

  return {
    x: aby * acz - abz * acy,
    y: abz * acx - abx * acz,
    z: abx * acy - aby * acx
  };
}

function pushTriangle(output, first, second, third, surfaceType, origin) {
  let a = first;
  let b = second;
  let c = third;
  const normal = triangleNormal(a, b, c);

  if (surfaceType === "top" && normal.y < 0) {
    [b, c] = [c, b];
  } else if (surfaceType === "bottom" && normal.y > 0) {
    [b, c] = [c, b];
  } else if (surfaceType === "side") {
    const outwardX = (a.x + b.x + c.x) / 3 - origin.x;
    const outwardZ = (a.z + b.z + c.z) / 3 - origin.z;
    const outwardDot = normal.x * outwardX + normal.z * outwardZ;
    if (outwardDot < 0) [b, c] = [c, b];
  }

  [a, b, c].forEach((point) => {
    output.push(point.x, point.y, point.z);
  });
}

function buildInsetCoreGeometry(exteriorGeometry) {
  const surface = collectSamples(exteriorGeometry);
  const origin = {
    x: (surface.bounds.minX + surface.bounds.maxX) * 0.5,
    z: (surface.bounds.minZ + surface.bounds.maxZ) * 0.5
  };
  const boundary = buildBoundary(surface, origin);
  const coreMaximumY = surface.bounds.minY + surface.heightRange * CORE_TOP_RATIO;
  const sourceCenterHeight = robustHeight(origin.x, origin.z, surface);
  const center = {
    x: origin.x,
    y: Math.min(
      surface.bounds.minY
        + (sourceCenterHeight - surface.bounds.minY) * CORE_Y_SCALE,
      coreMaximumY
    ),
    z: origin.z,
    colour: CORE_RGB,
    colourMask: 0,
    interiorMask: 1
  };
  const rings = [];

  for (let ring = 1; ring <= RADIAL_SEGMENTS; ring += 1) {
    const radialFraction = Math.pow(
      ring / RADIAL_SEGMENTS,
      RADIAL_EXPONENT
    );
    const points = [];

    for (let angleIndex = 0;
      angleIndex < ANGLE_SEGMENTS;
      angleIndex += 1) {
      const angle = angleIndex / ANGLE_SEGMENTS * Math.PI * 2;
      const radius = boundary[angleIndex] * radialFraction;
      const x = origin.x + Math.cos(angle) * radius;
      const z = origin.z + Math.sin(angle) * radius;
      const sourceX = origin.x + (x - origin.x) / CORE_XZ_SCALE;
      const sourceZ = origin.z + (z - origin.z) / CORE_XZ_SCALE;
      points.push(corePoint(
        x,
        z,
        sourceX,
        sourceZ,
        surface,
        coreMaximumY
      ));
    }

    rings.push(points);
  }

  smoothCore(rings, center);

  const positions = [];
  const firstRing = rings[0];

  for (let angleIndex = 0;
    angleIndex < ANGLE_SEGMENTS;
    angleIndex += 1) {
    const next = (angleIndex + 1) % ANGLE_SEGMENTS;
    pushTriangle(
      positions,
      center,
      firstRing[angleIndex],
      firstRing[next],
      "top",
      origin
    );
  }

  for (let ring = 0; ring < rings.length - 1; ring += 1) {
    const inner = rings[ring];
    const outer = rings[ring + 1];

    for (let angleIndex = 0;
      angleIndex < ANGLE_SEGMENTS;
      angleIndex += 1) {
      const next = (angleIndex + 1) % ANGLE_SEGMENTS;
      pushTriangle(
        positions,
        inner[angleIndex],
        outer[angleIndex],
        outer[next],
        "top",
        origin
      );
      pushTriangle(
        positions,
        inner[angleIndex],
        outer[next],
        inner[next],
        "top",
        origin
      );
    }
  }

  const baseY = surface.bounds.minY;
  const outerRing = rings[rings.length - 1];
  const bottomRing = outerRing.map((point) => ({
    x: point.x,
    y: baseY,
    z: point.z
  }));
  const bottomCenter = {
    x: origin.x,
    y: baseY,
    z: origin.z
  };

  for (let angleIndex = 0;
    angleIndex < ANGLE_SEGMENTS;
    angleIndex += 1) {
    const next = (angleIndex + 1) % ANGLE_SEGMENTS;
    const topA = outerRing[angleIndex];
    const topB = outerRing[next];
    const bottomA = bottomRing[angleIndex];
    const bottomB = bottomRing[next];

    pushTriangle(positions, topA, bottomA, bottomB, "side", origin);
    pushTriangle(positions, topA, bottomB, topB, "side", origin);
    pushTriangle(
      positions,
      bottomCenter,
      bottomB,
      bottomA,
      "bottom",
      origin
    );
  }

  const geometry = new THREEBase.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREEBase.Float32BufferAttribute(positions, 3)
  );
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  geometry.userData = {
    rfInsetSolidCore: true,
    rfInsetSolidCoreVersion: VERSION,
    rfInsetSolidCoreWatertight: true,
    rfInsetSolidCoreColour: CORE_COLOUR,
    rfInsetSolidCoreXZScale: CORE_XZ_SCALE,
    rfInsetSolidCoreYScale: CORE_Y_SCALE,
    rfInsetSolidCoreMaximumY: coreMaximumY,
    rfInsetSolidCoreSourceMaximumY: surface.bounds.maxY,
    rfInsetSolidCoreBelowSourcePeak: coreMaximumY < surface.bounds.maxY
  };

  return geometry;
}

function configureExteriorMaterial(material) {
  materialList(material).forEach((entry) => {
    if (!entry) return;

    entry.transparent = false;
    entry.opacity = 1;
    entry.alphaTest = 0;
    entry.depthWrite = true;
    entry.depthTest = true;
    entry.colorWrite = true;
    entry.blending = THREEBase.NoBlending;
    entry.premultipliedAlpha = false;
    entry.needsUpdate = true;
  });
}

function configureVisibleWireframe(material) {
  materialList(material).forEach((entry) => {
    if (!entry?.wireframe) return;

    entry.depthTest = true;
    entry.depthWrite = false;
    entry.needsUpdate = true;
  });
}

function createCoreMaterial() {
  const material = new THREEBase.MeshBasicMaterial({
    color: CORE_COLOUR,
    transparent: false,
    opacity: 1,
    depthTest: true,
    depthWrite: true,
    side: THREEBase.DoubleSide,
    blending: THREEBase.NoBlending,
    toneMapped: false
  });
  material.name = "rf-inset-background-core-material";
  return material;
}

export class ShaderMaterial extends OriginalShaderMaterial {
  constructor(parameters = {}) {
    super(patchBuilderShaderParameters(parameters));

    if (isBuilderMountainShader(parameters)) {
      this.userData.rfBuilderShaderPatched = true;
      this.userData.rfBuilderShaderPatchVersion = VERSION;
    }
  }
}

export class Mesh extends OriginalMesh {
  constructor(geometry, material) {
    const builderMountain = isBuilderMountainGeometry(geometry, material);

    if (!builderMountain) {
      super(geometry, material);
      if (isWireframeMaterial(material)) configureVisibleWireframe(material);
      return;
    }

    const exteriorGeometry = extractExteriorGeometry(geometry);
    super(exteriorGeometry, material);

    configureExteriorMaterial(material);

    const coreGeometry = buildInsetCoreGeometry(exteriorGeometry);
    const coreMaterial = createCoreMaterial();
    const coreMesh = new OriginalMesh(coreGeometry, coreMaterial);
    coreMesh.name = "rf-inset-background-core";
    coreMesh.frustumCulled = true;
    coreMesh.userData.rfInsetSolidCore = true;
    coreMesh.userData.rfInsetSolidCoreVersion = VERSION;
    this.add(coreMesh);

    geometry.dispose?.();

    this.name = "rf-builder-3-with-inset-solid-core";
    this.userData.rfSolidShellVersion = VERSION;
    this.userData.rfExteriorGeometryPreserved = true;
    this.userData.rfIntegratedOcclusionRemoved = true;
    this.userData.rfInsetSolidCore = true;
    this.userData.rfInsetSolidCoreColour = CORE_COLOUR;
    this.userData.rfInsetSolidCoreChildName = coreMesh.name;
  }
}

globalThis.FieldOpsRFThreeSolidCore = Object.freeze({
  VERSION,
  mode: "builder-3-visible-exterior-plus-inset-background-core",
  coreXZScale: CORE_XZ_SCALE,
  coreYScale: CORE_Y_SCALE,
  coreTopRatio: CORE_TOP_RATIO,
  coreColour: CORE_COLOUR,
  exteriorGeometryPreserved: true,
  closedCore: true
});

/* Destination: FieldOpsAtlas/Features/RF/rf-three-solid-core.js */
/* End of file: FieldOpsAtlas/Features/RF/rf-three-solid-core.js */

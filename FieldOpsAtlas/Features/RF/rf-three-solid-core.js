/* ========================================================================== 
   FieldOps Atlas RF Three.js closed-mountain adapter
   File: FieldOpsAtlas/Features/RF/rf-three-solid-core.js
   Version: 1.1.249-builder-3-closed-remesh

   Purpose:
   - Treat Builder 3's current exterior triangles as a coloured point cloud.
   - Rebuild those points onto one continuous 360-degree mountain surface.
   - Close the perimeter with a wall and bottom cap so the mesh has no holes.
   - Preserve Builder 3's existing colour points and shader colour masks.
   - Render one opaque, front-sided mesh with normal depth testing.
   ========================================================================== */

import * as THREEBase from "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";
export * from "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";

const VERSION = "1.1.249-builder-3-closed-remesh";
const ANGLE_SEGMENTS = 160;
const RADIAL_SEGMENTS = 64;
const NEAREST_SAMPLE_COUNT = 8;
const SEARCH_CELL_DIVISOR = 52;
const POSITION_QUANTISATION = 100000;
const TOP_RADIAL_EXPONENT = 1.24;
const SIDE_COLOUR = Object.freeze([0.025, 0.105, 0.145]);
const BOTTOM_COLOUR = Object.freeze([0.018, 0.070, 0.095]);

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
    depthWrite: true,
    depthTest: true,
    side: THREEBase.FrontSide,
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

function collectExteriorSamples(geometry) {
  const position = geometry.getAttribute("position");
  const colour = geometry.getAttribute("color");
  const colourMask = geometry.getAttribute("colourMask");
  const count = exteriorVertexCount(geometry, position.count);
  const unique = new Map();

  for (let index = 0; index < count; index += 1) {
    const x = position.getX(index);
    const y = position.getY(index);
    const z = position.getZ(index);

    if (![x, y, z].every(Number.isFinite)) continue;

    const key = `${Math.round(x * POSITION_QUANTISATION)}:`
      + `${Math.round(z * POSITION_QUANTISATION)}`;
    const sample = {
      x,
      y,
      z,
      r: Math.hypot(x, z),
      colour: [
        colour.getX(index),
        colour.getY(index),
        colour.getZ(index)
      ],
      colourMask: colourMask.getX(index) >= 0.5 ? 1 : 0
    };
    const existing = unique.get(key);

    if (!existing || sample.y > existing.y) {
      unique.set(key, sample);
    }
  }

  const samples = Array.from(unique.values());

  if (samples.length < 32) {
    throw new Error("Builder 3 does not contain enough exterior colour points.");
  }

  return samples;
}

function angularIndex(x, z) {
  const angle = Math.atan2(z, x);
  const normalised = (angle + Math.PI * 2) % (Math.PI * 2);
  return Math.floor(normalised / (Math.PI * 2) * ANGLE_SEGMENTS)
    % ANGLE_SEGMENTS;
}

function buildBoundary(samples) {
  const boundary = new Float32Array(ANGLE_SEGMENTS);
  let globalMaximum = 0;

  samples.forEach((sample) => {
    const index = angularIndex(sample.x, sample.z);
    boundary[index] = Math.max(boundary[index], sample.r);
    globalMaximum = Math.max(globalMaximum, sample.r);
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
      smoothed[index] = boundary[index] * 0.60 + (previous + next) * 0.20;
    }

    boundary.set(smoothed);
  }

  return { boundary, globalMaximum };
}

function spatialKey(column, row) {
  return `${column}:${row}`;
}

function buildSpatialIndex(samples, globalMaximum) {
  const cellSize = Math.max(globalMaximum / SEARCH_CELL_DIVISOR, 0.0025);
  const cells = new Map();

  samples.forEach((sample) => {
    const column = Math.floor(sample.x / cellSize);
    const row = Math.floor(sample.z / cellSize);
    const key = spatialKey(column, row);
    const bucket = cells.get(key) || [];
    bucket.push(sample);
    cells.set(key, bucket);
  });

  return { cells, cellSize, samples };
}

function nearestSamples(x, z, spatialIndex) {
  const { cells, cellSize } = spatialIndex;
  const originColumn = Math.floor(x / cellSize);
  const originRow = Math.floor(z / cellSize);
  const candidates = [];

  for (let radius = 0; radius <= 8; radius += 1) {
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

        const bucket = cells.get(spatialKey(column, row));
        if (bucket) candidates.push(...bucket);
      }
    }

    if (candidates.length >= NEAREST_SAMPLE_COUNT) break;
  }

  return candidates
    .map((sample) => ({
      sample,
      distanceSquared: (sample.x - x) ** 2 + (sample.z - z) ** 2
    }))
    .sort((left, right) => left.distanceSquared - right.distanceSquared)
    .slice(0, NEAREST_SAMPLE_COUNT);
}

function sampleSurface(x, z, spatialIndex, fallback) {
  const neighbours = nearestSamples(x, z, spatialIndex);

  if (!neighbours.length) {
    const nearest = spatialIndex.samples.reduce((best, sample) => {
      const distanceSquared = (sample.x - x) ** 2 + (sample.z - z) ** 2;
      return !best || distanceSquared < best.distanceSquared
        ? { sample, distanceSquared }
        : best;
    }, null);

    return nearest ? { ...nearest.sample, x, z } : { ...fallback, x, z };
  }

  const nearest = neighbours[0].sample;

  if (neighbours[0].distanceSquared <= 1e-10) {
    return { ...nearest, x, z };
  }

  let weightedHeight = 0;
  let totalWeight = 0;

  neighbours.forEach(({ sample, distanceSquared }) => {
    const weight = 1 / Math.max(distanceSquared, 1e-8);
    weightedHeight += sample.y * weight;
    totalWeight += weight;
  });

  return {
    x,
    y: nearest.y * 0.72 + (weightedHeight / totalWeight) * 0.28,
    z,
    colour: nearest.colour,
    colourMask: nearest.colourMask
  };
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

function pushTriangle(output, first, second, third, surfaceType) {
  let a = first;
  let b = second;
  let c = third;
  let normal = triangleNormal(a, b, c);

  if (surfaceType === "top" && normal.y < 0) {
    [b, c] = [c, b];
  } else if (surfaceType === "bottom" && normal.y > 0) {
    [b, c] = [c, b];
  } else if (surfaceType === "side") {
    const outwardX = (a.x + b.x + c.x) / 3;
    const outwardZ = (a.z + b.z + c.z) / 3;
    const outwardDot = normal.x * outwardX + normal.z * outwardZ;

    if (outwardDot < 0) [b, c] = [c, b];
  }

  const barycentrics = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ];

  [a, b, c].forEach((point, index) => {
    output.positions.push(point.x, point.y, point.z);
    output.colours.push(...point.colour);
    output.barycentrics.push(...barycentrics[index]);
    output.colourMasks.push(point.colourMask);
    output.interiorMasks.push(point.interiorMask || 0);
  });
}

function buildClosedMountainGeometry(sourceGeometry) {
  const samples = collectExteriorSamples(sourceGeometry);
  const { boundary, globalMaximum } = buildBoundary(samples);
  const spatialIndex = buildSpatialIndex(samples, globalMaximum);
  const bounds = sourceGeometry.boundingBox
    || (sourceGeometry.computeBoundingBox(), sourceGeometry.boundingBox);
  const baseY = bounds?.min?.y ?? Math.min(...samples.map((sample) => sample.y));
  const peakSample = samples.reduce(
    (highest, sample) => sample.y > highest.y ? sample : highest,
    samples[0]
  );
  const center = sampleSurface(0, 0, spatialIndex, peakSample);
  const rings = [];

  for (let ring = 1; ring <= RADIAL_SEGMENTS; ring += 1) {
    const radialFraction = Math.pow(
      ring / RADIAL_SEGMENTS,
      TOP_RADIAL_EXPONENT
    );
    const points = [];

    for (let angleIndex = 0;
      angleIndex < ANGLE_SEGMENTS;
      angleIndex += 1) {
      const angle = angleIndex / ANGLE_SEGMENTS * Math.PI * 2;
      const radius = boundary[angleIndex] * radialFraction;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      points.push(sampleSurface(x, z, spatialIndex, peakSample));
    }

    rings.push(points);
  }

  const output = {
    positions: [],
    colours: [],
    barycentrics: [],
    colourMasks: [],
    interiorMasks: []
  };
  const firstRing = rings[0];

  for (let angleIndex = 0;
    angleIndex < ANGLE_SEGMENTS;
    angleIndex += 1) {
    const next = (angleIndex + 1) % ANGLE_SEGMENTS;
    pushTriangle(
      output,
      center,
      firstRing[angleIndex],
      firstRing[next],
      "top"
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
        output,
        inner[angleIndex],
        outer[angleIndex],
        outer[next],
        "top"
      );
      pushTriangle(
        output,
        inner[angleIndex],
        outer[next],
        inner[next],
        "top"
      );
    }
  }

  const outerRing = rings[rings.length - 1];
  const bottomRing = outerRing.map((point) => ({
    x: point.x,
    y: baseY,
    z: point.z,
    colour: SIDE_COLOUR,
    colourMask: 0,
    interiorMask: 1
  }));
  const bottomCenter = {
    x: 0,
    y: baseY,
    z: 0,
    colour: BOTTOM_COLOUR,
    colourMask: 0,
    interiorMask: 1
  };

  for (let angleIndex = 0;
    angleIndex < ANGLE_SEGMENTS;
    angleIndex += 1) {
    const next = (angleIndex + 1) % ANGLE_SEGMENTS;
    const topA = outerRing[angleIndex];
    const topB = outerRing[next];
    const bottomA = bottomRing[angleIndex];
    const bottomB = bottomRing[next];

    pushTriangle(output, topA, bottomA, bottomB, "side");
    pushTriangle(output, topA, bottomB, topB, "side");
    pushTriangle(output, bottomCenter, bottomB, bottomA, "bottom");
  }

  const geometry = new THREEBase.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREEBase.Float32BufferAttribute(output.positions, 3)
  );
  geometry.setAttribute(
    "color",
    new THREEBase.Float32BufferAttribute(output.colours, 3)
  );
  geometry.setAttribute(
    "barycentric",
    new THREEBase.Float32BufferAttribute(output.barycentrics, 3)
  );
  geometry.setAttribute(
    "colourMask",
    new THREEBase.Float32BufferAttribute(output.colourMasks, 1)
  );
  geometry.setAttribute(
    "interiorMask",
    new THREEBase.Float32BufferAttribute(output.interiorMasks, 1)
  );
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  geometry.userData = {
    ...sourceGeometry.userData,
    rfClosedRemesh: true,
    rfClosedRemeshVersion: VERSION,
    rfClosedRemeshWatertight: true,
    rfClosedRemeshSourcePointCount: samples.length,
    rfClosedRemeshAngleSegments: ANGLE_SEGMENTS,
    rfClosedRemeshRadialSegments: RADIAL_SEGMENTS,
    rfInternalCapAttached: true
  };

  return geometry;
}

function configureOpaqueClosedSurface(material) {
  materialList(material).forEach((entry) => {
    if (!entry) return;

    entry.transparent = false;
    entry.opacity = 1;
    entry.alphaTest = 0;
    entry.depthWrite = true;
    entry.depthTest = true;
    entry.colorWrite = true;
    entry.side = THREEBase.FrontSide;
    entry.blending = THREEBase.NoBlending;
    entry.premultipliedAlpha = false;
    entry.needsUpdate = true;
  });
}

function configureVisibleWireframe(material) {
  materialList(material).forEach((entry) => {
    if (!entry?.wireframe) return;

    entry.side = THREEBase.FrontSide;
    entry.depthTest = true;
    entry.depthWrite = false;
    entry.needsUpdate = true;
  });
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
    const renderGeometry = builderMountain
      ? buildClosedMountainGeometry(geometry)
      : geometry;

    super(renderGeometry, material);

    if (builderMountain) {
      geometry.dispose?.();
      configureOpaqueClosedSurface(material);
      this.name = "rf-closed-mountain-shell";
      this.userData.rfSolidShellVersion = VERSION;
      this.userData.rfClosedRemesh = true;
      this.userData.rfInternalCapAttached = true;
      return;
    }

    if (isWireframeMaterial(material)) {
      configureVisibleWireframe(material);
    }
  }
}

globalThis.FieldOpsRFThreeSolidCore = Object.freeze({
  VERSION,
  angleSegments: ANGLE_SEGMENTS,
  radialSegments: RADIAL_SEGMENTS,
  closedRemesh: true
});

/* Destination: FieldOpsAtlas/Features/RF/rf-three-solid-core.js */
/* End of file: FieldOpsAtlas/Features/RF/rf-three-solid-core.js */

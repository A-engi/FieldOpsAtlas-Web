/* ==========================================================================
   FieldOps Atlas RF Three.js solid-shell adapter
   File: FieldOpsAtlas/Features/RF/rf-three-solid-core.js
   Version: 1.1.248-builder-3-mask-colour-output

   Purpose:
   - Preserve the current Builder 3 exterior geometry.
   - Keep the approved central peak unchanged.
   - Brighten only the four secondary peaks.
   - Keep the visible mountain shell fully opaque.
   - Do not create any internal horizontal cap or replacement plane.
   - Remove coloured treatment from low, almost-horizontal skin faces.
   - Apply Builder 3's colour mask inside its custom shader.
   - Apply Three.js tone mapping and output colour-space conversion.
   - Prevent transparent wireframe overlays from drawing back faces.
   ========================================================================== */

import * as THREEBase from "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";
export * from "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";

const VERSION = "1.1.248-builder-3-mask-colour-output";

const SECONDARY_PEAK_TARGET_MAX = 1;
const SECONDARY_PEAK_STRENGTH = 0.96;
const LOW_HORIZONTAL_MAX_HEIGHT_RATIO = 0.36;
const HORIZONTAL_NORMAL_Y_MIN = 0.92;
const NEUTRAL_SKIN_COLOUR = new THREEBase.Color(0x06131a);

/*
 * Builder 3 translates its source geometry by:
 *   x -= META.center[0]
 *   y -= META.boundsMin[1]
 *   z -= META.center[2]
 *
 * The coordinates below are therefore in the live translated geometry space.
 * Peak radii use the narrower source-identified regions rather than the broad
 * Layer-2 fade radii, which previously overlapped and altered the main peak.
 */
const MAIN_PEAK = Object.freeze({
  x: 0.019635006830198476,
  y: 0.9086992847261541,
  z: 0.0007775044148700117,
  outerRadius: 0.08054548592230482
});

const SECONDARY_PEAKS = Object.freeze([
  Object.freeze({
    x: -0.07001383516569858,
    y: 0.7510444305667527,
    z: -0.004246370265828303,
    baseY: 0.475,
    fullRadius: 0.056353437349480166,
    outerRadius: 0.11571943055781153
  }),
  Object.freeze({
    x: 0.09025027463754276,
    y: 0.7623728400520853,
    z: -0.0026913614360883904,
    baseY: 0.475,
    fullRadius: 0.058657359157477496,
    outerRadius: 0.12255162993026053
  }),
  Object.freeze({
    x: 0.002464694551057911,
    y: 0.7255312439657589,
    z: 0.09264264143335321,
    baseY: 0.475,
    fullRadius: 0.06643181712826672,
    outerRadius: 0.12062755993172357
  }),
  Object.freeze({
    x: 0.019564250048828335,
    y: 0.7782908499531401,
    z: -0.06151854162578895,
    baseY: 0.475,
    fullRadius: 0.06693372515836765,
    outerRadius: 0.13159058221864872
  })
]);

const OriginalMesh = THREEBase.Mesh;
const OriginalShaderMaterial = THREEBase.ShaderMaterial;

function materialList(material) {
  return Array.isArray(material) ? material : [material];
}

function isBuilderSurface(geometry, material) {
  if (!geometry) return false;

  const position = geometry.getAttribute?.("position");
  const colour = geometry.getAttribute?.("color");
  const materials = materialList(material);

  return Boolean(
    position &&
    colour &&
    geometry.index &&
    materials.length === 1 &&
    materials[0] &&
    materials[0].vertexColors === true &&
    materials[0].wireframe !== true
  );
}

function isWireframeMaterial(material) {
  return materialList(material).some((entry) => entry?.wireframe === true);
}

function isBuilderMountainShader(parameters) {
  const vertexShader = parameters?.vertexShader;
  const fragmentShader = parameters?.fragmentShader;

  return typeof vertexShader === "string"
    && typeof fragmentShader === "string"
    && vertexShader.includes("attribute vec3 barycentric;")
    && fragmentShader.includes("float triangleEdgeMask()")
    && fragmentShader.includes("float layer1Area = circularAreaMask(0, vModelPosition);");
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

  shader = insertOnce(
    shader,
    "attribute vec3 barycentric;",
    "attribute vec3 barycentric;\n        attribute float colourMask;",
    "colourMask attribute"
  );

  shader = insertOnce(
    shader,
    "varying vec3 vBarycentric;",
    "varying vec3 vBarycentric;\n        varying float vColourMask;",
    "colourMask varying"
  );

  shader = insertOnce(
    shader,
    "vBarycentric = barycentric;",
    "vBarycentric = barycentric;\n          vColourMask = colourMask;",
    "colourMask assignment"
  );

  return shader;
}

function patchBuilderFragmentShader(source) {
  let shader = source;

  shader = insertOnce(
    shader,
    "varying vec3 vBarycentric;",
    "varying vec3 vBarycentric;\n        varying float vColourMask;",
    "fragment colourMask varying"
  );

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

  return shader;
}

function patchBuilderShaderParameters(parameters) {
  if (!isBuilderMountainShader(parameters)) {
    return parameters;
  }

  return {
    ...parameters,
    vertexShader: patchBuilderVertexShader(parameters.vertexShader),
    fragmentShader: patchBuilderFragmentShader(parameters.fragmentShader)
  };
}

function smoothstep(minimum, maximum, value) {
  if (maximum <= minimum) return value >= maximum ? 1 : 0;

  const t = THREEBase.MathUtils.clamp(
    (value - minimum) / (maximum - minimum),
    0,
    1
  );

  return t * t * (3 - 2 * t);
}

function radialDistance(x, z, peak) {
  return Math.hypot(x - peak.x, z - peak.z);
}

function ownsPeakRegion(x, z, secondaryPeak) {
  const secondaryScore =
    radialDistance(x, z, secondaryPeak) / secondaryPeak.outerRadius;
  const mainScore =
    radialDistance(x, z, MAIN_PEAK) / MAIN_PEAK.outerRadius;

  if (secondaryScore >= mainScore) return false;

  return SECONDARY_PEAKS.every((candidate) => {
    if (candidate === secondaryPeak) return true;

    const candidateScore =
      radialDistance(x, z, candidate) / candidate.outerRadius;

    return secondaryScore <= candidateScore;
  });
}

function secondaryPeakInfluence(x, y, z, peak) {
  if (y <= peak.baseY || !ownsPeakRegion(x, z, peak)) return 0;

  const distance = radialDistance(x, z, peak);
  if (distance >= peak.outerRadius) return 0;

  const radialWeight = 1 - smoothstep(
    peak.fullRadius,
    peak.outerRadius,
    distance
  );

  const heightWeight = smoothstep(peak.baseY, peak.y, y);
  const visiblePeakWeight = 0.30 + heightWeight * 0.70;

  return radialWeight * visiblePeakWeight;
}

function brightenSecondaryPeaks(geometry) {
  const position = geometry.getAttribute("position");
  const colour = geometry.getAttribute("color");

  if (!position || !colour || position.count !== colour.count) {
    return 0;
  }

  let changedVertexCount = 0;

  for (let vertexIndex = 0; vertexIndex < position.count; vertexIndex += 1) {
    const x = position.getX(vertexIndex);
    const y = position.getY(vertexIndex);
    const z = position.getZ(vertexIndex);

    let influence = 0;

    for (const peak of SECONDARY_PEAKS) {
      influence = Math.max(
        influence,
        secondaryPeakInfluence(x, y, z, peak)
      );
    }

    if (influence <= 0.001) continue;

    const red = colour.getX(vertexIndex);
    const green = colour.getY(vertexIndex);
    const blue = colour.getZ(vertexIndex);
    const maximumChannel = Math.max(red, green, blue, 1 / 255);
    const gain = SECONDARY_PEAK_TARGET_MAX / maximumChannel;
    const amount = influence * SECONDARY_PEAK_STRENGTH;

    colour.setXYZ(
      vertexIndex,
      THREEBase.MathUtils.lerp(red, Math.min(1, red * gain), amount),
      THREEBase.MathUtils.lerp(green, Math.min(1, green * gain), amount),
      THREEBase.MathUtils.lerp(blue, Math.min(1, blue * gain), amount)
    );

    changedVertexCount += 1;
  }

  colour.needsUpdate = true;
  return changedVertexCount;
}

function triangleNormalY(position, first, second, third) {
  const ax = position.getX(first);
  const ay = position.getY(first);
  const az = position.getZ(first);

  const abx = position.getX(second) - ax;
  const aby = position.getY(second) - ay;
  const abz = position.getZ(second) - az;

  const acx = position.getX(third) - ax;
  const acy = position.getY(third) - ay;
  const acz = position.getZ(third) - az;

  const crossX = aby * acz - abz * acy;
  const crossY = abz * acx - abx * acz;
  const crossZ = abx * acy - aby * acx;
  const length = Math.hypot(crossX, crossY, crossZ);

  return length > 1e-12 ? Math.abs(crossY) / length : 0;
}

function neutraliseLowHorizontalSkin(geometry) {
  const position = geometry.getAttribute("position");
  const colour = geometry.getAttribute("color");

  if (!position || !colour || position.count !== colour.count) {
    return 0;
  }

  geometry.computeBoundingBox();
  const bounds = geometry.boundingBox;

  if (!bounds) return 0;

  const height = Math.max(bounds.max.y - bounds.min.y, 1e-6);
  const maximumFaceY =
    bounds.min.y + height * LOW_HORIZONTAL_MAX_HEIGHT_RATIO;

  let changedFaceCount = 0;

  for (let first = 0; first + 2 < position.count; first += 3) {
    const second = first + 1;
    const third = first + 2;

    const faceMaximumY = Math.max(
      position.getY(first),
      position.getY(second),
      position.getY(third)
    );

    if (faceMaximumY > maximumFaceY) continue;

    const normalY = triangleNormalY(position, first, second, third);
    if (normalY < HORIZONTAL_NORMAL_Y_MIN) continue;

    for (const vertexIndex of [first, second, third]) {
      colour.setXYZ(
        vertexIndex,
        NEUTRAL_SKIN_COLOUR.r,
        NEUTRAL_SKIN_COLOUR.g,
        NEUTRAL_SKIN_COLOUR.b
      );
    }

    changedFaceCount += 1;
  }

  colour.needsUpdate = true;
  return changedFaceCount;
}

function prepareSurfaceGeometry(sourceGeometry) {
  /*
   * The source is indexed, so neighbouring triangles share colour vertices.
   * Expanding only the visible surface lets low horizontal faces be neutralised
   * without dragging that neutral colour up adjacent slopes.
   */
  const geometry = sourceGeometry.clone().toNonIndexed();

  const brightenedVertexCount = brightenSecondaryPeaks(geometry);
  const neutralisedFaceCount = neutraliseLowHorizontalSkin(geometry);

  geometry.userData = {
    ...sourceGeometry.userData,
    rfSolidShellVersion: VERSION,
    rfInternalCapAttached: false,
    rfSecondaryPeaksBrightened: true,
    rfSecondaryPeaksBrightenedVertexCount: brightenedVertexCount,
    rfLowHorizontalSkinNeutralised: true,
    rfLowHorizontalSkinNeutralisedFaceCount: neutralisedFaceCount
  };

  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();

  return geometry;
}

function configureOpaqueSurface(material) {
  materialList(material).forEach((entry) => {
    if (!entry) return;

    entry.transparent = false;
    entry.opacity = 1;
    entry.depthWrite = true;
    entry.depthTest = true;
    entry.side = THREEBase.DoubleSide;
    entry.blending = THREEBase.NormalBlending;
    entry.needsUpdate = true;
  });
}

function configureVisibleWireframe(material) {
  materialList(material).forEach((entry) => {
    if (!entry?.wireframe) return;

    /*
     * Front-side wireframe prevents the opposite side of the open source shell
     * from reading as an X-ray through the mountain.
     */
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
    const builderSurface = isBuilderSurface(geometry, material);
    const renderGeometry = builderSurface
      ? prepareSurfaceGeometry(geometry)
      : geometry;

    super(renderGeometry, material);

    if (builderSurface) {
      configureOpaqueSurface(material);
      this.name = "rf-opaque-mountain-shell";
      this.userData.rfSolidShellVersion = VERSION;
      this.userData.rfInternalCapAttached = false;
      return;
    }

    if (isWireframeMaterial(material)) {
      configureVisibleWireframe(material);
    }
  }
}

window.FieldOpsRFThreeSolidCore = Object.freeze({ VERSION });

/* Destination: FieldOpsAtlas/Features/RF/rf-three-solid-core.js */
/* End of file: FieldOpsAtlas/Features/RF/rf-three-solid-core.js */

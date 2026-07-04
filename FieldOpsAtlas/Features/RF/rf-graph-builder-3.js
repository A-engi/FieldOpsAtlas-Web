/*
 * FieldOps Atlas Builder 3 — promoted spiky opaque shell with relief shading v2.
 * Built from the known-working ridge restoration patch.
 * All AD() edits are scoped and whitespace-tolerant.
 */
export const PATCH_VERSION = "1.1.354-builder-3-promoted-spiky-opaque-relief-v2";

function replaceRequired(source, search, replacement, label) {
  const count = source.split(search).length - 1;
  if (count !== 1) throw new Error(`${label}: expected one match, found ${count}`);
  return source.replace(search, replacement);
}

function replaceRegexRequired(source, expression, replacement, label) {
  const matches = [...source.matchAll(new RegExp(expression.source, expression.flags.includes('g') ? expression.flags : `${expression.flags}g`))];
  if (matches.length !== 1) throw new Error(`${label}: expected one match, found ${matches.length}`);
  return source.replace(expression, replacement);
}

function patchAdSection(source, patcher, label) {
  const startAnchor = '  function AD(G) {';
  const endAnchor = '  class GD extends e.Mesh {';
  const start = source.indexOf(startAnchor);
  const end = source.indexOf(endAnchor, start + startAnchor.length);
  if (start < 0 || end < 0) throw new Error(`${label}: AD() section anchors were not found`);
  const original = source.slice(start, end);
  const patched = patcher(original);
  if (patched === original) throw new Error(`${label}: AD() section was unchanged`);
  return source.slice(0, start) + patched + source.slice(end);
}

export function promoteSpikyOpaqueReliefV2(input) {
  let source = String(input);
  if (!source.includes('1.1.348-builder-3-fork-gap-blend')) {
    throw new Error('Expected Builder 3 v1.1.348 source marker was not found.');
  }
  if (!source.includes('function AD(G)')) {
    throw new Error('Existing AD() closed-envelope shell constructor was not found.');
  }

  source = patchAdSection(source, (ad) => {
    ad = replaceRequired(ad, 'const topScale = 0.95;', 'const topScale = 1.0;', 'promote shell height');
    ad = replaceRequired(ad, 'const radialScale = 0.925 - levelRatio * 0.015;', 'const radialScale = 1.0;', 'promote shell radial profile');
    ad = replaceRequired(
      ad,
      'const heightJitter = (random - 0.5) * m * 0.0040 * (1 - levelRatio * 0.72);',
      'const heightJitter = (random - 0.5) * m * 0.0080 * (1 - levelRatio * 0.46);',
      'increase vertical facet relief'
    );
    ad = replaceRequired(
      ad,
      'const radiusJitter = 0.995 + (random - 0.5) * 0.008;',
      'const radiusJitter = 1.0 + (random - 0.34) * 0.030 * (0.58 + levelRatio * 0.42);',
      'increase outward facet relief'
    );

    const colourBlock = /const heightRatio\s*=\s*Math\.max\(0,\s*Math\.min\(1,\s*\(\(\(ay\s*\+\s*by\s*\+\s*cy\)\s*\/\s*3\)\s*-\s*H\)\s*\/\s*Math\.max\(m\s*\*\s*topScale,\s*1e-6\)\)\);[\s\S]*?colour\.multiplyScalar\(0\.86\s*\+\s*heightRatio\s*\*\s*0\.16\);/;
    ad = replaceRegexRequired(ad, colourBlock,
`const centreX = ((ax + bx + cx) / 3) - L;
      const centreZ = ((az + bz + cz) / 3) - X;
      const heightRatio = Math.max(0, Math.min(1, (((ay + by + cy) / 3) - H) / Math.max(m * topScale, 1e-6)));
      const radialExtent = Math.max(Z.max.x - L, L - Z.min.x, Z.max.z - X, X - Z.min.z, 1e-6);
      const radialRatio = Math.max(0, Math.min(1, Math.hypot(centreX, centreZ) / radialExtent));
      const middleBand = Math.max(0, 1 - Math.abs(heightRatio - 0.46) / 0.43);
      const ridgeBand = middleBand * Math.pow(radialRatio, 1.18);
      const seed = Math.sin((ax + bx + cx) * 37.7 + (ay + by + cy) * 21.3 + (az + bz + cz) * 53.1) * 43758.5453;
      const random = seed - Math.floor(seed);
      const highlight = ridgeBand * 0.80 + heightRatio * 0.16 + random * 0.10;
      let tier = 0;
      if (highlight > 0.78) tier = 3;
      else if (highlight > 0.52) tier = 2;
      else if (highlight > 0.27) tier = 1;
      const colour = new e.Color(shellPalette[tier]);
      const inwardDarkening = 0.50 + radialRatio * 0.20;
      const ridgeLift = ridgeBand * 0.30 + heightRatio * 0.06;
      colour.multiplyScalar(Math.max(0.38, Math.min(1.08, inwardDarkening + ridgeLift)));`,
      'apply inward darkening and ridge brightness'
    );

    const materialBlock = /const shellMaterial\s*=\s*new e\.MeshBasicMaterial\(\{[\s\S]*?polygonOffsetUnits:\s*-1\.0\s*\}\);/;
    ad = replaceRegexRequired(ad, materialBlock,
`const shellMaterial = new e.ShaderMaterial({
      transparent: false,
      depthTest: true,
      depthWrite: true,
      side: e.DoubleSide,
      toneMapped: false,
      vertexShader: \`
        attribute vec3 color;
        varying vec3 vColour;
        varying vec3 vViewPosition;
        void main() {
          vColour = color;
          vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = viewPosition.xyz;
          gl_Position = projectionMatrix * viewPosition;
        }
      \`,
      fragmentShader: \`
        varying vec3 vColour;
        varying vec3 vViewPosition;
        void main() {
          vec3 faceNormal = normalize(cross(dFdx(vViewPosition), dFdy(vViewPosition)));
          if (!gl_FrontFacing) faceNormal = -faceNormal;
          vec3 keyDirection = normalize(vec3(-0.36, 0.80, 0.47));
          vec3 fillDirection = normalize(vec3(0.68, 0.24, 0.63));
          float keyLight = max(dot(faceNormal, keyDirection), 0.0);
          float fillLight = max(dot(faceNormal, fillDirection), 0.0);
          float topLight = max(faceNormal.y, 0.0);
          float facetShade = 0.50 + keyLight * 0.34 + fillLight * 0.12 + topLight * 0.10;
          vec3 colour = vColour * facetShade;
          gl_FragColor = vec4(clamp(colour, 0.0, 1.0), 1.0);
          #include <colorspace_fragment>
        }
      \`
    });`,
      'replace shell material with supported opaque shader'
    );
    return ad;
  }, 'patch promoted relief shell');

  // Keep the same working ridge/fork overlay path, only increase its contrast.
  source = replaceRequired(
    source,
    '            gl_FragColor = vec4(vSkinColour, 0.64);',
    '            gl_FragColor = vec4(vSkinColour, 0.80);',
    'brighten ridge and fork overlay'
  );

  source = replaceRequired(
    source,
`        this.add(AD(Y));
        this.name = "rf-builder-3-single-three-layer-mountain";
        this.userData.rfSolidCoreVersion = i;
        this.userData.rfExteriorGeometryPreserved = true;
        this.userData.rfClosedEnvelopeCore = true;`,
`        this.clear();
        t.visible = false;
        const promotedExterior = AD(Y);
        promotedExterior.name = "rf-spiky-faceted-opaque-exterior-relief-v2";
        promotedExterior.renderOrder = 0;
        promotedExterior.userData.rfPromotedExterior = true;
        promotedExterior.userData.rfOpaque = true;
        promotedExterior.userData.rfRidgesRestored = true;
        promotedExterior.userData.rfFacetReliefBoosted = true;
        promotedExterior.userData.rfSource = "existing-AD-closed-envelope-shell";
        this.add(promotedExterior);
        this.name = "rf-builder-3-promoted-spiky-opaque-relief-v2";
        this.userData.rfSolidCoreVersion = "${PATCH_VERSION}";
        this.userData.rfExteriorGeometryPreserved = false;
        this.userData.rfClosedEnvelopeCore = false;
        this.userData.rfPromotedSpikyExterior = true;
        this.userData.rfRidgesRestored = true;
        this.userData.rfFacetReliefBoosted = true;`,
    'promote shell and hide flat parent'
  );

  source = replaceRequired(
    source,
    'new h.WebGLRenderer({ canvas: B, alpha: !0, antialias: !0, powerPreference: "high-performance" })',
    'new h.WebGLRenderer({ canvas: B, alpha: !1, antialias: !0, powerPreference: "high-performance" })',
    'make renderer opaque'
  );
  source = replaceRequired(source, 'g.setClearColor(0x01090e, 0)', 'g.setClearColor(0x01090e, 1)', 'make clear colour opaque');
  source = replaceRequired(
    source,
    'c.background = null, c.fog = new h.Fog(0x01090e, 30, 92);',
    'c.background = new h.Color(0x01090e), c.fog = new h.Fog(0x01090e, 30, 92);',
    'set opaque scene background'
  );

  source = source.replaceAll('1.1.348-builder-3-fork-gap-blend', PATCH_VERSION);
  return source;
}

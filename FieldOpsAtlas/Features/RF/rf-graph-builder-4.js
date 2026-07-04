/*
 * FieldOps Atlas RF Builder 4
 * Exterior-only opaque relief shell
 * Version: 1.0.1-builder-4-clean
 */

(() => {
  "use strict";

  /* ============================================================
   * 1. CONFIGURATION
   * ============================================================ */

  const VERSION = "1.0.1-builder-4-clean";
  const SOURCE_VERSION = "1.1.348-builder-3-fork-gap-blend";
  const SOURCE_URL = new URL("rf-graph-builder-3.js", window.location.href).href;
  const MOUNT_SELECTOR = "[data-rf-graph]";

  let sourcePromise;
  let importPromise;

  /* ============================================================
   * 2. SOURCE TRANSFORM HELPERS
   * ============================================================ */

  function replaceOnce(source, search, replacement, label) {
    const count = source.split(search).length - 1;

    if (count !== 1) {
      throw new Error(`${label}: expected one match, found ${count}`);
    }

    return source.replace(search, replacement);
  }

  function replaceRegexOnce(source, expression, replacement, label) {
    const flags = expression.flags.includes("g")
      ? expression.flags
      : `${expression.flags}g`;
    const matches = [
      ...source.matchAll(new RegExp(expression.source, flags))
    ];

    if (matches.length !== 1) {
      throw new Error(`${label}: expected one match, found ${matches.length}`);
    }

    return source.replace(expression, replacement);
  }

  function transformAdSection(source, transform) {
    const startMarker = "  function AD(G) {";
    const endMarker = "  class GD extends e.Mesh {";
    const start = source.indexOf(startMarker);
    const end = source.indexOf(endMarker, start + startMarker.length);

    if (start < 0 || end < 0) {
      throw new Error("Builder 4 exterior shell section was not found.");
    }

    const original = source.slice(start, end);
    const updated = transform(original);

    if (updated === original) {
      throw new Error("Builder 4 exterior shell was not changed.");
    }

    return source.slice(0, start) + updated + source.slice(end);
  }

  /* ============================================================
   * 3. EXTERIOR SHELL TRANSFORM
   * ============================================================ */

  function transformExteriorShell(source) {
    return transformAdSection(source, (section) => {
      section = replaceOnce(
        section,
        "const topScale = 0.95;",
        "const topScale = 1.0;",
        "promote shell height"
      );

      section = replaceOnce(
        section,
        "const radialScale = 0.925 - levelRatio * 0.015;",
        "const radialScale = 1.0;",
        "promote shell radius"
      );

      section = replaceOnce(
        section,
        "const heightJitter = (random - 0.5) * m * 0.0040 * (1 - levelRatio * 0.72);",
        "const heightJitter = (random - 0.5) * m * 0.0080 * (1 - levelRatio * 0.46);",
        "increase vertical relief"
      );

      section = replaceOnce(
        section,
        "const radiusJitter = 0.995 + (random - 0.5) * 0.008;",
        "const radiusJitter = 1.0 + (random - 0.34) * 0.030 * (0.58 + levelRatio * 0.42);",
        "increase outward relief"
      );

      const colourBlock =
        /const heightRatio\s*=\s*Math\.max\(0,\s*Math\.min\(1,\s*\(\(\(ay\s*\+\s*by\s*\+\s*cy\)\s*\/\s*3\)\s*-\s*H\)\s*\/\s*Math\.max\(m\s*\*\s*topScale,\s*1e-6\)\)\);[\s\S]*?colour\.multiplyScalar\(0\.86\s*\+\s*heightRatio\s*\*\s*0\.16\);/;

      section = replaceRegexOnce(
        section,
        colourBlock,
`const centreX = ((ax + bx + cx) / 3) - L;
      const centreZ = ((az + bz + cz) / 3) - X;
      const heightRatio = Math.max(
        0,
        Math.min(
          1,
          (((ay + by + cy) / 3) - H) / Math.max(m * topScale, 1e-6)
        )
      );
      const radialExtent = Math.max(
        Z.max.x - L,
        L - Z.min.x,
        Z.max.z - X,
        X - Z.min.z,
        1e-6
      );
      const radialRatio = Math.max(
        0,
        Math.min(1, Math.hypot(centreX, centreZ) / radialExtent)
      );
      const middleBand = Math.max(
        0,
        1 - Math.abs(heightRatio - 0.46) / 0.43
      );
      const ridgeBand = middleBand * Math.pow(radialRatio, 1.18);
      const seed = Math.sin(
        (ax + bx + cx) * 37.7 +
        (ay + by + cy) * 21.3 +
        (az + bz + cz) * 53.1
      ) * 43758.5453;
      const random = seed - Math.floor(seed);
      const highlight =
        ridgeBand * 0.80 +
        heightRatio * 0.16 +
        random * 0.10;
      let tier = 0;

      if (highlight > 0.78) tier = 3;
      else if (highlight > 0.52) tier = 2;
      else if (highlight > 0.27) tier = 1;

      const colour = new e.Color(shellPalette[tier]);
      const inwardDarkening = 0.50 + radialRatio * 0.20;
      const ridgeLift = ridgeBand * 0.30 + heightRatio * 0.06;

      colour.multiplyScalar(
        Math.max(0.38, Math.min(1.08, inwardDarkening + ridgeLift))
      );`,
        "apply relief colour shading"
      );

      const materialBlock =
        /const shellMaterial\s*=\s*new e\.MeshBasicMaterial\(\{[\s\S]*?polygonOffsetUnits:\s*-1\.0\s*\}\);/;

      section = replaceRegexOnce(
        section,
        materialBlock,
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
          vec3 faceNormal = normalize(
            cross(dFdx(vViewPosition), dFdy(vViewPosition))
          );

          if (!gl_FrontFacing) faceNormal = -faceNormal;

          vec3 keyDirection = normalize(vec3(-0.36, 0.80, 0.47));
          vec3 fillDirection = normalize(vec3(0.68, 0.24, 0.63));
          float keyLight = max(dot(faceNormal, keyDirection), 0.0);
          float fillLight = max(dot(faceNormal, fillDirection), 0.0);
          float topLight = max(faceNormal.y, 0.0);
          float facetShade =
            0.50 +
            keyLight * 0.34 +
            fillLight * 0.12 +
            topLight * 0.10;
          vec3 colour = vColour * facetShade;

          gl_FragColor = vec4(clamp(colour, 0.0, 1.0), 1.0);
          #include <colorspace_fragment>
        }
      \`
    });`,
        "replace shell material"
      );

      return section;
    });
  }

  /* ============================================================
   * 4. BUILDER 4 SOURCE ASSEMBLY
   * ============================================================ */

  function buildBuilder4Source(input) {
    let source = String(input);

    if (!source.includes(SOURCE_VERSION)) {
      throw new Error(`Expected source marker ${SOURCE_VERSION} was not found.`);
    }

    if (!source.includes("function AD(G)")) {
      throw new Error("Builder 4 source shell was not found.");
    }

    source = transformExteriorShell(source);

    source = replaceOnce(
      source,
      "            gl_FragColor = vec4(vSkinColour, 0.64);",
      "            gl_FragColor = vec4(vSkinColour, 0.80);",
      "brighten ridge and fork overlay"
    );

    source = replaceOnce(
      source,
`        this.add(AD(Y));
        this.name = "rf-builder-3-single-three-layer-mountain";
        this.userData.rfSolidCoreVersion = i;
        this.userData.rfExteriorGeometryPreserved = true;
        this.userData.rfClosedEnvelopeCore = true;`,
`        this.clear();
        t.visible = false;

        const exterior = AD(Y);
        exterior.name = "rf-builder-4-exterior-shell";
        exterior.renderOrder = 0;
        exterior.userData.rfBuilder4Exterior = true;
        exterior.userData.rfOpaque = true;

        this.add(exterior);
        this.name = "rf-builder-4-mountain";`,
      "replace legacy mesh hierarchy"
    );

    source = replaceOnce(
      source,
      'new h.WebGLRenderer({ canvas: B, alpha: !0, antialias: !0, powerPreference: "high-performance" })',
      'new h.WebGLRenderer({ canvas: B, alpha: !1, antialias: !0, powerPreference: "high-performance" })',
      "make renderer opaque"
    );

    source = replaceOnce(
      source,
      "g.setClearColor(0x01090e, 0)",
      "g.setClearColor(0x01090e, 1)",
      "make clear colour opaque"
    );

    source = replaceOnce(
      source,
      "c.background = null, c.fog = new h.Fog(0x01090e, 30, 92);",
      "c.background = new h.Color(0x01090e), c.fog = new h.Fog(0x01090e, 30, 92);",
      "set scene background"
    );

    return source.replaceAll(SOURCE_VERSION, VERSION);
  }

  /* ============================================================
   * 5. SOURCE LOADER
   * ============================================================ */

  function loadSource() {
    if (!sourcePromise) {
      sourcePromise = fetch(SOURCE_URL, {
        cache: "no-store",
        mode: "cors"
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`Builder 4 source fetch failed: HTTP ${response.status}`);
        }

        return response.text();
      });
    }

    return sourcePromise;
  }

  function loadBuilder4() {
    if (!importPromise) {
      importPromise = loadSource().then((source) => {
        const transformed = buildBuilder4Source(source);
        const objectUrl = URL.createObjectURL(
          new Blob([transformed], { type: "text/javascript" })
        );

        return import(objectUrl).finally(() => {
          URL.revokeObjectURL(objectUrl);
        });
      });
    }

    return importPromise;
  }

  /* ============================================================
   * 6. ERROR HANDLING
   * ============================================================ */

  function escapeHtml(value) {
    return String(value).replace(
      /[&<>\"]/g,
      (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;"
      })[character]
    );
  }

  function showError(error) {
    const message = String(
      error?.message || error || "Builder 4 failed to load."
    );

    document.querySelectorAll(MOUNT_SELECTOR).forEach((mount) => {
      mount.dataset.rfGraphError = message;

      if (!mount.querySelector("canvas")) {
        mount.innerHTML = `
          <div style="
            display:grid;
            place-items:center;
            height:100%;
            padding:24px;
            box-sizing:border-box;
            background:#01090e;
            color:#ffd0c9;
            font:700 13px/1.5 system-ui;
            text-align:center
          ">
            Builder 4 could not start.<br>${escapeHtml(message)}
          </div>
        `;
      }
    });

    console.error("FieldOps RF Builder 4 failed:", error);
  }

  /* ============================================================
   * 7. PUBLIC API AND STARTUP
   * ============================================================ */

  function init() {
    return loadBuilder4().catch(showError);
  }

  globalThis.FieldOpsRFBuilder4 = Object.freeze({
    VERSION,
    init,
    buildSource: buildBuilder4Source
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

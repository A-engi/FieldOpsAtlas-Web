/* ==========================================================================
   FieldOps Atlas RF 3D orbit renderer
   File: FieldOpsAtlas/Features/RF/rf-graph.js
   Version: 1.1.115-svg-front-edge

   Purpose:
   - Use the SVG front-edge path as the authoritative X/Y mountain silhouette.
   - Map that silhouette through explicit Z depth profiles without transmitters.
   - Preserve 360-degree drag, mount selector, and rendered-event contract.
   - Let the terrain extend beyond the visible graph frame instead of scaling it down.
   ========================================================================== */
(() => {
  "use strict";

  const VERSION = "1.1.115-svg-front-edge";
  const MOUNT_SELECTOR = "[data-rf-graph]";
  const MAP_PAPER_SELECTOR = ".rf-map-paper";
  const LEGACY_KEY_SELECTOR = ".rf-graph-key";
  const RENDERED_EVENT = "fieldops:rf-graph-rendered";
  const SELECTED_PATH_ID = "site-1-to-site-2";
  const MODE = "webgl-360-svg-front-edge";

  const DEG = Math.PI / 180;
  const FRONT_AZIMUTH = 0;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function smoothstep(value) {
    const t = clamp(value, 0, 1);
    return t * t * (3 - 2 * t);
  }


  function vec3Normalize(out, vector) {
    const length = Math.hypot(vector[0], vector[1], vector[2]) || 1;
    out[0] = vector[0] / length;
    out[1] = vector[1] / length;
    out[2] = vector[2] / length;
    return out;
  }

  function vec3Cross(out, a, b) {
    out[0] = a[1] * b[2] - a[2] * b[1];
    out[1] = a[2] * b[0] - a[0] * b[2];
    out[2] = a[0] * b[1] - a[1] * b[0];
    return out;
  }

  function triangleNormal(a, b, c) {
    const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const normal = [0, 0, 0];
    vec3Cross(normal, ab, ac);
    vec3Normalize(normal, normal);

    if (normal[1] < 0) {
      normal[0] *= -1;
      normal[1] *= -1;
      normal[2] *= -1;
    }

    return normal;
  }

  function mat4Perspective(out, fovy, aspect, near, far) {
    const f = 1 / Math.tan(fovy / 2);
    const nf = 1 / (near - far);

    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = 2 * far * near * nf;
    out[15] = 0;
    return out;
  }

  function mat4LookAt(out, eye, target, up) {
    const z = [eye[0] - target[0], eye[1] - target[1], eye[2] - target[2]];
    vec3Normalize(z, z);

    const x = [0, 0, 0];
    vec3Cross(x, up, z);
    vec3Normalize(x, x);

    const y = [0, 0, 0];
    vec3Cross(y, z, x);

    out[0] = x[0];
    out[1] = y[0];
    out[2] = z[0];
    out[3] = 0;
    out[4] = x[1];
    out[5] = y[1];
    out[6] = z[1];
    out[7] = 0;
    out[8] = x[2];
    out[9] = y[2];
    out[10] = z[2];
    out[11] = 0;
    out[12] = -(x[0] * eye[0] + x[1] * eye[1] + x[2] * eye[2]);
    out[13] = -(y[0] * eye[0] + y[1] * eye[1] + y[2] * eye[2]);
    out[14] = -(z[0] * eye[0] + z[1] * eye[1] + z[2] * eye[2]);
    out[15] = 1;
    return out;
  }


  /*
   * Source silhouette from mountain-w-tx-turnable.svg frontClip/front-edge.
   * The transmitter spike at SVG x=332, y=112 is intentionally removed.
   * Heights are measured against the SVG ground edge from (0,555) to (840,630).
   */
  const SVG_FRONT_EDGE = Object.freeze([
    [0, 555], [45, 510], [95, 468], [140, 404], [190, 352],
    [250, 321], [290, 318], [332, 317.5], [372, 317], [425, 329],
    [490, 386], [560, 447], [645, 500], [725, 548], [805, 596],
    [840, 630]
  ]);

  function svgEdgeToWorld(svgPoints, options = {}) {
    const xScale = options.xScale || 60;
    const yScale = options.yScale || 60;
    const xOffset = options.xOffset || 0;
    const yFactor = options.yFactor || 1;
    const mirror = Boolean(options.mirror);
    const sourceWidth = 840;
    const centre = sourceWidth * 0.5;

    return Object.freeze(svgPoints.map(([sourceX, sourceY]) => {
      const groundY = 555 + (75 * sourceX) / sourceWidth;
      const centredX = (sourceX - centre) / xScale;
      const worldX = xOffset + (mirror ? -centredX : centredX);
      const worldY = ((groundY - sourceY) / yScale) * yFactor;
      return [worldX, worldY];
    }).sort((a, b) => a[0] - b[0]));
  }

  const LEFT_FRONT_TRACE = svgEdgeToWorld(SVG_FRONT_EDGE, {
    xOffset: -7.5,
    xScale: 60,
    yScale: 60,
    yFactor: 1
  });

  const RIGHT_FRONT_TRACE = svgEdgeToWorld(SVG_FRONT_EDGE, {
    xOffset: 7.5,
    xScale: 60,
    yScale: 60,
    yFactor: 0.88,
    mirror: true
  });

  const LEFT_DEPTH_TRACE = Object.freeze([
    [-20.0, 0.08], [-16.0, 0.24], [-12.0, 0.48], [-8.0, 0.72],
    [-4.0, 0.91], [0.0, 1.00], [4.0, 0.96], [8.0, 0.82],
    [12.0, 0.66], [16.0, 0.50], [20.0, 0.34], [24.0, 0.20],
    [28.0, 0.08], [32.0, 0.00]
  ]);

  const RIGHT_DEPTH_TRACE = Object.freeze([
    [-22.0, 0.10], [-18.0, 0.34], [-14.0, 0.68], [-10.0, 0.94],
    [-7.0, 1.00], [-4.0, 0.91], [0.0, 0.72], [4.0, 0.54],
    [8.0, 0.38], [12.0, 0.25], [17.0, 0.14], [22.0, 0.06],
    [28.0, 0.00]
  ]);

  function sampleTrace(trace, value) {
    if (value <= trace[0][0]) return trace[0][1];

    for (let index = 1; index < trace.length; index += 1) {
      const previous = trace[index - 1];
      const current = trace[index];

      if (value <= current[0]) {
        const range = current[0] - previous[0] || 1;
        const t = (value - previous[0]) / range;
        return previous[1] + (current[1] - previous[1]) * t;
      }
    }

    return trace[trace.length - 1][1];
  }

  function valleyCentreX(z) {
    const t = clamp((z + 22) / 54, 0, 1);
    return -0.08 + 0.58 * Math.sin(t * Math.PI * 2.15) + 0.17 * Math.sin(t * Math.PI * 5.2);
  }

  function terrainHeight(x, z) {
    const leftFront = sampleTrace(LEFT_FRONT_TRACE, x);
    const rightFront = sampleTrace(RIGHT_FRONT_TRACE, x);
    const leftDepth = sampleTrace(LEFT_DEPTH_TRACE, z);
    const rightDepth = sampleTrace(RIGHT_DEPTH_TRACE, z);

    const leftMountain = leftFront * leftDepth;
    const rightMountain = rightFront * rightDepth;
    const tracedSurface = Math.max(leftMountain, rightMountain);

    const valleyX = valleyCentreX(z);
    const valleyWidth = 0.50 + clamp((z + 8) / 38, 0, 1) * 1.30;
    const valleyCut =
      0.34 *
      Math.exp(-((x - valleyX) ** 2) / valleyWidth) *
      Math.max(leftDepth, rightDepth);

    const ground = -0.26 - 0.012 * Math.abs(x) - 0.004 * Math.max(0, z - 18);
    return tracedSurface > 0.015
      ? Math.max(ground, tracedSurface - valleyCut)
      : ground;
  }

  function emptyGeometry() {
    return {
      positions: [],
      normals: [],
      colors: []
    };
  }

  function pushVertex(geometry, point, normal, colour) {
    geometry.positions.push(point[0], point[1], point[2]);
    geometry.normals.push(normal[0], normal[1], normal[2]);
    geometry.colors.push(colour[0], colour[1], colour[2], colour[3]);
  }

  function pushLine(geometry, a, b, colourA, colourB = colourA) {
    const normal = [0, 1, 0];
    pushVertex(geometry, a, normal, colourA);
    pushVertex(geometry, b, normal, colourB);
  }

  function terrainBaseColour(a, b, c) {
    const averageY = (a[1] + b[1] + c[1]) / 3;
    const averageZ = (a[2] + b[2] + c[2]) / 3;
    const altitude = clamp((averageY + 0.28) / 5.0, 0, 1);
    const rear = clamp((-averageZ - 2) / 18, 0, 1);
    const separation = 1 - rear * 0.22;

    return [
      0.006,
      (0.17 + altitude * 0.17) * separation,
      (0.25 + altitude * 0.24) * separation,
      0.98
    ];
  }

  function createTerrain() {
    const xMin = -20.0;
    const xMax = 20.0;
    const zMin = -22.0;
    const zMax = 32.0;
    const columns = 144;
    const rows = 156;
    const triangles = emptyGeometry();
    const lines = emptyGeometry();
    const traces = emptyGeometry();
    const grid = [];

    for (let row = 0; row <= rows; row += 1) {
      grid[row] = [];
      const z = zMin + ((zMax - zMin) * row) / rows;

      for (let column = 0; column <= columns; column += 1) {
        const x = xMin + ((xMax - xMin) * column) / columns;
        grid[row][column] = [x, terrainHeight(x, z), z];
      }
    }

    function addTriangle(a, b, c) {
      const normal = triangleNormal(a, b, c);
      const colour = terrainBaseColour(a, b, c);
      pushVertex(triangles, a, normal, colour);
      pushVertex(triangles, b, normal, colour);
      pushVertex(triangles, c, normal, colour);
    }

    function addMeshLine(a, b, alpha) {
      const averageY = (a[1] + b[1]) * 0.5;
      const altitude = clamp((averageY + 0.28) / 5.0, 0, 1);
      const colour = [0.02, 0.70 + altitude * 0.22, 0.80 + altitude * 0.18, alpha];

      pushLine(
        lines,
        [a[0], a[1] + 0.020, a[2]],
        [b[0], b[1] + 0.020, b[2]],
        colour
      );
    }

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const a = grid[row][column];
        const b = grid[row][column + 1];
        const c = grid[row + 1][column];
        const d = grid[row + 1][column + 1];

        if ((row + column) % 2 === 0) {
          addTriangle(a, c, d);
          addTriangle(a, d, b);
        } else {
          addTriangle(a, c, b);
          addTriangle(b, c, d);
        }

        if (row % 4 === 0) addMeshLine(a, b, 0.14);
        if (column % 4 === 0) addMeshLine(a, c, 0.13);
      }
    }

    function addTrace(controlPoints, colour) {
      for (let index = 1; index < controlPoints.length; index += 1) {
        pushLine(traces, controlPoints[index - 1], controlPoints[index], colour);
      }
    }

    const leftFrontSliceZ = 0.0;
    const rightFrontSliceZ = -7.0;

    const leftFrontOutline = LEFT_FRONT_TRACE.map(([x, y]) => [
      x,
      y + 0.050,
      leftFrontSliceZ
    ]);
    const rightFrontOutline = RIGHT_FRONT_TRACE.map(([x, y]) => [
      x,
      y + 0.050,
      rightFrontSliceZ
    ]);

    addTrace(leftFrontOutline, [0.54, 1.0, 0.94, 0.82]);
    addTrace(rightFrontOutline, [0.54, 1.0, 0.94, 0.78]);

    const leftSideTrace = LEFT_DEPTH_TRACE.map(([z, scale]) => [
      -8.97,
      sampleTrace(LEFT_FRONT_TRACE, -8.97) * scale + 0.050,
      z
    ]);
    const rightSideTrace = RIGHT_DEPTH_TRACE.map(([z, scale]) => [
      8.97,
      sampleTrace(RIGHT_FRONT_TRACE, 8.97) * scale + 0.050,
      z
    ]);

    addTrace(leftSideTrace, [0.34, 0.93, 0.94, 0.68]);
    addTrace(rightSideTrace, [0.34, 0.93, 0.94, 0.64]);

    return { triangles, lines, traces };
  }

  function createValleyPath() {
    const ribbon = emptyGeometry();
    const lines = emptyGeometry();
    const steps = 140;
    const path = [];

    for (let index = 0; index < steps; index += 1) {
      const t = index / (steps - 1);
      const z = 31.0 - t * 51.0;
      const x = valleyCentreX(z);
      const y = terrainHeight(x, z) + 0.065;
      path.push([x, y, z]);
    }

    for (let index = 1; index < path.length; index += 1) {
      pushLine(lines, path[index - 1], path[index], [0.0, 0.91, 0.98, 0.78]);
    }

    for (let index = 0; index < path.length - 1; index += 1) {
      const a = path[index];
      const b = path[index + 1];
      const dx = b[0] - a[0];
      const dz = b[2] - a[2];
      const length = Math.hypot(dx, dz) || 1;
      const width = 0.16;
      const nx = -dz / length;
      const nz = dx / length;
      const aLeft = [a[0] + nx * width, a[1] - 0.012, a[2] + nz * width];
      const aRight = [a[0] - nx * width, a[1] - 0.012, a[2] - nz * width];
      const bLeft = [b[0] + nx * width, b[1] - 0.012, b[2] + nz * width];
      const bRight = [b[0] - nx * width, b[1] - 0.012, b[2] - nz * width];
      const normal = [0, 1, 0];
      const colour = [0.0, 0.50, 0.62, 0.14];

      pushVertex(ribbon, aLeft, normal, colour);
      pushVertex(ribbon, bLeft, normal, colour);
      pushVertex(ribbon, aRight, normal, colour);
      pushVertex(ribbon, aRight, normal, colour);
      pushVertex(ribbon, bLeft, normal, colour);
      pushVertex(ribbon, bRight, normal, colour);
    }

    return { ribbon, lines };
  }

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader) || "Unknown shader error";
      gl.deleteShader(shader);
      throw new Error(error);
    }

    return shader;
  }

  function createProgram(gl) {
    const vertexSource = `
      attribute vec3 a_position;
      attribute vec3 a_normal;
      attribute vec4 a_color;
      uniform mat4 u_projection;
      uniform mat4 u_view;
      uniform float u_pointScale;
      varying vec3 v_normal;
      varying vec4 v_color;
      varying float v_depth;

      void main() {
        vec4 viewPosition = u_view * vec4(a_position, 1.0);
        gl_Position = u_projection * viewPosition;
        gl_PointSize = clamp(
          u_pointScale / max(1.0, -viewPosition.z),
          1.0,
          18.0
        );
        v_normal = a_normal;
        v_color = a_color;
        v_depth = -viewPosition.z;
      }
    `;

    const fragmentSource = `
      precision mediump float;
      uniform float u_points;
      uniform float u_lit;
      uniform float u_emission;
      varying vec3 v_normal;
      varying vec4 v_color;
      varying float v_depth;

      void main() {
        float alpha = v_color.a;

        if (u_points > 0.5) {
          vec2 centred = gl_PointCoord - vec2(0.5);
          float distanceFromCentre = length(centred);
          if (distanceFromCentre > 0.5) discard;
          alpha *= smoothstep(0.5, 0.05, distanceFromCentre);
        }

        vec3 colour = v_color.rgb;

        if (u_lit > 0.5) {
          vec3 normal = normalize(v_normal);
          vec3 keyLight = normalize(vec3(-0.72, 0.88, 0.38));
          vec3 coolBounce = normalize(vec3(0.58, 0.20, -0.62));
          float diffuse = max(dot(normal, keyLight), 0.0);
          float bounce = max(dot(normal, coolBounce), 0.0);
          float sidePlane = 1.0 - abs(normal.y);
          float shade = 0.22 + diffuse * 0.78 + bounce * 0.12;
          float edgeContrast = 1.0 + sidePlane * 0.08;
          colour *= shade * edgeContrast;
          colour += vec3(0.0, 0.025, 0.038) * (0.35 + normal.y * 0.65);
        }

        colour += v_color.rgb * u_emission;

        float fog = clamp((v_depth - 11.0) / 34.0, 0.0, 0.62);
        vec3 fogColour = vec3(0.003, 0.018, 0.035);
        colour = mix(colour, fogColour, fog);
        gl_FragColor = vec4(colour, alpha * (1.0 - fog * 0.44));
      }
    `;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const error = gl.getProgramInfoLog(program) || "Unknown program link error";
      gl.deleteProgram(program);
      throw new Error(error);
    }

    return program;
  }

  function createDrawBuffer(
    gl,
    program,
    geometry,
    mode,
    options = {}
  ) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(geometry.positions),
      gl.STATIC_DRAW
    );

    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(geometry.normals),
      gl.STATIC_DRAW
    );

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(geometry.colors),
      gl.STATIC_DRAW
    );

    return {
      mode,
      count: geometry.positions.length / 3,
      pointScale: options.pointScale || 1,
      additive: Boolean(options.additive),
      lit: Boolean(options.lit),
      emission: options.emission || 0,
      depthWrite: options.depthWrite !== false,
      positionBuffer,
      normalBuffer,
      colorBuffer,
      positionLocation: gl.getAttribLocation(program, "a_position"),
      normalLocation: gl.getAttribLocation(program, "a_normal"),
      colorLocation: gl.getAttribLocation(program, "a_color")
    };
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
      "Static SVG-front-edge twin-mountain terrain fallback without transmitters."
    );
    fallback.style.cssText =
      "display:grid;place-items:center;width:100%;height:100%;min-height:300px;background:#010a12;overflow:hidden";
    fallback.innerHTML = `
      <svg viewBox="0 0 1000 620" width="112%" height="112%" aria-hidden="true">
        <defs>
          <linearGradient id="rfTraceLeft" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#0c6975"/>
            <stop offset="1" stop-color="#02131d"/>
          </linearGradient>
          <linearGradient id="rfTraceRight" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#0a5f6d"/>
            <stop offset="1" stop-color="#02121c"/>
          </linearGradient>
        </defs>
        <rect width="1000" height="620" fill="#010a12"/>
        <path d="M-70 520 L20 520 L65 475 L115 433 L160 369 L210 317 L270 286 L310 283 L352 282 L392 282 L445 294 L510 351 L580 412 L665 465 L745 513 L825 561 L860 595 L860 620 L-70 620 Z" fill="url(#rfTraceLeft)"/>
        <path d="M140 620 L140 595 L175 561 L255 513 L335 465 L420 412 L490 351 L555 294 L608 282 L648 282 L690 283 L730 286 L790 317 L840 369 L885 433 L935 475 L980 520 L1070 520 L1070 620 Z" fill="url(#rfTraceRight)" opacity=".88"/>
        <path d="M20 520 L65 475 L115 433 L160 369 L210 317 L270 286 L310 283 L352 282 L392 282 L445 294 L510 351 L580 412 L665 465 L745 513 L825 561 L860 595" fill="none" stroke="#79f8f2" stroke-width="3"/>
        <path d="M140 595 L175 561 L255 513 L335 465 L420 412 L490 351 L555 294 L608 282 L648 282 L690 283 L730 286 L790 317 L840 369 L885 433 L935 475 L980 520" fill="none" stroke="#79f8f2" stroke-width="3" opacity=".88"/>
        <path d="M500 602 C466 558 528 520 494 474 C462 430 520 388 492 342" fill="none" stroke="#75effa" stroke-width="4"/>
      </svg>
    `;
    mount.replaceChildren(fallback);
    mount.dataset.rfGraphLoaded = "fallback";
    mount.dataset.rfGraphVersion = VERSION;
    mount.dataset.rfGraphMode = "static-svg-front-edge-fallback";
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
      "Interactive SVG-front-edge twin-mountain terrain without transmitters. Drag left or right to compare the exact front outline and mapped side depth."
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

    frame.append(canvas, hint);
    mount.replaceChildren(frame);
    return { frame, canvas, hint };
  }

  function initialiseWebGL(mount) {
    removeLegacyKey(mount);

    const { frame, canvas, hint } = buildFrame(mount);
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      depth: true,
      premultipliedAlpha: false,
      powerPreference: "high-performance"
    });

    if (!gl) {
      buildFallback(mount);
      return {
        destroy() {}
      };
    }

    const program = createProgram(gl);
    gl.useProgram(program);

    const projectionLocation = gl.getUniformLocation(program, "u_projection");
    const viewLocation = gl.getUniformLocation(program, "u_view");
    const pointScaleLocation = gl.getUniformLocation(program, "u_pointScale");
    const pointsLocation = gl.getUniformLocation(program, "u_points");
    const litLocation = gl.getUniformLocation(program, "u_lit");
    const emissionLocation = gl.getUniformLocation(program, "u_emission");

    const terrain = createTerrain();
    const path = createValleyPath();

    const drawBuffers = [
      createDrawBuffer(gl, program, terrain.triangles, gl.TRIANGLES, {
        lit: true,
        depthWrite: true
      }),
      createDrawBuffer(gl, program, terrain.lines, gl.LINES, {
        additive: true,
        emission: 0.20,
        depthWrite: false
      }),
      createDrawBuffer(gl, program, terrain.traces, gl.LINES, {
        additive: true,
        emission: 0.72,
        depthWrite: false
      }),
      createDrawBuffer(gl, program, path.ribbon, gl.TRIANGLES, {
        additive: true,
        emission: 0.18,
        depthWrite: false
      }),
      createDrawBuffer(gl, program, path.lines, gl.LINES, {
        additive: true,
        emission: 0.72,
        depthWrite: false
      })
    ];

    const projection = new Float32Array(16);
    const view = new Float32Array(16);
    const target = [0.0, 2.35, 0.10];
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

      if (width === state.width && height === state.height) return;

      state.width = width;
      state.height = height;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }

    function bindAndDraw(buffer) {
      if (!buffer.count) return;

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer.positionBuffer);
      gl.enableVertexAttribArray(buffer.positionLocation);
      gl.vertexAttribPointer(
        buffer.positionLocation,
        3,
        gl.FLOAT,
        false,
        0,
        0
      );

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer.normalBuffer);
      gl.enableVertexAttribArray(buffer.normalLocation);
      gl.vertexAttribPointer(
        buffer.normalLocation,
        3,
        gl.FLOAT,
        false,
        0,
        0
      );

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer.colorBuffer);
      gl.enableVertexAttribArray(buffer.colorLocation);
      gl.vertexAttribPointer(
        buffer.colorLocation,
        4,
        gl.FLOAT,
        false,
        0,
        0
      );

      gl.uniform1f(
        pointScaleLocation,
        buffer.pointScale * Math.min(window.devicePixelRatio || 1, 2)
      );
      gl.uniform1f(pointsLocation, buffer.mode === gl.POINTS ? 1 : 0);
      gl.uniform1f(litLocation, buffer.lit ? 1 : 0);
      gl.uniform1f(emissionLocation, buffer.emission);
      gl.depthMask(buffer.depthWrite);

      if (buffer.additive) {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      } else {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      }

      gl.drawArrays(buffer.mode, 0, buffer.count);
    }

    function render() {
      if (state.destroyed) return;

      resize();

      if (!state.dragging && Math.abs(state.velocity) > 0.001) {
        state.azimuth += state.velocity;
        state.velocity *= 0.92;
      }

      const angle = (state.azimuth % 360) * DEG;
      const aspect = state.width / state.height;
      const portraitBoost = clamp((1.05 - aspect) * 1.4, 0, 0.7);
      const distance = 23.8 + portraitBoost;
      const eye = [
        target[0] + Math.sin(angle) * distance,
        target[1] + 0.68,
        target[2] + Math.cos(angle) * distance
      ];
      const fov = aspect < 0.82 ? 50 : aspect < 1.12 ? 46 : 43;

      mat4Perspective(projection, fov * DEG, aspect, 0.1, 90);
      mat4LookAt(view, eye, target, [0, 1, 0]);
      gl.uniformMatrix4fv(projectionLocation, false, projection);
      gl.uniformMatrix4fv(viewLocation, false, view);

      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.enable(gl.BLEND);
      gl.clearColor(0, 0, 0, 0);
      gl.depthMask(true);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      drawBuffers.forEach(bindAndDraw);
      gl.depthMask(true);
      state.animationFrame = window.requestAnimationFrame(render);
    }

    function hideHint() {
      hint.style.opacity = "0";
    }

    function onPointerDown(event) {
      hideHint();
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
      const deltaAngle = deltaX * 0.31;

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

      hideHint();

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
      hideHint();
      state.azimuth = FRONT_AZIMUTH;
      state.velocity = 0;
    });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(frame);
    state.animationFrame = window.requestAnimationFrame(render);

    window.setTimeout(hideHint, 2400);

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

    return {
      destroy() {
        state.destroyed = true;
        window.cancelAnimationFrame(state.animationFrame);
        resizeObserver.disconnect();
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointercancel", onPointerUp);
        canvas.removeEventListener("keydown", onKeyDown);

        drawBuffers.forEach((buffer) => {
          gl.deleteBuffer(buffer.positionBuffer);
          gl.deleteBuffer(buffer.normalBuffer);
          gl.deleteBuffer(buffer.colorBuffer);
        });

        gl.deleteProgram(program);
      }
    };
  }

  function initMount(mount) {
    if (!mount || mount.dataset.rfGraphInit === VERSION) return;

    if (
      mount._rfGraphViewer &&
      typeof mount._rfGraphViewer.destroy === "function"
    ) {
      mount._rfGraphViewer.destroy();
    }

    mount.dataset.rfGraphInit = VERSION;

    try {
      mount._rfGraphViewer = initialiseWebGL(mount);
    } catch (error) {
      console.error("FieldOps RF shaded 3D viewer failed:", error);
      buildFallback(mount);
    }
  }

  function initAll(root = document) {
    root.querySelectorAll(MOUNT_SELECTOR).forEach(initMount);
  }

  window.FieldOpsRFGraph = {
    VERSION,
    init: initMount,
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

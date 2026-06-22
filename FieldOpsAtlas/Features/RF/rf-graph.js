/* ==========================================================================
   FieldOps Atlas RF 3D orbit renderer
   File: FieldOpsAtlas/Features/RF/rf-graph.js
   Version: 1.1.99-radar-grid-mountains

   Purpose:
   - Render a genuine WebGL 3D mountain-and-transmitter scene.
   - Orbit the camera through a continuous 360 degrees using drag or touch.
   - Centre the orbit between the two transmitter sites.
   - Build both mountains as genuine 360-degree radar-grid terrain volumes.
   - Preserve the existing [data-rf-graph] mount contract.
   ========================================================================== */
(() => {
  "use strict";

  const VERSION = "1.1.99-radar-grid-mountains";
  const MOUNT_SELECTOR = "[data-rf-graph]";
  const MAP_PAPER_SELECTOR = ".rf-map-paper";
  const LEGACY_KEY_SELECTOR = ".rf-graph-key";
  const RENDERED_EVENT = "fieldops:rf-graph-rendered";
  const SELECTED_PATH_ID = "site-1-to-site-2";

  const DEG = Math.PI / 180;
  const INTRO = Object.freeze({ from: 6, to: 366, delay: 650, duration: 12000 });

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function smoothstep(value) {
    const t = clamp(value, 0, 1);
    return t * t * (3 - 2 * t);
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

  function terrainHeight(x, z) {
    function peakHeight(cx, cz, radiusX, radiusZ, height, ridgeAngle) {
      const dx = (x - cx) / radiusX;
      const dz = (z - cz) / radiusZ;
      const radius = Math.sqrt(dx * dx + dz * dz);
      const angle = Math.atan2(dz, dx);
      const cone = Math.max(0, 1 - radius);
      const ridges =
        1 +
        0.16 * Math.sin(angle * 5 + ridgeAngle) * cone +
        0.08 * Math.sin(angle * 9 - radius * 7);
      return height * cone * cone * ridges;
    }

    const leftPeak = peakHeight(-4.0, 0.8, 4.1, 3.5, 6.0, 0.4);
    const rightPeak = peakHeight(6.0, -1.4, 4.7, 4.0, 6.7, 1.2);
    const leftShoulder = peakHeight(-6.7, 2.3, 3.6, 3.1, 1.7, 0.8);
    const rightShoulder = peakHeight(9.0, -0.6, 4.2, 3.2, 1.9, 1.9);
    const saddle = 0.7 * Math.exp(-((((x - 1.0) / 5.4) ** 2) + (((z + 0.2) / 2.8) ** 2)));
    const valleyPath = 0.42 * Math.sin((x - 0.3) * 0.45) - 0.18;
    const valley = -1.18 * Math.exp(-((z - valleyPath) ** 2) / 0.44) * Math.exp(-((x - 1.0) ** 2) / 43);
    const broadFloor = -0.035 * Math.sqrt(x * x + z * z);

    return leftPeak + rightPeak + leftShoulder + rightShoulder + saddle + valley + broadFloor - 0.9;
  }

  function createTerrain() {
    const xMin = -10.0;
    const xMax = 13.2;
    const zMin = -7.5;
    const zMax = 7.1;
    const columns = 32;
    const rows = 24;
    const cellWidth = (xMax - xMin) / columns;
    const cellDepth = (zMax - zMin) / rows;
    const baseY = -1.35;
    const heightStep = 0.23;
    const vertices = [];
    const vertexColors = [];
    const lineVertices = [];
    const lineColors = [];
    const points = [];
    const pointColors = [];
    const heights = [];

    function quantiseHeight(value) {
      return Math.max(baseY, Math.round(value / heightStep) * heightStep);
    }

    for (let row = 0; row < rows; row += 1) {
      heights[row] = [];
      const z = zMin + (row + 0.5) * cellDepth;
      for (let column = 0; column < columns; column += 1) {
        const x = xMin + (column + 0.5) * cellWidth;
        heights[row][column] = quantiseHeight(terrainHeight(x, z));
      }
    }

    function colourForHeight(y, alpha) {
      const glow = clamp((y - baseY) / 7.8, 0, 1);
      return [0.01, 0.18 + glow * 0.26, 0.24 + glow * 0.46, alpha];
    }

    function pushVertex(point, colour) {
      vertices.push(point[0], point[1], point[2]);
      vertexColors.push(...colour);
    }

    function pushTriangle(a, b, c, colour) {
      pushVertex(a, colour);
      pushVertex(b, colour);
      pushVertex(c, colour);
    }

    function pushQuad(a, b, c, d, colour) {
      pushTriangle(a, b, c, colour);
      pushTriangle(a, c, d, colour);
    }

    function pushLine(a, b, alpha = 0.74) {
      lineVertices.push(a[0], a[1] + 0.012, a[2], b[0], b[1] + 0.012, b[2]);
      lineColors.push(...colourForHeight(a[1], alpha), ...colourForHeight(b[1], alpha));
    }

    function neighbourHeight(row, column) {
      if (row < 0 || row >= rows || column < 0 || column >= columns) return baseY;
      return heights[row][column];
    }

    for (let row = 0; row < rows; row += 1) {
      const z0 = zMin + row * cellDepth;
      const z1 = z0 + cellDepth;
      for (let column = 0; column < columns; column += 1) {
        const x0 = xMin + column * cellWidth;
        const x1 = x0 + cellWidth;
        const topY = heights[row][column];
        const topColour = colourForHeight(topY, 0.62);
        const sideColour = colourForHeight(topY, 0.30);

        const a = [x0, topY, z0];
        const b = [x1, topY, z0];
        const c = [x1, topY, z1];
        const d = [x0, topY, z1];

        pushQuad(a, b, c, d, topColour);
        pushLine(a, b, 0.78);
        pushLine(b, c, 0.78);
        pushLine(c, d, 0.78);
        pushLine(d, a, 0.78);

        points.push(x0, topY + 0.02, z0);
        pointColors.push(...colourForHeight(topY, 0.58));

        const northY = neighbourHeight(row - 1, column);
        if (topY > northY + 0.01) {
          const lower = northY;
          pushQuad([x0, lower, z0], [x1, lower, z0], b, a, sideColour);
          pushLine([x0, lower, z0], a, 0.46);
          pushLine([x1, lower, z0], b, 0.46);
        }

        const eastY = neighbourHeight(row, column + 1);
        if (topY > eastY + 0.01) {
          const lower = eastY;
          pushQuad([x1, lower, z0], [x1, lower, z1], c, b, sideColour);
          pushLine([x1, lower, z0], b, 0.46);
          pushLine([x1, lower, z1], c, 0.46);
        }

        const southY = neighbourHeight(row + 1, column);
        if (topY > southY + 0.01) {
          const lower = southY;
          pushQuad([x1, lower, z1], [x0, lower, z1], d, c, sideColour);
          pushLine([x1, lower, z1], c, 0.46);
          pushLine([x0, lower, z1], d, 0.46);
        }

        const westY = neighbourHeight(row, column - 1);
        if (topY > westY + 0.01) {
          const lower = westY;
          pushQuad([x0, lower, z1], [x0, lower, z0], a, d, sideColour);
          pushLine([x0, lower, z1], d, 0.46);
          pushLine([x0, lower, z0], a, 0.46);
        }
      }
    }

    return {
      triangles: { positions: vertices, colors: vertexColors },
      lines: { positions: lineVertices, colors: lineColors },
      points: { positions: points, colors: pointColors }
    };
  }

  function createTower(origin, height, baseRadius, detailScale = 1) {
    const positions = [];
    const colors = [];
    const points = [];
    const pointColors = [];
    const levels = 12;
    const gold = [1.0, 0.61, 0.08, 0.98];
    const glowGold = [1.0, 0.37, 0.02, 0.45];

    function legPoint(leg, level) {
      const t = level / levels;
      const radius = baseRadius * (1 - t * 0.78);
      const angle = leg * Math.PI * 0.5 + Math.PI * 0.25;
      return [
        origin[0] + Math.cos(angle) * radius,
        origin[1] + t * height,
        origin[2] + Math.sin(angle) * radius
      ];
    }

    function pushSegment(a, b, color = gold) {
      positions.push(a[0], a[1], a[2], b[0], b[1], b[2]);
      colors.push(...color, ...color);
    }

    function pushNode(point) {
      points.push(point[0], point[1], point[2]);
      pointColors.push(...glowGold);
    }

    for (let leg = 0; leg < 4; leg += 1) {
      for (let level = 0; level < levels; level += 1) {
        const a = legPoint(leg, level);
        const b = legPoint(leg, level + 1);
        const c = legPoint((leg + 1) % 4, level);
        const d = legPoint((leg + 1) % 4, level + 1);
        pushSegment(a, b);
        pushSegment(a, c);
        pushSegment(a, d);
        pushSegment(b, c, [1.0, 0.48, 0.03, 0.85]);
        pushNode(a);
      }
    }

    const top = [origin[0], origin[1] + height + 0.42 * detailScale, origin[2]];
    const topRing = [];
    for (let leg = 0; leg < 4; leg += 1) {
      const upper = legPoint(leg, levels);
      topRing.push(upper);
      pushSegment(upper, top);
    }
    pushNode(top);

    const antennaLevels = [0.34, 0.48, 0.62, 0.76];
    antennaLevels.forEach((fraction, index) => {
      const y = origin[1] + height * fraction;
      const reach = baseRadius * (1.00 - index * 0.06) * detailScale;
      const panelHeight = height * 0.105;
      for (let side = 0; side < 2; side += 1) {
        const direction = side === 0 ? -1 : 1;
        const x = origin[0] + direction * reach;
        const z = origin[2] + (index % 2 === 0 ? 0.05 : -0.05) * detailScale;
        const bottom = [x, y - panelHeight * 0.5, z];
        const topPanel = [x, y + panelHeight * 0.5, z];
        pushSegment(bottom, topPanel);
        pushSegment([origin[0], y, origin[2]], [x, y, z], [1.0, 0.43, 0.02, 0.82]);
        pushSegment(
          [x - 0.055 * detailScale, y - panelHeight * 0.5, z],
          [x - 0.055 * detailScale, y + panelHeight * 0.5, z]
        );
        pushSegment(
          [x + 0.055 * detailScale, y - panelHeight * 0.5, z],
          [x + 0.055 * detailScale, y + panelHeight * 0.5, z]
        );
      }
    });

    const dishY = origin[1] + height * 0.46;
    const dishRadius = 0.11 * detailScale;
    const dishCenter = [origin[0], dishY, origin[2] + baseRadius * 0.82];
    let previous = null;
    const dishSegments = 12;
    for (let index = 0; index <= dishSegments; index += 1) {
      const angle = (index / dishSegments) * Math.PI * 2;
      const point = [
        dishCenter[0] + Math.cos(angle) * dishRadius,
        dishCenter[1] + Math.sin(angle) * dishRadius,
        dishCenter[2]
      ];
      if (previous) pushSegment(previous, point, [1.0, 0.55, 0.04, 0.9]);
      previous = point;
    }
    pushSegment([origin[0], dishY, origin[2]], dishCenter, [1.0, 0.45, 0.03, 0.8]);

    return {
      lines: { positions, colors },
      points: { positions: points, colors: pointColors }
    };
  }

  function createValleyPath() {
    const positions = [];
    const colors = [];
    const points = [];
    const pointColors = [];
    const steps = 82;
    let previous = null;

    for (let index = 0; index < steps; index += 1) {
      const t = index / (steps - 1);
      const x = -0.5 + t * 10.2;
      const z = 0.35 * Math.sin(x * 0.38) - 0.3 + Math.sin(t * Math.PI * 4) * 0.12;
      const y = terrainHeight(x, z) + 0.055;
      const point = [x, y, z];
      if (previous) {
        positions.push(...previous, ...point);
        colors.push(0.0, 0.95, 1.0, 0.88, 0.0, 0.95, 1.0, 0.88);
      }
      points.push(x, y, z);
      pointColors.push(0.0, 0.92, 1.0, 0.62);
      previous = point;
    }

    return {
      lines: { positions, colors },
      points: { positions: points, colors: pointColors }
    };
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
      attribute vec4 a_color;
      uniform mat4 u_projection;
      uniform mat4 u_view;
      uniform float u_pointScale;
      varying vec4 v_color;
      varying float v_depth;
      void main() {
        vec4 viewPosition = u_view * vec4(a_position, 1.0);
        gl_Position = u_projection * viewPosition;
        gl_PointSize = clamp(u_pointScale / max(1.0, -viewPosition.z), 1.0, 18.0);
        v_color = a_color;
        v_depth = -viewPosition.z;
      }
    `;

    const fragmentSource = `
      precision mediump float;
      uniform float u_points;
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
        float fog = clamp((v_depth - 8.0) / 26.0, 0.0, 0.72);
        vec3 fogColour = vec3(0.006, 0.035, 0.065);
        vec3 colour = mix(v_color.rgb, fogColour, fog);
        gl_FragColor = vec4(colour, alpha * (1.0 - fog * 0.55));
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

  function createDrawBuffer(gl, program, geometry, mode, pointScale = 1, additive = false) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.positions), gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.colors), gl.STATIC_DRAW);

    return {
      mode,
      pointScale,
      additive,
      count: geometry.positions.length / 3,
      positionBuffer,
      colorBuffer,
      positionLocation: gl.getAttribLocation(program, "a_position"),
      colorLocation: gl.getAttribLocation(program, "a_color")
    };
  }

  function removeLegacyKey(mount) {
    const mapPaper = mount.closest(MAP_PAPER_SELECTOR);
    if (!mapPaper) return;
    mapPaper.querySelectorAll(`:scope > ${LEGACY_KEY_SELECTOR}`).forEach((node) => node.remove());
    mapPaper.dataset.rfGraphKeyInit = "false";
  }

  function buildFrame(mount) {
    const frame = document.createElement("div");
    frame.className = "rf-webgl-orbit-frame";
    frame.style.cssText = [
      "position:relative",
      "width:100%",
      "height:100%",
      "overflow:hidden",
      "background-color:#020b16",
      "background-image:linear-gradient(rgba(41,148,167,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(41,148,167,.055) 1px,transparent 1px),radial-gradient(circle at 55% 62%,rgba(0,183,205,.12),transparent 45%)",
      "background-size:28px 28px,28px 28px,100% 100%",
      "touch-action:none",
      "user-select:none"
    ].join(";");

    const canvas = document.createElement("canvas");
    canvas.className = "rf-webgl-orbit-canvas";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Interactive 3D RF mountain scene. Drag left or right to orbit 360 degrees around the point between both transmitters.");
    canvas.setAttribute("tabindex", "0");
    canvas.style.cssText = "display:block;width:100%;height:100%;touch-action:none;cursor:grab;outline:none";

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
      hint.textContent = "3D view is not supported on this device";
      hint.style.opacity = "1";
      mount.dataset.rfGraphLoaded = "false";
      mount.dataset.rfGraphVersion = VERSION;
      return null;
    }

    const program = createProgram(gl);
    gl.useProgram(program);

    const projectionLocation = gl.getUniformLocation(program, "u_projection");
    const viewLocation = gl.getUniformLocation(program, "u_view");
    const pointScaleLocation = gl.getUniformLocation(program, "u_pointScale");
    const pointsLocation = gl.getUniformLocation(program, "u_points");

    const terrain = createTerrain();
    const nearTowerOrigin = [-4.0, Math.round(terrainHeight(-4.0, 0.8) / 0.23) * 0.23 + 0.04, 0.8];
    const farTowerOrigin = [6.0, Math.round(terrainHeight(6.0, -1.4) / 0.23) * 0.23 + 0.04, -1.4];
    const nearTower = createTower(nearTowerOrigin, 4.35, 0.50, 1.0);
    const farTower = createTower(farTowerOrigin, 3.65, 0.45, 0.86);
    const path = createValleyPath();

    const drawBuffers = [
      createDrawBuffer(gl, program, terrain.triangles, gl.TRIANGLES, 1, false),
      createDrawBuffer(gl, program, terrain.lines, gl.LINES, 1, true),
      createDrawBuffer(gl, program, terrain.points, gl.POINTS, 18, true),
      createDrawBuffer(gl, program, path.lines, gl.LINES, 1, true),
      createDrawBuffer(gl, program, path.points, gl.POINTS, 24, true),
      createDrawBuffer(gl, program, nearTower.lines, gl.LINES, 1, true),
      createDrawBuffer(gl, program, nearTower.points, gl.POINTS, 58, true),
      createDrawBuffer(gl, program, farTower.lines, gl.LINES, 1, true),
      createDrawBuffer(gl, program, farTower.points, gl.POINTS, 46, true)
    ];

    const projection = new Float32Array(16);
    const view = new Float32Array(16);
    const target = [
      (nearTowerOrigin[0] + farTowerOrigin[0]) * 0.5,
      (nearTowerOrigin[1] + farTowerOrigin[1]) * 0.5 + 1.05,
      (nearTowerOrigin[2] + farTowerOrigin[2]) * 0.5 - 0.05
    ];
    const state = {
      azimuth: INTRO.from,
      velocity: 0,
      dragging: false,
      pointerId: null,
      lastX: 0,
      lastTime: 0,
      introStartedAt: null,
      introCancelled: false,
      destroyed: false,
      width: 0,
      height: 0
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
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer.positionBuffer);
      gl.enableVertexAttribArray(buffer.positionLocation);
      gl.vertexAttribPointer(buffer.positionLocation, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer.colorBuffer);
      gl.enableVertexAttribArray(buffer.colorLocation);
      gl.vertexAttribPointer(buffer.colorLocation, 4, gl.FLOAT, false, 0, 0);

      gl.uniform1f(pointScaleLocation, buffer.pointScale * Math.min(window.devicePixelRatio || 1, 2));
      gl.uniform1f(pointsLocation, buffer.mode === gl.POINTS ? 1 : 0);

      if (buffer.additive) {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      } else {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      }
      gl.drawArrays(buffer.mode, 0, buffer.count);
    }

    function render(now) {
      if (state.destroyed) return;
      resize();

      if (!state.introCancelled) {
        if (state.introStartedAt === null) {
          state.introStartedAt = now + INTRO.delay;
        }
        if (now >= state.introStartedAt) {
          const progress = (now - state.introStartedAt) / INTRO.duration;
          state.azimuth = INTRO.from + (INTRO.to - INTRO.from) * smoothstep(progress);
          if (progress >= 1) state.introCancelled = true;
        }
      } else if (!state.dragging && Math.abs(state.velocity) > 0.001) {
        state.azimuth += state.velocity;
        state.velocity *= 0.92;
      }

      const angle = (state.azimuth % 360) * DEG;
      const distance = 25.4;
      const eye = [
        target[0] + Math.sin(angle) * distance,
        target[1] + 3.2,
        target[2] + Math.cos(angle) * distance
      ];

      mat4Perspective(projection, 48 * DEG, state.width / state.height, 0.1, 80);
      mat4LookAt(view, eye, target, [0, 1, 0]);
      gl.uniformMatrix4fv(projectionLocation, false, projection);
      gl.uniformMatrix4fv(viewLocation, false, view);

      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.enable(gl.BLEND);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      drawBuffers.forEach(bindAndDraw);
      window.requestAnimationFrame(render);
    }

    function cancelIntro() {
      state.introCancelled = true;
      hint.style.opacity = "0";
    }

    function onPointerDown(event) {
      cancelIntro();
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
      const deltaTime = Math.max(8, now - state.lastTime);
      const deltaAngle = -deltaX * 0.22;
      state.azimuth += deltaAngle;
      state.velocity = (deltaAngle * 16) / deltaTime;
      state.lastX = event.clientX;
      state.lastTime = now;
      event.preventDefault();
    }

    function onPointerUp(event) {
      if (event.pointerId !== state.pointerId) return;
      state.dragging = false;
      state.pointerId = null;
      canvas.style.cursor = "grab";
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    }

    function onKeyDown(event) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight" && event.key !== "Home") return;
      cancelIntro();
      if (event.key === "Home") {
        state.azimuth = INTRO.from;
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
      cancelIntro();
      state.azimuth = INTRO.from;
      state.velocity = 0;
    });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(frame);
    window.requestAnimationFrame(render);

    mount.dataset.rfGraphLoaded = "true";
    mount.dataset.rfGraphVersion = VERSION;
    mount.dataset.rfGraphMode = "webgl-radar-grid-mountains";
    mount.dispatchEvent(
      new CustomEvent(RENDERED_EVENT, {
        bubbles: true,
        detail: { version: VERSION, selectedPathId: SELECTED_PATH_ID, mode: "webgl-radar-grid-mountains" }
      })
    );

    return {
      destroy() {
        state.destroyed = true;
        resizeObserver.disconnect();
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointercancel", onPointerUp);
        canvas.removeEventListener("keydown", onKeyDown);
        drawBuffers.forEach((buffer) => {
          gl.deleteBuffer(buffer.positionBuffer);
          gl.deleteBuffer(buffer.colorBuffer);
        });
        gl.deleteProgram(program);
      }
    };
  }

  function initMount(mount) {
    if (!mount || mount.dataset.rfGraphInit === VERSION) return;
    if (mount._rfGraphViewer && typeof mount._rfGraphViewer.destroy === "function") {
      mount._rfGraphViewer.destroy();
    }
    mount.dataset.rfGraphInit = VERSION;
    try {
      mount._rfGraphViewer = initialiseWebGL(mount);
    } catch (error) {
      console.error("FieldOps RF 3D viewer failed:", error);
      const fallback = document.createElement("div");
      fallback.textContent = "The 3D RF view could not start.";
      fallback.style.cssText = "display:grid;place-items:center;width:100%;height:100%;padding:16px;color:#dffbff;background:#031329;font:700 12px/1.4 system-ui;text-align:center";
      mount.replaceChildren(fallback);
      mount.dataset.rfGraphLoaded = "false";
      mount.dataset.rfGraphVersion = VERSION;
    }
  }

  function initAll(root = document) {
    root.querySelectorAll(MOUNT_SELECTOR).forEach(initMount);
  }

  window.FieldOpsRFGraph = { VERSION, init: initMount, initAll };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initAll(), { once: true });
  } else {
    initAll();
  }
})();

/* Destination: FieldOpsAtlas/Features/RF/rf-graph.js */
/* End of file: FieldOpsAtlas/Features/RF/rf-graph.js */

/* ==========================================================================
   FieldOps Atlas RF 3D orbit renderer
   File: FieldOpsAtlas/Features/RF/rf-graph.js
   Version: 1.1.106-upward-radar-platform

   Purpose:
   - Match the supplied twin-peak reference composition at the front view.
   - Keep all terrain, towers, radar arrays, and path geometry inside WebGL.
   - Preserve drag/touch 360-degree orbit and the existing mount contract.
   ========================================================================== */
(() => {
  "use strict";

  const VERSION = "1.1.106-upward-radar-platform";
  const MOUNT_SELECTOR = "[data-rf-graph]";
  const MAP_PAPER_SELECTOR = ".rf-map-paper";
  const LEGACY_KEY_SELECTOR = ".rf-graph-key";
  const RENDERED_EVENT = "fieldops:rf-graph-rendered";
  const SELECTED_PATH_ID = "site-1-to-site-2";

  const DEG = Math.PI / 180;
  const FRONT_AZIMUTH = 0;
  const INTRO = Object.freeze({
    from: FRONT_AZIMUTH,
    to: FRONT_AZIMUTH + 360,
    delay: 900,
    duration: 14000
  });

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

  function seededNoise(x, z) {
    const value = Math.sin(x * 127.1 + z * 311.7) * 43758.5453123;
    return value - Math.floor(value);
  }

  function valleyCentreX(z) {
    return 0.35 + 0.42 * Math.sin((z + 1.8) * 0.50) + 0.10 * Math.sin(z * 1.55);
  }

  function terrainHeight(x, z) {
    function mountain(cx, cz, radiusX, radiusZ, height, rotation, ridgePhase, plateau = 0.045) {
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);
      const dx = x - cx;
      const dz = z - cz;
      const u = (dx * cos + dz * sin) / radiusX;
      const v = (-dx * sin + dz * cos) / radiusZ;
      const radial = Math.sqrt(u * u + v * v);

      if (radial >= 1.18) return 0;

      const inside = clamp((1.18 - radial) / 1.18, 0, 1);
      const coreT = clamp((radial - plateau) / (1 - plateau), 0, 1);
      const core = radial < 1 ? Math.pow(1 - smoothstep(coreT), 0.83) : 0;
      const apron = Math.pow(inside, 2.25) * 0.20;
      const angle = Math.atan2(v, u);
      const slope = Math.sin(Math.PI * clamp(radial, 0, 1));

      const ridges =
        0.19 * Math.sin(angle * 5 + ridgePhase + radial * 5.2) +
        0.11 * Math.sin(angle * 9 - radial * 11.0 + ridgePhase * 1.4) +
        0.065 * Math.cos(angle * 14 + radial * 23.0 - ridgePhase);

      const brokenFaces =
        0.050 * Math.sin((u - v) * 23.0 + ridgePhase) +
        0.043 * Math.cos((u + v) * 31.0 - ridgePhase * 0.8) +
        0.026 * Math.sin(u * 47.0 + v * 37.0);

      const cuts =
        -0.075 * Math.max(0, Math.sin(angle * 7.0 + radial * 19.0 + ridgePhase)) *
          Math.pow(slope, 1.4);

      const shape = clamp(
        1 + (ridges + brokenFaces) * slope + cuts,
        0.60,
        1.42
      );

      return height * (core * shape + apron);
    }

    const leftMain = mountain(-6.25, -1.10, 5.65, 5.80, 7.05, -0.10, 0.35);
    const rightMain = mountain(6.55, -1.55, 5.60, 5.95, 6.38, 0.12, 1.42);

    const leftFront = mountain(-8.25, 3.55, 4.65, 4.55, 2.30, -0.34, 0.92, 0.02);
    const leftOuter = mountain(-10.25, -0.30, 3.85, 4.60, 1.82, 0.18, 2.10, 0.02);
    const leftInner = mountain(-3.15, -1.10, 2.95, 3.75, 1.28, 0.28, 1.65, 0.02);

    const rightFront = mountain(8.45, 3.35, 4.75, 4.60, 2.35, 0.32, 2.30, 0.02);
    const rightOuter = mountain(10.35, -1.45, 3.95, 4.55, 1.88, -0.18, 0.55, 0.02);
    const rightInner = mountain(3.45, -1.30, 2.90, 3.70, 1.22, -0.24, 1.12, 0.02);

    const backLeft = mountain(-2.45, -5.55, 4.25, 2.65, 1.12, 0.18, 2.42, 0.02);
    const backRight = mountain(2.70, -5.75, 4.10, 2.60, 1.02, -0.16, 0.72, 0.02);

    const distantRidge =
      0.92 *
      Math.exp(-(((x - 0.3) / 7.4) ** 2 + ((z + 5.6) / 2.45) ** 2));

    const valleyX = valleyCentreX(z);
    const valleyCut =
      -1.18 *
      Math.exp(-((x - valleyX) ** 2) / 1.20) *
      Math.exp(-((z - 0.8) ** 2) / 70);

    const frontRise =
      0.34 *
      Math.exp(-((z - 6.8) ** 2) / 12) *
      (0.45 + 0.55 * Math.min(1, Math.abs(x) / 8));

    const baseUndulation =
      -0.54 +
      0.10 * Math.sin(x * 0.62 + z * 0.24) +
      0.07 * Math.cos(z * 0.78 - x * 0.18);

    return (
      leftMain +
      rightMain +
      leftFront +
      leftOuter +
      leftInner +
      rightFront +
      rightOuter +
      rightInner +
      backLeft +
      backRight +
      distantRidge +
      valleyCut +
      frontRise +
      baseUndulation
    );
  }

  function createTerrain() {
    const xMin = -15.2;
    const xMax = 15.2;
    const zMin = -8.3;
    const zMax = 13.0;
    const columns = 112;
    const rows = 88;
    const vertices = [];
    const vertexColors = [];
    const lineVertices = [];
    const lineColors = [];
    const points = [];
    const pointColors = [];
    const grid = [];

    function surfaceColour(y, alpha, faceBoost = 0) {
      const glow = clamp((y + 0.65) / 7.7, 0, 1);
      return [
        0.003,
        0.036 + glow * 0.086 + faceBoost * 0.40,
        0.072 + glow * 0.152 + faceBoost,
        alpha
      ];
    }

    function lineColour(y, alpha) {
      const glow = clamp((y + 0.65) / 7.7, 0, 1);
      return [
        0.0,
        0.57 + glow * 0.35,
        0.69 + glow * 0.30,
        alpha
      ];
    }

    function pushVertex(point, colour) {
      vertices.push(point[0], point[1], point[2]);
      vertexColors.push(...colour);
    }

    function pushTriangle(a, b, c) {
      const faceNoise = seededNoise(
        Math.floor((a[0] + b[0] + c[0] + 40) * 8),
        Math.floor((a[2] + b[2] + c[2] + 40) * 8)
      );
      const faceBoost = faceNoise > 0.70 ? (faceNoise - 0.70) * 0.22 : 0;
      pushVertex(a, surfaceColour(a[1], 0.92, faceBoost));
      pushVertex(b, surfaceColour(b[1], 0.92, faceBoost));
      pushVertex(c, surfaceColour(c[1], 0.92, faceBoost));
    }

    function pushLine(a, b, alpha) {
      const lift = 0.020;
      const averageY = (a[1] + b[1]) * 0.5;
      const elevation = clamp((averageY + 0.45) / 6.8, 0, 1);
      const effectiveAlpha =
        alpha * (0.28 + 0.72 * Math.pow(elevation, 0.68));

      lineVertices.push(
        a[0], a[1] + lift, a[2],
        b[0], b[1] + lift, b[2]
      );
      lineColors.push(
        ...lineColour(a[1], effectiveAlpha),
        ...lineColour(b[1], effectiveAlpha)
      );
    }

    for (let row = 0; row <= rows; row += 1) {
      grid[row] = [];
      const rawZ = zMin + ((zMax - zMin) * row) / rows;

      for (let column = 0; column <= columns; column += 1) {
        const rawX = xMin + ((xMax - xMin) * column) / columns;
        const edge =
          row === 0 ||
          row === rows ||
          column === 0 ||
          column === columns;
        const jitterX = edge ? 0 : (seededNoise(column, row) - 0.5) * 0.12;
        const jitterZ = edge ? 0 : (seededNoise(row + 41, column + 17) - 0.5) * 0.12;
        const x = rawX + jitterX;
        const z = rawZ + jitterZ;
        const y = terrainHeight(x, z);
        const point = [x, y, z];

        grid[row][column] = point;

        const pointNoise = seededNoise(row * 3 + 5, column * 5 + 11);
        const keepPoint =
          y > -0.10
            ? ((row + column) % 2 === 0 || pointNoise > 0.72)
            : pointNoise > 0.80;

        if (keepPoint) {
          const pointAlpha =
            y > -0.10
              ? 0.48 + clamp((y + 0.10) / 7.0, 0, 1) * 0.26
              : 0.36;
          points.push(x, y + 0.028, z);
          pointColors.push(...lineColour(y, pointAlpha));
        }
      }
    }

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const a = grid[row][column];
        const b = grid[row][column + 1];
        const c = grid[row + 1][column];
        const d = grid[row + 1][column + 1];
        const splitForward = (row + column) % 2 === 0;

        if (splitForward) {
          pushTriangle(a, c, d);
          pushTriangle(a, d, b);
          pushLine(a, d, 0.64);
        } else {
          pushTriangle(a, c, b);
          pushTriangle(b, c, d);
          pushLine(b, c, 0.64);
        }

        if (row % 2 === 0) pushLine(a, b, row % 6 === 0 ? 0.78 : 0.48);
        if (column % 2 === 0) pushLine(a, c, column % 6 === 0 ? 0.78 : 0.48);
      }
    }

    return {
      triangles: { positions: vertices, colors: vertexColors },
      lines: { positions: lineVertices, colors: lineColors },
      points: { positions: points, colors: pointColors }
    };
  }

  function createTower(origin, height, baseRadius, detailScale = 1, radarSide = 1) {
    const positions = [];
    const colors = [];
    const points = [];
    const pointColors = [];
    const levels = 14;
    const gold = [1.0, 0.68, 0.12, 0.99];
    const warmGold = [1.0, 0.46, 0.02, 0.90];
    const glowGold = [1.0, 0.36, 0.01, 0.56];

    function pushSegment(a, b, colour = gold) {
      positions.push(a[0], a[1], a[2], b[0], b[1], b[2]);
      colors.push(...colour, ...colour);
    }

    function pushNode(point, colour = glowGold) {
      points.push(point[0], point[1], point[2]);
      pointColors.push(...colour);
    }

    function legPoint(leg, level) {
      const t = level / levels;
      const radius = baseRadius * (1 - t * 0.81);
      const angle = leg * Math.PI * 0.5 + Math.PI * 0.25;
      return [
        origin[0] + Math.cos(angle) * radius,
        origin[1] + t * height,
        origin[2] + Math.sin(angle) * radius
      ];
    }

    for (let level = 0; level < levels; level += 1) {
      for (let leg = 0; leg < 4; leg += 1) {
        const a = legPoint(leg, level);
        const b = legPoint(leg, level + 1);
        const c = legPoint((leg + 1) % 4, level);
        const d = legPoint((leg + 1) % 4, level + 1);

        pushSegment(a, b);
        pushSegment(a, c, warmGold);
        pushSegment(a, d);
        pushSegment(b, c, warmGold);
        pushNode(a);
      }
    }

    const top = [
      origin[0],
      origin[1] + height + 0.38 * detailScale,
      origin[2]
    ];

    for (let leg = 0; leg < 4; leg += 1) {
      pushSegment(legPoint(leg, levels), top);
    }

    const mastTip = [
      top[0],
      top[1] + 0.72 * detailScale,
      top[2]
    ];
    pushSegment(top, mastTip);
    pushNode(mastTip, [1.0, 0.70, 0.12, 0.78]);

    const panelLevels = [0.42, 0.58, 0.72, 0.84];
    panelLevels.forEach((fraction, index) => {
      const y = origin[1] + height * fraction;
      const reach = baseRadius * (1.25 - index * 0.09) * detailScale;
      const panelHeight = height * 0.095;

      for (let side = -1; side <= 1; side += 2) {
        const x = origin[0] + side * reach;
        const z = origin[2];
        const bottomLeft = [x - 0.060 * detailScale, y - panelHeight * 0.5, z];
        const topLeft = [x - 0.060 * detailScale, y + panelHeight * 0.5, z];
        const bottomRight = [x + 0.060 * detailScale, y - panelHeight * 0.5, z];
        const topRight = [x + 0.060 * detailScale, y + panelHeight * 0.5, z];

        pushSegment(bottomLeft, topLeft);
        pushSegment(topLeft, topRight, warmGold);
        pushSegment(topRight, bottomRight);
        pushSegment(bottomRight, bottomLeft, warmGold);
        pushSegment([origin[0], y, origin[2]], [x, y, z], warmGold);
      }
    });

    function addSideRadar() {
      const side = radarSide < 0 ? -1 : 1;
      const platformY = origin[1] + height * 0.76;
      const platformInset = baseRadius * 0.18;
      const platformReach = baseRadius * 1.48;
      const platformHalfWidth = 0.18 * detailScale;

      const platformInner = [
        origin[0] + side * platformInset,
        platformY,
        origin[2]
      ];
      const platformOuter = [
        origin[0] + side * platformReach,
        platformY,
        origin[2] + 0.02
      ];
      const innerFront = [
        platformInner[0],
        platformInner[1],
        platformInner[2] + platformHalfWidth
      ];
      const innerRear = [
        platformInner[0],
        platformInner[1],
        platformInner[2] - platformHalfWidth
      ];
      const outerFront = [
        platformOuter[0],
        platformOuter[1],
        platformOuter[2] + platformHalfWidth
      ];
      const outerRear = [
        platformOuter[0],
        platformOuter[1],
        platformOuter[2] - platformHalfWidth
      ];
      const braceBase = [
        origin[0] + side * baseRadius * 0.10,
        platformY - 0.46 * detailScale,
        origin[2]
      ];
      const pedestal = [
        platformOuter[0],
        platformY + 0.18 * detailScale,
        platformOuter[2]
      ];
      const centre = [
        platformOuter[0],
        platformY + 0.43 * detailScale,
        platformOuter[2]
      ];

      pushSegment(innerFront, outerFront, warmGold);
      pushSegment(innerRear, outerRear, warmGold);
      pushSegment(innerFront, innerRear, gold);
      pushSegment(outerFront, outerRear, gold);
      pushSegment(platformInner, platformOuter, warmGold);
      pushSegment(braceBase, outerFront, warmGold);
      pushSegment(braceBase, outerRear, warmGold);
      pushSegment(platformOuter, pedestal, gold);
      pushSegment(outerFront, pedestal, warmGold);
      pushSegment(outerRear, pedestal, warmGold);
      pushSegment(pedestal, centre, gold);

      const normal = [side * 0.30, 0.90, 0.31];
      vec3Normalize(normal, normal);
      const right = [0, 0, 0];
      vec3Cross(right, [0, 1, 0], normal);
      vec3Normalize(right, right);
      const up = [0, 0, 0];
      vec3Cross(up, normal, right);
      vec3Normalize(up, up);

      const radius = 0.36 * detailScale;
      const depth = 0.14 * detailScale;
      const ringCount = 3;
      const segmentCount = 16;

      const dishPoint = (fraction, angle) => {
        const radial = radius * fraction;
        const bowl = depth * fraction * fraction;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        return [
          centre[0] + right[0] * cos * radial + up[0] * sin * radial - normal[0] * bowl,
          centre[1] + right[1] * cos * radial + up[1] * sin * radial - normal[1] * bowl,
          centre[2] + right[2] * cos * radial + up[2] * sin * radial - normal[2] * bowl
        ];
      };

      for (let ring = 1; ring <= ringCount; ring += 1) {
        const fraction = ring / ringCount;
        let previous = dishPoint(fraction, 0);

        for (let segment = 1; segment <= segmentCount; segment += 1) {
          const angle = (segment / segmentCount) * Math.PI * 2;
          const current = dishPoint(fraction, angle);
          pushSegment(previous, current, ring === ringCount ? gold : warmGold);
          previous = current;
        }
      }

      for (let segment = 0; segment < segmentCount; segment += 4) {
        const angle = (segment / segmentCount) * Math.PI * 2;
        pushSegment(centre, dishPoint(1, angle), warmGold);
      }

      const feed = [
        centre[0] + normal[0] * radius * 0.42,
        centre[1] + normal[1] * radius * 0.42,
        centre[2] + normal[2] * radius * 0.42
      ];
      pushSegment(centre, feed);
      pushNode(feed, [1.0, 0.62, 0.05, 0.70]);
    }

    addSideRadar();

    return {
      lines: { positions, colors },
      points: { positions: points, colors: pointColors }
    };
  }

  function createValleyPath() {
    const ribbonPositions = [];
    const ribbonColors = [];
    const linePositions = [];
    const lineColors = [];
    const points = [];
    const pointColors = [];
    const steps = 110;
    const path = [];

    for (let index = 0; index < steps; index += 1) {
      const t = index / (steps - 1);
      const z = 12.45 - t * 17.75;
      const x =
        valleyCentreX(z) +
        Math.sin(t * Math.PI * 6.0) * (0.52 - t * 0.24) +
        Math.sin(t * Math.PI * 2.4) * 0.18;
      const y = terrainHeight(x, z) + 0.080;
      path.push([x, y, z]);
    }

    for (let index = 0; index < path.length; index += 1) {
      const point = path[index];
      points.push(...point);
      pointColors.push(0.0, 0.91, 0.98, 0.60);

      if (index > 0) {
        const previous = path[index - 1];
        linePositions.push(...previous, ...point);
        lineColors.push(
          0.0, 0.91, 0.98, 0.84,
          0.0, 0.91, 0.98, 0.84
        );
      }
    }

    for (let index = 0; index < path.length - 1; index += 1) {
      const a = path[index];
      const b = path[index + 1];
      const dx = b[0] - a[0];
      const dz = b[2] - a[2];
      const length = Math.hypot(dx, dz) || 1;
      const widthA = 0.17 - (index / (path.length - 1)) * 0.085;
      const widthB = 0.17 - ((index + 1) / (path.length - 1)) * 0.085;
      const nx = -dz / length;
      const nz = dx / length;

      const aLeft = [a[0] + nx * widthA, a[1] - 0.015, a[2] + nz * widthA];
      const aRight = [a[0] - nx * widthA, a[1] - 0.015, a[2] - nz * widthA];
      const bLeft = [b[0] + nx * widthB, b[1] - 0.015, b[2] + nz * widthB];
      const bRight = [b[0] - nx * widthB, b[1] - 0.015, b[2] - nz * widthB];

      ribbonPositions.push(...aLeft, ...bLeft, ...aRight);
      ribbonPositions.push(...aRight, ...bLeft, ...bRight);

      for (let vertex = 0; vertex < 6; vertex += 1) {
        ribbonColors.push(0.0, 0.56, 0.68, 0.16);
      }
    }

    return {
      ribbon: { positions: ribbonPositions, colors: ribbonColors },
      lines: { positions: linePositions, colors: lineColors },
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
        gl_PointSize = clamp(
          u_pointScale / max(1.0, -viewPosition.z),
          1.0,
          18.0
        );
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

        float fog = clamp((v_depth - 11.0) / 34.0, 0.0, 0.62);
        vec3 fogColour = vec3(0.003, 0.018, 0.035);
        vec3 colour = mix(v_color.rgb, fogColour, fog);
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

  function createDrawBuffer(gl, program, geometry, mode, pointScale = 1, additive = false) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(geometry.positions),
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

    mapPaper
      .querySelectorAll(`:scope > ${LEGACY_KEY_SELECTOR}`)
      .forEach((node) => node.remove());

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
      "Interactive 3D RF twin-peak mountain scene with integrated radar arrays. Drag left or right to orbit 360 degrees."
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
    const leftOrigin = [
      -6.25,
      terrainHeight(-6.25, -1.10) + 0.025,
      -1.10
    ];
    const rightOrigin = [
      6.55,
      terrainHeight(6.55, -1.55) + 0.025,
      -1.55
    ];
    const leftTower = createTower(leftOrigin, 3.72, 0.54, 1.0, 1);
    const rightTower = createTower(rightOrigin, 3.28, 0.50, 0.93, -1);
    const path = createValleyPath();

    const drawBuffers = [
      createDrawBuffer(gl, program, terrain.triangles, gl.TRIANGLES, 1, false),
      createDrawBuffer(gl, program, terrain.lines, gl.LINES, 1, true),
      createDrawBuffer(gl, program, terrain.points, gl.POINTS, 48, true),
      createDrawBuffer(gl, program, path.ribbon, gl.TRIANGLES, 1, true),
      createDrawBuffer(gl, program, path.lines, gl.LINES, 1, true),
      createDrawBuffer(gl, program, path.points, gl.POINTS, 42, true),
      createDrawBuffer(gl, program, leftTower.lines, gl.LINES, 1, true),
      createDrawBuffer(gl, program, leftTower.lines, gl.LINES, 1, true),
      createDrawBuffer(gl, program, leftTower.points, gl.POINTS, 92, true),
      createDrawBuffer(gl, program, rightTower.lines, gl.LINES, 1, true),
      createDrawBuffer(gl, program, rightTower.lines, gl.LINES, 1, true),
      createDrawBuffer(gl, program, rightTower.points, gl.POINTS, 86, true)
    ];

    const projection = new Float32Array(16);
    const view = new Float32Array(16);
    const target = [0.10, 4.25, -0.95];

    const state = {
      azimuth: FRONT_AZIMUTH,
      velocity: 0,
      dragging: false,
      pointerId: null,
      lastX: 0,
      lastTime: 0,
      introStartedAt: null,
      introCancelled: true,
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
      gl.vertexAttribPointer(
        buffer.positionLocation,
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
          state.azimuth =
            INTRO.from + (INTRO.to - INTRO.from) * smoothstep(progress);

          if (progress >= 1) {
            state.introCancelled = true;
          }
        }
      } else if (!state.dragging && Math.abs(state.velocity) > 0.001) {
        state.azimuth += state.velocity;
        state.velocity *= 0.92;
      }

      const angle = (state.azimuth % 360) * DEG;
      const aspect = state.width / state.height;
      const portraitBoost = clamp((1.05 - aspect) * 2.8, 0, 1.4);
      const distance = 22.7 + portraitBoost;
      const eye = [
        target[0] + Math.sin(angle) * distance,
        target[1] + 1.30,
        target[2] + Math.cos(angle) * distance
      ];
      const fov = aspect < 0.82 ? 53 : aspect < 1.12 ? 49 : 46;

      mat4Perspective(projection, fov * DEG, aspect, 0.1, 90);
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

      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    }

    function onKeyDown(event) {
      if (
        event.key !== "ArrowLeft" &&
        event.key !== "ArrowRight" &&
        event.key !== "Home"
      ) {
        return;
      }

      cancelIntro();

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
      cancelIntro();
      state.azimuth = FRONT_AZIMUTH;
      state.velocity = 0;
    });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(frame);
    window.requestAnimationFrame(render);

    window.setTimeout(() => {
      hint.style.opacity = "0";
    }, 2200);

    mount.dataset.rfGraphLoaded = "true";
    mount.dataset.rfGraphVersion = VERSION;
    mount.dataset.rfGraphMode = "webgl-upward-radar-platform";
    mount.dispatchEvent(
      new CustomEvent(RENDERED_EVENT, {
        bubbles: true,
        detail: {
          version: VERSION,
          selectedPathId: SELECTED_PATH_ID,
          mode: "webgl-upward-radar-platform"
        }
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
      console.error("FieldOps RF 3D viewer failed:", error);

      const fallback = document.createElement("div");
      fallback.textContent = "The 3D RF view could not start.";
      fallback.style.cssText =
        "display:grid;place-items:center;width:100%;height:100%;padding:16px;color:#dffbff;background:#031329;font:700 12px/1.4 system-ui;text-align:center";

      mount.replaceChildren(fallback);
      mount.dataset.rfGraphLoaded = "false";
      mount.dataset.rfGraphVersion = VERSION;
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

/* ==========================================================================
   FieldOps Atlas RF 3D orbit renderer
   File: FieldOpsAtlas/Features/RF/rf-graph.js
   Version: 1.1.112-svg-proportioned

   Purpose:
   - Preserve the current twin-peak terrain layout, TX positions, valley path,
     360-degree drag behaviour, mount selector, and rendered-event contract.
   - Add directional face shading so mountain planes define depth like the
     supplied two-mountain TX reference.
   - Keep the complete renderer self-contained with no external libraries.
   ========================================================================== */
(() => {
  "use strict";

  const VERSION = "1.1.112-svg-proportioned";
  const MOUNT_SELECTOR = "[data-rf-graph]";
  const MAP_PAPER_SELECTOR = ".rf-map-paper";
  const LEGACY_KEY_SELECTOR = ".rf-graph-key";
  const RENDERED_EVENT = "fieldops:rf-graph-rendered";
  const SELECTED_PATH_ID = "site-1-to-site-2";
  const MODE = "webgl-360-svg-proportioned";

  const DEG = Math.PI / 180;
  const FRONT_AZIMUTH = 0;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function smoothstep(value) {
    const t = clamp(value, 0, 1);
    return t * t * (3 - 2 * t);
  }

  function seededNoise(x, z) {
    const value = Math.sin(x * 127.1 + z * 311.7) * 43758.5453123;
    return value - Math.floor(value);
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

  function valleyCentreX(z) {
    return 0.35 + 0.42 * Math.sin((z + 1.8) * 0.50) + 0.10 * Math.sin(z * 1.55);
  }

  function terrainHeight(x, z) {
    function mountain(
      cx,
      cz,
      radiusX,
      radiusZ,
      height,
      rotation,
      ridgePhase,
      plateau = 0.045
    ) {
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
        -0.075 *
        Math.max(0, Math.sin(angle * 7.0 + radial * 19.0 + ridgePhase)) *
        Math.pow(slope, 1.4);

      const shape = clamp(
        1 + (ridges + brokenFaces) * slope + cuts,
        0.60,
        1.42
      );

      return height * (core * shape + apron);
    }

    const leftMain = mountain(-7.25, 0.00, 7.05, 7.10, 4.45, -0.10, 0.35);
    const rightMain = mountain(6.05, -1.95, 6.90, 7.05, 4.12, 0.12, 1.42);

    const leftFront = mountain(-9.65, 2.80, 5.20, 5.35, 1.50, -0.28, 0.92, 0.02);
    const leftOuter = mountain(-11.85, 0.10, 4.95, 5.40, 1.12, 0.14, 2.10, 0.02);
    const leftInner = mountain(-4.10, 0.00, 4.05, 4.75, 0.88, 0.22, 1.65, 0.02);

    const rightFront = mountain(8.20, 2.55, 5.10, 5.20, 1.42, 0.28, 2.30, 0.02);
    const rightOuter = mountain(10.60, -1.70, 4.85, 5.25, 1.06, -0.16, 0.55, 0.02);
    const rightInner = mountain(3.55, -1.85, 4.00, 4.70, 0.84, -0.20, 1.12, 0.02);

    const backLeft = mountain(-2.95, -5.85, 4.55, 2.75, 0.92, 0.16, 2.42, 0.02);
    const backRight = mountain(2.95, -6.00, 4.45, 2.70, 0.86, -0.14, 0.72, 0.02);

    const distantRidge =
      0.80 *
      Math.exp(-(((x - 0.3) / 7.4) ** 2 + ((z + 5.6) / 2.45) ** 2));

    const valleyX = valleyCentreX(z);
    const valleyCut =
      -1.04 *
      Math.exp(-((x - valleyX) ** 2) / 1.20) *
      Math.exp(-((z - 0.8) ** 2) / 70);

    const frontRise =
      0.26 *
      Math.exp(-((z - 6.8) ** 2) / 12) *
      (0.45 + 0.55 * Math.min(1, Math.abs(x) / 8));

    const baseUndulation =
      -0.50 +
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
    const averageX = (a[0] + b[0] + c[0]) / 3;
    const altitude = clamp((averageY + 0.70) / 7.9, 0, 1);
    const rear = smoothstep(clamp((-averageZ - 1.1) / 6.0, 0, 1));
    const valleyDistance = Math.abs(averageX - valleyCentreX(averageZ));
    const valley =
      Math.exp(-(valleyDistance * valleyDistance) / 1.6) *
      Math.exp(-((averageZ - 0.8) ** 2) / 65);
    const noise = seededNoise(
      Math.floor((averageX + 24) * 4),
      Math.floor((averageZ + 24) * 4)
    );
    const facet = noise > 0.60 ? (noise - 0.60) * 0.11 : 0;
    const separation = 1 - rear * 0.30 - valley * 0.18;

    return [
      0.008,
      (0.22 + altitude * 0.18 + facet) * separation,
      (0.31 + altitude * 0.25 + facet * 1.25) * separation,
      0.98
    ];
  }

  function createTerrain() {
    const xMin = -15.2;
    const xMax = 15.2;
    const zMin = -8.3;
    const zMax = 13.0;
    const columns = 112;
    const rows = 88;
    const triangles = emptyGeometry();
    const lines = emptyGeometry();
    const points = emptyGeometry();
    const ridges = emptyGeometry();
    const grid = [];

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

        if (row % 3 === 0 && column % 3 === 0 && y > -0.35) {
          const altitude = clamp((y + 0.55) / 7.5, 0, 1);
          pushVertex(
            points,
            [x, y + 0.035, z],
            [0, 1, 0],
            [0.05, 0.65 + altitude * 0.28, 0.75 + altitude * 0.22, 0.24 + altitude * 0.28]
          );
        }
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
      const altitude = clamp((averageY + 0.55) / 7.5, 0, 1);
      const effectiveAlpha = alpha * (0.30 + altitude * 0.70);
      const colour = [0.03, 0.77 + altitude * 0.20, 0.84 + altitude * 0.16, effectiveAlpha];
      pushLine(
        lines,
        [a[0], a[1] + 0.025, a[2]],
        [b[0], b[1] + 0.025, b[2]],
        colour
      );
    }

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const a = grid[row][column];
        const b = grid[row][column + 1];
        const c = grid[row + 1][column];
        const d = grid[row + 1][column + 1];

        const diagonal = seededNoise(column + 13, row + 29) > 0.5;

        if (diagonal) {
          addTriangle(a, c, d);
          addTriangle(a, d, b);
        } else {
          addTriangle(a, c, b);
          addTriangle(b, c, d);
        }

        if (row % 3 === 0) addMeshLine(a, b, 0.18);
        if (column % 4 === 0) addMeshLine(a, c, 0.15);
      }
    }

    function addRidgePath(controlPoints) {
      const sampled = [];

      for (let index = 0; index < controlPoints.length - 1; index += 1) {
        const start = controlPoints[index];
        const end = controlPoints[index + 1];
        const steps = 8;

        for (let step = 0; step < steps; step += 1) {
          const t = step / steps;
          const x = start[0] + (end[0] - start[0]) * t;
          const z = start[1] + (end[1] - start[1]) * t;
          sampled.push([x, terrainHeight(x, z) + 0.075, z]);
        }
      }

      const last = controlPoints[controlPoints.length - 1];
      sampled.push([last[0], terrainHeight(last[0], last[1]) + 0.075, last[1]]);

      for (let index = 1; index < sampled.length; index += 1) {
        pushLine(
          ridges,
          sampled[index - 1],
          sampled[index],
          [0.54, 1.0, 0.92, 0.68]
        );
      }
    }

    addRidgePath([
      [-11.8, 3.8],
      [-10.0, 2.3],
      [-8.1, 0.5],
      [-6.25, -1.10],
      [-4.9, 0.25],
      [-3.7, 2.2],
      [-2.7, 4.9]
    ]);

    addRidgePath([
      [2.8, 4.8],
      [3.9, 2.2],
      [5.15, 0.1],
      [6.55, -1.55],
      [8.2, 0.2],
      [10.0, 2.2],
      [11.8, 3.9]
    ]);

    return { triangles, lines, points, ridges };
  }

  function createTower(origin, height, baseRadius, detailScale = 1, radarSide = 1) {
    const lines = emptyGeometry();
    const points = emptyGeometry();
    const levels = 14;
    const gold = [1.0, 0.68, 0.12, 0.99];
    const warmGold = [1.0, 0.46, 0.02, 0.90];
    const glowGold = [1.0, 0.36, 0.01, 0.56];

    function addSegment(a, b, colour = gold) {
      pushLine(lines, a, b, colour);
    }

    function addNode(point, colour = glowGold) {
      pushVertex(points, point, [0, 1, 0], colour);
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

        addSegment(a, b);
        addSegment(a, c, warmGold);
        addSegment(a, d);
        addSegment(b, c, warmGold);
        addNode(a);
      }
    }

    const top = [
      origin[0],
      origin[1] + height + 0.38 * detailScale,
      origin[2]
    ];

    for (let leg = 0; leg < 4; leg += 1) {
      addSegment(legPoint(leg, levels), top);
    }

    const mastTip = [
      top[0],
      top[1] + 0.72 * detailScale,
      top[2]
    ];

    addSegment(top, mastTip);
    addNode(mastTip, [1.0, 0.70, 0.12, 0.78]);

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

        addSegment(bottomLeft, topLeft);
        addSegment(topLeft, topRight, warmGold);
        addSegment(topRight, bottomRight);
        addSegment(bottomRight, bottomLeft, warmGold);
        addSegment([origin[0], y, origin[2]], [x, y, z], warmGold);
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

      addSegment(innerFront, outerFront, warmGold);
      addSegment(innerRear, outerRear, warmGold);
      addSegment(innerFront, innerRear, gold);
      addSegment(outerFront, outerRear, gold);
      addSegment(platformInner, platformOuter, warmGold);
      addSegment(braceBase, outerFront, warmGold);
      addSegment(braceBase, outerRear, warmGold);
      addSegment(platformOuter, pedestal, gold);
      addSegment(outerFront, pedestal, warmGold);
      addSegment(outerRear, pedestal, warmGold);
      addSegment(pedestal, centre, gold);

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

      function dishPoint(fraction, angle) {
        const radial = radius * fraction;
        const bowl = depth * fraction * fraction;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        return [
          centre[0] + right[0] * cos * radial + up[0] * sin * radial - normal[0] * bowl,
          centre[1] + right[1] * cos * radial + up[1] * sin * radial - normal[1] * bowl,
          centre[2] + right[2] * cos * radial + up[2] * sin * radial - normal[2] * bowl
        ];
      }

      for (let ring = 1; ring <= ringCount; ring += 1) {
        const fraction = ring / ringCount;
        let previous = dishPoint(fraction, 0);

        for (let segment = 1; segment <= segmentCount; segment += 1) {
          const angle = (segment / segmentCount) * Math.PI * 2;
          const current = dishPoint(fraction, angle);
          addSegment(previous, current, ring === ringCount ? gold : warmGold);
          previous = current;
        }
      }

      for (let segment = 0; segment < segmentCount; segment += 4) {
        const angle = (segment / segmentCount) * Math.PI * 2;
        addSegment(centre, dishPoint(1, angle), warmGold);
      }

      const feed = [
        centre[0] + normal[0] * radius * 0.42,
        centre[1] + normal[1] * radius * 0.42,
        centre[2] + normal[2] * radius * 0.42
      ];

      addSegment(centre, feed);
      addNode(feed, [1.0, 0.62, 0.05, 0.70]);
    }

    addSideRadar();
    return { lines, points };
  }

  function createValleyPath() {
    const ribbon = emptyGeometry();
    const lines = emptyGeometry();
    const points = emptyGeometry();
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
      pushVertex(points, point, [0, 1, 0], [0.0, 0.91, 0.98, 0.60]);

      if (index > 0) {
        pushLine(
          lines,
          path[index - 1],
          point,
          [0.0, 0.91, 0.98, 0.86]
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
      const normal = [0, 1, 0];
      const colour = [0.0, 0.56, 0.68, 0.18];

      pushVertex(ribbon, aLeft, normal, colour);
      pushVertex(ribbon, bLeft, normal, colour);
      pushVertex(ribbon, aRight, normal, colour);
      pushVertex(ribbon, aRight, normal, colour);
      pushVertex(ribbon, bLeft, normal, colour);
      pushVertex(ribbon, bRight, normal, colour);
    }

    return { ribbon, lines, points };
  }

  function createContactShadow(origin, radiusX, radiusZ) {
    const triangles = emptyGeometry();
    const centre = [origin[0], origin[1] + 0.018, origin[2]];
    const normal = [0, 1, 0];
    const segments = 28;

    for (let index = 0; index < segments; index += 1) {
      const angleA = (index / segments) * Math.PI * 2;
      const angleB = ((index + 1) / segments) * Math.PI * 2;
      const a = [
        centre[0] + Math.cos(angleA) * radiusX,
        centre[1],
        centre[2] + Math.sin(angleA) * radiusZ
      ];
      const b = [
        centre[0] + Math.cos(angleB) * radiusX,
        centre[1],
        centre[2] + Math.sin(angleB) * radiusZ
      ];
      const colour = [0.0, 0.015, 0.022, 0.42];

      pushVertex(triangles, centre, normal, colour);
      pushVertex(triangles, a, normal, colour);
      pushVertex(triangles, b, normal, colour);
    }

    return triangles;
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
      "Static twin-peak RF mountain fallback with two transmitter towers."
    );
    fallback.style.cssText =
      "display:grid;place-items:center;width:100%;height:100%;min-height:300px;background:#010a12;overflow:hidden";
    fallback.innerHTML = `
      <svg viewBox="0 0 1000 620" width="100%" height="100%" aria-hidden="true">
        <defs>
          <linearGradient id="rfFallbackLeft" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#0d7e88"/>
            <stop offset="1" stop-color="#031724"/>
          </linearGradient>
          <linearGradient id="rfFallbackRight" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#0a6975"/>
            <stop offset="1" stop-color="#02131e"/>
          </linearGradient>
        </defs>
        <rect width="1000" height="620" fill="#010a12"/>
        <path d="M18 555 L110 474 L205 414 L298 320 L382 318 L470 334 L565 444 L635 514 L660 555 Z" fill="url(#rfFallbackLeft)"/>
        <path d="M520 555 L610 476 L700 414 L780 340 L850 336 L916 356 L980 448 L995 555 Z" fill="url(#rfFallbackRight)"/>
        <path d="M298 320 L382 318 L470 334 L565 444 L635 514 L468 510 L365 430 L314 360 Z" fill="#02141f" opacity=".72"/>
        <path d="M780 340 L850 336 L916 356 L980 448 L995 555 L842 520 L750 446 L720 390 Z" fill="#02131d" opacity=".72"/>
        <g fill="none" stroke="#ffc45b" stroke-width="5" stroke-linecap="round">
          <path d="M340 310 L320 405 M340 310 L360 405 M320 405 L360 405 M326 378 L354 378 M330 350 L350 350 M340 310 L340 252"/>
          <path d="M805 328 L787 416 M805 328 L823 416 M787 416 L823 416 M792 391 L818 391 M795 365 L815 365 M805 328 L805 274"/>
        </g>
        <path d="M500 546 C472 498 520 454 492 378" fill="none" stroke="#75effa" stroke-width="5"/>
      </svg>
    `;
    mount.replaceChildren(fallback);
    mount.dataset.rfGraphLoaded = "fallback";
    mount.dataset.rfGraphVersion = VERSION;
    mount.dataset.rfGraphMode = "static-svg-proportioned-fallback";
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
      "Interactive shaded 3D RF twin-peak mountain scene with two transmitter towers. Drag left or right to orbit 360 degrees."
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
    const leftOrigin = [
      -7.25,
      terrainHeight(-7.25, 0.00) + 0.025,
      0.00
    ];
    const rightOrigin = [
      6.05,
      terrainHeight(6.05, -1.95) + 0.025,
      -1.95
    ];
    const leftTower = createTower(leftOrigin, 3.42, 0.54, 1.0, 1);
    const rightTower = createTower(rightOrigin, 3.12, 0.49, 0.93, -1);
    const path = createValleyPath();
    const leftShadow = createContactShadow(leftOrigin, 0.96, 0.42);
    const rightShadow = createContactShadow(rightOrigin, 0.90, 0.40);

    const drawBuffers = [
      createDrawBuffer(gl, program, terrain.triangles, gl.TRIANGLES, {
        lit: true,
        depthWrite: true
      }),
      createDrawBuffer(gl, program, leftShadow, gl.TRIANGLES, {
        lit: false,
        depthWrite: false
      }),
      createDrawBuffer(gl, program, rightShadow, gl.TRIANGLES, {
        lit: false,
        depthWrite: false
      }),
      createDrawBuffer(gl, program, terrain.lines, gl.LINES, {
        additive: true,
        emission: 0.24,
        depthWrite: false
      }),
      createDrawBuffer(gl, program, terrain.ridges, gl.LINES, {
        additive: true,
        emission: 0.66,
        depthWrite: false
      }),
      createDrawBuffer(gl, program, terrain.points, gl.POINTS, {
        pointScale: 46,
        additive: true,
        emission: 0.44,
        depthWrite: false
      }),
      createDrawBuffer(gl, program, path.ribbon, gl.TRIANGLES, {
        additive: true,
        emission: 0.24,
        depthWrite: false
      }),
      createDrawBuffer(gl, program, path.lines, gl.LINES, {
        additive: true,
        emission: 0.78,
        depthWrite: false
      }),
      createDrawBuffer(gl, program, path.points, gl.POINTS, {
        pointScale: 42,
        additive: true,
        emission: 0.50,
        depthWrite: false
      }),
      createDrawBuffer(gl, program, leftTower.lines, gl.LINES, {
        additive: true,
        emission: 0.84,
        depthWrite: false
      }),
      createDrawBuffer(gl, program, leftTower.points, gl.POINTS, {
        pointScale: 92,
        additive: true,
        emission: 0.90,
        depthWrite: false
      }),
      createDrawBuffer(gl, program, rightTower.lines, gl.LINES, {
        additive: true,
        emission: 0.84,
        depthWrite: false
      }),
      createDrawBuffer(gl, program, rightTower.points, gl.POINTS, {
        pointScale: 86,
        additive: true,
        emission: 0.90,
        depthWrite: false
      })
    ];

    const projection = new Float32Array(16);
    const view = new Float32Array(16);
    const target = [-0.05, 3.20, -0.80];
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
      const portraitBoost = clamp((1.05 - aspect) * 2.8, 0, 1.4);
      const distance = 25.4 + portraitBoost;
      const eye = [
        target[0] + Math.sin(angle) * distance,
        target[1] + 1.08,
        target[2] + Math.cos(angle) * distance
      ];
      const fov = aspect < 0.82 ? 51 : aspect < 1.12 ? 47 : 44;

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

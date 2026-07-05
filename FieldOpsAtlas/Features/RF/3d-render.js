/* FieldOps Atlas — reusable WebGL scene renderer
 * Version: 1.6.5-scene-plate-pitch
 * Supports packed/full mountains, indexed scene objects, shared GPU assets and orbit-linked camera motion.
 */
(() => {
  "use strict";

  const VERSION = "1.6.5-scene-plate-pitch";
  const assets = new Map();
  const instances = new WeakMap();

  const registry = globalThis.FieldOps3DAssets ||= {};
  registry.register = (id, asset) => {
    if (!id || !asset) throw new TypeError("A 3D asset id and definition are required");
    assets.set(id, Object.freeze(asset));
    document.dispatchEvent(new CustomEvent("fieldops3dassetready", { detail: { id } }));
    return asset;
  };
  registry.get = id => assets.get(id) || null;
  registry.has = id => assets.has(id);

  (globalThis.FieldOps3DAssetQueue || []).splice(0).forEach(item => {
    const { id, ...asset } = item;
    registry.register(id, asset);
  });

  const decodeBytes = text => {
    const binary = atob(text);
    const output = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) output[i] = binary.charCodeAt(i);
    return output;
  };

  const readVarint = (data, state) => {
    let value = 0;
    let factor = 1;
    while (true) {
      const byte = data[state.offset++];
      value += (byte & 127) * factor;
      if ((byte & 128) === 0) return value;
      factor *= 128;
    }
  };

  const zigzag = value => value % 2 === 0 ? value / 2 : -(value + 1) / 2;

  const packedPositions = layer => {
    const data = decodeBytes(layer.p);
    const state = { offset: 0 };

    if (layer.format === "q16d") {
      const previous = [0, 0, 0];
      const output = new Float32Array(layer.v * 3);
      for (let i = 0; i < output.length; i += 1) {
        const axis = i % 3;
        const value = previous[axis] + zigzag(readVarint(data, state));
        previous[axis] = value;
        output[i] = layer.o[axis] + value * layer.s[axis];
      }
      return output;
    }

    const words = new Uint32Array(layer.v * 3);
    const previous = [0, 0, 0];
    for (let i = 0; i < words.length; i += 1) {
      const axis = i % 3;
      const value = (previous[axis] + zigzag(readVarint(data, state))) >>> 0;
      previous[axis] = value;
      words[i] = value;
    }
    return new Float32Array(words.buffer);
  };

  const packedIndices = layer => {
    const data = decodeBytes(layer.i);
    const state = { offset: 0 };
    const output = new Uint32Array(layer.f * 3);
    let previousFirst = 0;
    for (let face = 0; face < layer.f; face += 1) {
      const offset = face * 3;
      const first = previousFirst + zigzag(readVarint(data, state));
      output[offset] = first;
      output[offset + 1] = first + zigzag(readVarint(data, state));
      output[offset + 2] = first + zigzag(readVarint(data, state));
      previousFirst = first;
    }
    return output;
  };

  const packedFaceColours = layer => {
    const data = decodeBytes(layer.c);
    const output = new Uint8Array(layer.f);
    const mask = (1 << layer.b) - 1;
    for (let face = 0; face < layer.f; face += 1) {
      const bitOffset = face * layer.b;
      const byteOffset = bitOffset >> 3;
      const shift = bitOffset & 7;
      let value = data[byteOffset] >> shift;
      if (shift + layer.b > 8) value |= data[byteOffset + 1] << (8 - shift);
      output[face] = value & mask;
    }
    return output;
  };

  const toLinearPalette = values => {
    if (!values) return null;
    if (ArrayBuffer.isView(values)) return new Float32Array(values);
    if (typeof values[0] === "number") return new Float32Array(values);
    return new Float32Array(values.flatMap(hex => hex.match(/../g).map(channel => {
      const value = parseInt(channel, 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    })));
  };

  const expandIndexed = (positions, indices, faceColours, palette, withNormals) => {
    const count = indices.length;
    const expandedPositions = new Float32Array(count * 3);
    const expandedColours = new Float32Array(count * 3);
    const expandedNormals = withNormals ? new Float32Array(count * 3) : null;

    for (let face = 0, output = 0; face < faceColours.length; face += 1) {
      const indexOffset = face * 3;
      const a = indices[indexOffset] * 3;
      const b = indices[indexOffset + 1] * 3;
      const c = indices[indexOffset + 2] * 3;
      const colourOffset = faceColours[face] * 3;
      let nx = 0, ny = 0, nz = 0;

      if (withNormals) {
        const ux = positions[b] - positions[a];
        const uy = positions[b + 1] - positions[a + 1];
        const uz = positions[b + 2] - positions[a + 2];
        const vx = positions[c] - positions[a];
        const vy = positions[c + 1] - positions[a + 1];
        const vz = positions[c + 2] - positions[a + 2];
        nx = uy * vz - uz * vy;
        ny = uz * vx - ux * vz;
        nz = ux * vy - uy * vx;
        const length = Math.hypot(nx, ny, nz) || 1;
        nx /= length; ny /= length; nz /= length;
      }

      for (let corner = 0; corner < 3; corner += 1) {
        const source = indices[indexOffset + corner] * 3;
        expandedPositions[output] = positions[source];
        expandedPositions[output + 1] = positions[source + 1];
        expandedPositions[output + 2] = positions[source + 2];
        expandedColours[output] = palette[colourOffset];
        expandedColours[output + 1] = palette[colourOffset + 1];
        expandedColours[output + 2] = palette[colourOffset + 2];
        if (expandedNormals) {
          expandedNormals[output] = nx;
          expandedNormals[output + 1] = ny;
          expandedNormals[output + 2] = nz;
        }
        output += 3;
      }
    }

    return {
      positions: expandedPositions,
      colours: expandedColours,
      normals: expandedNormals,
      count
    };
  };

  const prepareLayer = (layer, palette) => {
    if (!layer) return null;
    if (!palette) throw new Error("A palette is required for every 3D layer");

    if (layer.format === "raw-indexed") {
      const positions = layer.positions instanceof Float32Array
        ? layer.positions
        : new Float32Array(layer.positions);
      const indices = layer.indices instanceof Uint32Array
        ? layer.indices
        : new Uint32Array(layer.indices);
      const faceColours = layer.faceColours instanceof Uint8Array
        ? layer.faceColours
        : new Uint8Array(layer.faceColours);
      return expandIndexed(positions, indices, faceColours, palette, Boolean(layer.normals));
    }

    if (layer.format === "raw-expanded") {
      return {
        positions: layer.positions instanceof Float32Array ? layer.positions : new Float32Array(layer.positions),
        colours: layer.colours instanceof Float32Array ? layer.colours : new Float32Array(layer.colours),
        normals: layer.normals
          ? (layer.normals instanceof Float32Array ? layer.normals : new Float32Array(layer.normals))
          : null,
        count: layer.count
      };
    }

    return expandIndexed(
      packedPositions(layer),
      packedIndices(layer),
      packedFaceColours(layer),
      palette,
      Boolean(layer.n)
    );
  };

  const compileShader = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(message);
    }
    return shader;
  };

  const createProgram = (gl, vertexSource, fragmentSource, useNormals) => {
    const program = gl.createProgram();
    const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    return {
      handle: program,
      position: gl.getAttribLocation(program, "aPosition"),
      colour: gl.getAttribLocation(program, "aColour"),
      normal: useNormals ? gl.getAttribLocation(program, "aNormal") : -1,
      view: gl.getUniformLocation(program, "uView"),
      projection: gl.getUniformLocation(program, "uProjection"),
      model: gl.getUniformLocation(program, "uModel"),
      mirror: gl.getUniformLocation(program, "uMirror"),
      centre: gl.getUniformLocation(program, "uCentre")
    };
  };

  const vertexCommon = `
    vec3 mirrored(vec3 value) {
      value.x = uCentre.x + (value.x - uCentre.x) * uMirror.x;
      value.z = uCentre.y + (value.z - uCentre.y) * uMirror.y;
      return value;
    }
  `;

  const shellVertex = `
    attribute vec3 aPosition;
    attribute vec3 aColour;
    attribute vec3 aNormal;
    uniform mat4 uView, uProjection, uModel;
    uniform vec2 uMirror, uCentre;
    varying vec3 vColour;
    varying vec3 vNormal;
    ${vertexCommon}
    void main() {
      vec3 position = mirrored(aPosition);
      vec3 normal = aNormal * vec3(uMirror.x, 1.0, uMirror.y);
      vColour = aColour;
      vNormal = normalize(mat3(uView * uModel) * normal);
      gl_Position = uProjection * uView * uModel * vec4(position, 1.0);
    }
  `;

  const ridgeVertex = `
    attribute vec3 aPosition;
    attribute vec3 aColour;
    uniform mat4 uView, uProjection, uModel;
    uniform vec2 uMirror, uCentre;
    varying vec3 vColour;
    ${vertexCommon}
    void main() {
      vColour = aColour;
      gl_Position = uProjection * uView * uModel * vec4(mirrored(aPosition), 1.0);
    }
  `;

  const colourFunction = `
    vec3 displayColour(vec3 value) {
      vec3 low = value * 12.92;
      vec3 high = 1.055 * pow(max(value, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055;
      return mix(low, high, step(vec3(0.0031308), value));
    }
  `;

  const shellFragment = `
    precision highp float;
    varying vec3 vColour;
    varying vec3 vNormal;
    ${colourFunction}
    void main() {
      vec3 normal = gl_FrontFacing ? normalize(vNormal) : -normalize(vNormal);
      vec3 key = normalize(vec3(-0.36, 0.80, 0.47));
      vec3 fill = normalize(vec3(0.68, 0.24, 0.63));
      float shade = 0.48
        + max(dot(normal, key), 0.0) * 0.30
        + max(dot(normal, fill), 0.0) * 0.09
        + max(normal.y, 0.0) * 0.07;
      gl_FragColor = vec4(displayColour(clamp(vColour * shade, 0.0, 1.0)), 1.0);
    }
  `;

  const ridgeFragment = `
    precision highp float;
    varying vec3 vColour;
    ${colourFunction}
    void main() {
      gl_FragColor = vec4(displayColour(clamp(vColour, 0.0, 1.0)), 1.0);
    }
  `;

  const createBuffer = (gl, data) => {
    const handle = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, handle);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return handle;
  };

  const uploadLayer = (gl, layer) => ({
    position: createBuffer(gl, layer.positions),
    colour: createBuffer(gl, layer.colours),
    normal: layer.normals ? createBuffer(gl, layer.normals) : null,
    count: layer.count
  });

  const modelMatrix = object => {
    const [px, py, pz] = object.position || [0, 0, 0];
    const [rx, ry, rz] = object.rotation || [0, 0, 0];
    const [sx, sy, sz] = object.scale || [1, 1, 1];
    const cx = Math.cos(rx), sxr = Math.sin(rx);
    const cy = Math.cos(ry), syr = Math.sin(ry);
    const cz = Math.cos(rz), szr = Math.sin(rz);
    return new Float32Array([
      (cy * cz) * sx, (sxr * syr * cz + cx * szr) * sx, (-cx * syr * cz + sxr * szr) * sx, 0,
      (-cy * szr) * sy, (-sxr * syr * szr + cx * cz) * sy, (cx * syr * szr + sxr * cz) * sy, 0,
      syr * sz, (-sxr * cy) * sz, (cx * cy) * sz, 0,
      px, py, pz, 1
    ]);
  };

  const identityMatrix = () => new Float32Array([
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    0,0,0,1
  ]);

  const multiplyMatrix = (a, b) => {
    const output = new Float32Array(16);
    for (let column = 0; column < 4; column += 1) {
      for (let row = 0; row < 4; row += 1) {
        output[column * 4 + row] =
          a[0 * 4 + row] * b[column * 4 + 0] +
          a[1 * 4 + row] * b[column * 4 + 1] +
          a[2 * 4 + row] * b[column * 4 + 2] +
          a[3 * 4 + row] * b[column * 4 + 3];
      }
    }
    return output;
  };

  const transformMatrixPoint = (matrix, point) => {
    const [x, y, z] = point;
    return [
      matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12],
      matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13],
      matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14]
    ];
  };

  const rotationAroundAxis = (axis, radians, pivot = [0, 0, 0]) => {
    if (!radians) return identityMatrix();
    let [x, y, z] = axis;
    const length = Math.hypot(x, y, z) || 1;
    x /= length; y /= length; z /= length;
    const c = Math.cos(radians);
    const s = Math.sin(radians);
    const t = 1 - c;
    const rotation = new Float32Array([
      t*x*x+c,     t*x*y+s*z,   t*x*z-s*y,   0,
      t*x*y-s*z,   t*y*y+c,     t*y*z+s*x,   0,
      t*x*z+s*y,   t*y*z-s*x,   t*z*z+c,     0,
      0,            0,           0,           1
    ]);
    const rotatedPivot = transformMatrixPoint(rotation, pivot);
    rotation[12] = pivot[0] - rotatedPivot[0];
    rotation[13] = pivot[1] - rotatedPivot[1];
    rotation[14] = pivot[2] - rotatedPivot[2];
    return rotation;
  };

  const perspective = (fov, aspect, near, far) => {
    const f = 1 / Math.tan(fov / 2);
    const range = 1 / (near - far);
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * range, -1,
      0, 0, 2 * far * near * range, 0
    ]);
  };

  const lookAt = (eye, target) => {
    let zx = eye[0] - target[0];
    let zy = eye[1] - target[1];
    let zz = eye[2] - target[2];
    let length = Math.hypot(zx, zy, zz) || 1;
    zx /= length; zy /= length; zz /= length;
    let xx = zz;
    let xz = -zx;
    length = Math.hypot(xx, xz) || 1;
    xx /= length; xz /= length;
    const yx = zy * xz;
    const yy = zz * xx - zx * xz;
    const yz = -zy * xx;
    return new Float32Array([
      xx, yx, zx, 0,
      0, yy, zy, 0,
      xz, yz, zz, 0,
      -(xx * eye[0] + xz * eye[2]),
      -(yx * eye[0] + yy * eye[1] + yz * eye[2]),
      -(zx * eye[0] + zy * eye[1] + zz * eye[2]),
      1
    ]);
  };

  // Applies a camera roll after lookAt without changing the scene objects.
  // This lets scene definitions gradually tilt the floor while orbiting.
  const rollView = (matrix, radians) => {
    if (!radians) return matrix;
    const cosine = Math.cos(radians);
    const sine = Math.sin(radians);
    const output = new Float32Array(matrix);
    for (let column = 0; column < 4; column += 1) {
      const offset = column * 4;
      const x = matrix[offset];
      const y = matrix[offset + 1];
      output[offset] = cosine * x + sine * y;
      output[offset + 1] = -sine * x + cosine * y;
    }
    return output;
  };

  function create(root, scene) {
    if (!root) throw new Error("3D graph mount was not found");
    instances.get(root)?.destroy();
    root.replaceChildren();

    const canvas = document.createElement("canvas");
    canvas.tabIndex = 0;
    canvas.setAttribute("aria-label", scene.label || "Rotatable 3D RF scene");
    canvas.style.cssText = "display:block;width:100%;height:100%;touch-action:none;cursor:grab;background:#01090e";
    root.appendChild(canvas);

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: true,
      depth: true,
      powerPreference: "high-performance"
    });
    if (!gl) throw new Error("WebGL is required for the RF scene");

    const shellProgram = createProgram(gl, shellVertex, shellFragment, true);
    const ridgeProgram = createProgram(gl, ridgeVertex, ridgeFragment, false);

    // Upload each registered asset once per WebGL context. Multiple objects can
    // point at the same asset with separate transforms, which is how the A/A
    // scene loads Mountain A once and draws it twice.
    const gpuAssets = new Map();
    const objects = scene.objects.map(definition => {
      const asset = assets.get(definition.asset);
      if (!asset) throw new Error(`3D asset not loaded: ${definition.asset}`);

      let layers = gpuAssets.get(definition.asset);
      if (!layers) {
        const shellPalette = toLinearPalette(asset.palettes?.shell);
        const ridgePalette = toLinearPalette(asset.palettes?.ridge);
        layers = {};
        if (asset.layers?.shell) layers.shell = uploadLayer(gl, prepareLayer(asset.layers.shell, shellPalette));
        if (asset.layers?.platform) layers.platform = uploadLayer(gl, prepareLayer(asset.layers.platform, shellPalette));
        if (asset.layers?.ridge) layers.ridge = uploadLayer(gl, prepareLayer(asset.layers.ridge, ridgePalette));
        gpuAssets.set(definition.asset, layers);
      }

      const baseModel = modelMatrix(definition);
      return { definition, asset, layers, baseModel, model: baseModel };
    });

    const state = {
      angle: scene.initialAngle || 0,
      velocity: 0,
      dragging: false,
      pointer: null,
      x: 0,
      frame: 0,
      dirty: true,
      destroyed: false,
      width: 0,
      height: 0,
      viewMatrix: null,
      projectionMatrix: null
    };

    const view = scene.camera || objects[0]?.asset.view;
    if (!view) throw new Error("Scene camera is missing");
    const background = scene.background || "#01090e";
    const rgb = background.match(/[0-9a-f]{2}/gi)?.map(value => parseInt(value, 16) / 255)
      || [1 / 255, 9 / 255, 14 / 255];

    const bind = (program, layer) => {
      gl.useProgram(program.handle);
      gl.bindBuffer(gl.ARRAY_BUFFER, layer.position);
      gl.enableVertexAttribArray(program.position);
      gl.vertexAttribPointer(program.position, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, layer.colour);
      gl.enableVertexAttribArray(program.colour);
      gl.vertexAttribPointer(program.colour, 3, gl.FLOAT, false, 0, 0);
      if (program.normal >= 0 && layer.normal) {
        gl.bindBuffer(gl.ARRAY_BUFFER, layer.normal);
        gl.enableVertexAttribArray(program.normal);
        gl.vertexAttribPointer(program.normal, 3, gl.FLOAT, false, 0, 0);
      }
    };

    const draw = (program, layer, object, mirror) => {
      bind(program, layer);
      gl.uniformMatrix4fv(program.view, false, state.viewMatrix);
      gl.uniformMatrix4fv(program.projection, false, state.projectionMatrix);
      gl.uniformMatrix4fv(program.model, false, object.model);
      gl.uniform2f(program.mirror, mirror[0], mirror[1]);
      const centre = object.asset.centre || [0, 0];
      gl.uniform2f(program.centre, centre[0], centre[1]);
      gl.drawArrays(gl.TRIANGLES, 0, layer.count);
    };

    const resize = () => {
      const box = root.getBoundingClientRect();
      const mobile = matchMedia("(max-width:760px)").matches;
      const moving = state.dragging || Math.abs(state.velocity) > 0.01;
      const maxRatio = mobile ? (moving ? 1 : 1.3) : (moving ? 1.25 : 1.65);
      const ratio = Math.min(devicePixelRatio || 1, maxRatio);
      const width = Math.max(1, Math.round(box.width * ratio));
      const height = Math.max(1, Math.round(box.height * ratio));
      if (width === state.width && height === state.height) return false;
      state.width = canvas.width = width;
      state.height = canvas.height = height;
      return true;
    };

    const render = () => {
      resize();
      const aspect = state.width / Math.max(1, state.height);
      const fov = (view.fov || 44) * Math.PI / 180;
      const horizontal = 2 * Math.atan(Math.tan(fov / 2) * Math.max(aspect, 0.35));
      const radius = Math.hypot(...view.size) * 0.5;
      const angle = state.angle * Math.PI / 180;
      const motion = view.orbitMotion || {};
      const phase = angle * (Number(motion.frequency) || 1) + (Number(motion.phase) || 0);
      const baseDistance = Math.max(
        radius * 1.08,
        Math.max(view.size[0], view.size[2]) / (2 * Math.tan(Math.max(horizontal, 0.18) / 2)) * 1.18,
        view.size[1] / (2 * Math.tan(Math.max(fov, 0.18) / 2)) * 1.30
      ) * (view.distanceScale || 1);
      const orbitWave = Math.sin(phase);
      const sideThreshold = Math.min(0.95, Math.max(0, Number(motion.sideThreshold) || 0));
      const sideRaw = Math.min(1, Math.max(0,
        (Math.abs(orbitWave) - sideThreshold) / Math.max(0.001, 1 - sideThreshold)
      ));
      const sideWave = sideRaw * sideRaw * (3 - 2 * sideRaw);
      const sideSign = orbitWave < 0 ? -1 : 1;
      const sideValue = key => Number(
        sideSign < 0
          ? motion[`${key}Negative`] ?? motion[key]
          : motion[`${key}Positive`] ?? motion[key]
      ) || 0;
      const distance = baseDistance * (
        1 + orbitWave * (Number(motion.dolly) || 0) + sideWave * sideValue("sideDolly")
      );
      const orbitScreenY = Math.max(0, orbitWave) * (Number(motion.screenY) || 0);
      const sideScreenY = sideWave * sideValue("sideScreenY");
      const scenePitch = sideWave * sideValue("sideScenePitch");
      const pivotKey = sideSign < 0 ? "sideScenePivotNegative" : "sideScenePivotPositive";
      const scenePivot = motion[pivotKey] || motion.sideScenePivot || [0, 0, 0];
      // Rotate the complete scene like one rigid plate around the camera's
      // horizontal screen axis. This changes depth without changing the
      // relative height or mounting of any mountain/transmitter object.
      const sceneMatrix = rotationAroundAxis(
        [Math.cos(angle), 0, -Math.sin(angle)],
        scenePitch,
        scenePivot
      );
      for (const object of objects) object.model = multiplyMatrix(sceneMatrix, object.baseModel);
      const target = [
        view.target[0] + Math.sin(phase) * (Number(motion.targetX) || 0)
          + sideWave * sideValue("sideTargetX"),
        view.target[1] + (0.5 - 0.5 * Math.cos(phase)) * (Number(motion.targetY) || 0)
          + sideWave * sideValue("sideTargetY"),
        view.target[2] + Math.cos(phase) * (Number(motion.targetZ) || 0)
          + sideWave * sideValue("sideTargetZ")
      ];
      const eye = [
        target[0] + Math.sin(angle) * distance,
        target[1] + (view.lift || 0) + Math.sin(phase) * (Number(motion.lift) || 0)
          + sideWave * sideValue("sideLift"),
        target[2] + Math.cos(angle) * distance
      ];
      const sideRoll = sideSign * sideWave * sideValue("sideRoll");
      state.viewMatrix = rollView(lookAt(eye, target), sideRoll);
      state.projectionMatrix = perspective(fov, aspect, 0.1, 220);

      // Bottom anchoring is evaluated after the camera and aspect ratio are
      // known. The lowest supplied floor point is moved to the requested NDC
      // edge, so the floor remains attached to the graph placeholder on both
      // wide and narrow layouts instead of floating around the vertical centre.
      if (Array.isArray(view.bottomAnchorPoints) && view.bottomAnchorPoints.length) {
        let lowest = Infinity;
        for (const point of view.bottomAnchorPoints) {
          const worldPoint = transformMatrixPoint(sceneMatrix, point);
          const x = worldPoint[0], y = worldPoint[1], z = worldPoint[2];
          const matrix = state.viewMatrix;
          const viewX = matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12];
          const viewY = matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13];
          const viewZ = matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14];
          const clipW = -viewZ;
          if (clipW > 0.0001) {
            const ndcX = state.projectionMatrix[0] * viewX / clipW;
            const ndcY = state.projectionMatrix[5] * viewY / clipW;
            // Only visible or near-visible floor points should control the
            // vertical anchor. A close corner far outside the horizontal
            // viewport must not pull the whole scene upwards while rotating.
            if (Math.abs(ndcX) <= 1.08) lowest = Math.min(lowest, ndcY);
          }
        }
        if (Number.isFinite(lowest)) {
          const desired = Number.isFinite(view.bottomNdc) ? view.bottomNdc : -0.985;
          state.projectionMatrix[9] = Math.max(0, lowest - desired);
        }
      } else {
        // Optional fixed fallback for non-valley scenes. Positive values move
        // the scene down in projection space.
        state.projectionMatrix[9] = Number(view.screenOffsetY) || 0;
      }

      // Scene-owned side-view composition. A positive value lowers the scene
      // only while the configured orbit wave is on its forward side.
      state.projectionMatrix[9] += orbitScreenY + sideScreenY;

      gl.viewport(0, 0, state.width, state.height);
      gl.clearColor(rgb[0], rgb[1], rgb[2], 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.disable(gl.CULL_FACE);
      gl.disable(gl.BLEND);
      gl.depthMask(true);

      for (const object of objects) {
        const mirrorEnabled = object.definition.mirror ?? object.asset.mirror;
        const mirrors = mirrorEnabled
          ? [[1, 1], [-1, 1], [1, -1], [-1, -1]]
          : [[1, 1]];

        for (const mirror of mirrors) {
          if (object.layers.shell) draw(shellProgram, object.layers.shell, object, mirror);
        }
        if (object.layers.platform) draw(shellProgram, object.layers.platform, object, [1, 1]);

        gl.depthMask(false);
        gl.enable(gl.POLYGON_OFFSET_FILL);
        gl.polygonOffset(-1, -1);
        for (const mirror of mirrors) {
          if (object.layers.ridge) draw(ridgeProgram, object.layers.ridge, object, mirror);
        }
        gl.disable(gl.POLYGON_OFFSET_FILL);
        gl.depthMask(true);
      }

      root.dataset.rfBuilder3Ready = "true";
      root.dataset.rfScene = scene.id || "scene";
      document.dispatchEvent(new CustomEvent("fieldops3dready", {
        detail: { scene: scene.id, root }
      }));
    };

    const schedule = () => {
      state.dirty = true;
      if (!state.frame) state.frame = requestAnimationFrame(tick);
    };

    const tick = () => {
      state.frame = 0;
      if (state.destroyed) return;
      if (!state.dragging && Math.abs(state.velocity) > 0.001) {
        state.angle += state.velocity;
        state.velocity *= 0.92;
        state.dirty = true;
      }
      if (state.dirty) {
        render();
        state.dirty = false;
      }
      if (state.dragging || Math.abs(state.velocity) > 0.001) state.frame = requestAnimationFrame(tick);
    };

    const pointerDown = event => {
      state.dragging = true;
      state.pointer = event.pointerId;
      state.x = event.clientX;
      state.velocity = 0;
      canvas.setPointerCapture?.(event.pointerId);
      canvas.style.cursor = "grabbing";
      schedule();
    };

    const pointerMove = event => {
      if (!state.dragging || event.pointerId !== state.pointer) return;
      const delta = event.clientX - state.x;
      state.x = event.clientX;
      state.angle += delta * 0.34;
      state.velocity = delta * 0.05;
      schedule();
    };

    const pointerUp = event => {
      if (event.pointerId !== state.pointer) return;
      state.dragging = false;
      state.pointer = null;
      canvas.style.cursor = "grab";
      schedule();
    };

    const keyDown = event => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      state.angle += event.key === "ArrowLeft" ? -8 : 8;
      state.velocity = 0;
      schedule();
      event.preventDefault();
    };

    const reset = () => {
      state.angle = scene.initialAngle || 0;
      state.velocity = 0;
      schedule();
    };

    canvas.addEventListener("pointerdown", pointerDown);
    canvas.addEventListener("pointermove", pointerMove);
    canvas.addEventListener("pointerup", pointerUp);
    canvas.addEventListener("pointercancel", pointerUp);
    canvas.addEventListener("keydown", keyDown);
    canvas.addEventListener("dblclick", reset);

    const observer = new ResizeObserver(schedule);
    observer.observe(root);

    const contextLost = event => {
      event.preventDefault();
      root.dataset.rfBuilder3Ready = "false";
    };
    const contextRestored = () => location.reload();
    canvas.addEventListener("webglcontextlost", contextLost);
    canvas.addEventListener("webglcontextrestored", contextRestored);

    const api = {
      VERSION,
      scene: scene.id,
      render: schedule,
      setAngle(value) {
        state.angle = Number(value) || 0;
        state.velocity = 0;
        schedule();
      },
      destroy() {
        if (state.destroyed) return;
        state.destroyed = true;
        if (state.frame) cancelAnimationFrame(state.frame);
        observer.disconnect();
        canvas.removeEventListener("pointerdown", pointerDown);
        canvas.removeEventListener("pointermove", pointerMove);
        canvas.removeEventListener("pointerup", pointerUp);
        canvas.removeEventListener("pointercancel", pointerUp);
        canvas.removeEventListener("keydown", keyDown);
        canvas.removeEventListener("dblclick", reset);
        canvas.removeEventListener("webglcontextlost", contextLost);
        canvas.removeEventListener("webglcontextrestored", contextRestored);
        for (const layers of gpuAssets.values()) {
          for (const layer of Object.values(layers)) {
            [layer.position, layer.colour, layer.normal].forEach(handle => handle && gl.deleteBuffer(handle));
          }
        }
        gl.deleteProgram(shellProgram.handle);
        gl.deleteProgram(ridgeProgram.handle);
        root.replaceChildren();
        delete root.dataset.rfBuilder3Ready;
        delete root.dataset.rfScene;
        instances.delete(root);
      }
    };

    instances.set(root, api);
    schedule();
    return api;
  }

  globalThis.FieldOps3DRenderer = { VERSION, create, assets: registry };
})();

/* FieldOps Atlas — reusable 3D renderer
 * File: FieldOpsAtlas/Features/RF/3d-render.js
 * Version: 1.2.0-scene-renderer
 */
(() => {
  "use strict";

  const VERSION = "1.2.0-scene-renderer";
  const assets = new Map();
  const instances = new WeakMap();

  const register = (id, asset) => {
    if (!id || !asset) throw new TypeError("A 3D asset id and definition are required");
    assets.set(id, Object.freeze(asset));
    document.dispatchEvent(new CustomEvent("fieldops3dassetready", { detail: { id } }));
    return asset;
  };

  const registry = globalThis.FieldOps3DAssets ||= {};
  registry.register = register;
  registry.get = id => assets.get(id) || null;
  registry.has = id => assets.has(id);

  (globalThis.FieldOps3DAssetQueue || []).splice(0).forEach(asset => register(asset.id, asset));

  const bytes = text => {
    const binary = atob(text);
    const output = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) output[i] = binary.charCodeAt(i);
    return output;
  };

  const varint = (data, state) => {
    let value = 0;
    let factor = 1;
    while (true) {
      const byte = data[state.offset++];
      value += (byte & 127) * factor;
      if ((byte & 128) === 0) return value;
      factor *= 128;
    }
  };

  const signed = value => value % 2 === 0 ? value / 2 : -(value + 1) / 2;

  const positions = layer => {
    const data = bytes(layer.p);
    const state = { offset: 0 };
    if (layer.format === "q16d") {
      const previous = [0, 0, 0];
      const output = new Float32Array(layer.v * 3);
      for (let i = 0; i < output.length; i += 1) {
        const axis = i % 3;
        const value = previous[axis] + signed(varint(data, state));
        previous[axis] = value;
        output[i] = layer.o[axis] + value * layer.s[axis];
      }
      return output;
    }
    const words = new Uint32Array(layer.v * 3);
    const previous = [0, 0, 0];
    for (let i = 0; i < words.length; i += 1) {
      const axis = i % 3;
      const value = (previous[axis] + signed(varint(data, state))) >>> 0;
      previous[axis] = value;
      words[i] = value;
    }
    return new Float32Array(words.buffer);
  };

  const indices = layer => {
    const data = bytes(layer.i);
    const state = { offset: 0 };
    const output = new Uint32Array(layer.f * 3);
    let previousFirst = 0;
    for (let face = 0; face < layer.f; face += 1) {
      const offset = face * 3;
      const first = previousFirst + signed(varint(data, state));
      output[offset] = first;
      output[offset + 1] = first + signed(varint(data, state));
      output[offset + 2] = first + signed(varint(data, state));
      previousFirst = first;
    }
    return output;
  };

  const faceColours = layer => {
    const data = bytes(layer.c);
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

  const linearPalette = values => new Float32Array(values.flatMap(hex => hex.match(/../g).map(channel => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  })));

  const expand = (layer, palette) => {
    const sourcePositions = positions(layer);
    const sourceIndices = indices(layer);
    const colours = faceColours(layer);
    const count = sourceIndices.length;
    const expandedPositions = new Float32Array(count * 3);
    const expandedColours = new Float32Array(count * 3);
    const expandedNormals = layer.n ? new Float32Array(count * 3) : null;

    for (let face = 0, output = 0; face < layer.f; face += 1) {
      const indexOffset = face * 3;
      const a = sourceIndices[indexOffset] * 3;
      const b = sourceIndices[indexOffset + 1] * 3;
      const c = sourceIndices[indexOffset + 2] * 3;
      const colourOffset = colours[face] * 3;
      let nx = 0, ny = 0, nz = 0;
      if (expandedNormals) {
        const ux = sourcePositions[b] - sourcePositions[a];
        const uy = sourcePositions[b + 1] - sourcePositions[a + 1];
        const uz = sourcePositions[b + 2] - sourcePositions[a + 2];
        const vx = sourcePositions[c] - sourcePositions[a];
        const vy = sourcePositions[c + 1] - sourcePositions[a + 1];
        const vz = sourcePositions[c + 2] - sourcePositions[a + 2];
        nx = uy * vz - uz * vy;
        ny = uz * vx - ux * vz;
        nz = ux * vy - uy * vx;
        const length = Math.hypot(nx, ny, nz) || 1;
        nx /= length; ny /= length; nz /= length;
      }
      for (let corner = 0; corner < 3; corner += 1) {
        const source = sourceIndices[indexOffset + corner] * 3;
        expandedPositions[output] = sourcePositions[source];
        expandedPositions[output + 1] = sourcePositions[source + 1];
        expandedPositions[output + 2] = sourcePositions[source + 2];
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
    return { positions: expandedPositions, colours: expandedColours, normals: expandedNormals, count };
  };

  const shader = (gl, type, source) => {
    const handle = gl.createShader(type);
    gl.shaderSource(handle, source);
    gl.compileShader(handle);
    if (!gl.getShaderParameter(handle, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(handle));
    return handle;
  };

  const program = (gl, vertexSource, fragmentSource, normals) => {
    const handle = gl.createProgram();
    const vertex = shader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragment = shader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    gl.attachShader(handle, vertex);
    gl.attachShader(handle, fragment);
    gl.linkProgram(handle);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(handle, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(handle));
    return {
      handle,
      position: gl.getAttribLocation(handle, "aPosition"),
      colour: gl.getAttribLocation(handle, "aColour"),
      normal: normals ? gl.getAttribLocation(handle, "aNormal") : -1,
      view: gl.getUniformLocation(handle, "uView"),
      projection: gl.getUniformLocation(handle, "uProjection"),
      model: gl.getUniformLocation(handle, "uModel"),
      mirror: gl.getUniformLocation(handle, "uMirror"),
      centre: gl.getUniformLocation(handle, "uCentre")
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
    attribute vec3 aPosition; attribute vec3 aColour; attribute vec3 aNormal;
    uniform mat4 uView, uProjection, uModel; uniform vec2 uMirror, uCentre;
    varying vec3 vColour; varying vec3 vNormal;
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
    attribute vec3 aPosition; attribute vec3 aColour;
    uniform mat4 uView, uProjection, uModel; uniform vec2 uMirror, uCentre;
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
    precision highp float; varying vec3 vColour; varying vec3 vNormal;
    ${colourFunction}
    void main() {
      vec3 normal = gl_FrontFacing ? normalize(vNormal) : -normalize(vNormal);
      vec3 key = normalize(vec3(-0.36, 0.80, 0.47));
      vec3 fill = normalize(vec3(0.68, 0.24, 0.63));
      float shade = 0.48 + max(dot(normal, key), 0.0) * 0.30 + max(dot(normal, fill), 0.0) * 0.09 + max(normal.y, 0.0) * 0.07;
      gl_FragColor = vec4(displayColour(clamp(vColour * shade, 0.0, 1.0)), 1.0);
    }
  `;

  const ridgeFragment = `
    precision highp float; varying vec3 vColour;
    ${colourFunction}
    void main() { gl_FragColor = vec4(displayColour(clamp(vColour, 0.0, 1.0)), 1.0); }
  `;

  const buffer = (gl, data) => {
    const handle = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, handle);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return handle;
  };

  const upload = (gl, layer) => ({
    position: buffer(gl, layer.positions),
    colour: buffer(gl, layer.colours),
    normal: layer.normals ? buffer(gl, layer.normals) : null,
    count: layer.count
  });

  const identity = () => new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);

  const modelMatrix = object => {
    const [px, py, pz] = object.position || [0, 0, 0];
    const [rx, ry, rz] = object.rotation || [0, 0, 0];
    const [sx, sy, sz] = object.scale || [1, 1, 1];
    const cx = Math.cos(rx), sxr = Math.sin(rx), cy = Math.cos(ry), syr = Math.sin(ry), cz = Math.cos(rz), szr = Math.sin(rz);
    return new Float32Array([
      (cy*cz)*sx, (sxr*syr*cz+cx*szr)*sx, (-cx*syr*cz+sxr*szr)*sx, 0,
      (-cy*szr)*sy, (-sxr*syr*szr+cx*cz)*sy, (cx*syr*szr+sxr*cz)*sy, 0,
      syr*sz, (-sxr*cy)*sz, (cx*cy)*sz, 0,
      px, py, pz, 1
    ]);
  };

  const perspective = (fov, aspect, near, far) => {
    const f = 1 / Math.tan(fov / 2), range = 1 / (near - far);
    return new Float32Array([f/aspect,0,0,0, 0,f,0,0, 0,0,(far+near)*range,-1, 0,0,2*far*near*range,0]);
  };

  const lookAt = (eye, target) => {
    let zx=eye[0]-target[0], zy=eye[1]-target[1], zz=eye[2]-target[2];
    let length=Math.hypot(zx,zy,zz)||1; zx/=length; zy/=length; zz/=length;
    let xx=zz, xz=-zx; length=Math.hypot(xx,xz)||1; xx/=length; xz/=length;
    const yx=zy*xz, yy=zz*xx-zx*xz, yz=-zy*xx;
    return new Float32Array([
      xx,yx,zx,0, 0,yy,zy,0, xz,yz,zz,0,
      -(xx*eye[0]+xz*eye[2]), -(yx*eye[0]+yy*eye[1]+yz*eye[2]), -(zx*eye[0]+zy*eye[1]+zz*eye[2]), 1
    ]);
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

    const gl = canvas.getContext("webgl", { alpha:false, antialias:true, depth:true, powerPreference:"high-performance" });
    if (!gl) throw new Error("WebGL is required for the 3D RF graph");

    const shellProgram = program(gl, shellVertex, shellFragment, true);
    const ridgeProgram = program(gl, ridgeVertex, ridgeFragment, false);
    const objects = scene.objects.map(object => {
      const asset = assets.get(object.asset);
      if (!asset) throw new Error(`3D asset not loaded: ${object.asset}`);
      const shellPalette = linearPalette(asset.palettes.shell);
      const ridgePalette = linearPalette(asset.palettes.ridge);
      const layers = {};
      if (asset.layers.shell) layers.shell = upload(gl, expand(asset.layers.shell, shellPalette));
      if (asset.layers.ridge) layers.ridge = upload(gl, expand(asset.layers.ridge, ridgePalette));
      if (asset.layers.platform) layers.platform = upload(gl, expand(asset.layers.platform, shellPalette));
      return { definition: object, asset, layers, model: modelMatrix(object) };
    });

    const state = { angle:0, velocity:0, dragging:false, pointer:null, x:0, frame:0, dirty:true, destroyed:false, width:0, height:0 };
    const view = scene.camera || objects[0]?.asset.view;
    const background = scene.background || "#01090e";
    const rgb = background.match(/[0-9a-f]{2}/gi)?.map(value => parseInt(value,16)/255) || [1/255,9/255,14/255];

    const bind = (shaderProgram, layer) => {
      gl.useProgram(shaderProgram.handle);
      gl.bindBuffer(gl.ARRAY_BUFFER, layer.position);
      gl.enableVertexAttribArray(shaderProgram.position);
      gl.vertexAttribPointer(shaderProgram.position,3,gl.FLOAT,false,0,0);
      gl.bindBuffer(gl.ARRAY_BUFFER, layer.colour);
      gl.enableVertexAttribArray(shaderProgram.colour);
      gl.vertexAttribPointer(shaderProgram.colour,3,gl.FLOAT,false,0,0);
      if (shaderProgram.normal >= 0 && layer.normal) {
        gl.bindBuffer(gl.ARRAY_BUFFER, layer.normal);
        gl.enableVertexAttribArray(shaderProgram.normal);
        gl.vertexAttribPointer(shaderProgram.normal,3,gl.FLOAT,false,0,0);
      }
    };

    const draw = (shaderProgram, layer, object, mirror) => {
      bind(shaderProgram, layer);
      gl.uniformMatrix4fv(shaderProgram.view,false,state.viewMatrix);
      gl.uniformMatrix4fv(shaderProgram.projection,false,state.projectionMatrix);
      gl.uniformMatrix4fv(shaderProgram.model,false,object.model);
      gl.uniform2f(shaderProgram.mirror,mirror[0],mirror[1]);
      const centre = object.asset.centre || [0,0];
      gl.uniform2f(shaderProgram.centre,centre[0],centre[1]);
      gl.drawArrays(gl.TRIANGLES,0,layer.count);
    };

    const resize = () => {
      const box = root.getBoundingClientRect();
      const mobile = matchMedia("(max-width:760px)").matches;
      const moving = state.dragging || Math.abs(state.velocity) > 0.01;
      const maxRatio = mobile ? (moving ? 1.0 : 1.35) : (moving ? 1.35 : 1.7);
      const ratio = Math.min(devicePixelRatio || 1, maxRatio);
      const width = Math.max(1, Math.round(box.width * ratio));
      const height = Math.max(1, Math.round(box.height * ratio));
      if (width === state.width && height === state.height) return false;
      state.width = canvas.width = width; state.height = canvas.height = height;
      return true;
    };

    const render = () => {
      resize();
      const aspect = state.width / Math.max(1,state.height);
      const fov = (view.fov || 44) * Math.PI / 180;
      const size = view.size;
      const target = view.target;
      const horizontal = 2*Math.atan(Math.tan(fov/2)*Math.max(aspect,.35));
      const radius = Math.hypot(...size)*.5;
      const distance = Math.max(radius*1.10,Math.max(size[0],size[2])/(2*Math.tan(Math.max(horizontal,.18)/2))*1.23,size[1]/(2*Math.tan(Math.max(fov,.18)/2))*1.34);
      const angle = state.angle * Math.PI / 180;
      const eye = [target[0]+Math.sin(angle)*distance,target[1]+(view.lift||0),target[2]+Math.cos(angle)*distance];
      state.viewMatrix = lookAt(eye,target);
      state.projectionMatrix = perspective(fov,aspect,.1,180);

      gl.viewport(0,0,state.width,state.height);
      gl.clearColor(rgb[0],rgb[1],rgb[2],1);
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.disable(gl.CULL_FACE); gl.disable(gl.BLEND); gl.depthMask(true);

      for (const object of objects) {
        const mirrors = object.asset.mirror ? [[1,1],[-1,1],[1,-1],[-1,-1]] : [[1,1]];
        for (const mirror of mirrors) {
          if (object.layers.shell) draw(shellProgram,object.layers.shell,object,mirror);
        }
        if (object.layers.platform) draw(shellProgram,object.layers.platform,object,[1,1]);
        gl.depthMask(false); gl.enable(gl.POLYGON_OFFSET_FILL); gl.polygonOffset(-1,-1);
        for (const mirror of mirrors) {
          if (object.layers.ridge) draw(ridgeProgram,object.layers.ridge,object,mirror);
        }
        gl.disable(gl.POLYGON_OFFSET_FILL); gl.depthMask(true);
      }
      root.dataset.rfBuilder3Ready = "true";
      root.dataset.rfScene = scene.id || "scene";
      document.dispatchEvent(new CustomEvent("fieldops3dready", { detail:{ scene:scene.id, root } }));
    };

    const schedule = () => {
      state.dirty = true;
      if (!state.frame) state.frame = requestAnimationFrame(tick);
    };
    const tick = () => {
      state.frame = 0;
      if (state.destroyed) return;
      if (!state.dragging && Math.abs(state.velocity) > .001) { state.angle += state.velocity; state.velocity *= .92; state.dirty = true; }
      if (state.dirty) { render(); state.dirty = false; }
      if (state.dragging || Math.abs(state.velocity) > .001) state.frame = requestAnimationFrame(tick);
    };

    const down = event => { state.dragging=true; state.pointer=event.pointerId; state.x=event.clientX; state.velocity=0; canvas.setPointerCapture?.(event.pointerId); canvas.style.cursor="grabbing"; schedule(); };
    const move = event => { if (!state.dragging || event.pointerId!==state.pointer) return; const delta=event.clientX-state.x; state.x=event.clientX; state.angle+=delta*.34; state.velocity=delta*.05; schedule(); };
    const up = event => { if (event.pointerId!==state.pointer) return; state.dragging=false; state.pointer=null; canvas.style.cursor="grab"; schedule(); };
    const key = event => { if (!['ArrowLeft','ArrowRight'].includes(event.key)) return; state.angle += event.key==='ArrowLeft'?-8:8; state.velocity=0; schedule(); event.preventDefault(); };
    const reset = () => { state.angle=0; state.velocity=0; schedule(); };
    canvas.addEventListener('pointerdown',down); canvas.addEventListener('pointermove',move); canvas.addEventListener('pointerup',up); canvas.addEventListener('pointercancel',up); canvas.addEventListener('keydown',key); canvas.addEventListener('dblclick',reset);
    const observer = new ResizeObserver(schedule); observer.observe(root);
    const lost = event => { event.preventDefault(); root.dataset.rfBuilder3Ready='false'; };
    const restored = () => location.reload();
    canvas.addEventListener('webglcontextlost',lost); canvas.addEventListener('webglcontextrestored',restored);

    const api = { VERSION, scene:scene.id, render:schedule, destroy() {
      if (state.destroyed) return; state.destroyed=true; if (state.frame) cancelAnimationFrame(state.frame); observer.disconnect();
      canvas.removeEventListener('pointerdown',down); canvas.removeEventListener('pointermove',move); canvas.removeEventListener('pointerup',up); canvas.removeEventListener('pointercancel',up); canvas.removeEventListener('keydown',key); canvas.removeEventListener('dblclick',reset);
      canvas.removeEventListener('webglcontextlost',lost); canvas.removeEventListener('webglcontextrestored',restored);
      for (const object of objects) for (const layer of Object.values(object.layers)) [layer.position,layer.colour,layer.normal].forEach(handle=>handle&&gl.deleteBuffer(handle));
      gl.deleteProgram(shellProgram.handle); gl.deleteProgram(ridgeProgram.handle); root.replaceChildren(); delete root.dataset.rfBuilder3Ready; delete root.dataset.rfScene; instances.delete(root);
    }};
    instances.set(root,api); schedule(); return api;
  }

  globalThis.FieldOps3DRenderer = { VERSION, create, assets:registry };
})();

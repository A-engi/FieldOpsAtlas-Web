/* FieldOps Atlas — legacy mountain source adapter
 * Version: 1.0.0-scene-source-adapter
 * Reads the existing standalone mountain files as text, extracts their packed
 * geometry without running their canvases, removes their old platform layer,
 * and registers them with FieldOps3DRenderer.
 */
(() => {
  "use strict";

  const VERSION = "1.0.0-scene-source-adapter";
  const sourceCache = new Map();
  const assetCache = new Map();
  const DEFAULT_CENTRE = [0.131281376, -0.0197811127];

  const fakeDocument = Object.freeze({
    readyState: "complete",
    querySelectorAll: () => [],
    querySelector: () => null,
    addEventListener: () => {},
    removeEventListener: () => {},
    createElement: () => {
      throw new Error("Mountain source attempted to create a canvas during extraction");
    }
  });

  const fakeConsole = Object.freeze({
    log: () => {},
    warn: () => {},
    error: () => {}
  });

  function injectCapture(source, format) {
    const capture = format === "full"
      ? ";globalThis.__fieldopsCapture={data:w,palettes:C,view:B};"
      : ";globalThis.__fieldopsCapture={data:P,palettes:L,centre:C,view:W};";

    const replaced = source.replace(/\}\)\(\);?\s*$/, `${capture}})();`);
    if (replaced === source) throw new Error("Mountain source ending was not recognised");
    return replaced;
  }

  function evaluateSource(source, format) {
    const sandbox = {
      __fieldopsCapture: null,
      FieldOpsRFBuilder3: null,
      FieldOps3DAssetQueue: [],
      document: fakeDocument,
      console: fakeConsole
    };
    sandbox.globalThis = sandbox;
    sandbox.window = sandbox;

    const execute = new Function(
      "globalThis",
      "window",
      "document",
      "console",
      "Float32Array",
      "Uint8Array",
      "Uint16Array",
      "Uint32Array",
      "Int32Array",
      "Array",
      "Object",
      "String",
      "Number",
      "Boolean",
      "Math",
      injectCapture(source, format)
    );

    execute(
      sandbox,
      sandbox,
      fakeDocument,
      fakeConsole,
      Float32Array,
      Uint8Array,
      Uint16Array,
      Uint32Array,
      Int32Array,
      Array,
      Object,
      String,
      Number,
      Boolean,
      Math
    );

    if (!sandbox.__fieldopsCapture?.data) {
      throw new Error(`No ${format} mountain geometry was captured`);
    }
    return sandbox.__fieldopsCapture;
  }

  const normaliseFullLayer = layer => {
    if (!layer) return null;
    return {
      format: layer.format,
      v: layer.vertices,
      f: layer.faces,
      b: layer.colourBits,
      n: layer.normals ? 1 : 0,
      p: layer.position,
      i: layer.index,
      c: layer.colour
    };
  };

  const normaliseCompressedLayer = layer => {
    if (!layer) return null;
    return {
      format: layer.format || "q16d",
      v: layer.v,
      f: layer.f,
      b: layer.b,
      n: layer.n ? 1 : 0,
      o: layer.o,
      s: layer.s,
      p: layer.p,
      i: layer.i,
      c: layer.c
    };
  };

  function buildAsset(capture, format, includePlatform) {
    const map = format === "full" ? normaliseFullLayer : normaliseCompressedLayer;
    const layers = {
      shell: map(capture.data.shell),
      ridge: map(capture.data.ridge)
    };

    if (includePlatform && capture.data.platform) {
      layers.platform = map(capture.data.platform);
    }

    return {
      centre: capture.centre || DEFAULT_CENTRE,
      mirror: true,
      view: capture.view,
      palettes: {
        shell: capture.palettes.shell,
        ridge: capture.palettes.ridge
      },
      layers
    };
  }

  async function readSource(url) {
    const absolute = new URL(url, location.href).href;
    if (!sourceCache.has(absolute)) {
      sourceCache.set(absolute, fetch(absolute, { cache: "force-cache" }).then(response => {
        if (!response.ok) throw new Error(`Unable to fetch ${url}: ${response.status}`);
        return response.text();
      }));
    }
    return sourceCache.get(absolute);
  }

  async function load(options) {
    const {
      assetId,
      file,
      format,
      includePlatform = false
    } = options || {};

    if (!assetId || !file || !["full", "compressed"].includes(format)) {
      throw new TypeError("assetId, file and full/compressed format are required");
    }

    if (globalThis.FieldOps3DAssets?.has?.(assetId)) {
      return globalThis.FieldOps3DAssets.get(assetId);
    }

    if (!assetCache.has(assetId)) {
      assetCache.set(assetId, (async () => {
        if (!globalThis.FieldOps3DAssets?.register) {
          throw new Error("FieldOps3DRenderer must load before mountain-source-adapter.js");
        }
        const source = await readSource(file);
        const capture = evaluateSource(source, format);
        const asset = buildAsset(capture, format, includePlatform);
        globalThis.FieldOps3DAssets.register(assetId, asset);
        return asset;
      })());
    }

    return assetCache.get(assetId);
  }

  globalThis.FieldOpsMountainSource = Object.freeze({
    VERSION,
    load
  });
})();

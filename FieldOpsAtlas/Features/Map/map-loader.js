/*
  FieldOps Atlas
  File: FieldOpsAtlas/Features/Map/map-loader.js
  Version: 1.1.14-map-runtime-only

  Purpose:
  Load Map runtime scripts in a fixed order.

  Ownership:
  - Map index.html loads root shell.css and shell.js directly, matching RF.
  - This loader does not load or style shared shell chrome.
  - This loader does not load FieldOpsAtlas/Features/Map/shell.css.
  - Weather panels, walk markers, regions, and map state stay in map-app.js/map-ui.js.
  - This file does not edit data or region JSON.
*/

(function loadFieldOpsMapRuntime() {
  "use strict";

  var version = "1.1.14-map-runtime-only";
  var mapPath = "./";

  function withVersion(url) {
    return url + (url.indexOf("?") === -1 ? "?v=" : "&v=") + encodeURIComponent(version);
  }

  function hasAsset(tagName, attribute, value) {
    var nodes = document.getElementsByTagName(tagName);

    for (var index = 0; index < nodes.length; index += 1) {
      var current = nodes[index].getAttribute(attribute) || "";

      if (current.indexOf(value) !== -1) {
        return true;
      }
    }

    return false;
  }

  function loadScript(url) {
    return new Promise(function resolveScript(done) {
      if (hasAsset("script", "src", url)) {
        done();
        return;
      }

      var script = document.createElement("script");
      script.src = withVersion(url);
      script.defer = false;
      script.onload = done;
      script.onerror = done;
      document.body.appendChild(script);
    });
  }

  function installLeafletBridge() {
    window.FieldOpsAtlasBridge = window.FieldOpsAtlasBridge || {};

    if (!window.L || !window.L.map || window.L.__fieldOpsAtlasCapturedMap) {
      return;
    }

    window.L.__fieldOpsAtlasCapturedMap = true;
    window.FieldOpsAtlasBridge.originalMapFactory = window.L.map;

    window.L.map = function captureFieldOpsMap() {
      var map = window.FieldOpsAtlasBridge.originalMapFactory.apply(this, arguments);
      window.FieldOpsAtlasBridge.map = map;
      return map;
    };
  }

  Promise.resolve()
    .then(function loadLeaflet() {
      return loadScript("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js");
    })
    .then(function bridgeLeaflet() {
      installLeafletBridge();
    })
    .then(function loadMapGuard() {
      return loadScript(mapPath + "map-shell-guard.js");
    })
    .then(function loadMapApp() {
      return loadScript(mapPath + "map-app.js");
    })
    .then(function loadMapUi() {
      return loadScript(mapPath + "map-ui.js");
    });
}());

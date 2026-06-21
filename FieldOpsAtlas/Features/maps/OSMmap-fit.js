/* ==========================================================================
   FieldOps Atlas centred map fitting
   File: FieldOpsAtlas/Features/maps/OSMmap-fit.js
   Version: 1.0.1-visible-centre
   Purpose:
   - Fit currently visible sites and selected cluster endpoints, not stale hidden sites.
   - Centre fitted content inside the usable map area between the top and bottom UI.
   - Keep existing caller max-zoom and animation choices.
   - Refit once after cluster rendering has settled.
   ========================================================================== */

(function fieldOpsOSMMapFit() {
  "use strict";

  var VERSION = "1.0.1-visible-centre";
  var BASE_PADDING = 22;
  var UI_GAP = 14;
  var MAX_TOP_RATIO = 0.46;
  var MAX_BOTTOM_RATIO = 0.42;
  var refitTimer = 0;
  var originalFitBounds = null;

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function visibleElement(element) {
    if (!element || element.hidden) {
      return false;
    }

    var style = window.getComputedStyle ? window.getComputedStyle(element) : null;
    var rect = element.getBoundingClientRect();

    return (!style || (style.display !== "none" && style.visibility !== "hidden")) &&
      rect.width > 0 &&
      rect.height > 0;
  }

  function overlapsHorizontally(first, second) {
    return first.right > second.left && first.left < second.right;
  }

  function topInsetFor(mapRect, selector) {
    var inset = 0;

    Array.prototype.slice.call(document.querySelectorAll(selector)).forEach(function inspect(element) {
      if (!visibleElement(element)) {
        return;
      }

      var rect = element.getBoundingClientRect();

      if (!overlapsHorizontally(mapRect, rect)) {
        return;
      }

      if (rect.bottom <= mapRect.top || rect.top >= mapRect.bottom) {
        return;
      }

      if (rect.top <= mapRect.top + mapRect.height * 0.55) {
        inset = Math.max(inset, rect.bottom - mapRect.top + UI_GAP);
      }
    });

    return inset;
  }

  function bottomInsetFor(mapRect, selector) {
    var inset = 0;

    Array.prototype.slice.call(document.querySelectorAll(selector)).forEach(function inspect(element) {
      if (!visibleElement(element)) {
        return;
      }

      var rect = element.getBoundingClientRect();

      if (!overlapsHorizontally(mapRect, rect)) {
        return;
      }

      if (rect.bottom <= mapRect.top || rect.top >= mapRect.bottom) {
        return;
      }

      if (rect.bottom >= mapRect.bottom - mapRect.height * 0.55) {
        inset = Math.max(inset, mapRect.bottom - rect.top + UI_GAP);
      }
    });

    return inset;
  }

  function mapPadding(map) {
    var container = map && typeof map.getContainer === "function"
      ? map.getContainer()
      : null;

    if (!container) {
      return {
        left: BASE_PADDING,
        top: BASE_PADDING,
        right: BASE_PADDING,
        bottom: BASE_PADDING
      };
    }

    var mapRect = container.getBoundingClientRect();
    var top = Math.max(
      BASE_PADDING,
      topInsetFor(mapRect, ".top-shell"),
      topInsetFor(mapRect, "[data-map-quick-tools]")
    );
    var bottom = Math.max(
      BASE_PADDING,
      bottomInsetFor(mapRect, ".bottom-shell"),
      bottomInsetFor(mapRect, "[data-selected-panel]:not([hidden])")
    );

    return {
      left: BASE_PADDING,
      top: clamp(top, BASE_PADDING, mapRect.height * MAX_TOP_RATIO),
      right: BASE_PADDING,
      bottom: clamp(bottom, BASE_PADDING, mapRect.height * MAX_BOTTOM_RATIO)
    };
  }

  function collectLayerLatLng(layer, map, result, seen) {
    if (!layer || seen.has(layer)) {
      return;
    }

    seen.add(layer);

    if (
      layer !== map &&
      typeof layer.getLatLng === "function" &&
      layer._map === map
    ) {
      var options = layer.options || {};
      var pane = String(options.pane || "");
      var isSite = Boolean(options.title);
      var isRfEndpoint = pane === "fieldopsRfEndpoints";

      if (isSite || isRfEndpoint) {
        var latlng = layer.getLatLng();

        if (
          latlng &&
          Number.isFinite(Number(latlng.lat)) &&
          Number.isFinite(Number(latlng.lng))
        ) {
          result.push(latlng);
        }
      }
    }

    if (layer !== map && typeof layer.eachLayer === "function") {
      layer.eachLayer(function inspectChild(child) {
        collectLayerLatLng(child, map, result, seen);
      });
    }
  }

  function visibleMapLatLngs(map) {
    var result = [];
    var seen = new Set();

    if (!map || typeof map.eachLayer !== "function") {
      return result;
    }

    map.eachLayer(function inspectLayer(layer) {
      collectLayerLatLng(layer, map, result, seen);
    });

    return result;
  }

  function visibleBounds(map, fallbackBounds) {
    var points = visibleMapLatLngs(map);

    if (points.length && window.L && typeof window.L.latLngBounds === "function") {
      return window.L.latLngBounds(points);
    }

    return fallbackBounds;
  }

  function fittedOptions(map, options) {
    var padding = mapPadding(map);
    var nextOptions = Object.assign({}, options || {});

    delete nextOptions.padding;

    nextOptions.paddingTopLeft = window.L.point(
      padding.left,
      padding.top
    );
    nextOptions.paddingBottomRight = window.L.point(
      padding.right,
      padding.bottom
    );

    return nextOptions;
  }

  function isAtlasMap(map) {
    var container = map && typeof map.getContainer === "function"
      ? map.getContainer()
      : null;

    return Boolean(container && container.id === "OSMmaps");
  }

  function refitVisibleMap() {
    var map = window.FieldOpsAtlasLeafletMap;
    var points;
    var bounds;

    if (
      !map ||
      !originalFitBounds ||
      !window.L ||
      typeof window.L.latLngBounds !== "function"
    ) {
      return;
    }

    points = visibleMapLatLngs(map);

    if (!points.length) {
      return;
    }

    bounds = window.L.latLngBounds(points);

    map.stop();
    map.invalidateSize({
      pan: false,
      debounceMoveend: true
    });

    originalFitBounds.call(map, bounds, fittedOptions(map, {
      animate: false,
      maxZoom: points.length > 1 ? 11 : 12
    }));
  }

  function scheduleRefit() {
    if (refitTimer) {
      window.clearTimeout(refitTimer);
    }

    refitTimer = window.setTimeout(function settledRefit() {
      refitTimer = 0;

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(function firstFrame() {
          window.requestAnimationFrame(refitVisibleMap);
        });
      } else {
        refitVisibleMap();
      }
    }, 80);
  }

  function patchLeafletFitBounds() {
    if (!window.L || !window.L.Map || !window.L.Map.prototype) {
      return;
    }

    if (window.L.Map.prototype.fitBounds.__fieldOpsCentredFit === VERSION) {
      return;
    }

    originalFitBounds = window.L.Map.prototype.fitBounds;

    window.L.Map.prototype.fitBounds = function fieldOpsCentredFit(bounds, options) {
      if (!isAtlasMap(this)) {
        return originalFitBounds.call(this, bounds, options);
      }

      return originalFitBounds.call(
        this,
        visibleBounds(this, bounds),
        fittedOptions(this, options)
      );
    };

    window.L.Map.prototype.fitBounds.__fieldOpsCentredFit = VERSION;
  }

  patchLeafletFitBounds();

  window.addEventListener(
    "fieldops:map-service-cluster-selected",
    scheduleRefit
  );

  window.FieldOpsOSMMapFit = {
    VERSION: VERSION,
    version: VERSION,
    fitVisible: refitVisibleMap,
    schedule: scheduleRefit
  };
}());

/* Destination: FieldOpsAtlas/Features/maps/OSMmap-fit.js */
/* End of file: FieldOpsAtlas/Features/maps/OSMmap-fit.js | bottom/end of file */

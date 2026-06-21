/* ==========================================================================
   FieldOps Atlas RF path fan renderer
   File: FieldOpsAtlas/Features/maps/OSMrf-paths.js
   Version: 1.0.2-bearing-split
   Purpose:
   - Keep RF path endpoints fixed.
   - Group paths by feeding endpoint.
   - Calculate the centre bearing between the outermost receiving sites.
   - Divide path departure bearings evenly across a symmetrical fan.
   - Show one abbreviated FROM → TO label for the selected path only.
   - Read site abbreviations from region site records when available.
   ========================================================================== */

(function fieldOpsOSMRfPaths() {
  "use strict";

  var VERSION = "1.0.2-bearing-split";
  var REFERENCE_ZOOM = 9;
  var CURVE_SEGMENTS = 28;
  var FAN_PADDING_DEGREES = 10;
  var MAX_FAN_HALF_SPREAD = 64;
  var LAYOUT_DELAY_MS = 0;
  var REGION_STORAGE_KEY = "fieldops-osmmaps-selected-region-v1";
  var REGION_SITES_URL = "../../../data/regions/";
  var REGIONS_URL = "../../../data/regions.json";

  var originalPolyline = window.L && window.L.polyline;
  var pathRecords = [];
  var selectedRecord = null;
  var selectedLabelLayer = null;
  var layoutTimer = 0;
  var endpointIndex = new Map();
  var endpointDataRequests = new Map();

  function coordinateKey(value) {
    var latlng = window.L.latLng(value);
    return latlng.lat.toFixed(5) + "," + latlng.lng.toFixed(5);
  }

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function replaceCharacter(character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[character];
    });
  }

  function tidyPathStyle(style) {
    var nextStyle = Object.assign({}, style || {});
    var weight = Number(nextStyle.weight);

    if (weight === 5) {
      nextStyle.weight = 4;
    } else if (weight >= 8) {
      nextStyle.weight = 7;
    }

    return nextStyle;
  }

  function isSelectedStyle(style) {
    return Number(style && style.weight) >= 8;
  }

  function activeMap() {
    if (window.FieldOpsAtlasLeafletMap) {
      return window.FieldOpsAtlasLeafletMap;
    }

    var activeRecord = pathRecords.find(function findMappedRecord(record) {
      return record.line && record.line._map;
    });

    return activeRecord ? activeRecord.line._map : null;
  }

  function activeRecords(map) {
    pathRecords = pathRecords.filter(function keepRecord(record) {
      return record &&
        record.line &&
        record.line._map &&
        (!map || !map.hasLayer || map.hasLayer(record.line));
    });

    return pathRecords.slice();
  }

  function groupBySource(records) {
    var groups = new Map();

    records.forEach(function addRecord(record) {
      var key = coordinateKey(record.from);

      if (!groups.has(key)) {
        groups.set(key, []);
      }

      groups.get(key).push(record);
    });

    return Array.from(groups.values());
  }

  function toRadians(value) {
    return Number(value) * Math.PI / 180;
  }

  function toDegrees(value) {
    return Number(value) * 180 / Math.PI;
  }

  function normaliseBearing(value) {
    return (Number(value) % 360 + 360) % 360;
  }

  function signedBearingDifference(bearing, centreBearing) {
    return ((Number(bearing) - Number(centreBearing) + 540) % 360) - 180;
  }

  function bearingBetween(from, to) {
    var latitudeOne = toRadians(from.lat);
    var latitudeTwo = toRadians(to.lat);
    var deltaLongitude = toRadians(to.lng - from.lng);
    var y = Math.sin(deltaLongitude) * Math.cos(latitudeTwo);
    var x = Math.cos(latitudeOne) * Math.sin(latitudeTwo) -
      Math.sin(latitudeOne) * Math.cos(latitudeTwo) * Math.cos(deltaLongitude);

    return normaliseBearing(toDegrees(Math.atan2(y, x)));
  }

  function circularMeanBearing(bearings) {
    var x = 0;
    var y = 0;

    bearings.forEach(function addBearing(bearing) {
      var radians = toRadians(bearing);
      x += Math.sin(radians);
      y += Math.cos(radians);
    });

    if (Math.abs(x) < 0.000001 && Math.abs(y) < 0.000001) {
      return Number(bearings[0] || 0);
    }

    return normaliseBearing(toDegrees(Math.atan2(x, y)));
  }

  function minimumFanHalfSpread(pathCount) {
    if (pathCount <= 1) {
      return 0;
    }

    if (pathCount === 2) {
      return 16;
    }

    if (pathCount <= 4) {
      return 24;
    }

    return 30;
  }

  function bearingFan(group) {
    var bearings = group.map(function pathBearing(record) {
      return bearingBetween(record.from, record.to);
    });
    var anchorBearing = circularMeanBearing(bearings);
    var anchoredDifferences = bearings.map(function anchoredDifference(bearing) {
      return signedBearingDifference(bearing, anchorBearing);
    });
    var minimumDifference = Math.min.apply(Math, anchoredDifferences);
    var maximumDifference = Math.max.apply(Math, anchoredDifferences);
    var centreBearing = normaliseBearing(
      anchorBearing + (minimumDifference + maximumDifference) / 2
    );
    var entries = group.map(function fanEntry(record, index) {
      var bearing = bearings[index];

      return {
        record: record,
        bearing: bearing,
        difference: signedBearingDifference(bearing, centreBearing)
      };
    }).sort(function sortByBearing(left, right) {
      return left.difference - right.difference;
    });
    var actualHalfSpread = entries.reduce(function largestDifference(largest, entry) {
      return Math.max(largest, Math.abs(entry.difference));
    }, 0);
    var minimumHalfSpread = minimumFanHalfSpread(entries.length);
    var visualHalfSpread = entries.length <= 1
      ? 0
      : clamp(
          Math.max(actualHalfSpread + FAN_PADDING_DEGREES, minimumHalfSpread),
          minimumHalfSpread,
          MAX_FAN_HALF_SPREAD
        );

    return {
      centreBearing: centreBearing,
      halfSpread: visualHalfSpread,
      entries: entries
    };
  }

  function pointAlongBearing(startPoint, bearing, distance) {
    var radians = toRadians(bearing);

    return window.L.point(
      startPoint.x + Math.sin(radians) * distance,
      startPoint.y - Math.cos(radians) * distance
    );
  }

  function cubicPoint(start, controlOne, controlTwo, end, position) {
    var inverse = 1 - position;

    return window.L.point(
      inverse * inverse * inverse * start.x +
        3 * inverse * inverse * position * controlOne.x +
        3 * inverse * position * position * controlTwo.x +
        position * position * position * end.x,
      inverse * inverse * inverse * start.y +
        3 * inverse * inverse * position * controlOne.y +
        3 * inverse * position * position * controlTwo.y +
        position * position * position * end.y
    );
  }

  function curvedLatLngs(map, record, guideBearing) {
    var start = map.project(record.from, REFERENCE_ZOOM);
    var end = map.project(record.to, REFERENCE_ZOOM);
    var dx = end.x - start.x;
    var dy = end.y - start.y;
    var length = Math.sqrt(dx * dx + dy * dy) || 1;
    var departureDistance = Math.min(
      length * 0.46,
      clamp(length * 0.40, 34, 190)
    );
    var approachDistance = Math.min(
      length * 0.32,
      clamp(length * 0.24, 24, 120)
    );
    var controlOne = pointAlongBearing(start, guideBearing, departureDistance);
    var controlTwo = window.L.point(
      end.x - (dx / length) * approachDistance,
      end.y - (dy / length) * approachDistance
    );
    var points = [];
    var index;

    for (index = 0; index <= CURVE_SEGMENTS; index += 1) {
      points.push(
        map.unproject(
          cubicPoint(start, controlOne, controlTwo, end, index / CURVE_SEGMENTS),
          REFERENCE_ZOOM
        )
      );
    }

    points[0] = record.from;
    points[points.length - 1] = record.to;
    return points;
  }

  function layoutGroup(map, group) {
    if (!group.length) {
      return;
    }

    var fan = bearingFan(group);
    var lastIndex = fan.entries.length - 1;

    fan.entries.forEach(function layoutRecord(entry, index) {
      var ratio = lastIndex > 0 ? index / lastIndex : 0.5;
      var guideBearing = normaliseBearing(
        fan.centreBearing - fan.halfSpread + ratio * fan.halfSpread * 2
      );

      entry.record.actualBearing = entry.bearing;
      entry.record.guideBearing = guideBearing;
      entry.record.fanCentreBearing = fan.centreBearing;
      entry.record.line.setLatLngs(
        curvedLatLngs(map, entry.record, guideBearing)
      );
      entry.record.line.options.fieldOpsActualBearing = entry.bearing;
      entry.record.line.options.fieldOpsGuideBearing = guideBearing;
      entry.record.line.options.fieldOpsFanCentreBearing = fan.centreBearing;
      entry.record.line.options.fieldOpsCurveVersion = VERSION;
    });
  }

  function layoutPaths() {
    var map = activeMap();

    if (!map || typeof map.project !== "function" || typeof map.unproject !== "function") {
      return;
    }

    groupBySource(activeRecords(map)).forEach(function layoutFan(group) {
      layoutGroup(map, group);
    });

    if (selectedRecord) {
      renderSelectedLabel(false);
    }
  }

  function scheduleLayout() {
    if (layoutTimer) {
      window.clearTimeout(layoutTimer);
    }

    layoutTimer = window.setTimeout(function runLayout() {
      layoutTimer = 0;
      layoutPaths();
    }, LAYOUT_DELAY_MS);
  }

  function deriveAbbreviation(value) {
    var words = String(value || "")
      .replace(/[^A-Za-z0-9 ]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (!words.length) {
      return "SITE";
    }

    if (words.length === 1) {
      return words[0].slice(0, 4).toUpperCase();
    }

    return words
      .slice(0, 4)
      .map(function firstCharacter(word) {
        return word.charAt(0);
      })
      .join("")
      .toUpperCase();
  }

  function endpointAbbreviation(endpoint) {
    var explicit = endpoint && (
      endpoint.abbreviation ||
      endpoint.abbr ||
      endpoint.shortName ||
      endpoint.shortCode ||
      endpoint.siteCode ||
      endpoint.code
    );

    return String(explicit || "").trim().toUpperCase() ||
      deriveAbbreviation(endpoint && (endpoint.name || endpoint.label || endpoint.id));
  }

  function addEndpointRecord(endpoint) {
    if (!endpoint || !Number.isFinite(Number(endpoint.lat)) || !Number.isFinite(Number(endpoint.lng))) {
      return;
    }

    endpointIndex.set(coordinateKey([Number(endpoint.lat), Number(endpoint.lng)]), endpoint);
  }

  function indexLoadedWalks() {
    var mapApi = window.FieldOpsOSMmaps;
    var walks = mapApi && typeof mapApi.getWalks === "function"
      ? mapApi.getWalks()
      : [];

    walks.forEach(addEndpointRecord);
  }

  function selectedRegionId() {
    var mapApi = window.FieldOpsOSMmaps;
    var walks = mapApi && typeof mapApi.getWalks === "function"
      ? mapApi.getWalks()
      : [];

    if (walks.length && walks[0].regionId) {
      return String(walks[0].regionId);
    }

    try {
      return String(window.localStorage.getItem(REGION_STORAGE_KEY) || "");
    } catch (error) {
      return "";
    }
  }

  function loadJson(url) {
    return fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json"
      }
    }).then(function readResponse(response) {
      if (!response.ok) {
        throw new Error("Could not load " + url + ".");
      }

      return response.json();
    });
  }

  function indexVirtualEndpoints(regions, regionId) {
    var region = Array.isArray(regions)
      ? regions.find(function findRegion(item) {
          return item && String(item.id) === String(regionId);
        })
      : null;
    var serviceClusters = region && region.serviceClusters;

    if (!serviceClusters || typeof serviceClusters !== "object") {
      return;
    }

    Object.keys(serviceClusters).forEach(function indexService(serviceId) {
      var clusters = Array.isArray(serviceClusters[serviceId])
        ? serviceClusters[serviceId]
        : [];

      clusters.forEach(function indexCluster(cluster) {
        var paths = cluster && Array.isArray(cluster.paths) ? cluster.paths : [];

        paths.forEach(function indexPath(path) {
          addEndpointRecord(path && path.virtualFeeder);
          addEndpointRecord(path && path.virtualReceiver);
        });
      });
    });
  }

  function loadEndpointData() {
    var regionId = selectedRegionId();

    indexLoadedWalks();

    if (!regionId) {
      return Promise.resolve();
    }

    if (endpointDataRequests.has(regionId)) {
      return endpointDataRequests.get(regionId);
    }

    var request = Promise.allSettled([
      loadJson(REGION_SITES_URL + encodeURIComponent(regionId) + "-sites.json"),
      loadJson(REGIONS_URL)
    ]).then(function indexPayloads(results) {
      if (results[0].status === "fulfilled" && Array.isArray(results[0].value)) {
        results[0].value.forEach(addEndpointRecord);
      }

      if (results[1].status === "fulfilled") {
        indexVirtualEndpoints(results[1].value, regionId);
      }
    });

    endpointDataRequests.set(regionId, request);
    return request;
  }

  function endpointFor(latlng) {
    indexLoadedWalks();
    return endpointIndex.get(coordinateKey(latlng)) || {
      id: "external",
      name: "External",
      abbreviation: "EXT"
    };
  }

  function selectedLabelText(record) {
    return endpointAbbreviation(endpointFor(record.from)) +
      " → " +
      endpointAbbreviation(endpointFor(record.to));
  }

  function ensureLabelLayer(map) {
    var pane = map.getPane("fieldopsRfRouteLabels");

    if (!pane) {
      pane = map.createPane("fieldopsRfRouteLabels");
      pane.style.zIndex = "655";
      pane.style.pointerEvents = "none";
    }

    if (!selectedLabelLayer) {
      selectedLabelLayer = window.L.layerGroup().addTo(map);
    }

    return selectedLabelLayer;
  }

  function labelAnchor(record) {
    var points = record.line.getLatLngs();
    var index = Math.max(0, Math.min(points.length - 1, Math.round((points.length - 1) * 0.52)));
    return points[index] || record.from;
  }

  function renderSelectedLabel(loadRawData) {
    var map = activeMap();

    if (!map || !selectedRecord || !selectedRecord.line || !selectedRecord.line._map) {
      if (selectedLabelLayer) {
        selectedLabelLayer.clearLayers();
      }
      return;
    }

    var layer = ensureLabelLayer(map);
    var label = selectedLabelText(selectedRecord);
    var width = clamp(label.length * 8 + 22, 74, 142);
    var icon = window.L.divIcon({
      className: "osmmaps-rf-route-label-icon",
      html: '<span class="osmmaps-rf-route-label">' + escapeHtml(label) + "</span>",
      iconSize: [width, 24],
      iconAnchor: [width / 2, 12]
    });

    layer.clearLayers();
    window.L.marker(labelAnchor(selectedRecord), {
      pane: "fieldopsRfRouteLabels",
      icon: icon,
      interactive: false,
      keyboard: false
    }).addTo(layer);

    if (loadRawData !== false) {
      loadEndpointData().then(function refreshLoadedLabel() {
        if (selectedRecord) {
          renderSelectedLabel(false);
        }
      });
    }
  }

  function selectRecord(record) {
    selectedRecord = record;
    renderSelectedLabel(true);
  }

  function deselectRecord(record) {
    if (selectedRecord !== record) {
      return;
    }

    selectedRecord = null;

    if (selectedLabelLayer) {
      selectedLabelLayer.clearLayers();
    }
  }

  function patchPolyline() {
    if (!window.L || typeof originalPolyline !== "function") {
      return;
    }

    if (window.L.polyline.__fieldOpsRfPathFan === VERSION) {
      return;
    }

    window.L.polyline = function fieldOpsRfPolyline(latlngs, options) {
      var isRfPath = options &&
        options.pane === "fieldopsRfPaths" &&
        Array.isArray(latlngs) &&
        latlngs.length === 2;

      if (!isRfPath) {
        return originalPolyline.call(this, latlngs, options);
      }

      var from = window.L.latLng(latlngs[0]);
      var to = window.L.latLng(latlngs[1]);
      var line = originalPolyline.call(this, [from, to], tidyPathStyle(options));
      var originalSetStyle = line.setStyle;
      var record = {
        line: line,
        from: from,
        to: to,
        actualBearing: 0,
        guideBearing: 0,
        fanCentreBearing: 0
      };

      pathRecords.push(record);

      line.setStyle = function setRfPathStyle(style) {
        var selected = isSelectedStyle(style);
        var result = originalSetStyle.call(this, tidyPathStyle(style));

        if (selected) {
          selectRecord(record);
        } else {
          deselectRecord(record);
        }

        return result;
      };

      line.on("add", scheduleLayout);
      line.on("remove", function removeRfPath() {
        deselectRecord(record);
        scheduleLayout();
      });

      return line;
    };

    window.L.polyline.__fieldOpsRfPathFan = VERSION;
  }

  patchPolyline();

  window.FieldOpsOSMRfPaths = {
    VERSION: VERSION,
    version: VERSION,
    layout: layoutPaths,
    refreshLabel: function refreshLabel() {
      renderSelectedLabel(true);
    }
  };
}());

/* Destination: FieldOpsAtlas/Features/maps/OSMrf-paths.js */
/* End of file: FieldOpsAtlas/Features/maps/OSMrf-paths.js | bottom/end of file */

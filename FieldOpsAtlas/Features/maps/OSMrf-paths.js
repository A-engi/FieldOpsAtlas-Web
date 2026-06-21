/* ==========================================================================
   FieldOps Atlas RF path fan renderer
   File: FieldOpsAtlas/Features/maps/OSMrf-paths.js
   Version: 1.0.7-density-aware-zoom
   Purpose:
   - Keep RF path endpoints fixed.
   - Render the bearing-ordered fan immediately.
   - Optionally detect conflicts in a fixed reference-zoom coordinate space.
   - Keep the original bearing layout unless a real crossing or severe overlap exists.
   - Apply small, capped repairs only to conflicting longer routes.
   - Recheck zoomed-in layouts only when paths are still visually crowded.
   - Leave already-clear layouts unchanged across zoom.
   - Keep the best conservative layout reached within a mobile time budget.
   - Allow the current optimisation run to be skipped.
   - Show one abbreviated FROM → TO label for the selected path only.
   - Read site abbreviations from region site records when available.
   ========================================================================== */

(function fieldOpsOSMRfPaths() {
  "use strict";

  var VERSION = "1.0.7-density-aware-zoom";
  var REFERENCE_ZOOM = 9;
  var CURVE_SEGMENTS = 38;
  var FAN_PADDING_DEGREES = 18;
  var MAX_FAN_HALF_SPREAD = 68;
  var BASE_GUIDE_DISTANCE_RATIO = 0.58;
  var MAX_GUIDE_DISTANCE = 360;
  var OUTWARD_BEARING_STEP = 3;
  var OUTWARD_DISTANCE_STEP = 18;
  var EXTRA_FAN_LIMIT = 10;
  var PATH_CLEARANCE_PX = 4;
  var ZOOM_CLEARANCE_PX = 7;
  var SOURCE_IGNORE_PX = 36;
  var DESTINATION_IGNORE_PX = 20;
  var MAX_REPAIR_STEPS = 14;
  var MAX_REPAIRS_PER_ROUTE = 2;
  var MAX_ADDITIONAL_BEARING = 10;
  var MAX_ADDITIONAL_DISTANCE = 72;
  var DENSE_GROUP_THRESHOLD = 14;
  var OPTIMISATION_BUDGET_MS = 650;
  var OPTIMISATION_OVERLAY_DELAY_MS = 150;
  var LAYOUT_DELAY_MS = 0;
  var ZOOM_LAYOUT_DELAY_MS = 120;
  var OPTIMISE_STORAGE_KEY = "fieldops.maps.optimise-path-layout-v1";
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
  var optimisationRunId = 0;
  var currentOptimisation = null;
  var optimiserOverlay = null;
  var optimiserNoteTimer = 0;
  var boundMap = null;
  var zoomLayoutTimer = 0;
  var lastMapZoom = null;

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

  function safeLocalGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function optimisationEnabled() {
    return safeLocalGet(OPTIMISE_STORAGE_KEY) !== "false";
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
      return 28;
    }

    if (pathCount === 3) {
      return 38;
    }

    if (pathCount === 4) {
      return 46;
    }

    return Math.min(64, 50 + (pathCount - 5) * 3);
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
      var bearingDifference = left.difference - right.difference;

      if (Math.abs(bearingDifference) > 0.0001) {
        return bearingDifference;
      }

      return String(left.record.stableKey || "").localeCompare(
        String(right.record.stableKey || "")
      );
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

  function projectedLength(map, record) {
    var start = map.project(record.from, REFERENCE_ZOOM);
    var end = map.project(record.to, REFERENCE_ZOOM);
    var dx = end.x - start.x;
    var dy = end.y - start.y;

    return Math.sqrt(dx * dx + dy * dy) || 1;
  }

  function fanSide(value) {
    if (Math.abs(value) < 0.001) {
      return 0;
    }

    return value < 0 ? -1 : 1;
  }

  function baseGuideDistance(routeLength) {
    var minimumDistance = Math.min(72, routeLength * 0.48);
    var maximumDistance = Math.min(MAX_GUIDE_DISTANCE, routeLength * 0.90);

    return clamp(
      routeLength * BASE_GUIDE_DISTANCE_RATIO,
      minimumDistance,
      maximumDistance
    );
  }

  function curvedLatLngs(map, record, guideBearing, guideDistance) {
    var start = map.project(record.from, REFERENCE_ZOOM);
    var end = map.project(record.to, REFERENCE_ZOOM);
    var controlOne = pointAlongBearing(
      start,
      guideBearing,
      guideDistance * 0.40
    );
    var controlTwo = pointAlongBearing(
      start,
      guideBearing,
      guideDistance
    );
    var points = [];
    var index;

    for (index = 0; index <= CURVE_SEGMENTS; index += 1) {
      points.push(
        map.unproject(
          cubicPoint(
            start,
            controlOne,
            controlTwo,
            end,
            index / CURVE_SEGMENTS
          ),
          REFERENCE_ZOOM
        )
      );
    }

    points[0] = record.from;
    points[points.length - 1] = record.to;
    return points;
  }

  function renderEntry(map, layout, entry) {
    entry.record.actualBearing = entry.bearing;
    entry.record.guideBearing = entry.guideBearing;
    entry.record.fanCentreBearing = layout.centreBearing;
    entry.record.guideDistance = entry.guideDistance;
    entry.record.baseGuideBearing = entry.baseGuideBearing;
    entry.record.baseGuideDistance = entry.baseGuideDistance;
    entry.record.repairCount = entry.repairCount || 0;
    entry.record.line.setLatLngs(
      curvedLatLngs(
        map,
        entry.record,
        entry.guideBearing,
        entry.guideDistance
      )
    );
    entry.record.line.options.fieldOpsActualBearing = entry.bearing;
    entry.record.line.options.fieldOpsGuideBearing = entry.guideBearing;
    entry.record.line.options.fieldOpsFanCentreBearing = layout.centreBearing;
    entry.record.line.options.fieldOpsFanHalfSpread = layout.halfSpread;
    entry.record.line.options.fieldOpsGuideDistance = entry.guideDistance;
    entry.record.line.options.fieldOpsCurveVersion = VERSION;
  }

  function createBasicLayout(map, group) {
    var fan = bearingFan(group);
    var lastIndex = fan.entries.length - 1;

    fan.entries.forEach(function prepareRoute(entry, index) {
      var ratio = lastIndex > 0 ? index / lastIndex : 0.5;

      entry.guideBearing = normaliseBearing(
        fan.centreBearing - fan.halfSpread + ratio * fan.halfSpread * 2
      );
      entry.guideDistance = baseGuideDistance(projectedLength(map, entry.record));
      entry.routeLength = projectedLength(map, entry.record);
      entry.baseGuideBearing = entry.guideBearing;
      entry.baseGuideDistance = entry.guideDistance;
      entry.repairCount = 0;
      entry.record.baseGuideBearing = entry.baseGuideBearing;
      entry.record.baseGuideDistance = entry.baseGuideDistance;
      entry.record.repairCount = 0;
      renderEntry(map, fan, entry);
    });

    return fan;
  }

  function createExistingLayout(map, group) {
    var fan = bearingFan(group);

    fan.entries.forEach(function preserveRoute(entry) {
      var routeLength = projectedLength(map, entry.record);
      var fallbackDistance = baseGuideDistance(routeLength);
      var fallbackBearing = entry.bearing;

      entry.routeLength = routeLength;
      entry.guideBearing = Number.isFinite(Number(entry.record.guideBearing))
        ? Number(entry.record.guideBearing)
        : fallbackBearing;
      entry.guideDistance = Number.isFinite(Number(entry.record.guideDistance))
        ? Number(entry.record.guideDistance)
        : fallbackDistance;
      entry.baseGuideBearing = Number.isFinite(Number(entry.record.baseGuideBearing))
        ? Number(entry.record.baseGuideBearing)
        : entry.guideBearing;
      entry.baseGuideDistance = Number.isFinite(Number(entry.record.baseGuideDistance))
        ? Number(entry.record.baseGuideDistance)
        : entry.guideDistance;
      entry.repairCount = Number(entry.record.repairCount) || 0;
    });

    return fan;
  }

  function snapshotLayout(layout) {
    return layout.entries.map(function snapshotEntry(entry) {
      return {
        guideBearing: entry.guideBearing,
        guideDistance: entry.guideDistance,
        repairCount: entry.repairCount
      };
    });
  }

  function restoreLayout(map, layout, snapshot) {
    layout.entries.forEach(function restoreEntry(entry, index) {
      var saved = snapshot[index];

      if (!saved) {
        return;
      }

      entry.guideBearing = saved.guideBearing;
      entry.guideDistance = saved.guideDistance;
      entry.repairCount = saved.repairCount || 0;
      renderEntry(map, layout, entry);
    });
  }

  function distanceSquared(first, second) {
    var dx = first.x - second.x;
    var dy = first.y - second.y;

    return dx * dx + dy * dy;
  }

  function pointSegmentDistanceSquared(point, start, end) {
    var dx = end.x - start.x;
    var dy = end.y - start.y;
    var lengthSquared = dx * dx + dy * dy;
    var position;

    if (!lengthSquared) {
      return distanceSquared(point, start);
    }

    position = clamp(
      ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared,
      0,
      1
    );

    return distanceSquared(
      point,
      window.L.point(start.x + position * dx, start.y + position * dy)
    );
  }

  function crossProduct(first, second, third) {
    return (second.x - first.x) * (third.y - first.y) -
      (second.y - first.y) * (third.x - first.x);
  }

  function segmentsIntersect(firstStart, firstEnd, secondStart, secondEnd) {
    var firstSideOne = crossProduct(firstStart, firstEnd, secondStart);
    var firstSideTwo = crossProduct(firstStart, firstEnd, secondEnd);
    var secondSideOne = crossProduct(secondStart, secondEnd, firstStart);
    var secondSideTwo = crossProduct(secondStart, secondEnd, firstEnd);

    return (
      ((firstSideOne > 0 && firstSideTwo < 0) ||
        (firstSideOne < 0 && firstSideTwo > 0)) &&
      ((secondSideOne > 0 && secondSideTwo < 0) ||
        (secondSideOne < 0 && secondSideTwo > 0))
    );
  }

  function segmentDistanceSquared(firstStart, firstEnd, secondStart, secondEnd) {
    if (segmentsIntersect(firstStart, firstEnd, secondStart, secondEnd)) {
      return 0;
    }

    return Math.min(
      pointSegmentDistanceSquared(firstStart, secondStart, secondEnd),
      pointSegmentDistanceSquared(firstEnd, secondStart, secondEnd),
      pointSegmentDistanceSquared(secondStart, firstStart, firstEnd),
      pointSegmentDistanceSquared(secondEnd, firstStart, firstEnd)
    );
  }

  function routeScreenPoints(map, entry, coordinateMode) {
    var latlngs = entry.record.line.getLatLngs();
    var points = latlngs.map(function toConflictPoint(latlng) {
      return coordinateMode === "screen"
        ? map.latLngToLayerPoint(latlng)
        : map.project(latlng, REFERENCE_ZOOM);
    });
    var source = points[0];
    var destination = points[points.length - 1];

    return points.filter(function keepPoint(point, index) {
      if (index === 0 || index === points.length - 1) {
        return false;
      }

      return Math.sqrt(distanceSquared(point, source)) >= SOURCE_IGNORE_PX &&
        Math.sqrt(distanceSquared(point, destination)) >= DESTINATION_IGNORE_PX;
    });
  }

  function repairPolicy(layout, coordinateMode) {
    var pathCount = layout.entries.length;

    if (coordinateMode === "screen") {
      if (pathCount >= DENSE_GROUP_THRESHOLD) {
        return {
          clearancePx: 3,
          maxRepairsPerRoute: 1,
          maxAdditionalBearing: 3,
          maxAdditionalDistance: 20
        };
      }

      if (pathCount >= 9) {
        return {
          clearancePx: 5,
          maxRepairsPerRoute: 1,
          maxAdditionalBearing: 4,
          maxAdditionalDistance: 28
        };
      }

      return {
        clearancePx: ZOOM_CLEARANCE_PX,
        maxRepairsPerRoute: 1,
        maxAdditionalBearing: 5,
        maxAdditionalDistance: 36
      };
    }

    if (pathCount >= DENSE_GROUP_THRESHOLD) {
      return {
        clearancePx: 0,
        maxRepairsPerRoute: 1,
        maxAdditionalBearing: 4,
        maxAdditionalDistance: 28
      };
    }

    if (pathCount >= 9) {
      return {
        clearancePx: 2,
        maxRepairsPerRoute: 1,
        maxAdditionalBearing: 6,
        maxAdditionalDistance: 44
      };
    }

    return {
      clearancePx: PATH_CLEARANCE_PX,
      maxRepairsPerRoute: MAX_REPAIRS_PER_ROUTE,
      maxAdditionalBearing: MAX_ADDITIONAL_BEARING,
      maxAdditionalDistance: MAX_ADDITIONAL_DISTANCE
    };
  }

  function routeConflict(map, left, right, policy, coordinateMode) {
    var leftPoints = routeScreenPoints(map, left, coordinateMode);
    var rightPoints = routeScreenPoints(map, right, coordinateMode);
    var clearanceSquared = policy.clearancePx * policy.clearancePx;
    var minimumDistanceSquared = Infinity;
    var leftIndex;
    var rightIndex;
    var crossing;
    var distance;

    if (leftPoints.length < 2 || rightPoints.length < 2) {
      return null;
    }

    for (leftIndex = 0; leftIndex < leftPoints.length - 1; leftIndex += 1) {
      for (rightIndex = 0; rightIndex < rightPoints.length - 1; rightIndex += 1) {
        crossing = segmentsIntersect(
          leftPoints[leftIndex],
          leftPoints[leftIndex + 1],
          rightPoints[rightIndex],
          rightPoints[rightIndex + 1]
        );
        distance = crossing
          ? 0
          : segmentDistanceSquared(
              leftPoints[leftIndex],
              leftPoints[leftIndex + 1],
              rightPoints[rightIndex],
              rightPoints[rightIndex + 1]
            );

        minimumDistanceSquared = Math.min(minimumDistanceSquared, distance);

        if (crossing || (policy.clearancePx > 0 && distance <= clearanceSquared)) {
          return {
            left: left,
            right: right,
            crossing: crossing,
            distanceSquared: distance,
            key: String(left.record.stableKey || coordinateKey(left.record.to)) +
              "|" +
              String(right.record.stableKey || coordinateKey(right.record.to))
          };
        }
      }
    }

    return null;
  }

  function findConflicts(map, layout, coordinateMode) {
    var conflicts = [];
    var policy = repairPolicy(layout, coordinateMode);
    var leftIndex;
    var rightIndex;
    var conflict;

    for (leftIndex = 0; leftIndex < layout.entries.length; leftIndex += 1) {
      for (rightIndex = leftIndex + 1; rightIndex < layout.entries.length; rightIndex += 1) {
        conflict = routeConflict(
          map,
          layout.entries[leftIndex],
          layout.entries[rightIndex],
          policy,
          coordinateMode
        );

        if (conflict) {
          conflicts.push(conflict);
        }
      }
    }

    conflicts.sort(function strongestConflict(left, right) {
      if (left.crossing !== right.crossing) {
        return left.crossing ? -1 : 1;
      }

      return left.distanceSquared - right.distanceSquared;
    });

    return conflicts;
  }

  function longerEntry(first, second) {
    var difference = first.routeLength - second.routeLength;

    if (Math.abs(difference) > 1) {
      return difference > 0 ? first : second;
    }

    return String(first.record.stableKey || "") >
      String(second.record.stableKey || "")
      ? first
      : second;
  }

  function moveEntryOutside(map, layout, mover, other, coordinateMode) {
    var policy = repairPolicy(layout, coordinateMode);
    var moverDifference = signedBearingDifference(
      mover.guideBearing,
      layout.centreBearing
    );
    var baseDifference = signedBearingDifference(
      mover.baseGuideBearing,
      layout.centreBearing
    );
    var otherDifference = signedBearingDifference(
      other.guideBearing,
      layout.centreBearing
    );
    var side = fanSide(moverDifference);
    var currentOutward;
    var otherOutward;
    var maximumOutward;
    var nextOutward;
    var maximumDistance;
    var nextDistance;

    if (mover.repairCount >= policy.maxRepairsPerRoute) {
      return false;
    }

    if (!side) {
      side = fanSide(baseDifference) ||
        fanSide(mover.difference) ||
        fanSide(otherDifference) ||
        1;
    }

    currentOutward = Math.abs(moverDifference);
    otherOutward = fanSide(otherDifference) === side
      ? Math.abs(otherDifference)
      : 0;
    maximumOutward = Math.min(
      layout.halfSpread + EXTRA_FAN_LIMIT,
      Math.abs(baseDifference) + policy.maxAdditionalBearing
    );
    nextOutward = Math.min(
      maximumOutward,
      Math.max(
        currentOutward + OUTWARD_BEARING_STEP,
        otherOutward + OUTWARD_BEARING_STEP
      )
    );
    maximumDistance = Math.min(
      MAX_GUIDE_DISTANCE,
      mover.baseGuideDistance + Math.min(
        policy.maxAdditionalDistance,
        mover.routeLength * 0.16
      )
    );
    nextDistance = Math.min(
      maximumDistance,
      mover.guideDistance + OUTWARD_DISTANCE_STEP
    );

    if (
      nextOutward <= currentOutward + 0.01 &&
      nextDistance <= mover.guideDistance + 0.01
    ) {
      return false;
    }

    mover.guideBearing = normaliseBearing(
      layout.centreBearing + side * nextOutward
    );
    mover.guideDistance = nextDistance;
    mover.repairCount += 1;
    renderEntry(map, layout, mover);
    return true;
  }

  function totalConflictCount(map, layouts, coordinateMode) {
    return layouts.reduce(function addConflicts(total, layout) {
      return total + findConflicts(map, layout, coordinateMode).length;
    }, 0);
  }

  function ensureOptimiserOverlay() {
    if (optimiserOverlay && optimiserOverlay.isConnected) {
      return optimiserOverlay;
    }

    optimiserOverlay = document.createElement("section");
    optimiserOverlay.className = "osmmaps-rf-optimiser";
    optimiserOverlay.hidden = true;
    optimiserOverlay.setAttribute("role", "status");
    optimiserOverlay.setAttribute("aria-live", "polite");
    optimiserOverlay.innerHTML =
      '<div class="osmmaps-rf-optimiser__card">' +
        '<span class="osmmaps-rf-optimiser__spinner" aria-hidden="true"></span>' +
        '<div class="osmmaps-rf-optimiser__copy">' +
          '<strong>Optimising path layout…</strong>' +
          '<span data-rf-optimiser-status>Checking route conflicts</span>' +
        '</div>' +
        '<button type="button" data-rf-optimiser-skip>Skip</button>' +
      "</div>";

    optimiserOverlay
      .querySelector("[data-rf-optimiser-skip]")
      .addEventListener("click", function skipOptimisation() {
        cancelCurrentOptimisation(true, "Basic path layout used.");
      });

    document.body.appendChild(optimiserOverlay);
    return optimiserOverlay;
  }

  function setOptimiserStatus(message) {
    var overlay = ensureOptimiserOverlay();
    var status = overlay.querySelector("[data-rf-optimiser-status]");

    if (status) {
      status.textContent = message;
    }
  }

  function showOptimiserOverlay() {
    var overlay = ensureOptimiserOverlay();
    overlay.hidden = false;
  }

  function hideOptimiserOverlay() {
    if (optimiserOverlay) {
      optimiserOverlay.hidden = true;
    }
  }

  function showOptimiserNote(message) {
    var note = document.querySelector("[data-rf-optimiser-note]");

    if (!note) {
      note = document.createElement("div");
      note.className = "osmmaps-rf-optimiser-note";
      note.setAttribute("data-rf-optimiser-note", "");
      note.setAttribute("role", "status");
      note.setAttribute("aria-live", "polite");
      document.body.appendChild(note);
    }

    note.textContent = message;
    note.classList.add("is-visible");

    if (optimiserNoteTimer) {
      window.clearTimeout(optimiserNoteTimer);
    }

    optimiserNoteTimer = window.setTimeout(function hideNote() {
      note.classList.remove("is-visible");
    }, 2200);
  }

  function restoreAllSnapshots(map, layouts, snapshots) {
    layouts.forEach(function restoreGroup(layout, index) {
      restoreLayout(map, layout, snapshots[index]);
    });
  }

  function cancelCurrentOptimisation(restoreBasic, message) {
    var run = currentOptimisation;

    optimisationRunId += 1;

    if (!run) {
      hideOptimiserOverlay();
      return;
    }

    if (run.overlayTimer) {
      window.clearTimeout(run.overlayTimer);
    }

    if (restoreBasic) {
      restoreAllSnapshots(run.map, run.layouts, run.baselineSnapshots);
    }

    currentOptimisation = null;
    hideOptimiserOverlay();

    if (message) {
      showOptimiserNote(message);
    }
  }

  function finishOptimisation(run, message) {
    if (!currentOptimisation || currentOptimisation.id !== run.id) {
      return;
    }

    if (run.overlayTimer) {
      window.clearTimeout(run.overlayTimer);
    }

    currentOptimisation = null;
    hideOptimiserOverlay();

    if (message) {
      showOptimiserNote(message);
    }
  }

  function startOptimisation(map, layouts, coordinateMode) {
    var initialConflictCount = totalConflictCount(map, layouts, coordinateMode);

    if (!initialConflictCount) {
      return;
    }

    var run = {
      id: optimisationRunId + 1,
      map: map,
      layouts: layouts,
      baselineSnapshots: layouts.map(snapshotLayout),
      bestSnapshots: layouts.map(snapshotLayout),
      bestConflictCount: initialConflictCount,
      startedAt: window.performance && typeof window.performance.now === "function"
        ? window.performance.now()
        : Date.now(),
      layoutIndex: 0,
      repairSteps: 0,
      maxRepairSteps: coordinateMode === "screen" ? 8 : MAX_REPAIR_STEPS,
      coordinateMode: coordinateMode || "reference",
      blockedConflicts: new Set(),
      overlayTimer: 0
    };

    optimisationRunId = run.id;
    currentOptimisation = run;
    run.overlayTimer = window.setTimeout(function delayedOverlay() {
      if (currentOptimisation && currentOptimisation.id === run.id) {
        showOptimiserOverlay();
      }
    }, OPTIMISATION_OVERLAY_DELAY_MS);

    function nextFrame() {
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(runStep);
      } else {
        window.setTimeout(runStep, 16);
      }
    }

    function runStep() {
      var now = window.performance && typeof window.performance.now === "function"
        ? window.performance.now()
        : Date.now();
      var layout;
      var conflicts;
      var conflict;
      var mover;
      var other;
      var conflictCount;

      if (!currentOptimisation || currentOptimisation.id !== run.id) {
        return;
      }

      if (now - run.startedAt >= OPTIMISATION_BUDGET_MS) {
        restoreAllSnapshots(map, layouts, run.bestSnapshots);
        finishOptimisation(run, "Optimisation stopped — best layout used.");
        return;
      }

      if (run.repairSteps >= run.maxRepairSteps) {
        restoreAllSnapshots(map, layouts, run.bestSnapshots);
        finishOptimisation(
          run,
          run.bestConflictCount
            ? "Optimisation stopped — best layout used."
            : ""
        );
        return;
      }

      while (run.layoutIndex < layouts.length) {
        layout = layouts[run.layoutIndex];
        conflicts = findConflicts(map, layout, run.coordinateMode);

        if (conflicts.length) {
          break;
        }

        run.layoutIndex += 1;
      }

      if (run.layoutIndex >= layouts.length) {
        finishOptimisation(run, "");
        return;
      }

      conflict = conflicts.find(function findRepairableConflict(candidate) {
        var candidateMover;

        if (run.blockedConflicts.has(candidate.key)) {
          return false;
        }

        candidateMover = longerEntry(candidate.left, candidate.right);
        return candidateMover.repairCount < repairPolicy(layout, run.coordinateMode).maxRepairsPerRoute;
      });

      if (!conflict) {
        run.layoutIndex += 1;
        nextFrame();
        return;
      }

      mover = longerEntry(conflict.left, conflict.right);
      other = mover === conflict.left ? conflict.right : conflict.left;

      setOptimiserStatus(
        (run.coordinateMode === "screen"
          ? "Adjusting close paths "
          : "Checking conflict ") +
        String(run.repairSteps + 1) +
        " of " +
        String(run.maxRepairSteps)
      );

      if (!moveEntryOutside(map, layout, mover, other, run.coordinateMode)) {
        run.blockedConflicts.add(conflict.key);
        nextFrame();
        return;
      }

      run.repairSteps += 1;
      conflictCount = totalConflictCount(map, layouts, run.coordinateMode);

      if (conflictCount < run.bestConflictCount) {
        run.bestConflictCount = conflictCount;
        run.bestSnapshots = layouts.map(snapshotLayout);
      }

      if (!conflictCount) {
        finishOptimisation(run, "");
        return;
      }

      nextFrame();
    }

    nextFrame();
  }

  function adaptiveZoomLayout() {
    var map = activeMap();
    var currentZoom;
    var zoomedIn;
    var layouts;

    if (!map || !optimisationEnabled()) {
      return;
    }

    currentZoom = typeof map.getZoom === "function" ? map.getZoom() : null;
    zoomedIn = lastMapZoom == null || currentZoom == null || currentZoom > lastMapZoom;
    lastMapZoom = currentZoom;

    if (!zoomedIn) {
      return;
    }

    layouts = groupBySource(activeRecords(map)).map(function currentFan(group) {
      return createExistingLayout(map, group);
    });

    if (!totalConflictCount(map, layouts, "screen")) {
      return;
    }

    cancelCurrentOptimisation(false, "");
    startOptimisation(map, layouts, "screen");
  }

  function scheduleAdaptiveZoomLayout() {
    if (zoomLayoutTimer) {
      window.clearTimeout(zoomLayoutTimer);
    }

    zoomLayoutTimer = window.setTimeout(function runAdaptiveZoomLayout() {
      zoomLayoutTimer = 0;
      adaptiveZoomLayout();
    }, ZOOM_LAYOUT_DELAY_MS);
  }

  function bindMapEvents(map) {
    if (boundMap && typeof boundMap.off === "function") {
      boundMap.off("zoomend", scheduleAdaptiveZoomLayout);
      boundMap.off("resize", scheduleAdaptiveZoomLayout);
    }

    boundMap = map;
    lastMapZoom = map && typeof map.getZoom === "function"
      ? map.getZoom()
      : null;

    if (map && typeof map.on === "function") {
      map.on("zoomend", scheduleAdaptiveZoomLayout);
      map.on("resize", scheduleAdaptiveZoomLayout);
    }
  }

  function layoutPaths() {
    var map = activeMap();
    var layouts;

    if (!map || typeof map.project !== "function" || typeof map.unproject !== "function") {
      return;
    }

    cancelCurrentOptimisation(false, "");
    bindMapEvents(map);

    layouts = groupBySource(activeRecords(map)).map(function basicFan(group) {
      return createBasicLayout(map, group);
    });

    if (selectedRecord) {
      renderSelectedLabel(false);
    }

    if (optimisationEnabled()) {
      startOptimisation(map, layouts, "reference");
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
        stableKey: coordinateKey(from) + "->" + coordinateKey(to),
        actualBearing: 0,
        guideBearing: 0,
        fanCentreBearing: 0,
        guideDistance: 0
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
    optimiseEnabled: optimisationEnabled,
    cancelOptimisation: function cancelOptimisation() {
      cancelCurrentOptimisation(true, "Basic path layout used.");
    },
    refreshLabel: function refreshLabel() {
      renderSelectedLabel(true);
    }
  };
}());

/* Destination: FieldOpsAtlas/Features/maps/OSMrf-paths.js */
/* End of file: FieldOpsAtlas/Features/maps/OSMrf-paths.js | bottom/end of file */

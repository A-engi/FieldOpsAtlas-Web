/* ==========================================================================
   FieldOps Atlas one-time RF path generator
   File: FieldOpsAtlas/Features/maps/OSMpath-generator.js
   Version: 1.0.1-generate-once
   Purpose:
   - Generate the demo RF path fan only when no saved route exists.
   - Store complete geographic route points in localStorage.
   - Reuse the saved route without recalculating during normal map use.
   - Regenerate only through an explicit API call or when endpoints change.
   ========================================================================== */

(function fieldOpsOSMPathGenerator() {
  "use strict";

  var VERSION = "1.0.1-generate-once";
  var STORAGE_KEY = "fieldops.maps.generated-routes-v1";
  var REFERENCE_ZOOM = 9;
  var CURVE_SEGMENTS = 38;
  var FAN_PADDING_DEGREES = 18;
  var MAX_FAN_HALF_SPREAD = 68;
  var BASE_GUIDE_DISTANCE_RATIO = 0.58;
  var MAX_GUIDE_DISTANCE = 360;
  var MAX_REPAIR_STEPS = 10;
  var MAX_REPAIRS_PER_ROUTE = 2;
  var PATH_CLEARANCE_PX = 4;
  var SOURCE_IGNORE_PX = 36;
  var DESTINATION_IGNORE_PX = 20;
  var memoryStore = null;

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
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

  function coordinateKey(value) {
    var latlng = window.L.latLng(value);
    return latlng.lat.toFixed(5) + "," + latlng.lng.toFixed(5);
  }

  function endpointSignature(record) {
    return coordinateKey(record.from) + "->" + coordinateKey(record.to);
  }

  function keyFor(record) {
    var lineOptions = record && record.line && record.line.options
      ? record.line.options
      : {};
    var regionId = String(record.regionId || lineOptions.fieldOpsRegionId || "region");
    var pathId = String(
      record.pathId ||
      lineOptions.fieldOpsPathId ||
      record.stableKey ||
      endpointSignature(record)
    );

    return regionId + "|" + pathId;
  }

  function emptyStore() {
    return {
      version: VERSION,
      routes: {}
    };
  }

  function readStore() {
    var parsed;

    if (memoryStore) {
      return memoryStore;
    }

    try {
      parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
    } catch (error) {
      parsed = null;
    }

    if (
      !parsed ||
      parsed.version !== VERSION ||
      !parsed.routes ||
      typeof parsed.routes !== "object"
    ) {
      parsed = emptyStore();
    }

    memoryStore = parsed;
    return memoryStore;
  }

  function writeStore(store) {
    memoryStore = store;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (error) {
      // The in-memory cache still prevents repeated generation in this page.
    }
  }

  function validSavedRoute(saved, record) {
    return Boolean(
      saved &&
      saved.version === VERSION &&
      saved.endpoints === endpointSignature(record) &&
      Array.isArray(saved.points) &&
      saved.points.length >= 3
    );
  }

  function hydratePoints(points) {
    return points.map(function hydratePoint(point) {
      return window.L.latLng(Number(point[0]), Number(point[1]));
    });
  }

  function serialisePoints(points) {
    return points.map(function serialisePoint(point) {
      return [
        Number(point.lat.toFixed(7)),
        Number(point.lng.toFixed(7))
      ];
    });
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
    var differences = bearings.map(function bearingDifference(bearing) {
      return signedBearingDifference(bearing, anchorBearing);
    });
    var minimumDifference = Math.min.apply(Math, differences);
    var maximumDifference = Math.max.apply(Math, differences);
    var centreBearing = normaliseBearing(
      anchorBearing + (minimumDifference + maximumDifference) / 2
    );
    var entries = group.map(function createEntry(record, index) {
      return {
        record: record,
        bearing: bearings[index],
        difference: signedBearingDifference(bearings[index], centreBearing),
        guideBearing: 0,
        guideDistance: 0,
        routeLength: 0,
        repairCount: 0,
        points: []
      };
    }).sort(function sortByBearing(left, right) {
      var bearingDifference = left.difference - right.difference;

      if (Math.abs(bearingDifference) > 0.0001) {
        return bearingDifference;
      }

      return keyFor(left.record).localeCompare(keyFor(right.record));
    });
    var actualHalfSpread = entries.reduce(function largestDifference(largest, entry) {
      return Math.max(largest, Math.abs(entry.difference));
    }, 0);
    var minimumHalfSpread = minimumFanHalfSpread(entries.length);
    var halfSpread = entries.length <= 1
      ? 0
      : clamp(
          Math.max(actualHalfSpread + FAN_PADDING_DEGREES, minimumHalfSpread),
          minimumHalfSpread,
          MAX_FAN_HALF_SPREAD
        );

    return {
      centreBearing: centreBearing,
      halfSpread: halfSpread,
      entries: entries
    };
  }

  function projectedLength(map, record) {
    var start = map.project(record.from, REFERENCE_ZOOM);
    var end = map.project(record.to, REFERENCE_ZOOM);
    var dx = end.x - start.x;
    var dy = end.y - start.y;

    return Math.sqrt(dx * dx + dy * dy) || 1;
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

  function curvePoints(map, entry) {
    var start = map.project(entry.record.from, REFERENCE_ZOOM);
    var end = map.project(entry.record.to, REFERENCE_ZOOM);
    var controlOne = pointAlongBearing(
      start,
      entry.guideBearing,
      entry.guideDistance * 0.40
    );
    var controlTwo = pointAlongBearing(
      start,
      entry.guideBearing,
      entry.guideDistance
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

    points[0] = entry.record.from;
    points[points.length - 1] = entry.record.to;
    return points;
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

  function conflictPoints(map, entry) {
    var points = entry.points.map(function projectPoint(latlng) {
      return map.project(latlng, REFERENCE_ZOOM);
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

  function entriesConflict(map, left, right) {
    var leftPoints = conflictPoints(map, left);
    var rightPoints = conflictPoints(map, right);
    var clearanceSquared = PATH_CLEARANCE_PX * PATH_CLEARANCE_PX;
    var leftIndex;
    var rightIndex;
    var distance;

    if (leftPoints.length < 2 || rightPoints.length < 2) {
      return false;
    }

    for (leftIndex = 0; leftIndex < leftPoints.length - 1; leftIndex += 1) {
      for (rightIndex = 0; rightIndex < rightPoints.length - 1; rightIndex += 1) {
        distance = segmentDistanceSquared(
          leftPoints[leftIndex],
          leftPoints[leftIndex + 1],
          rightPoints[rightIndex],
          rightPoints[rightIndex + 1]
        );

        if (distance <= clearanceSquared) {
          return true;
        }
      }
    }

    return false;
  }

  function firstConflict(map, layout) {
    var leftIndex;
    var rightIndex;

    for (leftIndex = 0; leftIndex < layout.entries.length; leftIndex += 1) {
      for (rightIndex = leftIndex + 1; rightIndex < layout.entries.length; rightIndex += 1) {
        if (entriesConflict(map, layout.entries[leftIndex], layout.entries[rightIndex])) {
          return {
            left: layout.entries[leftIndex],
            right: layout.entries[rightIndex]
          };
        }
      }
    }

    return null;
  }

  function repairEntry(map, layout, entry) {
    var difference;
    var side;
    var nextOutward;

    if (entry.repairCount >= MAX_REPAIRS_PER_ROUTE) {
      return false;
    }

    difference = signedBearingDifference(entry.guideBearing, layout.centreBearing);
    side = difference < 0 ? -1 : difference > 0 ? 1 : entry.difference < 0 ? -1 : 1;
    nextOutward = Math.min(
      layout.halfSpread + 10,
      Math.abs(difference) + 3
    );

    entry.guideBearing = normaliseBearing(
      layout.centreBearing + side * nextOutward
    );
    entry.guideDistance = Math.min(
      MAX_GUIDE_DISTANCE,
      entry.guideDistance + 18
    );
    entry.repairCount += 1;
    entry.points = curvePoints(map, entry);
    return true;
  }

  function generateGroup(map, group) {
    var layout = bearingFan(group);
    var lastIndex = layout.entries.length - 1;
    var repairStep;
    var conflict;
    var mover;

    layout.entries.forEach(function prepareEntry(entry, index) {
      var ratio = lastIndex > 0 ? index / lastIndex : 0.5;

      entry.guideBearing = normaliseBearing(
        layout.centreBearing -
          layout.halfSpread +
          ratio * layout.halfSpread * 2
      );
      entry.routeLength = projectedLength(map, entry.record);
      entry.guideDistance = baseGuideDistance(entry.routeLength);
      entry.points = curvePoints(map, entry);
    });

    for (repairStep = 0; repairStep < MAX_REPAIR_STEPS; repairStep += 1) {
      conflict = firstConflict(map, layout);

      if (!conflict) {
        break;
      }

      mover = conflict.left.routeLength >= conflict.right.routeLength
        ? conflict.left
        : conflict.right;

      if (!repairEntry(map, layout, mover)) {
        mover = mover === conflict.left ? conflict.right : conflict.left;

        if (!repairEntry(map, layout, mover)) {
          break;
        }
      }
    }

    return layout.entries;
  }

  function resolve(map, records) {
    var store = readStore();
    var result = new Map();
    var changed = false;

    groupBySource(records).forEach(function resolveGroup(group) {
      var groupNeedsGeneration = group.some(function missingRoute(record) {
        return !validSavedRoute(store.routes[keyFor(record)], record);
      });

      if (!groupNeedsGeneration) {
        group.forEach(function useSavedRoute(record) {
          result.set(
            keyFor(record),
            hydratePoints(store.routes[keyFor(record)].points)
          );
        });
        return;
      }

      generateGroup(map, group).forEach(function saveGeneratedRoute(entry) {
        var routeKey = keyFor(entry.record);

        store.routes[routeKey] = {
          version: VERSION,
          endpoints: endpointSignature(entry.record),
          points: serialisePoints(entry.points),
          generatedAt: new Date().toISOString()
        };

        result.set(routeKey, entry.points);
        changed = true;
      });
    });

    if (changed) {
      writeStore(store);
    }

    return result;
  }

  function regenerate(map, records) {
    var store = readStore();

    records.forEach(function removeSavedRoute(record) {
      delete store.routes[keyFor(record)];
    });

    writeStore(store);
    return resolve(map, records);
  }

  function clear(records) {
    var store = readStore();

    if (Array.isArray(records) && records.length) {
      records.forEach(function removeSavedRoute(record) {
        delete store.routes[keyFor(record)];
      });
    } else {
      store = emptyStore();
    }

    writeStore(store);
  }

  window.FieldOpsOSMPathGenerator = {
    VERSION: VERSION,
    version: VERSION,
    storageKey: STORAGE_KEY,
    keyFor: keyFor,
    resolve: resolve,
    regenerate: regenerate,
    clear: clear
  };
}());

/* Destination: FieldOpsAtlas/Features/maps/OSMpath-generator.js */
/* End of file: FieldOpsAtlas/Features/maps/OSMpath-generator.js | bottom/end of file */

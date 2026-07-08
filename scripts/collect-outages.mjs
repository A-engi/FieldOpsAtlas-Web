import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(
  ROOT,
  "FieldOpsAtlas",
  "Features",
  "Weather",
  "data",
  "outages"
);

const FETCH_TIMEOUT_MS = 30_000;
const MAX_RECORDS_PER_FEED = 2_500;
const USER_AGENT = "FieldOpsAtlas-Outage-Collector/0.4 (+https://github.com/A-engi/FieldOpsAtlas-Web)";

const PROVIDERS = [
  {
    id: "ukpn",
    name: "UK Power Networks",
    officialUrl: "https://www.ukpowernetworks.co.uk/power-cut/map",
    locationQuality: "postcode_aggregate",
    feeds: [
      {
        id: "live",
        type: "ods",
        domain: "https://ukpowernetworks.opendatasoft.com",
        dataset: "ukpn-live-faults"
      }
    ]
  },
  {
    id: "npg",
    name: "Northern Powergrid",
    officialUrl: "https://www.northernpowergrid.com/power-cuts-map",
    locationQuality: "centralised_area",
    feeds: [
      {
        id: "live",
        type: "ods",
        domain: "https://northernpowergrid.opendatasoft.com",
        dataset: "live-power-cuts-data"
      }
    ]
  },
  {
    id: "nged",
    name: "National Grid ED",
    officialUrl: "https://powercuts.nationalgrid.co.uk/power-cut-map",
    locationQuality: "published_point",
    feeds: [
      {
        id: "live",
        type: "ckan-datastore",
        url: "https://connecteddata.nationalgrid.co.uk/api/3/action/datastore_search",
        resourceId: "292f788f-4339-455b-8cc0-153e14509d4d"
      }
    ]
  },
  {
    id: "enwl",
    name: "SP Electricity North West",
    officialUrl: "https://www.enwl.co.uk/power-cuts",
    locationQuality: "upstream_switch",
    feeds: [
      {
        id: "live",
        type: "ods",
        domain: "https://electricitynorthwest.opendatasoft.com",
        dataset: "live_incidents"
      },
      {
        id: "planned",
        type: "ods",
        domain: "https://electricitynorthwest.opendatasoft.com",
        dataset: "psi",
        forceCategory: "planned"
      }
    ]
  },
  {
    id: "ssen",
    name: "SSEN Distribution",
    officialUrl: "https://powertrack.ssen.co.uk/powertrack",
    locationQuality: "published_point",
    feeds: [
      {
        id: "live",
        type: "json",
        url: "https://external.distribution.prd.ssen.co.uk/opendataportal-prd/v4/api/getallfaults"
      }
    ]
  },
  {
    id: "spen",
    name: "SP Energy Networks",
    officialUrl: "https://www.spenergynetworks.co.uk/pages/power_cuts.aspx",
    locationQuality: "published_point",
    feeds: [
      {
        id: "live",
        type: "ods",
        domain: "https://spenergynetworks.opendatasoft.com",
        dataset: "distribution-network-live-outages"
      }
    ]
  },
  {
    id: "nie",
    name: "NIE Networks",
    officialUrl: "https://powercheck.nienetworks.co.uk/",
    locationQuality: "approximate_area",
    feeds: [
      {
        id: "live",
        type: "ods",
        domain: "https://nienetworks.opendatasoft.com",
        dataset: "nie-networks-network-faults"
      }
    ]
  }
];

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  if (process.argv.includes("--self-test")) {
    runSelfTest();
    return;
  }

  const generatedAt = new Date().toISOString();
  const results = await Promise.all(PROVIDERS.map((provider) => collectProvider(provider, generatedAt)));

  const status = {
    version: "0.4.0-static-collector",
    generatedAt,
    providers: Object.fromEntries(results.map((result) => [result.id, result.status]))
  };

  await writeJsonAtomic(path.join(OUTPUT_DIR, "status.json"), status);

  const live = results.filter((item) => item.status.state === "live").length;
  const partial = results.filter((item) => item.status.state === "partial").length;
  const stale = results.filter((item) => item.status.stale).length;
  const errors = results.filter((item) => item.status.state === "error").length;

  console.log(`Outage collection complete: ${live} live, ${partial} partial, ${stale} stale, ${errors} error.`);

  if (live + partial === 0) {
    process.exitCode = 1;
  }
}

async function collectProvider(provider, generatedAt) {
  const outputPath = path.join(OUTPUT_DIR, `${provider.id}.geojson`);
  const previous = await readGeoJson(outputPath);
  const rows = [];
  const feedResults = [];

  for (const feed of provider.feeds) {
    try {
      const feedRows = await loadFeed(feed);
      feedRows.forEach((row, index) => {
        rows.push({ row, feed, feedIndex: index });
      });
      feedResults.push({ id: feed.id, state: "live", rawRows: feedRows.length });
    } catch (error) {
      feedResults.push({ id: feed.id, state: "error", error: conciseError(error) });
    }
  }

  const successfulFeeds = feedResults.filter((item) => item.state === "live");

  if (!successfulFeeds.length) {
    const staleFeatures = Array.isArray(previous?.features) ? previous.features : [];
    const preserved = {
      type: "FeatureCollection",
      provider: provider.id,
      generatedAt: previous?.generatedAt || generatedAt,
      stale: true,
      features: staleFeatures
    };

    await writeJsonAtomic(outputPath, preserved);

    return {
      id: provider.id,
      status: {
        state: "error",
        stale: staleFeatures.length > 0,
        generatedAt,
        lastGoodAt: previous?.generatedAt || null,
        rawRows: 0,
        validRows: 0,
        uniqueIncidents: staleFeatures.length,
        groupedRows: 0,
        skippedRows: 0,
        feeds: feedResults,
        message: staleFeatures.length
          ? `All feeds failed; preserving ${staleFeatures.length} last-good incidents`
          : "All feeds failed and no last-good data is available"
      }
    };
  }

  const candidates = [];
  let skippedRows = 0;

  rows.forEach(({ row, feed, feedIndex }) => {
    const incident = normaliseIncident(provider, feed, row, feedIndex);
    if (incident) {
      candidates.push(incident);
    } else {
      skippedRows += 1;
    }
  });

  const incidents = deduplicateIncidents(provider, candidates);
  const features = incidents.map(toFeature);
  const groupedRows = Math.max(0, candidates.length - incidents.length);

  const featureCollection = {
    type: "FeatureCollection",
    provider: provider.id,
    generatedAt,
    stale: false,
    features
  };

  await writeJsonAtomic(outputPath, featureCollection);

  const failedFeeds = feedResults.filter((item) => item.state === "error");
  const state = failedFeeds.length ? "partial" : "live";

  return {
    id: provider.id,
    status: {
      state,
      stale: false,
      generatedAt,
      lastGoodAt: generatedAt,
      rawRows: rows.length,
      validRows: candidates.length,
      uniqueIncidents: incidents.length,
      groupedRows,
      skippedRows,
      feeds: feedResults,
      message: failedFeeds.length
        ? `${incidents.length} incidents; ${failedFeeds.length} feed failed`
        : `${incidents.length} incidents from ${rows.length} provider rows`
    }
  };
}

async function loadFeed(feed) {
  if (feed.type === "ods") {
    return loadOds(feed);
  }

  if (feed.type === "ckan-datastore") {
    return loadCkanDatastore(feed);
  }

  if (feed.type === "json") {
    const payload = await fetchJson(feed.url);
    const rows = extractRows(payload);
    if (!Array.isArray(rows)) {
      throw new Error("JSON endpoint did not contain an outage array");
    }
    return rows.slice(0, MAX_RECORDS_PER_FEED);
  }

  throw new Error(`Unsupported feed type: ${feed.type}`);
}

async function loadOds(feed) {
  const rows = [];
  const pageSize = 100;
  let offset = 0;

  while (offset < MAX_RECORDS_PER_FEED) {
    const url = new URL(
      `/api/explore/v2.1/catalog/datasets/${encodeURIComponent(feed.dataset)}/records`,
      feed.domain
    );
    url.searchParams.set("limit", String(pageSize));
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("timezone", "Europe/London");

    const payload = await fetchJson(url.toString());
    const page = Array.isArray(payload?.results) ? payload.results : [];
    rows.push(...page);

    const total = Number(payload?.total_count ?? rows.length);
    if (page.length < pageSize || rows.length >= total) break;
    offset += pageSize;
  }

  return rows.slice(0, MAX_RECORDS_PER_FEED);
}

async function loadCkanDatastore(feed) {
  const rows = [];
  const pageSize = 1000;
  let offset = 0;

  while (offset < MAX_RECORDS_PER_FEED) {
    const url = new URL(feed.url);
    url.searchParams.set("resource_id", feed.resourceId);
    url.searchParams.set("limit", String(pageSize));
    url.searchParams.set("offset", String(offset));

    const payload = await fetchJson(url.toString());
    if (!payload?.success || !Array.isArray(payload?.result?.records)) {
      throw new Error("CKAN datastore response was not successful");
    }

    const page = payload.result.records;
    rows.push(...page);

    const total = Number(payload.result.total ?? rows.length);
    if (page.length < pageSize || rows.length >= total) break;
    offset += pageSize;
  }

  return rows.slice(0, MAX_RECORDS_PER_FEED);
}

function normaliseIncident(provider, feed, row, index) {
  const raw = row?.type === "Feature"
    ? { ...(row.properties || {}), geometry: row.geometry }
    : row?.record || row?.fields || row;

  if (!raw || typeof raw !== "object") return null;

  const fields = flattenObject(raw);
  const coordinate = findCoordinate(raw, fields);
  if (!coordinate) return null;

  const statusText = textValue(pick(fields, [
    "status",
    "incidentstatus",
    "outagestatus",
    "eventstatus",
    "faultstatus",
    "resourcestatus",
    "customerstagesequencemessage",
    "state"
  ]));

  const typeText = textValue(pick(fields, [
    "type",
    "incidenttype",
    "outagetype",
    "eventtype",
    "interruptiontype",
    "powercutcategory",
    "natureofoutage",
    "category"
  ]));

  const plannedValue = pick(fields, [
    "planned",
    "isplanned",
    "plannedoutage",
    "plannedunplanned"
  ]);

  const combined = `${statusText} ${typeText} ${textValue(plannedValue)}`.toLowerCase();
  let category = feed.forceCategory || "current";

  if (/restored|resolved|closed|complete|completed|cancelled/.test(combined)) {
    category = "restored";
  } else if (
    feed.forceCategory === "planned" ||
    truthyPlanned(plannedValue) ||
    /planned|scheduled|future/.test(combined)
  ) {
    category = "planned";
  }

  const referenceValue = pick(fields, [
    "reference",
    "incidentid",
    "incidentreference",
    "incidentnumber",
    "incidentnum",
    "incidentno",
    "eventid",
    "eventreference",
    "eventplannumber",
    "outageid",
    "outagereference",
    "faultid",
    "faultreference",
    "powercutreference",
    "jobid",
    "id"
  ]);

  const reference = isUsefulReference(referenceValue)
    ? String(referenceValue).trim()
    : null;

  const area = firstText(fields, [
    "area",
    "location",
    "locality",
    "town",
    "description",
    "incidentlocation",
    "outagelocation",
    "affectedarea",
    "postcodes",
    "postcode",
    "region"
  ]) || "Published incident location";

  const startedAt = parseDate(pick(fields, [
    "starttime",
    "startedat",
    "incidentstart",
    "incidentstarttime",
    "loggedtime",
    "reportedat",
    "reportedtime",
    "createdat",
    "createdtime",
    "from"
  ]));

  const restoreAt = parseDate(pick(fields, [
    "estimatedrestorationtime",
    "estimatedtimetillresolution",
    "estimatedrestore",
    "estimatedrestored",
    "restorationtime",
    "estimatedend",
    "etr",
    "endtime",
    "to"
  ]));

  const updatedAt = parseDate(pick(fields, [
    "updatedat",
    "updatedtime",
    "updatedate",
    "lastupdated",
    "lastupdate",
    "modified",
    "modificationdate"
  ]));

  return {
    providerId: provider.id,
    provider: provider.name,
    feedId: feed.id,
    reference,
    category,
    status: statusText || category,
    type: typeText || category,
    area,
    lat: coordinate.lat,
    lon: coordinate.lon,
    startedAt,
    restoreAt,
    updatedAt,
    officialUrl: provider.officialUrl,
    locationQuality: provider.locationQuality,
    rawIndex: index
  };
}

function deduplicateIncidents(provider, incidents) {
  const byReference = new Map();
  const fallback = [];

  for (const incident of incidents) {
    if (incident.reference) {
      const key = [
        provider.id,
        incident.category,
        normaliseIdentity(incident.reference)
      ].join(":");

      if (!byReference.has(key)) {
        byReference.set(key, createGroup(incident, key));
      } else {
        mergeGroup(byReference.get(key), incident);
      }
      continue;
    }

    const match = fallback.find((group) => canMergeFallback(group, incident));
    if (match) mergeGroup(match, incident);
    else fallback.push(createGroup(incident, null));
  }

  return [...byReference.values(), ...fallback].map((group) => finaliseGroup(provider, group));
}

function createGroup(incident, explicitKey) {
  return {
    explicitKey,
    providerId: incident.providerId,
    provider: incident.provider,
    feedIds: new Set([incident.feedId]),
    reference: incident.reference,
    category: incident.category,
    status: incident.status,
    type: incident.type,
    areas: new Set([incident.area]),
    coordinates: [[incident.lat, incident.lon]],
    latSum: incident.lat,
    lonSum: incident.lon,
    startedAt: incident.startedAt,
    restoreAt: incident.restoreAt,
    updatedAt: incident.updatedAt,
    officialUrl: incident.officialUrl,
    locationQuality: incident.locationQuality,
    rawRecordCount: 1
  };
}

function mergeGroup(group, incident) {
  group.feedIds.add(incident.feedId);
  group.areas.add(incident.area);
  group.coordinates.push([incident.lat, incident.lon]);
  group.latSum += incident.lat;
  group.lonSum += incident.lon;
  group.rawRecordCount += 1;
  group.startedAt = earlierDate(group.startedAt, incident.startedAt);
  group.restoreAt = laterDate(group.restoreAt, incident.restoreAt);
  group.updatedAt = laterDate(group.updatedAt, incident.updatedAt);

  if (!group.reference && incident.reference) group.reference = incident.reference;
  if ((!group.status || group.status === group.category) && incident.status) group.status = incident.status;
  if ((!group.type || group.type === group.category) && incident.type) group.type = incident.type;
}

function finaliseGroup(provider, group) {
  const lat = group.latSum / group.rawRecordCount;
  const lon = group.lonSum / group.rawRecordCount;
  const areas = [...group.areas].filter(Boolean);
  const area = areas.length <= 1
    ? areas[0] || "Published incident location"
    : `${areas[0]} + ${areas.length - 1} related location${areas.length === 2 ? "" : "s"}`;

  const stableFallback = [
    provider.id,
    group.category,
    lat.toFixed(3),
    lon.toFixed(3),
    group.startedAt ? Math.floor(group.startedAt / 1_800_000) : "unknown",
    normaliseIdentity(areas[0] || "location").slice(0, 48)
  ].join(":");

  return {
    key: group.explicitKey || stableFallback,
    providerId: group.providerId,
    provider: group.provider,
    feedIds: [...group.feedIds],
    reference: group.reference,
    category: group.category,
    status: group.status || group.category,
    type: group.type || group.category,
    area,
    areas,
    lat,
    lon,
    startedAt: group.startedAt,
    restoreAt: group.restoreAt,
    updatedAt: group.updatedAt,
    officialUrl: group.officialUrl,
    locationQuality: group.locationQuality,
    rawRecordCount: group.rawRecordCount,
    coordinateSpreadKm: coordinateSpreadKm(group.coordinates)
  };
}

function canMergeFallback(group, incident) {
  if (group.category !== incident.category) return false;

  const centreLat = group.latSum / group.rawRecordCount;
  const centreLon = group.lonSum / group.rawRecordCount;
  const distanceKm = haversineKm(centreLat, centreLon, incident.lat, incident.lon);
  if (distanceKm > 1.5) return false;

  if (group.startedAt && incident.startedAt) {
    if (Math.abs(group.startedAt - incident.startedAt) > 90 * 60 * 1000) return false;
    return (
      areaSimilarity([...group.areas][0], incident.area) >= 0.35 ||
      isGenericArea([...group.areas][0]) ||
      isGenericArea(incident.area)
    );
  }

  return distanceKm <= 0.5 && areaSimilarity([...group.areas][0], incident.area) >= 0.6;
}

function toFeature(incident) {
  return {
    type: "Feature",
    id: incident.key,
    geometry: {
      type: "Point",
      coordinates: [incident.lon, incident.lat]
    },
    properties: {
      providerId: incident.providerId,
      provider: incident.provider,
      feedIds: incident.feedIds,
      reference: incident.reference,
      category: incident.category,
      status: incident.status,
      type: incident.type,
      area: incident.area,
      areas: incident.areas,
      startedAt: toIso(incident.startedAt),
      restoreAt: toIso(incident.restoreAt),
      updatedAt: toIso(incident.updatedAt),
      officialUrl: incident.officialUrl,
      locationQuality: incident.locationQuality,
      rawRecordCount: incident.rawRecordCount,
      coordinateSpreadKm: Number(incident.coordinateSpreadKm.toFixed(3))
    }
  };
}

function extractRows(payload) {
  if (Array.isArray(payload)) return payload;

  const candidates = [
    payload?.results,
    payload?.result?.records,
    payload?.records,
    payload?.features,
    payload?.data,
    payload?.outages,
    payload?.faults,
    payload?.incidents,
    payload?.items,
    payload?.result
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  const queue = [payload];
  const seen = new Set();

  while (queue.length) {
    const value = queue.shift();
    if (!value || typeof value !== "object" || seen.has(value)) continue;
    seen.add(value);

    for (const item of Object.values(value)) {
      if (Array.isArray(item) && item.length && item.every((entry) => entry && typeof entry === "object")) {
        const score = scoreRecordArray(item);
        if (score >= 2) return item;
      } else if (item && typeof item === "object") {
        queue.push(item);
      }
    }
  }

  return [];
}

function scoreRecordArray(items) {
  const sample = items.slice(0, 3).map((item) => flattenObject(item));
  let score = 0;

  for (const fields of sample) {
    if (pick(fields, ["reference", "incidentid", "faultid", "eventid", "incidentnum"])) score += 2;
    if (pick(fields, ["latitude", "lat", "longitude", "lon", "geopoint2dlat"])) score += 2;
    if (pick(fields, ["status", "category", "outagetype", "planned"])) score += 1;
  }

  return score;
}

function findCoordinate(raw, fields) {
  const geometryCandidates = [
    raw?.geometry,
    raw?.geo_shape,
    raw?.geoshape,
    raw?.shape,
    raw?.feature?.geometry
  ];

  for (const candidate of geometryCandidates) {
    const coordinate = coordinateFromGeometry(candidate?.geometry || candidate);
    if (coordinate) return coordinate;
  }

  const pointCandidates = [
    raw?.geo_point_2d,
    raw?.geopoint,
    raw?.geoPoint,
    raw?.coordinates,
    raw?.coordinate,
    raw?.position,
    raw?.point,
    raw?.location
  ];

  for (const candidate of pointCandidates) {
    const coordinate = parseCoordinate(candidate);
    if (coordinate) return coordinate;
  }

  const lat = toNumber(pick(fields, [
    "lat",
    "latitude",
    "locationlat",
    "locationlatitude",
    "incidentlat",
    "incidentlatitude",
    "faultlat",
    "faultlatitude",
    "geopoint2dlat",
    "geopointlat",
    "y"
  ]));

  const lon = toNumber(pick(fields, [
    "lon",
    "lng",
    "long",
    "longitude",
    "locationlon",
    "locationlng",
    "locationlong",
    "locationlongitude",
    "incidentlon",
    "incidentlng",
    "incidentlongitude",
    "faultlon",
    "faultlng",
    "faultlongitude",
    "geopoint2dlon",
    "geopointlon",
    "x"
  ]));

  return validateCoordinate(lat, lon);
}

function coordinateFromGeometry(geometry) {
  if (!geometry) return null;

  if (typeof geometry === "string") {
    try {
      return coordinateFromGeometry(JSON.parse(geometry));
    } catch {
      return parseCoordinate(geometry);
    }
  }

  if (geometry?.type === "Feature") return coordinateFromGeometry(geometry.geometry);
  if (geometry?.type === "Point") return parseCoordinate(geometry.coordinates);

  const coordinates = geometry?.coordinates || geometry;
  const points = flattenCoordinatePairs(coordinates);
  if (!points.length) return null;

  const lon = points.reduce((sum, point) => sum + point[0], 0) / points.length;
  const lat = points.reduce((sum, point) => sum + point[1], 0) / points.length;
  return validateCoordinate(lat, lon);
}

function flattenCoordinatePairs(value, result = []) {
  if (
    Array.isArray(value) &&
    value.length >= 2 &&
    Number.isFinite(Number(value[0])) &&
    Number.isFinite(Number(value[1]))
  ) {
    const lon = Number(value[0]);
    const lat = Number(value[1]);
    if (validateCoordinate(lat, lon)) result.push([lon, lat]);
    return result;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => flattenCoordinatePairs(item, result));
  }

  return result;
}

function parseCoordinate(value) {
  if (!value) return null;

  if (Array.isArray(value) && value.length >= 2) {
    const first = Number(value[0]);
    const second = Number(value[1]);
    return validateCoordinate(second, first) || validateCoordinate(first, second);
  }

  if (typeof value === "object") {
    return validateCoordinate(
      toNumber(value.lat ?? value.latitude ?? value.y),
      toNumber(value.lon ?? value.lng ?? value.long ?? value.longitude ?? value.x)
    );
  }

  if (typeof value === "string") {
    const parts = value.match(/-?\d+(?:\.\d+)?/g);
    if (parts?.length >= 2) return parseCoordinate([Number(parts[0]), Number(parts[1])]);
  }

  return null;
}


function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : Number.NaN;
}

function validateCoordinate(lat, lon) {
  if (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= 48 &&
    lat <= 62.5 &&
    lon >= -12.5 &&
    lon <= 4
  ) {
    return { lat, lon };
  }
  return null;
}

function flattenObject(value, prefix = "", result = {}) {
  if (!value || typeof value !== "object") return result;

  for (const [key, item] of Object.entries(value)) {
    const nextKey = normaliseKey(prefix ? `${prefix}_${key}` : key);

    if (Array.isArray(item)) {
      if (item.every((entry) => ["string", "number", "boolean"].includes(typeof entry))) {
        result[nextKey] = item.join(", ");
      }
    } else if (item && typeof item === "object") {
      flattenObject(item, nextKey, result);
    } else {
      result[nextKey] = item;
    }
  }

  return result;
}

function normaliseKey(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function pick(fields, keys) {
  for (const key of keys) {
    const value = fields[normaliseKey(key)];
    if (value !== undefined && value !== null && String(value).trim() !== "") return value;
  }
  return null;
}

function firstText(fields, keys) {
  const value = pick(fields, keys);
  if (Array.isArray(value)) return value.join(", ");
  if (value && typeof value === "object") return JSON.stringify(value);
  return textValue(value);
}

function textValue(value) {
  if (value === undefined || value === null) return "";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value).trim();
}

function truthyPlanned(value) {
  if (value === true || value === 1) return true;
  return /^(true|yes|y|1|planned)$/i.test(textValue(value));
}

function isUsefulReference(value) {
  const text = textValue(value);
  if (!text) return false;
  return !/^(0|unknown|none|null|n\/?a|not available|not published)$/i.test(text);
}

function parseDate(value) {
  if (value === undefined || value === null || value === "") return null;

  if (typeof value === "number" && Number.isFinite(value)) {
    return value > 100_000_000_000 ? value : value * 1000;
  }

  const text = textValue(value);
  const numeric = Number(text);
  if (Number.isFinite(numeric) && text !== "") {
    return numeric > 100_000_000_000 ? numeric : numeric * 1000;
  }

  const parsed = Date.parse(text);
  return Number.isFinite(parsed) ? parsed : null;
}

function toIso(timestamp) {
  return timestamp ? new Date(timestamp).toISOString() : null;
}

function normaliseIdentity(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function areaSimilarity(first, second) {
  const a = areaTokens(first);
  const b = areaTokens(second);
  if (!a.size || !b.size) return 0;

  let shared = 0;
  for (const token of a) if (b.has(token)) shared += 1;
  return shared / Math.max(a.size, b.size);
}

function areaTokens(value) {
  const ignored = new Set([
    "the", "and", "near", "area", "location", "published",
    "incident", "outage", "power", "cut", "affected"
  ]);

  return new Set(
    String(value || "")
      .toLowerCase()
      .match(/[a-z0-9]+/g)
      ?.filter((token) => token.length > 2 && !ignored.has(token)) || []
  );
}

function isGenericArea(value) {
  return /published incident location|unknown|not available/i.test(String(value || ""));
}

function earlierDate(first, second) {
  if (!first) return second || null;
  if (!second) return first;
  return Math.min(first, second);
}

function laterDate(first, second) {
  if (!first) return second || null;
  if (!second) return first;
  return Math.max(first, second);
}

function coordinateSpreadKm(coordinates) {
  if (!coordinates?.length || coordinates.length < 2) return 0;
  const lat = coordinates.reduce((sum, item) => sum + item[0], 0) / coordinates.length;
  const lon = coordinates.reduce((sum, item) => sum + item[1], 0) / coordinates.length;
  return coordinates.reduce(
    (maximum, item) => Math.max(maximum, haversineKm(lat, lon, item[0], item[1])),
    0
  );
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const radiusKm = 6371;
  const toRadians = (value) => value * Math.PI / 180;
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(deltaLon / 2) ** 2;
  return radiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function scoreForStatus(status) {
  if (status.state === "live") return 4;
  if (status.state === "partial") return 3;
  if (status.stale) return 2;
  return 1;
}

async function fetchJson(url) {
  let lastError;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": USER_AGENT
        },
        redirect: "follow"
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 1500));
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError || new Error("Request failed");
}

async function readGeoJson(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    return null;
  }
}

async function writeJsonAtomic(filePath, value) {
  const temporary = `${filePath}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await fs.rename(temporary, filePath);
}

function conciseError(error) {
  if (error?.name === "AbortError") return "Timed out";
  return String(error?.message || "Unavailable").slice(0, 180);
}

function runSelfTest() {
  const provider = PROVIDERS.find((item) => item.id === "nged");
  const feed = provider.feeds[0];
  const samples = [
    {
      "Incident ID": "INCD-TEST-1",
      Status: "Awaiting",
      Planned: "false",
      Category: "LV GENERIC",
      "Start Time": "2026-07-08T09:00:00",
      ETR: "2026-07-08T12:00:00",
      "Location Latitude": 51.5,
      "Location Longitude": -2.5,
      Postcodes: "BS1"
    },
    {
      "Incident ID": "INCD-TEST-1",
      Status: "Awaiting",
      Planned: "false",
      Category: "LV GENERIC",
      "Start Time": "2026-07-08T09:00:00",
      ETR: "2026-07-08T12:00:00",
      "Location Latitude": 51.5002,
      "Location Longitude": -2.5002,
      Postcodes: "BS1 2AA"
    }
  ];

  const incidents = samples
    .map((row, index) => normaliseIncident(provider, feed, row, index))
    .filter(Boolean);
  const grouped = deduplicateIncidents(provider, incidents);

  if (incidents.length !== 2 || grouped.length !== 1 || grouped[0].rawRecordCount !== 2) {
    throw new Error("Collector self-test failed");
  }

  console.log("Collector self-test passed.");
}

await main();

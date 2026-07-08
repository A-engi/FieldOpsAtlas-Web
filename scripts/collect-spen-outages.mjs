import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

/* ========================================================================== 
   FieldOps Atlas — SP Energy Networks outage collector
   ========================================================================== */

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(
  ROOT,
  "FieldOpsAtlas",
  "Features",
  "Weather",
  "data",
  "outages"
);

const OUTPUT_FILE = path.join(OUTPUT_DIR, "spen.geojson");
const STATUS_FILE = path.join(OUTPUT_DIR, "status.json");
const DIAGNOSTIC_FILE = path.join(OUTPUT_DIR, "spen-diagnostics.json");

const VERSION = "0.1.0-spen-isolation";
const DATASET = "distribution-network-live-outages";
const PROVIDER_ID = "spen";
const PROVIDER_NAME = "SP Energy Networks";
const OFFICIAL_MAP =
  "https://www.spenergynetworks.co.uk/pages/power_cuts.aspx";
const PORTAL = "https://spenergynetworks.opendatasoft.com";
const GLOBAL_ODS = "https://data.opendatasoft.com";
const GLOBAL_HUWISE = "https://hub.huwise.com";

const API_KEY = String(process.env.SPEN_ODS_API_KEY || "").trim();
const TIMEOUT_MS = 30_000;
const PAGE_SIZE = 100;
const MAX_ROWS = 2_500;
const USER_AGENT =
  "FieldOpsAtlas-SPEN-Collector/0.1 (+https://github.com/A-engi/FieldOpsAtlas-Web)";

if (process.argv.includes("--self-test")) {
  runSelfTest();
} else {
  await main();
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const generatedAt = new Date().toISOString();
  const previous = await readJson(OUTPUT_FILE);
  const attempts = [];

  if (!API_KEY) {
    const error = new Error(
      "SPEN_ODS_API_KEY is not configured. Add it as a GitHub Actions repository secret."
    );

    await writeFailureState(previous, generatedAt, attempts, error);
    throw error;
  }

  let rows = null;
  let selectedSource = null;

  const sources = [
    {
      id: "official-v2.1-records",
      kind: "records",
      url: `${PORTAL}/api/explore/v2.1/catalog/datasets/${DATASET}/records`,
      authenticated: true
    },
    {
      id: "official-v2.0-records",
      kind: "records",
      url: `${PORTAL}/api/explore/v2.0/catalog/datasets/${DATASET}/records`,
      authenticated: true
    },
    {
      id: "official-v2.1-geojson",
      kind: "geojson",
      url: `${PORTAL}/api/explore/v2.1/catalog/datasets/${DATASET}/exports/geojson`,
      authenticated: true
    },
    {
      id: "global-ods-v2.1-records",
      kind: "records",
      url: `${GLOBAL_ODS}/api/explore/v2.1/catalog/datasets/${DATASET}@spenergynetworks/records`,
      authenticated: false
    },
    {
      id: "global-huwise-v2.1-records",
      kind: "records",
      url: `${GLOBAL_HUWISE}/api/explore/v2.1/catalog/datasets/${DATASET}@spenergynetworks/records`,
      authenticated: false
    }
  ];

  for (const source of sources) {
    const started = Date.now();

    try {
      rows =
        source.kind === "geojson"
          ? await loadGeoJsonExport(source)
          : await loadPagedRecords(source);

      attempts.push({
        id: source.id,
        ok: true,
        authenticated: source.authenticated,
        rowCount: rows.length,
        durationMs: Date.now() - started
      });

      selectedSource = source.id;
      break;
    } catch (error) {
      attempts.push({
        id: source.id,
        ok: false,
        authenticated: source.authenticated,
        durationMs: Date.now() - started,
        error: conciseError(error)
      });
    }
  }

  if (!rows) {
    const error = new Error("Every SP Energy Networks source failed.");
    await writeFailureState(previous, generatedAt, attempts, error);
    throw error;
  }

  const normalised = [];
  let skippedRows = 0;

  rows.forEach((row, index) => {
    const incident = normaliseIncident(row, index);

    if (incident) {
      normalised.push(incident);
    } else {
      skippedRows += 1;
    }
  });

  const incidents = deduplicate(normalised);
  const features = incidents.map(toFeature);
  const categories = countCategories(incidents);

  const collection = {
    type: "FeatureCollection",
    provider: PROVIDER_ID,
    generatedAt,
    stale: false,
    features
  };

  await writeJsonAtomic(OUTPUT_FILE, collection);

  const status = {
    state: "live",
    stale: false,
    generatedAt,
    lastGoodAt: generatedAt,
    rawRows: rows.length,
    validRows: normalised.length,
    uniqueIncidents: incidents.length,
    groupedRows: Math.max(0, normalised.length - incidents.length),
    skippedRows,
    categories,
    feeds: [
      {
        id: "live",
        state: "live",
        rawRows: rows.length,
        authConfigured: true,
        selectedSource
      }
    ],
    message:
      `${categories.current} unplanned · ` +
      `${categories.planned} planned · ` +
      `${categories.restored} restored`
  };

  await mergeProviderStatus(generatedAt, status);

  await writeJsonAtomic(DIAGNOSTIC_FILE, {
    version: VERSION,
    generatedAt,
    provider: PROVIDER_ID,
    dataset: DATASET,
    authConfigured: true,
    selectedSource,
    attempts,
    result: {
      rawRows: rows.length,
      validRows: normalised.length,
      uniqueIncidents: incidents.length,
      skippedRows,
      categories
    }
  });

  console.log(
    `SPEN collection complete: ${incidents.length} incidents via ${selectedSource}.`
  );
}

async function loadPagedRecords(source) {
  const rows = [];

  for (let offset = 0; offset < MAX_ROWS; offset += PAGE_SIZE) {
    const url = new URL(source.url);
    url.searchParams.set("limit", String(PAGE_SIZE));
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("timezone", "Europe/London");

    const payload = await fetchJson(url, source);
    const page = Array.isArray(payload?.results)
      ? payload.results
      : Array.isArray(payload?.records)
        ? payload.records
        : [];

    rows.push(...page);

    const total = Number(payload?.total_count ?? payload?.nhits ?? rows.length);

    if (page.length < PAGE_SIZE || rows.length >= total) {
      break;
    }
  }

  return rows.slice(0, MAX_ROWS);
}

async function loadGeoJsonExport(source) {
  const url = new URL(source.url);
  url.searchParams.set("timezone", "Europe/London");

  const payload = await fetchJson(url, source);

  if (payload?.type !== "FeatureCollection" || !Array.isArray(payload.features)) {
    throw new Error("GeoJSON export did not return a FeatureCollection.");
  }

  return payload.features.slice(0, MAX_ROWS);
}

async function fetchJson(urlValue, source) {
  const url = urlValue instanceof URL ? urlValue : new URL(urlValue);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const headers = {
      Accept: "application/json, application/geo+json;q=0.9, */*;q=0.5",
      "Accept-Language": "en-GB,en;q=0.9",
      "Cache-Control": "no-cache",
      "User-Agent": USER_AGENT
    };

    if (source.authenticated) {
      headers.Authorization = `Apikey ${API_KEY}`;
    }

    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers
    });

    const text = await response.text();

    if (!response.ok) {
      const body = text.replace(/\s+/g, " ").trim().slice(0, 500);
      throw new Error(
        `HTTP ${response.status} ${response.statusText}` +
          (body ? ` · ${body}` : "")
      );
    }

    if (!text.trim()) {
      throw new Error("Response body was empty.");
    }

    try {
      return JSON.parse(text);
    } catch {
      throw new Error(
        `Response was not JSON · ${text.replace(/\s+/g, " ").slice(0, 300)}`
      );
    }
  } finally {
    clearTimeout(timeout);
  }
}

function normaliseIncident(row, index) {
  const raw =
    row?.type === "Feature"
      ? { ...(row.properties || {}), geometry: row.geometry }
      : row?.record || row?.fields || row;

  if (!raw || typeof raw !== "object") {
    return null;
  }

  const fields = flattenObject(raw);
  const coordinate = findCoordinate(raw, fields);

  if (!coordinate) {
    return null;
  }

  const status = textValue(
    pick(fields, [
      "status",
      "outagestatus",
      "incidentstatus",
      "eventstatus",
      "faultstatus",
      "state"
    ])
  );

  const type = textValue(
    pick(fields, [
      "type",
      "outagetype",
      "incidenttype",
      "eventtype",
      "interruptiontype",
      "natureofoutage",
      "category",
      "worktype"
    ])
  );

  const plannedValue = pick(fields, [
    "planned",
    "isplanned",
    "plannedoutage",
    "plannedunplanned",
    "plannedflag",
    "isplannedinterruption"
  ]);

  const startedAt = parseDate(
    pick(fields, [
      "starttime",
      "startdate",
      "startdatetime",
      "startedat",
      "incidentstart",
      "incidentstarttime",
      "outagestart",
      "outagestarttime",
      "plannedstart",
      "plannedstarttime",
      "planneddate",
      "from"
    ])
  );

  const restoreAt = parseDate(
    pick(fields, [
      "estimatedrestorationtime",
      "estimatedrestore",
      "estimatedend",
      "restorationtime",
      "plannedend",
      "plannedendtime",
      "endtime",
      "to",
      "etr"
    ])
  );

  const updatedAt = parseDate(
    pick(fields, [
      "updatedat",
      "updatedtime",
      "updatedate",
      "lastupdated",
      "lastupdate",
      "modified"
    ])
  );

  const combined = scalarText(raw).toLowerCase();
  let category = "current";

  if (/\b(restored|resolved|closed|completed|cancelled|canceled)\b/.test(combined)) {
    category = "restored";
  } else if (
    truthyPlanned(plannedValue) ||
    (startedAt && startedAt > Date.now() + 5 * 60 * 1000) ||
    /\b(planned|scheduled|future|maintenance|essential work|network upgrade)\b/.test(
      combined
    )
  ) {
    category = "planned";
  }

  const reference = usefulReference(
    pick(fields, [
      "reference",
      "incidentid",
      "incidentreference",
      "incidentnumber",
      "eventid",
      "eventreference",
      "outageid",
      "outagereference",
      "faultid",
      "faultreference",
      "powercutreference",
      "jobid",
      "id"
    ])
  );

  const area =
    textValue(
      pick(fields, [
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
      ])
    ) || "Published incident location";

  return {
    key:
      reference ||
      `${category}:${coordinate.lat.toFixed(4)}:${coordinate.lon.toFixed(4)}:${index}`,
    reference,
    category,
    status: status || (category === "current" ? "unplanned" : category),
    type: type || (category === "current" ? "unplanned" : category),
    area,
    lat: coordinate.lat,
    lon: coordinate.lon,
    startedAt,
    restoreAt,
    updatedAt,
    rawRecordCount: 1
  };
}

function deduplicate(incidents) {
  const groups = new Map();

  incidents.forEach((incident) => {
    const key = incident.reference
      ? `${incident.category}:${slug(incident.reference)}`
      : `${incident.category}:${incident.lat.toFixed(3)}:${incident.lon.toFixed(3)}`;

    const existing = groups.get(key);

    if (!existing) {
      groups.set(key, { ...incident });
      return;
    }

    const count = existing.rawRecordCount + 1;
    existing.lat =
      (existing.lat * existing.rawRecordCount + incident.lat) / count;
    existing.lon =
      (existing.lon * existing.rawRecordCount + incident.lon) / count;
    existing.rawRecordCount = count;
    existing.startedAt = earlier(existing.startedAt, incident.startedAt);
    existing.restoreAt = later(existing.restoreAt, incident.restoreAt);
    existing.updatedAt = later(existing.updatedAt, incident.updatedAt);

    if (
      incident.area &&
      !existing.area.toLowerCase().includes(incident.area.toLowerCase())
    ) {
      existing.area = `${existing.area} + related locations`;
    }
  });

  return [...groups.values()];
}

function toFeature(incident) {
  return {
    type: "Feature",
    id: `${PROVIDER_ID}:${incident.category}:${slug(incident.key)}`,
    geometry: {
      type: "Point",
      coordinates: [incident.lon, incident.lat]
    },
    properties: {
      providerId: PROVIDER_ID,
      provider: PROVIDER_NAME,
      feedIds: ["live"],
      reference: incident.reference || null,
      category: incident.category,
      status: incident.status,
      type: incident.type,
      area: incident.area,
      startedAt: toIso(incident.startedAt),
      restoreAt: toIso(incident.restoreAt),
      updatedAt: toIso(incident.updatedAt),
      officialUrl: OFFICIAL_MAP,
      locationQuality: "published_point",
      rawRecordCount: incident.rawRecordCount,
      coordinateSpreadKm: 0
    }
  };
}

function findCoordinate(raw, fields) {
  const geometryCandidates = [
    raw.geometry,
    raw.geo_shape,
    raw.geoshape,
    raw.feature?.geometry
  ];

  for (const candidate of geometryCandidates) {
    const result = coordinateFromGeometry(candidate?.geometry || candidate);
    if (result) return result;
  }

  const pointCandidates = [
    raw.geo_point_2d,
    raw.geopoint,
    raw.geoPoint,
    raw.coordinates,
    raw.coordinate,
    raw.position,
    raw.point
  ];

  for (const candidate of pointCandidates) {
    const result = coordinateFromValue(candidate);
    if (result) return result;
  }

  return validCoordinate(
    numberValue(
      pick(fields, [
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
      ])
    ),
    numberValue(
      pick(fields, [
        "lon",
        "lng",
        "long",
        "longitude",
        "locationlon",
        "locationlng",
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
      ])
    )
  );
}

function coordinateFromGeometry(geometry) {
  if (!geometry) return null;

  if (typeof geometry === "string") {
    try {
      return coordinateFromGeometry(JSON.parse(geometry));
    } catch {
      return coordinateFromValue(geometry);
    }
  }

  if (geometry.type === "Feature") {
    return coordinateFromGeometry(geometry.geometry);
  }

  if (geometry.type === "Point") {
    return coordinateFromValue(geometry.coordinates);
  }

  const points = collectPairs(geometry.coordinates || geometry);

  if (!points.length) return null;

  return validCoordinate(
    points.reduce((sum, point) => sum + point[1], 0) / points.length,
    points.reduce((sum, point) => sum + point[0], 0) / points.length
  );
}

function collectPairs(value, output = []) {
  if (
    Array.isArray(value) &&
    value.length >= 2 &&
    Number.isFinite(Number(value[0])) &&
    Number.isFinite(Number(value[1]))
  ) {
    const result = validCoordinate(Number(value[1]), Number(value[0]));
    if (result) output.push([result.lon, result.lat]);
    return output;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectPairs(item, output));
  }

  return output;
}

function coordinateFromValue(value) {
  if (!value) return null;

  if (Array.isArray(value) && value.length >= 2) {
    const first = Number(value[0]);
    const second = Number(value[1]);
    return validCoordinate(second, first) || validCoordinate(first, second);
  }

  if (typeof value === "object") {
    return validCoordinate(
      numberValue(value.lat ?? value.latitude ?? value.y),
      numberValue(
        value.lon ?? value.lng ?? value.long ?? value.longitude ?? value.x
      )
    );
  }

  if (typeof value === "string") {
    const matches = value.match(/-?\d+(?:\.\d+)?/g);

    if (matches?.length >= 2) {
      return coordinateFromValue(matches.slice(0, 2).map(Number));
    }
  }

  return null;
}

function validCoordinate(lat, lon) {
  return Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= 48 &&
    lat <= 62.5 &&
    lon >= -12.5 &&
    lon <= 4
    ? { lat, lon }
    : null;
}

function flattenObject(value, prefix = "", output = {}) {
  if (!value || typeof value !== "object") return output;

  Object.entries(value).forEach(([key, item]) => {
    const next = normalKey(prefix ? `${prefix}_${key}` : key);

    if (Array.isArray(item)) {
      if (
        item.every((entry) =>
          ["string", "number", "boolean"].includes(typeof entry)
        )
      ) {
        output[next] = item.join(", ");
      }
      return;
    }

    if (item && typeof item === "object") {
      flattenObject(item, next, output);
      return;
    }

    output[next] = item;
  });

  return output;
}

function pick(fields, keys) {
  for (const key of keys) {
    const value = fields[normalKey(key)];

    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }

  return null;
}

function scalarText(value, output = []) {
  if (value === null || value === undefined) return output.join(" ");

  if (["string", "number", "boolean"].includes(typeof value)) {
    output.push(String(value));
  } else if (Array.isArray(value)) {
    value.forEach((item) => scalarText(item, output));
  } else if (typeof value === "object") {
    Object.values(value).forEach((item) => scalarText(item, output));
  }

  return output.join(" ");
}

function countCategories(incidents) {
  return incidents.reduce(
    (counts, incident) => {
      counts[incident.category] += 1;
      return counts;
    },
    { current: 0, planned: 0, restored: 0 }
  );
}

async function writeFailureState(previous, generatedAt, attempts, error) {
  const features = Array.isArray(previous?.features) ? previous.features : [];

  await writeJsonAtomic(OUTPUT_FILE, {
    type: "FeatureCollection",
    provider: PROVIDER_ID,
    generatedAt: previous?.generatedAt || generatedAt,
    stale: true,
    features
  });

  const status = {
    state: "error",
    stale: features.length > 0,
    generatedAt,
    lastGoodAt: previous?.generatedAt || null,
    rawRows: 0,
    validRows: 0,
    uniqueIncidents: features.length,
    groupedRows: 0,
    skippedRows: 0,
    categories: countFeatureCategories(features),
    feeds: [
      {
        id: "live",
        state: "error",
        authConfigured: Boolean(API_KEY),
        error: conciseError(error)
      }
    ],
    message: features.length
      ? `SPEN failed; preserving ${features.length} last-good incidents`
      : conciseError(error)
  };

  await mergeProviderStatus(generatedAt, status);

  await writeJsonAtomic(DIAGNOSTIC_FILE, {
    version: VERSION,
    generatedAt,
    provider: PROVIDER_ID,
    dataset: DATASET,
    authConfigured: Boolean(API_KEY),
    attempts,
    error: conciseError(error)
  });
}

async function mergeProviderStatus(generatedAt, providerStatus) {
  const existing = (await readJson(STATUS_FILE)) || {
    version: VERSION,
    generatedAt,
    providers: {}
  };

  existing.version = VERSION;
  existing.generatedAt = generatedAt;
  existing.providers = existing.providers || {};
  existing.providers[PROVIDER_ID] = providerStatus;

  await writeJsonAtomic(STATUS_FILE, existing);
}

function countFeatureCategories(features) {
  return (features || []).reduce(
    (counts, feature) => {
      const category = feature?.properties?.category;
      const key = ["current", "planned", "restored"].includes(category)
        ? category
        : "current";

      counts[key] += 1;
      return counts;
    },
    { current: 0, planned: 0, restored: 0 }
  );
}

async function readJson(file) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return null;
  }
}

async function writeJsonAtomic(file, value) {
  const temporary = `${file}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await fs.rename(temporary, file);
}

function parseDate(value) {
  if (value === null || value === undefined || value === "") return null;

  if (typeof value === "number" && Number.isFinite(value)) {
    return value > 1e11 ? value : value * 1000;
  }

  const text = textValue(value);
  const numeric = Number(text);

  if (Number.isFinite(numeric) && text !== "") {
    return numeric > 1e11 ? numeric : numeric * 1000;
  }

  const parsed = Date.parse(text);
  return Number.isFinite(parsed) ? parsed : null;
}

function truthyPlanned(value) {
  return (
    value === true ||
    value === 1 ||
    /^(true|yes|y|1|planned)$/i.test(textValue(value))
  );
}

function usefulReference(value) {
  const text = textValue(value);

  return text &&
    !/^(0|unknown|none|null|n\/?a|not available|not published)$/i.test(text)
    ? text
    : null;
}

function textValue(value) {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value).trim();
}

function numberValue(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : NaN;
}

function normalKey(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function slug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function earlier(first, second) {
  if (!first) return second || null;
  if (!second) return first;
  return Math.min(first, second);
}

function later(first, second) {
  if (!first) return second || null;
  if (!second) return first;
  return Math.max(first, second);
}

function toIso(value) {
  return value ? new Date(value).toISOString() : null;
}

function conciseError(error) {
  if (error?.name === "AbortError") return "Request timed out.";
  return String(error?.message || error || "Unknown error").slice(0, 700);
}

function runSelfTest() {
  const samples = [
    {
      incident_id: "SPEN-1",
      outage_status: "Active",
      outage_type: "Unplanned",
      latitude: 55.8642,
      longitude: -4.2518,
      location: "Glasgow"
    },
    {
      incident_id: "SPEN-2",
      outage_status: "Scheduled",
      planned: true,
      start_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      geo_point_2d: { lat: 53.4084, lon: -2.9916 },
      location: "Liverpool"
    }
  ];

  const incidents = samples
    .map((sample, index) => normaliseIncident(sample, index))
    .filter(Boolean);

  if (
    incidents.length !== 2 ||
    incidents[0].category !== "current" ||
    incidents[1].category !== "planned"
  ) {
    throw new Error("SPEN collector self-test failed.");
  }

  const features = deduplicate(incidents).map(toFeature);

  if (features.length !== 2) {
    throw new Error("SPEN feature conversion self-test failed.");
  }

  console.log("SPEN collector self-test passed.");
}

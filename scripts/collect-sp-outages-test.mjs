import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { randomUUID } from "node:crypto";

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(
  ROOT,
  "FieldOpsAtlas",
  "Features",
  "Weather",
  "data",
  "sp-outages-test"
);

const VERSION = "0.1.0-sp-networks-test";
const DATASET = "distribution-network-live-outages";
const PROVIDER_ID = "spen";
const PROVIDER_NAME = "SP Networks";
const OFFICIAL_MAP =
  "https://www.spenergynetworks.co.uk/pages/power_cuts.aspx";

const API_KEY = String(process.env.SPEN_ODS_API_KEY || "").trim();
const TIMEOUT_MS = 30_000;
const RETRIES = 2;
const RETRY_DELAY_MS = 1_500;
const PAGE_SIZE = 100;
const MAX_ROWS = 2_500;
const USER_AGENT =
  "FieldOpsAtlas-SP-Networks-Test/0.1 (+https://github.com/A-engi/FieldOpsAtlas-Web)";

const SOURCES = [
  {
    id: "official-v2.1-records",
    label: "Official records v2.1",
    short: "O21",
    kind: "records",
    domain: "https://spenergynetworks.opendatasoft.com",
    dataset: DATASET,
    apiVersion: "v2.1",
    requiresAuth: true
  },
  {
    id: "official-v2.0-records",
    label: "Official records v2.0",
    short: "O20",
    kind: "records",
    domain: "https://spenergynetworks.opendatasoft.com",
    dataset: DATASET,
    apiVersion: "v2.0",
    requiresAuth: true
  },
  {
    id: "official-v2.1-geojson",
    label: "Official GeoJSON export",
    short: "OGJ",
    kind: "geojson",
    domain: "https://spenergynetworks.opendatasoft.com",
    dataset: DATASET,
    apiVersion: "v2.1",
    requiresAuth: true
  },
  {
    id: "global-ods-v2.1-records",
    label: "Global ODS mirror",
    short: "ODS",
    kind: "records",
    domain: "https://data.opendatasoft.com",
    dataset: `${DATASET}@spenergynetworks`,
    apiVersion: "v2.1",
    requiresAuth: false
  },
  {
    id: "global-huwise-v2.1-records",
    label: "Huwise mirror",
    short: "HUW",
    kind: "records",
    domain: "https://hub.huwise.com",
    dataset: `${DATASET}@spenergynetworks`,
    apiVersion: "v2.1",
    requiresAuth: false
  }
];

await fs.mkdir(OUTPUT_DIR, { recursive: true });

if (process.argv.includes("--self-test")) {
  runSelfTest();
} else {
  await main();
}

async function main() {
  const generatedAt = new Date().toISOString();
  const results = [];

  for (const source of SOURCES) {
    results.push(await collectSource(source, generatedAt));
  }

  const selected = selectBestSource(results);
  const selectedCollection = selected
    ? await readJson(path.join(OUTPUT_DIR, selected.file))
    : null;

  await writeJsonAtomic(path.join(OUTPUT_DIR, "selected.geojson"), {
    type: "FeatureCollection",
    provider: PROVIDER_ID,
    providerName: PROVIDER_NAME,
    selectedSource: selected?.id || null,
    generatedAt: selectedCollection?.generatedAt || generatedAt,
    stale: Boolean(selectedCollection?.stale),
    features: Array.isArray(selectedCollection?.features)
      ? selectedCollection.features
      : []
  });

  const categories = countFeatureCategories(selectedCollection?.features || []);

  const summary = {
    version: VERSION,
    generatedAt,
    dataset: DATASET,
    provider: PROVIDER_ID,
    providerName: PROVIDER_NAME,
    authConfigured: Boolean(API_KEY),
    selectedSource: selected?.id || null,
    selectedSourceLabel: selected?.label || null,
    selectedCategories: categories,
    sourceCount: SOURCES.length,
    usableSourceCount: results.filter(isUsableResult).length,
    successfulSourceCount: results.filter((result) =>
      ["live", "empty"].includes(result.state)
    ).length,
    sources: results
  };

  await writeJsonAtomic(path.join(OUTPUT_DIR, "summary.json"), summary);

  const usable = results.filter(isUsableResult).length;
  console.log(
    `SP Networks test collection complete: ${usable}/${SOURCES.length} sources usable` +
      `${selected ? `; selected ${selected.id}` : ""}.`
  );

  if (!usable) process.exitCode = 1;
}

async function collectSource(source, generatedAt) {
  const file = `${source.id}.geojson`;
  const filePath = path.join(OUTPUT_DIR, file);
  const previous = await readJson(filePath);
  const started = Date.now();

  if (source.requiresAuth && !API_KEY) {
    const features = Array.isArray(previous?.features) ? previous.features : [];

    await writeJsonAtomic(filePath, {
      type: "FeatureCollection",
      provider: PROVIDER_ID,
      providerName: PROVIDER_NAME,
      sourceId: source.id,
      sourceLabel: source.label,
      generatedAt: previous?.generatedAt || generatedAt,
      lastAttemptAt: generatedAt,
      stale: features.length > 0,
      skipped: true,
      features
    });

    return {
      id: source.id,
      label: source.label,
      short: source.short,
      kind: source.kind,
      state: features.length ? "stale" : "skipped",
      authenticated: false,
      authRequired: true,
      rawRows: 0,
      validRows: 0,
      uniqueIncidents: features.length,
      groupedRows: 0,
      skippedRows: 0,
      durationMs: Date.now() - started,
      file,
      message: "SPEN_ODS_API_KEY is not configured"
    };
  }

  try {
    const rows = source.kind === "geojson"
      ? await loadGeoJson(source)
      : await loadRecords(source);

    const normalised = [];
    let skippedRows = 0;

    rows.forEach((row, index) => {
      const incident = normaliseIncident(row, index, source);
      if (incident) normalised.push(incident);
      else skippedRows += 1;
    });

    const incidents = deduplicate(normalised);
    const features = incidents.map(toFeature);
    const state = features.length ? "live" : "empty";

    await writeJsonAtomic(filePath, {
      type: "FeatureCollection",
      provider: PROVIDER_ID,
      providerName: PROVIDER_NAME,
      sourceId: source.id,
      sourceLabel: source.label,
      generatedAt,
      stale: false,
      features
    });

    return {
      id: source.id,
      label: source.label,
      short: source.short,
      kind: source.kind,
      state,
      authenticated: source.requiresAuth,
      authRequired: source.requiresAuth,
      rawRows: rows.length,
      validRows: normalised.length,
      uniqueIncidents: incidents.length,
      groupedRows: Math.max(0, normalised.length - incidents.length),
      skippedRows,
      durationMs: Date.now() - started,
      file,
      categories: countCategories(incidents),
      message: features.length
        ? `${features.length} unique incidents`
        : "Endpoint responded with no published incidents"
    };
  } catch (error) {
    const features = Array.isArray(previous?.features) ? previous.features : [];

    await writeJsonAtomic(filePath, {
      type: "FeatureCollection",
      provider: PROVIDER_ID,
      providerName: PROVIDER_NAME,
      sourceId: source.id,
      sourceLabel: source.label,
      generatedAt: previous?.generatedAt || generatedAt,
      lastAttemptAt: generatedAt,
      stale: features.length > 0,
      features
    });

    return {
      id: source.id,
      label: source.label,
      short: source.short,
      kind: source.kind,
      state: features.length ? "stale" : "error",
      authenticated: source.requiresAuth,
      authRequired: source.requiresAuth,
      rawRows: 0,
      validRows: 0,
      uniqueIncidents: features.length,
      groupedRows: 0,
      skippedRows: 0,
      durationMs: Date.now() - started,
      file,
      error: conciseError(error),
      message: features.length
        ? `Source failed; preserving ${features.length} last-good incidents`
        : "Source failed and no last-good data is available"
    };
  }
}

async function loadRecords(source) {
  const rows = [];

  for (let offset = 0; offset < MAX_ROWS; offset += PAGE_SIZE) {
    const url = new URL(
      `/api/explore/${source.apiVersion}/catalog/datasets/${encodeURIComponent(source.dataset)}/records`,
      source.domain
    );

    url.searchParams.set("limit", String(PAGE_SIZE));
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("timezone", "Europe/London");

    const payload = await fetchJson(url, source);
    const page = Array.isArray(payload?.results)
      ? payload.results
      : Array.isArray(payload?.records)
        ? payload.records
        : null;

    if (!page) {
      throw new Error("Unrecognised records response");
    }

    rows.push(...page);

    const total = Number(payload?.total_count ?? payload?.nhits ?? rows.length);
    if (page.length < PAGE_SIZE || rows.length >= total) break;
  }

  return rows.slice(0, MAX_ROWS);
}

async function loadGeoJson(source) {
  const url = new URL(
    `/api/explore/${source.apiVersion}/catalog/datasets/${encodeURIComponent(source.dataset)}/exports/geojson`,
    source.domain
  );
  url.searchParams.set("timezone", "Europe/London");

  const payload = await fetchJson(url, source);

  if (payload?.type !== "FeatureCollection" || !Array.isArray(payload.features)) {
    throw new Error("GeoJSON export did not return a FeatureCollection");
  }

  return payload.features.slice(0, MAX_ROWS);
}

async function fetchJson(urlValue, source) {
  const url = urlValue instanceof URL ? urlValue : new URL(urlValue);
  let lastError = null;

  for (let attempt = 0; attempt < RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const headers = {
        Accept: "application/json, application/geo+json;q=0.9, */*;q=0.5",
        "Accept-Language": "en-GB,en;q=0.9",
        "Cache-Control": "no-cache",
        "User-Agent": USER_AGENT
      };

      if (
        source.requiresAuth &&
        API_KEY &&
        url.origin === "https://spenergynetworks.opendatasoft.com"
      ) {
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
          `HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ""}` +
            (body ? ` · ${body}` : "")
        );
      }

      if (!text.trim()) {
        throw new Error("Response body was empty");
      }

      try {
        return JSON.parse(text);
      } catch {
        throw new Error(
          `Response was not JSON · ${text.replace(/\s+/g, " ").slice(0, 300)}`
        );
      }
    } catch (error) {
      lastError = error;

      if (attempt < RETRIES - 1) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError || new Error("Request failed");
}

function normaliseIncident(row, index, source) {
  const raw = row?.type === "Feature"
    ? { ...(row.properties || {}), geometry: row.geometry }
    : row?.record || row?.fields || row;

  if (!raw || typeof raw !== "object") return null;

  const fields = flattenObject(raw);
  const coordinate = findCoordinate(raw, fields);
  if (!coordinate) return null;

  const status = textValue(
    pick(fields, [
      "status",
      "outagestatus",
      "incidentstatus",
      "eventstatus",
      "faultstatus",
      "resourcestatus",
      "customerstagesequencemessage",
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
      "powercutcategory",
      "natureofoutage",
      "outagecategory",
      "interruptioncategory",
      "worktype",
      "faulttype",
      "category"
    ])
  );

  const plannedValue = pick(fields, [
    "planned",
    "isplanned",
    "plannedoutage",
    "plannedunplanned",
    "plannedflag",
    "plannedstatus",
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
      "loggedtime",
      "reportedat",
      "reportedtime",
      "createdat",
      "createdtime",
      "from"
    ])
  );

  const restoreAt = parseDate(
    pick(fields, [
      "estimatedrestorationtime",
      "estimatedtimetillresolution",
      "estimatedrestore",
      "estimatedrestored",
      "restorationtime",
      "estimatedend",
      "plannedend",
      "plannedendtime",
      "etr",
      "endtime",
      "to"
    ])
  );

  const updatedAt = parseDate(
    pick(fields, [
      "updatedat",
      "updatedtime",
      "updatedate",
      "lastupdated",
      "lastupdate",
      "modified",
      "modificationdate"
    ])
  );

  const statusType = `${status} ${type}`.toLowerCase();
  const combined = scalarText(raw).toLowerCase();
  let category = "current";

  if (
    /\b(restored|resolved|closed|complete|completed|cancelled|canceled)\b/.test(
      statusType
    )
  ) {
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
    sourceId: source.id,
    sourceLabel: source.label,
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
      groups.set(key, {
        ...incident,
        areas: new Set([incident.area]),
        coordinates: [[incident.lat, incident.lon]]
      });
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
    existing.areas.add(incident.area);
    existing.coordinates.push([incident.lat, incident.lon]);
  });

  return [...groups.values()].map((incident) => {
    const areas = [...incident.areas].filter(Boolean);

    return {
      ...incident,
      area: areas.length <= 1
        ? areas[0] || "Published incident location"
        : `${areas[0]} + ${areas.length - 1} related locations`,
      areas,
      coordinateSpreadKm: spread(incident.coordinates)
    };
  });
}

function toFeature(incident) {
  return {
    type: "Feature",
    id: `${PROVIDER_ID}:${incident.sourceId}:${incident.category}:${slug(incident.key)}`,
    geometry: {
      type: "Point",
      coordinates: [incident.lon, incident.lat]
    },
    properties: {
      providerId: PROVIDER_ID,
      provider: PROVIDER_NAME,
      sourceId: incident.sourceId,
      sourceLabel: incident.sourceLabel,
      feedIds: ["live"],
      reference: incident.reference || null,
      category: incident.category,
      status: incident.status,
      type: incident.type,
      area: incident.area,
      areas: incident.areas,
      startedAt: toIso(incident.startedAt),
      restoreAt: toIso(incident.restoreAt),
      updatedAt: toIso(incident.updatedAt),
      officialUrl: OFFICIAL_MAP,
      locationQuality: "published_point",
      rawRecordCount: incident.rawRecordCount,
      coordinateSpreadKm: Number(incident.coordinateSpreadKm.toFixed(3))
    }
  };
}

function selectBestSource(results) {
  const liveWithIncidents = results
    .filter((result) => result.state === "live" && result.uniqueIncidents > 0)
    .sort((first, second) =>
      second.uniqueIncidents - first.uniqueIncidents ||
      sourcePriority(first.id) - sourcePriority(second.id)
    );

  if (liveWithIncidents.length) return liveWithIncidents[0];

  const successful = results
    .filter((result) => ["live", "empty"].includes(result.state))
    .sort((first, second) => sourcePriority(first.id) - sourcePriority(second.id));

  if (successful.length) return successful[0];

  const stale = results
    .filter((result) => result.state === "stale" && result.uniqueIncidents > 0)
    .sort((first, second) => sourcePriority(first.id) - sourcePriority(second.id));

  return stale[0] || null;
}

function sourcePriority(sourceId) {
  const index = SOURCES.findIndex((source) => source.id === sourceId);
  return index >= 0 ? index : Number.MAX_SAFE_INTEGER;
}

function isUsableResult(result) {
  return ["live", "empty", "stale"].includes(result.state);
}

function findCoordinate(raw, fields) {
  for (const candidate of [
    raw.geometry,
    raw.geo_shape,
    raw.geoshape,
    raw.shape,
    raw.feature?.geometry
  ]) {
    const result = coordinateFromGeometry(candidate?.geometry || candidate);
    if (result) return result;
  }

  for (const candidate of [
    raw.geo_point_2d,
    raw.geopoint,
    raw.geoPoint,
    raw.coordinates,
    raw.coordinate,
    raw.position,
    raw.point,
    raw.location
  ]) {
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
      const category = ["current", "planned", "restored"].includes(
        incident.category
      )
        ? incident.category
        : "current";
      counts[category] += 1;
      return counts;
    },
    { current: 0, planned: 0, restored: 0 }
  );
}

function countFeatureCategories(features) {
  return countCategories(
    (features || []).map((feature) => ({
      category: feature?.properties?.category || "current"
    }))
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
  const temporary = `${file}.${process.pid}.${randomUUID()}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await fs.rename(temporary, file);
}

function parseDate(value) {
  if (value === null || value === undefined || value === "") return null;

  if (typeof value === "number" && Number.isFinite(value)) {
    return value > 1e11 ? value : value * 1_000;
  }

  const text = textValue(value);
  const numeric = Number(text);

  if (Number.isFinite(numeric) && text !== "") {
    return numeric > 1e11 ? numeric : numeric * 1_000;
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

function spread(coordinates) {
  if (!coordinates || coordinates.length < 2) return 0;

  const lat =
    coordinates.reduce((sum, point) => sum + point[0], 0) / coordinates.length;
  const lon =
    coordinates.reduce((sum, point) => sum + point[1], 0) / coordinates.length;

  return coordinates.reduce(
    (maximum, point) =>
      Math.max(maximum, distanceKm(lat, lon, point[0], point[1])),
    0
  );
}

function distanceKm(firstLat, firstLon, secondLat, secondLon) {
  const radius = 6_371;
  const radians = (value) => (value * Math.PI) / 180;
  const latDifference = radians(secondLat - firstLat);
  const lonDifference = radians(secondLon - firstLon);
  const haversine =
    Math.sin(latDifference / 2) ** 2 +
    Math.cos(radians(firstLat)) *
      Math.cos(radians(secondLat)) *
      Math.sin(lonDifference / 2) ** 2;

  return (
    radius *
    2 *
    Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  );
}

function conciseError(error) {
  if (error?.name === "AbortError") return "Request timed out";
  return String(error?.message || error || "Unknown error").slice(0, 700);
}

function runSelfTest() {
  const source = SOURCES[0];
  const samples = [
    {
      incident_id: "SP-1",
      outage_status: "Active",
      outage_type: "Unplanned",
      latitude: 55.8642,
      longitude: -4.2518,
      location: "Glasgow"
    },
    {
      incident_id: "SP-2",
      outage_status: "Scheduled",
      planned: true,
      start_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      geo_point_2d: { lat: 53.4084, lon: -2.9916 },
      location: "Liverpool"
    },
    {
      incident_id: "SP-1",
      outage_status: "Active",
      outage_type: "Unplanned",
      latitude: 55.8643,
      longitude: -4.2519,
      location: "Glasgow"
    }
  ];

  const incidents = samples
    .map((sample, index) => normaliseIncident(sample, index, source))
    .filter(Boolean);
  const grouped = deduplicate(incidents);
  const features = grouped.map(toFeature);

  if (
    incidents.length !== 3 ||
    grouped.length !== 2 ||
    grouped[0].rawRecordCount !== 2 ||
    features.length !== 2 ||
    grouped[0].category !== "current" ||
    grouped[1].category !== "planned"
  ) {
    throw new Error("SP Networks test collector self-test failed");
  }

  const selection = selectBestSource([
    {
      id: SOURCES[0].id,
      label: SOURCES[0].label,
      state: "empty",
      uniqueIncidents: 0
    },
    {
      id: SOURCES[3].id,
      label: SOURCES[3].label,
      state: "live",
      uniqueIncidents: 2
    }
  ]);

  if (selection?.id !== SOURCES[3].id) {
    throw new Error("SP Networks source-selection self-test failed");
  }

  console.log("SP Networks test collector self-test passed.");
}

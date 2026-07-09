import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

/* ==========================================================================
   FieldOps Atlas - SP Energy Networks outage collector
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

const VERSION = "0.2.0-salesforce-lwr";
const PROVIDER_ID = "spen";
const PROVIDER_NAME = "SP Energy Networks";
const OFFICIAL_MAP = "https://powercuts.spenergynetworks.co.uk/map";
const API_ROOT =
  "https://powercuts.spenergynetworks.co.uk/lwr/apex/v67.0/SPEN_PostcodeSearchController";
const POSTCODES_ROOT = "https://api.postcodes.io/postcodes";
const PAGE_SIZE = 100;
const TIMEOUT_MS = 30_000;
const USER_AGENT =
  "FieldOpsAtlas-SPEN-Collector/0.2 (+https://github.com/A-engi/FieldOpsAtlas-Web)";

const LIVE_STATUSES = [
  "Unplanned Power Cut",
  "Live Power Cut",
  "In Progress"
];
const PLANNED_STATUSES = ["Planned-Active"];
const RESTORED_STATUSES = ["Restored", "Power Restored"];

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

  try {
    const [liveCount, plannedCount, restoredCount] = await Promise.all([
      getImpactDataCount(LIVE_STATUSES),
      getImpactDataCount(PLANNED_STATUSES),
      getImpactDataCount(RESTORED_STATUSES)
    ]);

    attempts.push({
      id: "salesforce-lwr-counts",
      ok: true,
      liveCount,
      plannedCount,
      restoredCount
    });

    const liveRows = await getImpactData(LIVE_STATUSES, liveCount);
    const plannedRows = await getImpactData(PLANNED_STATUSES, plannedCount);
    const restoredRows = await getImpactData(RESTORED_STATUSES, restoredCount);

    attempts.push({
      id: "salesforce-lwr-pages",
      ok: true,
      liveRows: liveRows.length,
      plannedRows: plannedRows.length,
      restoredRows: restoredRows.length
    });

    const rows = [
      ...liveRows.map((row) => ({ ...row, fieldopsCategory: "current" })),
      ...plannedRows.map((row) => ({ ...row, fieldopsCategory: "planned" })),
      ...restoredRows.map((row) => ({ ...row, fieldopsCategory: "restored" }))
    ];
    const geocoded = await geocodeIncidents(rows, attempts);
    const incidents = deduplicate(geocoded);
    const features = incidents.map(toFeature);
    const categories = countCategories(incidents);

    await writeJsonAtomic(OUTPUT_FILE, {
      type: "FeatureCollection",
      provider: PROVIDER_ID,
      generatedAt,
      stale: false,
      features
    });

    const status = {
      state: "live",
      stale: false,
      generatedAt,
      lastGoodAt: generatedAt,
      rawRows: rows.length,
      validRows: geocoded.length,
      uniqueIncidents: incidents.length,
      groupedRows: Math.max(0, geocoded.length - incidents.length),
      skippedRows: rows.length - geocoded.length,
      categories,
      feeds: [
        {
          id: "live",
          state: "live",
          rawRows: liveRows.length,
          selectedSource: "salesforce-lwr",
          officialCount: liveCount
        },
        {
          id: "planned",
          state: "live",
          rawRows: plannedRows.length,
          selectedSource: "salesforce-lwr",
          officialCount: plannedCount
        },
        {
          id: "restored",
          state: "live",
          rawRows: restoredRows.length,
          selectedSource: "salesforce-lwr",
          officialCount: restoredCount
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
      attempts,
      result: {
        officialLiveCount: liveCount,
        rawRows: rows.length,
        validRows: geocoded.length,
        uniqueIncidents: incidents.length,
        categories
      }
    });

    console.log(
      `SPEN collection complete: ${incidents.length} mapped incidents; ${liveCount} current faults.`
    );
  } catch (error) {
    attempts.push({
      id: "salesforce-lwr",
      ok: false,
      error: conciseError(error)
    });

    await writeFailureState(previous, generatedAt, attempts, error);
    throw error;
  }
}

async function getImpactDataCount(statuses) {
  const payload = { postcode: "", statuses };
  const count = await fetchSpenJson("getImpactDataCount", payload);
  const number = Number(count);

  if (!Number.isFinite(number)) {
    throw new Error(`SPEN count endpoint returned ${JSON.stringify(count)}`);
  }

  return number;
}

async function getImpactData(statuses, count) {
  if (count <= 0) return [];

  const pages = [];
  const totalPages = Math.ceil(count / PAGE_SIZE);

  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
    const payload = {
      paramsJson: JSON.stringify({
        postcode: "",
        pageNumber,
        pageSize: PAGE_SIZE,
        statuses
      })
    };
    const page = await fetchSpenJson("getImpactData", payload);

    if (!Array.isArray(page)) {
      throw new Error("SPEN incident endpoint did not return an array.");
    }

    pages.push(...page);
  }

  return pages;
}

async function fetchSpenJson(method, payload) {
  return fetchJson(`${API_ROOT}/${method}`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      Accept: "application/json",
      "Accept-Language": "en-GB,en;q=0.9",
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
      "X-SFDC-Allow-Continuation": "false",
      "User-Agent": USER_AGENT
    }
  });
}

async function geocodeIncidents(rows, attempts) {
  const cache = new Map();
  const output = [];

  for (const row of rows) {
    const postcode = firstPostcode(row.postcodeList);

    if (!postcode) continue;

    const coordinate = await lookupPostcode(postcode, cache);

    if (!coordinate) continue;

    output.push(normaliseIncident(row, coordinate, postcode));
  }

  attempts.push({
    id: "postcodes-io-geocoding",
    ok: true,
    lookups: cache.size,
    mappedRows: output.length
  });

  return output;
}

async function lookupPostcode(postcode, cache) {
  const key = normalisePostcode(postcode);

  if (!key) return null;
  if (cache.has(key)) return cache.get(key);

  try {
    const payload = await fetchJson(`${POSTCODES_ROOT}/${encodeURIComponent(key)}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": USER_AGENT
      }
    });
    const result = payload?.result;
    const coordinate = validCoordinate(
      Number(result?.latitude),
      Number(result?.longitude)
    );

    cache.set(key, coordinate);
    return coordinate;
  } catch {
    cache.set(key, null);
    return null;
  }
}

async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      redirect: "follow",
      ...options,
      signal: controller.signal
    });
    const text = await response.text();

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status} ${response.statusText}` +
          (text ? ` · ${text.replace(/\s+/g, " ").slice(0, 400)}` : "")
      );
    }

    return JSON.parse(text);
  } finally {
    clearTimeout(timeout);
  }
}

function normaliseIncident(row, coordinate, postcode) {
  const category = row.fieldopsCategory || categoryFromStatus(row.status, row.isPlanned);
  const reference = textValue(row.incidentReference);
  const affected = Number(row.spenPostCodesPerIncident || 0);
  const outcodes = Array.isArray(row.outCodes) ? row.outCodes.filter(Boolean) : [];
  const area =
    textValue(row.ipTown) ||
    textValue(outcodes.join(", ")) ||
    textValue(postcode) ||
    "SPEN incident";

  return {
    key: reference || `${category}:${postcode}`,
    reference,
    category,
    status: textValue(row.status) || category,
    type: row.isPlanned ? "planned" : "unplanned",
    area,
    postcode,
    postcodeList: textValue(row.postcodeList),
    outcodes,
    affectedPostcodes: Number.isFinite(affected) ? affected : 0,
    lat: coordinate.lat,
    lon: coordinate.lon,
    startedAt: parseSpenDate(row.createdDate || row.arrivalDate),
    restoreAt: parseSpenDate(row.estimatedFix),
    restoredAt: parseSpenDate(row.actualRestorationTime),
    updatedAt: parseSpenDate(row.ivrMessageAssignedTime || row.dispatchedDate),
    message: textValue(row.mainMessage || row.ivrMessage),
    rawRecordCount: 1
  };
}

function deduplicate(incidents) {
  const groups = new Map();

  incidents.forEach((incident) => {
    const key = incident.reference
      ? `${incident.category}:${slug(incident.reference)}`
      : `${incident.category}:${normalisePostcode(incident.postcode)}`;

    if (!groups.has(key)) {
      groups.set(key, { ...incident });
      return;
    }

    const existing = groups.get(key);
    existing.rawRecordCount += incident.rawRecordCount;
    existing.affectedPostcodes += incident.affectedPostcodes;
    existing.startedAt = earlier(existing.startedAt, incident.startedAt);
    existing.restoreAt = later(existing.restoreAt, incident.restoreAt);
    existing.updatedAt = later(existing.updatedAt, incident.updatedAt);
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
      feedIds: [incident.category === "planned" ? "planned" : "live"],
      reference: incident.reference || null,
      category: incident.category,
      status: incident.status,
      type: incident.type,
      area: incident.area,
      postcode: incident.postcode,
      outcodes: incident.outcodes,
      affectedPostcodes: incident.affectedPostcodes,
      postcodeList: incident.postcodeList,
      startedAt: toIso(incident.startedAt),
      restoreAt: toIso(incident.restoreAt),
      restoredAt: toIso(incident.restoredAt),
      updatedAt: toIso(incident.updatedAt),
      message: incident.message,
      officialUrl: OFFICIAL_MAP,
      locationQuality: "postcode_lookup",
      rawRecordCount: incident.rawRecordCount,
      coordinateSpreadKm: 0
    }
  };
}

function firstPostcode(value) {
  const text = textValue(value);
  const match = text.match(/[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}/i);
  return match ? match[0].toUpperCase().replace(/\s+/, " ") : "";
}

function normalisePostcode(value) {
  return textValue(value).toUpperCase().replace(/\s+/g, "");
}

function categoryFromStatus(status, isPlanned) {
  const text = textValue(status).toLowerCase();

  if (isPlanned || text.includes("planned")) return "planned";
  if (text.includes("restored")) return "restored";
  return "current";
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
        selectedSource: "salesforce-lwr",
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

  existing.version = existing.version || VERSION;
  existing.generatedAt = existing.generatedAt || generatedAt;
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

function parseSpenDate(value) {
  const text = textValue(value);

  if (!text) return null;

  const direct = Date.parse(text);

  if (Number.isFinite(direct)) return direct;

  const match = text.match(
    /^(\d{2})\/(\d{2})\/(\d{4}),?\s+(\d{2}):(\d{2})$/
  );

  if (match) {
    const [, day, month, year, hour, minute] = match;
    return Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute)
    );
  }

  const monthMatch = text.match(
    /^(\d{2})-([A-Z]{3})-(\d{4})\s+(\d{2}):(\d{2})$/i
  );

  if (monthMatch) {
    const months = {
      JAN: 0,
      FEB: 1,
      MAR: 2,
      APR: 3,
      MAY: 4,
      JUN: 5,
      JUL: 6,
      AUG: 7,
      SEP: 8,
      OCT: 9,
      NOV: 10,
      DEC: 11
    };
    const [, day, month, year, hour, minute] = monthMatch;
    return Date.UTC(
      Number(year),
      months[month.toUpperCase()],
      Number(day),
      Number(hour),
      Number(minute)
    );
  }

  return null;
}

function textValue(value) {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value).trim();
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

function slug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toIso(value) {
  return value ? new Date(value).toISOString() : null;
}

function conciseError(error) {
  if (error?.name === "AbortError") return "Request timed out.";
  return String(error?.message || error || "Unknown error").slice(0, 700);
}

function runSelfTest() {
  const sample = normaliseIncident(
    {
      incidentReference: "INCD-1",
      status: "Live Power Cut",
      fieldopsCategory: "current",
      ipTown: "RUTHIN",
      postcodeList: "LL15 1YQ, LL15 1RL",
      spenPostCodesPerIncident: 2,
      createdDate: "2026-07-08 21:31:51",
      estimatedFix: "09/07/2026, 01:46"
    },
    { lat: 53.107308, lon: -3.300041 },
    "LL15 1YQ"
  );

  const feature = toFeature(sample);

  if (
    sample.category !== "current" ||
    feature.geometry.coordinates[0] !== -3.300041 ||
    firstPostcode("LL15 1YQ, LL15 1RL") !== "LL15 1YQ"
  ) {
    throw new Error("SPEN collector self-test failed.");
  }

  console.log("SPEN collector self-test passed.");
}

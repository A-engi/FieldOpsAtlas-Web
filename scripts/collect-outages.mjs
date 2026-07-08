import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "FieldOpsAtlas", "Features", "Weather", "data", "outages");
const VERSION = "0.4.1-planned-fallbacks";
const TIMEOUT = 30000;
const LIMIT = 2500;
const UA = "FieldOpsAtlas-Outage-Collector/0.4.1 (+https://github.com/A-engi/FieldOpsAtlas-Web)";

const providers = [
  {
    id: "ukpn", name: "UK Power Networks",
    officialUrl: "https://www.ukpowernetworks.co.uk/power-cut/map",
    locationQuality: "postcode_aggregate",
    feeds: [{ id: "live", type: "ods", sources: [
      ["https://ukpowernetworks.opendatasoft.com", "ukpn-live-faults"]
    ] }]
  },
  {
    id: "npg", name: "Northern Powergrid",
    officialUrl: "https://www.northernpowergrid.com/power-cuts-map",
    locationQuality: "centralised_area",
    feeds: [{ id: "live", type: "ods", sources: [
      ["https://northernpowergrid.opendatasoft.com", "live-power-cuts-data"]
    ] }]
  },
  {
    id: "nged", name: "National Grid ED",
    officialUrl: "https://powercuts.nationalgrid.co.uk/power-cut-map",
    locationQuality: "published_point",
    feeds: [{ id: "live", type: "ckan",
      url: "https://connecteddata.nationalgrid.co.uk/api/3/action/datastore_search",
      resourceId: "292f788f-4339-455b-8cc0-153e14509d4d"
    }]
  },
  {
    id: "enwl", name: "SP Electricity North West",
    officialUrl: "https://www.enwl.co.uk/power-cuts",
    locationQuality: "upstream_switch",
    feeds: [
      { id: "live", type: "ods", sources: [
        ["https://electricitynorthwest.opendatasoft.com", "live_incidents"],
        ["https://data.opendatasoft.com", "live_incidents@electricitynorthwest"]
      ], discover: ["Electricity North West live incidents", ["electricity","north","west","incident"], ["live_incidents"]] },
      { id: "planned", type: "ods", forceCategory: "planned", sources: [
        ["https://electricitynorthwest.opendatasoft.com", "psi"],
        ["https://data.opendatasoft.com", "psi@electricitynorthwest"]
      ], discover: ["Electricity North West future planned supply interruptions", ["electricity","north","west","planned"], ["psi","planned"]] }
    ]
  },
  {
    id: "ssen", name: "SSEN Distribution",
    officialUrl: "https://powertrack.ssen.co.uk/powertrack",
    locationQuality: "published_point",
    feeds: [{ id: "live", type: "json",
      url: "https://external.distribution.prd.ssen.co.uk/opendataportal-prd/v4/api/getallfaults"
    }]
  },
  {
    id: "spen", name: "SP Energy Networks",
    officialUrl: "https://www.spenergynetworks.co.uk/pages/power_cuts.aspx",
    locationQuality: "published_point",
    feeds: [{ id: "live", type: "ods", sources: [
      ["https://spenergynetworks.opendatasoft.com", "distribution-network-live-outages"],
      ["https://data.opendatasoft.com", "distribution-network-live-outages@spenergynetworks"]
    ], discover: ["SP Energy Networks distribution network live outages", ["energy","networks","outage"], ["distribution-network-live-outages"]] }]
  },
  {
    id: "nie", name: "NIE Networks",
    officialUrl: "https://powercheck.nienetworks.co.uk/",
    locationQuality: "approximate_area",
    feeds: [
      { id: "live", type: "ods", sources: [
        ["https://nienetworks.opendatasoft.com", "nie-networks-network-faults"],
        ["https://data.opendatasoft.com", "nie-networks-network-faults@nienetworks"]
      ], discover: ["NIE Networks network faults", ["nie","network","fault"], ["nie-networks-network-faults"]] },
      { id: "planned", type: "ods", forceCategory: "planned", optional: true, sources: [
        ["https://data.opendatasoft.com", "nie-networks-planned-interruptions@nienetworks"],
        ["https://data.opendatasoft.com", "planned-interruptions@nienetworks"]
      ], discover: ["NIE Networks planned interruptions", ["nie","planned","interrupt"], ["nie-networks-planned","planned-interrupt"]] }
    ]
  }
];

await fs.mkdir(OUT, { recursive: true });
if (process.argv.includes("--self-test")) {
  selfTest();
} else {
  await main();
}

async function main() {
  const generatedAt = new Date().toISOString();
  const results = await Promise.all(providers.map(p => collect(p, generatedAt)));
  const status = {
    version: VERSION,
    generatedAt,
    providers: Object.fromEntries(results.map(r => [r.id, r.status]))
  };
  await write(path.join(OUT, "status.json"), status);
  const good = results.filter(r => ["live","partial"].includes(r.status.state)).length;
  console.log(`Outage collection complete: ${good}/${providers.length} providers usable.`);
  if (!good) process.exitCode = 1;
}

async function collect(provider, generatedAt) {
  const file = path.join(OUT, `${provider.id}.geojson`);
  const previous = await read(file);
  const rows = [];
  const feeds = [];

  for (const feed of provider.feeds) {
    try {
      const loaded = await loadFeed(feed);
      loaded.forEach((row, index) => rows.push({ row, feed, index }));
      feeds.push({ id: feed.id, state: "live", rawRows: loaded.length });
    } catch (error) {
      feeds.push({
        id: feed.id,
        state: feed.optional ? "optional-error" : "error",
        error: concise(error)
      });
    }
  }

  const required = provider.feeds.filter(f => !f.optional).map(f => f.id);
  const requiredOk = feeds.some(f => f.state === "live" && required.includes(f.id));
  if (!requiredOk) {
    const features = Array.isArray(previous?.features) ? previous.features : [];
    await write(file, {
      type: "FeatureCollection",
      provider: provider.id,
      generatedAt: previous?.generatedAt || generatedAt,
      stale: true,
      features
    });
    return {
      id: provider.id,
      status: {
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
        feeds,
        message: features.length
          ? `All required feeds failed; preserving ${features.length} last-good incidents`
          : "All required feeds failed and no last-good data is available"
      }
    };
  }

  const candidates = [];
  let skippedRows = 0;
  for (const item of rows) {
    const incident = normalise(provider, item.feed, item.row, item.index);
    if (incident) candidates.push(incident);
    else skippedRows += 1;
  }

  const incidents = dedupe(provider, candidates);
  const features = incidents.map(toFeature);
  await write(file, {
    type: "FeatureCollection",
    provider: provider.id,
    generatedAt,
    stale: false,
    features
  });

  const requiredFailures = feeds.filter(f => f.state === "error");
  const optionalFailures = feeds.filter(f => f.state === "optional-error");
  const categories = countCategories(incidents);
  return {
    id: provider.id,
    status: {
      state: requiredFailures.length ? "partial" : "live",
      stale: false,
      generatedAt,
      lastGoodAt: generatedAt,
      rawRows: rows.length,
      validRows: candidates.length,
      uniqueIncidents: incidents.length,
      groupedRows: Math.max(0, candidates.length - incidents.length),
      skippedRows,
      categories,
      feeds,
      message: [
        `${categories.current} current`,
        `${categories.planned} planned`,
        `${categories.restored} restored`,
        requiredFailures.length ? `${requiredFailures.length} required feed failed` : "",
        optionalFailures.length ? `${optionalFailures.length} optional feed unavailable` : ""
      ].filter(Boolean).join(" · ")
    }
  };
}

async function loadFeed(feed) {
  if (feed.type === "ods") return loadOds(feed);
  if (feed.type === "ckan") return loadCkan(feed);
  if (feed.type === "json") {
    const payload = await getJson(feed.url);
    return extractRows(payload).slice(0, LIMIT);
  }
  throw new Error(`Unsupported feed type ${feed.type}`);
}

async function loadOds(feed) {
  const failures = [];
  for (const [domain, dataset] of feed.sources || []) {
    try {
      return await loadOdsDataset(domain, dataset);
    } catch (error) {
      failures.push(`${dataset}: ${concise(error)}`);
    }
  }
  if (feed.discover) {
    try {
      const dataset = await discoverOds(...feed.discover);
      return await loadOdsDataset("https://data.opendatasoft.com", dataset);
    } catch (error) {
      failures.push(`discovery: ${concise(error)}`);
    }
  }
  throw new Error(failures.join(" | ") || "No ODS source available");
}

async function loadOdsDataset(domain, dataset) {
  const rows = [];
  for (let offset = 0; offset < LIMIT; offset += 100) {
    const url = new URL(`/api/explore/v2.1/catalog/datasets/${encodeURIComponent(dataset)}/records`, domain);
    url.searchParams.set("limit", "100");
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("timezone", "Europe/London");
    const payload = await getJson(url);
    const page = Array.isArray(payload?.results) ? payload.results : [];
    rows.push(...page);
    if (page.length < 100 || rows.length >= Number(payload?.total_count ?? rows.length)) break;
  }
  return rows.slice(0, LIMIT);
}

async function discoverOds(query, required, preferred) {
  const url = new URL("/api/explore/v2.1/catalog/datasets", "https://data.opendatasoft.com");
  url.searchParams.set("limit", "100");
  url.searchParams.set("q", query);
  const payload = await getJson(url);
  let best = null;
  let bestScore = -Infinity;
  for (const d of payload?.results || []) {
    const id = String(d?.dataset_id || d?.datasetid || "");
    const meta = d?.metas?.default || d?.metas || {};
    const hay = [id, meta.title, meta.description, meta.publisher, meta.keyword, meta.theme]
      .flat().filter(Boolean).join(" ").toLowerCase();
    let score = 0;
    for (const term of required || []) score += hay.includes(term) ? 12 : -20;
    for (const prefix of preferred || []) {
      if (id.toLowerCase().startsWith(prefix)) score += 30;
      if (hay.includes(prefix.replace(/[-_]/g, " "))) score += 10;
    }
    if (hay.includes("historic") || hay.includes("archive")) score -= 25;
    if (score > bestScore) { best = id; bestScore = score; }
  }
  if (!best || bestScore < 0) throw new Error("No matching ODS mirror dataset found");
  return best;
}

async function loadCkan(feed) {
  const rows = [];
  for (let offset = 0; offset < LIMIT; offset += 1000) {
    const url = new URL(feed.url);
    url.searchParams.set("resource_id", feed.resourceId);
    url.searchParams.set("limit", "1000");
    url.searchParams.set("offset", String(offset));
    const payload = await getJson(url);
    const page = payload?.result?.records;
    if (!payload?.success || !Array.isArray(page)) throw new Error("Invalid CKAN response");
    rows.push(...page);
    if (page.length < 1000 || rows.length >= Number(payload.result.total ?? rows.length)) break;
  }
  return rows.slice(0, LIMIT);
}

function normalise(provider, feed, row, index) {
  const raw = row?.type === "Feature"
    ? { ...(row.properties || {}), geometry: row.geometry }
    : row?.record || row?.fields || row;
  if (!raw || typeof raw !== "object") return null;

  const fields = flatten(raw);
  const coordinate = findCoordinate(raw, fields);
  if (!coordinate) return null;

  const status = value(pick(fields, [
    "status","incidentstatus","outagestatus","eventstatus","faultstatus",
    "resourcestatus","customerstagesequencemessage","state"
  ]));
  const type = value(pick(fields, [
    "type","incidenttype","outagetype","eventtype","interruptiontype",
    "powercutcategory","natureofoutage","outagecategory","interruptioncategory",
    "worktype","faulttype","category"
  ]));
  const plannedValue = pick(fields, [
    "planned","isplanned","plannedoutage","plannedunplanned",
    "plannedflag","plannedstatus","isplannedinterruption"
  ]);
  const startedAt = date(pick(fields, [
    "starttime","startdate","startdatetime","startedat","incidentstart",
    "incidentstarttime","outagestart","outagestarttime","plannedstart",
    "plannedstarttime","planneddate","loggedtime","reportedat","reportedtime",
    "createdat","createdtime","from"
  ]));
  const restoreAt = date(pick(fields, [
    "estimatedrestorationtime","estimatedtimetillresolution","estimatedrestore",
    "estimatedrestored","restorationtime","estimatedend","plannedend",
    "plannedendtime","etr","endtime","to"
  ]));
  const updatedAt = date(pick(fields, [
    "updatedat","updatedtime","updatedate","lastupdated","lastupdate",
    "modified","modificationdate"
  ]));

  const statusType = `${status} ${type}`.toLowerCase();
  const rawText = scalarText(raw).toLowerCase();
  let category = feed.forceCategory || "current";
  if (/\b(restored|resolved|closed|complete|completed|cancelled|canceled)\b/.test(statusType)) {
    category = "restored";
  } else if (
    feed.forceCategory === "planned" ||
    planned(plannedValue) ||
    (startedAt && startedAt > Date.now() + 300000) ||
    /\b(planned|scheduled|future|maintenance|network upgrade|essential work)\b/.test(rawText) ||
    /planned work on (the )?system/.test(rawText)
  ) {
    category = "planned";
  }

  const referenceValue = pick(fields, [
    "reference","incidentid","incidentreference","incidentnumber","incidentnum",
    "incidentno","eventid","eventreference","eventplannumber","outageid",
    "outagereference","faultid","faultreference","powercutreference","jobid","id"
  ]);
  const reference = usefulReference(referenceValue) ? String(referenceValue).trim() : null;
  const area = value(pick(fields, [
    "area","location","locality","town","description","incidentlocation",
    "outagelocation","affectedarea","postcodes","postcode","region"
  ])) || "Published incident location";

  return {
    providerId: provider.id,
    provider: provider.name,
    feedId: feed.id,
    reference,
    category,
    status: status || category,
    type: type || category,
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

function dedupe(provider, incidents) {
  const groups = new Map();
  const fallback = [];
  for (const incident of incidents) {
    if (incident.reference) {
      const key = `${provider.id}:${incident.category}:${slug(incident.reference)}`;
      groups.has(key) ? merge(groups.get(key), incident) : groups.set(key, group(incident, key));
      continue;
    }
    const found = fallback.find(g => canMerge(g, incident));
    found ? merge(found, incident) : fallback.push(group(incident, null));
  }
  return [...groups.values(), ...fallback].map(g => finish(provider, g));
}

function group(i, key) {
  return {
    key,
    providerId: i.providerId,
    provider: i.provider,
    feedIds: new Set([i.feedId]),
    reference: i.reference,
    category: i.category,
    status: i.status,
    type: i.type,
    areas: new Set([i.area]),
    coords: [[i.lat, i.lon]],
    lat: i.lat,
    lon: i.lon,
    startedAt: i.startedAt,
    restoreAt: i.restoreAt,
    updatedAt: i.updatedAt,
    officialUrl: i.officialUrl,
    locationQuality: i.locationQuality,
    count: 1
  };
}

function merge(g, i) {
  g.feedIds.add(i.feedId);
  g.areas.add(i.area);
  g.coords.push([i.lat, i.lon]);
  g.lat += i.lat;
  g.lon += i.lon;
  g.count += 1;
  g.startedAt = earlier(g.startedAt, i.startedAt);
  g.restoreAt = later(g.restoreAt, i.restoreAt);
  g.updatedAt = later(g.updatedAt, i.updatedAt);
}

function finish(provider, g) {
  const lat = g.lat / g.count;
  const lon = g.lon / g.count;
  const areas = [...g.areas].filter(Boolean);
  const key = g.key || [
    provider.id, g.category, lat.toFixed(3), lon.toFixed(3),
    g.startedAt ? Math.floor(g.startedAt / 1800000) : "unknown",
    slug(areas[0] || "location").slice(0, 48)
  ].join(":");
  return {
    key,
    providerId: g.providerId,
    provider: g.provider,
    feedIds: [...g.feedIds],
    reference: g.reference,
    category: g.category,
    status: g.status,
    type: g.type,
    area: areas.length <= 1
      ? areas[0] || "Published incident location"
      : `${areas[0]} + ${areas.length - 1} related locations`,
    areas,
    lat, lon,
    startedAt: g.startedAt,
    restoreAt: g.restoreAt,
    updatedAt: g.updatedAt,
    officialUrl: g.officialUrl,
    locationQuality: g.locationQuality,
    rawRecordCount: g.count,
    coordinateSpreadKm: spread(g.coords)
  };
}

function canMerge(g, i) {
  if (g.category !== i.category) return false;
  const lat = g.lat / g.count;
  const lon = g.lon / g.count;
  const d = km(lat, lon, i.lat, i.lon);
  if (d > 1.5) return false;
  if (g.startedAt && i.startedAt && Math.abs(g.startedAt - i.startedAt) > 5400000) return false;
  return d <= 0.5 || areaSimilarity([...g.areas][0], i.area) >= 0.35;
}

function toFeature(i) {
  return {
    type: "Feature",
    id: i.key,
    geometry: { type: "Point", coordinates: [i.lon, i.lat] },
    properties: {
      providerId: i.providerId,
      provider: i.provider,
      feedIds: i.feedIds,
      reference: i.reference,
      category: i.category,
      status: i.status,
      type: i.type,
      area: i.area,
      areas: i.areas,
      startedAt: iso(i.startedAt),
      restoreAt: iso(i.restoreAt),
      updatedAt: iso(i.updatedAt),
      officialUrl: i.officialUrl,
      locationQuality: i.locationQuality,
      rawRecordCount: i.rawRecordCount,
      coordinateSpreadKm: Number(i.coordinateSpreadKm.toFixed(3))
    }
  };
}

function countCategories(items) {
  return items.reduce((c, i) => {
    c[["current","planned","restored"].includes(i.category) ? i.category : "current"] += 1;
    return c;
  }, { current: 0, planned: 0, restored: 0 });
}

function countFeatureCategories(features) {
  return countCategories((features || []).map(f => ({ category: f?.properties?.category || "current" })));
}

function extractRows(payload) {
  if (Array.isArray(payload)) return payload;
  for (const item of [
    payload?.results,payload?.result?.records,payload?.records,payload?.features,
    payload?.data,payload?.outages,payload?.faults,payload?.incidents,payload?.items,payload?.result
  ]) if (Array.isArray(item)) return item;
  const queue = [payload], seen = new Set();
  while (queue.length) {
    const value = queue.shift();
    if (!value || typeof value !== "object" || seen.has(value)) continue;
    seen.add(value);
    for (const item of Object.values(value)) {
      if (Array.isArray(item) && item.length && item.every(x => x && typeof x === "object")) return item;
      if (item && typeof item === "object") queue.push(item);
    }
  }
  return [];
}

function findCoordinate(raw, fields) {
  for (const candidate of [raw.geometry,raw.geo_shape,raw.geoshape,raw.shape,raw.feature?.geometry]) {
    const c = geometry(candidate?.geometry || candidate);
    if (c) return c;
  }
  for (const candidate of [
    raw.geo_point_2d,raw.geopoint,raw.geoPoint,raw.coordinates,
    raw.coordinate,raw.position,raw.point,raw.location
  ]) {
    const c = coordinate(candidate);
    if (c) return c;
  }
  return valid(
    number(pick(fields, ["lat","latitude","locationlat","locationlatitude","incidentlat","incidentlatitude","faultlat","faultlatitude","geopoint2dlat","geopointlat","y"])),
    number(pick(fields, ["lon","lng","long","longitude","locationlon","locationlng","locationlong","locationlongitude","incidentlon","incidentlng","incidentlongitude","faultlon","faultlng","faultlongitude","geopoint2dlon","geopointlon","x"]))
  );
}

function geometry(g) {
  if (!g) return null;
  if (typeof g === "string") {
    try { return geometry(JSON.parse(g)); } catch { return coordinate(g); }
  }
  if (g.type === "Feature") return geometry(g.geometry);
  if (g.type === "Point") return coordinate(g.coordinates);
  const points = pairs(g.coordinates || g);
  if (!points.length) return null;
  return valid(
    points.reduce((s,p) => s + p[1], 0) / points.length,
    points.reduce((s,p) => s + p[0], 0) / points.length
  );
}

function pairs(value, out = []) {
  if (Array.isArray(value) && value.length >= 2 && Number.isFinite(Number(value[0])) && Number.isFinite(Number(value[1]))) {
    const c = valid(Number(value[1]), Number(value[0]));
    if (c) out.push([c.lon, c.lat]);
  } else if (Array.isArray(value)) {
    value.forEach(v => pairs(v, out));
  }
  return out;
}

function coordinate(value) {
  if (!value) return null;
  if (Array.isArray(value) && value.length >= 2) {
    const a = Number(value[0]), b = Number(value[1]);
    return valid(b, a) || valid(a, b);
  }
  if (typeof value === "object") return valid(
    number(value.lat ?? value.latitude ?? value.y),
    number(value.lon ?? value.lng ?? value.long ?? value.longitude ?? value.x)
  );
  if (typeof value === "string") {
    const parts = value.match(/-?\d+(?:\.\d+)?/g);
    if (parts?.length >= 2) return coordinate(parts.slice(0,2).map(Number));
  }
  return null;
}

function valid(lat, lon) {
  return Number.isFinite(lat) && Number.isFinite(lon) &&
    lat >= 48 && lat <= 62.5 && lon >= -12.5 && lon <= 4 ? { lat, lon } : null;
}

function flatten(value, prefix = "", out = {}) {
  if (!value || typeof value !== "object") return out;
  for (const [key, item] of Object.entries(value)) {
    const next = normalKey(prefix ? `${prefix}_${key}` : key);
    if (Array.isArray(item)) {
      if (item.every(x => ["string","number","boolean"].includes(typeof x))) out[next] = item.join(", ");
    } else if (item && typeof item === "object") flatten(item, next, out);
    else out[next] = item;
  }
  return out;
}

function pick(fields, keys) {
  for (const key of keys) {
    const v = fields[normalKey(key)];
    if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  }
  return null;
}

function scalarText(value, out = []) {
  if (value === null || value === undefined) return out.join(" ");
  if (["string","number","boolean"].includes(typeof value)) out.push(String(value));
  else if (Array.isArray(value)) value.forEach(v => scalarText(v, out));
  else if (typeof value === "object") Object.values(value).forEach(v => scalarText(v, out));
  return out.join(" ");
}

function value(v) {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v).trim();
}

function date(v) {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "number" && Number.isFinite(v)) return v > 1e11 ? v : v * 1000;
  const t = value(v), n = Number(t);
  if (Number.isFinite(n) && t !== "") return n > 1e11 ? n : n * 1000;
  const parsed = Date.parse(t);
  return Number.isFinite(parsed) ? parsed : null;
}

function planned(v) {
  return v === true || v === 1 || /^(true|yes|y|1|planned)$/i.test(value(v));
}

function usefulReference(v) {
  const t = value(v);
  return t && !/^(0|unknown|none|null|n\/?a|not available|not published)$/i.test(t);
}

function normalKey(v) { return String(v).toLowerCase().replace(/[^a-z0-9]/g, ""); }
function slug(v) { return String(v || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }
function number(v) { const n = Number(v); return Number.isFinite(n) ? n : NaN; }
function iso(v) { return v ? new Date(v).toISOString() : null; }
function earlier(a,b) { return !a ? b || null : !b ? a : Math.min(a,b); }
function later(a,b) { return !a ? b || null : !b ? a : Math.max(a,b); }

function areaSimilarity(a,b) {
  const A = tokens(a), B = tokens(b);
  if (!A.size || !B.size) return 0;
  let shared = 0;
  for (const t of A) if (B.has(t)) shared += 1;
  return shared / Math.max(A.size, B.size);
}

function tokens(v) {
  const ignored = new Set(["the","and","near","area","location","published","incident","outage","power","cut","affected"]);
  return new Set((String(v || "").toLowerCase().match(/[a-z0-9]+/g) || []).filter(t => t.length > 2 && !ignored.has(t)));
}

function spread(coords) {
  if (!coords || coords.length < 2) return 0;
  const lat = coords.reduce((s,p) => s + p[0], 0) / coords.length;
  const lon = coords.reduce((s,p) => s + p[1], 0) / coords.length;
  return coords.reduce((m,p) => Math.max(m, km(lat,lon,p[0],p[1])), 0);
}

function km(a,b,c,d) {
  const r = 6371, rad = x => x * Math.PI / 180;
  const x = rad(c-a), y = rad(d-b);
  const h = Math.sin(x/2) ** 2 + Math.cos(rad(a)) * Math.cos(rad(c)) * Math.sin(y/2) ** 2;
  return r * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1-h));
}

async function getJson(input) {
  const url = input instanceof URL ? input.toString() : input;
  let last;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        redirect: "follow",
        headers: {
          Accept: "application/json, text/plain;q=0.9, */*;q=0.8",
          "Accept-Language": "en-GB,en;q=0.9",
          "Cache-Control": "no-cache",
          "User-Agent": UA
        }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    } catch (error) {
      last = error;
      if (!attempt) await new Promise(resolve => setTimeout(resolve, 1500));
    } finally {
      clearTimeout(timer);
    }
  }
  throw last || new Error("Request failed");
}

async function read(file) {
  try { return JSON.parse(await fs.readFile(file, "utf8")); } catch { return null; }
}

async function write(file, data) {
  const temp = `${file}.tmp`;
  await fs.writeFile(temp, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  await fs.rename(temp, file);
}

function concise(error) {
  return error?.name === "AbortError"
    ? "Timed out"
    : String(error?.message || "Unavailable").slice(0, 220);
}

function selfTest() {
  const p = providers.find(x => x.id === "nged"), f = p.feeds[0];
  const duplicate = [
    { "Incident ID": "X", Status: "Awaiting", Planned: false, "Location Latitude": 51.5, "Location Longitude": -2.5 },
    { "Incident ID": "X", Status: "Awaiting", Planned: false, "Location Latitude": 51.5002, "Location Longitude": -2.5002 }
  ].map((row,index) => normalise(p,f,row,index)).filter(Boolean);
  const grouped = dedupe(p, duplicate);
  const byText = normalise(p,f,{ "Incident ID":"P1","Work Description":"Planned Work on System","Location Latitude":54.1,"Location Longitude":-1.2 },0);
  const byDate = normalise(p,f,{ "Incident ID":"P2","Start Time":new Date(Date.now()+3600000).toISOString(),"Location Latitude":53.2,"Location Longitude":-2.1 },1);
  if (grouped.length !== 1 || grouped[0].rawRecordCount !== 2 || byText?.category !== "planned" || byDate?.category !== "planned") {
    throw new Error("Collector self-test failed");
  }
  console.log("Collector self-test passed.");
}

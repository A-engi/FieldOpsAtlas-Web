import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const OUT = path.join(
  ROOT,
  "FieldOpsAtlas",
  "Features",
  "Weather",
  "data",
  "outages"
);

const VERSION = "0.4.4-spen-source-fallbacks";
const TIMEOUT = 30_000;
const LIMIT = 2_500;
const PAGE_SIZE = 100;
const UA =
  "FieldOpsAtlas-Outage-Collector/0.4.4 (+https://github.com/A-engi/FieldOpsAtlas-Web)";
const DEBUG_HTTP = /^(1|true|yes)$/i.test(
  String(process.env.OUTAGE_DEBUG_HTTP || "")
);
const MAX_ERROR_BODY = 600;

const providers = [
  {
    id: "ukpn",
    name: "UK Power Networks",
    officialUrl: "https://www.ukpowernetworks.co.uk/power-cut/map",
    locationQuality: "postcode_aggregate",
    feeds: [
      {
        id: "live",
        type: "ods",
        sources: [
          ["https://ukpowernetworks.opendatasoft.com", "ukpn-live-faults"]
        ]
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
        sources: [
          ["https://northernpowergrid.opendatasoft.com", "live-power-cuts-data"]
        ]
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
        type: "ckan",
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
        authEnv: "ENWL_ODS_API_KEY",
        authOrigins: ["https://electricitynorthwest.opendatasoft.com"],
        sources: [
          ["https://electricitynorthwest.opendatasoft.com", "live_incidents"],
          ["https://data.opendatasoft.com", "live_incidents@electricitynorthwest"]
        ],
        discover: [
          "Electricity North West live incidents",
          ["electricity", "north", "west", "incident"],
          ["live_incidents"]
        ]
      },
      {
        id: "planned",
        type: "ods",
        authEnv: "ENWL_ODS_API_KEY",
        authOrigins: ["https://electricitynorthwest.opendatasoft.com"],
        forceCategory: "planned",
        sources: [
          ["https://electricitynorthwest.opendatasoft.com", "psi"],
          ["https://data.opendatasoft.com", "psi@electricitynorthwest"]
        ],
        discover: [
          "Electricity North West future planned supply interruptions",
          ["electricity", "north", "west", "planned"],
          ["psi", "planned"]
        ]
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
        authEnv: "SPEN_ODS_API_KEY",
        authOrigins: ["https://spenergynetworks.opendatasoft.com"],
        sources: [
          {
            id: "official-v2.1-records",
            domain: "https://spenergynetworks.opendatasoft.com",
            dataset: "distribution-network-live-outages",
            apiVersion: "v2.1",
            kind: "records"
          },
          {
            id: "official-v2.0-records",
            domain: "https://spenergynetworks.opendatasoft.com",
            dataset: "distribution-network-live-outages",
            apiVersion: "v2.0",
            kind: "records"
          },
          {
            id: "official-v2.1-geojson",
            domain: "https://spenergynetworks.opendatasoft.com",
            dataset: "distribution-network-live-outages",
            apiVersion: "v2.1",
            kind: "geojson"
          },
          {
            id: "global-ods-v2.1-records",
            domain: "https://data.opendatasoft.com",
            dataset: "distribution-network-live-outages@spenergynetworks",
            apiVersion: "v2.1",
            kind: "records"
          },
          {
            id: "global-huwise-v2.1-records",
            domain: "https://hub.huwise.com",
            dataset: "distribution-network-live-outages@spenergynetworks",
            apiVersion: "v2.1",
            kind: "records"
          }
        ],
        discover: [
          "SP Energy Networks distribution network live outages",
          ["energy", "networks", "outage"],
          ["distribution-network-live-outages"]
        ]
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
        authEnv: "NIE_ODS_API_KEY",
        authOrigins: ["https://nienetworks.opendatasoft.com"],
        sources: [
          ["https://nienetworks.opendatasoft.com", "nie-networks-network-faults"],
          ["https://data.opendatasoft.com", "nie-networks-network-faults@nienetworks"]
        ],
        discover: [
          "NIE Networks network faults",
          ["nie", "network", "fault"],
          ["nie-networks-network-faults"]
        ]
      },
      {
        id: "planned",
        type: "ods",
        authEnv: "NIE_ODS_API_KEY",
        authOrigins: ["https://nienetworks.opendatasoft.com"],
        forceCategory: "planned",
        optional: true,
        sources: [
          ["https://data.opendatasoft.com", "nie-networks-planned-interruptions@nienetworks"],
          ["https://data.opendatasoft.com", "planned-interruptions@nienetworks"]
        ],
        discover: [
          "NIE Networks planned interruptions",
          ["nie", "planned", "interrupt"],
          ["nie-networks-planned", "planned-interrupt"]
        ]
      }
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
  const results = await Promise.all(
    providers.map((provider) => collect(provider, generatedAt))
  );

  const status = {
    version: VERSION,
    generatedAt,
    providers: Object.fromEntries(results.map((result) => [result.id, result.status]))
  };

  await write(path.join(OUT, "status.json"), status);

  const good = results.filter((result) =>
    ["live", "partial"].includes(result.status.state)
  ).length;

  console.log(
    `Outage collection complete: ${good}/${providers.length} providers usable.`
  );

  if (!good) process.exitCode = 1;
}

async function collect(provider, generatedAt) {
  const file = path.join(OUT, `${provider.id}.geojson`);
  const previous = await read(file);
  const rows = [];
  const feeds = [];

  for (const feed of provider.feeds) {
    try {
      const result = await loadFeed(feed);
      result.rows.forEach((row, index) => rows.push({ row, feed, index }));

      feeds.push({
        id: feed.id,
        state: "live",
        rawRows: result.rows.length,
        authConfigured: hasAuth(feed),
        ...(result.selectedSource ? { selectedSource: result.selectedSource } : {})
      });
    } catch (error) {
      feeds.push({
        id: feed.id,
        state: feed.optional ? "optional-error" : "error",
        authConfigured: hasAuth(feed),
        error: concise(error)
      });
    }
  }

  const required = provider.feeds
    .filter((feed) => !feed.optional)
    .map((feed) => feed.id);
  const requiredOk = feeds.some(
    (feed) => feed.state === "live" && required.includes(feed.id)
  );

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

  const requiredFailures = feeds.filter((feed) => feed.state === "error");
  const optionalFailures = feeds.filter(
    (feed) => feed.state === "optional-error"
  );
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
        `${categories.current} unplanned`,
        `${categories.planned} planned`,
        `${categories.restored} restored`,
        requiredFailures.length
          ? `${requiredFailures.length} required feed failed`
          : "",
        optionalFailures.length
          ? `${optionalFailures.length} optional feed unavailable`
          : ""
      ]
        .filter(Boolean)
        .join(" · ")
    }
  };
}

async function loadFeed(feed) {
  if (feed.type === "ods") return loadOds(feed);

  if (feed.type === "ckan") {
    return {
      rows: await loadCkan(feed),
      selectedSource: "ckan"
    };
  }

  if (feed.type === "json") {
    const payload = await getJson(feed.url, { feed });
    return {
      rows: extractRows(payload).slice(0, LIMIT),
      selectedSource: "json"
    };
  }

  throw new Error(`Unsupported feed type ${feed.type}`);
}

async function loadOds(feed) {
  const failures = [];

  for (const sourceValue of feed.sources || []) {
    const source = normaliseOdsSource(sourceValue);
    const started = Date.now();

    try {
      const rows = source.kind === "geojson"
        ? await loadOdsGeoJson(source, feed)
        : await loadOdsDataset(source, feed);

      if (!Array.isArray(rows)) {
        throw new Error("ODS source did not return an array");
      }

      return {
        rows,
        selectedSource: source.id,
        durationMs: Date.now() - started
      };
    } catch (error) {
      failures.push(`${source.id}: ${concise(error)}`);
    }
  }

  if (feed.discover) {
    try {
      const dataset = await discoverOds(feed, ...feed.discover);
      const source = {
        id: `discovered:${dataset}`,
        domain: "https://data.opendatasoft.com",
        dataset,
        apiVersion: "v2.1",
        kind: "records"
      };

      return {
        rows: await loadOdsDataset(source, feed),
        selectedSource: source.id
      };
    } catch (error) {
      failures.push(`discovery: ${concise(error)}`);
    }
  }

  throw new Error(failures.join(" | ") || "No ODS source available");
}

function normaliseOdsSource(source) {
  if (Array.isArray(source)) {
    return {
      id: `${source[0]}:${source[1]}`,
      domain: source[0],
      dataset: source[1],
      apiVersion: "v2.1",
      kind: "records"
    };
  }

  return {
    id: source.id || `${source.domain}:${source.dataset}`,
    domain: source.domain,
    dataset: source.dataset,
    apiVersion: source.apiVersion || "v2.1",
    kind: source.kind || "records"
  };
}

async function loadOdsDataset(source, feed) {
  const rows = [];

  for (let offset = 0; offset < LIMIT; offset += PAGE_SIZE) {
    const url = new URL(
      `/api/explore/${source.apiVersion}/catalog/datasets/${encodeURIComponent(source.dataset)}/records`,
      source.domain
    );

    url.searchParams.set("limit", String(PAGE_SIZE));
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("timezone", "Europe/London");

    const payload = await getJson(url, {
      feed,
      dataset: source.dataset,
      portalDomain: source.domain,
      sourceId: source.id
    });

    const page = Array.isArray(payload?.results)
      ? payload.results
      : Array.isArray(payload?.records)
        ? payload.records
        : null;

    if (!page) {
      throw new Error("Unrecognised ODS records response");
    }

    rows.push(...page);

    const total = Number(payload?.total_count ?? payload?.nhits ?? rows.length);
    if (page.length < PAGE_SIZE || rows.length >= total) break;
  }

  return rows.slice(0, LIMIT);
}

async function loadOdsGeoJson(source, feed) {
  const url = new URL(
    `/api/explore/${source.apiVersion}/catalog/datasets/${encodeURIComponent(source.dataset)}/exports/geojson`,
    source.domain
  );
  url.searchParams.set("timezone", "Europe/London");

  const payload = await getJson(url, {
    feed,
    dataset: source.dataset,
    portalDomain: source.domain,
    sourceId: source.id
  });

  if (payload?.type !== "FeatureCollection" || !Array.isArray(payload.features)) {
    throw new Error("GeoJSON export did not return a FeatureCollection");
  }

  return payload.features.slice(0, LIMIT);
}

async function discoverOds(feed, query, required, preferred) {
  const url = new URL(
    "/api/explore/v2.1/catalog/datasets",
    "https://data.opendatasoft.com"
  );
  url.searchParams.set("limit", "100");
  url.searchParams.set("q", query);

  const payload = await getJson(url, {
    feed,
    dataset: query,
    portalDomain: "https://data.opendatasoft.com"
  });

  let best = null;
  let bestScore = -Infinity;

  for (const dataset of payload?.results || []) {
    const id = String(dataset?.dataset_id || dataset?.datasetid || "");
    const meta = dataset?.metas?.default || dataset?.metas || {};
    const haystack = [
      id,
      meta.title,
      meta.description,
      meta.publisher,
      meta.keyword,
      meta.theme
    ]
      .flat()
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    let score = 0;

    for (const term of required || []) {
      score += haystack.includes(term) ? 12 : -20;
    }

    for (const prefix of preferred || []) {
      if (id.toLowerCase().startsWith(prefix)) score += 30;
      if (haystack.includes(prefix.replace(/[-_]/g, " "))) score += 10;
    }

    if (haystack.includes("historic") || haystack.includes("archive")) {
      score -= 25;
    }

    if (score > bestScore) {
      best = id;
      bestScore = score;
    }
  }

  if (!best || bestScore < 0) {
    throw new Error("No matching ODS mirror dataset found");
  }

  return best;
}

async function loadCkan(feed) {
  const rows = [];

  for (let offset = 0; offset < LIMIT; offset += 1_000) {
    const url = new URL(feed.url);
    url.searchParams.set("resource_id", feed.resourceId);
    url.searchParams.set("limit", "1000");
    url.searchParams.set("offset", String(offset));

    const payload = await getJson(url, { feed });
    const page = payload?.result?.records;

    if (!payload?.success || !Array.isArray(page)) {
      throw new Error("Invalid CKAN response");
    }

    rows.push(...page);

    if (
      page.length < 1_000 ||
      rows.length >= Number(payload.result.total ?? rows.length)
    ) {
      break;
    }
  }

  return rows.slice(0, LIMIT);
}

function normalise(provider, feed, row, index) {
  const raw = row?.type === "Feature"
    ? { ...(row.properties || {}), geometry: row.geometry }
    : row?.record || row?.fields || row;

  if (!raw || typeof raw !== "object") return null;

  const fields = flatten(raw);
  const coordinateValue = findCoordinate(raw, fields);
  if (!coordinateValue) return null;

  const status = value(
    pick(fields, [
      "status",
      "incidentstatus",
      "outagestatus",
      "eventstatus",
      "faultstatus",
      "resourcestatus",
      "customerstagesequencemessage",
      "state"
    ])
  );

  const type = value(
    pick(fields, [
      "type",
      "incidenttype",
      "outagetype",
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

  const startedAt = date(
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

  const restoreAt = date(
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

  const updatedAt = date(
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
  const rawText = scalarText(raw).toLowerCase();
  let category = feed.forceCategory || "current";

  if (
    /\b(restored|resolved|closed|complete|completed|cancelled|canceled)\b/.test(
      statusType
    )
  ) {
    category = "restored";
  } else if (
    feed.forceCategory === "planned" ||
    planned(plannedValue) ||
    (startedAt && startedAt > Date.now() + 300_000) ||
    /\b(planned|scheduled|future|maintenance|network upgrade|essential work)\b/.test(
      rawText
    ) ||
    /planned work on (the )?system/.test(rawText)
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

  const reference = usefulReference(referenceValue)
    ? String(referenceValue).trim()
    : null;

  const area = value(
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
    providerId: provider.id,
    provider: provider.name,
    feedId: feed.id,
    reference,
    category,
    status: status || category,
    type: type || category,
    area,
    lat: coordinateValue.lat,
    lon: coordinateValue.lon,
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
      if (groups.has(key)) merge(groups.get(key), incident);
      else groups.set(key, group(incident, key));
      continue;
    }

    const found = fallback.find((candidate) => canMerge(candidate, incident));
    if (found) merge(found, incident);
    else fallback.push(group(incident, null));
  }

  return [...groups.values(), ...fallback].map((item) => finish(provider, item));
}

function group(incident, key) {
  return {
    key,
    providerId: incident.providerId,
    provider: incident.provider,
    feedIds: new Set([incident.feedId]),
    reference: incident.reference,
    category: incident.category,
    status: incident.status,
    type: incident.type,
    areas: new Set([incident.area]),
    coords: [[incident.lat, incident.lon]],
    lat: incident.lat,
    lon: incident.lon,
    startedAt: incident.startedAt,
    restoreAt: incident.restoreAt,
    updatedAt: incident.updatedAt,
    officialUrl: incident.officialUrl,
    locationQuality: incident.locationQuality,
    count: 1
  };
}

function merge(target, incident) {
  target.feedIds.add(incident.feedId);
  target.areas.add(incident.area);
  target.coords.push([incident.lat, incident.lon]);
  target.lat += incident.lat;
  target.lon += incident.lon;
  target.count += 1;
  target.startedAt = earlier(target.startedAt, incident.startedAt);
  target.restoreAt = later(target.restoreAt, incident.restoreAt);
  target.updatedAt = later(target.updatedAt, incident.updatedAt);
}

function finish(provider, target) {
  const lat = target.lat / target.count;
  const lon = target.lon / target.count;
  const areas = [...target.areas].filter(Boolean);
  const key = target.key || [
    provider.id,
    target.category,
    lat.toFixed(3),
    lon.toFixed(3),
    target.startedAt ? Math.floor(target.startedAt / 1_800_000) : "unknown",
    slug(areas[0] || "location").slice(0, 48)
  ].join(":");

  return {
    key,
    providerId: target.providerId,
    provider: target.provider,
    feedIds: [...target.feedIds],
    reference: target.reference,
    category: target.category,
    status: target.status,
    type: target.type,
    area: areas.length <= 1
      ? areas[0] || "Published incident location"
      : `${areas[0]} + ${areas.length - 1} related locations`,
    areas,
    lat,
    lon,
    startedAt: target.startedAt,
    restoreAt: target.restoreAt,
    updatedAt: target.updatedAt,
    officialUrl: target.officialUrl,
    locationQuality: target.locationQuality,
    rawRecordCount: target.count,
    coordinateSpreadKm: spread(target.coords)
  };
}

function canMerge(target, incident) {
  if (target.category !== incident.category) return false;

  const lat = target.lat / target.count;
  const lon = target.lon / target.count;
  const distance = km(lat, lon, incident.lat, incident.lon);

  if (distance > 1.5) return false;

  if (
    target.startedAt &&
    incident.startedAt &&
    Math.abs(target.startedAt - incident.startedAt) > 5_400_000
  ) {
    return false;
  }

  return (
    distance <= 0.5 ||
    areaSimilarity([...target.areas][0], incident.area) >= 0.35
  );
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
      startedAt: iso(incident.startedAt),
      restoreAt: iso(incident.restoreAt),
      updatedAt: iso(incident.updatedAt),
      officialUrl: incident.officialUrl,
      locationQuality: incident.locationQuality,
      rawRecordCount: incident.rawRecordCount,
      coordinateSpreadKm: Number(incident.coordinateSpreadKm.toFixed(3))
    }
  };
}

function countCategories(items) {
  return items.reduce(
    (counts, item) => {
      const category = ["current", "planned", "restored"].includes(item.category)
        ? item.category
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

function extractRows(payload) {
  if (Array.isArray(payload)) return payload;

  for (const item of [
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
  ]) {
    if (Array.isArray(item)) return item;
  }

  const queue = [payload];
  const seen = new Set();

  while (queue.length) {
    const current = queue.shift();
    if (!current || typeof current !== "object" || seen.has(current)) continue;
    seen.add(current);

    for (const item of Object.values(current)) {
      if (
        Array.isArray(item) &&
        item.length &&
        item.every((entry) => entry && typeof entry === "object")
      ) {
        return item;
      }

      if (item && typeof item === "object") queue.push(item);
    }
  }

  return [];
}

function findCoordinate(raw, fields) {
  for (const candidate of [
    raw.geometry,
    raw.geo_shape,
    raw.geoshape,
    raw.shape,
    raw.feature?.geometry
  ]) {
    const result = geometry(candidate?.geometry || candidate);
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
    const result = coordinate(candidate);
    if (result) return result;
  }

  return valid(
    number(
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
    number(
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

function geometry(value) {
  if (!value) return null;

  if (typeof value === "string") {
    try {
      return geometry(JSON.parse(value));
    } catch {
      return coordinate(value);
    }
  }

  if (value.type === "Feature") return geometry(value.geometry);
  if (value.type === "Point") return coordinate(value.coordinates);

  const points = pairs(value.coordinates || value);
  if (!points.length) return null;

  return valid(
    points.reduce((sum, point) => sum + point[1], 0) / points.length,
    points.reduce((sum, point) => sum + point[0], 0) / points.length
  );
}

function pairs(value, output = []) {
  if (
    Array.isArray(value) &&
    value.length >= 2 &&
    Number.isFinite(Number(value[0])) &&
    Number.isFinite(Number(value[1]))
  ) {
    const result = valid(Number(value[1]), Number(value[0]));
    if (result) output.push([result.lon, result.lat]);
  } else if (Array.isArray(value)) {
    value.forEach((item) => pairs(item, output));
  }

  return output;
}

function coordinate(value) {
  if (!value) return null;

  if (Array.isArray(value) && value.length >= 2) {
    const first = Number(value[0]);
    const second = Number(value[1]);
    return valid(second, first) || valid(first, second);
  }

  if (typeof value === "object") {
    return valid(
      number(value.lat ?? value.latitude ?? value.y),
      number(value.lon ?? value.lng ?? value.long ?? value.longitude ?? value.x)
    );
  }

  if (typeof value === "string") {
    const parts = value.match(/-?\d+(?:\.\d+)?/g);
    if (parts?.length >= 2) return coordinate(parts.slice(0, 2).map(Number));
  }

  return null;
}

function valid(lat, lon) {
  return Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= 48 &&
    lat <= 62.5 &&
    lon >= -12.5 &&
    lon <= 4
    ? { lat, lon }
    : null;
}

function flatten(value, prefix = "", output = {}) {
  if (!value || typeof value !== "object") return output;

  for (const [key, item] of Object.entries(value)) {
    const next = normalKey(prefix ? `${prefix}_${key}` : key);

    if (Array.isArray(item)) {
      if (
        item.every((entry) =>
          ["string", "number", "boolean"].includes(typeof entry)
        )
      ) {
        output[next] = item.join(", ");
      }
    } else if (item && typeof item === "object") {
      flatten(item, next, output);
    } else {
      output[next] = item;
    }
  }

  return output;
}

function pick(fields, keys) {
  for (const key of keys) {
    const result = fields[normalKey(key)];
    if (
      result !== undefined &&
      result !== null &&
      String(result).trim() !== ""
    ) {
      return result;
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

function value(input) {
  if (input === null || input === undefined) return "";
  if (Array.isArray(input)) return input.join(", ");
  if (typeof input === "object") return JSON.stringify(input);
  return String(input).trim();
}

function date(input) {
  if (input === null || input === undefined || input === "") return null;

  if (typeof input === "number" && Number.isFinite(input)) {
    return input > 1e11 ? input : input * 1_000;
  }

  const text = value(input);
  const numeric = Number(text);

  if (Number.isFinite(numeric) && text !== "") {
    return numeric > 1e11 ? numeric : numeric * 1_000;
  }

  const parsed = Date.parse(text);
  return Number.isFinite(parsed) ? parsed : null;
}

function planned(input) {
  return input === true ||
    input === 1 ||
    /^(true|yes|y|1|planned)$/i.test(value(input));
}

function usefulReference(input) {
  const text = value(input);
  return text &&
    !/^(0|unknown|none|null|n\/?a|not available|not published)$/i.test(text);
}

function normalKey(input) {
  return String(input).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function slug(input) {
  return String(input || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function number(input) {
  const result = Number(input);
  return Number.isFinite(result) ? result : NaN;
}

function iso(input) {
  return input ? new Date(input).toISOString() : null;
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

function areaSimilarity(first, second) {
  const firstTokens = tokens(first);
  const secondTokens = tokens(second);

  if (!firstTokens.size || !secondTokens.size) return 0;

  let shared = 0;
  for (const token of firstTokens) {
    if (secondTokens.has(token)) shared += 1;
  }

  return shared / Math.max(firstTokens.size, secondTokens.size);
}

function tokens(input) {
  const ignored = new Set([
    "the",
    "and",
    "near",
    "area",
    "location",
    "published",
    "incident",
    "outage",
    "power",
    "cut",
    "affected"
  ]);

  return new Set(
    (String(input || "").toLowerCase().match(/[a-z0-9]+/g) || []).filter(
      (token) => token.length > 2 && !ignored.has(token)
    )
  );
}

function spread(coordinates) {
  if (!coordinates || coordinates.length < 2) return 0;

  const lat =
    coordinates.reduce((sum, point) => sum + point[0], 0) / coordinates.length;
  const lon =
    coordinates.reduce((sum, point) => sum + point[1], 0) / coordinates.length;

  return coordinates.reduce(
    (maximum, point) => Math.max(maximum, km(lat, lon, point[0], point[1])),
    0
  );
}

function km(firstLat, firstLon, secondLat, secondLon) {
  const radius = 6_371;
  const radians = (input) => (input * Math.PI) / 180;
  const latDifference = radians(secondLat - firstLat);
  const lonDifference = radians(secondLon - firstLon);
  const haversine =
    Math.sin(latDifference / 2) ** 2 +
    Math.cos(radians(firstLat)) *
      Math.cos(radians(secondLat)) *
      Math.sin(lonDifference / 2) ** 2;

  return radius * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

async function getJson(input, options = {}) {
  const url = input instanceof URL ? input.toString() : input;
  let lastError;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        redirect: "follow",
        headers: {
          Accept: "application/json, application/geo+json;q=0.9, text/plain;q=0.8, */*;q=0.5",
          "Accept-Language": "en-GB,en;q=0.9",
          "Cache-Control": "no-cache",
          "User-Agent": UA,
          ...authHeaders(url, options.feed)
        }
      });

      const text = await response.text();

      if (!response.ok) {
        throw httpError(url, response, text, options);
      }

      if (!text.trim()) {
        throw new Error("Successful response contained no JSON body");
      }

      try {
        return JSON.parse(text);
      } catch {
        throw new Error(
          `Response was not JSON: ${text.replace(/\s+/g, " ").slice(0, 240)}`
        );
      }
    } catch (error) {
      lastError = error;

      if (DEBUG_HTTP) {
        console.error(
          `[http] ${options.feed?.id || "feed"} ${url} -> ${error?.message || error}`
        );
      }

      if (!attempt) {
        await new Promise((resolve) => setTimeout(resolve, 1_500));
      }
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError || new Error("Request failed");
}

function hasAuth(feed) {
  return Boolean(feed?.authEnv && process.env[feed.authEnv]);
}

function authHeaders(url, feed) {
  if (!hasAuth(feed)) return {};

  let origin = "";

  try {
    origin = new URL(url).origin;
  } catch {
    return {};
  }

  const allowedOrigins = Array.isArray(feed.authOrigins)
    ? feed.authOrigins
    : [];

  if (allowedOrigins.length && !allowedOrigins.includes(origin)) {
    return {};
  }

  return {
    Authorization: `Apikey ${process.env[feed.authEnv]}`
  };
}

function httpError(url, response, body, options = {}) {
  const interestingHeaders = [
    "server",
    "content-type",
    "cache-control",
    "cf-ray",
    "x-request-id",
    "x-ratelimit-remaining",
    "retry-after"
  ];

  const headerSummary = interestingHeaders
    .map((name) => [name, response.headers.get(name)])
    .filter(([, headerValue]) => headerValue)
    .map(([name, headerValue]) => `${name}=${headerValue}`)
    .join(", ");

  const bodySummary = String(body || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_ERROR_BODY);

  const context = [options.feed?.id, options.sourceId || options.dataset]
    .filter(Boolean)
    .join("/");

  const authHint =
    [401, 403].includes(response.status) &&
    options.feed?.authEnv &&
    !hasAuth(options.feed)
      ? `GitHub secret ${options.feed.authEnv} is not configured`
      : "";

  return new Error(
    [
      `HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ""}`,
      context ? `[${context}]` : "",
      headerSummary ? `{${headerSummary}}` : "",
      authHint,
      bodySummary ? `body=${JSON.stringify(bodySummary)}` : ""
    ]
      .filter(Boolean)
      .join(" ")
  );
}

async function read(file) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return null;
  }
}

async function write(file, data) {
  const temporary = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  await fs.rename(temporary, file);
}

function concise(error) {
  return error?.name === "AbortError"
    ? "Timed out"
    : String(error?.message || "Unavailable").slice(0, 700);
}

function selfTest() {
  const nged = providers.find((provider) => provider.id === "nged");
  const ngedFeed = nged.feeds[0];

  const duplicate = [
    {
      "Incident ID": "X",
      Status: "Awaiting",
      Planned: false,
      "Location Latitude": 51.5,
      "Location Longitude": -2.5
    },
    {
      "Incident ID": "X",
      Status: "Awaiting",
      Planned: false,
      "Location Latitude": 51.5002,
      "Location Longitude": -2.5002
    }
  ]
    .map((row, index) => normalise(nged, ngedFeed, row, index))
    .filter(Boolean);

  const grouped = dedupe(nged, duplicate);
  const byText = normalise(
    nged,
    ngedFeed,
    {
      "Incident ID": "P1",
      "Work Description": "Planned Work on System",
      "Location Latitude": 54.1,
      "Location Longitude": -1.2
    },
    0
  );
  const byDate = normalise(
    nged,
    ngedFeed,
    {
      "Incident ID": "P2",
      "Start Time": new Date(Date.now() + 3_600_000).toISOString(),
      "Location Latitude": 53.2,
      "Location Longitude": -2.1
    },
    1
  );

  const spen = providers.find((provider) => provider.id === "spen");
  const spenSources = spen.feeds[0].sources.map(normaliseOdsSource);

  if (
    grouped.length !== 1 ||
    grouped[0].rawRecordCount !== 2 ||
    byText?.category !== "planned" ||
    byDate?.category !== "planned" ||
    spenSources.length !== 5 ||
    spenSources[1].apiVersion !== "v2.0" ||
    spenSources[2].kind !== "geojson"
  ) {
    throw new Error("Collector self-test failed");
  }

  console.log("Collector self-test passed.");
}

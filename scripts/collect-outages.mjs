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

const VERSION = "0.5.0-public-provider-fallbacks";
const TIMEOUT = 30_000;
const LIMIT = 2_500;
const PAGE_SIZE = 100;
const UA =
  "FieldOpsAtlas-Outage-Collector/0.5.0 (+https://github.com/A-engi/FieldOpsAtlas-Web)";
const DEBUG_HTTP = /^(1|true|yes)$/i.test(
  String(process.env.OUTAGE_DEBUG_HTTP || "")
);
const MAX_ERROR_BODY = 600;
const SPEN_API_ROOT =
  "https://powercuts.spenergynetworks.co.uk/lwr/apex/v67.0/SPEN_PostcodeSearchController";
const SPEN_POSTCODES_ROOT = "https://api.postcodes.io/postcodes";
const SPEN_STATUS_GROUPS = [
  {
    category: "current",
    statuses: ["Unplanned Power Cut", "Live Power Cut", "In Progress"]
  },
  {
    category: "planned",
    statuses: ["Planned-Active"]
  },
  {
    category: "restored",
    statuses: ["Restored", "Power Restored"]
  }
];

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
        type: "nged-powercuts",
        url: "https://powercuts.nationalgrid.co.uk/__powercuts/getIncidentsAndAlertSummary",
        fallbackType: "ckan",
        fallbackUrl: "https://connecteddata.nationalgrid.co.uk/api/3/action/datastore_search",
        resourceId: "292f788f-4339-455b-8cc0-153e14509d4d"
      }
    ]
  },
  {
    id: "enwl",
    name: "Electricity North West",
    officialUrl: "https://www.enwl.co.uk/power-cuts",
    locationQuality: "upstream_switch",
    feeds: [
      {
        id: "live",
        type: "enwl-power-outages",
        includeCurrent: true,
        includeTodaysPlanned: false,
        includeFuturePlanned: false
      },
      {
        id: "planned",
        type: "enwl-power-outages",
        forceCategory: "planned",
        includeCurrent: false,
        includeTodaysPlanned: true,
        includeFuturePlanned: true
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
    officialUrl: "https://powercuts.spenergynetworks.co.uk/map",
    locationQuality: "postcode_lookup",
    feeds: [
      {
        id: "live",
        type: "spen-lwr"
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
        type: "nie-powercheck"
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
    ["live", "stale"].includes(result.status.state)
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
      const failureState = classifyFailure(error, feed);
      feeds.push({
        id: feed.id,
        state: feed.optional ? "unavailable" : failureState,
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
        state: features.length > 0 ? "stale" : providerFailureState(feeds),
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

  const requiredFailures = feeds.filter((feed) =>
    ["authentication required", "source failure", "unavailable"].includes(feed.state)
  );
  const optionalFailures = feeds.filter(
    (feed) => feed.state === "unavailable"
  );
  const categories = countCategories(incidents);

  return {
    id: provider.id,
    status: {
      state: "live",
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
  if (feed.type === "spen-lwr") return loadSpenLwr();

  if (feed.type === "enwl-power-outages") return loadEnwlPowerOutages(feed);

  if (feed.type === "nie-powercheck") return loadNiePowercheck(feed);

  if (feed.type === "nged-powercuts") return loadNgedPowercuts(feed);

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
      selectedSource: feed.url
    };
  }

  throw new Error(`Unsupported feed type ${feed.type}`);
}

async function loadEnwlPowerOutages(feed) {
  const url = new URL("https://www.enwl.co.uk/api/power-outages/search");
  url.searchParams.set("pageSize", String(LIMIT));
  url.searchParams.set("pageNumber", "1");
  url.searchParams.set("includeCurrent", String(Boolean(feed.includeCurrent)));
  url.searchParams.set("includeResolved", "false");
  url.searchParams.set("includeTodaysPlanned", String(Boolean(feed.includeTodaysPlanned)));
  url.searchParams.set("includeFuturePlanned", String(Boolean(feed.includeFuturePlanned)));
  url.searchParams.set("includeCancelledPlanned", "false");

  const payload = await getJson(url, {
    feed,
    method: "POST",
    selectedSource: "enwl-public-power-outages"
  });
  const rows = Array.isArray(payload?.Items) ? payload.Items : [];

  return {
    rows,
    selectedSource: "https://www.enwl.co.uk/api/power-outages/search"
  };
}

async function loadNiePowercheck(feed) {
  const url = "https://powercheck.nienetworks.co.uk/NIEPowerCheckerWebAPI/api/faults";
  const payload = await getJson(url, {
    feed,
    selectedSource: "nie-public-powercheck"
  });
  const rows = Array.isArray(payload?.outageMessage)
    ? payload.outageMessage.map(toNieRow).filter(Boolean)
    : [];

  return {
    rows,
    selectedSource: url
  };
}

async function loadNgedPowercuts(feed) {
  try {
    const payload = await getJson(feed.url, {
      feed,
      selectedSource: "nged-public-powercuts"
    });
    const rows = Array.isArray(payload?.incidents)
      ? payload.incidents.map((incident) => toNgedPowercutRow(incident, payload.lastUpdated))
      : [];

    if (!Array.isArray(payload?.incidents)) {
      throw new Error("Invalid NGED power-cut response");
    }

    return {
      rows,
      selectedSource: feed.url
    };
  } catch (error) {
    if (!feed.fallbackUrl || feed.fallbackType !== "ckan") throw error;

    const rows = await loadCkan({
      ...feed,
      type: "ckan",
      url: feed.fallbackUrl
    });

    return {
      rows,
      selectedSource: `${feed.fallbackUrl} (fallback after ${concise(error)})`
    };
  }
}

function toNgedPowercutRow(incident, lastUpdated) {
  const coordinate = coordinateFromNgedLoc(incident?.loc);

  return {
    id: incident?.id,
    incidentId: incident?.id,
    reference: incident?.id,
    region: incident?.region,
    status: "current",
    type: "current",
    area: incident?.region || "Published incident location",
    location: coordinate,
    updatedAt: lastUpdated
  };
}

function coordinateFromNgedLoc(loc) {
  if (!Array.isArray(loc) || loc.length < 2) return null;

  return {
    lat: Number(loc[0]),
    lon: Number(loc[1])
  };
}

function toNieRow(outage) {
  const coordinate = irishGridToWgs84(outage?.point?.coordinates);
  if (!coordinate) return null;

  const isPlanned = /planned/i.test(value(outage.outageType));

  return {
    outageId: outage.outageId,
    outageType: outage.outageType,
    status: outage.statusMessage || outage.outageType,
    type: outage.outageType,
    planned: isPlanned,
    startTime: parseNieDate(outage.startTime),
    estimatedRestorationTime: parseNieDate(outage.estRestoreFullDateTime || outage.estRestoreTime),
    updatedAt: parseNieDate(outage.updatedTimeStamp),
    postCode: outage.postCode,
    fullPostCodes: outage.fullPostCodes,
    customersAffected: outage.numCustAffected,
    causeMessage: outage.causeMessage,
    lat: coordinate.lat,
    lon: coordinate.lon
  };
}

function parseNieDate(input) {
  const text = value(input);
  if (!text || /not available/i.test(text)) return "";
  const hasYear = /\b\d{4}\b/.test(text);
  const year = new Date().getFullYear();
  const parsed = Date.parse(hasYear ? text : `${text} ${year}`);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : "";
}

function irishGridToWgs84(input) {
  const parts = value(input).match(/-?\d+(?:\.\d+)?/g);
  if (!parts || parts.length < 2) return null;

  const easting = Number(parts[0]);
  const northing = Number(parts[1]);
  if (!Number.isFinite(easting) || !Number.isFinite(northing)) return null;

  const a = 6377340.189;
  const b = 6356034.447;
  const f0 = 1.000035;
  const lat0 = degToRad(53.5);
  const lon0 = degToRad(-8);
  const n0 = 250000;
  const e0 = 200000;
  const e2 = 1 - (b * b) / (a * a);
  const n = (a - b) / (a + b);

  let lat = lat0;
  let m = 0;
  do {
    lat = (northing - n0 - m) / (a * f0) + lat;
    const ma = (1 + n + (5 / 4) * n ** 2 + (5 / 4) * n ** 3) * (lat - lat0);
    const mb = (3 * n + 3 * n ** 2 + (21 / 8) * n ** 3) *
      Math.sin(lat - lat0) * Math.cos(lat + lat0);
    const mc = ((15 / 8) * n ** 2 + (15 / 8) * n ** 3) *
      Math.sin(2 * (lat - lat0)) * Math.cos(2 * (lat + lat0));
    const md = (35 / 24) * n ** 3 *
      Math.sin(3 * (lat - lat0)) * Math.cos(3 * (lat + lat0));
    m = b * f0 * (ma - mb + mc - md);
  } while (Math.abs(northing - n0 - m) >= 0.00001);

  const cosLat = Math.cos(lat);
  const sinLat = Math.sin(lat);
  const nu = a * f0 / Math.sqrt(1 - e2 * sinLat ** 2);
  const rho = a * f0 * (1 - e2) / (1 - e2 * sinLat ** 2) ** 1.5;
  const eta2 = nu / rho - 1;
  const tanLat = Math.tan(lat);
  const secLat = 1 / cosLat;
  const dE = easting - e0;

  const vii = tanLat / (2 * rho * nu);
  const viii = tanLat / (24 * rho * nu ** 3) *
    (5 + 3 * tanLat ** 2 + eta2 - 9 * tanLat ** 2 * eta2);
  const ix = tanLat / (720 * rho * nu ** 5) *
    (61 + 90 * tanLat ** 2 + 45 * tanLat ** 4);
  const x = secLat / nu;
  const xi = secLat / (6 * nu ** 3) * (nu / rho + 2 * tanLat ** 2);
  const xii = secLat / (120 * nu ** 5) *
    (5 + 28 * tanLat ** 2 + 24 * tanLat ** 4);
  const xiia = secLat / (5040 * nu ** 7) *
    (61 + 662 * tanLat ** 2 + 1320 * tanLat ** 4 + 720 * tanLat ** 6);

  const latAiry = lat - vii * dE ** 2 + viii * dE ** 4 - ix * dE ** 6;
  const lonAiry = lon0 + x * dE - xi * dE ** 3 + xii * dE ** 5 - xiia * dE ** 7;

  return helmertIrishToWgs84(radToDeg(latAiry), radToDeg(lonAiry), 0);
}

function helmertIrishToWgs84(lat, lon, height) {
  const source = toCartesian(lat, lon, height, 6377340.189, 6356034.447);
  const tx = 482.53;
  const ty = -130.596;
  const tz = 564.557;
  const s = -8.15e-6;
  const rx = degToRad(-1.042 / 3600);
  const ry = degToRad(-0.214 / 3600);
  const rz = degToRad(-0.631 / 3600);

  const x = tx + (1 + s) * source.x - rz * source.y + ry * source.z;
  const y = ty + rz * source.x + (1 + s) * source.y - rx * source.z;
  const z = tz - ry * source.x + rx * source.y + (1 + s) * source.z;
  return fromCartesian(x, y, z, 6378137, 6356752.314245);
}

function toCartesian(lat, lon, height, a, b) {
  const phi = degToRad(lat);
  const lambda = degToRad(lon);
  const e2 = 1 - (b * b) / (a * a);
  const nu = a / Math.sqrt(1 - e2 * Math.sin(phi) ** 2);
  return {
    x: (nu + height) * Math.cos(phi) * Math.cos(lambda),
    y: (nu + height) * Math.cos(phi) * Math.sin(lambda),
    z: ((1 - e2) * nu + height) * Math.sin(phi)
  };
}

function fromCartesian(x, y, z, a, b) {
  const e2 = 1 - (b * b) / (a * a);
  const p = Math.sqrt(x * x + y * y);
  let phi = Math.atan2(z, p * (1 - e2));
  let previous;

  do {
    previous = phi;
    const nu = a / Math.sqrt(1 - e2 * Math.sin(phi) ** 2);
    phi = Math.atan2(z + e2 * nu * Math.sin(phi), p);
  } while (Math.abs(phi - previous) > 1e-12);

  return valid(radToDeg(phi), radToDeg(Math.atan2(y, x)));
}

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

function radToDeg(radians) {
  return radians * 180 / Math.PI;
}

async function loadSpenLwr() {
  const postcodeCache = new Map();
  const rows = [];
  const counts = {};

  for (const group of SPEN_STATUS_GROUPS) {
    const count = await spenApex("getImpactDataCount", {
      postcode: "",
      statuses: group.statuses
    });
    const total = Number(count);

    if (!Number.isFinite(total)) {
      throw new Error(`SPEN count was not numeric for ${group.category}`);
    }

    counts[group.category] = total;

    for (let pageNumber = 1; pageNumber <= Math.ceil(total / PAGE_SIZE); pageNumber += 1) {
      const page = await spenApex("getImpactData", {
        paramsJson: JSON.stringify({
          postcode: "",
          pageNumber,
          pageSize: PAGE_SIZE,
          statuses: group.statuses
        })
      });

      if (!Array.isArray(page)) {
        throw new Error(`SPEN ${group.category} page was not an array`);
      }

      for (const incident of page) {
        const postcode = firstSpenPostcode(incident.postcodeList);
        const coordinate = await lookupSpenPostcode(postcode, postcodeCache);

        if (!coordinate) continue;

        rows.push(toSpenCollectorRow(incident, group.category, postcode, coordinate));
      }
    }
  }

  return {
    rows,
    selectedSource:
      `salesforce-lwr current=${counts.current || 0} planned=${counts.planned || 0} restored=${counts.restored || 0}`
  };
}

async function spenApex(method, body) {
  return postJson(`${SPEN_API_ROOT}/${method}`, body, {
    "X-SFDC-Allow-Continuation": "false"
  });
}

async function postJson(url, body, headers = {}) {
  let lastError;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(url, {
        method: "POST",
        signal: controller.signal,
        redirect: "follow",
        body: JSON.stringify(body),
        headers: {
          Accept: "application/json",
          "Accept-Language": "en-GB,en;q=0.9",
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
          "User-Agent": UA,
          ...headers
        }
      });
      const textValue = await response.text();

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ""}` +
            (textValue ? ` ${textValue.replace(/\s+/g, " ").slice(0, MAX_ERROR_BODY)}` : "")
        );
      }

      return JSON.parse(textValue);
    } catch (error) {
      lastError = error;

      if (!attempt) {
        await new Promise((resolve) => setTimeout(resolve, 1_500));
      }
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError || new Error("POST request failed");
}

async function lookupSpenPostcode(postcode, cache) {
  const key = String(postcode || "").toUpperCase().replace(/\s+/g, "");

  if (!key) return null;
  if (cache.has(key)) return cache.get(key);

  try {
    const payload = await getJson(`${SPEN_POSTCODES_ROOT}/${encodeURIComponent(key)}`);
    const coordinate = valid(
      Number(payload?.result?.latitude),
      Number(payload?.result?.longitude)
    );

    cache.set(key, coordinate);
    return coordinate;
  } catch {
    cache.set(key, null);
    return null;
  }
}

function toSpenCollectorRow(incident, category, postcode, coordinate) {
  const outcodes = Array.isArray(incident.outCodes)
    ? incident.outCodes.filter(Boolean).join(", ")
    : "";

  return {
    incidentReference: incident.incidentReference,
    status: incident.status,
    planned: category === "planned",
    category,
    latitude: coordinate.lat,
    longitude: coordinate.lon,
    location: value(incident.ipTown) || outcodes || postcode,
    postcode,
    postcodes: incident.postcodeList,
    affectedPostcodes: incident.spenPostCodesPerIncident,
    startTime: toIsoDate(parseSpenDate(incident.createdDate || incident.arrivalDate)),
    estimatedRestorationTime: toIsoDate(parseSpenDate(incident.estimatedFix)),
    actualRestorationTime: toIsoDate(parseSpenDate(incident.actualRestorationTime)),
    updatedAt: toIsoDate(parseSpenDate(incident.ivrMessageAssignedTime || incident.dispatchedDate)),
    message: incident.mainMessage || incident.ivrMessage
  };
}

function firstSpenPostcode(input) {
  const match = value(input).match(/[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}/i);
  return match ? match[0].toUpperCase().replace(/\s+/, " ") : "";
}

function parseSpenDate(input) {
  const textValue = value(input);

  if (!textValue) return null;

  const slashMatch = textValue.match(
    /^(\d{2})\/(\d{2})\/(\d{4}),?\s+(\d{2}):(\d{2})$/
  );

  if (slashMatch) {
    const [, day, month, year, hour, minute] = slashMatch;
    return Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute)
    );
  }

  const parsed = Date.parse(textValue);
  return Number.isFinite(parsed) ? parsed : null;
}

function toIsoDate(timestamp) {
  return timestamp ? new Date(timestamp).toISOString() : "";
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
    "faultnumber",
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
    locations: [{
      area: incident.area,
      lat: incident.lat,
      lon: incident.lon,
      reference: incident.reference,
      status: incident.status,
      type: incident.type
    }],
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
  target.locations.push({
    area: incident.area,
    lat: incident.lat,
    lon: incident.lon,
    reference: incident.reference,
    status: incident.status,
    type: incident.type
  });
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
    groupedLocations: target.locations,
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
      groupedLocations: incident.groupedLocations,
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
    raw.outageCentrePoint,
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
        "outagecentrepointlat",
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
        "outagecentrepointlng",
        "outagecentrepointlon",
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
        method: options.method || "GET",
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

  const error = new Error(
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
  error.status = response.status;
  error.authRequired = [401, 403].includes(response.status) && Boolean(options.feed?.authEnv);
  error.sourceFailure = response.status >= 500 || response.status === 429;
  return error;
}

function classifyFailure(error, feed) {
  if (error?.authRequired || /GitHub secret .* is not configured|HTTP (401|403)\b/i.test(concise(error))) {
    return "authentication required";
  }

  if (error?.name === "AbortError" || error?.sourceFailure || /HTTP (429|5\d\d)\b|timed out/i.test(concise(error))) {
    return "source failure";
  }

  if (feed?.authEnv && !hasAuth(feed) && /HTTP (401|403)\b/i.test(concise(error))) {
    return "authentication required";
  }

  return "unavailable";
}

function providerFailureState(feeds) {
  if (feeds.some((feed) => feed.state === "authentication required")) {
    return "authentication required";
  }

  if (feeds.some((feed) => feed.state === "source failure")) {
    return "source failure";
  }

  return "unavailable";
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

  if (
    grouped.length !== 1 ||
    grouped[0].rawRecordCount !== 2 ||
    byText?.category !== "planned" ||
    byDate?.category !== "planned" ||
    spen?.feeds?.[0]?.type !== "spen-lwr" ||
    spen?.locationQuality !== "postcode_lookup"
  ) {
    throw new Error("Collector self-test failed");
  }

  console.log("Collector self-test passed.");
}

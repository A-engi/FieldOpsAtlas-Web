import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const BASE_URL = "https://data.hub.api.metoffice.gov.uk/map-images/1.0.0";
const OUT_DIR = "FieldOpsAtlas/Features/Weather/data/metoffice-map-images";
const LATEST_JSON = path.join(OUT_DIR, "latest.json");
const RAINFALL_PNG = path.join(OUT_DIR, "latest-rainfall.png");
const RETRY_STATUSES = new Set([429, 500, 502, 503, 504]);
const NON_RETRY_STATUSES = new Set([401, 403, 404]);

export async function run(options = {}) {
  const env = options.env || process.env;
  const apiKey = String(env.METOFFICE_API_KEY || "");
  const orderId = String(env.METOFFICE_ORDER_ID || "");
  const outDir = options.outDir || OUT_DIR;
  const latestJson = path.join(outDir, "latest.json");
  const rainfallPng = path.join(outDir, "latest-rainfall.png");
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  const log = options.log || console.log;

  if (!apiKey) throw new Error("Missing METOFFICE_API_KEY.");
  if (!orderId) throw new Error("Missing METOFFICE_ORDER_ID.");
  if (typeof fetchImpl !== "function") throw new Error("Fetch is unavailable.");

  await mkdir(outDir, { recursive: true });

  const orderUrl = `${BASE_URL}/orders/${encodeURIComponent(orderId)}/latest?detail=MINIMAL`;
  const order = await fetchJson(orderUrl, apiKey, fetchImpl, options);
  const selected = selectNewestRainfallFile(order);
  const imageUrl = `${BASE_URL}/orders/${encodeURIComponent(orderId)}/latest/${encodeURIComponent(selected.fileId)}/data?includeLand=false`;
  const png = await fetchBytes(imageUrl, apiKey, "image/png", fetchImpl, options);

  if (!isPng(png)) throw new Error("Downloaded rainfall image is not a valid PNG.");

  const metadata = {
    status: "ok",
    provider: "Met Office DataHub",
    product: "Map Images",
    layer: "rainfall",
    includeLand: false,
    image: "latest-rainfall.png",
    selectedFileId: selected.fileId,
    validIso: selected.validIso,
    rainfallFileCount: selected.rainfallFileCount
  };

  const existingPng = await readOptional(rainfallPng);
  const existingJson = await readJsonOptional(latestJson);
  const imageChanged = !existingPng || !Buffer.from(existingPng).equals(Buffer.from(png));
  const metadataChanged = !existingJson ||
    existingJson.selectedFileId !== metadata.selectedFileId ||
    existingJson.validIso !== metadata.validIso ||
    existingJson.rainfallFileCount !== metadata.rainfallFileCount;

  if (!imageChanged && !metadataChanged) {
    log("Loaded.");
    return { changed: false, selected };
  }

  metadata.updatedAt = new Date().toISOString();
  await writeAtomic(rainfallPng, png);
  await writeAtomic(latestJson, `${JSON.stringify(metadata, null, 2)}\n`);
  log("Loaded.");
  return { changed: true, selected };
}

export async function fetchJson(url, apiKey, fetchImpl, options = {}) {
  const response = await fetchWithRetry(url, apiKey, "application/json", fetchImpl, options);
  try {
    return await response.json();
  } catch {
    throw new Error("Met Office order response was not valid JSON.");
  }
}

export async function fetchBytes(url, apiKey, accept, fetchImpl, options = {}) {
  const response = await fetchWithRetry(url, apiKey, accept, fetchImpl, options);
  return Buffer.from(await response.arrayBuffer());
}

export async function fetchWithRetry(url, apiKey, accept, fetchImpl, options = {}) {
  const attempts = options.attempts || 4;
  const sleep = options.sleep || delay;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetchImpl(url, {
        headers: {
          Accept: accept,
          apikey: apiKey
        }
      });

      if (response.ok) return response;
      const message = classifyHttpStatus(response.status, response.statusText);
      if (NON_RETRY_STATUSES.has(response.status) || !RETRY_STATUSES.has(response.status) || attempt === attempts) {
        throw new Error(message);
      }
    } catch (error) {
      if (attempt === attempts || isNonRetryableError(error)) throw error;
    }

    await sleep(backoffMs(attempt));
  }

  throw new Error("Met Office request failed.");
}

export function selectNewestRainfallFile(order) {
  const fileIds = findFileIds(order);
  if (!fileIds.length) throw new Error("Met Office order response did not contain file identifiers.");

  const rainfallFiles = fileIds
    .filter((fileId) => /precip|rainfall|rain/i.test(fileId))
    .map((fileId) => ({
      fileId,
      validIso: parseValidTimestamp(fileId)
    }))
    .filter((file) => file.validIso)
    .sort((a, b) => Date.parse(b.validIso) - Date.parse(a.validIso));

  if (!rainfallFiles.length) {
    throw new Error(`Order returned ${fileIds.length} file id(s), but no rainfall file had a valid timestamp.`);
  }

  return {
    ...rainfallFiles[0],
    rainfallFileCount: rainfallFiles.length
  };
}

export function findFileIds(value) {
  const found = new Set();
  walk(value, found);
  return Array.from(found).sort();
}

function walk(value, found) {
  if (!value) return;
  if (typeof value === "string") {
    if (looksLikeFileId(value)) found.add(value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => walk(item, found));
    return;
  }
  if (typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      if (/file|id|name|key|href|url/i.test(key) || typeof child === "object") walk(child, found);
    }
  }
}

function looksLikeFileId(value) {
  return /png/i.test(value) || /precip|rainfall|rain|radar/i.test(value);
}

export function parseValidTimestamp(fileId) {
  const text = String(fileId);
  const compact = text.match(/(20\d{2})(\d{2})(\d{2})[T_\-]?(\d{2})(\d{2})(?:\d{2})?/);
  if (compact) return validIso(compact[1], compact[2], compact[3], compact[4], compact[5]);

  const separated = text.match(/(20\d{2})[-_](\d{2})[-_](\d{2})[T_\-](\d{2})[:_\-]?(\d{2})/);
  if (separated) return validIso(separated[1], separated[2], separated[3], separated[4], separated[5]);

  return "";
}

function validIso(year, month, day, hour, minute) {
  const iso = `${year}-${month}-${day}T${hour}:${minute}:00Z`;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  if (date.toISOString().replace(".000Z", "Z") !== iso) return "";
  return iso;
}

export function isPng(bytes) {
  const buffer = Buffer.from(bytes || []);
  return buffer.length > 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a;
}

export function classifyHttpStatus(status, statusText = "") {
  if (status === 401 || status === 403) return `Met Office authentication failed: HTTP ${status}.`;
  if (status === 404) return "Met Office order or file was not found: HTTP 404.";
  if (status === 429) return "Met Office rate limit reached: HTTP 429.";
  if (status >= 500) return `Met Office server failure: HTTP ${status} ${statusText}`.trim();
  return `Met Office request failed: HTTP ${status} ${statusText}`.trim();
}

export function redact(value, secret) {
  if (!secret) return String(value || "");
  return String(value || "").split(secret).join("[redacted]");
}

function isNonRetryableError(error) {
  return /HTTP (401|403|404)/.test(String(error?.message || error));
}

function backoffMs(attempt) {
  return Math.min(4000, 250 * (2 ** (attempt - 1)));
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readOptional(filePath) {
  try {
    return await readFile(filePath);
  } catch {
    return null;
  }
}

async function readJsonOptional(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    return null;
  }
}

async function writeAtomic(filePath, data) {
  const tempPath = `${filePath}.tmp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  await writeFile(tempPath, data);
  try {
    await rename(tempPath, filePath);
  } catch (error) {
    await rm(tempPath, { force: true });
    throw error;
  }
}

if (typeof process !== "undefined" && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch((error) => {
    console.error(redact(error?.message || error, process.env.METOFFICE_API_KEY || ""));
    process.exit(1);
  });
}

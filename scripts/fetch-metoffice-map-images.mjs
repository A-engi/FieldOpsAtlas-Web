/* FieldOps Atlas Met Office Map Images fetcher v0.1.0
   Destination: scripts/fetch-metoffice-map-images.mjs

   Runs in GitHub Actions only.
   Reads METOFFICE_API_KEY and METOFFICE_ORDER_ID from GitHub Secrets.
   Writes public, non-secret output into:
   FieldOpsAtlas/Features/Weather/data/metoffice-map-images/
*/

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const API_KEY = process.env.METOFFICE_API_KEY || "";
const ORDER_ID = process.env.METOFFICE_ORDER_ID || "";
const BASE_URL = "https://data.hub.api.metoffice.gov.uk/map-images/1.0.0";
const OUT_DIR = "FieldOpsAtlas/Features/Weather/data/metoffice-map-images";
const LATEST_JSON = path.join(OUT_DIR, "latest.json");
const RAINFALL_PNG = path.join(OUT_DIR, "latest-rainfall.png");

main().catch(async (error) => {
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(LATEST_JSON, JSON.stringify({
    status: "error",
    generatedAt: new Date().toISOString(),
    message: cleanMessage(error)
  }, null, 2) + "\n");
  console.error(error);
  process.exit(1);
});

async function main() {
  if (!API_KEY) throw new Error("Missing METOFFICE_API_KEY repository secret.");
  if (!ORDER_ID) throw new Error("Missing METOFFICE_ORDER_ID repository secret.");

  await mkdir(OUT_DIR, { recursive: true });

  const order = await fetchJson(`${BASE_URL}/orders/${encodeURIComponent(ORDER_ID)}/latest?detail=MINIMAL`);
  const fileIds = findFileIds(order);
  const rainfallFiles = fileIds
    .filter((fileId) => /precip|rainfall|rain/i.test(fileId))
    .map((fileId) => ({
      fileId,
      validIso: extractBestIso(fileId),
      frameKey: extractFrameKey(fileId)
    }))
    .sort((a, b) => a.fileId.localeCompare(b.fileId));

  if (!rainfallFiles.length) {
    throw new Error(`Order returned ${fileIds.length} file id(s), but none matched rainfall/precipitation.`);
  }

  const selected = rainfallFiles[rainfallFiles.length - 1];
  const imageUrl = `${BASE_URL}/orders/${encodeURIComponent(ORDER_ID)}/latest/${encodeURIComponent(selected.fileId)}/data?includeLand=false`;
  const png = await fetchBytes(imageUrl, "image/png");

  await writeFile(RAINFALL_PNG, png);

  await writeFile(LATEST_JSON, JSON.stringify({
    status: "ok",
    generatedAt: new Date().toISOString(),
    provider: "Met Office DataHub",
    product: "Map Images",
    layer: "rainfall",
    includeLand: false,
    image: "latest-rainfall.png",
    selectedFileId: selected.fileId,
    validIso: selected.validIso,
    frameKey: selected.frameKey,
    rainfallFileCount: rainfallFiles.length
  }, null, 2) + "\n");

  console.log(`Saved ${RAINFALL_PNG}`);
  console.log(`Selected ${selected.fileId}`);
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      apikey: API_KEY
    }
  });

  if (!response.ok) {
    throw new Error(`Met Office JSON request failed: HTTP ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function fetchBytes(url, accept) {
  const response = await fetch(url, {
    headers: {
      Accept: accept,
      apikey: API_KEY
    }
  });

  if (!response.ok) {
    throw new Error(`Met Office image request failed: HTTP ${response.status} ${response.statusText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

function findFileIds(value) {
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
      if (/file|id|name|key/i.test(key)) walk(child, found);
      else if (typeof child === "object") walk(child, found);
    }
  }
}

function looksLikeFileId(value) {
  return /png/i.test(value) || /precip|rainfall|rain|cloud|pressure|temperature|temp/i.test(value);
}

function extractFrameKey(fileId) {
  const matches = String(fileId).match(/\d{3,12}/g);
  return matches?.at(-1) || "";
}

function extractBestIso(fileId) {
  const text = String(fileId);
  const compact = text.match(/(20\d{2})(\d{2})(\d{2})[T_\-]?(\d{2})(\d{2})/);
  if (compact) {
    return `${compact[1]}-${compact[2]}-${compact[3]}T${compact[4]}:${compact[5]}:00Z`;
  }

  const isoish = text.match(/20\d{2}[-_]\d{2}[-_]\d{2}[T_\-]\d{2}[:_\-]?\d{2}/);
  if (isoish) {
    return isoish[0]
      .replaceAll("_", "-")
      .replace(/T(\d{2})-(\d{2})$/, "T$1:$2:00Z");
  }

  return "";
}

function cleanMessage(error) {
  return String(error?.message || error || "Unknown error").replace(API_KEY, "[redacted]");
}

/* End of file: scripts/fetch-metoffice-map-images.mjs */

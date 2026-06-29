import assert from "node:assert/strict";
import { mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  classifyHttpStatus,
  isPng,
  parseValidTimestamp,
  redact,
  run,
  selectNewestRainfallFile
} from "./fetch-metoffice-map-images.mjs";

const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x01]);

const tests = [
  ["missing API key", async () => {
    await assert.rejects(() => run({ env: { METOFFICE_ORDER_ID: "order" }, fetchImpl: okFetch(), sleep: noSleep }), /METOFFICE_API_KEY/);
  }],
  ["missing order ID", async () => {
    await assert.rejects(() => run({ env: { METOFFICE_API_KEY: "key" }, fetchImpl: okFetch(), sleep: noSleep }), /METOFFICE_ORDER_ID/);
  }],
  ["invalid order response", async () => {
    assert.throws(() => selectNewestRainfallFile({ files: [] }), /file identifiers/);
  }],
  ["no rainfall files", async () => {
    assert.throws(() => selectNewestRainfallFile({ files: ["cloud_202606290530.png"] }), /no rainfall file/);
  }],
  ["selecting newest timestamp", async () => {
    const selected = selectNewestRainfallFile({
      files: [
        "rainfall_202606280530.png",
        "rainfall_202606290530.png",
        "rainfall_202606270530.png"
      ]
    });
    assert.equal(selected.validIso, "2026-06-29T05:30:00Z");
  }],
  ["invalid PNG", async () => {
    assert.equal(isPng(Buffer.from("no")), false);
    const outDir = await tempDir();
    await assert.rejects(() => run({
      env: { METOFFICE_API_KEY: "key", METOFFICE_ORDER_ID: "order" },
      outDir,
      fetchImpl: sequenceFetch([
        jsonResponse({ files: ["rainfall_202606290530.png"] }),
        bytesResponse(Buffer.from("not-png"))
      ]),
      sleep: noSleep
    }), /valid PNG/);
  }],
  ["temporary network failure", async () => {
    const outDir = await tempDir();
    const result = await run({
      env: { METOFFICE_API_KEY: "key", METOFFICE_ORDER_ID: "order" },
      outDir,
      fetchImpl: sequenceFetch([
        () => Promise.reject(new Error("network")),
        jsonResponse({ files: ["rainfall_202606290530.png"] }),
        bytesResponse(PNG)
      ]),
      sleep: noSleep,
      log: noop
    });
    assert.equal(result.changed, true);
  }],
  ["rate limiting", async () => {
    const outDir = await tempDir();
    const result = await run({
      env: { METOFFICE_API_KEY: "key", METOFFICE_ORDER_ID: "order" },
      outDir,
      fetchImpl: sequenceFetch([
        statusResponse(429, "Too Many Requests"),
        jsonResponse({ files: ["rainfall_202606290530.png"] }),
        bytesResponse(PNG)
      ]),
      sleep: noSleep,
      log: noop
    });
    assert.equal(result.changed, true);
  }],
  ["successful atomic replacement", async () => {
    const outDir = await tempDir();
    const result = await run({
      env: { METOFFICE_API_KEY: "key", METOFFICE_ORDER_ID: "order" },
      outDir,
      fetchImpl: okFetch(),
      sleep: noSleep,
      log: noop
    });
    assert.equal(result.changed, true);
    assert.equal((await stat(path.join(outDir, "latest-rainfall.png"))).size, PNG.length);
    const latest = JSON.parse(await readFile(path.join(outDir, "latest.json"), "utf8"));
    assert.equal(latest.selectedFileId, "rainfall_202606290530.png");
  }],
  ["preserve previous output on failure", async () => {
    const outDir = await tempDir();
    await writeFile(path.join(outDir, "latest-rainfall.png"), PNG);
    await writeFile(path.join(outDir, "latest.json"), JSON.stringify({ status: "ok" }));
    await assert.rejects(() => run({
      env: { METOFFICE_API_KEY: "key", METOFFICE_ORDER_ID: "order" },
      outDir,
      fetchImpl: sequenceFetch([statusResponse(401, "Unauthorized")]),
      sleep: noSleep,
      log: noop
    }), /authentication/);
    assert.equal((await readFile(path.join(outDir, "latest.json"), "utf8")), JSON.stringify({ status: "ok" }));
  }],
  ["redaction of secrets", async () => {
    assert.equal(redact("bad key secret-key", "secret-key"), "bad key [redacted]");
    assert.match(classifyHttpStatus(403), /authentication/);
    assert.equal(parseValidTimestamp("rainfall_202606290530.png"), "2026-06-29T05:30:00Z");
  }]
];

for (const [name, test] of tests) {
  await test();
  console.log(`ok - ${name}`);
}

async function tempDir() {
  return mkdtemp(path.join(os.tmpdir(), "fieldops-metoffice-"));
}

function okFetch() {
  return sequenceFetch([
    jsonResponse({ files: ["rainfall_202606290530.png"] }),
    bytesResponse(PNG)
  ]);
}

function sequenceFetch(responses) {
  const queue = [...responses];
  return async () => {
    const next = queue.shift();
    if (!next) throw new Error("Unexpected fetch call");
    return typeof next === "function" ? next() : next;
  };
}

function jsonResponse(value) {
  return {
    ok: true,
    status: 200,
    statusText: "OK",
    json: async () => value,
    arrayBuffer: async () => Buffer.from(JSON.stringify(value))
  };
}

function bytesResponse(value) {
  return {
    ok: true,
    status: 200,
    statusText: "OK",
    json: async () => { throw new Error("not json"); },
    arrayBuffer: async () => value
  };
}

function statusResponse(status, statusText) {
  return {
    ok: false,
    status,
    statusText,
    json: async () => ({}),
    arrayBuffer: async () => Buffer.from("")
  };
}

function noSleep() {}

function noop() {}

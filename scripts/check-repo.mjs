import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const args = new Set(process.argv.slice(2));
const scopeArg = process.argv.find((arg) => arg.startsWith("--scope="));
const scope = scopeArg ? scopeArg.slice("--scope=".length) : "all";

const SKIP_DIRS = new Set([".git", "node_modules", "dist", "build", "coverage"]);
const BINARY_EXTENSIONS = new Set([
  ".bin",
  ".gif",
  ".gz",
  ".ico",
  ".jpeg",
  ".jpg",
  ".otf",
  ".pdf",
  ".png",
  ".ttf",
  ".webp",
  ".woff",
  ".woff2",
  ".zip"
]);
const TEXT_EXTENSIONS = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".svg",
  ".txt",
  ".yaml",
  ".yml"
]);
const STALE_TERMS = [
  "Preseli",
  "Wenvoe",
  "Haverfordwest",
  "Fishguard",
  "Blaenplwyf",
  "Carmarthen",
  "prototype",
  "demo",
  "experiment",
  "temporary",
  "test data",
  "no map",
  "no markers",
  "destination:",
  "end of file"
];
const SECRET_PATTERNS = [
  /AKIA[0-9A-Z]{16}/g,
  /AIza[0-9A-Za-z_-]{35}/g,
  /ghp_[0-9A-Za-z]{36}/g,
  /github_pat_[0-9A-Za-z_]{40,}/g,
  /(?:api[_-]?key|token|secret|password)\s*[:=]\s*["'][^"']{12,}["']/gi
];
const ALLOWED_DYNAMIC_REFS = [
  /\$\{/,
  /^-/,
  /\{z\}\/\{x\}\/\{y\}/,
  /^https?:/i
];

const problems = [];
const warnings = [];

function issue(type, file, message, severity = "error") {
  const target = { severity, type, file, message };
  if (severity === "error") problems.push(target);
  else warnings.push(target);
}

function posixPath(value) {
  return value.split(path.sep).join("/");
}

function isSkipped(relativePath) {
  return relativePath.split("/").some((part) => SKIP_DIRS.has(part));
}

function isTextFile(relativePath) {
  const ext = path.extname(relativePath).toLowerCase();
  return TEXT_EXTENSIONS.has(ext) && !BINARY_EXTENSIONS.has(ext);
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    const relativePath = posixPath(path.relative(ROOT, fullPath));
    if (isSkipped(relativePath)) continue;
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
    } else if (isTextFile(relativePath)) {
      files.push(relativePath);
    }
  }
  return files;
}

function stripRef(ref) {
  return ref.split("#")[0].split("?")[0];
}

function resolveRef(fromFile, ref) {
  if (!ref || /^(https?:|mailto:|tel:|data:|javascript:|#)/i.test(ref)) return null;
  const clean = stripRef(ref.trim());
  if (!clean || ALLOWED_DYNAMIC_REFS.some((pattern) => pattern.test(clean))) return null;
  const fromDir = path.posix.dirname(fromFile);
  return path.posix.normalize(path.posix.join(fromDir, clean));
}

async function existsRelative(relativePath) {
  if (!relativePath || relativePath.startsWith("..")) return false;
  return existsSync(path.join(ROOT, relativePath));
}

function extractHtmlIds(text) {
  return [...text.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]);
}

function extractHtmlRefs(text) {
  return [...text.matchAll(/\b(?:href|src|action|poster)\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]);
}

function extractCssUrls(text) {
  return [...text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)].map((match) => match[1]);
}

function extractStringPaths(text) {
  return [...text.matchAll(/["'`]([^"'`]+\.(?:html|js|mjs|css|json|svg|png|jpg|jpeg|webp|gif|gltf|bin)(?:[?#][^"'`]*)?)["'`]/gi)].map((match) => match[1]);
}

function extractFetchPaths(text) {
  return [...text.matchAll(/\bfetch\(\s*["'`]([^"'`]+)["'`]/gi)].map((match) => match[1]);
}

function extractDomRefs(text) {
  const ids = [...text.matchAll(/getElementById\(\s*["'`]([^"'`]+)["'`]\s*\)/g)].map((match) => match[1]);
  const selectors = [...text.matchAll(/querySelector(?:All)?\(\s*["'`]([^"'`]+)["'`]\s*\)/g)].map((match) => match[1]);
  return { ids, selectors };
}

function classifyEntry(relativePath) {
  if (relativePath === "index.html" || relativePath === "settings.html" || relativePath === "sw.js") return true;
  if (/^FieldOpsAtlas\/Features\/[^/]+\/index\.html$/.test(relativePath)) return true;
  if (/^FieldOpsAtlas\/Features\/RFPages\/[^/]+\.html$/.test(relativePath)) return true;
  if (relativePath.startsWith(".github/workflows/") || relativePath.startsWith("scripts/")) return true;
  return false;
}

async function readAll(files) {
  const texts = new Map();
  for (const file of files) {
    texts.set(file, await readFile(path.join(ROOT, file), "utf8"));
  }
  return texts;
}

function buildDependencies(files, texts) {
  const fileSet = new Set(files);
  const dependencies = new Map();
  const add = (from, to) => {
    if (!to) return;
    if (!dependencies.has(from)) dependencies.set(from, new Set());
    dependencies.get(from).add(to);
  };

  for (const file of files) {
    const text = texts.get(file) || "";
    const ext = path.extname(file).toLowerCase();
    if (ext === ".html") {
      for (const ref of extractHtmlRefs(text)) add(file, resolveRef(file, ref));
    }
    if (ext === ".html" || ext === ".css" || ext === ".svg") {
      for (const ref of extractCssUrls(text)) add(file, resolveRef(file, ref));
    }
    if ([".html", ".js", ".mjs", ".yml", ".yaml"].includes(ext)) {
      for (const ref of extractStringPaths(text)) add(file, resolveRef(file, ref));
      for (const ref of extractFetchPaths(text)) add(file, resolveRef(file, ref));
    }
  }

  const seeds = files.filter(classifyEntry);
  const reachable = new Set();
  const stack = [...seeds];
  while (stack.length) {
    const file = stack.pop();
    if (reachable.has(file)) continue;
    reachable.add(file);
    for (const dependency of dependencies.get(file) || []) {
      if (fileSet.has(dependency) && !reachable.has(dependency)) stack.push(dependency);
    }
  }

  return { dependencies, reachable, seeds };
}

async function checkJavaScript(files) {
  for (const file of files.filter((item) => [".js", ".mjs"].includes(path.extname(item).toLowerCase()))) {
    const result = spawnSync(process.execPath, ["--check", file], { cwd: ROOT, encoding: "utf8" });
    if (result.status !== 0) {
      issue("js-syntax", file, (result.stderr || result.stdout || "JavaScript syntax check failed").trim());
    }
  }
}

function checkJson(files, texts) {
  for (const file of files.filter((item) => path.extname(item).toLowerCase() === ".json")) {
    try {
      JSON.parse(texts.get(file));
    } catch (error) {
      issue("json", file, error.message);
    }
  }
}

function checkYaml(files, texts) {
  for (const file of files.filter((item) => [".yml", ".yaml"].includes(path.extname(item).toLowerCase()))) {
    const lines = texts.get(file).split(/\r?\n/);
    lines.forEach((line, index) => {
      if (/^\t+/.test(line)) issue("yaml", file, `Line ${index + 1}: tabs are not valid indentation`);
      if (/^\s*-\s*$/.test(line)) issue("yaml", file, `Line ${index + 1}: empty list item`);
    });
  }
}

async function checkLinks(files, texts) {
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const refs = [];
    if (ext === ".html") refs.push(...extractHtmlRefs(texts.get(file)));
    if ([".html", ".css", ".svg"].includes(ext)) refs.push(...extractCssUrls(texts.get(file)));
    if ([".html", ".js", ".mjs", ".yml", ".yaml"].includes(ext)) {
      refs.push(...extractStringPaths(texts.get(file)));
      refs.push(...extractFetchPaths(texts.get(file)));
    }
    for (const ref of refs) {
      const target = resolveRef(file, ref);
      if (target && !await existsRelative(target)) {
        issue("link", file, `Missing internal reference: ${ref} -> ${target}`);
      }
    }
  }
}

function checkHtml(files, texts) {
  for (const file of files.filter((item) => path.extname(item).toLowerCase() === ".html")) {
    const seen = new Set();
    for (const id of extractHtmlIds(texts.get(file))) {
      if (seen.has(id)) issue("html-id", file, `Duplicate id: ${id}`);
      seen.add(id);
    }
  }
}

function scriptOwners(files, texts) {
  const owners = new Map();
  for (const html of files.filter((item) => path.extname(item).toLowerCase() === ".html")) {
    const text = texts.get(html);
    for (const ref of extractHtmlRefs(text)) {
      if (!ref.endsWith(".js") && !ref.includes(".js?")) continue;
      const resolved = resolveRef(html, ref);
      if (!resolved) continue;
      if (!owners.has(resolved)) owners.set(resolved, []);
      owners.get(resolved).push(html);
    }
  }
  return owners;
}

function checkRefs(files, texts) {
  const owners = scriptOwners(files, texts);
  const htmlIds = new Map(files.filter((item) => path.extname(item).toLowerCase() === ".html").map((file) => [file, new Set(extractHtmlIds(texts.get(file)))]));
  for (const js of files.filter((item) => [".js", ".mjs"].includes(path.extname(item).toLowerCase()))) {
    const refs = extractDomRefs(texts.get(js));
    const pages = owners.get(js) || [];
    if (!pages.length || js === "shell.js") continue;
    for (const page of pages) {
      const ids = htmlIds.get(page) || new Set();
      for (const id of refs.ids) {
        if (!ids.has(id)) issue("element-ref", js, `${id} is not present in ${page}`, "warning");
      }
      for (const selector of refs.selectors) {
        if (/^#[A-Za-z0-9_-]+$/.test(selector) && !ids.has(selector.slice(1))) {
          issue("element-ref", js, `${selector} is not present in ${page}`, "warning");
        }
      }
    }
  }
}

function checkCss(files, texts) {
  const usedText = [...texts.entries()]
    .filter(([file]) => [".html", ".js", ".mjs"].includes(path.extname(file).toLowerCase()))
    .map(([, text]) => text)
    .join("\n");
  for (const css of files.filter((item) => path.extname(item).toLowerCase() === ".css")) {
    const text = texts.get(css);
    const selectors = [...text.matchAll(/(^|})\s*([.#][A-Za-z0-9_-]+)\b/g)].map((match) => match[2].slice(1));
    for (const selector of new Set(selectors)) {
      if (!usedText.includes(selector)) issue("css-unused", css, `Selector appears unused: ${selector}`, "warning");
    }
  }
}

function checkSecrets(files, texts) {
  for (const [file, text] of texts.entries()) {
    if (file.toLowerCase().includes("license")) continue;
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(text)) issue("secret", file, `Possible committed secret matched ${pattern}`);
      pattern.lastIndex = 0;
    }
    if (/^<{7}|^={7}|^>{7}/m.test(text)) issue("merge-marker", file, "Unresolved merge marker");
  }
}

function checkTextQuality(files, texts) {
  for (const [file, text] of texts.entries()) {
    for (const term of STALE_TERMS) {
      const pattern = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      if (pattern.test(text)) issue("stale-term", file, `Contains tracked term: ${term}`, "warning");
    }
    if (/^\/\*[\s\S]{250,}?\*\//.test(text) || /^\/\/.{100,}/m.test(text)) {
      issue("banner", file, "Possible excessive file banner", "warning");
    }
  }
}

function checkDuplicates(files, texts) {
  const groups = new Map();
  for (const [file, text] of texts.entries()) {
    const hash = createHash("sha256").update(text).digest("hex");
    if (!groups.has(hash)) groups.set(hash, []);
    groups.get(hash).push(file);
  }
  for (const group of groups.values()) {
    if (group.length > 1) issue("duplicate-file", group[0], `Exact duplicates: ${group.join(", ")}`, "warning");
  }
}

function checkOrphans(files, dependencies) {
  const referenced = new Set();
  for (const deps of dependencies.values()) for (const dependency of deps) referenced.add(dependency);
  for (const file of files) {
    if (classifyEntry(file)) continue;
    if (file.startsWith("archive/") || file.includes("/archive/")) continue;
    if ([".md", ".txt"].includes(path.extname(file).toLowerCase())) continue;
    if (!referenced.has(file)) issue("orphan", file, "No first-party references found", "warning");
  }
}

function checkWorkflows(files, texts) {
  const workflows = files.filter((file) => file.startsWith(".github/workflows/") && [".yml", ".yaml"].includes(path.extname(file).toLowerCase()));
  for (const file of workflows) {
    const text = texts.get(file);
    const schedules = [...text.matchAll(/\bcron:\s*["']([^"']+)["']/g)];
    if (schedules.length > 1) issue("workflow-schedule", file, "Workflow has more than one schedule");
    if (/schedule:/i.test(text) && !/workflow_dispatch:/i.test(text)) issue("workflow-dispatch", file, "Scheduled workflow should keep workflow_dispatch");
    for (const match of text.matchAll(/\brun:\s*(.+)/g)) {
      const command = match[1].trim();
      const scriptMatch = command.match(/(?:node|npm run)\s+([^\s]+)/);
      if (scriptMatch && scriptMatch[1].startsWith("scripts/") && !existsSync(path.join(ROOT, scriptMatch[1]))) {
        issue("workflow-script", file, `Missing script referenced by workflow: ${scriptMatch[1]}`);
      }
    }
    const secrets = [...text.matchAll(/secrets\.([A-Z0-9_]+)/g)].map((match) => match[1]);
    for (const secret of secrets) {
      if (!/^[A-Z][A-Z0-9_]+$/.test(secret)) issue("workflow-secret", file, `Suspicious secret name: ${secret}`);
    }
  }
}

function printReport() {
  console.log("Repository check report");
  console.log(`Errors: ${problems.length}`);
  console.log(`Warnings: ${warnings.length}`);
  for (const item of [...problems, ...warnings]) {
    const prefix = item.severity === "error" ? "ERROR" : "WARN";
    console.log(`${prefix} [${item.type}] ${item.file}: ${item.message}`);
  }
}

async function main() {
  const files = await walk(ROOT);
  const texts = await readAll(files);
  const { dependencies } = buildDependencies(files, texts);

  if (scope === "all" || scope === "js") await checkJavaScript(files);
  if (scope === "all" || scope === "json") checkJson(files, texts);
  if (scope === "all" || scope === "workflows") {
    checkYaml(files, texts);
    checkWorkflows(files, texts);
  }
  if (scope === "all" || scope === "links") await checkLinks(files, texts);
  if (scope === "all" || scope === "html") checkHtml(files, texts);
  if (scope === "all" || scope === "refs") checkRefs(files, texts);
  if (scope === "all" || scope === "css") checkCss(files, texts);
  if (scope === "all" || scope === "secrets") checkSecrets(files, texts);
  if (scope === "all" || args.has("--audit")) {
    checkTextQuality(files, texts);
    checkDuplicates(files, texts);
    checkOrphans(files, dependencies);
  }

  printReport();
  if (problems.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

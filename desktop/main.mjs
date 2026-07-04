import { app, BrowserWindow, Menu, ipcMain, protocol, shell } from "electron";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APP_ROOT = path.resolve(__dirname, "..");
const LIVE_URL = process.env.FIELDOPS_DESKTOP_URL || "https://a-engi.github.io/FieldOpsAtlas-Web/";
const LOCAL_URL = "fieldops://app/";
const REPOSITORY_URL = "https://github.com/A-engi/FieldOpsAtlas-Web";
const VALID_SOURCES = new Set(["live", "local"]);
const INDEX_FILE = ["index", "html"].join(".");

let mainWindow = null;
let activeSource = initialSource();

protocol.registerSchemesAsPrivileged([
  {
    scheme: "fieldops",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      stream: true
    }
  }
]);

function initialSource() {
  if (process.argv.includes("--local")) return "local";
  if (process.argv.includes("--live")) return "live";

  const envSource = String(process.env.FIELDOPS_DESKTOP_SOURCE || "").toLowerCase();
  return envSource === "local" ? "local" : "live";
}

function mimeType(filePath) {
  switch (path.extname(filePath).toLowerCase()) {
    case ".css":
      return "text/css; charset=utf-8";
    case ".html":
      return "text/html; charset=utf-8";
    case ".js":
    case ".mjs":
      return "application/javascript; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".gltf":
      return "model/gltf+json";
    case ".bin":
      return "application/octet-stream";
    case ".txt":
      return "text/plain; charset=utf-8";
    default:
      return "application/octet-stream";
  }
}

function textResponse(message, status = 500) {
  return new Response(message, {
    status,
    headers: {
      "content-type": "text/plain; charset=utf-8"
    }
  });
}

function resolveLocalPath(requestUrl) {
  const url = new URL(requestUrl);

  if (url.hostname !== "app") {
    throw new Error("Unknown local app host.");
  }

  let pathname = decodeURIComponent(url.pathname || "/");
  if (pathname === "/" || pathname === "") pathname = "/" + INDEX_FILE;
  if (pathname.endsWith("/")) pathname += INDEX_FILE;

  const normalisedPath = pathname.replace(/\\/g, "/").replace(/^\/+/, "");
  const targetPath = path.resolve(APP_ROOT, normalisedPath);
  const rootWithSeparator = APP_ROOT.endsWith(path.sep) ? APP_ROOT : APP_ROOT + path.sep;

  if (targetPath !== APP_ROOT && !targetPath.startsWith(rootWithSeparator)) {
    throw new Error("Local app path escapes the repository root.");
  }

  return targetPath;
}

async function readLocalResponse(targetPath) {
  let filePath = targetPath;
  const currentStat = await stat(filePath).catch(() => null);

  if (!currentStat) {
    return textResponse("Not found", 404);
  }

  if (currentStat.isDirectory()) {
    filePath = path.join(filePath, INDEX_FILE);
  }

  const data = await readFile(filePath);
  return new Response(data, {
    headers: {
      "cache-control": "no-cache",
      "content-type": mimeType(filePath)
    }
  });
}

function registerLocalProtocol() {
  protocol.handle("fieldops", async (request) => {
    try {
      return await readLocalResponse(resolveLocalPath(request.url));
    } catch (error) {
      return textResponse(error.message, 404);
    }
  });
}

function isInternalNavigation(rawUrl) {
  try {
    const url = new URL(rawUrl);
    const liveOrigin = new URL(LIVE_URL).origin;
    return url.protocol === "fieldops:" || url.origin === liveOrigin;
  } catch (error) {
    return false;
  }
}

function sourceDetails() {
  return {
    source: activeSource,
    liveUrl: LIVE_URL,
    localUrl: LOCAL_URL
  };
}

function buildMenu() {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Use GitHub Pages Copy",
          type: "radio",
          checked: activeSource === "live",
          click: () => loadSource("live")
        },
        {
          label: "Use Packaged Copy",
          type: "radio",
          checked: activeSource === "local",
          click: () => loadSource("local")
        },
        { type: "separator" },
        { role: "reload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: process.platform === "darwin" ? "close" : "quit" }
      ]
    },
    {
      label: "View",
      submenu: [
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" }
      ]
    },
    {
      label: "Help",
      submenu: [
        {
          label: "Open Live App",
          click: () => shell.openExternal(LIVE_URL)
        },
        {
          label: "Open GitHub Repository",
          click: () => shell.openExternal(REPOSITORY_URL)
        }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

async function loadSource(source, options = {}) {
  if (!VALID_SOURCES.has(source) || !mainWindow) return;

  activeSource = source;
  buildMenu();

  const targetUrl = source === "local" ? LOCAL_URL : LIVE_URL;

  try {
    await mainWindow.loadURL(targetUrl);
  } catch (error) {
    if (source === "live" && !options.fallbackAttempt) {
      await loadSource("local", { fallbackAttempt: true });
      return;
    }

    throw error;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 430,
    height: 860,
    minWidth: 360,
    minHeight: 700,
    title: "FieldOps Atlas",
    backgroundColor: "#071d3f",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.cjs")
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isInternalNavigation(url)) {
      return { action: "allow" };
    }

    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (isInternalNavigation(url)) return;

    event.preventDefault();
    shell.openExternal(url);
  });

  mainWindow.webContents.on("did-fail-load", (_event, errorCode, _errorDescription, _validatedUrl, isMainFrame) => {
    if (!isMainFrame || activeSource !== "live" || errorCode === -3) return;
    loadSource("local", { fallbackAttempt: true }).catch((error) => {
      console.error("Failed to load packaged FieldOps Atlas fallback.", error);
    });
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  buildMenu();
  loadSource(activeSource).catch((error) => {
    console.error("Failed to load FieldOps Atlas.", error);
  });
}

ipcMain.handle("fieldops:source", () => sourceDetails());

ipcMain.handle("fieldops:set-source", async (_event, source) => {
  await loadSource(String(source || "").toLowerCase());
  return sourceDetails();
});

app.setName("FieldOps Atlas");

app.whenReady().then(() => {
  registerLocalProtocol();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

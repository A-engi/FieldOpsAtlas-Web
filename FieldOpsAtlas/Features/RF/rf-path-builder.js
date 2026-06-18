/* ===========================================================================
   FieldOps Atlas RF site/path builder
   File: FieldOpsAtlas/Features/RF/rf-path-builder.js
   Version: 1.1.122-site-builder-source

   Purpose:
   - Own the RF demo site model used by both Path Details and the Graph renderer.
   - Build graph nodes from named RF sites first, not placeholder path labels.
   - Keep graph drawing in rf-graph.js.
   - Keep the demo graph clearly marked as placeholder data.
   - Do not use service/equipment records as graph site names.
   - Render Site, Summary, Service, Equipment, and Frequency items as separate
     path-detail fields.
   - Leave pane shell, collapse behaviour, and sizing to rf-interface.js/css.
   ========================================================================== */

(() => {
  "use strict";

  const VERSION = "1.1.122-site-builder-source";
  const SLOT_SELECTOR = "[data-rf-path-details]";
  const PANE_READY_EVENT = "fieldops:rf-pane-shell-ready";
  const RENDERED_EVENT = "fieldops:rf-path-details-rendered";
  const DISPLAY_LIMIT = 4;

  const FALLBACK_SITES = [
    {
      id: "london-core",
      name: "London Core",
      role: "Primary network node",
      status: "Online",
      nodeType: "core",
      size: "large",
      href: "../RFPages/sites.html#london-core"
    },
    {
      id: "hilltop",
      name: "Hilltop Relay",
      role: "Relay site",
      status: "Online",
      nodeType: "relay",
      href: "../RFPages/sites.html#hilltop"
    },
    {
      id: "ridgeway",
      name: "Ridgeway Relay",
      role: "Regional relay",
      status: "Watch",
      nodeType: "relay",
      href: "../RFPages/sites.html#ridgeway"
    },
    {
      id: "pinewood",
      name: "Pinewood Remote",
      role: "Remote monitored site",
      status: "Online",
      nodeType: "remote",
      size: "large",
      href: "../RFPages/sites.html#pinewood"
    }
  ];

  const SITE_LAYOUTS = {
    "london-core": {
      x: 0.15,
      y: 0.72,
      label: { dx: 0, dy: 54, anchor: "middle" },
      labelTight: { dx: 0, dy: 50, anchor: "middle" }
    },
    hilltop: {
      x: 0.50,
      y: 0.28,
      label: { dx: 0, dy: -42, anchor: "middle" },
      labelTight: { dx: 0, dy: -38, anchor: "middle" }
    },
    ridgeway: {
      x: 0.85,
      y: 0.72,
      label: { dx: 0, dy: 54, anchor: "middle" },
      labelTight: { dx: 0, dy: 50, anchor: "middle" }
    },
    pinewood: {
      x: 0.30,
      y: 0.13,
      label: { dx: 0, dy: -34, anchor: "middle" },
      labelTight: { dx: 0, dy: -32, anchor: "middle" }
    }
  };

  const GLOBAL_SOURCES = {
    sites: ["FieldOpsRFSites", "FieldOpsSites", "FieldOpsSiteFiles"],
    frequencies: ["FieldOpsRFFrequencies", "FieldOpsFrequencies", "FieldOpsFrequencyFiles"],
    services: ["FieldOpsRFServices", "FieldOpsServices", "FieldOpsServiceFiles"],
    equipment: ["FieldOpsRFEquipment", "FieldOpsEquipment", "FieldOpsEquipmentFiles"]
  };

  function asList(value) {
    if (Array.isArray(value)) return value;
    if (value && Array.isArray(value.items)) return value.items;
    if (value && Array.isArray(value.sites)) return value.sites;
    if (value && Array.isArray(value.records)) return value.records;
    return [];
  }

  function cleanText(value) {
    return String(value ?? "").replace(/\s+/g, " ").trim();
  }

  function escapeHTML(value) {
    return cleanText(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function stableId(value, fallback) {
    const id = cleanText(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return id || fallback;
  }

  function idFromHrefOrText(href, text, fallback) {
    const rawHref = cleanText(href);
    const hash = rawHref.includes("#") ? rawHref.split("#").pop() : "";
    return stableId(hash || text, fallback);
  }

  function readGlobalLists(names) {
    return names.flatMap((name) => asList(window[name]));
  }

  function sourceCountLabel(count, fallback) {
    if (!count) return fallback;
    return `${count} source ${count === 1 ? "item" : "items"}`;
  }

  function siteTypeFromText(value, fallback = "relay") {
    const text = cleanText(value).toLowerCase();

    if (/\b(core|primary|main)\b/.test(text)) return "core";
    if (/\b(remote|rem)\b/.test(text)) return "remote";
    if (/\b(relay|tx)\b/.test(text)) return "relay";

    return fallback;
  }

  function normaliseSourceRecord(record, index, fallbackType) {
    const name = cleanText(record.name || record.title || record.label || record.id || `${fallbackType} ${index + 1}`);
    const href = cleanText(record.href || record.url || "");
    const id = idFromHrefOrText(href, record.id || record.slug || name, `${fallbackType}-${index + 1}`);

    return {
      id,
      name,
      role: cleanText(record.role || record.subtitle || record.description || fallbackType),
      status: cleanText(record.status || ""),
      href,
      type: fallbackType,
      nodeType: cleanText(record.nodeType || record.siteType || record.kind || siteTypeFromText(`${name} ${record.role || record.subtitle || ""}`))
    };
  }

  function normaliseFallbackSite(site, index) {
    return {
      id: stableId(site.id || site.name, `site-${index + 1}`),
      name: cleanText(site.name || `Site ${index + 1}`),
      role: cleanText(site.role || "Demo RF site"),
      status: cleanText(site.status || ""),
      href: cleanText(site.href || ""),
      type: "site",
      nodeType: cleanText(site.nodeType || siteTypeFromText(`${site.name} ${site.role}`, "relay")),
      size: cleanText(site.size || "")
    };
  }

  function readRecentCards(root) {
    return [...root.querySelectorAll(".rf-recent-card")].map((card, index) => {
      const name = cleanText(card.querySelector(".rf-recent-name")?.textContent || card.textContent || `Site ${index + 1}`);
      const status = cleanText(card.querySelector(".rf-status")?.textContent || "");
      const href = cleanText(card.getAttribute("href") || "");

      return {
        id: idFromHrefOrText(href, name, `site-${index + 1}`),
        name,
        role: siteTypeFromText(name, "relay") === "core" ? "Primary network node" : "RF site",
        status,
        href,
        type: "site",
        nodeType: siteTypeFromText(name, "relay")
      };
    });
  }

  function isQueuedSiteItem(item) {
    const id = cleanText(item.id).toLowerCase();
    const title = cleanText(item.title);
    const keywords = asList(item.keywords).join(" ").toLowerCase();

    if (title.toLowerCase() === "sites") return false;
    if (id.startsWith("site-")) return true;

    return /\b(relay|core|remote|transmitter|tx site)\b/.test(`${title.toLowerCase()} ${keywords}`);
  }

  function collectQueuedSiteSources() {
    return asList(window.FieldOpsSearchQueue)
      .flatMap((group) => asList(group.items))
      .filter(isQueuedSiteItem)
      .map((item, index) => normaliseSourceRecord(item, index, "site"));
  }

  function collectSiteSources(root = document) {
    const candidates = [
      ...readRecentCards(root),
      ...readGlobalLists(GLOBAL_SOURCES.sites).map((record, index) => normaliseSourceRecord(record, index, "site")),
      ...collectQueuedSiteSources(),
      ...FALLBACK_SITES.map(normaliseFallbackSite)
    ];

    const unique = new Map();

    candidates.forEach((site) => {
      if (!site.name) return;
      if (!unique.has(site.id)) unique.set(site.id, site);
    });

    return [...unique.values()].slice(0, DISPLAY_LIMIT);
  }

  function collectServiceSources(root) {
    const currentRows = [...root.querySelectorAll(".rf-service-row")].map((row, index) => ({
      id: idFromHrefOrText(row.getAttribute("href"), row.textContent, `service-${index + 1}`),
      name: cleanText(row.querySelector("span")?.textContent || row.textContent || `Service ${index + 1}`),
      role: "Source item",
      type: "service"
    }));
    const futureRows = readGlobalLists(GLOBAL_SOURCES.services).map((record, index) => normaliseSourceRecord(record, index, "service"));
    return [...currentRows, ...futureRows];
  }

  function collectEquipmentSources(root) {
    const currentRows = [...root.querySelectorAll(".rf-equipment-card")].map((card, index) => ({
      id: idFromHrefOrText(card.getAttribute("href"), card.textContent, `equipment-${index + 1}`),
      name: cleanText(card.querySelector("span")?.textContent || card.textContent || `Equipment ${index + 1}`),
      role: "Source item",
      type: "equipment"
    }));
    const futureRows = readGlobalLists(GLOBAL_SOURCES.equipment).map((record, index) => normaliseSourceRecord(record, index, "equipment"));
    return [...currentRows, ...futureRows];
  }

  function collectFrequencySources() {
    return readGlobalLists(GLOBAL_SOURCES.frequencies).map((record, index) => normaliseSourceRecord(record, index, "frequency"));
  }

  function buildSourceCounts(root = document) {
    return {
      sites: collectSiteSources(root).length,
      services: collectServiceSources(root).length,
      equipment: collectEquipmentSources(root).length,
      frequencies: collectFrequencySources().length
    };
  }

  function rowsFromSources(sources, label, emptyTitle, emptyDetail) {
    if (!sources.length) {
      return [{ label, value: emptyTitle, detail: emptyDetail }];
    }

    return sources.slice(0, DISPLAY_LIMIT).map((source, index) => ({
      label: `${label} ${index + 1}`,
      value: source.name || source.id || "Source item",
      detail: source.role || source.status || source.type || "Source item"
    }));
  }

  function buildGenericInfo(sourceCounts) {
    return [
      { label: "Mode", value: "Site builder", detail: "Demo-safe model" },
      { label: "Graph", value: "Named RF sites", detail: "No path-label fallback" },
      { label: "Sites", value: `${sourceCounts.sites} loaded`, detail: "Current RF page first" },
      { label: "Data", value: "Prototype-safe", detail: "Replace when real records exist" },
      { label: "Sources", value: sourceCountLabel(sourceCounts.sites, "No source pack"), detail: "Site records only" }
    ];
  }

  function buildSitePack(root = document) {
    const sources = {
      sites: collectSiteSources(root),
      services: collectServiceSources(root),
      equipment: collectEquipmentSources(root),
      frequencies: collectFrequencySources()
    };

    const sourceCounts = {
      sites: sources.sites.length,
      services: sources.services.length,
      equipment: sources.equipment.length,
      frequencies: sources.frequencies.length
    };

    return {
      id: "demo-site-pack",
      sites: sources.sites,
      from: sources.sites[0],
      via: sources.sites[1],
      to: sources.sites[2],
      genericInfo: buildGenericInfo(sourceCounts),
      services: rowsFromSources(sources.services, "Service", "Future service file", "Service field"),
      equipment: rowsFromSources(sources.equipment, "Equipment", "Future equipment file", "Equipment field"),
      frequencies: rowsFromSources(sources.frequencies, "Frequency", "Future frequency file", "Frequency field"),
      sourceCounts
    };
  }

  function isUsableGraph(data) {
    return Boolean(data && Array.isArray(data.nodes) && data.nodes.length > 0 && Array.isArray(data.links));
  }

  function nodeLayout(site, index) {
    return SITE_LAYOUTS[site.id] || [
      {
        x: 0.15,
        y: 0.72,
        label: { dx: 0, dy: 54, anchor: "middle" },
        labelTight: { dx: 0, dy: 50, anchor: "middle" }
      },
      {
        x: 0.50,
        y: 0.28,
        label: { dx: 0, dy: -42, anchor: "middle" },
        labelTight: { dx: 0, dy: -38, anchor: "middle" }
      },
      {
        x: 0.85,
        y: 0.72,
        label: { dx: 0, dy: 54, anchor: "middle" },
        labelTight: { dx: 0, dy: 50, anchor: "middle" }
      },
      {
        x: 0.30,
        y: 0.13,
        label: { dx: 0, dy: -34, anchor: "middle" },
        labelTight: { dx: 0, dy: -32, anchor: "middle" }
      }
    ][index % DISPLAY_LIMIT];
  }

  function graphNodeFromSite(site, index) {
    const layout = nodeLayout(site, index);

    return {
      id: site.id,
      name: site.name,
      type: site.nodeType || siteTypeFromText(`${site.name} ${site.role}`, "relay"),
      size: site.size || (site.nodeType === "core" || site.nodeType === "remote" ? "large" : ""),
      x: layout.x,
      y: layout.y,
      label: layout.label,
      labelTight: layout.labelTight
    };
  }

  function graphLinksFromSites(sites) {
    const links = [];

    if (sites.length >= 2) {
      links.push({ id: `${sites[0].id}-${sites[1].id}`, from: sites[0].id, to: sites[1].id, type: "alert" });
    }

    if (sites.length >= 3) {
      links.push({ id: `${sites[1].id}-${sites[2].id}`, from: sites[1].id, to: sites[2].id, type: "main" });
      links.push({ id: `${sites[0].id}-${sites[2].id}`, from: sites[0].id, to: sites[2].id, type: "backup" });
    }

    if (sites.length >= 4) {
      links.push({ id: `${sites[2].id}-${sites[3].id}`, from: sites[2].id, to: sites[3].id, type: "backup" });
      links.push({ id: `${sites[3].id}-${sites[1].id}`, from: sites[3].id, to: sites[1].id, type: "main" });
    }

    return links;
  }

  function buildGraph(root = document) {
    if (isUsableGraph(window.ATLAS_RF_GRAPH)) {
      return {
        ...window.ATLAS_RF_GRAPH,
        meta: {
          ...(window.ATLAS_RF_GRAPH.meta || {}),
          source: "window.ATLAS_RF_GRAPH",
          builderVersion: VERSION,
          mode: "external-model"
        }
      };
    }

    const sites = collectSiteSources(root);
    const sourceCounts = buildSourceCounts(root);

    return {
      id: "rf-demo-site-graph",
      selectedPathId: sites.length >= 2 ? `${sites[0].id}-${sites[1].id}` : "",
      meta: {
        source: "FieldOpsRFPathBuilder",
        builderVersion: VERSION,
        mode: "demo-site-builder",
        note: "Demo-safe RF site graph. Replace with real RF path records when available.",
        readyFor: "real-rf-site-path-model",
        sourceCounts
      },
      nodes: sites.map(graphNodeFromSite),
      links: graphLinksFromSites(sites)
    };
  }

  function renderField(label, title, detail) {
    return `
      <section class="rf-path-site">
        <small>${escapeHTML(label)}</small>
        <b>${escapeHTML(title)}</b>
        <span>${escapeHTML(detail)}</span>
      </section>
    `;
  }

  function renderSite(site) {
    if (!site) return "";
    const detail = [site.role, site.status].filter(Boolean).join(" · ") || "RF site";
    return renderField("Site", site.name, detail);
  }

  function renderFields(rows, fallbackDetail) {
    return rows
      .slice(0, DISPLAY_LIMIT)
      .map((row) => renderField(row.label, row.value, row.detail || fallbackDetail))
      .join("");
  }

  function renderPathDetails(pack) {
    return `
      <article class="rf-path-pack" data-rf-path-builder-body data-rf-path-id="${escapeHTML(pack.id)}">
        <section class="rf-path-sites" aria-label="Demo site fields">
          ${pack.sites.map(renderSite).join("")}
        </section>

        <section class="rf-path-sites" aria-label="Demo summary fields">
          ${renderFields(pack.genericInfo, "Demo status")}
        </section>

        <section class="rf-path-sites" aria-label="Demo service fields">
          ${renderFields(pack.services, "Service field")}
        </section>

        <section class="rf-path-sites" aria-label="Demo equipment fields">
          ${renderFields(pack.equipment, "Equipment field")}
        </section>

        <section class="rf-path-sites" aria-label="Demo frequency fields">
          ${renderFields(pack.frequencies, "Frequency field")}
        </section>
      </article>
    `;
  }

  function render(root = document) {
    const slot = root.querySelector(SLOT_SELECTOR);
    if (!slot) return false;

    const sitePack = buildSitePack(root);
    slot.replaceChildren();
    slot.insertAdjacentHTML("beforeend", renderPathDetails(sitePack));
    slot.dataset.rfPathBuilderLoaded = "true";
    slot.dataset.rfPathBuilderVersion = VERSION;

    document.dispatchEvent(new CustomEvent(RENDERED_EVENT, {
      detail: {
        version: VERSION,
        pathId: sitePack.id,
        source: "site-builder-source",
        sourceCounts: sitePack.sourceCounts,
        graph: buildGraph(root)
      }
    }));

    return true;
  }

  function init() {
    if (render()) return;
    document.addEventListener(PANE_READY_EVENT, () => { render(); }, { once: true });
  }

  window.FieldOpsRFPathBuilder = {
    VERSION,
    buildSites: collectSiteSources,
    buildSitePack,
    buildGraph,
    render
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

/* Destination: FieldOpsAtlas/Features/RF/rf-path-builder.js */
/* End of file: FieldOpsAtlas/Features/RF/rf-path-builder.js */

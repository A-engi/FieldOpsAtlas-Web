/* FieldOps Atlas map-app.js v1.1.1 - main map/data/application controller */
(() => {
  "use strict";

  // ---------------------------------------------------------------------------
  // App configuration
  // ---------------------------------------------------------------------------

  const VERSION = "1.1.1";

  const DATA_FILES = {
    regions: "./data/regions.json",
    regionWalks: (regionId) => `./data/regions/${encodeURIComponent(regionId)}-sites.json`,
  };

  const GITHUB_CONFIG = {
    owner: "BeezelBun",
    repo: "The-Field-Engineers-Atlas",
    branch: "main",
    regionsPath: "data/regions.json",
  };

  const STORAGE_KEYS = {
    walks: "fieldops-atlas-local-walks-v2",
    regions: "fieldops-atlas-local-regions-v3",
    selectedRegions: "fieldops-atlas-selected-regions-v5",
    githubToken: "fieldops-atlas-github-token",
    workOnline: "fieldops-atlas-work-online",
  };

  const DEFAULT_REGION = {
    id: "unassigned",
    name: "Unassigned",
    color: "#64748b",
    notes: "Walks without a configured region.",
  };

  const MAP_START = {
    centre: [54.4, -3.2],
    zoom: 6,
    maxZoom: 19,
  };

  // ---------------------------------------------------------------------------
  // DOM references
  // ---------------------------------------------------------------------------

  const $ = (id) => document.getElementById(id);

  const elements = {
    // Map shell
    map: $("map"),
    statusToast: $("statusToast"),

    // Menu and navigation
    menuBtn: $("menuBtn"),
    sideMenu: $("sideMenu"),
    menuOverlay: $("menuOverlay"),
    closeMenuBtn: $("closeMenuBtn"),
    menuSettingsButton: $("menuSettingsButton"),
    menuMapButton: $("menuMapButton"),
    menuRfButton: $("menuRfButton"),
    menuNetworkButton: $("menuNetworkButton"),
    railMapButton: $("railMapButton"),
    railRfButton: $("railRfButton"),
    railNetworkButton: $("railNetworkButton"),
    railToolsButton: $("railToolsButton") || $("railMapButton"),
    railToolsMenu: $("railToolsMenu"),
    railAddWalkButton: $("railAddWalkButton") || $("railAddSiteButton"),
    railSelectRegionButton: $("railSelectRegionButton"),
    railAddRegionButton: $("railAddRegionButton"),
    railReloadButton: $("railReloadButton"),

    // Top map controls
    fitMapBtn: $("fitMapBtn"),
    topFilterMenu: $("topFilterMenu"),
    fitVisibleWalksButton: $("fitVisibleWalksButton") || $("fitVisibleSitesButton"),
    topSelectRegionButton: $("topSelectRegionButton"),
    topRegionTree: $("topRegionTree"),
    topRegionTreeList: $("topRegionTreeList"),
    topActiveRegionText: $("topActiveRegionText"),
    walkSearch: $("walkSearch") || $("walkSearchInput") || $("siteSearch") || $("siteSearchInput"),
    searchSuggestions: $("searchSuggestions") || $("walkSearchResults") || $("siteSearchResults"),

    // Walk detail panel
    infoPanel: $("infoPanel"),
    closeInfoButton: $("closeInfoButton") || $("closeInfoPanelBtn"),
    expandInfoButton: $("expandInfoButton"),
    editSelectedButton: $("editSelectedButton"),
    infoPanelBody: $("infoPanelBody"),
    selectedWalkName: $("selectedWalkName") || $("selectedSiteName"),
    selectedWalkSubtitle: $("selectedWalkSubtitle") || $("selectedSiteSubtitle") || $("selectedSiteHeaderRegion"),
    selectedWalkGrid: $("selectedWalkGrid") || $("selectedSiteGrid"),
    selectedWalkW3W: $("selectedWalkW3W") || $("selectedSiteW3W"),
    selectedWalkServices: $("selectedWalkServices") || $("selectedSiteServices"),
    selectedWalkNotes: $("selectedWalkNotes") || $("selectedSiteNotes") || $("selectedSiteAccess"),
    selectedWalkPressureMemo: $("selectedWalkPressureMemo") || $("selectedSitePressureMemo"),
    selectedWalkWindMemo: $("selectedWalkWindMemo") || $("selectedSiteWindMemo"),
    selectedWalkLightningMemo: $("selectedWalkLightningMemo") || $("selectedSiteLightningMemo"),
    selectedWalkPowerCompany: $("selectedWalkPowerCompany") || $("selectedSitePowerCompany"),
    copyGridButton: $("copyGridButton"),
    copyW3WButton: $("copyW3WButton"),

    // Settings panel
    settingsPanel: $("settingsPanel"),
    closeSettingsButton: $("closeSettingsButton"),
    githubTokenInput: $("githubTokenInput"),
    saveGithubTokenButton: $("saveGithubTokenButton") || $("saveGitHubTokenButton"),
    workOnlineToggle: $("workOnlineToggle") || $("writeToggle"),
    writeToggle: $("writeToggle"),
    clearLocalButton: $("clearLocalButton"),
    reloadDataButton: $("reloadDataButton"),

    // Add/edit walk panel
    addPanel: $("addPanel"),
    closeAddPanelButton: $("closeAddPanelButton"),
    addPanelTitle: $("walkPanelTitle") || $("addPanelTitle") || $("sitePanelTitle"),
    walkNameInput: $("walkNameInput") || $("siteNameInput"),
    walkCoordsInput: $("walkCoordsInput") || $("siteCoordsInput") || $("coordsInput"),
    walkRegionSelect: $("walkRegionSelect") || $("siteRegionSelect"),
    walkNotesInput: $("walkNotesInput") || $("siteNotesInput") || $("accessNotesInput"),
    saveWalkButton: $("saveWalkButton") || $("saveSiteButton") || $("addSiteButton"),
    deleteEditingWalkButton: $("deleteEditingWalkButton") || $("deleteEditingSiteButton"),
    addRegionFromWalkButton: $("addRegionFromWalkButton") || $("addRegionFromSiteButton"),
    cancelEditButton: $("cancelEditButton"),

    // Region panel
    regionPanel: $("regionPanel"),
    closeRegionPanelButton: $("closeRegionPanelButton"),
    regionNameInput: $("regionNameInput"),
    regionColorInput: $("regionColorInput"),
    regionNotesInput: $("regionNotesInput"),
    saveRegionButton: $("saveRegionButton") || $("addRegionButton"),
    deleteRegionButton: $("deleteRegionButton"),
    cancelRegionEditButton: $("cancelRegionEditButton"),
    regionList: $("regionList"),
    toggleAssignWalksSectionButton: $("toggleAssignWalksSectionButton") || $("toggleAssignSitesSectionButton"),
    assignWalksSection: $("assignWalksSection") || $("assignWalksSectionBody") || $("assignSitesSection") || $("assignSitesSectionBody"),
    assignWalksList: $("assignWalksList") || $("siteChecklist") || $("assignSitesList"),
    saveWalkAssignmentsButton: $("saveWalkAssignmentsButton") || $("assignWalksButton") || $("assignSitesButton"),

    // Filter and legend
    filterPanel: $("filterPanel"),
    closeFilterPanelButton: $("closeFilterPanelButton"),
    regionFilterList: $("regionFilterList"),
    applyRegionFilterButton: $("applyRegionFilterButton"),
    clearRegionFilterButton: $("clearRegionFilterButton"),
    showDemoPinsButton: $("showDemoPinsButton"),
    regionLegend: $("regionLegend"),
  };

  // ---------------------------------------------------------------------------
  // App state
  // ---------------------------------------------------------------------------

  const state = {
    map: null,
    markerLayer: null,
    baseWalks: [],
    walks: [],
    localWalks: [],
    regions: [],
    localRegions: [],
    selectedWalkId: null,
    editingWalkId: null,
    editingRegionId: null,
    selectedRegionIds: new Set(),
    regionFileCache: new Map(),
  };

  // ---------------------------------------------------------------------------
  // FieldOps bridge for companion scripts
  // ---------------------------------------------------------------------------

  function atlasBridge() {
    const bridge = window.FieldOpsAtlasBridge = window.FieldOpsAtlasBridge || {};

    bridge.version = VERSION;
    bridge.map = state.map;
    bridge.markerLayer = state.markerLayer;
    bridge.getMap = () => state.map;
    bridge.getMarkerLayer = () => state.markerLayer;
    bridge.getVisibleWalks = () => state.walks.slice();
    bridge.getSelectedWalk = () => getSelectedWalk();
    bridge.getSelectedRegionIds = () => [...state.selectedRegionIds];
    bridge.getRegion = (id) => getRegion(id);
    bridge.selectWalk = (id, expand = true) => selectWalk(id, expand);
    bridge.fitVisibleWalks = () => fitMapToWalks(true);

    return bridge;
  }

  function notifyBridge(eventName, detail = {}) {
    atlasBridge();
    window.dispatchEvent(new CustomEvent(eventName, { detail: { version: VERSION, ...detail } }));
  }

  // ---------------------------------------------------------------------------
  // App lifecycle
  // ---------------------------------------------------------------------------

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    try {
      if (!elements.map || !window.L) {
        showFatal("Map library or map container did not load.");
        return;
      }

      initialiseMap();
      loadStoredSettings();
      wireEvents();

      await loadData();
      renderEverything();

      if (state.selectedRegionIds.size) {
        closeStartupRegionGate();
        fitMapToWalks(false);
        toast(`FieldOps Atlas v${VERSION} loaded`);
      } else {
        promptForRegionSelection();
      }

      setTimeout(() => state.map.invalidateSize(), 150);
    } catch (error) {
      console.error(error);
      showFatal(error.message || "FieldOps Atlas failed to load.");
    }
  }

  function initialiseMap() {
    state.map = L.map(elements.map, {
      zoomControl: false,
      preferCanvas: true,
    }).setView(MAP_START.centre, MAP_START.zoom);

    L.control.zoom({ position: "bottomright" }).addTo(state.map);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: MAP_START.maxZoom,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(state.map);

    state.markerLayer = L.layerGroup().addTo(state.map);
    atlasBridge();
  }

  async function reloadData() {
    state.regionFileCache.clear();
    await loadData();
    renderEverything();
    fitMapToWalks(true);
    toast("Map data reloaded");
  }

  // ---------------------------------------------------------------------------
  // Data loading and normalisation
  // ---------------------------------------------------------------------------

  async function loadData() {
    const regionsPayload = await loadJson(DATA_FILES.regions, []);

    state.localWalks = loadLocalArray(STORAGE_KEYS.walks).map(normaliseWalk).filter(Boolean);
    state.localRegions = loadLocalArray(STORAGE_KEYS.regions).map(normaliseRegion).filter(Boolean);

    const baseRegions = asArray(regionsPayload, "regions").map(normaliseRegion).filter(Boolean);

    state.baseWalks = state.localWalks.slice();
    state.regions = ensureDefaultRegion(mergeById(baseRegions, state.localRegions));

    loadSelectedRegions();
    await refreshVisibleWalks();
  }

  async function loadJson(url, fallback) {
    const response = await fetch(`${url}?cache=${Date.now()}`, { cache: "no-store" });

    if (!response.ok) {
      if (response.status === 404) return fallback;
      throw new Error(`Could not load ${url} (${response.status})`);
    }

    return response.json();
  }

  function asArray(payload, propertyName) {
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload[propertyName])) return payload[propertyName];
    return [];
  }

  async function refreshVisibleWalks() {
    if (!state.selectedRegionIds.size) {
      state.walks = [];
      state.selectedWalkId = null;
      notifyBridge("fieldops-atlas-walks-changed", { walks: 0 });
      return;
    }

    const selectedIds = [...state.selectedRegionIds];
    const walkBatches = [];

    for (const regionId of selectedIds) {
      const fromRegionFile = await loadRegionWalkFile(regionId);
      if (fromRegionFile.length) {
        walkBatches.push(...fromRegionFile);
      } else {
        walkBatches.push(...state.baseWalks.filter((walk) => walk.regionId === regionId));
      }
    }

    const filteredLocalWalks = state.localWalks.filter((walk) => state.selectedRegionIds.has(walk.regionId));
    state.walks = mergeById(walkBatches, filteredLocalWalks);

    if (state.selectedWalkId && !findWalk(state.selectedWalkId)) {
      state.selectedWalkId = null;
    }

    notifyBridge("fieldops-atlas-walks-changed", { walks: state.walks.length });
  }

  async function loadRegionWalkFile(regionId) {
    if (state.regionFileCache.has(regionId)) return state.regionFileCache.get(regionId);

    try {
      const payload = await loadJson(DATA_FILES.regionWalks(regionId), []);
      const rawWalks = asArray(payload, "walks").length
        ? asArray(payload, "walks")
        : asArray(payload, "sites");
      const walks = rawWalks
        .map((walk) => normaliseWalk({ ...walk, regionId: walk.regionId || regionId }))
        .filter(Boolean);

      state.regionFileCache.set(regionId, walks);
      return walks;
    } catch (error) {
      console.warn(`Region file skipped for ${regionId}:`, error);
      state.regionFileCache.set(regionId, []);
      return [];
    }
  }

  function normaliseWalk(rawWalk) {
    if (!rawWalk) return null;

    const id = String(rawWalk.id || rawWalk.slug || slugify(rawWalk.name || "walk")).trim();
    const name = String(rawWalk.name || rawWalk.title || id).trim();
    const lat = numberFrom(rawWalk.lat ?? rawWalk.latitude);
    const lng = numberFrom(rawWalk.lng ?? rawWalk.lon ?? rawWalk.longitude);

    if (!id || !name || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    return {
      ...rawWalk,
      id,
      name,
      lat,
      lng,
      regionId: String(rawWalk.regionId || rawWalk.region || DEFAULT_REGION.id).trim() || DEFAULT_REGION.id,
      siteType: rawWalk.siteType || rawWalk.type || "Walk",
      status: rawWalk.status || "demo",
      gridRef: rawWalk.gridRef || rawWalk.grid || "",
      what3words: rawWalk.what3words || rawWalk.w3w || "",
      notes: rawWalk.notes || rawWalk.accessNotes || rawWalk.description || "",
      services: asStringList(rawWalk.services),
      equipment: asStringList(rawWalk.equipment),
      inputs: asStringList(rawWalk.inputs),
    };
  }

  function normaliseRegion(rawRegion) {
    if (!rawRegion) return null;

    const id = String(rawRegion.id || slugify(rawRegion.name || "region")).trim();
    const name = String(rawRegion.name || id).trim();

    if (!id || !name) return null;

    return {
      id,
      name,
      color: cssColor(rawRegion.color, DEFAULT_REGION.color),
      notes: rawRegion.notes || rawRegion.description || "",
    };
  }

  function ensureDefaultRegion(regions) {
    const cleaned = regions.filter(Boolean);
    if (cleaned.some((region) => region.id === DEFAULT_REGION.id)) return cleaned;
    return [DEFAULT_REGION, ...cleaned];
  }

  // ---------------------------------------------------------------------------
  // Local settings and storage
  // ---------------------------------------------------------------------------

  function loadStoredSettings() {
    const token = localStorage.getItem(STORAGE_KEYS.githubToken) || "";
    const online = localStorage.getItem(STORAGE_KEYS.workOnline) === "true";

    if (elements.githubTokenInput) elements.githubTokenInput.value = token;
    syncWorkOnlineToggles(online);
  }

  function loadLocalArray(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function saveLocalArray(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function loadSelectedRegions() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.selectedRegions) || "[]");
      state.selectedRegionIds = new Set(Array.isArray(stored) ? stored.filter(Boolean) : []);
    } catch {
      state.selectedRegionIds = new Set();
    }
  }

  function saveSelectedRegions() {
    localStorage.setItem(STORAGE_KEYS.selectedRegions, JSON.stringify([...state.selectedRegionIds]));
  }

  function clearLocalData() {
    if (!confirm("Clear local walk and region edits from this browser?")) return;

    localStorage.removeItem(STORAGE_KEYS.walks);
    localStorage.removeItem(STORAGE_KEYS.regions);
    localStorage.removeItem(STORAGE_KEYS.selectedRegions);
    reloadData();
  }

  // ---------------------------------------------------------------------------
  // Event wiring
  // ---------------------------------------------------------------------------

  function wireEvents() {
    on(elements.menuBtn, "click", openMenu);
    on(elements.closeMenuBtn, "click", closeMenu);
    on(elements.menuOverlay, "click", closeMenu);

    on(document, "click", (event) => {
      const openButton = event.target.closest("[data-open-panel]");
      if (openButton) openPanel($(openButton.dataset.openPanel));

      const closeButton = event.target.closest("[data-close-panel]");
      if (closeButton) closePanel($(closeButton.dataset.closePanel));

      const copyButton = event.target.closest("[data-copy-target]");
      if (copyButton) copyTextFromElement(copyButton.dataset.copyTarget);
    });

    on(elements.menuSettingsButton, "click", () => {
      closeMenu();
      openPanel(elements.settingsPanel);
    });

    on(elements.fitMapBtn, "click", toggleTopFilterMenu);
    on(elements.fitVisibleWalksButton, "click", () => {
      closeTopFilterMenu();
      fitMapToWalks(true);
    });
    on(elements.topSelectRegionButton, "click", () => {
      const isOpen = toggleHiddenMenu(elements.topRegionTree);
      setExpanded(elements.topSelectRegionButton, isOpen);
    });

    on(elements.walkSearch, "input", renderSearchSuggestions);
    on(elements.walkSearch, "focus", renderSearchSuggestions);

    on(document, "click", (event) => {
      if (!event.target.closest(".search-shell")) hideSearchSuggestions();

      const clickedTopFilter = event.target.closest("#topFilterMenu") || event.target.closest("#fitMapBtn");
      if (!clickedTopFilter) closeTopFilterMenu();

      const clickedRailTools = event.target.closest("#railToolsMenu") || event.target.closest("#railToolsButton") || event.target.closest("#railMapButton") || event.target.closest(".map-tools-trigger");
      if (!clickedRailTools) closeRailToolsMenu();
    });

    on(elements.railToolsButton, "click", toggleRailToolsMenu);
    on(elements.railAddWalkButton, "click", () => {
      closeRailToolsMenu();
      openAddWalkPanel();
    });
    on(elements.railSelectRegionButton, "click", () => {
      closeRailToolsMenu();
      openPanel(elements.filterPanel);
    });
    on(elements.railAddRegionButton, "click", () => {
      closeRailToolsMenu();
      openRegionPanel();
    });
    on(elements.railReloadButton, "click", async () => {
      closeRailToolsMenu();
      await reloadData();
    });

    on(elements.closeInfoButton, "click", closeInfoPanel);
    on(elements.expandInfoButton, "click", toggleInfoPanelExpansion);
    on(document, "click", (event) => {
      const handle = event.target.closest(".info-panel .panel-drag-target");
      if (handle) toggleInfoPanelExpansion();
    });
    on(elements.editSelectedButton, "click", () => {
      const walk = getSelectedWalk();
      if (walk) openAddWalkPanel(walk);
    });
    on(elements.copyGridButton, "click", () => copySelectedValue("grid"));
    on(elements.copyW3WButton, "click", () => copySelectedValue("w3w"));

    on(elements.closeSettingsButton, "click", () => closePanel(elements.settingsPanel));
    on(elements.saveGithubTokenButton, "click", saveGithubToken);
    on(elements.workOnlineToggle, "change", () => setWorkOnline(elements.workOnlineToggle.checked));
    on(elements.writeToggle, "change", () => setWorkOnline(elements.writeToggle.checked));
    on(elements.clearLocalButton, "click", clearLocalData);
    on(elements.reloadDataButton, "click", reloadData);

    on(elements.closeAddPanelButton, "click", () => closePanel(elements.addPanel));
    on(elements.saveWalkButton, "click", saveWalkFromForm);
    on(elements.deleteEditingWalkButton, "click", deleteEditingWalk);
    on(elements.cancelEditButton, "click", () => closePanel(elements.addPanel));
    on(elements.addRegionFromWalkButton, "click", () => openRegionPanel());

    on(elements.closeRegionPanelButton, "click", () => closePanel(elements.regionPanel));
    on(elements.saveRegionButton, "click", saveRegionFromForm);
    on(elements.deleteRegionButton, "click", deleteEditingRegion);
    on(elements.cancelRegionEditButton, "click", () => openRegionPanel());
    on(elements.toggleAssignWalksSectionButton, "click", () => toggleHiddenMenu(elements.assignWalksSection));
    on(elements.saveWalkAssignmentsButton, "click", saveRegionAssignments);

    on(elements.closeFilterPanelButton, "click", () => closePanel(elements.filterPanel));
    on(elements.applyRegionFilterButton, "click", async () => {
      readRegionCheckboxes();
      await refreshVisibleWalks();
      renderEverything();
      fitMapToWalks(true);
      closePanel(elements.filterPanel);
    });
    on(elements.clearRegionFilterButton, "click", async () => {
      state.selectedRegionIds.clear();
      saveSelectedRegions();
      await refreshVisibleWalks();
      renderEverything();
      fitMapToWalks(true);
      promptForRegionSelection();
    });
    on(elements.showDemoPinsButton, "click", async () => {
      state.selectedRegionIds = new Set(state.regions.map((region) => region.id));
      saveSelectedRegions();
      await refreshVisibleWalks();
      renderEverything();
      fitMapToWalks(true);
    });

    on(document, "click", handleDelegatedClicks);
  }

  function handleDelegatedClicks(event) {
    const actionButton = event.target.closest("[data-action][data-walk]");
    if (actionButton) {
      const walk = findWalk(actionButton.dataset.walk);
      if (!walk) return;
      if (actionButton.dataset.action === "details") selectWalk(walk.id, true);
      if (actionButton.dataset.action === "edit") openAddWalkPanel(walk);
      return;
    }

    const searchButton = event.target.closest("[data-search-walk]");
    if (searchButton) {
      selectWalk(searchButton.dataset.searchWalk, true);
      hideSearchSuggestions();
      return;
    }

    const regionButton = event.target.closest("[data-region-filter]");
    if (regionButton) {
      toggleRegionSelection(regionButton.dataset.regionFilter);
    }

    const editRegionButton = event.target.closest("[data-edit-region]");
    if (editRegionButton) {
      const region = getRegion(editRegionButton.dataset.editRegion);
      openRegionPanel(region);
    }
  }

  function on(target, eventName, handler) {
    if (target) target.addEventListener(eventName, handler);
  }

  // ---------------------------------------------------------------------------
  // Navigation, menus, and panels
  // ---------------------------------------------------------------------------

  function openMenu() {
    elements.sideMenu?.classList.add("is-open");
    elements.menuOverlay?.classList.add("is-open");
    elements.sideMenu?.setAttribute("aria-hidden", "false");
  }

  function closeMenu() {
    elements.sideMenu?.classList.remove("is-open");
    elements.menuOverlay?.classList.remove("is-open");
    elements.sideMenu?.setAttribute("aria-hidden", "true");
  }

  function toggleTopFilterMenu() {
    const isOpen = toggleHiddenMenu(elements.topFilterMenu);
    setExpanded(elements.fitMapBtn, isOpen);
  }

  function closeTopFilterMenu() {
    closeHiddenMenu(elements.topFilterMenu);
    closeHiddenMenu(elements.topRegionTree);
    setExpanded(elements.fitMapBtn, false);
    setExpanded(elements.topSelectRegionButton, false);
  }

  function toggleRailToolsMenu() {
    const isOpen = toggleHiddenMenu(elements.railToolsMenu);
    setExpanded(elements.railToolsButton, isOpen);
  }

  function closeRailToolsMenu() {
    closeHiddenMenu(elements.railToolsMenu);
    setExpanded(elements.railToolsButton, false);
  }

  function openPanel(panel) {
    if (!panel) return;
    panel.classList.remove("is-hidden");
    panel.classList.add("is-open");
  }

  function closePanel(panel) {
    if (!panel) return;
    panel.classList.add("is-hidden");
    panel.classList.remove("is-open");
  }

  function toggleHiddenMenu(element) {
    if (!element) return false;
    const willOpen = element.hidden || !element.classList.contains("is-open");
    element.hidden = !willOpen;
    element.classList.toggle("is-open", willOpen);
    return willOpen;
  }

  function closeHiddenMenu(element) {
    if (!element) return;
    element.hidden = true;
    element.classList.remove("is-open");
  }

  function setExpanded(element, isExpanded) {
    if (element) element.setAttribute("aria-expanded", String(Boolean(isExpanded)));
  }

  // ---------------------------------------------------------------------------
  // Startup region gate
  // ---------------------------------------------------------------------------

  function promptForRegionSelection() {
    closeTopFilterMenu();
    closeRailToolsMenu();
    fitMapToWalks(false);
    renderStartupRegionGate();
    openStartupRegionGate();
    toast("Pick a region to load walks");
  }

  function ensureStartupRegionGate() {
    let gate = $("startupRegionGate");
    if (gate) return gate;

    gate = document.createElement("div");
    gate.id = "startupRegionGate";
    gate.className = "global-operation-overlay";
    gate.hidden = true;
    gate.innerHTML = `
      <div class="global-operation-card startup-region-card" role="dialog" aria-modal="true" aria-labelledby="startupRegionTitle">
        <h2 id="startupRegionTitle">Select your region</h2>
        <p>Choose your normal patch first. Atlas will only load that region file so the map stays light.</p>
        <div id="startupRegionList" class="startup-region-list"></div>
        <div class="panel-actions startup-region-actions">
          <button id="startupChooseLaterButton" type="button" class="ghost-button">Choose later</button>
          <button id="startupSortRegionButton" type="button" class="primary-button">Sort by region</button>
        </div>
      </div>
    `;
    document.body.appendChild(gate);

    $("startupChooseLaterButton")?.addEventListener("click", () => {
      closeStartupRegionGate();
      toast("No region loaded yet");
    });
    $("startupSortRegionButton")?.addEventListener("click", () => {
      closeStartupRegionGate();
      openPanel(elements.filterPanel);
    });

    return gate;
  }

  function renderStartupRegionGate() {
    const gate = ensureStartupRegionGate();
    const list = $("startupRegionList");
    if (!list) return gate;

    list.innerHTML = state.regions.map((region) => `
      <button type="button" data-startup-region="${escapeAttr(region.id)}" style="--region-color: ${escapeAttr(region.color)}">
        <span></span>
        ${escapeHtml(region.name)}
      </button>
    `).join("");

    list.querySelectorAll("[data-startup-region]").forEach((button) => {
      button.addEventListener("click", () => chooseStartupRegion(button.dataset.startupRegion));
    });

    return gate;
  }

  function openStartupRegionGate() {
    const gate = ensureStartupRegionGate();
    gate.hidden = false;
    document.body.classList.add("operation-locked");
  }

  function closeStartupRegionGate() {
    const gate = $("startupRegionGate");
    if (gate) gate.hidden = true;
    document.body.classList.remove("operation-locked");
  }

  async function chooseStartupRegion(regionId) {
    if (!regionId) return;

    const region = getRegion(regionId);
    state.selectedRegionIds = new Set([regionId]);
    saveSelectedRegions();

    toast(`Loading ${region.name} walks...`);
    await refreshVisibleWalks();
    closeStartupRegionGate();
    renderEverything();
    fitMapToWalks(true);
    toast(`Loaded ${region.name}`);
  }

  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------

  function renderEverything() {
    renderRegionLegend();
    renderRegionControls();
    renderRegionEditorList();
    renderWalkAssignmentList();
    renderMarkers();
    renderSelectedWalk();
    updateActiveRegionText();

    if ($("startupRegionGate") && !$("startupRegionGate").hidden) {
      renderStartupRegionGate();
    }

    notifyBridge("fieldops-atlas-ready", { walks: state.walks.length, regions: state.regions.length });
  }

  function renderMarkers() {
    if (!state.markerLayer) return;
    state.markerLayer.clearLayers();

    for (const walk of state.walks) {
      if (!Number.isFinite(walk.lat) || !Number.isFinite(walk.lng)) continue;

      const region = getRegion(walk.regionId);
      const marker = L.circleMarker([walk.lat, walk.lng], {
        radius: 9,
        color: "#ffffff",
        weight: 2,
        opacity: 0.95,
        fillColor: cssColor(region.color, DEFAULT_REGION.color),
        fillOpacity: 0.92,
      });

      marker.bindTooltip(walk.name, {
        direction: "top",
        offset: [0, -8],
        opacity: 0.9,
      });
      marker.bindPopup(walkPopup(walk));
      marker.on("click", () => selectWalk(walk.id, false));
      marker.addTo(state.markerLayer);
    }
  }

  function walkPopup(walk) {
    const region = getRegion(walk.regionId);
    return `
      <div class="walk-popover">
        <strong>${escapeHtml(walk.name)}</strong>
        <small class="walk-popup-region">${escapeHtml(region.name)}</small>
        <div class="walk-popover-actions">
          <button type="button" data-action="details" data-walk="${escapeAttr(walk.id)}">Details</button>
          <button type="button" data-action="edit" data-walk="${escapeAttr(walk.id)}">Edit</button>
        </div>
      </div>
    `;
  }

  function renderRegionLegend() {
    if (!elements.regionLegend) return;

    const visibleCount = state.walks.length;
    const title = state.selectedRegionIds.size ? "Visible walks" : "Pick a region";
    const countLabel = state.selectedRegionIds.size ? visibleCount : "-";

    elements.regionLegend.innerHTML = `
      <div class="legend-title">${title}</div>
      <div class="legend-count">${countLabel}</div>
      ${!state.selectedRegionIds.size ? '<p class="legend-empty">Choose one region first to keep the map light.</p>' : ""}
      <div class="legend-region-list">
        ${state.regions.map((region) => `
          <button type="button" data-region-filter="${escapeAttr(region.id)}" class="legend-region ${state.selectedRegionIds.has(region.id) ? "is-active" : ""}">
            <span style="background: ${escapeAttr(region.color)}"></span>
            ${escapeHtml(region.name)}
          </button>
        `).join("")}
      </div>
    `;
  }

  function renderRegionControls() {
    renderRegionSelect();
    renderRegionTree();
    renderRegionFilterList();
  }

  function renderRegionSelect() {
    if (!elements.walkRegionSelect) return;

    elements.walkRegionSelect.innerHTML = state.regions.map((region) => `
      <option value="${escapeAttr(region.id)}">${escapeHtml(region.name)}</option>
    `).join("");
  }

  function renderRegionTree() {
    const lists = [elements.topRegionTreeList, elements.regionFilterList].filter(Boolean);

    for (const list of lists) {
      list.innerHTML = state.regions.map((region) => regionCheckbox(region)).join("");
    }
  }

  function renderRegionFilterList() {
    if (!elements.regionFilterList) return;
    elements.regionFilterList.querySelectorAll("input[data-region-checkbox]").forEach((checkbox) => {
      checkbox.checked = state.selectedRegionIds.has(checkbox.value);
    });
  }

  function regionCheckbox(region) {
    return `
      <label class="region-check-row">
        <input type="checkbox" data-region-checkbox value="${escapeAttr(region.id)}" ${state.selectedRegionIds.has(region.id) ? "checked" : ""}>
        <span class="region-dot" style="background: ${escapeAttr(region.color)}"></span>
        <span>${escapeHtml(region.name)}</span>
      </label>
    `;
  }

  function renderRegionEditorList() {
    if (!elements.regionList) return;

    elements.regionList.innerHTML = state.regions.map((region) => `
      <button type="button" class="region-editor-row" data-edit-region="${escapeAttr(region.id)}">
        <span class="region-dot" style="background: ${escapeAttr(region.color)}"></span>
        <span>
          <strong>${escapeHtml(region.name)}</strong>
          <small>${escapeHtml(region.notes || "No notes")}</small>
        </span>
      </button>
    `).join("");
  }

  function renderWalkAssignmentList() {
    if (!elements.assignWalksList) return;

    const allWalks = mergeById(state.walks, state.localWalks).sort((a, b) => a.name.localeCompare(b.name));
    if (!allWalks.length) {
      elements.assignWalksList.innerHTML = '<p class="panel-empty">Load a region before assigning walks.</p>';
      return;
    }

    elements.assignWalksList.innerHTML = allWalks.map((walk) => `
      <label class="walk-check-row">
        <input type="checkbox" value="${escapeAttr(walk.id)}" ${state.editingRegionId && walk.regionId === state.editingRegionId ? "checked" : ""}>
        <span>${escapeHtml(walk.name)}</span>
        <small>${escapeHtml(getRegion(walk.regionId).name)}</small>
      </label>
    `).join("");
  }

  function renderSearchSuggestions() {
    if (!elements.walkSearch || !elements.searchSuggestions) return;

    const query = elements.walkSearch.value.trim().toLowerCase();
    if (!query) {
      hideSearchSuggestions();
      return;
    }

    const matches = state.walks
      .filter((walk) => `${walk.name} ${walk.regionId} ${walk.notes}`.toLowerCase().includes(query))
      .slice(0, 8);

    elements.searchSuggestions.hidden = false;
    elements.searchSuggestions.classList.add("is-open");
    elements.searchSuggestions.innerHTML = matches.length
      ? matches.map((walk) => `
        <button class="site-search-result" type="button" data-search-walk="${escapeAttr(walk.id)}">
          <span class="site-search-result-name">${escapeHtml(walk.name)}</span>
          <span class="site-search-result-meta">${escapeHtml(getRegion(walk.regionId).name)}</span>
        </button>
      `).join("")
      : '<div class="site-search-empty">No visible walk matches.</div>';
  }

  function hideSearchSuggestions() {
    if (!elements.searchSuggestions) return;
    elements.searchSuggestions.classList.remove("is-open");
    elements.searchSuggestions.hidden = true;
    elements.searchSuggestions.innerHTML = "";
  }

  function renderSelectedWalk() {
    const walk = getSelectedWalk();

    if (!walk) {
      setText(elements.selectedWalkName, "No walk selected");
      setText(elements.selectedWalkSubtitle, "-");
      setText(elements.selectedWalkGrid, "-");
      setText(elements.selectedWalkW3W, "-");
      setText(elements.selectedWalkServices, "No services loaded.");
      setText(elements.selectedWalkNotes, "-");
      setText(elements.selectedWalkPressureMemo, "Select a walk.");
      setText(elements.selectedWalkWindMemo, "Select a walk.");
      setText(elements.selectedWalkLightningMemo, "Select a walk.");
      setText(elements.selectedWalkPowerCompany, "Use Power panel to save a postcode/DNO check.");
      return;
    }

    const region = getRegion(walk.regionId);

    setText(elements.selectedWalkName, walk.name);
    setText(elements.selectedWalkSubtitle, `${region.name} / ${walk.siteType || "Walk"}`);
    setText(elements.selectedWalkGrid, walk.gridRef || coordText(walk));
    setText(elements.selectedWalkW3W, walk.what3words || "-");
    setText(elements.selectedWalkServices, walk.services.length ? walk.services.join(", ") : "No services loaded.");
    setText(elements.selectedWalkNotes, walk.notes || "-");
    setText(elements.selectedWalkPressureMemo, walk.weather?.forecast || "Forecast not loaded yet.");
    setText(elements.selectedWalkWindMemo, walk.weather?.wind || "Wind not loaded yet.");
    setText(elements.selectedWalkLightningMemo, walk.weather?.lightning || "Lightning not checked yet.");
    setText(elements.selectedWalkPowerCompany, walk.powerCompany || "Use Power panel to save a postcode/DNO check.");
  }

  function updateActiveRegionText() {
    if (!elements.topActiveRegionText) return;

    if (!state.selectedRegionIds.size) {
      elements.topActiveRegionText.textContent = "Pick region";
      return;
    }

    const names = [...state.selectedRegionIds].map((id) => getRegion(id).name);
    elements.topActiveRegionText.textContent = names.length === 1 ? names[0] : `${names.length} regions`;
  }

  // ---------------------------------------------------------------------------
  // Map actions
  // ---------------------------------------------------------------------------

  function fitMapToWalks(showToast) {
    if (!state.map) return;

    const points = state.walks
      .filter((walk) => Number.isFinite(walk.lat) && Number.isFinite(walk.lng))
      .map((walk) => [walk.lat, walk.lng]);

    if (!points.length) {
      state.map.setView(MAP_START.centre, MAP_START.zoom);
      if (showToast) toast("No visible walks to fit");
      return;
    }

    state.map.fitBounds(L.latLngBounds(points), {
      padding: [42, 42],
      maxZoom: 13,
    });

    if (showToast) toast(`Fitted ${points.length} visible walks`);
  }

  function selectWalk(walkId, expandPanel) {
    const walk = findWalk(walkId);
    if (!walk) return;

    state.selectedWalkId = walk.id;
    renderSelectedWalk();
    openInfoPanel(expandPanel);
    focusMapOnWalk(walk);

    notifyBridge("fieldops-atlas-walk-selected", { walk });
  }

  function focusMapOnWalk(walk) {
    if (!state.map || !Number.isFinite(walk.lat) || !Number.isFinite(walk.lng)) return;

    const target = [walk.lat, walk.lng];
    const currentZoom = Number.isFinite(state.map.getZoom?.()) ? state.map.getZoom() : MAP_START.zoom;
    const targetZoom = Math.max(currentZoom, 13);

    if (typeof state.map.flyTo === "function") {
      state.map.flyTo(target, targetZoom, {
        animate: true,
        duration: 0.45,
      });
      return;
    }

    state.map.setView(target, targetZoom, { animate: true });
  }

  function openInfoPanel(expandPanel = false) {
    if (!elements.infoPanel) return;

    const shouldExpand = Boolean(expandPanel);

    elements.infoPanel.classList.add("is-open");
    elements.infoPanel.classList.remove("is-hidden");
    elements.infoPanel.classList.toggle("collapsed", !shouldExpand);
    elements.infoPanel.setAttribute("aria-hidden", "false");

    syncInfoPanelControls();
  }

  function closeInfoPanel() {
    if (!elements.infoPanel) return;

    elements.infoPanel.classList.add("is-hidden");
    elements.infoPanel.classList.remove("is-open", "collapsed");
    elements.infoPanel.setAttribute("aria-hidden", "true");

    syncInfoPanelControls();
  }

  function expandInfoPanel() {
    if (!elements.infoPanel) return;

    elements.infoPanel.classList.remove("is-hidden", "collapsed");
    elements.infoPanel.classList.add("is-open");
    elements.infoPanel.setAttribute("aria-hidden", "false");

    syncInfoPanelControls();
  }

  function collapseInfoPanel() {
    if (!elements.infoPanel || elements.infoPanel.classList.contains("is-hidden")) return;

    elements.infoPanel.classList.add("is-open", "collapsed");
    elements.infoPanel.setAttribute("aria-hidden", "false");

    syncInfoPanelControls();
  }

  function toggleInfoPanelExpansion() {
    if (!elements.infoPanel || elements.infoPanel.classList.contains("is-hidden")) return;

    if (elements.infoPanel.classList.contains("collapsed")) {
      expandInfoPanel();
    } else {
      collapseInfoPanel();
    }
  }

  function syncInfoPanelControls() {
    if (!elements.infoPanel || !elements.expandInfoButton) return;

    const isHidden = elements.infoPanel.classList.contains("is-hidden");
    const isCollapsed = elements.infoPanel.classList.contains("collapsed");

    elements.expandInfoButton.disabled = isHidden;
    elements.expandInfoButton.textContent = isCollapsed ? "Expand" : "Minimise";
    elements.expandInfoButton.setAttribute("aria-expanded", String(!isCollapsed && !isHidden));
  }

  // ---------------------------------------------------------------------------
  // Walk and region editing
  // ---------------------------------------------------------------------------

  function openAddWalkPanel(walk = null) {
    state.editingWalkId = walk?.id || null;

    setText(elements.addPanelTitle, walk ? "Edit walk" : "Add walk");
    if (elements.walkNameInput) elements.walkNameInput.value = walk?.name || "";
    if (elements.walkCoordsInput) elements.walkCoordsInput.value = walk ? coordText(walk) : "";
    if (elements.walkRegionSelect) elements.walkRegionSelect.value = walk?.regionId || [...state.selectedRegionIds][0] || state.regions[0]?.id || DEFAULT_REGION.id;
    if (elements.walkNotesInput) elements.walkNotesInput.value = walk?.notes || "";
    if (elements.deleteEditingWalkButton) elements.deleteEditingWalkButton.hidden = !walk;

    openPanel(elements.addPanel);
  }

  async function saveWalkFromForm() {
    const name = elements.walkNameInput?.value.trim();
    const coords = parseCoords(elements.walkCoordsInput?.value || "");
    const regionId = elements.walkRegionSelect?.value || DEFAULT_REGION.id;
    const notes = elements.walkNotesInput?.value.trim() || "";

    if (!name) {
      toast("Walk name is required");
      return;
    }
    if (!coords) {
      toast("Use coordinates like 51.5007, -0.1246");
      return;
    }

    const existing = state.editingWalkId ? findBaseWalk(state.editingWalkId) || findWalk(state.editingWalkId) : null;
    const walk = normaliseWalk({
      ...(existing || {}),
      id: existing?.id || slugify(name),
      name,
      lat: coords.lat,
      lng: coords.lng,
      regionId,
      notes,
      updatedAt: new Date().toISOString(),
    });

    state.baseWalks = upsertById(state.baseWalks, walk);
    state.localWalks = upsertById(state.localWalks, walk);
    saveLocalArray(STORAGE_KEYS.walks, state.localWalks);

    await saveWalksOnlineIfEnabled();
    await refreshVisibleWalks();
    renderEverything();
    selectWalk(walk.id, true);
    closePanel(elements.addPanel);
    toast("Walk saved");
  }

  async function deleteEditingWalk() {
    if (!state.editingWalkId) return;

    const walkName = findBaseWalk(state.editingWalkId)?.name || findWalk(state.editingWalkId)?.name || "this walk";
    if (!confirm(`Delete ${walkName} from the local working copy?`)) return;

    state.baseWalks = state.baseWalks.filter((walk) => walk.id !== state.editingWalkId);
    state.localWalks = state.localWalks.filter((walk) => walk.id !== state.editingWalkId);
    saveLocalArray(STORAGE_KEYS.walks, state.localWalks);

    await saveWalksOnlineIfEnabled();
    state.selectedWalkId = null;
    await refreshVisibleWalks();
    renderEverything();
    closePanel(elements.addPanel);
    toast("Walk deleted");
  }

  function openRegionPanel(region = null) {
    state.editingRegionId = region?.id || null;

    if (elements.regionNameInput) elements.regionNameInput.value = region?.name || "";
    if (elements.regionColorInput) elements.regionColorInput.value = region?.color || "#38bdf8";
    if (elements.regionNotesInput) elements.regionNotesInput.value = region?.notes || "";
    if (elements.deleteRegionButton) elements.deleteRegionButton.hidden = !region || region.id === DEFAULT_REGION.id;

    renderWalkAssignmentList();
    openPanel(elements.regionPanel);
  }

  async function saveRegionFromForm() {
    const name = elements.regionNameInput?.value.trim();
    const color = cssColor(elements.regionColorInput?.value || "", "#38bdf8");
    const notes = elements.regionNotesInput?.value.trim() || "";

    if (!name) {
      toast("Region name is required");
      return;
    }

    const existing = state.editingRegionId ? getRegion(state.editingRegionId) : null;
    const region = normaliseRegion({
      id: existing?.id || slugify(name),
      name,
      color,
      notes,
    });

    state.localRegions = upsertById(state.localRegions, region);
    state.regions = ensureDefaultRegion(mergeById(state.regions, [region]));
    saveLocalArray(STORAGE_KEYS.regions, state.localRegions);

    await saveRegionsOnlineIfEnabled();
    renderEverything();
    closePanel(elements.regionPanel);
    toast("Region saved");
  }

  async function deleteEditingRegion() {
    if (!state.editingRegionId || state.editingRegionId === DEFAULT_REGION.id) return;

    const region = getRegion(state.editingRegionId);
    if (!confirm(`Delete region ${region.name}? Walks move to Unassigned locally.`)) return;

    state.localRegions = state.localRegions.filter((item) => item.id !== region.id);
    state.regions = ensureDefaultRegion(state.regions.filter((item) => item.id !== region.id));
    state.localWalks = state.localWalks.map((walk) => walk.regionId === region.id ? { ...walk, regionId: DEFAULT_REGION.id } : walk);
    state.baseWalks = state.baseWalks.map((walk) => walk.regionId === region.id ? { ...walk, regionId: DEFAULT_REGION.id } : walk);
    state.selectedRegionIds.delete(region.id);

    saveLocalArray(STORAGE_KEYS.regions, state.localRegions);
    saveLocalArray(STORAGE_KEYS.walks, state.localWalks);
    saveSelectedRegions();

    await saveRegionsOnlineIfEnabled();
    await refreshVisibleWalks();
    renderEverything();
    closePanel(elements.regionPanel);
    toast("Region deleted");
  }

  async function saveRegionAssignments() {
    if (!state.editingRegionId) {
      toast("Open a region first");
      return;
    }

    const selectedIds = [...elements.assignWalksList?.querySelectorAll("input:checked") || []].map((input) => input.value);
    const selectedSet = new Set(selectedIds);

    const remap = (walk) => selectedSet.has(walk.id) ? { ...walk, regionId: state.editingRegionId } : walk;
    state.localWalks = mergeById(state.localWalks, state.walks).map(remap);
    state.baseWalks = state.baseWalks.map(remap);
    saveLocalArray(STORAGE_KEYS.walks, state.localWalks);

    await saveWalksOnlineIfEnabled();
    await refreshVisibleWalks();
    renderEverything();
    toast("Walk assignments saved");
  }

  function toggleRegionSelection(regionId) {
    if (!regionId) return;

    if (state.selectedRegionIds.has(regionId)) {
      state.selectedRegionIds.delete(regionId);
    } else {
      state.selectedRegionIds.add(regionId);
    }

    saveSelectedRegions();
    refreshVisibleWalks().then(() => {
      renderEverything();
      fitMapToWalks(false);
    });
  }

  function readRegionCheckboxes() {
    const checkboxes = document.querySelectorAll("input[data-region-checkbox]");
    state.selectedRegionIds = new Set([...checkboxes].filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value));
    saveSelectedRegions();
  }

  // ---------------------------------------------------------------------------
  // GitHub write helpers
  // ---------------------------------------------------------------------------

  function saveGithubToken() {
    const token = elements.githubTokenInput?.value.trim() || "";
    if (token) localStorage.setItem(STORAGE_KEYS.githubToken, token);
    else localStorage.removeItem(STORAGE_KEYS.githubToken);
    toast(token ? "GitHub token saved locally" : "GitHub token cleared");
  }

  function setWorkOnline(isOnline) {
    localStorage.setItem(STORAGE_KEYS.workOnline, String(Boolean(isOnline)));
    syncWorkOnlineToggles(Boolean(isOnline));
    toast(isOnline ? "Work online enabled" : "Work online disabled");
  }

  function syncWorkOnlineToggles(isOnline) {
    if (elements.workOnlineToggle) elements.workOnlineToggle.checked = isOnline;
    if (elements.writeToggle) elements.writeToggle.checked = isOnline;
  }

  async function saveRegionsOnlineIfEnabled() {
    if (localStorage.getItem(STORAGE_KEYS.workOnline) !== "true") return;

    const token = localStorage.getItem(STORAGE_KEYS.githubToken) || "";
    if (!token) {
      toast("GitHub token required for online writes");
      return;
    }

    await writeJsonToGitHub({
      path: GITHUB_CONFIG.regionsPath,
      content: { regions: state.regions.filter((region) => region.id !== DEFAULT_REGION.id) },
      message: `Update FieldOps Atlas regions v${VERSION}`,
      token,
    });
  }

  async function saveWalksOnlineIfEnabled() {
    if (localStorage.getItem(STORAGE_KEYS.workOnline) === "true") {
      toast("Walk changes saved locally; region-loaded walk files are not auto-written yet");
    }
  }

  async function writeJsonToGitHub({ path, content, message, token }) {
    const apiUrl = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`;
    const current = await fetch(`${apiUrl}?ref=${GITHUB_CONFIG.branch}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!current.ok) throw new Error(`GitHub read failed for ${path}`);

    const currentJson = await current.json();
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        branch: GITHUB_CONFIG.branch,
        message,
        sha: currentJson.sha,
        content: toBase64(`${JSON.stringify(content, null, 2)}\n`),
      }),
    });

    if (!response.ok) throw new Error(`GitHub write failed for ${path}`);
    toast("GitHub region file updated");
  }

  // ---------------------------------------------------------------------------
  // Lookups and small utilities
  // ---------------------------------------------------------------------------

  function getSelectedWalk() {
    return findWalk(state.selectedWalkId);
  }

  function findWalk(id) {
    return state.walks.find((walk) => walk.id === id) || state.localWalks.find((walk) => walk.id === id) || null;
  }

  function findBaseWalk(id) {
    return state.baseWalks.find((walk) => walk.id === id) || null;
  }

  function getRegion(id) {
    return state.regions.find((region) => region.id === id) || DEFAULT_REGION;
  }

  function copySelectedValue(type) {
    const walk = getSelectedWalk();
    if (!walk) return;

    const value = type === "w3w" ? walk.what3words : (walk.gridRef || coordText(walk));
    copyText(value || "-");
  }

  function copyTextFromElement(id) {
    const value = $(id)?.textContent?.trim();
    if (value) copyText(value);
  }

  function copyText(value) {
    navigator.clipboard?.writeText(value).then(
      () => toast("Copied"),
      () => toast(value)
    );
  }

  function parseCoords(value) {
    const match = String(value).match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
    if (!match) return null;

    const lat = Number(match[1]);
    const lng = Number(match[2]);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

    return { lat, lng };
  }

  function coordText(walk) {
    return `${round(walk.lat, 5)}, ${round(walk.lng, 5)}`;
  }

  function numberFrom(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : NaN;
  }

  function round(value, decimals) {
    const multiplier = 10 ** decimals;
    return Math.round(Number(value) * multiplier) / multiplier;
  }

  function mergeById(primary, secondary) {
    const map = new Map();
    [...primary, ...secondary].filter(Boolean).forEach((item) => map.set(item.id, item));
    return [...map.values()];
  }

  function upsertById(items, item) {
    const exists = items.some((current) => current.id === item.id);
    return exists ? items.map((current) => current.id === item.id ? item : current) : [...items, item];
  }

  function slugify(value) {
    const slug = String(value)
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return slug || `item-${Date.now()}`;
  }

  function cssColor(value, fallback) {
    const color = String(value || "").trim();
    return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color) ? color : fallback;
  }

  function asStringList(value) {
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
    if (!value) return [];
    return String(value).split(",").map((item) => item.trim()).filter(Boolean);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#096;");
  }

  function setText(element, value) {
    if (element) element.textContent = value;
  }

  function toBase64(value) {
    const bytes = new TextEncoder().encode(value);
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  function toast(message) {
    if (!elements.statusToast) return;

    elements.statusToast.textContent = message;
    elements.statusToast.classList.add("is-open", "is-visible");
    clearTimeout(toast.timeout);
    toast.timeout = setTimeout(() => elements.statusToast.classList.remove("is-open", "is-visible"), 2300);
  }

  function showFatal(message) {
    console.error(message);
    if (elements.statusToast) {
      elements.statusToast.textContent = message;
      elements.statusToast.classList.add("is-open", "is-visible", "is-error");
    } else {
      alert(message);
    }
  }
})();

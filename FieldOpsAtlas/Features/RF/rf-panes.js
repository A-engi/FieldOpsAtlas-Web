/* ==========================================================================
   FieldOps Atlas RF panes
   File: FieldOpsAtlas/Features/RF/rf-panes.js
   Version: 1.1.36-no-details-mount

   Purpose:
   - Own RF path details pane markup.
   - Attach the path pane directly into .rf-map-paper.
   - Keep the pane out of normal layout flow.
   - Do not create an empty details mount or hidden placeholder.
   - Append the actual path details body directly into the pane after the map renders.
   ========================================================================== */

(() => {
  "use strict";

  const VERSION = "1.1.36-no-details-mount";
  const MAP_PAPER_SELECTOR = ".rf-map-paper";
  const MAP_STAGE_SELECTOR = ".rf-map-stage";
  const MAP_READY_EVENT = "fieldops:rf-network-map-rendered";
  const DETAILS_READY_CLASS = "is-path-details-ready";
  const DETAILS_FALLBACK_DELAY_MS = 1200;

  const PATH_TOGGLE_TEMPLATE = String.raw`
<input
  class="rf-path-toggle"
  id="rfPathPaneToggle"
  type="checkbox"
  checked
  aria-label="Toggle path details"
>
`;

  const PATH_PANE_SHELL_TEMPLATE = String.raw`
<aside class="rf-path-pane" aria-label="Selected RF path details" data-rf-path-pane>
  <label class="rf-path-handle" for="rfPathPaneToggle" aria-label="Collapse path details">
    <img
      class="rf-path-handle-icon"
      src="../../../data/icons/path-pane-chevron-gold.svg"
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
    >
  </label>
</aside>
`;

  const PATH_DETAILS_BODY_TEMPLATE = String.raw`
<div class="rf-path-pane-body">
  <header class="rf-path-pane-title">
    <img
      class="rf-path-title-wave"
      src="../../../data/icons/path-details-wave.svg"
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
    >
    <span>Path details</span>
  </header>

  <section class="rf-path-site is-from" aria-label="Source site">
    <span class="rf-path-mast" aria-hidden="true">
      <img
        src="../../../data/icons/atlas-transmitter-gold.svg"
        alt=""
        loading="lazy"
        decoding="async"
      >
    </span>
    <span class="rf-path-site-copy">
      <small>From</small>
      <b>North Ridge</b>
      <b>TX Site</b>
    </span>
  </section>

  <section class="rf-path-mid" aria-label="Selected RF path">
    <img
      class="rf-path-signal-vertical"
      src="../../../data/icons/path-signal-glow.svg"
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
    >

    <div class="rf-path-frequency">
      <strong>6.725 GHz</strong>
      <span>Horizontal</span>

      <dl class="rf-path-data">
        <div>
          <dt>Service</dt>
          <dd>DTT 1</dd>
        </div>
        <div>
          <dt>Band</dt>
          <dd>28 MHz</dd>
        </div>
        <div>
          <dt>Mode</dt>
          <dd>64QAM</dd>
        </div>
        <div>
          <dt>Power</dt>
          <dd>18 dBm</dd>
        </div>
        <div>
          <dt>Avail</dt>
          <dd>99.98%</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd><i aria-hidden="true"></i>Online</dd>
        </div>
      </dl>
    </div>
  </section>

  <section class="rf-path-site is-to" aria-label="Destination site">
    <span class="rf-path-mast" aria-hidden="true">
      <img
        src="../../../data/icons/atlas-transmitter-gold.svg"
        alt=""
        loading="lazy"
        decoding="async"
      >
    </span>
    <span class="rf-path-site-copy">
      <small>To</small>
      <b>Hilltop</b>
      <b>Relay Site</b>
    </span>
  </section>
</div>
`;

  function makeFragment(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.cloneNode(true);
  }

  function removeLegacyPaneMounts(root) {
    root
      .querySelectorAll("[data-rf-path-pane-mount]")
      .forEach((mount) => mount.remove());
  }

  function removeLegacyInlinePanes(mapPaper) {
    mapPaper
      .querySelectorAll(":scope > .rf-path-toggle, :scope > .rf-path-pane")
      .forEach((node) => node.remove());
  }

  function loadPathDetailsBody(mapPaper) {
    const pane = mapPaper.querySelector(".rf-path-pane");

    if (!pane || pane.dataset.rfDetailsLoaded === "true") {
      return;
    }

    const fragment = makeFragment(PATH_DETAILS_BODY_TEMPLATE);
    const body = fragment.querySelector(".rf-path-pane-body");

    if (!body) {
      return;
    }

    body.dataset.rfDetailsLoaded = "true";
    pane.appendChild(body);
    pane.dataset.rfDetailsLoaded = "true";
    mapPaper.classList.add(DETAILS_READY_CLASS);

    mapPaper.dispatchEvent(new CustomEvent("fieldops:rf-path-details-ready", {
      bubbles: true,
      detail: {
        version: VERSION,
        pane: "path-details"
      }
    }));
  }

  function bindDetailsLoad(mapPaper) {
    const mapStage = mapPaper.querySelector(MAP_STAGE_SELECTOR);

    if (mapStage?.dataset.rfNetworkMapLoaded === "true") {
      window.requestAnimationFrame(() => loadPathDetailsBody(mapPaper));
      return;
    }

    mapPaper.addEventListener(MAP_READY_EVENT, () => {
      window.requestAnimationFrame(() => loadPathDetailsBody(mapPaper));
    }, { once: true });

    window.setTimeout(() => loadPathDetailsBody(mapPaper), DETAILS_FALLBACK_DELAY_MS);
  }

  function attachPathPane(mapPaper) {
    if (!mapPaper || mapPaper.dataset.rfPaneInit === "true") {
      return;
    }

    const mapStage = mapPaper.querySelector(MAP_STAGE_SELECTOR);

    if (!mapStage) {
      return;
    }

    removeLegacyInlinePanes(mapPaper);

    const toggleFragment = makeFragment(PATH_TOGGLE_TEMPLATE);
    const paneFragment = makeFragment(PATH_PANE_SHELL_TEMPLATE);
    const toggle = toggleFragment.querySelector(".rf-path-toggle");
    const pane = paneFragment.querySelector(".rf-path-pane");

    if (!toggle || !pane) {
      return;
    }

    mapPaper.insertBefore(toggle, mapStage);
    mapStage.insertAdjacentElement("afterend", pane);
    mapPaper.dataset.rfPaneInit = "true";

    mapPaper.dispatchEvent(new CustomEvent("fieldops:rf-pane-shell-ready", {
      bubbles: true,
      detail: {
        version: VERSION,
        pane: "path-details"
      }
    }));

    bindDetailsLoad(mapPaper);
  }

  function initAll(root = document) {
    removeLegacyPaneMounts(root);

    root
      .querySelectorAll(MAP_PAPER_SELECTOR)
      .forEach(attachPathPane);
  }

  window.FieldOpsRFPanes = {
    VERSION,
    initAll,
    loadPathDetailsBody
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initAll(), { once: true });
  } else {
    initAll();
  }
})();

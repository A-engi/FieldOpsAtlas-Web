/* ==========================================================================
   FieldOps Atlas RF panes
   File: FieldOpsAtlas/Features/RF/rf-panes.js
   Version: 1.1.28-pane-attaches-to-map-paper

   Purpose:
   - Own RF pane markup that should not live in index.html.
   - Attach the path details pane directly inside .rf-map-paper.
   - Keep the pane out of normal layout flow so it never pushes the map down.
   - Leave pane styling and open/close behaviour in rf-pane.css.
   ========================================================================== */

(() => {
  "use strict";

  const VERSION = "1.1.28-pane-attaches-to-map-paper";

  const PATH_DETAILS_TEMPLATE = String.raw`
<input
                class="rf-path-toggle"
                id="rfPathPaneToggle"
                type="checkbox"
                checked
                aria-label="Toggle path details"
              >

<aside class="rf-path-pane" aria-label="Selected RF path details">
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
              </aside>
`;

  function createPathPaneFragment() {
    const template = document.createElement("template");
    template.innerHTML = PATH_DETAILS_TEMPLATE.trim();
    return template.content.cloneNode(true);
  }

  function removePlaceholderMounts(root) {
    root
      .querySelectorAll("[data-rf-path-pane-mount]")
      .forEach((mount) => mount.remove());
  }

  function initPathPane(mapPaper) {
    if (!mapPaper || mapPaper.dataset.rfPaneInit === "true") {
      return;
    }

    const mapStage = mapPaper.querySelector(".rf-map-stage");
    if (!mapStage) {
      return;
    }

    mapPaper.dataset.rfPaneInit = "true";

    const fragment = createPathPaneFragment();
    const toggle = fragment.querySelector(".rf-path-toggle");
    const pane = fragment.querySelector(".rf-path-pane");

    if (!toggle || !pane) {
      return;
    }

    mapPaper.insertBefore(toggle, mapStage);
    mapStage.insertAdjacentElement("afterend", pane);

    mapPaper.dispatchEvent(new CustomEvent("fieldops:rf-pane-ready", {
      bubbles: true,
      detail: {
        version: VERSION,
        pane: "path-details"
      }
    }));
  }

  function initAll(root = document) {
    removePlaceholderMounts(root);

    root
      .querySelectorAll(".rf-map-paper")
      .forEach(initPathPane);
  }

  window.FieldOpsRFPanes = {
    VERSION,
    initAll
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initAll(), { once: true });
  } else {
    initAll();
  }
})();

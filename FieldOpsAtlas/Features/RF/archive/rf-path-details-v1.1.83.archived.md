Archived RF path details pane renderer

Archived from the active RF page during the Snipsnip clean-up.

Source page version before removal: RF v1.1.83
Archived source file: `FieldOpsAtlas/Features/RF/rf-path-builder.js` v1.1.79-path-title-icon-fit

Reason: the previous visible Path details pane, handle, and slide/collapse shell were drifting off the RF page. That view layer has been removed from the active page so the RF map can be tidied and a cleaner visible section can be rebuilt later.

Important: the active `rf-path-builder.js` should **not** be deleted or reduced to a no-op. It remains as a data-only path model builder/fetcher and creates no DOM. This archive is only for the old pane-rendering markup.

```js
/* ==========================================================================
   FieldOps Atlas RF path builder
   File: FieldOpsAtlas/Features/RF/rf-path-builder.js
   Version: 1.1.79-path-title-icon-fit

   Purpose:
   - Build the selected RF path model from topology, site, service, and path data.
   - Currently renders the demo selected-path values until topology/site/service data is wired.
   - Keep pane shell, controls, and styling in rf-interface.js / rf-interface.css.
   - Render the built path model into the existing RF interface pane.
   - Do not create an empty mount or placeholder.
   - Remove duplicate path-builder bodies before rendering.
   ========================================================================== */

(() => {
  "use strict";

  const VERSION = "1.1.79-path-title-icon-fit";
  const MAP_PAPER_SELECTOR = ".rf-map-paper";
  const PANE_SELECTOR = ".rf-path-pane";
  const PANE_READY_EVENT = "fieldops:rf-pane-shell-ready";
  const PATH_BUILDER_READY_CLASS = "is-path-builder-ready";

  const PATH_BUILDER_BODY_TEMPLATE = String.raw`
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

  function getMapPaper(root = document) {
    return root.querySelector(MAP_PAPER_SELECTOR);
  }

  function getPane(root = document) {
    const mapPaper = getMapPaper(root);
    return mapPaper ? mapPaper.querySelector(PANE_SELECTOR) : null;
  }

  function removeLegacyPathBuilderMounts(root = document) {
    root
      .querySelectorAll("[data-rf-path-builder-mount], [data-rf-path-builder-body]")
      .forEach((node) => node.remove());
  }

  function removeExistingBodies(pane) {
    if (!pane) {
      return;
    }

    pane
      .querySelectorAll(":scope > .rf-path-pane-body")
      .forEach((body) => body.remove());
  }

  function renderPathBuilder(root = document) {
    const mapPaper = getMapPaper(root);
    const pane = getPane(root);

    if (!mapPaper || !pane) {
      return false;
    }

    removeLegacyPathBuilderMounts(mapPaper);
    removeExistingBodies(pane);

    const fragment = makeFragment(PATH_BUILDER_BODY_TEMPLATE);
    const body = fragment.querySelector(".rf-path-pane-body");

    if (!body) {
      return false;
    }

    body.dataset.rfPathBuilderLoaded = "true";
    body.dataset.rfPathBuilderVersion = VERSION;

    pane.appendChild(body);
    pane.dataset.rfPathBuilderLoaded = "true";
    pane.dataset.rfPathBuilderVersion = VERSION;
    mapPaper.classList.add(PATH_BUILDER_READY_CLASS);

    mapPaper.dispatchEvent(new CustomEvent("fieldops:rf-path-builder-ready", {
      bubbles: true,
      detail: {
        version: VERSION,
        pane: "path-builder"
      }
    }));

    return true;
  }

  function init() {
    removeLegacyPathBuilderMounts();

    if (renderPathBuilder()) {
      return;
    }

    document.addEventListener(PANE_READY_EVENT, () => {
      renderPathBuilder();
    }, { once: true });
  }

  window.FieldOpsRFPathBuilder = {
    VERSION,
    renderPathBuilder
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
```

<!-- End of FieldOpsAtlas/Features/RF/archive/rf-path-details-v1.1.83.archived.md | bottom/end of file -->

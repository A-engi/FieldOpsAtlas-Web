/* ==========================================================================
   FieldOps Atlas - shared Weather shell navigation
   ========================================================================== */

(() => {
  "use strict";

  const READY_EVENT = "fieldops:weather-shell-resize";
  const OLD_NAV_SELECTORS = [
    ".weather-top-strip",
    ".outage-nav-panel",
    ".sp-outage-nav-panel"
  ];

  document.addEventListener("DOMContentLoaded", initWeatherShell);

  function initWeatherShell() {
    const root = document.querySelector(".weather-shell[data-weather-provider]");
    const stage = root?.querySelector(".weather-stage");
    const pages = Array.isArray(window.FieldOpsWeatherPages)
      ? window.FieldOpsWeatherPages
      : [];

    if (!root || !stage || !pages.length) return;

    OLD_NAV_SELECTORS.forEach((selector) => {
      stage.querySelectorAll(selector).forEach((node) => node.remove());
    });

    const activeId = activePageId(root, pages);
    const nav = document.createElement("details");
    nav.className = "weather-nav-panel";
    nav.open = true;
    nav.innerHTML = [
      '<summary class="weather-nav-summary">',
      '<span class="weather-nav-title">Weather</span>',
      `<span class="weather-nav-active">${escapeHtml(labelFor(pages, activeId))}</span>`,
      '<span class="weather-nav-state" aria-hidden="true">Show</span>',
      "</summary>",
      '<nav class="weather-nav-links" aria-label="Weather pages">',
      pages.map((page) => navLink(page, activeId)).join(""),
      "</nav>"
    ].join("");

    stage.insertBefore(nav, stage.firstElementChild?.nextSibling || stage.firstChild);
    nav.addEventListener("toggle", scheduleResize);
    window.addEventListener(READY_EVENT, scheduleResize);

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        rememberMapView();
      });
    });

    scheduleResize();
  }

  function activePageId(root, pages) {
    const provider = root.getAttribute("data-weather-provider");
    if (pages.some((page) => page.id === provider)) return provider;

    const file = location.pathname.split("/").pop() || "index.html";
    const match = pages.find((page) =>
      page.href === file || (page.aliases || []).includes(file)
    );
    return match?.id || pages[0].id;
  }

  function labelFor(pages, id) {
    return pages.find((page) => page.id === id)?.label || "Weather";
  }

  function navLink(page, activeId) {
    const active = page.id === activeId;
    return [
      `<a class="weather-provider-link${active ? " is-active" : ""}" href="${escapeAttribute(page.href)}"`,
      active ? ' aria-current="page"' : "",
      `>${escapeHtml(page.label)}</a>`
    ].join("");
  }

  function scheduleResize() {
    window.setTimeout(() => {
      rememberMapView();
      window.dispatchEvent(new Event("resize"));
      document.querySelectorAll(".leaflet-container").forEach((container) => {
        const id = container.id;
        if (!id || !window.L) return;
      });
      window.AtlasWeatherLab?.invalidateActiveMap?.();
      window.FieldOpsWeatherMap?.invalidate?.();
    }, 140);
  }

  function rememberMapView() {
    window.AtlasWeatherLab?.rememberCurrentMapView?.();
    window.FieldOpsWeatherMap?.remember?.();
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (match) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[match]);
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, "&#96;");
  }
})();

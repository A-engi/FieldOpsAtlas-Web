/* RainViewer API frame tester v0.3.0
   No OSM/Leaflet map. No recolour filter. All frame display choices come from weather-display-style.js.
*/

(() => {
  "use strict";

  const Lab = window.AtlasWeatherLab;
  const Style = window.FIELDOPS_WEATHER_DISPLAY_STYLE;
  const RAINVIEWER_API = "https://api.rainviewer.com/public/weather-maps.json";
  const rainStyle = Style?.rainViewer || {};

  const state = {
    host: "",
    frames: []
  };

  const els = {
    statusText: document.getElementById("statusText"),
    loadRadarButton: document.getElementById("loadRadarButton"),
    radarFrameRange: document.getElementById("radarFrameRange"),
    radarTimeLabel: document.getElementById("radarTimeLabel"),
    radarFrameCount: document.getElementById("radarFrameCount"),
    tileTemplate: document.getElementById("tileTemplate"),
    frameList: document.getElementById("frameList")
  };

  bindEvents();
  loadFrames({ manual: false });

  function bindEvents() {
    els.loadRadarButton?.addEventListener("click", () => loadFrames({ manual: true }));
    els.radarFrameRange?.addEventListener("input", () => showFrame(Number(els.radarFrameRange.value || 0)));
  }

  async function loadFrames({ manual } = { manual: false }) {
    if (els.loadRadarButton) {
      els.loadRadarButton.disabled = true;
      els.loadRadarButton.textContent = manual ? "Reloading frames..." : "Loading frames...";
    }

    try {
      setStatus("Loading RainViewer frame list...");
      const response = await fetch(RAINVIEWER_API, { cache: "no-store" });
      if (!response.ok) throw new Error(`RainViewer HTTP ${response.status}`);
      const data = await response.json();
      const frames = data?.radar?.past || [];
      if (!frames.length) throw new Error("No observed radar frames returned.");

      state.host = String(data.host || "");
      state.frames = frames.map((frame, index) => ({
        index,
        time: Number(frame.time),
        path: String(frame.path || "")
      }));

      if (els.radarFrameRange) {
        els.radarFrameRange.disabled = false;
        els.radarFrameRange.min = "0";
        els.radarFrameRange.max = String(Math.max(0, state.frames.length - 1));
        els.radarFrameRange.value = String(Math.max(0, state.frames.length - 1));
      }

      renderFrameList();
      showFrame(Math.max(0, state.frames.length - 1));
      setStatus(`${state.frames.length} observed RainViewer frames loaded. All frames are available; no hourly grouping is applied.`);
    } catch (error) {
      setStatus(error?.message || "RainViewer frame load failed.");
      state.frames = [];
      renderFrameList();
      showFrame(0);
    } finally {
      if (els.loadRadarButton) {
        els.loadRadarButton.disabled = false;
        els.loadRadarButton.textContent = "Reload RainViewer frames";
      }
    }
  }

  function showFrame(index) {
    const frame = state.frames[index];
    if (!frame) {
      if (els.radarFrameCount) els.radarFrameCount.textContent = "0 frames";
      if (els.radarTimeLabel) els.radarTimeLabel.textContent = "Not loaded";
      if (els.tileTemplate) els.tileTemplate.textContent = "No frame selected.";
      return;
    }

    const scheme = Number.isFinite(Number(rainStyle.freeColourScheme)) ? Number(rainStyle.freeColourScheme) : 2;
    const opacity = Number.isFinite(Number(rainStyle.defaultOpacity)) ? Number(rainStyle.defaultOpacity) : 0.95;
    const template = `${state.host}${frame.path}/256/{z}/{x}/{y}/${scheme}/1_1.png`;

    if (els.radarFrameCount) els.radarFrameCount.textContent = `${index + 1}/${state.frames.length} frames`;
    if (els.radarTimeLabel) els.radarTimeLabel.textContent = Lab.formatDateTime(frame.time);
    if (els.tileTemplate) {
      els.tileTemplate.textContent = [
        `time: ${Lab.formatDateTime(frame.time)}`,
        `epoch: ${frame.time}`,
        `nativeColourScheme: ${scheme}`,
        `opacity: ${opacity}`,
        `tileTemplate: ${template}`
      ].join("\n");
    }

    markSelectedFrame(index);
  }

  function renderFrameList() {
    if (!els.frameList) return;
    if (!state.frames.length) {
      els.frameList.innerHTML = `<p class="status-text">No frames loaded.</p>`;
      return;
    }

    els.frameList.innerHTML = state.frames.map((frame, index) => `
      <button class="list-row frame-row" type="button" data-frame-index="${index}">
        <span>${index + 1}. ${Lab.escapeHtml(Lab.formatDateTime(frame.time))}</span>
        <code>${Lab.escapeHtml(String(frame.time))}</code>
      </button>
    `).join("");

    els.frameList.querySelectorAll("[data-frame-index]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.frameIndex || 0);
        if (els.radarFrameRange) els.radarFrameRange.value = String(index);
        showFrame(index);
      });
    });
  }

  function markSelectedFrame(index) {
    els.frameList?.querySelectorAll("[data-frame-index]").forEach((button) => {
      button.classList.toggle("active", Number(button.dataset.frameIndex || 0) === index);
    });
  }

  function setStatus(message) {
    if (els.statusText) els.statusText.textContent = message;
  }
})();

/* End of file: FieldOpsAtlas/Features/Weather/rainviewer.js */

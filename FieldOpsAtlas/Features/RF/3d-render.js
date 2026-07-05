 /* FieldOps Atlas — 3D mountain loader
   mountain: A or B
   quality: compressed or full
*/
(() => {
  "use strict";

  const script = document.currentScript;
  const root = document.querySelector("[data-rf-graph]");
  const params = new URLSearchParams(location.search);

  const requestedMountain = String(
    root?.dataset.mountain ||
    script?.dataset.mountain ||
    params.get("mountain") ||
    "A"
  ).toUpperCase();

  const mountain = requestedMountain === "B" || requestedMountain === "2"
    ? "B"
    : "A";

  const requestedQuality = String(
    root?.dataset.mountainQuality ||
    script?.dataset.quality ||
    params.get("quality") ||
    "compressed"
  ).toLowerCase();

  const quality = ["full", "uncompressed", "lossless", "3mb"].includes(requestedQuality)
    ? "full"
    : "compressed";

  const files = {
    A: {
      compressed: "mountain-a-compressed.js",
      full: "mountain-a-full.js"
    },
    B: {
      compressed: "mountain-b-compressed.js",
      full: "mountain-b-full.js"
    }
  };

  const file = files[mountain][quality];

  if (document.querySelector(`script[data-fieldops-mountain-file="${file}"]`)) {
    return;
  }

  const model = document.createElement("script");
  model.src = new URL(file, script?.src || location.href).href;
  model.defer = true;
  model.dataset.fieldopsMountainFile = file;

  model.addEventListener("load", () => {
    document.dispatchEvent(new CustomEvent("fieldopsmountainloaded", {
      detail: { mountain, quality, file }
    }));
  }, { once: true });

  model.addEventListener("error", () => {
    document.dispatchEvent(new CustomEvent("fieldopsmountainerror", {
      detail: { mountain, quality, file }
    }));
  }, { once: true });

  document.head.appendChild(model);
})();

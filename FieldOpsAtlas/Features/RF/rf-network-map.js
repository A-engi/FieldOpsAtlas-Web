/* ==========================================================================
   FieldOps Atlas RF network map renderer
   File: FieldOpsAtlas/Features/RF/rf-network-map.js
   Version: 1.1.42-key-under-map-node-size-clean

   Purpose:
   - Render only the foreground RF network SVG.
   - Keep RF backgrounds and static compass decoration out of the dynamic SVG.
   - Keep a stable viewBox so page resizing does not flatten paths or circles.
   - Reflow when the RF path pane changes the map holder size.
   - Match the SVG viewBox to the holder aspect ratio so the map fills vertically without flattening.
   - Apply clearer top/left map insets and explicit node radius rules.
   - Own the static RF map key so no extra key script is needed.
   - Place the key in the reserved strip below the graph, not over graph content.
   - Draw node circles from one radius rule only.
   - Fit graph coordinates into a taller map area, reserving bottom-left room for the standalone key.
   - Accept future graph input with normalized node coordinates.
   ========================================================================== */

(() => {
  "use strict";

  const VERSION = "1.1.42-key-under-map-node-size-clean";
  const SVG_NS = ["http:", "", "www.w3.org", "2000", "svg"].join("/");
  const GRAPH_URL = "../../../data/rf-network-map.json";

  const BASE_VIEWBOX = {
    width: 1000,
    height: 650,
    safeEdge: 28
  };

  const MAP_CONTENT_INSET = {
    left: 112,
    right: 94,
    top: 88,
    bottom: 176
  };

  const NODE_RADIUS = {
    default: 11,
    relay: 12,
    large: 14
  };

  const NODE_HALO_RADIUS = {
    default: 17,
    relay: 18,
    large: 21
  };

  const MAP_KEY_TEMPLATE = String.raw`
<aside class="rf-map-key" aria-label="RF map key" data-rf-map-key>
  <div class="rf-map-key-title">Key</div>
  <ul class="rf-map-key-list">
    <li>
      <span class="rf-map-key-swatch is-core" aria-hidden="true"></span>
      <span>Core site</span>
    </li>
    <li>
      <span class="rf-map-key-swatch is-relay" aria-hidden="true"></span>
      <span>Relay site</span>
    </li>
    <li>
      <span class="rf-map-key-line is-selected" aria-hidden="true"></span>
      <span>Selected path</span>
    </li>
    <li>
      <span class="rf-map-key-line is-standby" aria-hidden="true"></span>
      <span>Standby path</span>
    </li>
  </ul>
</aside>
`;


  const FALLBACK_GRAPH = {
    selectedPathId: "london-hilltop",
    nodes: [
      {
        id: "glasgow",
        name: "Glasgow",
        type: "core",
        x: 0.12,
        y: 0.13,
        label: { dx: 38, dy: -16, anchor: "start" },
        labelTight: { dx: 34, dy: -18, anchor: "start" }
      },
      {
        id: "edinburgh",
        name: "Edinburgh",
        type: "core",
        x: 0.66,
        y: 0.13,
        label: { dx: 38, dy: -16, anchor: "start" },
        labelTight: { dx: 34, dy: -18, anchor: "start" }
      },
      {
        id: "manchester",
        name: "Manchester",
        type: "main",
        x: 0.34,
        y: 0.37,
        label: { dx: 36, dy: -6, anchor: "start" },
        labelTight: { dx: 33, dy: -8, anchor: "start" }
      },
      {
        id: "birmingham",
        name: "Birmingham",
        type: "main",
        x: 0.39,
        y: 0.58,
        label: { dx: 36, dy: 4, anchor: "start" },
        labelTight: { dx: -34, dy: 31, anchor: "end" }
      },
      {
        id: "london",
        name: "London",
        type: "core",
        size: "large",
        x: 0.52,
        y: 0.86,
        label: { dx: 0, dy: 54, anchor: "middle" },
        labelTight: { dx: 0, dy: 50, anchor: "middle" }
      },
      {
        id: "hilltop",
        name: "Hilltop",
        type: "relay",
        x: 0.75,
        y: 0.39,
        label: { dx: 38, dy: -13, anchor: "start" },
        labelTight: { dx: 35, dy: -15, anchor: "start" }
      },
      {
        id: "ridgeway",
        name: "Ridgeway",
        type: "relay",
        x: 0.88,
        y: 0.61,
        label: { dx: -38, dy: 2, anchor: "end" },
        labelTight: { dx: -35, dy: -4, anchor: "end" }
      },
      {
        id: "valley",
        name: "Valley",
        type: "remote",
        x: 0.14,
        y: 0.75,
        label: { dx: 38, dy: 28, anchor: "start" },
        labelTight: { dx: 35, dy: 25, anchor: "start" }
      },
      {
        id: "pinewood",
        name: "Pinewood",
        type: "remote",
        x: 0.88,
        y: 0.86,
        label: { dx: -38, dy: 36, anchor: "end" },
        labelTight: { dx: -35, dy: 31, anchor: "end" }
      }
    ],
    links: [
      { id: "glasgow-manchester", from: "glasgow", to: "manchester", type: "main" },
      { id: "edinburgh-manchester", from: "edinburgh", to: "manchester", type: "main" },
      { id: "manchester-birmingham", from: "manchester", to: "birmingham", type: "main" },
      { id: "birmingham-london", from: "birmingham", to: "london", type: "main" },
      { id: "london-valley", from: "london", to: "valley", type: "backup" },
      { id: "london-pinewood", from: "london", to: "pinewood", type: "backup" },
      { id: "london-hilltop", from: "london", to: "hilltop", type: "alert" },
      { id: "hilltop-ridgeway", from: "hilltop", to: "ridgeway", type: "backup" },
      { id: "ridgeway-pinewood", from: "ridgeway", to: "pinewood", type: "backup" }
    ]
  };

  function isUsableGraph(data) {
    return Boolean(
      data &&
      Array.isArray(data.nodes) &&
      data.nodes.length > 0 &&
      Array.isArray(data.links)
    );
  }

  async function getGraphData() {
    if (isUsableGraph(window.ATLAS_PRIVATE_GRAPH)) {
      return window.ATLAS_PRIVATE_GRAPH;
    }

    if (isUsableGraph(window.ATLAS_NETWORK_GRAPH)) {
      return window.ATLAS_NETWORK_GRAPH;
    }

    try {
      const response = await fetch(GRAPH_URL, { cache: "no-store" });
      if (response.ok) {
        const json = await response.json();
        if (isUsableGraph(json)) {
          return json;
        }
      }
    } catch {
      // Local previews and offline field checks should still render the demo graph.
    }

    return FALLBACK_GRAPH;
  }

  function svg(tagName, attributes = {}, children = []) {
    const element = document.createElementNS(SVG_NS, tagName);

    Object.entries(attributes).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        element.setAttribute(key, String(value));
      }
    });

    children.forEach((child) => element.append(child));
    return element;
  }

  function text(value) {
    return document.createTextNode(value);
  }

  function typeLabel(type) {
    return {
      core: "CORE",
      main: "MAIN",
      relay: "RELAY",
      remote: "REMOTE"
    }[type] || String(type || "SITE").toUpperCase();
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function makeFragment(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.cloneNode(true);
  }

  function getViewBoxForMount(mount) {
    const rect = mount.getBoundingClientRect();
    const width = BASE_VIEWBOX.width;
    const measuredWidth = rect.width || width;
    const measuredHeight = rect.height || BASE_VIEWBOX.height;
    const aspect = measuredWidth > 0 && measuredHeight > 0
      ? measuredWidth / measuredHeight
      : BASE_VIEWBOX.width / BASE_VIEWBOX.height;

    const height = clamp(Math.round(width / aspect), 620, 1800);

    return {
      width,
      height,
      safeEdge: BASE_VIEWBOX.safeEdge
    };
  }

  function projectNode(node, viewBox) {
    const sourceX = Number.isFinite(Number(node.x)) ? Number(node.x) : 0.5;
    const sourceY = Number.isFinite(Number(node.y)) ? Number(node.y) : 0.5;

    const x = sourceX >= 0 && sourceX <= 1
      ? sourceX * viewBox.width
      : sourceX;

    const y = sourceY >= 0 && sourceY <= 1
      ? sourceY * viewBox.height
      : sourceY;

    return {
      ...node,
      x: clamp(x, viewBox.safeEdge, viewBox.width - viewBox.safeEdge),
      y: clamp(y, viewBox.safeEdge, viewBox.height - viewBox.safeEdge)
    };
  }

  function fitNodesToMapArea(nodes, viewBox) {
    if (!nodes.length) {
      return nodes;
    }

    const minX = Math.min(...nodes.map((node) => node.x));
    const maxX = Math.max(...nodes.map((node) => node.x));
    const minY = Math.min(...nodes.map((node) => node.y));
    const maxY = Math.max(...nodes.map((node) => node.y));

    const sourceWidth = Math.max(1, maxX - minX);
    const sourceHeight = Math.max(1, maxY - minY);
    const targetLeft = MAP_CONTENT_INSET.left;
    const targetRight = viewBox.width - MAP_CONTENT_INSET.right;
    const targetTop = MAP_CONTENT_INSET.top;
    const targetBottom = viewBox.height - MAP_CONTENT_INSET.bottom;
    const targetWidth = Math.max(1, targetRight - targetLeft);
    const targetHeight = Math.max(1, targetBottom - targetTop);

    return nodes.map((node) => ({
      ...node,
      x: clamp(
        targetLeft + ((node.x - minX) / sourceWidth) * targetWidth,
        viewBox.safeEdge,
        viewBox.width - viewBox.safeEdge
      ),
      y: clamp(
        targetTop + ((node.y - minY) / sourceHeight) * targetHeight,
        viewBox.safeEdge,
        viewBox.height - viewBox.safeEdge
      )
    }));
  }

  function markerRadius(node) {
    if (node.size === "large") {
      return NODE_RADIUS.large;
    }

    if (node.type === "relay") {
      return NODE_RADIUS.relay;
    }

    return NODE_RADIUS.default;
  }

  function markerHaloRadius(node) {
    if (node.size === "large") {
      return NODE_HALO_RADIUS.large;
    }

    if (node.type === "relay") {
      return NODE_HALO_RADIUS.relay;
    }

    return NODE_HALO_RADIUS.default;
  }

  function linkGeometry(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const curve = clamp(dx * 0.12, -78, 78);
    const bow = clamp(dy * 0.08, -36, 36);

    return {
      x1: from.x,
      y1: from.y,
      c1x: from.x + curve,
      c1y: from.y + bow,
      c2x: to.x - curve,
      c2y: to.y - bow,
      x2: to.x,
      y2: to.y
    };
  }

  function geometryPath(geometry) {
    return [
      `M${geometry.x1} ${geometry.y1}`,
      `C${geometry.c1x} ${geometry.c1y},`,
      `${geometry.c2x} ${geometry.c2y},`,
      `${geometry.x2} ${geometry.y2}`
    ].join(" ");
  }

  function cubicPoint(geometry, t) {
    const inv = 1 - t;
    const x =
      inv ** 3 * geometry.x1 +
      3 * inv ** 2 * t * geometry.c1x +
      3 * inv * t ** 2 * geometry.c2x +
      t ** 3 * geometry.x2;

    const y =
      inv ** 3 * geometry.y1 +
      3 * inv ** 2 * t * geometry.c1y +
      3 * inv * t ** 2 * geometry.c2y +
      t ** 3 * geometry.y2;

    return { x, y };
  }

  function findSelectedLink(graph) {
    if (!graph.links.length) {
      return null;
    }

    return (
      graph.links.find((link) => link.id === graph.selectedPathId) ||
      graph.links.find((link) => `${link.from}-${link.to}` === graph.selectedPathId) ||
      graph.links.find((link) => link.type === "alert") ||
      graph.links[0]
    );
  }

  function makeMast(x, y, scale = 1) {
    return svg("g", { class: "mast", transform: `translate(${x} ${y}) scale(${scale})` }, [
      svg("path", { d: "M0 -10v22M-7 12L0-10l7 22M-6 3H6M-4-4H4" }),
      svg("circle", { cx: 0, cy: -12, r: 2.2, fill: "currentColor", stroke: "none" }),
      svg("path", { d: "M-6-14C-12-8-12 0-6 6M6-14C12-8 12 0 6 6" }),
      svg("path", { d: "M-11-19C-21-9-21 5-11 15M11-19C21-9 21 5 11 15", opacity: 0.82 })
    ]);
  }

  function makeSelectedHalo(radius) {
    const scale = clamp((radius + 22) / 54, 0.72, 0.90);

    return svg("g", { class: "demo-original-halo", transform: `scale(${scale})` }, [
      svg("circle", { class: "relay-halo-ring", r: 51 }),
      svg("circle", { class: "relay-halo-ring", r: 61 }),
      svg("circle", { class: "relay-halo-ring is-outer", r: 72 }),
      svg("path", {
        class: "relay-halo-line",
        d: "M42.3 7.5L72.9 12.8 M40.4 14.7L69.5 25.3 M32.9 27.6L56.7 47.6 M27.6 32.9L47.6 56.7 M14.7 40.4L25.3 69.5 M7.5 42.3L12.8 72.9 M-7.5 42.3L-12.8 72.9 M-14.7 40.4L-25.3 69.5 M-27.6 32.9L-47.6 56.7 M-32.9 27.6L-56.7 47.6 M-40.4 14.7L-69.5 25.3 M-42.3 7.5L-72.9 12.8 M-42.3 -7.5L-72.9 -12.8 M-40.4 -14.7L-69.5 -25.3 M-32.9 -27.6L-56.7 -47.6 M-27.6 -32.9L-47.6 -56.7 M-14.7 -40.4L-25.3 -69.5 M-7.5 -42.3L-12.8 -72.9 M7.5 -42.3L12.8 -72.9 M14.7 -40.4L25.3 -69.5 M27.6 -32.9L47.6 -56.7 M32.9 -27.6L56.7 -47.6 M40.4 -14.7L69.5 -25.3 M42.3 -7.5L72.9 -12.8"
      }),
      svg("path", {
        class: "relay-halo-line strong",
        d: "M38 0L82 0 M32.9 19L71 41 M19 32.9L41 71 M0 38L0 82 M-19 32.9L-41 71 M-32.9 19L-71 41 M-38 0L-82 0 M-32.9 -19L-71 -41 M-19 -32.9L-41 -71 M0 -38L0 -82 M19 -32.9L41 -71 M32.9 -19L71 -41 M-82 0L82 0 M0 -82L0 82"
      })
    ]);
  }

  function makeLabel(node, tight, viewBox) {
    const radius = markerRadius(node);
    const label = tight && node.labelTight ? node.labelTight : (node.label || {});
    const fallbackSide = node.x > viewBox.width * 0.72 ? -1 : 1;
    const anchor = label.anchor || (fallbackSide < 0 ? "end" : "start");
    const dx = Number.isFinite(Number(label.dx)) ? Number(label.dx) : fallbackSide * (radius + 24);
    const dy = Number.isFinite(Number(label.dy)) ? Number(label.dy) : -10;
    const labelX = clamp(node.x + dx, 12, viewBox.width - 12);
    const labelY = clamp(node.y + dy, 18, viewBox.height - 18);

    const labelText = svg("text", {
      class: `demo-label ${node.type || "site"}${tight ? " hide-type" : ""}`,
      x: labelX,
      y: labelY,
      "text-anchor": anchor
    });

    const name = svg("tspan", { class: "name", x: labelX, y: labelY });
    name.append(text(node.name || node.id));

    const type = svg("tspan", { class: "type", x: labelX, dy: 18 });
    type.append(text(typeLabel(node.type)));

    labelText.append(name, type);
    return labelText;
  }

  function normaliseGraph(graph, viewBox) {
    const projectedNodes = graph.nodes.map((node) => projectNode(node, viewBox));
    const nodes = fitNodesToMapArea(projectedNodes, viewBox);
    const nodeById = new Map(nodes.map((node) => [node.id, node]));
    const links = graph.links
      .map((link) => ({
        ...link,
        fromNode: nodeById.get(link.from),
        toNode: nodeById.get(link.to),
        type: link.type || "backup"
      }))
      .filter((link) => link.fromNode && link.toNode);

    return {
      ...graph,
      nodes,
      links
    };
  }

  function renderMount(mount, sourceGraph) {
    const viewBox = getViewBoxForMount(mount);
    const graph = normaliseGraph(sourceGraph, viewBox);
    const tight = mount.getBoundingClientRect().width < 340;
    const selectedLink = findSelectedLink(graph);
    const selectedNodeIds = new Set();

    if (selectedLink) {
      selectedNodeIds.add(selectedLink.from);
      selectedNodeIds.add(selectedLink.to);
    }

    const root = svg("svg", {
      class: "rf-network-map-svg",
      viewBox: `0 0 ${viewBox.width} ${viewBox.height}`,
      preserveAspectRatio: "xMidYMid meet",
      role: "img",
      "aria-label": mount.getAttribute("aria-label") || "RF network map",
      "data-rf-network-map-version": VERSION
    });

    const linksSoftGroup = svg("g", { class: "demo-links-soft" });
    const linksGroup = svg("g", { class: "demo-links" });
    const routeDotsGroup = svg("g", { class: "demo-route-dots" });
    const halosGroup = svg("g", { class: "demo-node-halos" });
    const nodesGroup = svg("g", { class: "demo-nodes" });
    const labelsGroup = svg("g", { class: "demo-labels" });

    graph.links.forEach((link) => {
      const geometry = linkGeometry(link.fromNode, link.toNode);
      const path = geometryPath(geometry);
      const isSelected = selectedLink && link.id === selectedLink.id;
      const routeType = isSelected ? "alert" : link.type;
      const routeClass = `demo-route is-${routeType}${isSelected ? " is-selected-path" : ""}`;

      linksSoftGroup.append(svg("path", {
        class: `demo-link-soft is-${routeType}`,
        d: path,
        "vector-effect": "non-scaling-stroke"
      }));

      linksGroup.append(svg("path", {
        class: routeClass,
        d: path,
        "vector-effect": "non-scaling-stroke"
      }));

      if (isSelected) {
        [0.30, 0.50, 0.70].forEach((t, index) => {
          const point = cubicPoint(geometry, t);
          routeDotsGroup.append(svg("circle", {
            class: `demo-route-dot ${index === 1 ? "red" : "green"}`,
            cx: point.x,
            cy: point.y,
            r: index === 1 ? 6.8 : 5.8,
            "vector-effect": "non-scaling-stroke"
          }));
        });
      }
    });

    graph.nodes.forEach((node) => {
      const radius = markerRadius(node);
      const selected = selectedNodeIds.has(node.id);
      const halo = svg("circle", {
        class: `halo ${node.type || "site"}`,
        cx: node.x,
        cy: node.y,
        r: radius + (selected ? 13 : 8)
      });

      halosGroup.append(halo);

      if (selected) {
        halosGroup.append(svg("g", { transform: `translate(${node.x} ${node.y})` }, [
          makeSelectedHalo(radius)
        ]));
      }

      const nodeGroup = svg("g", {
        class: `demo-node ${selected ? "is-selected" : ""}`,
        transform: `translate(${node.x} ${node.y})`
      });

      nodeGroup.append(
        svg("circle", { class: node.type || "site", r: radius, "vector-effect": "non-scaling-stroke" }),
        svg("circle", { class: "inner-ring", r: Math.max(4, radius - 6), "vector-effect": "non-scaling-stroke" }),
        makeMast(0, 2, node.size === "large" ? 0.72 : 0.62)
      );

      nodesGroup.append(nodeGroup);
      labelsGroup.append(makeLabel(node, tight, viewBox));
    });

    root.append(
      linksSoftGroup,
      linksGroup,
      halosGroup,
      routeDotsGroup,
      nodesGroup,
      labelsGroup
    );

    mount.replaceChildren(root);
    mount.dataset.rfNetworkMapLoaded = "true";

    mount.dispatchEvent(new CustomEvent("fieldops:rf-network-map-rendered", {
      bubbles: true,
      detail: {
        version: VERSION,
        selectedPathId: selectedLink ? selectedLink.id : null
      }
    }));
  }

  function attachMapKey(mount) {
    const mapPaper = mount.closest(".rf-map-paper");

    if (!mapPaper) {
      return;
    }

    mapPaper
      .querySelectorAll(":scope > .rf-map-key")
      .forEach((key) => key.remove());

    if (mapPaper.dataset.rfNetworkMapKeyInit === "true") {
      mapPaper.dataset.rfNetworkMapKeyInit = "false";
    }

    const fragment = makeFragment(MAP_KEY_TEMPLATE);
    const key = fragment.querySelector(".rf-map-key");

    if (!key) {
      return;
    }

    mapPaper.appendChild(key);
    mapPaper.dataset.rfNetworkMapKeyInit = "true";

    mapPaper.dispatchEvent(new CustomEvent("fieldops:rf-map-key-ready", {
      bubbles: true,
      detail: {
        version: VERSION
      }
    }));
  }


  /* ==========================================================================
     8. Mount resize and path-pane reflow

     Ownership:
     - The path pane markup stays in rf-panes.js.
     - The pane open/close movement stays in rf.css/rf-pane.css.
     - This renderer only listens for holder shape changes so the SVG redraws
       cleanly when the pane changes the available map area.
     ========================================================================== */

  function bindMapReflowTriggers(mount, scheduleRender) {
    bindMapReflowTriggers(mount, scheduleRender);

    const mapPaper = mount.closest(".rf-map-paper");
    const paneToggle = mapPaper ? mapPaper.querySelector(".rf-path-toggle") : null;
    const pathPane = mapPaper ? mapPaper.querySelector(".rf-path-pane") : null;

    if (paneToggle) {
      paneToggle.addEventListener("change", () => {
        scheduleRender();
        window.requestAnimationFrame(scheduleRender);
        window.setTimeout(scheduleRender, 220);
      });
    }

    if (pathPane) {
      pathPane.addEventListener("transitionend", (event) => {
        if (event.propertyName === "transform" || event.propertyName === "right") {
          scheduleRender();
        }
      });
    }
  }

  function initMount(mount) {
    if (!mount || mount.dataset.rfNetworkMapInit === "true") {
      return;
    }

    mount.dataset.rfNetworkMapInit = "true";

    const state = {
      graph: null,
      frame: 0
    };

    const scheduleRender = () => {
      if (!state.graph || state.frame) {
        return;
      }

      state.frame = window.requestAnimationFrame(() => {
        state.frame = 0;
        renderMount(mount, state.graph);
      });
    };

    getGraphData().then((graph) => {
      state.graph = graph;
      renderMount(mount, state.graph);
      attachMapKey(mount);
    });

    const toggle = mount.closest(".rf-map-paper")?.querySelector(".rf-path-toggle");
    if (toggle) {
      toggle.addEventListener("change", scheduleRender);
    }

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(scheduleRender);
      observer.observe(mount);
    } else {
      window.addEventListener("resize", scheduleRender, { passive: true });
    }
  }

  function initAll(root = document) {
    root
      .querySelectorAll("[data-rf-network-map]")
      .forEach(initMount);
  }

  window.FieldOpsRFNetworkMap = {
    VERSION,
    init: initMount,
    initAll
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initAll(), { once: true });
  } else {
    initAll();
  }
})();

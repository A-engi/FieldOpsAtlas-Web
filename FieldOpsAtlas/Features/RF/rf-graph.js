/* ==========================================================================
   FieldOps Atlas RF graph renderer
   File: FieldOpsAtlas/Features/RF/rf-graph.js
   Version: 1.1.90-demo-builder-source

   Purpose:
   - Render only the foreground RF graph SVG.
   - Fetch graph data from FieldOpsRFPathBuilder.buildGraph().
   - Keep the demo graph/model in rf-path-builder.js so there is one graph data source.
   - Keep RF backgrounds and static compass decoration out of the dynamic SVG.
   - Keep a stable viewBox so page resizing does not flatten paths or circles.
   - Reflow when the RF path pane expands or collapses.
   - Own the static RF graph key so no extra key script is needed.
   ========================================================================== */

(() => {
  "use strict";

  const VERSION = "1.1.90-demo-builder-source";
  const SVG_NS = ["http:", "", "www.w3.org", "2000", "svg"].join("/");

  const BASE_VIEWBOX = {
    width: 1000,
    height: 650,
    safeEdge: 28
  };

  const TOPOLOGY_CONTENT_INSET = {
    left: 112,
    right: 94,
    top: 88,
    bottom: 176
  };

  const NODE_RADIUS = {
    default: 15,
    relay: 17,
    large: 21
  };

  const TOPOLOGY_KEY_TEMPLATE = String.raw`
<aside class="rf-graph-key" aria-label="RF graph key" data-rf-graph-key>
  <div class="rf-graph-key-title">Key</div>
  <ul class="rf-graph-key-list">
    <li>
      <span class="rf-graph-key-swatch is-core" aria-hidden="true"></span>
      <span>Core site</span>
    </li>
    <li>
      <span class="rf-graph-key-swatch is-relay" aria-hidden="true"></span>
      <span>Relay site</span>
    </li>
    <li>
      <span class="rf-graph-key-line is-selected" aria-hidden="true"></span>
      <span>Selected path</span>
    </li>
    <li>
      <span class="rf-graph-key-line is-standby" aria-hidden="true"></span>
      <span>Standby path</span>
    </li>
  </ul>
</aside>
`;

  function isUsableGraph(data) {
    return Boolean(
      data &&
      Array.isArray(data.nodes) &&
      data.nodes.length > 0 &&
      Array.isArray(data.links)
    );
  }

  function getGraphData(root = document) {
    const builder = window.FieldOpsRFPathBuilder;

    if (builder && typeof builder.buildGraph === "function") {
      const graph = builder.buildGraph(root);

      if (isUsableGraph(graph)) {
        return graph;
      }
    }

    return null;
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
      main: "SOURCE",
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

    return {
      width,
      height: clamp(Math.round(width / aspect), 620, 1800),
      safeEdge: BASE_VIEWBOX.safeEdge
    };
  }

  function projectNode(node, viewBox) {
    const sourceX = Number.isFinite(Number(node.x)) ? Number(node.x) : 0.5;
    const sourceY = Number.isFinite(Number(node.y)) ? Number(node.y) : 0.5;

    const x = sourceX >= 0 && sourceX <= 1 ? sourceX * viewBox.width : sourceX;
    const y = sourceY >= 0 && sourceY <= 1 ? sourceY * viewBox.height : sourceY;

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
    const targetLeft = TOPOLOGY_CONTENT_INSET.left;
    const targetRight = viewBox.width - TOPOLOGY_CONTENT_INSET.right;
    const targetTop = TOPOLOGY_CONTENT_INSET.top;
    const targetBottom = viewBox.height - TOPOLOGY_CONTENT_INSET.bottom;
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

  function renderUnavailable(mount) {
    const root = svg("svg", {
      class: "rf-graph-svg",
      viewBox: "0 0 1000 650",
      preserveAspectRatio: "xMidYMid meet",
      role: "img",
      "aria-label": "RF graph unavailable",
      "data-rf-graph-version": VERSION
    });

    const label = svg("text", {
      class: "demo-label",
      x: 500,
      y: 325,
      "text-anchor": "middle"
    });

    label.append(text("Graph data unavailable"));
    root.append(label);
    mount.replaceChildren(root);
    mount.dataset.rfGraphLoaded = "false";
    mount.dataset.rfGraphVersion = VERSION;
  }

  function renderMount(mount, sourceGraph) {
    if (!isUsableGraph(sourceGraph)) {
      renderUnavailable(mount);
      return;
    }

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
      class: "rf-graph-svg",
      viewBox: `0 0 ${viewBox.width} ${viewBox.height}`,
      preserveAspectRatio: "xMidYMid meet",
      role: "img",
      "aria-label": mount.getAttribute("aria-label") || "RF graph",
      "data-rf-graph-version": VERSION
    });

    const linksSoftGroup = svg("g", { class: "demo-links-soft" });
    const linksGroup = svg("g", { class: "demo-links" });
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
    });

    graph.nodes.forEach((node) => {
      const radius = markerRadius(node);
      const selected = selectedNodeIds.has(node.id);

      if (selected) {
        halosGroup.append(svg("g", { transform: `translate(${node.x} ${node.y})` }, [
          makeSelectedHalo(radius)
        ]));
      }

      const nodeGroup = svg("g", {
        class: `demo-node ${selected ? "is-selected" : ""}`,
        transform: `translate(${node.x} ${node.y})`
      });

      nodeGroup.append(svg("circle", {
        class: node.type || "site",
        r: radius,
        "vector-effect": "non-scaling-stroke"
      }));

      nodesGroup.append(nodeGroup);
      labelsGroup.append(makeLabel(node, tight, viewBox));
    });

    root.append(
      linksSoftGroup,
      linksGroup,
      halosGroup,
      nodesGroup,
      labelsGroup
    );

    mount.replaceChildren(root);
    mount.dataset.rfGraphLoaded = "true";
    mount.dataset.rfGraphVersion = VERSION;
    mount.dataset.rfGraphSource = graph.meta?.source || "FieldOpsRFPathBuilder";

    mount.dispatchEvent(new CustomEvent("fieldops:rf-graph-rendered", {
      bubbles: true,
      detail: {
        version: VERSION,
        selectedPathId: selectedLink ? selectedLink.id : null,
        source: graph.meta?.source || "FieldOpsRFPathBuilder",
        builderVersion: graph.meta?.builderVersion || ""
      }
    }));
  }

  function attachGraphKey(mount) {
    const mapPaper = mount.closest(".rf-map-paper");

    if (!mapPaper) {
      return;
    }

    mapPaper
      .querySelectorAll(":scope > .rf-graph-key")
      .forEach((key) => key.remove());

    const fragment = makeFragment(TOPOLOGY_KEY_TEMPLATE);
    const key = fragment.querySelector(".rf-graph-key");

    if (!key) {
      return;
    }

    mapPaper.appendChild(key);
    mapPaper.dataset.rfGraphKeyInit = "true";
    mapPaper.dataset.rfGraphKeyVersion = VERSION;

    mapPaper.dispatchEvent(new CustomEvent("fieldops:rf-graph-key-ready", {
      bubbles: true,
      detail: {
        version: VERSION
      }
    }));
  }

  function bindGraphReflowTriggers(mount, scheduleRender) {
    const mapPaper = mount.closest(".rf-map-paper");
    const pathPane = mapPaper ? mapPaper.querySelector(".rf-path-pane") : null;

    const scheduleReflowBurst = () => {
      scheduleRender();
      window.requestAnimationFrame(scheduleRender);
      window.setTimeout(scheduleRender, 220);
    };

    if (mapPaper) {
      mapPaper.addEventListener("fieldops:rf-path-pane-toggle", scheduleReflowBurst);
    }

    if (pathPane) {
      pathPane.addEventListener("transitionend", (event) => {
        if (event.propertyName === "transform" || event.propertyName === "right") {
          scheduleReflowBurst();
        }
      });
    }

    document.addEventListener("fieldops:rf-path-data-ready", scheduleReflowBurst);
  }

  function initMount(mount) {
    if (!mount || mount.dataset.rfGraphInit === "true") {
      return;
    }

    mount.dataset.rfGraphInit = "true";

    const state = {
      graph: null,
      frame: 0
    };

    const refreshGraph = () => {
      state.graph = getGraphData(document);
      renderMount(mount, state.graph);
      attachGraphKey(mount);
    };

    const scheduleRender = () => {
      if (state.frame) {
        return;
      }

      state.frame = window.requestAnimationFrame(() => {
        state.frame = 0;
        refreshGraph();
      });
    };

    refreshGraph();
    bindGraphReflowTriggers(mount, scheduleRender);

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(scheduleRender);
      observer.observe(mount);
    } else {
      window.addEventListener("resize", scheduleRender, { passive: true });
    }
  }

  function initAll(root = document) {
    root
      .querySelectorAll("[data-rf-graph]")
      .forEach(initMount);
  }

  window.FieldOpsRFGraph = {
    VERSION,
    init: initMount,
    initAll,
    getGraphData: () => getGraphData(document)
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initAll(), { once: true });
  } else {
    initAll();
  }
})();

/* Destination: FieldOpsAtlas/Features/RF/rf-graph.js */
/* End of file: FieldOpsAtlas/Features/RF/rf-graph.js */

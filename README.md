# FieldOps Atlas

FieldOps Atlas is a static GitHub Pages prototype for field engineering map, RF, network, docs, and tools workflows.

The current repository is being reorganised into a shallow Swift/iOS-style structure while keeping the browser prototype runnable.

## Live app

Root `index.html` is only a launcher. It opens:

```text
FieldOpsAtlas/Features/Map/index.html
```

## Current structure

```text
.
├── index.html
├── settings.html
├── theme.css
├── components.css
├── shell.css
├── shell.js
├── sw.js
├── data/
│   ├── icons/
│   ├── regions.json
│   └── regions/
├── FieldOpsAtlas/
│   ├── App/
│   ├── Core/
│   ├── Features/
│   │   ├── Map/
│   │   ├── RF/
│   │   ├── Network/
│   │   ├── Docs/
│   │   ├── Tools/
│   │   └── Weather/
│   ├── Resources/
│   └── Assets.xcassets/
└── archive/
```

## Ownership

### Universal/shared

```text
index.html
settings.html
theme.css
components.css
shell.css
shell.js
sw.js
data/
data/icons/
archive/
```

Universal/shared files own cross-page foundations only. They should not become feature-specific map, RF, network, docs, tools, or weather controllers.

### Map

```text
FieldOpsAtlas/Features/Map/
```

Map owns the geographic/walk map page, map controller, map UI bridge, map shell guard, map-specific CSS, Leaflet map layout, walk details, region selection, weather panels, field notes panels, and map-owned floating tools.

Current Map files:

```text
FieldOpsAtlas/Features/Map/index.html
FieldOpsAtlas/Features/Map/map-app.js
FieldOpsAtlas/Features/Map/map-page.css
FieldOpsAtlas/Features/Map/map-shell-guard.js
FieldOpsAtlas/Features/Map/map-ui.css
FieldOpsAtlas/Features/Map/map-ui.js
FieldOpsAtlas/Features/Map/shell.css
```

### RF

```text
FieldOpsAtlas/Features/RF/
```

RF owns the RF page, RF shell, RF services pages, RF demo map, RF page CSS, and related RF navigation.

### Network

```text
FieldOpsAtlas/Features/Network/
```

Network owns its own feature page. It may temporarily reuse shared shell assets until it grows its own feature shell.

### Docs

```text
FieldOpsAtlas/Features/Docs/
```

Docs owns the documentation/equipment-style feature page. It may temporarily reuse shared shell assets until it grows its own feature shell.

### Tools

```text
FieldOpsAtlas/Features/Tools/
```

Tools owns app tools and utilities. It may temporarily reuse shared shell assets until it grows its own feature shell.

### Weather

```text
FieldOpsAtlas/Features/Weather/
```

Weather is reserved for weather-specific work. Do not expand it with private operational data.

## Visual layer model

### RF page visual layers

The RF page is layered from back to front like this:

```text
Phone/app root
  ├─ shared shell chrome
  │   ├─ top bar
  │   ├─ bottom nav
  │   └─ overlays: drawer, search, filter
  ├─ RF quick-access row
  ├─ RF quick-toggle handle
  └─ main RF content canvas
      ├─ decorative background layer
      └─ foreground RF content
          ├─ RF network map card
          │   └─ generated SVG map
          ├─ path details card
          ├─ recently opened
          ├─ services
          └─ equipment
```

RF layer responsibilities:

- `shell.css` and `shell.js` own shared app chrome: top shell, drawer, search/filter UI, and bottom nav.
- `FieldOpsAtlas/Features/RF/index.html` owns RF page structure and static prototype content.
- `FieldOpsAtlas/Features/RF/rf.css` owns RF-specific layout, quick row, content canvas, card styling, and RF page visual stacking.
- `FieldOpsAtlas/Features/RF/rf-demo-map.js` owns the dynamic SVG network map inside the RF map placeholder.
- The RF dashboard cards/details/table are static prototype content unless they are moved into data later.
- The RF network map is dynamic, but currently falls back to embedded demo graph data if no external graph is available.

### Map page intended visual layers

The Map page should be layered from back to front like this:

```text
Document/body
  ├─ full-screen Leaflet map area
  │   ├─ tile layer
  │   ├─ marker layer
  │   ├─ map popups
  │   └─ Leaflet controls
  ├─ map-owned floating controls
  │   ├─ search
  │   ├─ map filter / fit visible walks
  │   ├─ region selector
  │   └─ weather button
  ├─ shared shell chrome
  │   ├─ top shell / title / burger
  │   ├─ side menu or drawer
  │   └─ bottom nav
  ├─ map-owned panels
  │   ├─ walk details
  │   ├─ settings
  │   ├─ add/edit walk
  │   ├─ add/manage region
  │   ├─ region filter
  │   ├─ weather mode
  │   └─ field notes
  ├─ temporary map overlays
  │   ├─ startup region gate
  │   ├─ weather overlay
  │   └─ status toast
  └─ emergency/fatal error overlay
```

Map layer responsibilities:

- `FieldOpsAtlas/Features/Map/index.html` owns stable DOM structure and element IDs.
- `FieldOpsAtlas/Features/Map/map-app.js` owns the Leaflet map, data loading, region/walk state, marker layer, marker selection, map rendering, and main map interactions.
- `FieldOpsAtlas/Features/Map/map-page.css` owns page reset, the full-screen map canvas, Leaflet layer positioning, selected-walk/detail panel positioning, weather button/panels, field notes panels, and map page theme.
- `FieldOpsAtlas/Features/Map/map-ui.js` and `map-ui.css` should stay as late UI helpers/overrides only. They should not become the main data or layout owner.
- `FieldOpsAtlas/Features/Map/map-shell-guard.js` should only prevent old map chrome and shared shell clicks leaking into broad document-level map handlers. It should not change map data, region data, markers, Leaflet state, or visuals.
- `shell.css` and `shell.js` should be shared app chrome only. They should not own map data, Leaflet state, markers, selected walk state, or map-only panels.

### Map page corruption likely means

If the Map page is visually corrupted, assume the intended order above has been broken before changing data or marker logic.

Most likely causes:

1. The map area is no longer the back layer.
2. Shared shell chrome is sitting below the map or behind Leaflet.
3. Map-owned panels are using the wrong stacking level.
4. Old map chrome and new shared shell chrome are both active and fighting.
5. `map-ui.css` or the Map-local `shell.css` is overriding layout that should belong to `map-page.css` or root `shell.css`.
6. Click handlers are leaking through shell controls into map document handlers, which is what `map-shell-guard.js` is meant to protect against.

Before fixing, inspect the current Map page in this order:

```text
1. FieldOpsAtlas/Features/Map/index.html
2. FieldOpsAtlas/Features/Map/map-page.css
3. FieldOpsAtlas/Features/Map/map-shell-guard.js
4. root shell.css and shell.js
5. FieldOpsAtlas/Features/Map/map-ui.css
6. FieldOpsAtlas/Features/Map/map-ui.js
7. FieldOpsAtlas/Features/Map/map-app.js
```

Fix layering first, then behaviour. Avoid data or marker rewrites unless the visual layer inspection proves the map controller is actually failing.

## Data safety

This is a public prototype repository.

Allowed public/demo data:

```text
site or walk names
approximate public locations
regions
service labels
display colours
demo notes
```

Do not commit private operational data:

```text
access instructions
contacts or engineer details
SharePoint links
IP addresses
switch ports
credentials
spares locations
private job, fault, or maintenance details
sensitive site instructions
```

Use dummy/local-only data for anything operationally sensitive.

## Current direction

The web prototype should stay simple and editable first. Later, the same broad structure can be converted into a Swift/iOS app.

Preferred future app shape:

```text
Map tab
RF tab
Network tab
Docs tab
Tools tab
Settings
```

Keep visible editors simple. Avoid exposing technical/private fields unless they are clearly demo-only or local-only.

## Manual test checklist

After structural edits, check:

```text
/ opens Map
Map loads regions and markers
Map details pane opens and closes
Map RF button opens RF
Map top search works
Map region selector opens and applies regions
Map weather mode opens and closes
Map field notes panel opens and closes
RF loads shell and network map
RF buttons open DTT / DAB / FM / More
RF bottom nav opens Map / Network / Docs / Tools
Network opens
Docs opens
Tools opens
settings.html still opens if linked
icons load from data/icons/
```

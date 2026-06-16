# FieldOps Atlas Web

FieldOps Atlas Web is a static GitHub Pages prototype for field engineering map, RF, network, docs, tools, profile, and weather workflows.

The browser prototype is the current source of truth. Keep private operational data out of the public repo.

## Live app

Root `index.html` is only a launcher. It opens:

```text
FieldOpsAtlas/Features/maps/index.html
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
└── FieldOpsAtlas/
    ├── App/
    ├── Core/
    ├── Features/
    │   ├── maps/
    │   ├── RF/
    │   ├── RFPages/
    │   ├── Network/
    │   ├── Docs/
    │   ├── Tools/
    │   ├── Profile/
    │   └── Weather/
    │       └── data/
    ├── Resources/
    └── Assets.xcassets/
```

Archive folders are historical only and are not part of the active app path.

## Active ownership

### Shared shell

```text
shell.css
shell.js
components.css
theme.css
sw.js
```

The shared shell owns top chrome, drawer, search, filter, editor mode, and bottom navigation. Feature pages own their own content and feature-specific behaviour.

### Maps

```text
FieldOpsAtlas/Features/maps/index.html
FieldOpsAtlas/Features/maps/background.css
FieldOpsAtlas/Features/maps/OSMmaps.css
FieldOpsAtlas/Features/maps/OSMmaps.js
FieldOpsAtlas/Features/maps/OSMpanes.css
FieldOpsAtlas/Features/maps/OSMpanes.js
FieldOpsAtlas/Features/maps/OSMweather-menu.css
FieldOpsAtlas/Features/maps/OSMweather-menu.js
```

The maps feature owns Leaflet, regions, markers, selected-walk state, map panels, field notes, weather menu entry points, and map-specific visual layers.

### RF

```text
FieldOpsAtlas/Features/RF/index.html
FieldOpsAtlas/Features/RF/background.css
FieldOpsAtlas/Features/RF/rf-graph.css
FieldOpsAtlas/Features/RF/rf-graph.js
FieldOpsAtlas/Features/RF/rf-interface.css
FieldOpsAtlas/Features/RF/rf-interface.js
FieldOpsAtlas/Features/RF/rf-path-builder.js
FieldOpsAtlas/Features/RFPages/*.html
```

RF owns the RF dashboard, RF graph, service pages, path details pane, and RF navigation.

The dynamic graph loads external data from `data/rf-graph.json` when present and otherwise keeps using the embedded demo graph.

### Feature pages

```text
FieldOpsAtlas/Features/Network/index.html
FieldOpsAtlas/Features/Docs/index.html
FieldOpsAtlas/Features/Tools/index.html
FieldOpsAtlas/Features/Profile/index.html
FieldOpsAtlas/Features/Weather/index.html
```

Network, Docs, Tools, Profile, and Weather are feature-owned pages/folders. Weather contains the provider test pages for RainViewer, Open-Meteo, Met Office DataHub Map Images, and EA rainfall gauges.

## Public prototype data rule

Public transmitter/site names, locations, and frequencies can be used as prototype data. Keep sensitive or internal operational data dummy-only, including access notes, contacts, SharePoint links, switch ports, IPs, spares locations, config notes, job details, and fault details.

## Smoke check

```text
/ opens FieldOpsAtlas/Features/maps/index.html
Maps loads regions and markers
Maps details pane opens and closes
Maps RF button opens RF
Maps Weather link opens FieldOpsAtlas/Features/Weather/index.html
RF loads shell and graph
RFPages links open under FieldOpsAtlas/Features/RFPages/
Network, Docs, and Tools links resolve to active feature/RFPages paths
Profile opens from the drawer user row
```

<!-- End of file: README.md -->

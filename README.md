# FieldOps Atlas

FieldOps Atlas is a static browser prototype for field engineering walk/site workflows.

The current app is a lightweight GitHub Pages build. It uses Leaflet for the map, local JSON files for region/site loading, and browser local storage for prototype settings and notes.

## Live app

- GitHub Pages: https://beezelbun.github.io/The-Field-Engineers-Atlas/
- Repository: https://github.com/BeezelBun/The-Field-Engineers-Atlas

## Current focus

The map page supports:

- region-based walk loading
- marker popups and collapsed/expanded walk details
- walk search
- region filtering
- local-only field notes
- weather mode panels
- basic power/DNO helper links
- local GitHub token storage for prototype write workflows

## Repository layout

```text
.
├── index.html                  # Main map page shell
├── map-app.js                  # Main map/data/application controller
├── map-ui.js                   # Late map UI bridge and weather/notes helpers
├── theme.css                   # Shared design tokens and global reset
├── components.css              # Shared UI components, panels, forms, and cards
├── shell.css                   # Top bar, side menu, side rail, and app chrome
├── map-page.css                # Main map page layout and panel positioning
├── map-ui.css                  # Late map-only UI overrides and weather/notes styling
├── met-office-overlay-checker.html
├── data/
│   └── regions/                # Public prototype region/site JSON files
└── icons/                      # Static SVG icons
```

## File ownership rules

Keep each file focused:

- `index.html` owns document structure and stable element IDs.
- `map-app.js` owns app state, map/data loading, marker selection, panel state, and write workflows.
- `map-ui.js` owns late UI helpers only. It should not become the main map/data owner.
- `theme.css` owns variables, reset, and global page background.
- `components.css` owns reusable UI pieces.
- `shell.css` owns app chrome.
- `map-page.css` owns map page layout.
- `map-ui.css` owns late map-specific visual overrides.

## Data safety

This is a public prototype repository.

Public prototype data can include transmitter/walk names, approximate public locations, and public service/frequency-style information.

Do not commit internal operational details, including:

- access instructions that are not public
- contacts, phone numbers, or engineer details
- SharePoint links
- IP addresses, switch ports, config notes, or credentials
- spares locations
- private job, fault, or maintenance details

Use dummy data for anything operationally sensitive.

## Development notes

This is currently plain HTML, CSS, and JavaScript. There is no build step.

Recommended change order for cleanup work:

1. HTML structure
2. CSS tokens/components/layout
3. map UI bridge
4. main map app JavaScript last

After changing a CSS or JS file, update the relevant query-string cache-bust in `index.html`.

Keep the visible app version tied to meaningful app behaviour changes, not every CSS-only cleanup.

## Fresh RF/map baseline

This upload pack excludes archive files and uses `v1.1.1` as a fresh-start baseline for the RF/page migration bundle.

The active map page should load `map-app.js` as the main controller and `map-page.css` as the main map page layout stylesheet. Do not restore or load root `app.js` or root `app.css`.


## Manual test checklist

After edits, check:

- page loads on GitHub Pages
- map appears
- region selector loads
- marker click opens a small popup and collapsed details pane
- Details/Expand opens the full details pane
- details pane can minimise and close
- search works
- weather mode opens and closes
- field notes panel opens and closes
- no obvious mobile layout regression

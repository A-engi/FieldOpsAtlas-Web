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
sw.js
data/
data/icons/
archive/
```

### Map

```text
FieldOpsAtlas/Features/Map/
```

Map owns the geographic/walk map page, map controller, map UI bridge, map shell, and map-specific CSS.

### RF

```text
FieldOpsAtlas/Features/RF/
```

RF owns the RF page, RF shell, RF services pages, RF demo map, RF page CSS, and related RF navigation.

### Network

```text
FieldOpsAtlas/Features/Network/
```

Network owns its own feature page. It may temporarily reuse the RF shell assets until it grows its own shell.

### Docs

```text
FieldOpsAtlas/Features/Docs/
```

Docs owns the documentation/equipment-style feature page. It may temporarily reuse the RF shell assets.

### Tools

```text
FieldOpsAtlas/Features/Tools/
```

Tools owns app tools and utilities. It may temporarily reuse the RF shell assets.

### Weather

```text
FieldOpsAtlas/Features/Weather/
```

Weather is reserved for weather-specific work. Do not expand it with private operational data.

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
RF loads shell and network map
RF buttons open DTT / DAB / FM / More
RF bottom nav opens Map / Network / Docs / Tools
Network opens
Docs opens
Tools opens
settings.html still opens if linked
icons load from data/icons/
```

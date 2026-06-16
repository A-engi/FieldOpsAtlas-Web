# FieldOps Atlas Weather Lab

A static FieldOps Atlas Web feature lab for weather-provider experiments.

## Purpose

This feature folder tests:

1. RainViewer radar tiles as a UK-wide rain/blob overlay.
2. Open-Meteo batched site risk for visible region sites.
3. Met Office DataHub Map Images access with a user-supplied key and order name.

No internal Atlas operational data belongs here.

## Provider notes

### RainViewer

No API key. The app calls:

```text
https://api.rainviewer.com/public/weather-maps.json
```

Then uses returned `host` and `path` values to create Leaflet radar tiles.

RainViewer public examples state personal-use limits including max native zoom level 7, Universal Blue, past radar data only and PNG format.

### Open-Meteo

No API key. The app batches visible site coordinates into compact forecast calls.

It intentionally fetches only a small set of variables for site-risk testing.

### Met Office DataHub Map Images

Requires your own DataHub API key and an active Map Images order. The key is typed into the browser session and is not stored in the repo.

The test request uses:

```text
https://data.hub.api.metoffice.gov.uk/map-images/1.0.0/orders/{order}/latest?detail=MINIMAL
```

and then tries to preview the first returned PNG file.

If this fails in browser due to CORS, that is useful: it means the final Atlas version needs a tiny backend/proxy or native app networking rather than direct GitHub Pages access.

## GitHub Pages

After GitHub Pages is enabled for the repo, open:

```text
https://a-engi.github.io/FieldOpsAtlas-Web/FieldOpsAtlas/Features/Weather/
```

## Files

```text
FieldOpsAtlas/Features/Weather/index.html
FieldOpsAtlas/Features/Weather/styles.css
FieldOpsAtlas/Features/Weather/app.js
FieldOpsAtlas/Features/Weather/data/regions.json
FieldOpsAtlas/Features/Weather/README.md
```

## Safety

Do not commit API keys, access notes, contacts, internal links, ports, IPs, spares locations, configuration notes, job details or fault details.

<!-- End of file: FieldOpsAtlas/Features/Weather/README.md -->

# FieldOps Atlas Web

Static web app for FieldOps Atlas maps, RF views, weather panels, profile tools, and shared mobile shell UI.

## Repository Layout

- `index.html` redirects into the main app experience.
- `shell.js`, `shell.css`, and `shell.html` provide the shared navigation, search, settings, and editor shell.
- `FieldOpsAtlas/Features/` contains page-level features for maps, RF, weather, network, docs, tools, and profile.
- `data/` contains shared icons, region records, and RF data used by the static app.
- `scripts/check-repo.mjs` runs repository health checks.

## Local Checks

Run the relevant validation before committing changes:

```powershell
npm run check
npm run check:js
npm run check:html
npm run check:css
npm run check:json
```

## GitHub Editing

The in-app editor can write JSON updates through the GitHub contents API when a user supplies a fine-grained token in Settings. Tokens are kept in memory for the active browser session only and must not be committed into HTML, JavaScript, documentation, or repository history.

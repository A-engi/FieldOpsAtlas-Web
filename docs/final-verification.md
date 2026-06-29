# Final Verification

Verification date: 2026-06-29.

## Commands

- `npm run check`: passed with 0 errors and 282 warnings.
- `npm run check:js`: passed.
- `npm run check:json`: passed.
- `npm run check:html`: passed.
- `npm run check:links`: passed.
- `npm run check:refs`: passed.
- `npm run check:css`: passed with 90 warnings.
- `npm run check:workflows`: passed.
- `npm run check:secrets`: passed.
- `npm run test:metoffice`: passed.
- `node --check` over every `.js` and `.mjs` file: passed.
- PowerShell JSON parse over every `.json` file: passed.
- HTML local link and fragment validation: passed.

`docker` is not installed locally, so the pinned `rhysd/actionlint:1.7.7` workflow validator was not run locally. It is wired into `.github/workflows/repository-check.yml`.

## Retained Warnings

- CSS warnings are retained because many selectors are created dynamically by Leaflet, shell rendering, feature cards and RF graph rendering.
- Orphan warnings are retained for anonymised data files, icon inventory, archive material, generated audit reports and development shell references.
- Stale-term warnings are retained where terms are part of anonymised data status values, archive filenames, checker search terms, audit reports, cache-version strings or active data IDs.
- `Wenvoe` remains in RF data IDs, paths and anonymised region data because changing those IDs would alter data references.
- `demo` remains in anonymised data status/confidence values, cache-version strings and archive filenames.
- `prototype` remains in JavaScript `prototype` method syntax and development shell references.
- Destination/end-of-file text remains in some retained SVG/archive assets flagged for a later archive/asset cleanup.

## Manual Entry-Point Checks

Production HTML entry points were checked for local scripts, stylesheets, images, data references and navigation targets by the repository checker and an HTML local-link scan.

Active production pages are listed in `docs/repository-audit.md`. Development-only pages and retained duplicate-looking files are listed in `docs/repository-migration-map.md`.

## Met Office

The workflow schedule is daily at 05:30 UTC with `workflow_dispatch` retained. Required secret names are `METOFFICE_API_KEY` and `METOFFICE_ORDER_ID`.

No live Met Office API success is claimed from local verification.

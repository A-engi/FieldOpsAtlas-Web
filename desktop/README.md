# FieldOps Atlas Desktop

The desktop app is an Electron wrapper around the same static app that GitHub Pages serves.

- `npm run desktop` opens the live GitHub Pages copy at `https://a-engi.github.io/FieldOpsAtlas-Web/`.
- `npm run desktop:local` opens the packaged repository files through the private `fieldops://app/` protocol.
- If the live copy fails to load, the app falls back to the packaged copy automatically.

The live URL can be changed without editing code:

```powershell
$env:FIELDOPS_DESKTOP_URL = "https://example.com/FieldOpsAtlas-Web/"
npm run desktop
```

The app also accepts source flags:

```powershell
npm run desktop -- --live
npm run desktop -- --local
```

Build a desktop package with:

```powershell
npm run desktop:dist
```

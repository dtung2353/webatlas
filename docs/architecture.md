# WebAtlas architecture notes

## 1. Current role of each folder

- `src/` – frontend React + TypeScript source
  - `src/App.tsx` – root layout
  - `src/controllers/` – React context and hooks for map state
  - `src/models/` – config, GIS parsers, report generation, mock data, types
  - `src/views/` – UI components (map, popup, search, export, layers)
  - `src/styles/` – CSS
- `mapserver/` – MapServer config and GIS data
  - `mapserver/config/atlas.map` – main MapServer mapfile
  - `mapserver/Du_An_WebAtlas_Nhom/` – GIS data files (GeoPackage / rasters)
- `docker-compose.yml` – local full-stack stack (web + mapserver + postgis)
- `Dockerfile` + `nginx.conf` – build and serve frontend

## 2. What is still a bit messy

The project already works, but the code is a bit mixed:

- UI, state, and data-fetch logic are close together.
- Some logic sits in `src/models/` even though it is really service logic.
- The GIS backend config is still a bit scattered; `mapserver/config/` is now the main place for MapServer config.
- There is a legacy static build folder `code_web/` that should be treated as output, not as source of truth.

## 3. Recommended clean structure

```text
webatlas/
  src/
    app/
      App.tsx
      main.tsx
    features/
      map/
        components/
        hooks/
        services/
        config/
      search/
      export/
      ogc/
    shared/
      types/
      utils/
      constants/
    styles/
  mapserver/
    config/
      atlas.map
    data/
      (GeoPackage / rasters)
  docs/
    architecture.md
  .env.example
```

## 4. What to keep vs what to remove later

Keep:
- `src/` for application source
- `mapserver/config/atlas.map`
- `docker-compose*.yml`
- `package.json`, `tsconfig*.json`, `vite.config.ts`

Review later:
- `code_web/` – only keep if you still need a static artifact for reference; otherwise delete it from source control.
- `node_modules/` – never commit this folder.
- `dist/` – generated build output; do not commit.

## 5. Good next refactor steps

1. Move MapServer request logic into `src/features/map/services/`.
2. Move shared types into `src/shared/types/`.
3. Move UI components into feature folders.
4. Leave `src/controllers/` only for shared React context/hook wrappers.
5. Add a real `.env` for local development.

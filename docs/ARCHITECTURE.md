# Zameen Vivaad AI architecture

The frontend keeps React responsible for behavior and composition while separating screen-level concerns from shared UI primitives. `src/App.tsx` is now the app shell: it owns navigation state, selected-project state, modal state, and data mutations. Workspace metadata lives in `src/lib/navigation.ts`, shared presentational primitives live in `src/app/ui.tsx`, and the main screens live in `src/app/screens/`.

| Layer | Location | Responsibility |
|---|---|---|
| App shell | `src/App.tsx` | State, navigation, modal orchestration, and screen composition. |
| Screens | `src/app/screens/` | Overview, Project desk, Project snapshot, Risk studio, and Parcel registry. |
| Shared UI | `src/app/ui.tsx` | Risk pills, metric cards, rows, map, and signal bars. |
| Data | `src/data/mockData.ts` | Prototype data that can later be replaced by API queries. |
| Types | `src/types.ts` | Shared domain types and risk contracts. |
| Styling | `src/index.css` | Design tokens, responsive layout, and motion system. |
| Exporter | `scripts/export-simple.mjs` | Builds a standalone HTML/CSS/JS representation and copies the React source. |

## Simplified export

Run `pnpm export:simple` to create `exports/simple/`. The output contains a browser-ready `index.html`, named `styles.css` and `app.js` copies of the production assets, the original hashed assets, and a `react-source/` directory containing the modular TSX source.

The static export is not a second implementation. It is generated from the same Vite production build, which prevents the HTML/CSS/JS representation from drifting away from the React application.

## Optimization choices

The largest optimization is structural: the application shell is small enough to understand at a glance, screen modules can be changed independently, and shared UI is imported once and tree-shaken by Vite. Search filtering is memoized in Project desk, the intro animation is session-gated, and the build remains static-friendly with no runtime API dependency.

## Polish audit checkpoint

The Overview now has a stronger editorial hierarchy with a morning brief strip, three color-coded movement signals, a richer geographic pulse, and a confidence note below the bottleneck chart. The Project desk still preserves its table-to-snapshot workflow after the visual update, including selected-file scoring, delay likelihood, and explainable drivers.

## Glassmorphism audit checkpoint

The glass treatment was checked on Overview and Project desk. Cards now separate cleanly from the atmospheric background through translucent white layers, backdrop blur, soft inset highlights, and deeper ambient shadows. Project rows, filter controls, primary actions, and the selected-file snapshot use the same rounded language, while the existing typography and risk colors remain readable.

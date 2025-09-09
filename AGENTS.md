# Repository Guidelines

## Project Structure & Modules
- `src/components/`: UI, tables, role selector, squad, charts, `ui/` primitives.
- `src/lib/`: data parsing and scoring (`data-manager*.ts`, `file-parser.ts`).
- `src/store/`: Zustand stores (`app-store.ts`, `filter-store.ts`, `squad-store.ts`).
- `src/workers/`: heavy computations (`score-calculator.worker.ts`).
- `src/types/`: shared TypeScript types.
- `public/`: static assets. `src-tauri/`: Tauri (Rust) backend and config.
- Path alias: import via `@/...` (see `tsconfig.json`).

## Filters & Query System
- Presets and queries
  - Store: `src/store/filter-store.ts` persists `presets`, `selectedPresetId`, and `currentQuery`.
  - Types: see `src/types/index.ts` for `FilterPreset*`, `QueryGroup`, `QueryRule`, numeric/string operators, and derived fields.
  - Capture/apply: `src/lib/filter-presets.ts` captures global text, column filters, visibility (internal columns excluded), sorting, page size, and query; apply restores them.
- PlayerTable integration
  - Hidden evaluator column: `queryMatch` applies `currentQuery` via `src/lib/query.ts` (AND/OR evaluator with derived metrics).
  - Hidden numeric attribute columns: all numeric and derived attributes exist as hidden columns to support native column filters (range object: `{min?:number, max?:number}` or a single number meaning `>=`). They are excluded from the Columns menu to avoid clutter and excluded from presets.
  - Mirroring for UX: If a query is a flat AND of numeric rules only, rules are mirrored into native column filters and `queryMatch` is disabled. Otherwise (OR, nested, or string rules), mirrored filters are cleared and `queryMatch` is enabled.
  - Monetary columns: Value and Wage use `MoneyCell` (`src/components/PlayerTable/MoneyCell.tsx`) for compact currency formatting and proper numeric sorting via `parsePriceToNumber`.
  - No Query Builder UI: the legacy Query Builder component/button was removed. Advanced queries are still supported through `currentQuery` (set programmatically or restored from presets) and mirrored into native numeric filters when possible (see “Mirroring for UX”).

Guidelines
- When adding new derived metrics, update both `src/lib/query.ts` (evaluation) and PlayerTable’s hidden attribute columns.
- Keep internal columns (`queryMatch`, hidden numeric keys) out of preset `columnVisibility` and out of the Columns dropdown.
- Programmatic filters example: `table.getColumn('Pac')?.setFilterValue({ min: 15 })` or `table.getColumn('Age')?.setFilterValue({ max: 25 })`.

Price parsing and hidden Price column
- Use `parsePriceToNumber` (`src/lib/price.ts`) for all monetary comparisons/sorting. It understands `€10M – €14.5M`, `£850K`, `7.2m`, `500k`, `Free`, and `-`.
- Ranges use the upper bound to make “Max Price” filters conservative; “Free” maps to 0; unknowns map to `Infinity`.
- The hidden numeric `Price` column in PlayerTable is derived from `Transfer Value` or `Value` and exists solely to power native filters (e.g., a Max Price control).

## Presets UI
- Component: `src/components/PlayerTable/PresetsMenu.tsx`.
- Save/load/manage (duplicate, delete). Applying a preset also restores the saved `currentQuery`.
- Presets include: global search text, column filters, column visibility (sans internals), sorting, page size, and the advanced query.

## Charts
- Radar chart: `src/components/charts/RadarChart.tsx` using `chart.js` + `react-chartjs-2`.
- Styling: theme-aware via CSS variables (`--chart-*`, `--border`, `--muted-foreground`). No PNG export button.
- Comparison integration: `src/components/PlayerComparison.tsx` with sets (Physical, Technical, Mental, Custom). Up to 4 overlays.

## Build, Test, and Development
- `npm run dev`: start Vite dev server (web).
- `npm run tauri dev`: run desktop app with Tauri.
- `npm run build`: type-checks (tsc) then builds web bundle.
- `npm run preview`: serve production build locally.
- `npm run tauri build`: create desktop bundles/installers.
- Using pnpm/yarn is fine; replace `npm` with your tool. Rust is required for Tauri commands.

## Coding Style & Naming
- **TypeScript strict**: keep explicit types for public APIs; 2-space indent.
- **React**: components `PascalCase` (`.tsx`), hooks `useThing`, props/interfaces in `src/types` when shared.
- **Imports**: prefer alias `@/…` and named exports; group external → internal.
- **Styling**: Tailwind CSS (see `tailwind.config.js` and `tailwind.config.css`); compose classes with `clsx`/CVA where applicable.
- **State**: colocate component state; app-wide state in `src/store` via Zustand.

## Testing Guidelines
- No test framework is configured yet. If adding tests, prefer Vitest + React Testing Library.
- Naming: `*.test.ts` / `*.test.tsx` beside source or under `__tests__/`.
- Minimum: ensure `npm run build` and type-checks pass before PR.

## Commit & Pull Requests
- Commit style: Conventional Commits encouraged (`feat:`, `fix:`, `docs:`, `chore:`). History shows mixed usage—please standardize going forward.
- PRs must include: clear summary, linked issues (`Fixes #123`), screenshots/GIFs for UI changes, and a brief test plan.
- CI: GitHub Actions builds web and Tauri apps on PRs; ensure local `npm run build` succeeds. Do not commit large datasets or secrets.

## Security & Configuration
- Tauri builds require system deps (see CI and README). Avoid filesystem access changes without discussing `src-tauri/` implications.
- Keep user data out of version control; use small, anonymized samples in `docs/` if needed.

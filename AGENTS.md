# Repository Guidelines

## Project Structure & Modules
- `src/components/`: UI, tables, role selector, squad, charts, `ui/` primitives.
- `src/lib/`: data parsing and scoring (`data-manager*.ts`, `file-parser.ts`).
- `src/store/`: Zustand stores (`app-store.ts`, `filter-store.ts`, `squad-store.ts`).
- `src/workers/`: heavy computations (`score-calculator.worker.ts`).
- `src/types/`: shared TypeScript types.
- `public/`: static assets. `src-tauri/`: Tauri (Rust) backend and config.
- Path alias: import via `@/...` (see `tsconfig.json`).

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

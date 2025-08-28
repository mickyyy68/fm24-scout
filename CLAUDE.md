# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
```bash
# Run web development server
npm run dev

# Run Tauri desktop app in development
npm run tauri dev

# Build for production
npm run build          # Frontend only
npm run tauri build    # Desktop app with installers
```

### Build Platform-Specific Releases
```bash
# Windows (.exe, .msi)
npm run tauri build -- --target x86_64-pc-windows-msvc

# macOS (.dmg)
npm run tauri build -- --target x86_64-apple-darwin      # Intel
npm run tauri build -- --target aarch64-apple-darwin     # Apple Silicon

# Linux (.deb, .AppImage)
npm run tauri build -- --target x86_64-unknown-linux-gnu
```

## Architecture Overview

### Core Data Flow
1. **Player Import** → Parse CSV/HTML → Store in Zustand → Display in Table
2. **Role Calculation** → Web Worker processes in background → Updates UI progressively → Results cached in memory
3. **Table Rendering** → Auto-switches to virtualization at 100+ rows → Debounced filtering/searching → Smart column visibility

### Critical Performance Patterns

#### Web Worker Architecture
- **Location**: `src/workers/score-calculator.worker.ts`
- **Manager**: `src/lib/data-manager-optimized.ts`
- Processes player scores in background to prevent UI freezing
- Reports progress via postMessage for real-time updates
- Falls back to synchronous calculation if Worker fails

#### Virtual Table Switching
```typescript
// Automatic at ZOOM_CONFIG.VIRTUALIZATION_THRESHOLD (100 rows)
{table.getFilteredRowModel().rows.length > 100 ? (
  <VirtualizedTable table={table} zoom={debouncedZoom} />
) : (
  // Regular table for small datasets
)}
```

#### Zoom Implementation
- Uses CSS `transform: scale()` for GPU acceleration
- Width compensation formula: `width: ${100 / (zoom / 100)}%`
- Debounced at 100ms to prevent lag
- Persisted in localStorage via Zustand

### State Management (Zustand)
- **Store**: `src/store/app-store.ts`
- Persists: `selectedRoles`, `tableZoom`
- Key pattern: All state updates are immutable
- LocalStorage key: `fm24-scout-storage`

### Role Scoring Algorithm
Based on squirrel_plays' methodology:
1. Each role has weighted attributes (0-10 scale)
2. Player attributes normalized to 0-1 (value/20)
3. Score = Σ(normalized_value × weight) / Σ(weights) × 100
4. Best role = highest score across all calculated roles

### Table Component Hierarchy
```
PlayerTable (index.tsx)
├── PlayerFilters (filters dropdown)
├── ColumnVisibilityToggle (show/hide columns)
├── Zoom Controls (50-200% range)
└── VirtualizedTable OR Regular Table
    └── Uses @tanstack/react-table
```

## Key Implementation Details

### File Import Parser
- **HTML**: Looks for `<table>` with player data
- **CSV**: Uses PapaParse library
- Expects FM24 export format with all attributes
- Validates required fields: Name, Age, Position

### Constants and Configuration
```typescript
// Zoom settings (PlayerTable/index.tsx)
const ZOOM_CONFIG = {
  MIN: 50,
  MAX: 200,
  STEP: 10,
  DEFAULT: 100,
  DEBOUNCE_MS: 100,
  VIRTUALIZATION_THRESHOLD: 100
}

// VirtualizedTable settings
const TABLE_CONFIG = {
  BASE_ROW_HEIGHT: 48,
  OVERSCAN_COUNT: 10
}
```

### Keyboard Shortcuts
- `Ctrl/Cmd + Plus`: Zoom in
- `Ctrl/Cmd + Minus`: Zoom out
- `Ctrl/Cmd + 0`: Reset zoom to 100%

### Data Types
- **Player**: FM24 player with 40+ attributes
- **Role**: Contains role name, code, and attribute weights
- **RoleScore**: Player score for specific role (0-100)

## Common Modifications

### Adding New UI Components
1. Create in `src/components/ui/` following shadcn patterns
2. Use Radix UI primitives when available
3. Apply consistent theming with CSS variables

### Modifying Role Calculations
1. Edit `src/data/roles.json` for role weights
2. Update calculation in both:
   - `src/lib/data-manager.ts` (sync)
   - `src/workers/score-calculator.worker.ts` (async)

### Performance Optimization Checklist
- [ ] Use `useDebounce` for user inputs (300ms default)
- [ ] Memoize expensive calculations with `useMemo`
- [ ] Implement virtual scrolling for lists >100 items
- [ ] Move heavy computation to Web Workers
- [ ] Use CSS transforms over layout properties

## Tauri Desktop Integration
- Config: `src-tauri/tauri.conf.json`
- Window settings persist automatically
- File system access through Tauri APIs
- Auto-updater configured for GitHub releases

## GitHub Actions
- **Build workflow**: `.github/workflows/build.yml` - Tests and builds on push
- **Release workflow**: `.github/workflows/release.yml` - Creates releases on tags
- Artifacts uploaded for Windows, macOS, Linux

## Important Files Not to Modify
- `src/data/roles.json` - Core role definitions from FM24
- `src-tauri/Cargo.toml` - Rust dependencies (auto-managed)
- Worker file paths - Referenced by URL in optimized data manager
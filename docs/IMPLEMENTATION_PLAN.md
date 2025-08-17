# FM24 Scout - Tauri + React + shadcn/ui Implementation Plan

## Project Overview

Build a modern, native desktop application for Football Manager player analysis using:
- **Tauri** - Native desktop wrapper with Rust backend
- **React** - Modern UI framework
- **shadcn/ui** - Beautiful, accessible component library
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type safety
- **Vite** - Fast build tool

## Simplified UI Design

### Main Layout (Single Page Application)

```
┌─────────────────────────────────────────────────┐
│  FM24 Scout  [☀️/🌙] Theme Toggle               │  <- Header
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │  📁 Drop file here or click to browse      │ │  <- File Import Zone
│  │     Support: HTML, CSV files               │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │  Selected Roles:                          │ │
│  │  [AF-A ×] [W-S ×] [BPD-D ×] [+ Add Roles] │ │  <- Role Selection
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │  Players (245 loaded)      [Export ▼]     │ │
│  ├───────────────────────────────────────────┤ │
│  │  Search: [_______________]  [Calculate]   │ │
│  ├───────────────────────────────────────────┤ │
│  │  Name | Club | Best Role | Score | ...    │ │  <- Data Table
│  │  ...  | ... | ...       | ...   | ...     │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Component Breakdown

#### 1. **App Shell**
- Simple header with app name and theme toggle
- Main content area with consistent padding
- Toast notifications (shadcn/ui Toast)

#### 2. **File Import Component**
- Large drop zone using shadcn/ui Card
- Drag & drop support
- File validation feedback
- Progress indicator during processing

#### 3. **Role Selector Component**
- Selected roles as shadcn/ui Badges with remove buttons
- "Add Roles" button opens Command/Dialog
- Search/filter functionality in dialog
- Quick actions: Select All, Clear All

#### 4. **Data Table Component**
- shadcn/ui DataTable with sorting, filtering
- Virtualized for performance (react-window)
- Column visibility toggle
- Export dropdown menu

#### 5. **Role Selection Dialog**
- shadcn/ui Command component for searchable list
- Grouped by position (Forwards, Midfielders, etc.)
- Checkbox selection
- Shows current selection count

## Tech Stack Details

### Core Dependencies

```json
{
  "dependencies": {
    // React Ecosystem
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    
    // UI Components
    "@radix-ui/react-*": "latest",  // shadcn dependencies
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    
    // Data Table
    "@tanstack/react-table": "^8.10.0",
    "react-window": "^1.8.10",  // Virtualization
    
    // File Processing
    "papaparse": "^5.4.1",  // CSV parsing
    
    // State Management
    "zustand": "^4.4.0",  // Simple state management
    
    // Utilities
    "lucide-react": "^0.290.0",  // Icons
    "date-fns": "^2.30.0",
    
    // Tauri
    "@tauri-apps/api": "^1.5.0"
  },
  "devDependencies": {
    // Build Tools
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.1.0",
    
    // TypeScript
    "typescript": "^5.2.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    
    // Tailwind
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    
    // Tauri
    "@tauri-apps/cli": "^1.5.0"
  }
}
```

## Project Structure

```
fm24-scout/
├── src/                          # React Frontend
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── command.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── toast.tsx
│   │   │   └── data-table.tsx
│   │   ├── FileImport.tsx       # Drag & drop file import
│   │   ├── RoleSelector.tsx     # Role selection badges
│   │   ├── RoleDialog.tsx       # Role selection dialog
│   │   ├── PlayerTable.tsx      # Main data table
│   │   ├── ThemeToggle.tsx      # Dark/light mode
│   │   └── ExportMenu.tsx       # Export dropdown
│   ├── lib/
│   │   ├── data-manager.ts      # Role data and calculations
│   │   ├── file-parser.ts       # HTML/CSV parsing
│   │   ├── utils.ts             # Utility functions
│   │   └── constants.ts         # App constants
│   ├── hooks/
│   │   ├── use-toast.tsx        # Toast notifications
│   │   ├── use-players.ts       # Player state management
│   │   └── use-roles.ts         # Role state management
│   ├── store/
│   │   └── app-store.ts         # Zustand store
│   ├── styles/
│   │   └── globals.css          # Tailwind imports
│   ├── App.tsx                  # Main app component
│   └── main.tsx                 # Entry point
├── src-tauri/                    # Rust Backend
│   ├── src/
│   │   ├── main.rs              # Tauri setup
│   │   ├── commands/
│   │   │   ├── mod.rs
│   │   │   ├── file_import.rs   # File processing commands
│   │   │   └── calculations.rs  # Score calculations
│   │   └── data/
│   │       └── roles.rs         # Role data structures
│   ├── Cargo.toml
│   └── tauri.conf.json          # Tauri configuration
├── public/
│   └── data/
│       └── roles.json            # Role weightings data
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
└── components.json               # shadcn/ui config
```

## Implementation Steps

### Phase 1: Project Setup (Day 1)

1. **Initialize Tauri + React project**
   ```bash
   npm create tauri-app@latest fm24-scout -- --template react-ts
   cd fm24-scout
   ```

2. **Setup Tailwind CSS**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

3. **Initialize shadcn/ui**
   ```bash
   npx shadcn-ui@latest init
   ```

4. **Install required shadcn components**
   ```bash
   npx shadcn-ui@latest add button card dialog command dropdown-menu badge toast input
   ```

5. **Setup project structure**
   - Create folder structure
   - Configure TypeScript
   - Setup Tailwind

### Phase 2: Core Components (Day 2)

1. **Create App Shell**
   ```tsx
   // App.tsx
   import { ThemeProvider } from './components/theme-provider'
   import { Toaster } from './components/ui/toaster'
   import { Header } from './components/Header'
   import { FileImport } from './components/FileImport'
   import { RoleSelector } from './components/RoleSelector'
   import { PlayerTable } from './components/PlayerTable'

   function App() {
     return (
       <ThemeProvider defaultTheme="dark">
         <div className="min-h-screen bg-background">
           <Header />
           <main className="container mx-auto p-6 space-y-6">
             <FileImport />
             <RoleSelector />
             <PlayerTable />
           </main>
           <Toaster />
         </div>
       </ThemeProvider>
     )
   }
   ```

2. **Implement FileImport Component**
   ```tsx
   // components/FileImport.tsx
   import { Card } from '@/components/ui/card'
   import { Upload } from 'lucide-react'
   import { useDropzone } from 'react-dropzone'
   
   export function FileImport() {
     const { getRootProps, getInputProps, isDragActive } = useDropzone({
       accept: {
         'text/html': ['.html', '.htm'],
         'text/csv': ['.csv']
       },
       onDrop: handleFileDrop
     })

     return (
       <Card className="border-dashed">
         <div {...getRootProps()} className="p-12 text-center cursor-pointer">
           <input {...getInputProps()} />
           <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
           <p className="mt-2 text-sm text-muted-foreground">
             {isDragActive 
               ? 'Drop the file here...' 
               : 'Drag & drop file here, or click to select'}
           </p>
           <p className="text-xs text-muted-foreground mt-1">
             Supports: HTML, CSV files (max 20,000 players)
           </p>
         </div>
       </Card>
     )
   }
   ```

3. **Create RoleSelector Component**
   ```tsx
   // components/RoleSelector.tsx
   import { Badge } from '@/components/ui/badge'
   import { Button } from '@/components/ui/button'
   import { Card } from '@/components/ui/card'
   import { Plus, X } from 'lucide-react'
   
   export function RoleSelector() {
     const selectedRoles = useRoleStore(state => state.selectedRoles)
     
     return (
       <Card className="p-4">
         <div className="flex items-center gap-2 flex-wrap">
           <span className="text-sm font-medium">Selected Roles:</span>
           {selectedRoles.map(role => (
             <Badge key={role.code} variant="secondary">
               {role.name}
               <X className="ml-1 h-3 w-3 cursor-pointer" 
                  onClick={() => removeRole(role.code)} />
             </Badge>
           ))}
           <Button size="sm" variant="outline" onClick={openRoleDialog}>
             <Plus className="h-4 w-4 mr-1" />
             Add Roles
           </Button>
         </div>
       </Card>
     )
   }
   ```

### Phase 3: Data Management (Day 3)

1. **Setup Zustand Store**
   ```ts
   // store/app-store.ts
   import { create } from 'zustand'
   
   interface AppState {
     players: Player[]
     selectedRoles: Role[]
     isLoading: boolean
     setPlayers: (players: Player[]) => void
     addRole: (role: Role) => void
     removeRole: (code: string) => void
     calculateScores: () => void
   }
   
   export const useAppStore = create<AppState>((set, get) => ({
     players: [],
     selectedRoles: [],
     isLoading: false,
     
     setPlayers: (players) => set({ players }),
     
     addRole: (role) => set(state => ({
       selectedRoles: [...state.selectedRoles, role]
     })),
     
     removeRole: (code) => set(state => ({
       selectedRoles: state.selectedRoles.filter(r => r.code !== code)
     })),
     
     calculateScores: () => {
       const { players, selectedRoles } = get()
       // Calculation logic
     }
   }))
   ```

2. **Implement Data Manager**
   ```ts
   // lib/data-manager.ts
   import rolesData from '/data/roles.json'
   
   export class DataManager {
     private roles: Role[]
     
     constructor() {
       this.roles = rolesData
     }
     
     calculatePlayerScore(player: Player, role: Role): number {
       let totalScore = 0
       let weightSum = 0
       
       Object.entries(role).forEach(([attr, weight]) => {
         if (attr !== 'Role' && attr !== 'RoleCode') {
           const playerValue = player[attr] || 0
           if (weight > 0) {
             totalScore += (playerValue / 20) * weight
             weightSum += weight
           }
         }
       })
       
       return weightSum > 0 ? (totalScore / weightSum) * 100 : 0
     }
     
     findBestRole(player: Player): RoleScore {
       const scores = this.roles.map(role => ({
         role: role.Role,
         code: role.RoleCode,
         score: this.calculatePlayerScore(player, role)
       }))
       
       return scores.sort((a, b) => b.score - a.score)[0]
     }
   }
   ```

3. **File Parser Implementation**
   ```ts
   // lib/file-parser.ts
   import Papa from 'papaparse'
   
   export class FileParser {
     parseHTML(content: string): Player[] {
       const parser = new DOMParser()
       const doc = parser.parseFromString(content, 'text/html')
       const table = doc.querySelector('table')
       
       if (!table) throw new Error('No table found')
       
       // Extract headers and rows
       // Convert to Player objects
       return players
     }
     
     parseCSV(content: string): Player[] {
       const result = Papa.parse(content, {
         header: true,
         dynamicTyping: true
       })
       
       return result.data.map(row => this.normalizePlayer(row))
     }
     
     private normalizePlayer(data: any): Player {
       // Handle ranges (14-16 -> 15)
       // Handle missing values (- -> 0)
       return normalized
     }
   }
   ```

### Phase 4: Data Table (Day 4)

1. **Create DataTable Component**
   ```tsx
   // components/PlayerTable.tsx
   import { DataTable } from '@/components/ui/data-table'
   import { columns } from './columns'
   
   export function PlayerTable() {
     const players = useAppStore(state => state.players)
     const selectedRoles = useAppStore(state => state.selectedRoles)
     
     const tableColumns = useMemo(() => {
       return [
         ...baseColumns,
         ...selectedRoles.map(role => ({
           accessorKey: role.code,
           header: role.name,
           cell: ({ row }) => {
             const score = row.original.scores?.[role.code]
             return score?.toFixed(1) || '-'
           }
         }))
       ]
     }, [selectedRoles])
     
     return (
       <Card>
         <CardHeader>
           <CardTitle>
             Players ({players.length} loaded)
           </CardTitle>
           <ExportMenu data={players} />
         </CardHeader>
         <CardContent>
           <DataTable
             columns={tableColumns}
             data={players}
             pagination
             sorting
             filtering
           />
         </CardContent>
       </Card>
     )
   }
   ```

2. **Setup Table Columns**
   ```tsx
   // components/columns.tsx
   export const baseColumns: ColumnDef<Player>[] = [
     {
       accessorKey: 'Name',
       header: ({ column }) => (
         <Button variant="ghost" onClick={() => column.toggleSorting()}>
           Name
           <ArrowUpDown className="ml-2 h-4 w-4" />
         </Button>
       )
     },
     {
       accessorKey: 'Club',
       header: 'Club'
     },
     {
       accessorKey: 'Position',
       header: 'Position'
     },
     {
       accessorKey: 'bestRole',
       header: 'Best Role',
       cell: ({ row }) => {
         const best = row.original.bestRole
         return (
           <div>
             <div className="font-medium">{best?.name}</div>
             <div className="text-sm text-muted-foreground">
               {best?.score.toFixed(1)}%
             </div>
           </div>
         )
       }
     }
   ]
   ```

### Phase 5: Tauri Integration (Day 5)

1. **Setup Tauri Commands**
   ```rust
   // src-tauri/src/main.rs
   #[tauri::command]
   async fn import_file(path: String) -> Result<Vec<Player>, String> {
       // Process file in Rust for better performance
   }
   
   #[tauri::command]
   fn calculate_scores(
       players: Vec<Player>, 
       roles: Vec<String>
   ) -> Result<Vec<PlayerWithScores>, String> {
       // Fast calculation in Rust
   }
   ```

2. **Frontend Tauri Integration**
   ```ts
   // lib/tauri-commands.ts
   import { invoke } from '@tauri-apps/api/tauri'
   import { open } from '@tauri-apps/api/dialog'
   
   export async function selectFile() {
     const selected = await open({
       multiple: false,
       filters: [{
         name: 'Player Data',
         extensions: ['html', 'htm', 'csv']
       }]
     })
     
     if (selected) {
       const players = await invoke('import_file', { path: selected })
       return players
     }
   }
   ```

3. **Configure Tauri**
   ```json
   // tauri.conf.json
   {
     "tauri": {
       "allowlist": {
         "fs": {
           "readFile": true,
           "scope": ["$HOME/**", "$RESOURCE/**"]
         },
         "dialog": {
           "open": true
         }
       },
       "bundle": {
         "identifier": "com.fm24scout.app",
         "resources": ["data/roles.json"]
       }
     }
   }
   ```

### Phase 6: Polish & Optimization (Day 6)

1. **Add Loading States**
   - Skeleton loaders for table
   - Progress bar for file processing
   - Loading spinners for calculations

2. **Error Handling**
   - Toast notifications for errors
   - File validation feedback
   - Graceful error recovery

3. **Performance Optimization**
   - Virtual scrolling for large datasets
   - Memoize expensive calculations
   - Debounce search inputs

4. **Export Functionality**
   ```tsx
   // components/ExportMenu.tsx
   import { DropdownMenu } from '@/components/ui/dropdown-menu'
   import { Button } from '@/components/ui/button'
   import { Download } from 'lucide-react'
   
   export function ExportMenu({ data }) {
     const exportCSV = () => {
       const csv = Papa.unparse(data)
       downloadFile(csv, 'players.csv', 'text/csv')
     }
     
     const exportJSON = () => {
       const json = JSON.stringify(data, null, 2)
       downloadFile(json, 'players.json', 'application/json')
     }
     
     return (
       <DropdownMenu>
         <DropdownMenuTrigger asChild>
           <Button variant="outline" size="sm">
             <Download className="h-4 w-4 mr-2" />
             Export
           </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent>
           <DropdownMenuItem onClick={exportCSV}>
             Export as CSV
           </DropdownMenuItem>
           <DropdownMenuItem onClick={exportJSON}>
             Export as JSON
           </DropdownMenuItem>
         </DropdownMenuContent>
       </DropdownMenu>
     )
   }
   ```

## Key Differences from Original

### Improvements
1. **Modern Stack**: React + TypeScript vs vanilla JavaScript
2. **Better UX**: shadcn/ui components with consistent design
3. **Performance**: Virtual scrolling, Rust calculations
4. **Maintainability**: Component-based architecture
5. **Type Safety**: Full TypeScript coverage

### Simplifications
1. **Single Page**: No complex routing needed
2. **Cleaner UI**: Fewer buttons, better organization
3. **Smart Defaults**: Auto-calculate on role selection
4. **Better Feedback**: Toast notifications, loading states

## Development Commands

```bash
# Development
npm run dev           # Start Vite dev server
npm run tauri dev    # Start Tauri in dev mode

# Build
npm run build        # Build React app
npm run tauri build  # Build Tauri app for distribution

# Add shadcn components
npx shadcn-ui@latest add [component-name]

# Type checking
npm run type-check

# Linting
npm run lint
```

## Testing Strategy

1. **Unit Tests**: Jest + React Testing Library
2. **Integration Tests**: Test file parsing, calculations
3. **E2E Tests**: Playwright for full app testing
4. **Performance Tests**: Large file handling (20k players)

## Deployment

1. **Build for Multiple Platforms**
   ```bash
   npm run tauri build -- --target universal-apple-darwin  # macOS
   npm run tauri build -- --target x86_64-pc-windows-msvc  # Windows
   npm run tauri build -- --target x86_64-unknown-linux-gnu # Linux
   ```

2. **Auto-Update Setup**
   - Configure tauri-updater
   - Setup GitHub releases
   - Sign builds for distribution

## Timeline

- **Day 1**: Project setup, dependencies, structure
- **Day 2**: Core components (FileImport, RoleSelector)
- **Day 3**: Data management, calculations
- **Day 4**: Data table, search, filtering
- **Day 5**: Tauri integration, native features
- **Day 6**: Polish, optimization, testing

## Success Metrics

- ✅ Import 20,000 players in < 2 seconds
- ✅ Calculate scores in < 500ms
- ✅ Smooth scrolling with 20k rows
- ✅ File size < 50MB
- ✅ Memory usage < 200MB
- ✅ 60 FPS UI interactions

This plan provides a modern, maintainable implementation of the FM Client App with a cleaner UI and better performance!
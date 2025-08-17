# FM24 Scout - Implementation Agent Specifications

## Overview
Five specialized agents will work together to implement the FM24 Scout application. Each agent has specific responsibilities, deliverables, and success criteria.

---

## Agent 1: Project Setup & Configuration Specialist

### Role
Initialize and configure the complete development environment for FM24 Scout using Tauri, React, TypeScript, and shadcn/ui.

### Responsibilities

#### 1. Project Initialization
```bash
# Commands to execute
npm create tauri-app@latest fm24-scout -- --template react-ts
cd fm24-scout
npm install
```

#### 2. Dependency Installation
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-toast": "^1.1.5",
    "@tanstack/react-table": "^8.10.7",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "cmdk": "^0.2.0",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.294.0",
    "papaparse": "^5.4.1",
    "react-dropzone": "^14.2.3",
    "react-window": "^1.8.10",
    "tailwind-merge": "^2.1.0",
    "tailwindcss-animate": "^1.0.7",
    "zustand": "^4.4.7",
    "@tauri-apps/api": "^1.5.2"
  },
  "devDependencies": {
    "@types/node": "^20.10.4",
    "@types/react": "^18.2.42",
    "@types/react-dom": "^18.2.17",
    "@types/react-window": "^1.8.8",
    "@types/papaparse": "^5.3.14",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.3.3",
    "vite": "^5.0.8",
    "@tauri-apps/cli": "^1.5.8"
  }
}
```

#### 3. Configuration Files

**tailwind.config.ts**
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
```

**components.json**
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/styles/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

**tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### 4. Directory Structure Creation
```bash
mkdir -p src/{components/{ui,layout},lib,hooks,store,types,data}
mkdir -p src-tauri/src/{commands,data}
mkdir -p public/data
```

#### 5. Global Styles Setup
```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
```

### Deliverables
- ✅ Initialized Tauri + React + TypeScript project
- ✅ All dependencies installed and configured
- ✅ Tailwind CSS and shadcn/ui setup complete
- ✅ TypeScript configuration optimized
- ✅ Project structure created
- ✅ Development environment ready

### Success Criteria
- `npm run dev` starts the development server
- `npm run tauri dev` launches the Tauri app
- All configuration files are valid
- shadcn/ui components can be added via CLI

---

## Agent 2: UI Components Specialist

### Role
Create all React components using shadcn/ui, implement the user interface, and ensure responsive, accessible design.

### Responsibilities

#### 1. Install shadcn/ui Components
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add command
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add input
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add scroll-area
npx shadcn-ui@latest add table
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add progress
```

#### 2. Core Layout Components

**src/App.tsx**
```tsx
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { Header } from '@/components/layout/Header'
import { FileImport } from '@/components/FileImport'
import { RoleSelector } from '@/components/RoleSelector'
import { PlayerTable } from '@/components/PlayerTable'
import { useAppStore } from '@/store/app-store'

function App() {
  const { players, isLoading } = useAppStore()

  return (
    <ThemeProvider defaultTheme="dark" storageKey="fm24-theme">
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto p-6">
          <div className="space-y-6">
            <FileImport />
            {players.length > 0 && (
              <>
                <RoleSelector />
                <PlayerTable />
              </>
            )}
          </div>
        </main>
        <Toaster />
      </div>
    </ThemeProvider>
  )
}

export default App
```

**src/components/layout/Header.tsx**
```tsx
import { Moon, Sun, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/theme-provider'

export function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="border-b">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6" />
          <h1 className="text-2xl font-bold">FM24 Scout</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  )
}
```

#### 3. FileImport Component

**src/components/FileImport.tsx**
```tsx
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Upload, FileText, AlertCircle } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useAppStore } from '@/store/app-store'
import { FileParser } from '@/lib/file-parser'

export function FileImport() {
  const [progress, setProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const setPlayers = useAppStore(state => state.setPlayers)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsProcessing(true)
    setProgress(10)

    try {
      const content = await file.text()
      setProgress(30)

      const parser = new FileParser()
      let players

      if (file.name.endsWith('.csv')) {
        players = parser.parseCSV(content)
      } else {
        players = parser.parseHTML(content)
      }

      setProgress(70)

      if (players.length > 20000) {
        throw new Error(`Too many players: ${players.length} (max 20,000)`)
      }

      setPlayers(players)
      setProgress(100)

      toast({
        title: 'Success',
        description: `Imported ${players.length} players from ${file.name}`,
      })

      setTimeout(() => {
        setIsProcessing(false)
        setProgress(0)
      }, 500)
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      })
      setIsProcessing(false)
      setProgress(0)
    }
  }, [setPlayers, toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/html': ['.html', '.htm'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    disabled: isProcessing,
  })

  return (
    <Card className={`transition-all ${isDragActive ? 'border-primary' : 'border-dashed'}`}>
      <CardContent className="p-12">
        <div
          {...getRootProps()}
          className={`text-center cursor-pointer ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
        >
          <input {...getInputProps()} />
          
          {isProcessing ? (
            <div className="space-y-4">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground animate-pulse" />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Processing file...</p>
                <Progress value={progress} className="w-full max-w-xs mx-auto" />
              </div>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">
                {isDragActive ? 'Drop the file here' : 'Drop file here or click to browse'}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Supports HTML and CSV files (max 20,000 players)
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

#### 4. RoleSelector Component

**src/components/RoleSelector.tsx**
```tsx
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, X, Calculator } from 'lucide-react'
import { RoleDialog } from '@/components/RoleDialog'
import { useAppStore } from '@/store/app-store'
import { useToast } from '@/components/ui/use-toast'

export function RoleSelector() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { selectedRoles, removeRole, calculateScores, players } = useAppStore()
  const { toast } = useToast()

  const handleCalculate = async () => {
    const startTime = performance.now()
    await calculateScores()
    const endTime = performance.now()
    
    toast({
      title: 'Calculation Complete',
      description: `Calculated scores for ${players.length} players in ${((endTime - startTime) / 1000).toFixed(2)}s`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Selection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Selected Roles:</span>
          
          {selectedRoles.map(role => (
            <Badge key={role.code} variant="secondary" className="pl-3 pr-1">
              {role.name}
              <button
                onClick={() => removeRole(role.code)}
                className="ml-1 rounded-full p-0.5 hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Roles
          </Button>
          
          {selectedRoles.length > 0 && players.length > 0 && (
            <Button
              size="sm"
              variant="default"
              onClick={handleCalculate}
              className="ml-auto"
            >
              <Calculator className="h-4 w-4 mr-1" />
              Calculate Scores
            </Button>
          )}
        </div>
        
        <RoleDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </CardContent>
    </Card>
  )
}
```

#### 5. RoleDialog Component

**src/components/RoleDialog.tsx**
```tsx
import { useState, useMemo } from 'react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/app-store'
import rolesData from '@/data/roles.json'

interface RoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RoleDialog({ open, onOpenChange }: RoleDialogProps) {
  const { selectedRoles, addRole, removeRole, clearRoles } = useAppStore()
  const [search, setSearch] = useState('')

  const groupedRoles = useMemo(() => {
    const groups: Record<string, typeof rolesData> = {
      'Forwards': [],
      'Midfielders': [],
      'Defenders': [],
      'Goalkeepers': [],
    }

    rolesData.forEach(role => {
      if (role.Role.includes('Forward') || role.Role.includes('Striker')) {
        groups['Forwards'].push(role)
      } else if (role.Role.includes('Midfielder') || role.Role.includes('Playmaker')) {
        groups['Midfielders'].push(role)
      } else if (role.Role.includes('Defender') || role.Role.includes('Back')) {
        groups['Defenders'].push(role)
      } else if (role.Role.includes('Keeper')) {
        groups['Goalkeepers'].push(role)
      }
    })

    return groups
  }, [])

  const isSelected = (code: string) => 
    selectedRoles.some(r => r.code === code)

  const toggleRole = (role: any) => {
    if (isSelected(role.RoleCode)) {
      removeRole(role.RoleCode)
    } else {
      addRole({ code: role.RoleCode, name: role.Role })
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search roles..." 
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No roles found.</CommandEmpty>
        
        <div className="p-2 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              rolesData.forEach(role => {
                if (!isSelected(role.RoleCode)) {
                  addRole({ code: role.RoleCode, name: role.Role })
                }
              })
            }}
          >
            Select All
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={clearRoles}
          >
            Clear All
          </Button>
          <div className="ml-auto text-sm text-muted-foreground">
            {selectedRoles.length} selected
          </div>
        </div>

        {Object.entries(groupedRoles).map(([group, roles]) => (
          <CommandGroup key={group} heading={group}>
            {roles
              .filter(role => 
                role.Role.toLowerCase().includes(search.toLowerCase())
              )
              .map(role => (
                <CommandItem
                  key={role.RoleCode}
                  onSelect={() => toggleRole(role)}
                  className="flex items-center gap-2"
                >
                  <Checkbox checked={isSelected(role.RoleCode)} />
                  <span>{role.Role}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {role.RoleCode}
                  </span>
                </CommandItem>
              ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
```

#### 6. PlayerTable Component

**src/components/PlayerTable.tsx**
```tsx
import { useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { ExportMenu } from '@/components/ExportMenu'
import { useAppStore } from '@/store/app-store'
import { getTableColumns } from '@/lib/table-columns'

export function PlayerTable() {
  const { players, selectedRoles } = useAppStore()

  const columns = useMemo(
    () => getTableColumns(selectedRoles),
    [selectedRoles]
  )

  if (players.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Players</CardTitle>
          <CardDescription>
            {players.length} players loaded
          </CardDescription>
        </div>
        <ExportMenu data={players} />
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={players}
          searchKey="Name"
          pageSize={25}
        />
      </CardContent>
    </Card>
  )
}
```

### Deliverables
- ✅ All UI components created with shadcn/ui
- ✅ Responsive and accessible design
- ✅ Dark/light theme support
- ✅ File import with drag & drop
- ✅ Role selection interface
- ✅ Data table with virtual scrolling
- ✅ Export functionality
- ✅ Loading states and error handling

### Success Criteria
- All components render without errors
- UI is responsive on all screen sizes
- Keyboard navigation works
- Theme switching persists
- Components follow shadcn/ui patterns

---

## Agent 3: Data Management Specialist

### Role
Implement state management, data parsing, score calculations, and all business logic for the FM24 Scout application.

### Responsibilities

#### 1. State Management Store

**src/store/app-store.ts**
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Player, Role, RoleScore } from '@/types'
import { DataManager } from '@/lib/data-manager'

interface AppState {
  // State
  players: Player[]
  selectedRoles: Role[]
  isLoading: boolean
  isCalculating: boolean
  
  // Actions
  setPlayers: (players: Player[]) => void
  addRole: (role: Role) => void
  removeRole: (code: string) => void
  clearRoles: () => void
  calculateScores: () => Promise<void>
  clearAll: () => void
}

const dataManager = new DataManager()

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      players: [],
      selectedRoles: [],
      isLoading: false,
      isCalculating: false,

      setPlayers: (players) => {
        set({ players })
      },

      addRole: (role) => {
        set((state) => ({
          selectedRoles: [...state.selectedRoles, role]
        }))
      },

      removeRole: (code) => {
        set((state) => ({
          selectedRoles: state.selectedRoles.filter(r => r.code !== code)
        }))
      },

      clearRoles: () => {
        set({ selectedRoles: [] })
      },

      calculateScores: async () => {
        set({ isCalculating: true })
        
        const { players, selectedRoles } = get()
        
        const playersWithScores = await dataManager.calculateAllScores(
          players,
          selectedRoles.map(r => r.code)
        )
        
        set({ 
          players: playersWithScores,
          isCalculating: false 
        })
      },

      clearAll: () => {
        set({
          players: [],
          selectedRoles: [],
          isLoading: false,
          isCalculating: false
        })
      }
    }),
    {
      name: 'fm24-scout-storage',
      partialize: (state) => ({
        selectedRoles: state.selectedRoles
      })
    }
  )
)
```

#### 2. Type Definitions

**src/types/index.ts**
```typescript
export interface Player {
  // Basic Info
  Name: string
  Age: number
  Club: string
  Nationality: string
  Position: string
  
  // Contract
  'Transfer Value'?: string
  Wage?: string
  
  // Technical Attributes
  Cor: number
  Cro: number
  Dri: number
  Fin: number
  Fir: number
  Fla: number
  Hea: number
  Lon: number
  Mar: number
  Pas: number
  Tck: number
  Tec: number
  
  // Mental Attributes
  Agg: number
  Ant: number
  Bra: number
  Cmp: number
  Cnt: number
  Dec: number
  Det: number
  Ldr: number
  OtB: number
  Pos: number
  Tea: number
  Vis: number
  Wor: number
  
  // Physical Attributes
  Acc: number
  Agi: number
  Bal: number
  Jum: number
  Pac: number
  Sta: number
  Str: number
  
  // Goalkeeper Attributes
  '1v1': number
  Aer: number
  Cmd: number
  Han: number
  Kic: number
  Ref: number
  TRO: number
  Thr: number
  
  // Calculated
  Speed?: number
  WorkRate?: number
  SetPieces?: number
  
  // Scores
  roleScores?: Record<string, number>
  bestRole?: RoleScore
}

export interface Role {
  code: string
  name: string
}

export interface RoleData {
  Role: string
  RoleCode: string
  [key: string]: string | number
}

export interface RoleScore {
  code: string
  name: string
  score: number
}
```

#### 3. Data Manager

**src/lib/data-manager.ts**
```typescript
import rolesData from '@/data/roles.json'
import { Player, RoleData, RoleScore } from '@/types'

export class DataManager {
  private roles: RoleData[]
  
  constructor() {
    this.roles = rolesData as RoleData[]
  }
  
  getAllRoles() {
    return this.roles.map(r => ({
      code: r.RoleCode,
      name: r.Role
    }))
  }
  
  getRoleByCode(code: string) {
    return this.roles.find(r => r.RoleCode === code)
  }
  
  calculatePlayerScore(player: Player, roleCode: string): number {
    const role = this.getRoleByCode(roleCode)
    if (!role) return 0
    
    let totalScore = 0
    let weightSum = 0
    
    // Iterate through all attributes
    Object.entries(role).forEach(([attr, weight]) => {
      if (attr === 'Role' || attr === 'RoleCode') return
      
      const numWeight = Number(weight)
      if (numWeight === 0) return
      
      const playerValue = Number(player[attr as keyof Player]) || 0
      const normalizedValue = Math.min(playerValue / 20, 1)
      
      totalScore += normalizedValue * numWeight
      weightSum += numWeight
    })
    
    return weightSum > 0 ? (totalScore / weightSum) * 100 : 0
  }
  
  findBestRole(player: Player): RoleScore | null {
    let bestScore: RoleScore | null = null
    
    this.roles.forEach(role => {
      const score = this.calculatePlayerScore(player, role.RoleCode)
      
      if (!bestScore || score > bestScore.score) {
        bestScore = {
          code: role.RoleCode,
          name: role.Role,
          score
        }
      }
    })
    
    return bestScore
  }
  
  async calculateAllScores(
    players: Player[], 
    selectedRoleCodes: string[]
  ): Promise<Player[]> {
    return players.map(player => {
      const roleScores: Record<string, number> = {}
      
      // Calculate scores for selected roles
      selectedRoleCodes.forEach(code => {
        roleScores[code] = this.calculatePlayerScore(player, code)
      })
      
      // Find best role from selected
      let bestRole: RoleScore | null = null
      Object.entries(roleScores).forEach(([code, score]) => {
        const role = this.getRoleByCode(code)
        if (role && (!bestRole || score > bestRole.score)) {
          bestRole = {
            code,
            name: role.Role,
            score
          }
        }
      })
      
      // Add calculated attributes
      const speed = ((player.Pac || 0) + (player.Acc || 0)) / 2
      const workRate = ((player.Wor || 0) + (player.Sta || 0)) / 2
      const setPieces = ((player.Cor || 0) + (player.Fir || 0)) / 2
      
      return {
        ...player,
        Speed: speed,
        WorkRate: workRate,
        SetPieces: setPieces,
        roleScores,
        bestRole
      }
    })
  }
}
```

#### 4. File Parser

**src/lib/file-parser.ts**
```typescript
import Papa from 'papaparse'
import { Player } from '@/types'

export class FileParser {
  parseHTML(content: string): Player[] {
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const table = doc.querySelector('table')
    
    if (!table) {
      throw new Error('No table found in HTML file')
    }
    
    const headers: string[] = []
    const headerRow = table.querySelector('tr')
    
    if (!headerRow) {
      throw new Error('No header row found in table')
    }
    
    // Extract headers
    headerRow.querySelectorAll('th, td').forEach(cell => {
      let text = cell.textContent?.trim() || ''
      // Map common abbreviations
      if (text === 'Nat') text = 'Nationality'
      headers.push(text)
    })
    
    // Extract data rows
    const players: Player[] = []
    const rows = table.querySelectorAll('tr')
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      const cells = row.querySelectorAll('td')
      
      if (cells.length !== headers.length) continue
      
      const playerData: any = {}
      
      cells.forEach((cell, index) => {
        const header = headers[index]
        const value = cell.textContent?.trim() || ''
        
        playerData[header] = this.parseAttributeValue(value)
      })
      
      // Skip invalid entries
      if (!playerData.Name || playerData.Name === '-') continue
      
      players.push(playerData as Player)
    }
    
    return players
  }
  
  parseCSV(content: string): Player[] {
    const result = Papa.parse<any>(content, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true
    })
    
    if (result.errors.length > 0) {
      console.warn('CSV parsing warnings:', result.errors)
    }
    
    return result.data
      .map(row => {
        const player: any = {}
        
        Object.entries(row).forEach(([key, value]) => {
          player[key] = this.parseAttributeValue(String(value))
        })
        
        return player as Player
      })
      .filter(p => p.Name && p.Name !== '-')
  }
  
  private parseAttributeValue(value: string): number | string {
    // Handle missing values
    if (!value || value === '-' || value === '') {
      return 0
    }
    
    // Handle range values (e.g., "14-16")
    if (value.includes('-') && !value.startsWith('-')) {
      const parts = value.split('-')
      if (parts.length === 2) {
        const min = parseFloat(parts[0])
        const max = parseFloat(parts[1])
        if (!isNaN(min) && !isNaN(max)) {
          return (min + max) / 2
        }
      }
    }
    
    // Try to parse as number
    const num = parseFloat(value)
    if (!isNaN(num)) {
      return num
    }
    
    // Return as string
    return value
  }
}
```

#### 5. Export Utilities

**src/lib/export.ts**
```typescript
import Papa from 'papaparse'
import { Player } from '@/types'

export class ExportManager {
  exportCSV(players: Player[], selectedRoles: string[]): string {
    const exportData = players.map(player => {
      const row: any = {
        Name: player.Name,
        Age: player.Age,
        Club: player.Club,
        Nationality: player.Nationality,
        Position: player.Position,
        'Best Role': player.bestRole?.name || '',
        'Best Score': player.bestRole?.score.toFixed(1) || ''
      }
      
      // Add selected role scores
      selectedRoles.forEach(code => {
        const role = player.roleScores?.[code]
        row[code] = role?.toFixed(1) || ''
      })
      
      return row
    })
    
    return Papa.unparse(exportData)
  }
  
  exportJSON(players: Player[]): string {
    return JSON.stringify(players, null, 2)
  }
  
  downloadFile(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}
```

### Deliverables
- ✅ Zustand store with persist middleware
- ✅ Complete type definitions
- ✅ Data manager for calculations
- ✅ File parser for HTML/CSV
- ✅ Export functionality
- ✅ Calculated attributes (Speed, WorkRate, SetPieces)
- ✅ Role scoring algorithm

### Success Criteria
- State persists across sessions
- Calculations match original algorithm
- File parsing handles edge cases
- Export produces valid files
- Performance: < 500ms for 1000 players

---

## Agent 4: Tauri Backend Specialist

### Role
Implement the Rust backend for Tauri, optimize performance-critical operations, and integrate native file system features.

### Responsibilities

#### 1. Tauri Configuration

**src-tauri/tauri.conf.json**
```json
{
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devPath": "http://localhost:5173",
    "distDir": "../dist"
  },
  "package": {
    "productName": "FM24 Scout",
    "version": "1.0.0"
  },
  "tauri": {
    "allowlist": {
      "all": false,
      "shell": {
        "all": false,
        "open": true
      },
      "fs": {
        "all": false,
        "readFile": true,
        "writeFile": true,
        "readDir": false,
        "createDir": true,
        "removeDir": false,
        "removeFile": false,
        "renameFile": false,
        "exists": true,
        "scope": ["$APPDATA/*", "$RESOURCE/*", "$HOME/*"]
      },
      "dialog": {
        "all": false,
        "open": true,
        "save": true
      },
      "path": {
        "all": true
      }
    },
    "bundle": {
      "active": true,
      "targets": "all",
      "identifier": "com.fm24scout.app",
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/128x128@2x.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ],
      "resources": ["../data/roles.json"]
    },
    "security": {
      "csp": null
    },
    "windows": [
      {
        "title": "FM24 Scout",
        "width": 1400,
        "height": 900,
        "minWidth": 1000,
        "minHeight": 600,
        "center": true,
        "resizable": true,
        "fullscreen": false
      }
    ]
  }
}
```

#### 2. Main Rust File

**src-tauri/src/main.rs**
```rust
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod data;

use commands::{file_import, calculations};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            file_import::import_file,
            file_import::select_file,
            calculations::calculate_scores_batch,
            calculations::find_best_roles,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

#### 3. Data Structures

**src-tauri/src/data/mod.rs**
```rust
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Player {
    #[serde(rename = "Name")]
    pub name: String,
    
    #[serde(rename = "Age")]
    pub age: Option<f32>,
    
    #[serde(rename = "Club")]
    pub club: Option<String>,
    
    #[serde(rename = "Nationality")]
    pub nationality: Option<String>,
    
    #[serde(rename = "Position")]
    pub position: Option<String>,
    
    #[serde(flatten)]
    pub attributes: HashMap<String, f32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Role {
    #[serde(rename = "Role")]
    pub name: String,
    
    #[serde(rename = "RoleCode")]
    pub code: String,
    
    #[serde(flatten)]
    pub weights: HashMap<String, u8>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PlayerWithScores {
    #[serde(flatten)]
    pub player: Player,
    
    pub role_scores: HashMap<String, f32>,
    pub best_role: Option<RoleScore>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RoleScore {
    pub code: String,
    pub name: String,
    pub score: f32,
}

// Load roles data at compile time
pub const ROLES_JSON: &str = include_str!("../../../data/roles.json");

lazy_static::lazy_static! {
    pub static ref ROLES: Vec<Role> = {
        serde_json::from_str(ROLES_JSON).expect("Failed to parse roles.json")
    };
}
```

#### 4. File Import Commands

**src-tauri/src/commands/file_import.rs**
```rust
use crate::data::Player;
use std::fs;
use tauri::command;

#[command]
pub async fn select_file() -> Result<Option<String>, String> {
    use tauri::api::dialog::blocking::FileDialogBuilder;
    
    let file_path = FileDialogBuilder::new()
        .add_filter("Player Data", &["html", "htm", "csv"])
        .pick_file();
    
    Ok(file_path.map(|p| p.to_string_lossy().to_string()))
}

#[command]
pub async fn import_file(file_path: String) -> Result<Vec<Player>, String> {
    let content = fs::read_to_string(&file_path)
        .map_err(|e| format!("Failed to read file: {}", e))?;
    
    if file_path.ends_with(".csv") {
        parse_csv(&content)
    } else if file_path.ends_with(".html") || file_path.ends_with(".htm") {
        parse_html(&content)
    } else {
        Err("Unsupported file format".to_string())
    }
}

fn parse_csv(content: &str) -> Result<Vec<Player>, String> {
    let mut reader = csv::Reader::from_reader(content.as_bytes());
    let mut players = Vec::new();
    
    for result in reader.deserialize() {
        let player: Player = result.map_err(|e| format!("CSV parse error: {}", e))?;
        
        // Skip invalid entries
        if !player.name.is_empty() && player.name != "-" {
            players.push(player);
        }
    }
    
    if players.len() > 20000 {
        return Err(format!("Too many players: {} (max 20,000)", players.len()));
    }
    
    Ok(players)
}

fn parse_html(content: &str) -> Result<Vec<Player>, String> {
    use scraper::{Html, Selector};
    
    let document = Html::parse_document(content);
    let table_selector = Selector::parse("table").unwrap();
    let row_selector = Selector::parse("tr").unwrap();
    let cell_selector = Selector::parse("td, th").unwrap();
    
    let table = document
        .select(&table_selector)
        .next()
        .ok_or("No table found in HTML")?;
    
    let mut rows = table.select(&row_selector);
    
    // Get headers
    let header_row = rows.next().ok_or("No header row found")?;
    let headers: Vec<String> = header_row
        .select(&cell_selector)
        .map(|cell| {
            let text = cell.text().collect::<String>().trim().to_string();
            if text == "Nat" { "Nationality".to_string() } else { text }
        })
        .collect();
    
    // Parse players
    let mut players = Vec::new();
    
    for row in rows {
        let cells: Vec<String> = row
            .select(&cell_selector)
            .map(|cell| cell.text().collect::<String>().trim().to_string())
            .collect();
        
        if cells.len() != headers.len() {
            continue;
        }
        
        let mut attributes = HashMap::new();
        let mut name = String::new();
        
        for (i, header) in headers.iter().enumerate() {
            let value = parse_attribute_value(&cells[i]);
            
            if header == "Name" {
                name = cells[i].clone();
            } else {
                attributes.insert(header.clone(), value);
            }
        }
        
        if !name.is_empty() && name != "-" {
            players.push(Player {
                name,
                age: attributes.get("Age").copied(),
                club: attributes.get("Club").map(|_| cells[headers.iter().position(|h| h == "Club").unwrap()].clone()),
                nationality: attributes.get("Nationality").map(|_| cells[headers.iter().position(|h| h == "Nationality").unwrap()].clone()),
                position: attributes.get("Position").map(|_| cells[headers.iter().position(|h| h == "Position").unwrap()].clone()),
                attributes,
            });
        }
    }
    
    if players.len() > 20000 {
        return Err(format!("Too many players: {} (max 20,000)", players.len()));
    }
    
    Ok(players)
}

fn parse_attribute_value(value: &str) -> f32 {
    if value == "-" || value.is_empty() {
        return 0.0;
    }
    
    // Handle range values
    if value.contains('-') && !value.starts_with('-') {
        let parts: Vec<&str> = value.split('-').collect();
        if parts.len() == 2 {
            if let (Ok(min), Ok(max)) = (parts[0].parse::<f32>(), parts[1].parse::<f32>()) {
                return (min + max) / 2.0;
            }
        }
    }
    
    value.parse::<f32>().unwrap_or(0.0)
}
```

#### 5. Calculation Commands

**src-tauri/src/commands/calculations.rs**
```rust
use crate::data::{Player, PlayerWithScores, Role, RoleScore, ROLES};
use std::collections::HashMap;
use tauri::command;

#[command]
pub fn calculate_scores_batch(
    players: Vec<Player>,
    selected_role_codes: Vec<String>,
) -> Result<Vec<PlayerWithScores>, String> {
    let selected_roles: Vec<&Role> = ROLES
        .iter()
        .filter(|r| selected_role_codes.contains(&r.code))
        .collect();
    
    if selected_roles.is_empty() {
        return Err("No valid roles selected".to_string());
    }
    
    let results: Vec<PlayerWithScores> = players
        .into_iter()
        .map(|player| {
            let mut role_scores = HashMap::new();
            let mut best_role: Option<RoleScore> = None;
            
            for role in &selected_roles {
                let score = calculate_player_score(&player, role);
                role_scores.insert(role.code.clone(), score);
                
                if best_role.is_none() || score > best_role.as_ref().unwrap().score {
                    best_role = Some(RoleScore {
                        code: role.code.clone(),
                        name: role.name.clone(),
                        score,
                    });
                }
            }
            
            PlayerWithScores {
                player,
                role_scores,
                best_role,
            }
        })
        .collect();
    
    Ok(results)
}

#[command]
pub fn find_best_roles(players: Vec<Player>) -> Result<Vec<PlayerWithScores>, String> {
    let results: Vec<PlayerWithScores> = players
        .into_iter()
        .map(|player| {
            let mut best_role: Option<RoleScore> = None;
            let mut all_scores = HashMap::new();
            
            for role in ROLES.iter() {
                let score = calculate_player_score(&player, role);
                all_scores.insert(role.code.clone(), score);
                
                if best_role.is_none() || score > best_role.as_ref().unwrap().score {
                    best_role = Some(RoleScore {
                        code: role.code.clone(),
                        name: role.name.clone(),
                        score,
                    });
                }
            }
            
            PlayerWithScores {
                player,
                role_scores: all_scores,
                best_role,
            }
        })
        .collect();
    
    Ok(results)
}

fn calculate_player_score(player: &Player, role: &Role) -> f32 {
    let mut total_score = 0.0;
    let mut weight_sum = 0.0;
    
    for (attr, weight) in &role.weights {
        if *weight == 0 || attr == "Role" || attr == "RoleCode" {
            continue;
        }
        
        let player_value = player.attributes.get(attr).unwrap_or(&0.0);
        let normalized_value = (player_value / 20.0).min(1.0);
        
        total_score += normalized_value * (*weight as f32);
        weight_sum += *weight as f32;
    }
    
    if weight_sum > 0.0 {
        (total_score / weight_sum) * 100.0
    } else {
        0.0
    }
}
```

### Deliverables
- ✅ Tauri configuration complete
- ✅ Rust data structures defined
- ✅ File import with native dialog
- ✅ High-performance calculations
- ✅ HTML/CSV parsing in Rust
- ✅ Error handling and validation

### Success Criteria
- Native file dialog works
- Rust calculations 3x faster than JS
- Handles 20,000 players smoothly
- Proper error messages
- Memory efficient

---

## Agent 5: Integration & Testing Specialist

### Role
Connect all components, implement testing, optimize performance, and ensure the application is production-ready.

### Responsibilities

#### 1. Integration Layer

**src/lib/tauri-api.ts**
```typescript
import { invoke } from '@tauri-apps/api/tauri'
import { open, save } from '@tauri-apps/api/dialog'
import { writeTextFile } from '@tauri-apps/api/fs'
import { Player, PlayerWithScores } from '@/types'

export class TauriAPI {
  static async selectFile(): Promise<string | null> {
    const selected = await open({
      multiple: false,
      filters: [{
        name: 'Player Data',
        extensions: ['html', 'htm', 'csv']
      }]
    })
    
    return selected as string | null
  }
  
  static async importFile(filePath: string): Promise<Player[]> {
    return await invoke('import_file', { filePath })
  }
  
  static async calculateScores(
    players: Player[],
    selectedRoleCodes: string[]
  ): Promise<PlayerWithScores[]> {
    return await invoke('calculate_scores_batch', {
      players,
      selectedRoleCodes
    })
  }
  
  static async exportFile(content: string, defaultName: string): Promise<void> {
    const filePath = await save({
      defaultPath: defaultName,
      filters: [{
        name: 'CSV',
        extensions: ['csv']
      }, {
        name: 'JSON',
        extensions: ['json']
      }]
    })
    
    if (filePath) {
      await writeTextFile(filePath, content)
    }
  }
}
```

#### 2. Performance Optimization

**src/hooks/use-virtual-table.ts**
```typescript
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

export function useVirtualTable<T>(
  data: T[],
  estimateSize: number = 35
) {
  const parentRef = useRef<HTMLDivElement>(null)
  
  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: 10,
  })
  
  return {
    parentRef,
    virtualizer,
    virtualItems: virtualizer.getVirtualItems(),
    totalSize: virtualizer.getTotalSize(),
  }
}
```

#### 3. Testing Setup

**src/__tests__/data-manager.test.ts**
```typescript
import { describe, it, expect } from 'vitest'
import { DataManager } from '@/lib/data-manager'

describe('DataManager', () => {
  const manager = new DataManager()
  
  describe('calculatePlayerScore', () => {
    it('should calculate correct score for a player', () => {
      const player = {
        Name: 'Test Player',
        Fin: 18,
        Pac: 16,
        Acc: 15,
        // ... other attributes
      }
      
      const score = manager.calculatePlayerScore(player, 'afa')
      expect(score).toBeGreaterThan(0)
      expect(score).toBeLessThanOrEqual(100)
    })
    
    it('should return 0 for invalid role code', () => {
      const player = { Name: 'Test' }
      const score = manager.calculatePlayerScore(player, 'invalid')
      expect(score).toBe(0)
    })
  })
})
```

**src/__tests__/file-parser.test.ts**
```typescript
import { describe, it, expect } from 'vitest'
import { FileParser } from '@/lib/file-parser'

describe('FileParser', () => {
  const parser = new FileParser()
  
  describe('parseAttributeValue', () => {
    it('should parse range values correctly', () => {
      expect(parser['parseAttributeValue']('14-16')).toBe(15)
    })
    
    it('should handle missing values', () => {
      expect(parser['parseAttributeValue']('-')).toBe(0)
      expect(parser['parseAttributeValue']('')).toBe(0)
    })
    
    it('should parse normal numbers', () => {
      expect(parser['parseAttributeValue']('18')).toBe(18)
    })
  })
})
```

#### 4. Error Boundary

**src/components/ErrorBoundary.tsx**
```tsx
import { Component, ErrorInfo, ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto p-6">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <Button
                onClick={() => {
                  this.setState({ hasError: false, error: null })
                  window.location.reload()
                }}
              >
                Reload Application
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
```

#### 5. Performance Monitoring

**src/lib/performance.ts**
```typescript
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map()
  
  start(label: string) {
    this.marks.set(label, performance.now())
  }
  
  end(label: string): number {
    const start = this.marks.get(label)
    if (!start) return 0
    
    const duration = performance.now() - start
    this.marks.delete(label)
    
    console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`)
    return duration
  }
  
  async measure<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.start(label)
    try {
      const result = await fn()
      this.end(label)
      return result
    } catch (error) {
      this.end(label)
      throw error
    }
  }
}

export const perfMonitor = new PerformanceMonitor()
```

### Deliverables
- ✅ Tauri API integration layer
- ✅ Virtual scrolling for large datasets
- ✅ Unit tests for core functionality
- ✅ Error boundary for graceful failures
- ✅ Performance monitoring utilities
- ✅ Production build configuration

### Success Criteria
- All tests pass (>80% coverage)
- <2s load time for 20k players
- Smooth 60fps scrolling
- Graceful error handling
- <50MB bundle size

---

## Agent Coordination Protocol

### Communication Flow
```
1. Setup Agent → Creates foundation
2. UI Agent → Builds interface components
3. Data Agent → Implements business logic
4. Backend Agent → Adds native capabilities
5. Integration Agent → Connects and tests everything
```

### Handoff Points
- Setup Agent delivers configured project to UI Agent
- UI Agent provides component interfaces to Data Agent
- Data Agent defines types for Backend Agent
- Backend Agent exposes commands for Integration Agent
- Integration Agent validates entire system

### Success Metrics
- ✅ All agents complete their deliverables
- ✅ Integration tests pass
- ✅ Performance targets met
- ✅ User acceptance criteria satisfied
- ✅ Production build successful

## Implementation Timeline

### Day 1: Foundation
- Setup Agent: 4 hours
- Initial testing: 1 hour

### Day 2: UI Development
- UI Agent: 6 hours
- Component testing: 2 hours

### Day 3: Data Layer
- Data Agent: 6 hours
- Unit testing: 2 hours

### Day 4: Backend
- Backend Agent: 6 hours
- Integration: 2 hours

### Day 5: Polish
- Integration Agent: 4 hours
- Testing & optimization: 4 hours

### Day 6: Release
- Final testing: 2 hours
- Build & package: 2 hours
- Documentation: 2 hours

Total: 48 hours of focused development
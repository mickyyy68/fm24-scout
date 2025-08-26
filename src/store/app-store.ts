import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Player, Role } from '@/types'
import { DataManager } from '@/lib/data-manager'
import { OptimizedDataManager } from '@/lib/data-manager-optimized'

// Zoom configuration constants
const ZOOM_LIMITS = {
  MIN: 50,
  MAX: 200,
  DEFAULT: 100,
} as const

interface AppState {
  // State
  players: Player[]
  selectedRoles: Role[]
  visibleRoleColumns: string[] // Role codes that should be shown in table
  isLoading: boolean
  isCalculating: boolean
  calculationProgress: number
  tableZoom: number // Zoom level percentage (50-200)
  
  // Actions
  setPlayers: (players: Player[]) => void
  addRole: (role: Role) => void
  removeRole: (code: string) => void
  clearRoles: () => void
  toggleRoleColumnVisibility: (code: string) => void
  setVisibleRoleColumns: (codes: string[]) => void
  calculateScores: () => Promise<void>
  clearAll: () => void
  setTableZoom: (zoom: number) => void
}

const dataManager = new DataManager()
const optimizedDataManager = new OptimizedDataManager()

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      players: [],
      selectedRoles: [],
      visibleRoleColumns: [],
      isLoading: false,
      isCalculating: false,
      calculationProgress: 0,
      tableZoom: ZOOM_LIMITS.DEFAULT,

      setPlayers: (players) => {
        set({ players })
      },

      addRole: (role) => {
        set((state) => ({
          selectedRoles: [...state.selectedRoles, role],
          // Automatically make new roles visible
          visibleRoleColumns: [...state.visibleRoleColumns, role.code]
        }))
      },

      removeRole: (code) => {
        set((state) => ({
          selectedRoles: state.selectedRoles.filter(r => r.code !== code),
          // Also remove from visible columns
          visibleRoleColumns: state.visibleRoleColumns.filter(c => c !== code)
        }))
      },

      clearRoles: () => {
        set({ selectedRoles: [], visibleRoleColumns: [] })
      },

      toggleRoleColumnVisibility: (code) => {
        set((state) => ({
          visibleRoleColumns: state.visibleRoleColumns.includes(code)
            ? state.visibleRoleColumns.filter(c => c !== code)
            : [...state.visibleRoleColumns, code]
        }))
      },

      setVisibleRoleColumns: (codes) => {
        set({ visibleRoleColumns: codes })
      },

      calculateScores: async () => {
        set({ isCalculating: true, calculationProgress: 0 })
        
        const { players, selectedRoles } = get()
        
        try {
          // Use optimized manager with Web Worker
          const playersWithScores = await optimizedDataManager.calculateAllScoresOptimized(
            players,
            selectedRoles.map(r => r.code),
            (progress) => set({ calculationProgress: progress })
          )
          
          set({ 
            players: playersWithScores,
            isCalculating: false,
            calculationProgress: 100
          })
        } catch (error) {
          console.error('Score calculation failed:', error)
          // Fallback to original synchronous calculation
          const playersWithScores = await dataManager.calculateAllScores(
            players,
            selectedRoles.map(r => r.code)
          )
          
          set({ 
            players: playersWithScores,
            isCalculating: false,
            calculationProgress: 100
          })
        }
      },

      clearAll: () => {
        set({
          players: [],
          selectedRoles: [],
          visibleRoleColumns: [],
          isLoading: false,
          isCalculating: false
        })
      },

      setTableZoom: (zoom) => {
        // Validate input
        if (typeof zoom !== 'number' || isNaN(zoom) || !isFinite(zoom)) {
          console.warn('Invalid zoom value:', zoom)
          return
        }
        // Clamp zoom within limits
        const clampedZoom = Math.max(ZOOM_LIMITS.MIN, Math.min(ZOOM_LIMITS.MAX, zoom))
        set({ tableZoom: clampedZoom })
      }
    }),
    {
      name: 'fm24-scout-storage',
      partialize: (state) => ({
        selectedRoles: state.selectedRoles,
        tableZoom: state.tableZoom
      })
    }
  )
)
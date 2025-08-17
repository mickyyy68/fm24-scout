import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Player, Role } from '@/types'
import { DataManager } from '@/lib/data-manager'

interface AppState {
  // State
  players: Player[]
  selectedRoles: Role[]
  visibleRoleColumns: string[] // Role codes that should be shown in table
  isLoading: boolean
  isCalculating: boolean
  
  // Actions
  setPlayers: (players: Player[]) => void
  addRole: (role: Role) => void
  removeRole: (code: string) => void
  clearRoles: () => void
  toggleRoleColumnVisibility: (code: string) => void
  setVisibleRoleColumns: (codes: string[]) => void
  calculateScores: () => Promise<void>
  clearAll: () => void
}

const dataManager = new DataManager()

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      players: [],
      selectedRoles: [],
      visibleRoleColumns: [],
      isLoading: false,
      isCalculating: false,

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
          visibleRoleColumns: [],
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
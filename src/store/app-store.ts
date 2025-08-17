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
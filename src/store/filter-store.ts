import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { FilterPreset, FilterPresetConfig, QueryGroup } from '@/types'

interface FilterState {
  presets: FilterPreset[]
  selectedPresetId?: string
  currentQuery: QueryGroup | null

  // Actions
  setQuery: (query: QueryGroup | null) => void
  addPreset: (name: string, config: FilterPresetConfig) => string // returns id
  updatePreset: (id: string, patch: Partial<FilterPreset> | { config: Partial<FilterPresetConfig> }) => void
  removePreset: (id: string) => void
  duplicatePreset: (id: string) => string | null
  renamePreset: (id: string, name: string) => void
  selectPreset: (id?: string) => void
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      presets: [],
      selectedPresetId: undefined,
      currentQuery: null,

      setQuery: (query) => set({ currentQuery: query }),

      addPreset: (name, config) => {
        const id = uuidv4()
        const now = new Date().toISOString()
        const preset: FilterPreset = {
          id,
          name,
          createdAt: now,
          updatedAt: now,
          config,
        }
        set((state) => ({ presets: [preset, ...state.presets], selectedPresetId: id }))
        return id
      },

      updatePreset: (id, patch) => {
        set((state) => ({
          presets: state.presets.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...('config' in patch ? { config: { ...p.config, ...(patch as any).config } } : patch),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }))
      },

      removePreset: (id) => {
        set((state) => ({
          presets: state.presets.filter((p) => p.id !== id),
          selectedPresetId: state.selectedPresetId === id ? undefined : state.selectedPresetId,
        }))
      },

      duplicatePreset: (id) => {
        const src = get().presets.find((p) => p.id === id)
        if (!src) return null
        const newId = uuidv4()
        const now = new Date().toISOString()
        const copy: FilterPreset = {
          ...src,
          id: newId,
          name: `${src.name} (copy)`,
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({ presets: [copy, ...state.presets], selectedPresetId: newId }))
        return newId
      },

      renamePreset: (id, name) => {
        set((state) => ({
          presets: state.presets.map((p) => (p.id === id ? { ...p, name, updatedAt: new Date().toISOString() } : p)),
        }))
      },

      selectPreset: (id) => set({ selectedPresetId: id }),
    }),
    {
      name: 'fm24-filter-storage',
      partialize: (state) => ({
        presets: state.presets,
        selectedPresetId: state.selectedPresetId,
        currentQuery: state.currentQuery,
      }),
    }
  )
)


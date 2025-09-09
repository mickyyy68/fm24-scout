import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { RolePreset, RolePresetConfig } from '@/types'

interface RolePresetState {
  rolePresets: RolePreset[]
  selectedRolePresetId?: string

  addRolePreset: (name: string, config: RolePresetConfig) => string
  updateRolePreset: (id: string, patch: Partial<RolePreset> | { config: Partial<RolePresetConfig> }) => void
  removeRolePreset: (id: string) => void
  duplicateRolePreset: (id: string) => string | null
  renameRolePreset: (id: string, name: string) => void
  selectRolePreset: (id?: string) => void
}

export const useRolePresetStore = create<RolePresetState>()(
  persist(
    (set, get) => ({
      rolePresets: [],
      selectedRolePresetId: undefined,

      addRolePreset: (name, config) => {
        const id = uuidv4()
        const now = new Date().toISOString()
        const preset: RolePreset = {
          id,
          name,
          createdAt: now,
          updatedAt: now,
          config,
        }
        set((state) => ({ rolePresets: [preset, ...state.rolePresets], selectedRolePresetId: id }))
        return id
      },

      updateRolePreset: (id, patch) => {
        set((state) => ({
          rolePresets: state.rolePresets.map((p) =>
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

      removeRolePreset: (id) => {
        set((state) => ({
          rolePresets: state.rolePresets.filter((p) => p.id !== id),
          selectedRolePresetId: state.selectedRolePresetId === id ? undefined : state.selectedRolePresetId,
        }))
      },

      duplicateRolePreset: (id) => {
        const src = get().rolePresets.find((p) => p.id === id)
        if (!src) return null
        const newId = uuidv4()
        const now = new Date().toISOString()
        const copy: RolePreset = {
          ...src,
          id: newId,
          name: `${src.name} (copy)`,
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({ rolePresets: [copy, ...state.rolePresets], selectedRolePresetId: newId }))
        return newId
      },

      renameRolePreset: (id, name) => {
        set((state) => ({
          rolePresets: state.rolePresets.map((p) => (p.id === id ? { ...p, name, updatedAt: new Date().toISOString() } : p)),
        }))
      },

      selectRolePreset: (id) => set({ selectedRolePresetId: id }),
    }),
    {
      name: 'fm24-role-presets-storage',
      partialize: (state) => ({
        rolePresets: state.rolePresets,
        selectedRolePresetId: state.selectedRolePresetId,
      }),
    }
  )
)


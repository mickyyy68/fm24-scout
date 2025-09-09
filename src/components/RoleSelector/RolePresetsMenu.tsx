import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Info, Save, Trash2, Copy, Check } from 'lucide-react'
import { useAppStore } from '@/store/app-store'
import { useRolePresetStore } from '@/store/role-preset-store'
import type { Role } from '@/types'
import { DataManager } from '@/lib/data-manager'

const dataManager = new DataManager()

export function RolePresetsMenu() {
  const { selectedRoles, visibleRoleColumns, addRole, clearRoles, setVisibleRoleColumns } = useAppStore()
  const { rolePresets, selectedRolePresetId, addRolePreset, removeRolePreset, duplicateRolePreset, selectRolePreset, renameRolePreset } = useRolePresetStore()
  const [name, setName] = useState('')

  const selectedCodes = useMemo(() => selectedRoles.map(r => r.code), [selectedRoles])

  const saveCurrent = () => {
    const id = addRolePreset(name || 'Roles Preset', {
      selectedRoleCodes: selectedCodes,
      visibleRoleColumnCodes: visibleRoleColumns,
    })
    setName('')
    selectRolePreset(id)
  }

  const applyPreset = (id: string) => {
    const preset = rolePresets.find(p => p.id === id)
    if (!preset) return
    const { selectedRoleCodes, visibleRoleColumnCodes } = preset.config
    // Replace selected roles
    clearRoles()
    // Map codes to Role objects using DataManager
    const allRoles = dataManager.getAllRoles()
    const roleMap = new Map(allRoles.map(r => [r.code, r] as const))
    selectedRoleCodes.forEach(code => {
      const role = roleMap.get(code)
      if (role) addRole(role as Role)
    })
    // Only keep visible columns that are in the selected roles
    const visibleFiltered = visibleRoleColumnCodes.filter(code => selectedRoleCodes.includes(code))
    setVisibleRoleColumns(visibleFiltered)
    selectRolePreset(id)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Open role presets menu">
          Role Presets
          {selectedRolePresetId && (
            <Badge variant="secondary" className="ml-2">
              {rolePresets.find(p => p.id === selectedRolePresetId)?.name || 'Active'}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 p-4 space-y-3">
        <div className="text-xs text-muted-foreground flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5" />
          <p>
            Role presets capture your selected roles and which of their columns are visible in the table.
          </p>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">Save current roles as preset</div>
          <div className="flex gap-2">
            <Input placeholder="Preset name" value={name} onChange={(e) => setName(e.target.value)} />
            <Button size="sm" onClick={saveCurrent}><Save className="h-4 w-4 mr-1"/>Save</Button>
          </div>
        </div>
        <div className="h-px bg-border" />
        <div className="space-y-2 max-h-80 overflow-y-auto">
          <div className="text-sm font-medium">Your role presets</div>
          {rolePresets.length === 0 && (
            <div className="text-sm text-muted-foreground">
              No role presets yet. Save your current role selection to reuse later.
            </div>
          )}
          {rolePresets.map((p) => (
            <div key={p.id} className="flex items-center gap-2 p-2 rounded hover:bg-accent/50">
              <button className="text-left flex-1" onClick={() => applyPreset(p.id)}>
                <div className="font-medium text-sm">{p.name}</div>
                <div className="text-xs text-muted-foreground">{new Date(p.updatedAt).toLocaleString()}</div>
              </button>
              <Button variant="ghost" size="icon" title="Apply" onClick={() => applyPreset(p.id)}>
                <Check className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Duplicate" onClick={() => duplicateRolePreset(p.id)}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Delete" onClick={() => removeRolePreset(p.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


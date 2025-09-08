import { useState } from 'react'
import { Table } from '@tanstack/react-table'
import { Player, FilterPreset, FilterPresetConfig } from '@/types'
import { useFilterStore } from '@/store/filter-store'
import { capturePresetFromTable, applyPresetToTable } from '@/lib/filter-presets'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Save, Trash2, Copy, Info, Check } from 'lucide-react'

interface PresetsMenuProps {
  table: Table<Player>
  globalText: string
  setGlobalText: (v: string) => void
  pageSize: number
  setPageSize: (n: number) => void
}

export function PresetsMenu({ table, globalText, setGlobalText, pageSize, setPageSize }: PresetsMenuProps) {
  const { presets, selectedPresetId, addPreset, removePreset, duplicatePreset, selectPreset, currentQuery, setQuery } = useFilterStore()
  const [name, setName] = useState('')

  const saveCurrent = () => {
    const cfg: FilterPresetConfig = capturePresetFromTable(table, { globalText, pageSize, queryGroup: currentQuery })
    const id = addPreset(name || 'Preset', cfg)
    setName('')
    selectPreset(id)
  }

  const applyPreset = (preset: FilterPreset) => {
    applyPresetToTable(table, preset.config, { setGlobalText, setPageSize })
    setQuery(preset.config.queryGroup ?? null)
    selectPreset(preset.id)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          title="Presets save search, filters, column visibility, sorting, page size, and query so you can restore them later."
          aria-label="Open presets menu"
        >
          Presets
          {selectedPresetId && <Badge variant="secondary" className="ml-2">{presets.find(p => p.id === selectedPresetId)?.name || 'Active'}</Badge>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 p-4 space-y-3">
        <div className="text-xs text-muted-foreground flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5" />
          <p>
            Presets capture your current search, column filters/visibility, sorting, page size, and advanced query so you can quickly restore them later.
          </p>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">Save current as preset</div>
          <div className="flex gap-2">
            <Input placeholder="Preset name" value={name} onChange={(e) => setName(e.target.value)} />
            <Button size="sm" onClick={saveCurrent}><Save className="h-4 w-4 mr-1"/>Save</Button>
          </div>
        </div>
        <div className="h-px bg-border" />
        <div className="space-y-2 max-h-80 overflow-y-auto">
          <div className="text-sm font-medium">Your presets</div>
          {presets.length === 0 && (
            <div className="text-sm text-muted-foreground">
              No presets yet. Presets let you store the current table setup and apply it later.
            </div>
          )}
          {presets.map((p) => (
            <div key={p.id} className="flex items-center gap-2 p-2 rounded hover:bg-accent/50">
              <button className="text-left flex-1" onClick={() => applyPreset(p)}>
                <div className="font-medium text-sm">{p.name}</div>
                <div className="text-xs text-muted-foreground">{new Date(p.updatedAt).toLocaleString()}</div>
              </button>
              <Button variant="ghost" size="icon" title="Apply" onClick={() => applyPreset(p)}>
                <Check className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Duplicate" onClick={() => duplicatePreset(p.id)}>
                <Copy className="h-4 w-4" />
              </Button>
              {/* Copy/Download JSON removed */}
              <Button variant="ghost" size="icon" title="Delete" onClick={() => removePreset(p.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

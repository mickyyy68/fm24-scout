import { useState } from 'react'
import { Table } from '@tanstack/react-table'
import { Player, FilterPreset, FilterPresetConfig } from '@/types'
import { useFilterStore } from '@/store/filter-store'
import { capturePresetFromTable, applyPresetToTable } from '@/lib/filter-presets'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Save, Pencil, Trash2, Copy, Download } from 'lucide-react'

interface PresetsMenuProps {
  table: Table<Player>
  globalText: string
  setGlobalText: (v: string) => void
  pageSize: number
  setPageSize: (n: number) => void
}

export function PresetsMenu({ table, globalText, setGlobalText, pageSize, setPageSize }: PresetsMenuProps) {
  const { presets, selectedPresetId, addPreset, removePreset, duplicatePreset, renamePreset, selectPreset, currentQuery, setQuery } = useFilterStore()
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

  const copyJSON = async (preset: FilterPreset) => {
    await navigator.clipboard.writeText(JSON.stringify(preset, null, 2))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Presets
          {selectedPresetId && <Badge variant="secondary" className="ml-2">{presets.find(p => p.id === selectedPresetId)?.name || 'Active'}</Badge>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 p-4 space-y-3">
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
            <div className="text-sm text-muted-foreground">No presets yet</div>
          )}
          {presets.map((p) => (
            <div key={p.id} className="flex items-center gap-2 p-2 rounded hover:bg-accent/50">
              <button className="text-left flex-1" onClick={() => applyPreset(p)}>
                <div className="font-medium text-sm">{p.name}</div>
                <div className="text-xs text-muted-foreground">{new Date(p.updatedAt).toLocaleString()}</div>
              </button>
              <Button variant="ghost" size="icon" title="Duplicate" onClick={() => duplicatePreset(p.id)}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Rename" onClick={() => {
                const newName = prompt('New name', p.name)
                if (newName) renamePreset(p.id, newName)
              }}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Copy JSON" onClick={() => copyJSON(p)}>
                <Download className="h-4 w-4" />
              </Button>
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

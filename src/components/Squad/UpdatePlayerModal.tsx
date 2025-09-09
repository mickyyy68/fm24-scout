import { useMemo, useState } from 'react'
import { Player, POSITION_DISPLAY_NAMES } from '@/types'
import { useSquadStore } from '@/store/squad-store'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataManager } from '@/lib/data-manager'
import { cn } from '@/lib/utils'

const dataManager = new DataManager()

interface UpdatePlayerModalProps {
  player: Player | null
  open: boolean
  onClose: () => void
}

type DiffItem = {
  key: string
  oldValue: number | string | undefined
  newValue: number | string | undefined
  delta?: number
}

const NUMERIC_ATTRS: (keyof Player)[] = [
  // Technical
  'Cor','Cro','Dri','Fin','Fir','Fla','Hea','Lon','Mar','Pas','Tck','Tec',
  // Mental
  'Agg','Ant','Bra','Com','Cmp','Cnt','Dec','Det','Ldr','OtB','Pos','Tea','Vis','Wor',
  // Physical
  'Acc','Agi','Bal','Jum','Pac','Sta','Str',
  // GK
  '1v1','Aer','Cmd','Han','Kic','Ref','TRO','Thr',
]

export function UpdatePlayerModal({ player, open, onClose }: UpdatePlayerModalProps) {
  const { findPositionsByPlayerName, updatePlayerFromLatest } = useSquadStore()

  const entries = useMemo(() => {
    if (!player) return []
    return findPositionsByPlayerName(player.Name)
  }, [player, findPositionsByPlayerName])

  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null)

  const selectedEntry = useMemo(() => {
    if (!selectedPositionId) return entries[0]
    return entries.find(e => e.position.id === selectedPositionId)
  }, [entries, selectedPositionId])

  const diffs: DiffItem[] = useMemo(() => {
    if (!player || !selectedEntry) return []
    const current = selectedEntry.player
    const items: DiffItem[] = []
    NUMERIC_ATTRS.forEach((k) => {
      const oldVal = (current as any)[k] as number | undefined
      const newVal = (player as any)[k] as number | undefined
      if (typeof oldVal === 'number' && typeof newVal === 'number' && oldVal !== newVal) {
        items.push({ key: String(k), oldValue: oldVal, newValue: newVal, delta: newVal - oldVal })
      }
    })
    // Optional meta fields
    const meta: (keyof Player)[] = ['Age', 'Club', 'Value', 'Wage']
    meta.forEach((k) => {
      const oldVal = (current as any)[k]
      const newVal = (player as any)[k]
      if (oldVal !== newVal) {
        items.push({ key: String(k), oldValue: oldVal, newValue: newVal })
      }
    })
    return items
  }, [player, selectedEntry])

  const projectedScore = useMemo(() => {
    if (!player || !selectedEntry) return undefined
    return Math.round(dataManager.calculatePlayerScore(player, selectedEntry.position.roleCode))
  }, [player, selectedEntry])
  const currentScore = useMemo(() => {
    if (!selectedEntry) return undefined
    const s = Number(selectedEntry.player.positionScore)
    return Number.isFinite(s) ? Math.round(s) : undefined
  }, [selectedEntry])

  if (!player) return null

  const multiple = entries.length > 1

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Update Player Statistics</DialogTitle>
          <DialogDescription>
            Refresh {player.Name}'s attributes from the latest dataset.
          </DialogDescription>
        </DialogHeader>

        {entries.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            This player is not in your squad.
          </div>
        ) : (
          <div className="space-y-4">
            {/* Position selector when needed */}
            {multiple && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Position:</span>
                <Select value={selectedPositionId ?? entries[0].position.id} onValueChange={setSelectedPositionId}>
                  <SelectTrigger className="h-8 w-[240px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {entries.map(({ position }) => (
                      <SelectItem key={position.id} value={position.id}>
                        {POSITION_DISPLAY_NAMES[position.positionType]} — {position.roleName || position.roleCode.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Summary */}
            {selectedEntry && (
              <div className="flex items-center gap-3">
                <Badge variant="secondary">
                  {POSITION_DISPLAY_NAMES[selectedEntry.position.positionType]}
                </Badge>
                <Badge variant="outline">
                  Role: {selectedEntry.position.roleName || selectedEntry.position.roleCode.toUpperCase()}
                </Badge>
                {typeof projectedScore === 'number' && typeof currentScore === 'number' && (
                  <Badge variant="outline">
                    Score: {currentScore}
                    <span className="mx-1">→</span>
                    <span className={cn(projectedScore - currentScore >= 0 ? 'text-primary' : 'text-destructive')}>
                      {projectedScore}
                    </span>
                  </Badge>
                )}
              </div>
            )}

            {/* Diffs list */}
            <ScrollArea className="h-[320px] pr-2">
              {diffs.length === 0 ? (
                <div className="text-sm text-muted-foreground">No changes detected.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {diffs.map((d) => (
                    <div key={d.key} className="flex items-center justify-between gap-2 rounded border p-2 text-sm">
                      <div className="font-medium truncate">{d.key}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{String(d.oldValue)}</span>
                        <span>→</span>
                        <span className={cn(d.delta != null ? (d.delta >= 0 ? 'text-primary' : 'text-destructive') : '')}>
                          {String(d.newValue)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button
                onClick={() => {
                  const entry = selectedEntry || entries[0]
                  if (!entry) return
                  updatePlayerFromLatest(entry.position.id, entry.player.squadId, player)
                  onClose()
                }}
                disabled={entries.length === 0}
              >
                Apply Update
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

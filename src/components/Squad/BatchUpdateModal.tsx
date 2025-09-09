import { useEffect, useMemo, useState } from 'react'
import { useSquadStore } from '@/store/squad-store'
import { useAppStore } from '@/store/app-store'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { POSITION_DISPLAY_NAMES } from '@/types/squad'
import { cn } from '@/lib/utils'
import { RefreshCw } from 'lucide-react'

interface BatchUpdateModalProps {
  open: boolean
  onClose: () => void
}

export function BatchUpdateModal({ open, onClose }: BatchUpdateModalProps) {
  const { players } = useAppStore()
  const {
    pendingUpdates,
    checkForUpdates,
    dismissUpdate,
    applyAllPendingUpdates,
    updatePlayerFromLatest,
  } = useSquadStore()
  const formation = useSquadStore(state => state.formation)

  const [isApplyingAll, setIsApplyingAll] = useState(false)

  // Refresh updates when dialog opens
  useEffect(() => {
    if (open) {
      checkForUpdates(players)
    }
  }, [open, players, checkForUpdates])

  const totalChanges = useMemo(() => pendingUpdates.reduce((acc, u) => acc + u.changes.length, 0), [pendingUpdates])

  const handleApplyOne = (u: typeof pendingUpdates[number]) => {
    const latest = players.find(p => p.Name === u.playerName)
    if (!latest) return
    updatePlayerFromLatest(u.positionId, u.playerId, latest)
    dismissUpdate(u.playerId)
  }

  const handleApplyAll = async () => {
    setIsApplyingAll(true)
    try {
      applyAllPendingUpdates(players)
      onClose()
    } finally {
      setIsApplyingAll(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-primary" />
            Update All Players
          </DialogTitle>
          <DialogDescription>
            {pendingUpdates.length > 0
              ? `${pendingUpdates.length} player(s) have updates · ${totalChanges} change(s)`
              : 'No updates detected with the current dataset.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              This list is compact. Click Apply to update a single player, or Apply All to refresh everyone.
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => checkForUpdates(players)}>
                Refresh
              </Button>
              <Button size="sm" onClick={handleApplyAll} disabled={pendingUpdates.length === 0 || isApplyingAll}>
                Apply All
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[400px] pr-2">
            {pendingUpdates.length === 0 ? (
              <div className="text-sm text-muted-foreground">Nothing to update.</div>
            ) : (
              <div className="space-y-2">
                {pendingUpdates.map((u) => (
                  <div key={u.playerId} className="flex items-center gap-3 rounded border p-2 text-sm">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{u.playerName}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {(() => {
                          const pos = formation.find(p => p.id === u.positionId)
                          if (!pos) return null
                          return (
                            <>
                              <Badge variant="secondary">
                                {POSITION_DISPLAY_NAMES[pos.positionType]}
                              </Badge>
                              <Badge variant="outline">{pos.roleName || pos.roleCode.toUpperCase()}</Badge>
                            </>
                          )
                        })()}
                        <span>{u.changes.length} change(s)</span>
                        <span>
                          Score: {Math.round(u.oldScore)}
                          <span className="mx-1">→</span>
                          <span className={cn(u.newScore - u.oldScore >= 0 ? 'text-primary' : 'text-destructive')}>
                            {Math.round(u.newScore)}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => dismissUpdate(u.playerId)}>Skip</Button>
                      <Button size="sm" onClick={() => handleApplyOne(u)}>Apply</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={handleApplyAll} disabled={pendingUpdates.length === 0 || isApplyingAll}>
              Apply All
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

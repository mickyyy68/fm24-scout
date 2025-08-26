import { useState, useMemo } from 'react'
import { Player, PlayerStatus, POSITION_DISPLAY_NAMES, SquadPosition } from '@/types'
import { useSquadStore } from '@/store/squad-store'
import { DataManager } from '@/lib/data-manager'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { 
  Users,
  TrendingUp,
  Target,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PlayerAssignModalProps {
  player: Player | null
  open: boolean
  onClose: () => void
}

const dataManager = new DataManager()

export function PlayerAssignModal({ player, open, onClose }: PlayerAssignModalProps) {
  const { formation, addPlayerToPosition, isPlayerInSquad } = useSquadStore()
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null)
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>('bought')
  
  // Calculate scores for all positions
  const positionScores = useMemo(() => {
    if (!player) return []
    
    return formation.map(position => {
      const score = dataManager.calculatePlayerScore(player, position.roleCode)
      return {
        position,
        score,
        isOccupied: position.players.length > 0
      }
    }).sort((a, b) => b.score - a.score)
  }, [player, formation])
  
  const bestPosition = positionScores[0]
  const isAlreadyInSquad = player ? isPlayerInSquad(player.Name) : false
  
  const handleAssign = () => {
    if (!player || !selectedPositionId) return
    
    addPlayerToPosition(player, selectedPositionId, playerStatus)
    onClose()
  }
  
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500'
    if (score >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }
  
  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 85) return 'default'
    if (score >= 70) return 'secondary'
    return 'destructive'
  }
  
  if (!player) return null
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Assign {player.Name} to Squad</DialogTitle>
          <DialogDescription>
            Choose a position for the player. Scores are calculated based on the position's tactical role.
          </DialogDescription>
        </DialogHeader>
        
        {isAlreadyInSquad && (
          <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">This player is already in your squad</span>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          {/* Left side - Player info and status */}
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Player Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age:</span>
                  <span>{player.Age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Position:</span>
                  <span>{player.Position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Club:</span>
                  <span>{player.Club}</span>
                </div>
                {player.Value && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Value:</span>
                    <span>{player.Value}</span>
                  </div>
                )}
              </div>
            </Card>
            
            {/* Player Status Selection */}
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Player Status</h3>
              <Select value={playerStatus} onValueChange={(v) => setPlayerStatus(v as PlayerStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bought">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      Bought
                    </div>
                  </SelectItem>
                  <SelectItem value="loan">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      On Loan
                    </div>
                  </SelectItem>
                  <SelectItem value="trial">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      Trial
                    </div>
                  </SelectItem>
                  <SelectItem value="youth">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      Youth Academy
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </Card>
            
            {/* Best Position */}
            {bestPosition && (
              <Card className="p-4 border-primary">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Best Position</h3>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">
                    {POSITION_DISPLAY_NAMES[bestPosition.position.positionType]}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {bestPosition.position.roleName}
                  </div>
                  <Badge className={cn("text-lg", getScoreColor(bestPosition.score))}>
                    Score: {Math.round(bestPosition.score)}
                  </Badge>
                </div>
              </Card>
            )}
          </div>
          
          {/* Right side - Position list */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Available Positions</h3>
              <Badge variant="outline">
                {positionScores.filter(p => !p.isOccupied).length} empty
              </Badge>
            </div>
            
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {positionScores.map(({ position, score, isOccupied }) => (
                  <Card
                    key={position.id}
                    className={cn(
                      "p-3 cursor-pointer transition-all",
                      selectedPositionId === position.id && "border-primary ring-1 ring-primary/20",
                      isOccupied && "opacity-60"
                    )}
                    onClick={() => setSelectedPositionId(position.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="font-medium">
                          {POSITION_DISPLAY_NAMES[position.positionType]}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {position.roleName}
                        </div>
                        {isOccupied && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {position.players.length} player{position.players.length !== 1 ? 's' : ''} assigned
                          </div>
                        )}
                      </div>
                      <div className="text-right space-y-1">
                        <Badge variant={getScoreBadgeVariant(score)}>
                          {Math.round(score)}
                        </Badge>
                        {score === bestPosition?.score && (
                          <div className="flex items-center gap-1 text-xs text-primary">
                            <TrendingUp className="h-3 w-3" />
                            Best fit
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedPositionId ? 
              `Assigning to ${POSITION_DISPLAY_NAMES[formation.find(p => p.id === selectedPositionId)?.positionType || 'GK']}` 
              : 'Select a position to continue'}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssign}
              disabled={!selectedPositionId || isAlreadyInSquad}
            >
              Assign to Position
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
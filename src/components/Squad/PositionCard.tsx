import { SquadPosition, POSITION_DISPLAY_NAMES, SquadPlayer } from '@/types/squad'
import { useSquadStore } from '@/store/squad-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PlayerStatusBadge } from './PlayerStatusBadge'
import { 
  X, 
  ChevronUp, 
  ChevronDown,
  User,
  Edit
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import rolesData from '@/data/roles.json'
import { RoleData } from '@/types'

interface PositionCardProps {
  position: SquadPosition
  onEditPosition?: () => void
  onAddPlayer?: () => void
  className?: string
  /** When true, renders without the outer Card wrapper for embedding */
  bare?: boolean
}

export function PositionCard({ 
  position, 
  onEditPosition: _onEditPosition,
  onAddPlayer,
  className,
  bare = false,
}: PositionCardProps) {
  const { 
    removePlayerFromPosition, 
    reorderPlayersInPosition,
    updatePositionRole,
    updatePlayerStatus
  } = useSquadStore()
  
  const [editingRole, setEditingRole] = useState(false)
  const roles = rolesData as RoleData[]
  
  const handleMovePlayer = (playerId: string, direction: 'up' | 'down') => {
    const currentIndex = position.players.findIndex(p => p.squadId === playerId)
    if (currentIndex === -1) return
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= position.players.length) return
    
    const newOrder = [...position.players]
    const [movedPlayer] = newOrder.splice(currentIndex, 1)
    newOrder.splice(newIndex, 0, movedPlayer)
    
    reorderPlayersInPosition(position.id, newOrder.map(p => p.squadId))
  }
  
  const handleRemovePlayer = (playerId: string) => {
    removePlayerFromPosition(playerId, position.id)
  }
  
  const handleRoleChange = (newRoleCode: string) => {
    updatePositionRole(position.id, newRoleCode)
    setEditingRole(false)
  }
  
  const handleStatusChange = (playerId: string, newStatus: any) => {
    updatePlayerStatus(playerId, position.id, newStatus)
  }
  
  const Container: any = bare ? 'div' : Card
  const HeaderComp: any = bare ? 'div' : CardHeader
  const ContentComp: any = bare ? 'div' : CardContent

  return (
    <Container className={cn("w-full", className)}>
      <HeaderComp className={cn("pb-3", bare ? "p-0" : undefined)}>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">
              {POSITION_DISPLAY_NAMES[position.positionType]}
            </CardTitle>
            <div className="flex items-center gap-2 w-full">
              {editingRole ? (
                <div className="flex items-center gap-2 w-full">
                  <Select value={position.roleCode} onValueChange={handleRoleChange}>
                    <SelectTrigger className="h-7 w-[220px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role.RoleCode} value={role.RoleCode}>
                          {role.Role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="ml-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingRole(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 w-full">
                  <Badge variant="outline" className="text-xs">
                    {position.roleName || (roles.find(r => r.RoleCode === position.roleCode)?.Role ?? position.roleCode.toUpperCase())}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 ml-auto"
                    onClick={() => setEditingRole(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Role
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </HeaderComp>
      
      <ContentComp className={cn("space-y-2", bare ? "p-0" : undefined)}>
        {/* Player List */}
        {position.players.length > 0 ? (
          <div className="space-y-2">
            {position.players.map((player, index) => (
              <PlayerCard
                key={player.squadId}
                player={player}
                index={index}
                isFirst={index === 0}
                isLast={index === position.players.length - 1}
                onMoveUp={() => handleMovePlayer(player.squadId, 'up')}
                onMoveDown={() => handleMovePlayer(player.squadId, 'down')}
                onRemove={() => handleRemovePlayer(player.squadId)}
                onStatusChange={(status) => handleStatusChange(player.squadId, status)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No players assigned</p>
          </div>
        )}
        
        {/* Add Player Button */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onAddPlayer}
        >
          Add Player
        </Button>
      </ContentComp>
    </Container>
  )
}

interface PlayerCardProps {
  player: SquadPlayer
  index: number
  isFirst: boolean
  isLast: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
  onStatusChange: (status: any) => void
}

function PlayerCard({
  player,
  index,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onRemove,
  onStatusChange
}: PlayerCardProps) {
  const [editingStatus, setEditingStatus] = useState(false)
  
  return (
    <div 
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg border",
        index === 0 && "bg-primary/5 border-primary/20"
      )}
    >
      {/* Order number */}
      <div className="text-sm font-bold text-muted-foreground w-6 text-center">
        {index + 1}
      </div>
      
      {/* Player info */}
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{player.Name}</div>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="secondary" className="text-xs">
            Score: {Math.round(player.positionScore)}
          </Badge>
          {editingStatus ? (
            <Select 
              value={player.status} 
              onValueChange={(value) => {
                onStatusChange(value)
                setEditingStatus(false)
              }}
            >
              <SelectTrigger className="h-6 w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bought">Bought</SelectItem>
                <SelectItem value="loan">Loan</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="youth">Youth</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div 
              className="cursor-pointer"
              onClick={() => setEditingStatus(true)}
            >
              <PlayerStatusBadge status={player.status} size="sm" />
            </div>
          )}
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onMoveUp}
          disabled={isFirst}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onMoveDown}
          disabled={isLast}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

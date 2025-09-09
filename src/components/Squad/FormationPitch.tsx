import { useSquadStore } from '@/store/squad-store'
import { SquadPosition, POSITION_DISPLAY_NAMES } from '@/types/squad'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PlayerStatusBadge } from './PlayerStatusBadge'
import { useState } from 'react'

interface FormationPitchProps {
  onPositionClick?: (position: SquadPosition) => void
  selectedPositionId?: string
  className?: string
}

export function FormationPitch({ 
  onPositionClick, 
  selectedPositionId,
  className 
}: FormationPitchProps) {
  const formation = useSquadStore(state => state.formation)
  const [hoveredPosition, setHoveredPosition] = useState<string | null>(null)
  
  return (
    <div className={cn(
      "relative mx-auto w-[65%] aspect-[2/3] min-h-[300px]",
      className
    )}>
      {/* Football Pitch Background */}
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        {/* Pitch gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-700 via-green-600 to-green-700" />
        
        {/* Pitch lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Outer boundary */}
          <rect x="5" y="5" width="90" height="90" fill="none" stroke="white" strokeWidth="0.3" opacity="0.5" />
          
          {/* Center line */}
          <line x1="5" y1="50" x2="95" y2="50" stroke="white" strokeWidth="0.3" opacity="0.5" />
          
          {/* Center circle */}
          <circle cx="50" cy="50" r="9" fill="none" stroke="white" strokeWidth="0.3" opacity="0.5" />
          <circle cx="50" cy="50" r="0.5" fill="white" opacity="0.5" />
          
          {/* Penalty areas */}
          {/* Top penalty area */}
          <rect x="30" y="5" width="40" height="16" fill="none" stroke="white" strokeWidth="0.3" opacity="0.5" />
          <rect x="40" y="5" width="20" height="8" fill="none" stroke="white" strokeWidth="0.3" opacity="0.5" />
          <circle cx="50" cy="15" r="0.3" fill="white" opacity="0.5" />
          
          {/* Bottom penalty area */}
          <rect x="30" y="79" width="40" height="16" fill="none" stroke="white" strokeWidth="0.3" opacity="0.5" />
          <rect x="40" y="87" width="20" height="8" fill="none" stroke="white" strokeWidth="0.3" opacity="0.5" />
          <circle cx="50" cy="85" r="0.3" fill="white" opacity="0.5" />
          
          {/* Goals */}
          <rect x="45" y="3" width="10" height="2" fill="none" stroke="white" strokeWidth="0.3" />
          <rect x="45" y="95" width="10" height="2" fill="none" stroke="white" strokeWidth="0.3" />
        </svg>
        
        {/* Grass pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 10px,
              rgba(0,0,0,0.1) 10px,
              rgba(0,0,0,0.1) 20px
            )`
          }} />
        </div>
      </div>
      
      {/* Player Positions */}
      {formation.map((position) => {
        const isHovered = hoveredPosition === position.id
        const isSelected = selectedPositionId === position.id
        const hasPlayers = position.players.length > 0
        const firstPlayer = position.players[0]
        
        return (
          <div
            key={position.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              zIndex: isHovered ? 20 : 10
            }}
            onMouseEnter={() => setHoveredPosition(position.id)}
            onMouseLeave={() => setHoveredPosition(null)}
            onClick={() => onPositionClick?.(position)}
          >
            <Card 
              className={cn(
                "cursor-pointer transition-all duration-200",
                "bg-background/95 backdrop-blur-sm",
                "border-2",
                isSelected && "border-primary ring-2 ring-primary/20",
                !isSelected && "border-border hover:border-primary/50",
                isHovered && "scale-105 shadow-lg"
              )}
            >
              <div className="p-1 min-w-[60px] text-center space-y-1">
                {/* Position Type */}
                <div className="text-xs font-bold text-muted-foreground">
                  {position.positionType}
                </div>
                
                {/* Role */}
                <div className="text-xs font-medium">
                  {position.roleCode.toUpperCase()}
                </div>
                
                {/* Player Info */}
                {hasPlayers ? (
                  <div className="space-y-1">
                    <div className="text-sm font-semibold truncate">
                      {firstPlayer.Name}
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(firstPlayer.positionScore)}
                      </Badge>
                      <PlayerStatusBadge 
                        status={firstPlayer.status} 
                        size="sm" 
                        showLabel={false}
                      />
                    </div>
                    {position.players.length > 1 && (
                      <div className="text-xs text-muted-foreground">
                        +{position.players.length - 1} more
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground italic">
                    Empty
                  </div>
                )}
              </div>
            </Card>
            
            {/* Hover tooltip with full position name */}
            {isHovered && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-30">
                <div className="bg-popover text-popover-foreground px-2 py-1 rounded text-xs whitespace-nowrap border shadow-md">
                  {POSITION_DISPLAY_NAMES[position.positionType]}
                </div>
              </div>
            )}
          </div>
        )
      })}
      
      {/* Empty state */}
      {formation.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Card className="p-6 bg-background/95 backdrop-blur-sm">
            <p className="text-muted-foreground">
              No formation selected. Choose a formation template to get started.
            </p>
          </Card>
        </div>
      )}
    </div>
  )
}

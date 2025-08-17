import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Users, X, Search, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useAppStore } from '@/store/app-store'
import { Player } from '@/types'
import { cn } from '@/lib/utils'

export function PlayerComparison() {
  const { players } = useAppStore()
  const [comparedPlayers, setComparedPlayers] = useState<Player[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  const filteredPlayers = players.filter(p =>
    p.Name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !comparedPlayers.some(cp => cp.Name === p.Name)
  ).slice(0, 10)

  const addPlayer = (player: Player) => {
    if (comparedPlayers.length < 4) {
      setComparedPlayers([...comparedPlayers, player])
      setSearchTerm('')
      setShowSearch(false)
    }
  }

  const removePlayer = (playerName: string) => {
    setComparedPlayers(comparedPlayers.filter(p => p.Name !== playerName))
  }

  const getAttributeDiff = (value: number, otherValues: number[]) => {
    const avg = otherValues.reduce((a, b) => a + b, 0) / otherValues.length
    const diff = value - avg
    if (Math.abs(diff) < 1) return { icon: Minus, color: 'text-muted-foreground', diff: 0 }
    if (diff > 0) return { icon: TrendingUp, color: 'text-green-500', diff: Math.round(diff) }
    return { icon: TrendingDown, color: 'text-red-500', diff: Math.round(diff) }
  }

  const attributes = [
    { key: 'Acc', name: 'Acceleration' },
    { key: 'Pac', name: 'Pace' },
    { key: 'Str', name: 'Strength' },
    { key: 'Jum', name: 'Jumping' },
    { key: 'Sta', name: 'Stamina' },
    { key: 'Dri', name: 'Dribbling' },
    { key: 'Fin', name: 'Finishing' },
    { key: 'Hea', name: 'Heading' },
    { key: 'Pas', name: 'Passing' },
    { key: 'Tec', name: 'Technique' },
    { key: 'Cro', name: 'Crossing' },
    { key: 'Mar', name: 'Marking' },
    { key: 'Tck', name: 'Tackling' },
    { key: 'Pos', name: 'Positioning' },
    { key: 'Vis', name: 'Vision' },
    { key: 'Com', name: 'Composure' },
    { key: 'Cnt', name: 'Concentration' },
    { key: 'Dec', name: 'Decisions' },
    { key: 'Det', name: 'Determination' },
    { key: 'Wor', name: 'Work Rate' },
  ]

  if (comparedPlayers.length === 0 && !showSearch) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Player Comparison</CardTitle>
          <CardDescription>Compare up to 4 players side by side</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowSearch(true)}
          >
            <Users className="h-4 w-4 mr-2" />
            Start Comparing Players
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Player Comparison</CardTitle>
            <CardDescription>
              Comparing {comparedPlayers.length} of 4 players
            </CardDescription>
          </div>
          {comparedPlayers.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setComparedPlayers([])}
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Player Selection */}
        {(showSearch || comparedPlayers.length > 0) && comparedPlayers.length < 4 && (
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for a player to compare..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            {searchTerm && filteredPlayers.length > 0 && (
              <div className="border rounded-md p-2 space-y-1 max-h-48 overflow-y-auto">
                {filteredPlayers.map(player => (
                  <button
                    key={player.Name}
                    onClick={() => addPlayer(player)}
                    className="w-full text-left p-2 hover:bg-accent rounded-md transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{player.Name}</span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{player.Position}</span>
                        <span>{player.Club}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Comparison Table */}
        {comparedPlayers.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Attribute</th>
                  {comparedPlayers.map(player => (
                    <th key={player.Name} className="p-2 text-center min-w-[150px]">
                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-medium">{player.Name}</span>
                          <button
                            onClick={() => removePlayer(player.Name)}
                            className="p-0.5 hover:bg-accent rounded"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {player.Position?.split(',').map((pos, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {pos.trim()}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {player.Club} • Age {player.Age}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Basic Info */}
                <tr className="border-b bg-muted/50">
                  <td className="p-2 font-medium">Value</td>
                  {comparedPlayers.map(player => (
                    <td key={player.Name} className="p-2 text-center font-medium">
                      {player.Value}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Wage</td>
                  {comparedPlayers.map(player => (
                    <td key={player.Name} className="p-2 text-center">
                      {player.Wage}
                    </td>
                  ))}
                </tr>

                {/* Attributes */}
                {attributes.map(attr => {
                  const values = comparedPlayers.map(p => Number(p[attr.key as keyof Player]) || 0)
                  const maxValue = Math.max(...values)
                  
                  return (
                    <tr key={attr.key} className="border-b hover:bg-muted/50">
                      <td className="p-2 text-sm">{attr.name}</td>
                      {comparedPlayers.map((player, idx) => {
                        const value = Number(player[attr.key as keyof Player]) || 0
                        const otherValues = values.filter((_, i) => i !== idx)
                        const diff = comparedPlayers.length > 1 ? getAttributeDiff(value, otherValues) : null
                        const isMax = value === maxValue && value > 0
                        
                        return (
                          <td key={player.Name} className="p-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className={cn(
                                "font-medium",
                                isMax && "text-primary"
                              )}>
                                {value || '-'}
                              </span>
                              {diff && comparedPlayers.length > 1 && (
                                <div className={cn("flex items-center", diff.color)}>
                                  <diff.icon className="h-3 w-3" />
                                  {diff.diff !== 0 && (
                                    <span className="text-xs ml-0.5">
                                      {diff.diff > 0 ? '+' : ''}{diff.diff}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}

                {/* Best Role if available */}
                {comparedPlayers.some(p => p.bestRole) && (
                  <tr className="border-b bg-muted/50">
                    <td className="p-2 font-medium">Best Role</td>
                    {comparedPlayers.map(player => (
                      <td key={player.Name} className="p-2 text-center">
                        {player.bestRole ? (
                          <div className="space-y-1">
                            <Badge variant="default" className="text-xs">
                              {player.bestRole.name}
                            </Badge>
                            <div className="text-sm font-medium">
                              {player.bestRole.score.toFixed(1)}
                            </div>
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
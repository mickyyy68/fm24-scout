import { useEffect, useState } from 'react'
import { useSquadStore } from '@/store/squad-store'
import { useAppStore } from '@/store/app-store'
import { FormationPitch } from './FormationPitch'
import { PositionCard } from './PositionCard'
import { PlayerAssignModal } from './PlayerAssignModal'
import { SquadPosition } from '@/types/squad'
import { formations, getFormationNames } from '@/data/formations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Download, 
  Upload, 
  Users, 
  Trophy,
  Edit,
  Save,
  X
} from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

export function Squad() {
  const { 
    formation,
    squadName,
    setSquadName,
    setFormationTemplate,
    getSquadPlayerCount,
    getStartingEleven,
    exportSquad,
    importSquad,
    clearSquad
  } = useSquadStore()
  
  const { players } = useAppStore()
  
  // Track only the selected position id to keep in sync with store updates
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [editingName, setEditingName] = useState(false)
  const [tempSquadName, setTempSquadName] = useState(squadName)
  
  // Reset focus if formation changes and selected id no longer exists
  // Use effect to avoid state updates during render
  useEffect(() => {
    if (selectedPositionId && !formation.some(p => p.id === selectedPositionId)) {
      setSelectedPositionId(null)
    }
  }, [formation, selectedPositionId])
  
  const squadCount = getSquadPlayerCount()
  const startingCount = getStartingEleven().length
  
  const handleFormationChange = (formationName: string) => {
    const template = formations[formationName]
    if (template) {
      const formationPositions = template.positions.map(pos => ({
        id: uuidv4(),
        x: pos.x,
        y: pos.y,
        positionType: pos.positionType,
        roleCode: pos.defaultRole,
        roleName: '', // Will be filled by the store
        players: []
      }))
      setFormationTemplate(formationPositions)
    }
  }
  
  const handleExport = () => {
    const squadData = exportSquad()
    const blob = new Blob([JSON.stringify(squadData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${squadName.replace(/\s+/g, '_')}_squad.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          importSquad(data)
        } catch (error) {
          console.error('Failed to import squad:', error)
        }
      }
      reader.readAsText(file)
    }
  }
  
  const handleSaveName = () => {
    setSquadName(tempSquadName)
    setEditingName(false)
  }
  
  const handlePositionClick = (position: SquadPosition) => {
    setSelectedPositionId(position.id)
  }
  
  // Note: Position-specific "Add Player" action is handled inline where used
  
  return (
    <div className="space-y-6">
      {/* Squad Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={tempSquadName}
                      onChange={(e) => setTempSquadName(e.target.value)}
                      className="h-8 w-[200px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveName()
                        if (e.key === 'Escape') {
                          setTempSquadName(squadName)
                          setEditingName(false)
                        }
                      }}
                      autoFocus
                    />
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSaveName}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8"
                      onClick={() => {
                        setTempSquadName(squadName)
                        setEditingName(false)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <CardTitle>{squadName}</CardTitle>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => setEditingName(true)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              <CardDescription>
                Manage your squad formation and player assignments
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{startingCount}/11 Starting</span>
                <Badge variant="outline">{squadCount} Total</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {/* Formation selector */}
            <Select onValueChange={handleFormationChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Choose formation" />
              </SelectTrigger>
              <SelectContent>
                {getFormationNames().map(name => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Actions */}
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Squad
            </Button>
            
            <Button variant="outline" size="sm" asChild>
              <label>
                <Upload className="h-4 w-4 mr-2" />
                Import Squad
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </Button>
            
            <Button variant="outline" size="sm" onClick={clearSquad}>
              Clear Squad
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pitch View - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Formation</CardTitle>
              <CardDescription>
                Click on a position to view details or assign players
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormationPitch
                onPositionClick={handlePositionClick}
                selectedPositionId={selectedPositionId || undefined}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Position Details - Takes 1 column */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Positions</CardTitle>
              <CardDescription>
                Manage players for the selected position
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {formation.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No formation selected</p>
                      <p className="text-xs mt-1">Choose a formation template above to get started</p>
                    </div>
                  )}

                  {formation.length > 0 && !selectedPositionId && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">Click a position on the formation to focus it here</p>
                    </div>
                  )}

                  {formation.length > 0 && selectedPositionId && (
                    (() => {
                      const position = formation.find(p => p.id === selectedPositionId)
                      if (!position) return null
                      return (
                        <PositionCard
                          key={position.id}
                          position={position}
                          onEditPosition={() => setSelectedPositionId(position.id)}
                          onAddPlayer={() => {
                            setSelectedPositionId(position.id)
                            setIsAssignModalOpen(true)
                          }}
                          bare
                        />
                      )
                    })()
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Player Assignment Modal */}
      {players.length > 0 && (
        <PlayerAssignModal
          player={selectedPlayer}
          open={isAssignModalOpen}
          onClose={() => {
            setIsAssignModalOpen(false)
            setSelectedPlayer(null)
          }}
        />
      )}
    </div>
  )
}

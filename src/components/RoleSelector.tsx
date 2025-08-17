import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, X, Calculator } from 'lucide-react'
import { useAppStore } from '@/store/app-store'

export function RoleSelector() {
  const { selectedRoles, removeRole, calculateScores, players } = useAppStore()

  const handleCalculate = async () => {
    const startTime = performance.now()
    await calculateScores()
    const endTime = performance.now()
    
    console.log(`Calculated scores in ${((endTime - startTime) / 1000).toFixed(2)}s`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Selection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Selected Roles:</span>
          
          {selectedRoles.map(role => (
            <Badge key={role.code} variant="secondary" className="pl-3 pr-1">
              {role.name}
              <button
                onClick={() => removeRole(role.code)}
                className="ml-1 rounded-full p-0.5 hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              // For now, add a sample role
              const sampleRoles = [
                { code: 'afa', name: 'Advanced Forward Attack' },
                { code: 'ws', name: 'Winger Support' },
                { code: 'bpdd', name: 'Ball Playing Defender Defend' }
              ]
              const role = sampleRoles[Math.floor(Math.random() * sampleRoles.length)]
              useAppStore.getState().addRole(role)
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Roles
          </Button>
          
          {selectedRoles.length > 0 && players.length > 0 && (
            <Button
              size="sm"
              variant="default"
              onClick={handleCalculate}
              className="ml-auto"
            >
              <Calculator className="h-4 w-4 mr-1" />
              Calculate Scores
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
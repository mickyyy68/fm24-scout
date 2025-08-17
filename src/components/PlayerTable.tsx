import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAppStore } from '@/store/app-store'

export function PlayerTable() {
  const { players, selectedRoles } = useAppStore()

  if (players.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Players</CardTitle>
          <CardDescription>
            {players.length} players loaded
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Club</th>
                <th className="text-left p-2">Position</th>
                {selectedRoles.map(role => (
                  <th key={role.code} className="text-left p-2">{role.name}</th>
                ))}
                {selectedRoles.length > 0 && (
                  <th className="text-left p-2">Best Role</th>
                )}
              </tr>
            </thead>
            <tbody>
              {players.slice(0, 50).map((player, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2">{player.Name}</td>
                  <td className="p-2">{player.Club}</td>
                  <td className="p-2">{player.Position}</td>
                  {selectedRoles.map(role => (
                    <td key={role.code} className="p-2">
                      {player.roleScores?.[role.code]?.toFixed(1) || '-'}
                    </td>
                  ))}
                  {selectedRoles.length > 0 && (
                    <td className="p-2">
                      {player.bestRole ? (
                        <div>
                          <div className="font-medium">{player.bestRole.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {player.bestRole.score.toFixed(1)}%
                          </div>
                        </div>
                      ) : '-'}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
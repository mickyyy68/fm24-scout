import { Player, Role } from '@/types'

export function exportToCSV(players: Player[], selectedRoles: Role[]) {
  // Build CSV headers
  const headers = [
    'Name', 'Age', 'Club', 'Position', 'Value', 'Wage',
    ...selectedRoles.map(r => r.name),
    'Best Role', 'Best Score'
  ]
  
  // Build CSV rows
  const rows = players.map(player => {
    const row = [
      player.Name,
      player.Age,
      player.Club,
      player.Position,
      player.Value,
      player.Wage,
      ...selectedRoles.map(role => 
        player.roleScores?.[role.code]?.toFixed(1) || '0'
      ),
      player.bestRole?.name || '',
      player.bestRole?.score?.toFixed(1) || ''
    ]
    return row.map(cell => {
      // Escape quotes and wrap in quotes if contains comma
      const str = String(cell || '')
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }).join(',')
  })
  
  // Combine headers and rows
  const csv = [headers.join(','), ...rows].join('\n')
  
  // Download file
  downloadFile(csv, 'fm24-players-export.csv', 'text/csv')
}

export function exportToJSON(players: Player[]) {
  const json = JSON.stringify(players, null, 2)
  downloadFile(json, 'fm24-players-export.json', 'application/json')
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
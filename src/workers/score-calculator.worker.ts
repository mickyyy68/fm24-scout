import { Player, RoleData } from '../types'

interface WorkerMessage {
  type: 'CALCULATE_SCORES'
  payload: {
    players: Player[]
    selectedRoleCodes: string[]
    roles: RoleData[]
  }
}

interface WorkerResponse {
  type: 'PROGRESS' | 'COMPLETE' | 'ERROR'
  payload?: {
    progress?: number
    results?: Player[]
    error?: string
  }
}

// Cache for role lookups
const roleCache = new Map<string, RoleData>()

function initRoleCache(roles: RoleData[]) {
  roleCache.clear()
  roles.forEach(role => {
    roleCache.set(role.RoleCode, role)
  })
}

function calculatePlayerScore(player: Player, roleCode: string): number {
  const role = roleCache.get(roleCode)
  if (!role) return 0
  
  let totalScore = 0
  let weightSum = 0
  
  // Iterate through all attributes
  Object.entries(role).forEach(([attr, weight]) => {
    if (attr === 'Role' || attr === 'RoleCode') return
    
    const numWeight = Number(weight)
    if (numWeight === 0) return
    
    const playerValue = Number(player[attr as keyof Player]) || 0
    const normalizedValue = Math.min(playerValue / 20, 1)
    
    totalScore += normalizedValue * numWeight
    weightSum += numWeight
  })
  
  return weightSum > 0 ? (totalScore / weightSum) * 100 : 0
}

function processPlayer(player: Player, selectedRoleCodes: string[]): Player {
  const roleScores: Record<string, number> = {}
  
  // Calculate scores for selected roles
  selectedRoleCodes.forEach(code => {
    roleScores[code] = calculatePlayerScore(player, code)
  })
  
  // Find best role from selected
  let bestRole = undefined
  let bestScore = -1
  
  Object.entries(roleScores).forEach(([code, score]) => {
    if (score > bestScore) {
      const role = roleCache.get(code)
      if (role) {
        bestScore = score
        bestRole = {
          code,
          name: role.Role,
          score
        }
      }
    }
  })
  
  // Add calculated attributes
  const speed = ((player.Pac || 0) + (player.Acc || 0)) / 2
  const workRate = ((player.Wor || 0) + (player.Sta || 0)) / 2
  const setPieces = ((player.Cor || 0) + (player.Fir || 0)) / 2
  
  return {
    ...player,
    Speed: speed,
    WorkRate: workRate,
    SetPieces: setPieces,
    roleScores,
    bestRole
  }
}

self.addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
  const { type, payload } = event.data
  
  if (type === 'CALCULATE_SCORES') {
    try {
      const { players, selectedRoleCodes, roles } = payload
      
      // Initialize role cache
      initRoleCache(roles)
      
      const results: Player[] = []
      const totalPlayers = players.length
      const batchSize = 100 // Process in batches for progress updates
      
      for (let i = 0; i < totalPlayers; i += batchSize) {
        const batch = players.slice(i, Math.min(i + batchSize, totalPlayers))
        
        // Process batch
        batch.forEach(player => {
          results.push(processPlayer(player, selectedRoleCodes))
        })
        
        // Send progress update
        const progress = Math.min(100, Math.round((results.length / totalPlayers) * 100))
        self.postMessage({
          type: 'PROGRESS',
          payload: { progress }
        } as WorkerResponse)
      }
      
      // Send final results
      self.postMessage({
        type: 'COMPLETE',
        payload: { results }
      } as WorkerResponse)
      
    } catch (error) {
      self.postMessage({
        type: 'ERROR',
        payload: { error: (error as Error).message }
      } as WorkerResponse)
    }
  }
})

export {}
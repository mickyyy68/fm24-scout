import rolesData from '@/data/roles.json'
import { Player, RoleData } from '@/types'

export class OptimizedDataManager {
  private roles: RoleData[]
  private worker: Worker | null = null
  private scoreCache = new Map<string, number>()
  
  constructor() {
    this.roles = rolesData as RoleData[]
  }
  
  private getCacheKey(playerId: string, roleCode: string): string {
    return `${playerId}_${roleCode}`
  }
  
  getAllRoles() {
    return this.roles.map(r => ({
      code: r.RoleCode,
      name: r.Role
    }))
  }
  
  getRoleByCode(code: string) {
    return this.roles.find(r => r.RoleCode === code)
  }
  
  private initWorker(): Worker {
    if (!this.worker) {
      this.worker = new Worker(
        new URL('../workers/score-calculator.worker.ts', import.meta.url),
        { type: 'module' }
      )
    }
    return this.worker
  }
  
  async calculateAllScoresOptimized(
    players: Player[], 
    selectedRoleCodes: string[],
    onProgress?: (progress: number) => void
  ): Promise<Player[]> {
    return new Promise((resolve, reject) => {
      const worker = this.initWorker()
      
      // Set up message handlers
      const handleMessage = (event: MessageEvent) => {
        const { type, payload } = event.data
        
        switch (type) {
          case 'PROGRESS':
            if (onProgress && payload?.progress) {
              onProgress(payload.progress)
            }
            break
            
          case 'COMPLETE':
            if (payload?.results) {
              // Cache the results
              payload.results.forEach((player: Player) => {
                if (player.roleScores) {
                  Object.entries(player.roleScores).forEach(([roleCode, score]) => {
                    const key = this.getCacheKey(player.Name, roleCode)
                    this.scoreCache.set(key, score as number)
                  })
                }
              })
              
              worker.removeEventListener('message', handleMessage)
              resolve(payload.results)
            }
            break
            
          case 'ERROR':
            worker.removeEventListener('message', handleMessage)
            reject(new Error(payload?.error || 'Unknown error'))
            break
        }
      }
      
      worker.addEventListener('message', handleMessage)
      
      // Send calculation request to worker
      worker.postMessage({
        type: 'CALCULATE_SCORES',
        payload: {
          players,
          selectedRoleCodes,
          roles: this.roles
        }
      })
    })
  }
  
  // Quick calculation for visible players only
  async calculateVisibleScores(
    players: Player[],
    selectedRoleCodes: string[],
    visibleIndices: number[]
  ): Promise<Player[]> {
    const visiblePlayers = visibleIndices.map(i => players[i])
    const calculatedPlayers = await this.calculateAllScoresOptimized(
      visiblePlayers,
      selectedRoleCodes
    )
    
    // Merge back into original array
    const result = [...players]
    visibleIndices.forEach((index, i) => {
      result[index] = calculatedPlayers[i]
    })
    
    return result
  }
  
  // Get cached score if available
  getCachedScore(playerId: string, roleCode: string): number | undefined {
    return this.scoreCache.get(this.getCacheKey(playerId, roleCode))
  }
  
  // Clear cache when data changes
  clearCache() {
    this.scoreCache.clear()
  }
  
  // Cleanup worker when done
  dispose() {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
    this.clearCache()
  }
}
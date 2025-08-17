import rolesData from '@/data/roles.json'
import { Player, RoleData, RoleScore } from '@/types'

export class DataManager {
  private roles: RoleData[]
  
  constructor() {
    this.roles = rolesData as RoleData[]
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
  
  calculatePlayerScore(player: Player, roleCode: string): number {
    const role = this.getRoleByCode(roleCode)
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
  
  findBestRole(player: Player): RoleScore | null {
    let bestScore: RoleScore | null = null
    
    this.roles.forEach(role => {
      const score = this.calculatePlayerScore(player, role.RoleCode)
      
      if (!bestScore || score > bestScore.score) {
        bestScore = {
          code: role.RoleCode,
          name: role.Role,
          score
        }
      }
    })
    
    return bestScore
  }
  
  async calculateAllScores(
    players: Player[], 
    selectedRoleCodes: string[]
  ): Promise<Player[]> {
    return players.map(player => {
      const roleScores: Record<string, number> = {}
      
      // Calculate scores for selected roles
      selectedRoleCodes.forEach(code => {
        roleScores[code] = this.calculatePlayerScore(player, code)
      })
      
      // Find best role from selected
      let bestRole: RoleScore | undefined = undefined
      Object.entries(roleScores).forEach(([code, score]) => {
        const role = this.getRoleByCode(code)
        if (role && (!bestRole || score > bestRole.score)) {
          bestRole = {
            code,
            name: role.Role,
            score
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
    })
  }
}
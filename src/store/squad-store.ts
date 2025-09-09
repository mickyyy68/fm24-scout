import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { 
  Squad, 
  SquadPosition, 
  SquadPlayer, 
  PlayerStatus, 
  SquadExport,
  PlayerUpdateNotification
} from '@/types/squad'
import { Player } from '@/types'
import { DataManager } from '@/lib/data-manager'

const dataManager = new DataManager()

interface SquadState extends Squad {
  // State
  pendingUpdates: PlayerUpdateNotification[]
  
  // Formation Management
  setFormationTemplate: (template: SquadPosition[]) => void
  addPosition: (position: Omit<SquadPosition, 'id' | 'players'>) => void
  removePosition: (positionId: string) => void
  updatePositionRole: (positionId: string, roleCode: string) => void
  movePosition: (positionId: string, x: number, y: number) => void
  
  // Player Management
  addPlayerToPosition: (player: Player, positionId: string, status: PlayerStatus) => void
  removePlayerFromPosition: (playerId: string, positionId: string) => void
  updatePlayerStatus: (playerId: string, positionId: string, status: PlayerStatus) => void
  reorderPlayersInPosition: (positionId: string, playerIds: string[]) => void
  movePlayerBetweenPositions: (playerId: string, fromPositionId: string, toPositionId: string) => void
  updatePlayerFromLatest: (positionId: string, squadId: string, latest: Player) => void
  findPositionsByPlayerName: (playerName: string) => { position: SquadPosition, player: SquadPlayer }[]
  
  // Squad Operations
  clearSquad: () => void
  setSquadName: (name: string) => void
  getSquadPlayerCount: () => number
  getStartingEleven: () => SquadPlayer[]
  getAllSquadPlayers: () => SquadPlayer[]
  isPlayerInSquad: (playerName: string) => boolean
  
  // Import/Export
  exportSquad: () => SquadExport
  importSquad: (data: SquadExport) => void
  
  // Player Updates
  checkForUpdates: (importedPlayers: Player[]) => PlayerUpdateNotification[]
  applyPlayerUpdate: (update: PlayerUpdateNotification) => void
  applyAllPendingUpdates: (importedPlayers: Player[]) => number
  dismissUpdate: (playerId: string) => void
  clearPendingUpdates: () => void
}

const INITIAL_SQUAD: Squad = {
  version: '1.0',
  squadName: 'My Squad',
  formation: [],
  lastUpdated: new Date().toISOString()
}

export const useSquadStore = create<SquadState>()(
  persist(
    (set, get) => ({
      ...INITIAL_SQUAD,
      pendingUpdates: [],
      
      // Formation Management
      setFormationTemplate: (template) => {
        set({
          formation: template.map(pos => {
            const role = pos.roleCode ? dataManager.getRoleByCode(pos.roleCode) : undefined
            return {
              ...pos,
              id: pos.id || uuidv4(),
              // Ensure human-readable role name is set based on roleCode
              roleName: pos.roleName || role?.Role || '',
              players: pos.players || []
            }
          }),
          lastUpdated: new Date().toISOString()
        })
      },
      
      addPosition: (position) => {
        set(state => ({
          formation: [...state.formation, {
            ...position,
            id: uuidv4(),
            roleName: position.roleName || dataManager.getRoleByCode(position.roleCode)?.Role || '',
            players: []
          }],
          lastUpdated: new Date().toISOString()
        }))
      },
      
      removePosition: (positionId) => {
        set(state => ({
          formation: state.formation.filter(p => p.id !== positionId),
          lastUpdated: new Date().toISOString()
        }))
      },
      
      updatePositionRole: (positionId, roleCode) => {
        const role = dataManager.getRoleByCode(roleCode)
        if (!role) return
        
        set(state => ({
          formation: state.formation.map(pos => {
            if (pos.id === positionId) {
              // Recalculate scores for all players in this position
              const updatedPlayers = pos.players.map(player => ({
                ...player,
                positionScore: dataManager.calculatePlayerScore(player, roleCode)
              }))
              
              return {
                ...pos,
                roleCode,
                roleName: role.Role,
                players: updatedPlayers
              }
            }
            return pos
          }),
          lastUpdated: new Date().toISOString()
        }))
      },
      
      movePosition: (positionId, x, y) => {
        set(state => ({
          formation: state.formation.map(pos => 
            pos.id === positionId ? { ...pos, x, y } : pos
          ),
          lastUpdated: new Date().toISOString()
        }))
      },
      
      // Player Management
      addPlayerToPosition: (player, positionId, status) => {
        const position = get().formation.find(p => p.id === positionId)
        if (!position) return
        
        // Calculate score for this position's role
        const positionScore = dataManager.calculatePlayerScore(player, position.roleCode)
        
        const squadPlayer: SquadPlayer = {
          ...player,
          squadId: uuidv4(),
          status,
          addedDate: new Date().toISOString(),
          positionScore
        }
        
        set(state => ({
          formation: state.formation.map(pos => 
            pos.id === positionId 
              ? { ...pos, players: [...pos.players, squadPlayer] }
              : pos
          ),
          lastUpdated: new Date().toISOString()
        }))
      },
      
      removePlayerFromPosition: (playerId, positionId) => {
        set(state => ({
          formation: state.formation.map(pos => 
            pos.id === positionId 
              ? { ...pos, players: pos.players.filter(p => p.squadId !== playerId) }
              : pos
          ),
          lastUpdated: new Date().toISOString()
        }))
      },
      
      updatePlayerStatus: (playerId, positionId, status) => {
        set(state => ({
          formation: state.formation.map(pos => 
            pos.id === positionId 
              ? {
                  ...pos,
                  players: pos.players.map(p => 
                    p.squadId === playerId ? { ...p, status } : p
                  )
                }
              : pos
          ),
          lastUpdated: new Date().toISOString()
        }))
      },
      
      reorderPlayersInPosition: (positionId, playerIds) => {
        set(state => ({
          formation: state.formation.map(pos => {
            if (pos.id === positionId) {
              const reorderedPlayers = playerIds
                .map(id => pos.players.find(p => p.squadId === id))
                .filter(Boolean) as SquadPlayer[]
              
              return { ...pos, players: reorderedPlayers }
            }
            return pos
          }),
          lastUpdated: new Date().toISOString()
        }))
      },
      
      movePlayerBetweenPositions: (playerId, fromPositionId, toPositionId) => {
        const state = get()
        const fromPosition = state.formation.find(p => p.id === fromPositionId)
        const toPosition = state.formation.find(p => p.id === toPositionId)
        
        if (!fromPosition || !toPosition) return
        
        const player = fromPosition.players.find(p => p.squadId === playerId)
        if (!player) return
        
        // Recalculate score for new position
        const newPositionScore = dataManager.calculatePlayerScore(player, toPosition.roleCode)
        const updatedPlayer = { ...player, positionScore: newPositionScore }
        
        set(state => ({
          formation: state.formation.map(pos => {
            if (pos.id === fromPositionId) {
              return { ...pos, players: pos.players.filter(p => p.squadId !== playerId) }
            }
            if (pos.id === toPositionId) {
              return { ...pos, players: [...pos.players, updatedPlayer] }
            }
            return pos
          }),
          lastUpdated: new Date().toISOString()
        }))
      },

      // Update a squad player's attributes from the latest dataset
      updatePlayerFromLatest: (positionId, squadId, latest) => {
        set(state => ({
          formation: state.formation.map(pos => {
            if (pos.id !== positionId) return pos
            const newPlayers = pos.players.map(p => {
              if (p.squadId !== squadId) return p
              // Recalculate score for this position's current role
              const positionScore = dataManager.calculatePlayerScore(latest, pos.roleCode)
              return {
                ...latest,
                squadId: p.squadId,
                status: p.status,
                addedDate: p.addedDate,
                positionScore,
              } as SquadPlayer
            })
            return { ...pos, players: newPlayers }
          }),
          lastUpdated: new Date().toISOString()
        }))
      },

      // Find all squad entries matching a player name
      findPositionsByPlayerName: (playerName) => {
        const results: { position: SquadPosition, player: SquadPlayer }[] = []
        const formation = get().formation
        formation.forEach(position => {
          position.players.forEach(sp => {
            if (sp.Name === playerName) {
              results.push({ position, player: sp })
            }
          })
        })
        return results
      },
      
      // Squad Operations
      clearSquad: () => {
        set({
          ...INITIAL_SQUAD,
          formation: [],
          pendingUpdates: []
        })
      },
      
      setSquadName: (name) => {
        set({ squadName: name, lastUpdated: new Date().toISOString() })
      },
      
      getSquadPlayerCount: () => {
        return get().formation.reduce((count, pos) => count + pos.players.length, 0)
      },
      
      getStartingEleven: () => {
        return get().formation
          .map(pos => pos.players[0])
          .filter(Boolean)
      },
      
      getAllSquadPlayers: () => {
        return get().formation.flatMap(pos => pos.players)
      },
      
      isPlayerInSquad: (playerName) => {
        return get().formation.some(pos => 
          pos.players.some(p => p.Name === playerName)
        )
      },
      
      // Import/Export
      exportSquad: () => {
        const state = get()
        return {
          version: state.version,
          squadName: state.squadName,
          formation: state.formation,
          lastUpdated: state.lastUpdated,
          exportDate: new Date().toISOString(),
          appVersion: '0.1.0'
        }
      },
      
      importSquad: (data) => {
        set({
          version: data.version,
          squadName: data.squadName,
          formation: (data.formation || []).map(pos => ({
            ...pos,
            roleName: pos.roleName || dataManager.getRoleByCode(pos.roleCode)?.Role || ''
          })),
          lastUpdated: data.lastUpdated,
          pendingUpdates: []
        })
      },
      
      // Player Updates
      checkForUpdates: (importedPlayers) => {
        const updates: PlayerUpdateNotification[] = []
        const formation = get().formation
        
        formation.forEach(position => {
          position.players.forEach(squadPlayer => {
            const importedPlayer = importedPlayers.find(p => p.Name === squadPlayer.Name)
            if (importedPlayer) {
              const changes: PlayerUpdateNotification['changes'] = []
              
              // Check for attribute changes
              const attributes = ['Pac', 'Acc', 'Fin', 'Pas', 'Dri', 'Tec', 'Ant', 'Dec', 'Vis', 'Cmp', 'Wor', 'Sta']
              attributes.forEach(attr => {
                const oldVal = squadPlayer[attr as keyof Player] as number
                const newVal = importedPlayer[attr as keyof Player] as number
                if (oldVal !== newVal) {
                  changes.push({
                    attribute: attr,
                    oldValue: oldVal,
                    newValue: newVal,
                    difference: newVal - oldVal
                  })
                }
              })
              
              if (changes.length > 0) {
                const oldScore = squadPlayer.positionScore
                const newScore = dataManager.calculatePlayerScore(importedPlayer, position.roleCode)
                
                updates.push({
                  playerId: squadPlayer.squadId,
                  playerName: squadPlayer.Name,
                  positionId: position.id,
                  changes,
                  oldScore,
                  newScore
                })
              }
            }
          })
        })
        
        set({ pendingUpdates: updates })
        return updates
      },
      
      applyPlayerUpdate: (_update) => {
        // Deprecated path without dataset access; keep for compatibility
        console.warn('applyPlayerUpdate called without dataset context; prefer updatePlayerFromLatest or applyAllPendingUpdates')
      },

      // Apply all pending updates using the provided dataset
      applyAllPendingUpdates: (importedPlayers) => {
        const pending = get().pendingUpdates
        if (!pending || pending.length === 0) return 0
        const updatedNames = new Set<string>()
        pending.forEach(update => {
          const latest = importedPlayers.find(p => p.Name === update.playerName)
          if (!latest) return
          // Update the specific player in its position
          set(state => ({
            formation: state.formation.map(pos => {
              if (pos.id !== update.positionId) return pos
              const newPlayers = pos.players.map(p => {
                if (p.squadId !== update.playerId) return p
                const positionScore = dataManager.calculatePlayerScore(latest, pos.roleCode)
                return {
                  ...latest,
                  squadId: p.squadId,
                  status: p.status,
                  addedDate: p.addedDate,
                  positionScore,
                } as SquadPlayer
              })
              return { ...pos, players: newPlayers }
            }),
            lastUpdated: new Date().toISOString()
          }))
          updatedNames.add(update.playerName)
        })
        set({ pendingUpdates: [] })
        return updatedNames.size
      },
      
      dismissUpdate: (playerId) => {
        set(state => ({
          pendingUpdates: state.pendingUpdates.filter(u => u.playerId !== playerId)
        }))
      },
      
      clearPendingUpdates: () => {
        set({ pendingUpdates: [] })
      }
    }),
    {
      name: 'fm24-squad-storage',
      partialize: (state) => ({
        version: state.version,
        squadName: state.squadName,
        formation: state.formation,
        lastUpdated: state.lastUpdated
      })
    }
  )
)

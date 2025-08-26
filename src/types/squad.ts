import { Player } from './index'

// Specific position types for tactical formations
export type PositionType = 
  // Goalkeeper
  | 'GK'
  // Defenders
  | 'LB' | 'LCB' | 'CB' | 'RCB' | 'RB'
  | 'LWB' | 'RWB'
  // Defensive Midfield
  | 'LDMF' | 'CDMF' | 'RDMF'
  // Central Midfield  
  | 'LCM' | 'CM' | 'RCM'
  // Attacking Midfield
  | 'LAMF' | 'CAMF' | 'RAMF'
  // Wingers/Wide
  | 'LW' | 'RW'
  // Forwards
  | 'LST' | 'ST' | 'RST'

// Player status in squad
export type PlayerStatus = 'bought' | 'loan' | 'trial' | 'youth'

// Extended player with squad-specific data
export interface SquadPlayer extends Player {
  squadId: string // Unique ID for this squad instance
  status: PlayerStatus
  addedDate: string // ISO date string
  positionScore: number // Score for the assigned position's role
}

// A position on the formation
export interface SquadPosition {
  id: string // Unique position ID
  x: number // 0-100% from left
  y: number // 0-100% from top
  positionType: PositionType // The specific position
  roleCode: string // FM24 tactical role code (e.g., "dlps")
  roleName: string // Full role name (e.g., "Deep Lying Playmaker Support")
  players: SquadPlayer[] // Ordered list (first = starter)
}

// Complete squad data
export interface Squad {
  version: string // Format version for future compatibility
  squadName: string
  formation: SquadPosition[]
  lastUpdated: string // ISO date string
}

// Formation template for presets
export interface FormationTemplate {
  name: string // e.g., "4-4-2", "4-2-3-1"
  positions: Array<{
    positionType: PositionType
    x: number
    y: number
    defaultRole: string // Default FM24 role code
  }>
}

// Player update notification
export interface PlayerUpdateNotification {
  playerId: string
  playerName: string
  positionId: string
  changes: {
    attribute: string
    oldValue: number
    newValue: number
    difference: number
  }[]
  oldScore: number
  newScore: number
}

// Squad export format
export interface SquadExport extends Squad {
  exportDate: string
  appVersion: string
}

// Position display names
export const POSITION_DISPLAY_NAMES: Record<PositionType, string> = {
  'GK': 'Goalkeeper',
  'LB': 'Left Back',
  'LCB': 'Left Centre Back',
  'CB': 'Centre Back',
  'RCB': 'Right Centre Back',
  'RB': 'Right Back',
  'LWB': 'Left Wing Back',
  'RWB': 'Right Wing Back',
  'LDMF': 'Left Defensive Midfielder',
  'CDMF': 'Central Defensive Midfielder',
  'RDMF': 'Right Defensive Midfielder',
  'LCM': 'Left Central Midfielder',
  'CM': 'Central Midfielder',
  'RCM': 'Right Central Midfielder',
  'LAMF': 'Left Attacking Midfielder',
  'CAMF': 'Central Attacking Midfielder',
  'RAMF': 'Right Attacking Midfielder',
  'LW': 'Left Winger',
  'RW': 'Right Winger',
  'LST': 'Left Striker',
  'ST': 'Striker',
  'RST': 'Right Striker'
}

// Status colors for UI
export const STATUS_COLORS = {
  bought: {
    border: '#10B981',
    background: '#10B98110',
    text: '#059669'
  },
  loan: {
    border: '#3B82F6',
    background: '#3B82F610',
    text: '#2563EB'
  },
  trial: {
    border: '#F59E0B',
    background: '#F59E0B10',
    text: '#D97706'
  },
  youth: {
    border: '#8B5CF6',
    background: '#8B5CF610',
    text: '#7C3AED'
  }
} as const
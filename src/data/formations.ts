import { FormationTemplate, PositionType } from '@/types/squad'

export const formations: Record<string, FormationTemplate> = {
  '4-4-2': {
    name: '4-4-2',
    positions: [
      // Goalkeeper
      { positionType: 'GK' as PositionType, x: 50, y: 90, defaultRole: 'gkd' },
      // Defense
      { positionType: 'LB' as PositionType, x: 15, y: 70, defaultRole: 'fbs' },
      { positionType: 'LCB' as PositionType, x: 35, y: 75, defaultRole: 'cdd' },
      { positionType: 'RCB' as PositionType, x: 65, y: 75, defaultRole: 'cdd' },
      { positionType: 'RB' as PositionType, x: 85, y: 70, defaultRole: 'fbs' },
      // Midfield
      { positionType: 'LCM' as PositionType, x: 20, y: 45, defaultRole: 'cms' },
      { positionType: 'LCM' as PositionType, x: 40, y: 50, defaultRole: 'b2bs' },
      { positionType: 'RCM' as PositionType, x: 60, y: 50, defaultRole: 'b2bs' },
      { positionType: 'RCM' as PositionType, x: 80, y: 45, defaultRole: 'cms' },
      // Attack
      { positionType: 'LST' as PositionType, x: 35, y: 20, defaultRole: 'afa' },
      { positionType: 'RST' as PositionType, x: 65, y: 20, defaultRole: 'dlfs' }
    ]
  },
  
  '4-2-3-1': {
    name: '4-2-3-1',
    positions: [
      // Goalkeeper
      { positionType: 'GK' as PositionType, x: 50, y: 90, defaultRole: 'gkd' },
      // Defense
      { positionType: 'LB' as PositionType, x: 15, y: 70, defaultRole: 'fbs' },
      { positionType: 'LCB' as PositionType, x: 35, y: 75, defaultRole: 'cdd' },
      { positionType: 'RCB' as PositionType, x: 65, y: 75, defaultRole: 'cdd' },
      { positionType: 'RB' as PositionType, x: 85, y: 70, defaultRole: 'fbs' },
      // Defensive Midfield
      { positionType: 'LDMF' as PositionType, x: 35, y: 55, defaultRole: 'dlpd' },
      { positionType: 'RDMF' as PositionType, x: 65, y: 55, defaultRole: 'bwmd' },
      // Attacking Midfield
      { positionType: 'LAMF' as PositionType, x: 20, y: 35, defaultRole: 'iws' },
      { positionType: 'CAMF' as PositionType, x: 50, y: 40, defaultRole: 'aps' },
      { positionType: 'RAMF' as PositionType, x: 80, y: 35, defaultRole: 'iws' },
      // Attack
      { positionType: 'ST' as PositionType, x: 50, y: 15, defaultRole: 'afa' }
    ]
  },
  
  '4-3-3': {
    name: '4-3-3',
    positions: [
      // Goalkeeper
      { positionType: 'GK' as PositionType, x: 50, y: 90, defaultRole: 'gkd' },
      // Defense
      { positionType: 'LB' as PositionType, x: 15, y: 70, defaultRole: 'fba' },
      { positionType: 'LCB' as PositionType, x: 35, y: 75, defaultRole: 'cdd' },
      { positionType: 'RCB' as PositionType, x: 65, y: 75, defaultRole: 'cdd' },
      { positionType: 'RB' as PositionType, x: 85, y: 70, defaultRole: 'fba' },
      // Midfield
      { positionType: 'CDMF' as PositionType, x: 50, y: 55, defaultRole: 'dms' },
      { positionType: 'LCM' as PositionType, x: 30, y: 45, defaultRole: 'cms' },
      { positionType: 'RCM' as PositionType, x: 70, y: 45, defaultRole: 'cms' },
      // Attack
      { positionType: 'LW' as PositionType, x: 15, y: 25, defaultRole: 'iwa' },
      { positionType: 'ST' as PositionType, x: 50, y: 15, defaultRole: 'afa' },
      { positionType: 'RW' as PositionType, x: 85, y: 25, defaultRole: 'iwa' }
    ]
  },
  
  '3-5-2': {
    name: '3-5-2',
    positions: [
      // Goalkeeper
      { positionType: 'GK' as PositionType, x: 50, y: 90, defaultRole: 'gkd' },
      // Defense (3 CBs)
      { positionType: 'LCB' as PositionType, x: 25, y: 75, defaultRole: 'cdd' },
      { positionType: 'CB' as PositionType, x: 50, y: 75, defaultRole: 'bpdd' },
      { positionType: 'RCB' as PositionType, x: 75, y: 75, defaultRole: 'cdd' },
      // Wing Backs
      { positionType: 'LWB' as PositionType, x: 10, y: 50, defaultRole: 'cwba' },
      { positionType: 'RWB' as PositionType, x: 90, y: 50, defaultRole: 'cwba' },
      // Midfield
      { positionType: 'LDMF' as PositionType, x: 35, y: 55, defaultRole: 'dlps' },
      { positionType: 'RDMF' as PositionType, x: 65, y: 55, defaultRole: 'b2bs' },
      { positionType: 'CAMF' as PositionType, x: 50, y: 40, defaultRole: 'aps' },
      // Attack
      { positionType: 'LST' as PositionType, x: 35, y: 20, defaultRole: 'dlfs' },
      { positionType: 'RST' as PositionType, x: 65, y: 20, defaultRole: 'afa' }
    ]
  },
  
  '4-1-2-1-2': {
    name: '4-1-2-1-2 Narrow Diamond',
    positions: [
      // Goalkeeper
      { positionType: 'GK' as PositionType, x: 50, y: 90, defaultRole: 'gkd' },
      // Defense
      { positionType: 'LB' as PositionType, x: 15, y: 70, defaultRole: 'fbs' },
      { positionType: 'LCB' as PositionType, x: 35, y: 75, defaultRole: 'cdd' },
      { positionType: 'RCB' as PositionType, x: 65, y: 75, defaultRole: 'cdd' },
      { positionType: 'RB' as PositionType, x: 85, y: 70, defaultRole: 'fbs' },
      // Defensive Midfield
      { positionType: 'CDMF' as PositionType, x: 50, y: 60, defaultRole: 'ad' },
      // Central Midfield
      { positionType: 'LCM' as PositionType, x: 35, y: 45, defaultRole: 'b2bs' },
      { positionType: 'RCM' as PositionType, x: 65, y: 45, defaultRole: 'b2bs' },
      // Attacking Midfield
      { positionType: 'CAMF' as PositionType, x: 50, y: 35, defaultRole: 'aps' },
      // Attack
      { positionType: 'LST' as PositionType, x: 40, y: 15, defaultRole: 'dlfs' },
      { positionType: 'RST' as PositionType, x: 60, y: 15, defaultRole: 'afa' }
    ]
  },
  
  '5-3-2': {
    name: '5-3-2',
    positions: [
      // Goalkeeper
      { positionType: 'GK' as PositionType, x: 50, y: 90, defaultRole: 'gkd' },
      // Defense
      { positionType: 'LWB' as PositionType, x: 10, y: 65, defaultRole: 'cwbs' },
      { positionType: 'LCB' as PositionType, x: 30, y: 75, defaultRole: 'cdd' },
      { positionType: 'CB' as PositionType, x: 50, y: 78, defaultRole: 'cds' },
      { positionType: 'RCB' as PositionType, x: 70, y: 75, defaultRole: 'cdd' },
      { positionType: 'RWB' as PositionType, x: 90, y: 65, defaultRole: 'cwbs' },
      // Midfield
      { positionType: 'LCM' as PositionType, x: 30, y: 50, defaultRole: 'cms' },
      { positionType: 'CM' as PositionType, x: 50, y: 48, defaultRole: 'dlps' },
      { positionType: 'RCM' as PositionType, x: 70, y: 50, defaultRole: 'cms' },
      // Attack
      { positionType: 'LST' as PositionType, x: 35, y: 20, defaultRole: 'dlfs' },
      { positionType: 'RST' as PositionType, x: 65, y: 20, defaultRole: 'afa' }
    ]
  },
  
  '4-2-2-2': {
    name: '4-2-2-2',
    positions: [
      // Goalkeeper
      { positionType: 'GK' as PositionType, x: 50, y: 90, defaultRole: 'gkd' },
      // Defense
      { positionType: 'LB' as PositionType, x: 15, y: 70, defaultRole: 'fbd' },
      { positionType: 'LCB' as PositionType, x: 35, y: 75, defaultRole: 'cdd' },
      { positionType: 'RCB' as PositionType, x: 65, y: 75, defaultRole: 'cdd' },
      { positionType: 'RB' as PositionType, x: 85, y: 70, defaultRole: 'fbd' },
      // Defensive Midfield
      { positionType: 'LDMF' as PositionType, x: 35, y: 55, defaultRole: 'dms' },
      { positionType: 'RDMF' as PositionType, x: 65, y: 55, defaultRole: 'dms' },
      // Wide Midfield
      { positionType: 'LW' as PositionType, x: 15, y: 40, defaultRole: 'ws' },
      { positionType: 'RW' as PositionType, x: 85, y: 40, defaultRole: 'ws' },
      // Attack
      { positionType: 'LST' as PositionType, x: 35, y: 15, defaultRole: 'cfs' },
      { positionType: 'RST' as PositionType, x: 65, y: 15, defaultRole: 'afa' }
    ]
  },
  
  '3-4-3': {
    name: '3-4-3',
    positions: [
      // Goalkeeper
      { positionType: 'GK' as PositionType, x: 50, y: 90, defaultRole: 'gkd' },
      // Defense
      { positionType: 'LCB' as PositionType, x: 25, y: 75, defaultRole: 'bpdc' },
      { positionType: 'CB' as PositionType, x: 50, y: 75, defaultRole: 'cds' },
      { positionType: 'RCB' as PositionType, x: 75, y: 75, defaultRole: 'bpdc' },
      // Midfield
      { positionType: 'LWB' as PositionType, x: 10, y: 50, defaultRole: 'cwba' },
      { positionType: 'LCM' as PositionType, x: 35, y: 50, defaultRole: 'cms' },
      { positionType: 'RCM' as PositionType, x: 65, y: 50, defaultRole: 'cms' },
      { positionType: 'RWB' as PositionType, x: 90, y: 50, defaultRole: 'cwba' },
      // Attack
      { positionType: 'LW' as PositionType, x: 20, y: 25, defaultRole: 'ifa' },
      { positionType: 'ST' as PositionType, x: 50, y: 15, defaultRole: 'afa' },
      { positionType: 'RW' as PositionType, x: 80, y: 25, defaultRole: 'ifa' }
    ]
  }
}

// Helper function to get formation by name
export function getFormation(name: string): FormationTemplate | undefined {
  return formations[name]
}

// Get all formation names
export function getFormationNames(): string[] {
  return Object.keys(formations)
}
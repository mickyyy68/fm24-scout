export interface Player {
  // Basic Info
  Name: string
  Age: number
  Club: string
  Nationality: string
  Position: string
  
  // Contract
  Value?: string
  'Transfer Value'?: string
  Wage?: string
  
  // Technical Attributes
  Cor: number
  Cro: number
  Dri: number
  Fin: number
  Fir: number
  Fla: number
  Hea: number
  Lon: number
  Mar: number
  Pas: number
  Tck: number
  Tec: number
  
  // Mental Attributes
  Agg: number
  Ant: number
  Bra: number
  Com: number
  Cmp: number
  Cnt: number
  Dec: number
  Det: number
  Ldr: number
  OtB: number
  Pos: number
  Tea: number
  Vis: number
  Wor: number
  
  // Physical Attributes
  Acc: number
  Agi: number
  Bal: number
  Jum: number
  Pac: number
  Sta: number
  Str: number
  
  // Goalkeeper Attributes
  '1v1': number
  Aer: number
  Cmd: number
  Han: number
  Kic: number
  Ref: number
  TRO: number
  Thr: number
  
  // Calculated
  Speed?: number
  WorkRate?: number
  SetPieces?: number
  
  // Scores
  roleScores?: Record<string, number>
  bestRole?: RoleScore
}

export interface Role {
  code: string
  name: string
}

export interface RoleData {
  Role: string
  RoleCode: string
  [key: string]: string | number
}

export interface RoleScore {
  code: string
  name: string
  score: number
}

// Re-export squad types
export * from './squad'
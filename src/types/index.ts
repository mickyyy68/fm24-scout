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

// ============ Advanced filtering & presets ============

export type LogicalOperator = 'AND' | 'OR'

export type NumericOperator = '>=' | '<=' | '>' | '<' | '=' | 'between'

export type StringOperator = 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'in'

export type QueryField =
  // Basic info
  | 'Age'
  | 'Position'
  | 'Club'
  | 'Nationality'
  // Technical
  | 'Cor' | 'Cro' | 'Dri' | 'Fin' | 'Fir' | 'Fla' | 'Hea' | 'Lon' | 'Mar' | 'Pas' | 'Tck' | 'Tec'
  // Mental
  | 'Agg' | 'Ant' | 'Bra' | 'Com' | 'Cmp' | 'Cnt' | 'Dec' | 'Det' | 'Ldr' | 'OtB' | 'Pos' | 'Tea' | 'Vis' | 'Wor'
  // Physical
  | 'Acc' | 'Agi' | 'Bal' | 'Jum' | 'Pac' | 'Sta' | 'Str'
  // Goalkeeper
  | '1v1' | 'Aer' | 'Cmd' | 'Han' | 'Kic' | 'Ref' | 'TRO' | 'Thr'
  // Derived
  | 'Speed' | 'WorkRate' | 'SetPieces'

export interface NumericRule {
  type: 'numeric'
  field: QueryField
  operator: NumericOperator
  value: number
  value2?: number // used when operator === 'between'
}

export interface StringRule {
  type: 'string'
  field: QueryField
  operator: StringOperator
  value: string | string[]
  caseSensitive?: boolean
}

export type QueryRule = NumericRule | StringRule

export interface QueryGroup {
  op: LogicalOperator
  rules: (QueryRule | QueryGroup)[]
}

export interface FilterPresetConfig {
  globalText: string
  columnFilters: any // ColumnFiltersState (kept generic to avoid tight coupling)
  columnVisibility: Record<string, boolean>
  queryGroup: QueryGroup | null
  sorting?: any // SortingState
  pageSize?: number
}

export interface FilterPreset {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  config: FilterPresetConfig
}

// ============ Role presets ============

export interface RolePresetConfig {
  selectedRoleCodes: string[]
  visibleRoleColumnCodes: string[]
}

export interface RolePreset {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  config: RolePresetConfig
}

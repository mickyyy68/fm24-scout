import type { Player, QueryGroup, QueryRule, NumericRule, StringRule } from '@/types'

function getNumericValue(player: Player, field: string): number {
  // Derived metrics
  if (field === 'Speed') return ((player.Pac ?? 0) + (player.Acc ?? 0)) / 2
  if (field === 'WorkRate') return ((player.Wor ?? 0) + (player.Sta ?? 0)) / 2
  if (field === 'SetPieces') return ((player.Cor ?? 0) + 0 + 0 + 0 + (player.Thr ?? 0)) / 2 // Simplified: only Corners + Throwing if available

  // Basic numeric fields
  return Number((player as any)[field] ?? 0)
}

function evalNumericRule(player: Player, rule: NumericRule): boolean {
  const v = getNumericValue(player, rule.field)
  switch (rule.operator) {
    case '>=': return v >= rule.value
    case '<=': return v <= rule.value
    case '>': return v > rule.value
    case '<': return v < rule.value
    case '=': return v === rule.value
    case 'between': return v >= Math.min(rule.value, rule.value2 ?? rule.value) && v <= Math.max(rule.value, rule.value2 ?? rule.value)
    default: return true
  }
}

function getStringValue(player: Player, field: string): string {
  const raw = String((player as any)[field] ?? '')
  return raw
}

function evalStringRule(player: Player, rule: StringRule): boolean {
  const val = getStringValue(player, rule.field)
  const hay = rule.caseSensitive ? val : val.toLowerCase()

  if (Array.isArray(rule.value)) {
    const list = rule.caseSensitive ? rule.value : rule.value.map((v) => String(v).toLowerCase())
    return list.includes(hay)
  }

  const needle = rule.caseSensitive ? String(rule.value) : String(rule.value).toLowerCase()

  switch (rule.operator) {
    case 'equals': return hay === needle
    case 'contains': return hay.includes(needle)
    case 'startsWith': return hay.startsWith(needle)
    case 'endsWith': return hay.endsWith(needle)
    case 'in': return hay.split(',').map((p) => (rule.caseSensitive ? p : p.toLowerCase()).trim()).includes(needle)
    default: return true
  }
}

export function evaluateRule(player: Player, rule: QueryRule): boolean {
  if (rule.type === 'numeric') return evalNumericRule(player, rule)
  return evalStringRule(player, rule)
}

export function evaluateGroup(player: Player, group: QueryGroup | null): boolean {
  if (!group || group.rules.length === 0) return true
  const results = group.rules.map((r) => (isGroup(r) ? evaluateGroup(player, r) : evaluateRule(player, r)))
  return group.op === 'AND' ? results.every(Boolean) : results.some(Boolean)
}

function isGroup(x: QueryGroup | QueryRule): x is QueryGroup {
  return (x as any).op !== undefined && Array.isArray((x as any).rules)
}

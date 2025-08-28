import { useEffect, useState } from 'react'
import { useFilterStore } from '@/store/filter-store'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import type { LogicalOperator, NumericOperator, QueryField, QueryGroup, QueryRule, StringOperator } from '@/types'
import { Trash2, Layers } from 'lucide-react'

interface QueryBuilderProps {
  open: boolean
  onOpenChange: (v: boolean) => void
}

const numericFields: QueryField[] = [
  'Age','Acc','Pac','Str','Agi','Bal','Jum','Sta',
  'Dri','Fin','Hea','Pas','Tec','Cro','Mar','Tck','Pos','Vis','Com','Cnt','Dec','Det','Wor','Fir','Lon','Cor','Ant','Bra','Ldr','OtB',
  'Agg','Cmp',
  '1v1','Aer','Cmd','Han','Kic','Ref','TRO','Thr',
  'Speed','WorkRate','SetPieces'
]

const stringFields: QueryField[] = ['Position', 'Club', 'Nationality']

const numericOperators: NumericOperator[] = ['>=','<=','>','<','=','between']
const stringOperators: StringOperator[] = ['contains','equals','startsWith','endsWith']

function isGroup(item: QueryRule | QueryGroup): item is QueryGroup {
  return (item as any).op !== undefined
}

export function QueryBuilder({ open, onOpenChange }: QueryBuilderProps) {
  const { currentQuery, setQuery } = useFilterStore()
  const [localGroup, setLocalGroup] = useState<QueryGroup>(
    currentQuery ?? { op: 'AND', rules: [] }
  )

  // Sync local state with the active query whenever the dialog opens
  useEffect(() => {
    if (open) {
      setLocalGroup(currentQuery ?? { op: 'AND', rules: [] })
    }
  }, [open, currentQuery])

  const updateGroupOp = (op: LogicalOperator) => setLocalGroup({ ...localGroup, op })

  const addNumericRule = () => {
    const rule: QueryRule = { type: 'numeric', field: 'Age', operator: '>=', value: 18 }
    setLocalGroup({ ...localGroup, rules: [...localGroup.rules, rule] })
  }

  const addStringRule = () => {
    const rule: QueryRule = { type: 'string', field: 'Position', operator: 'contains', value: '' }
    setLocalGroup({ ...localGroup, rules: [...localGroup.rules, rule] })
  }

  const addNestedGroup = () => {
    const group: QueryGroup = { op: 'AND', rules: [] }
    setLocalGroup({ ...localGroup, rules: [...localGroup.rules, group] })
  }

  const updateRule = (idx: number, patch: Partial<QueryRule>) => {
    setLocalGroup({
      ...localGroup,
      rules: localGroup.rules.map((r, i) => (i === idx ? { ...(r as any), ...patch } : r)),
    })
  }

  const removeItem = (idx: number) => {
    setLocalGroup({ ...localGroup, rules: localGroup.rules.filter((_, i) => i !== idx) })
  }

  const apply = () => {
    // Normalize: empty rules => null
    const cleaned: QueryGroup | null = localGroup.rules.length === 0 ? null : localGroup
    setQuery(cleaned)
    onOpenChange(false)
  }

  const reset = () => setLocalGroup({ op: 'AND', rules: [] })

  const RuleRow = ({ rule, idx, nested }: { rule: QueryRule; idx: number; nested?: boolean }) => (
    <div className="flex items-center gap-2">
      <Select
        value={rule.type === 'numeric' ? 'numeric' : 'string'}
        onValueChange={(v) => {
          if (v === 'numeric') updateRule(idx, { type: 'numeric', field: 'Age', operator: '>=', value: 0 } as any)
          else updateRule(idx, { type: 'string', field: 'Position', operator: 'contains', value: '' } as any)
        }}
      >
        <SelectTrigger className="w-[110px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="numeric">Numeric</SelectItem>
          <SelectItem value="string">Text</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={rule.field as string}
        onValueChange={(v) => updateRule(idx, { field: v as QueryField })}
      >
        <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
        <SelectContent className="max-h-80">
          {(rule.type === 'numeric' ? numericFields : stringFields).map((f) => (
            <SelectItem key={f} value={f}>{f}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {rule.type === 'numeric' ? (
        <>
          <Select
            value={rule.operator}
            onValueChange={(v) => updateRule(idx, { operator: v as NumericOperator })}
          >
            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {numericOperators.map((op) => (
                <SelectItem key={op} value={op}>{op}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={String(rule.value ?? '')}
            onChange={(e) => updateRule(idx, { value: Number(e.target.value) } as any)}
            className="w-[90px]"
          />
          {rule.operator === 'between' && (
            <Input
              type="number"
              value={String((rule as any).value2 ?? '')}
              onChange={(e) => updateRule(idx, { value2: Number(e.target.value) } as any)}
              className="w-[90px]"
            />
          )}
        </>
      ) : (
        <>
          <Select
            value={(rule as any).operator}
            onValueChange={(v) => updateRule(idx, { operator: v as StringOperator })}
          >
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {stringOperators.map((op) => (
                <SelectItem key={op} value={op}>{op}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={String((rule as any).value ?? '')}
            onChange={(e) => updateRule(idx, { value: e.target.value } as any)}
            className="w-[220px]"
          />
        </>
      )}

      <Button variant="ghost" size="icon" onClick={() => (nested ? null : removeItem(idx))}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Multi-Attribute Search</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Top-level group operator */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Match</span>
            <Select value={localGroup.op} onValueChange={(v) => updateGroupOp(v as LogicalOperator)}>
              <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="AND">ALL</SelectItem>
                <SelectItem value="OR">ANY</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm">of the following rules</span>
          </div>

          {/* Rules */}
          <div className="space-y-2">
            {localGroup.rules.map((item, idx) => (
              isGroup(item) ? (
                <div key={`g-${idx}`} className="rounded border p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    <span className="text-sm">Nested group</span>
                    <Select
                      value={item.op}
                      onValueChange={(v) => {
                        const updated = { ...item, op: v as LogicalOperator }
                        setLocalGroup({ ...localGroup, rules: localGroup.rules.map((r, i) => (i === idx ? updated : r)) })
                      }}
                    >
                      <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">ALL</SelectItem>
                        <SelectItem value="OR">ANY</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(idx)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {item.rules.map((r, rIdx) => (
                      <RuleRow key={`r-${idx}-${rIdx}`} rule={r as QueryRule} idx={rIdx} nested />
                    ))}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => {
                        const newRule: QueryRule = { type: 'numeric', field: 'Age', operator: '>=', value: 0 }
                        const updated = { ...item, rules: [...item.rules, newRule] }
                        setLocalGroup({ ...localGroup, rules: localGroup.rules.map((r, i) => (i === idx ? updated : r)) })
                      }}>Add rule</Button>
                    </div>
                  </div>
                </div>
              ) : (
                <RuleRow key={`r-${idx}`} rule={item as QueryRule} idx={idx} />
              )
            ))}
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={addNumericRule}>Add numeric rule</Button>
            <Button size="sm" variant="outline" onClick={addStringRule}>Add text rule</Button>
            <Button size="sm" variant="outline" onClick={addNestedGroup}>Add group</Button>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={reset}>Clear</Button>
            <Button onClick={apply}>Apply</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

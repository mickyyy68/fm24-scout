import { useState } from 'react'
import { Table } from '@tanstack/react-table'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Player } from '@/types'

interface PlayerFiltersProps {
  table: Table<Player>
}

export function PlayerFilters({ table }: PlayerFiltersProps) {
  const [filters, setFilters] = useState<Record<string, string>>({})

  const applyFilter = (column: string, value: string) => {
    if (value) {
      table.getColumn(column)?.setFilterValue(value)
      setFilters(prev => ({ ...prev, [column]: value }))
    } else {
      table.getColumn(column)?.setFilterValue(undefined)
      setFilters(prev => {
        const newFilters = { ...prev }
        delete newFilters[column]
        return newFilters
      })
    }
  }

  const clearFilters = () => {
    table.getAllColumns().forEach(column => {
      column.setFilterValue(undefined)
    })
    setFilters({})
  }

  const activeFiltersCount = Object.keys(filters).length

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 p-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Position</label>
              <Input
                placeholder="e.g., ST, AM"
                value={filters.Position || ''}
                onChange={(e) => applyFilter('Position', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Club</label>
              <Input
                placeholder="Club name"
                value={filters.Club || ''}
                onChange={(e) => applyFilter('Club', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Max Price</label>
              <Input
                placeholder="e.g., 5M or 500K"
                value={filters.maxPrice || ''}
                onChange={(e) => {
                  const value = e.target.value
                  if (value) {
                    // Allow inputs like "5", "5m", "500k"
                    const raw = value.trim()
                    // Reuse lightweight parser here to interpret suffixes
                    let n = 0
                    const m = raw.toLowerCase().match(/^([0-9]*\.?[0-9]+)\s*([kmb])?$/)
                    if (m) {
                      const base = parseFloat(m[1])
                      const suf = (m[2] || '').toLowerCase()
                      if (suf === 'k') n = base * 1_000
                      else if (suf === 'm' || suf === '') n = base * 1_000_000
                      else if (suf === 'b') n = base * 1_000_000_000
                    } else {
                      // Fallback: treat plain number as millions
                      const base = parseFloat(raw)
                      n = isNaN(base) ? 0 : base * 1_000_000
                    }

                    const current = (table.getColumn('Price')?.getFilterValue() as any) || {}
                    table.getColumn('Price')?.setFilterValue({
                      ...current,
                      max: n,
                    })
                    setFilters((prev) => ({ ...prev, maxPrice: value }))
                  } else {
                    const current = (table.getColumn('Price')?.getFilterValue() as any) || {}
                    const { max, ...rest } = current
                    if (Object.keys(rest).length > 0) {
                      table.getColumn('Price')?.setFilterValue(rest)
                    } else {
                      table.getColumn('Price')?.setFilterValue(undefined)
                    }
                    setFilters((prev) => {
                      const { maxPrice, ...r } = prev
                      return r
                    })
                  }
                }}
                className="mt-1"
              />
              <div className="text-xs text-muted-foreground mt-1">Interprets bare numbers as millions.</div>
            </div>
            <div>
              <label className="text-sm font-medium">Min Age</label>
              <Input
                type="number"
                placeholder="15"
                value={filters.minAge || ''}
                onChange={(e) => {
                  const value = e.target.value
                  if (value) {
                    const currentFilter = table.getColumn('Age')?.getFilterValue() as any || {}
                    table.getColumn('Age')?.setFilterValue({
                      ...currentFilter,
                      min: parseInt(value)
                    })
                    setFilters(prev => ({ ...prev, minAge: value }))
                  } else {
                    const currentFilter = table.getColumn('Age')?.getFilterValue() as any || {}
                    const { min, ...rest } = currentFilter
                    if (Object.keys(rest).length > 0) {
                      table.getColumn('Age')?.setFilterValue(rest)
                    } else {
                      table.getColumn('Age')?.setFilterValue(undefined)
                    }
                    setFilters(prev => {
                      const { minAge, ...rest } = prev
                      return rest
                    })
                  }
                }}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Max Age</label>
              <Input
                type="number"
                placeholder="40"
                value={filters.maxAge || ''}
                onChange={(e) => {
                  const value = e.target.value
                  if (value) {
                    const currentFilter = table.getColumn('Age')?.getFilterValue() as any || {}
                    table.getColumn('Age')?.setFilterValue({
                      ...currentFilter,
                      max: parseInt(value)
                    })
                    setFilters(prev => ({ ...prev, maxAge: value }))
                  } else {
                    const currentFilter = table.getColumn('Age')?.getFilterValue() as any || {}
                    const { max, ...rest } = currentFilter
                    if (Object.keys(rest).length > 0) {
                      table.getColumn('Age')?.setFilterValue(rest)
                    } else {
                      table.getColumn('Age')?.setFilterValue(undefined)
                    }
                    setFilters(prev => {
                      const { maxAge, ...rest } = prev
                      return rest
                    })
                  }
                }}
                className="mt-1"
              />
            </div>
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

import type { FilterPresetConfig } from '@/types'
import type { Table, ColumnFiltersState, VisibilityState, SortingState } from '@tanstack/react-table'
import type { Player } from '@/types'

export function capturePresetFromTable(
  table: Table<Player>,
  params: { globalText: string; pageSize?: number; queryGroup: any }
): FilterPresetConfig {
  const columnFilters = table.getState().columnFilters as ColumnFiltersState
  const columnVisibilityRaw = table.getState().columnVisibility as VisibilityState
  // Never persist internal helper column visibility
  const { queryMatch, ...columnVisibility } = columnVisibilityRaw || {}
  const sorting = table.getState().sorting as SortingState
  return {
    globalText: params.globalText,
    columnFilters,
    columnVisibility,
    queryGroup: params.queryGroup ?? null,
    sorting,
    pageSize: params.pageSize,
  }
}

export function applyPresetToTable(
  table: Table<Player>,
  cfg: FilterPresetConfig,
  handlers: { setGlobalText: (v: string) => void; setPageSize: (n: number) => void }
) {
  // Set core table state
  table.setColumnFilters(cfg.columnFilters ?? [])
  const { queryMatch: _qm, ...restVis } = cfg.columnVisibility ?? {}
  table.setColumnVisibility(restVis)
  table.setSorting(cfg.sorting ?? [])
  if (cfg.pageSize) {
    handlers.setPageSize(cfg.pageSize)
    table.setPageSize(cfg.pageSize)
  }
  // Global text (non-debounced)
  handlers.setGlobalText(cfg.globalText ?? '')
}

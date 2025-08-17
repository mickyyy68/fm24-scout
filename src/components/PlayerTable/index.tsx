import { useState, useMemo, useCallback } from 'react'
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppStore } from '@/store/app-store'
import { Player } from '@/types'
import { exportToCSV, exportToJSON } from './export-utils'
import { PlayerFilters } from './PlayerFilters'
import { ColumnVisibilityToggle } from './ColumnVisibilityToggle'

export function PlayerTable() {
  const { players, selectedRoles, visibleRoleColumns, isCalculating, calculateScores } = useAppStore()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [pageSize, setPageSize] = useState(50)
  
  // Get visible roles from selected roles
  const visibleRoles = selectedRoles.filter(role => 
    visibleRoleColumns.includes(role.code)
  )

  // Define columns dynamically based on selected roles
  const columns = useMemo<ColumnDef<Player>[]>(() => {
    const baseColumns: ColumnDef<Player>[] = [
      {
        accessorKey: 'Name',
        header: ({ column }) => (
          <div
            className="flex items-center cursor-pointer select-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <span>Name</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue('Name')}</div>
        ),
      },
      {
        accessorKey: 'Age',
        header: ({ column }) => (
          <div
            className="flex items-center cursor-pointer select-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <span>Age</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.getValue('Age')}</div>
        ),
        filterFn: (row, id, value) => {
          const age = row.getValue(id) as number
          if (!value) return true
          const { min, max } = value
          if (min !== undefined && max !== undefined) {
            return age >= min && age <= max
          }
          if (min !== undefined) {
            return age >= min
          }
          if (max !== undefined) {
            return age <= max
          }
          return true
        },
      },
      {
        accessorKey: 'Club',
        header: ({ column }) => (
          <div
            className="flex items-center cursor-pointer select-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <span>Club</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="max-w-[200px] truncate">{row.getValue('Club')}</div>
        ),
      },
      {
        accessorKey: 'Position',
        header: ({ column }) => (
          <div
            className="flex items-center cursor-pointer select-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <span>Position</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        ),
        cell: ({ row }) => {
          const positions = String(row.getValue('Position')).split(',')
          return (
            <div className="flex gap-1 flex-wrap">
              {positions.map((pos, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {pos.trim()}
                </Badge>
              ))}
            </div>
          )
        },
      },
      {
        accessorKey: 'Value',
        header: ({ column }) => (
          <div
            className="flex items-center cursor-pointer select-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <span>Value</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right font-medium">{row.getValue('Value')}</div>
        ),
      },
      {
        accessorKey: 'Wage',
        header: ({ column }) => (
          <div
            className="flex items-center cursor-pointer select-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <span>Wage</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right">{row.getValue('Wage')}</div>
        ),
      },
    ]

    // Add role score columns
    const roleColumns: ColumnDef<Player>[] = visibleRoles.map(role => ({
      id: `role_${role.code}`,
      accessorFn: (row) => row.roleScores?.[role.code] || 0,
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span className="truncate">{role.name}</span>
          <ArrowUpDown className="ml-2 h-4 w-4 flex-shrink-0" />
        </div>
      ),
      cell: ({ row }) => {
        const score = row.original.roleScores?.[role.code] || 0
        const isBest = row.original.bestRole?.code === role.code
        return (
          <div className={`text-center ${isBest ? 'font-bold text-primary' : ''}`}>
            {score.toFixed(1)}
          </div>
        )
      },
    }))

    // Add best role column if roles are visible
    const bestRoleColumn: ColumnDef<Player>[] = visibleRoles.length > 0 ? [{
      id: 'bestRole',
      accessorFn: (row) => row.bestRole?.score || 0,
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span>Best Role</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => {
        const bestRole = row.original.bestRole
        if (!bestRole) return null
        return (
          <div className="text-center">
            <Badge variant="default" className="mb-1">
              {bestRole.name}
            </Badge>
            <div className="text-sm font-semibold">{bestRole.score.toFixed(1)}</div>
          </div>
        )
      },
    }] : []

    return [...baseColumns, ...roleColumns, ...bestRoleColumn]
  }, [visibleRoles])

  const table = useReactTable({
    data: players,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
  })

  const handleExportCSV = useCallback(() => {
    exportToCSV(table.getFilteredRowModel().rows.map(r => r.original), visibleRoles)
  }, [visibleRoles])

  const handleExportJSON = useCallback(() => {
    exportToJSON(table.getFilteredRowModel().rows.map(r => r.original))
  }, [])

  if (players.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Player Analysis</CardTitle>
            <CardDescription>
              {table.getFilteredRowModel().rows.length} of {players.length} players
              {selectedRoles.length > 0 && ` • ${selectedRoles.length} roles selected`}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {selectedRoles.length > 0 && (
              <Button
                onClick={calculateScores}
                disabled={isCalculating}
                variant="default"
              >
                {isCalculating ? 'Calculating...' : 'Calculate Scores'}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={players.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJSON}
              disabled={players.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Search players..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full"
            />
          </div>
          <PlayerFilters table={table} />
          <ColumnVisibilityToggle table={table} />
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-sm font-medium"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-t transition-colors hover:bg-muted/50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 text-sm">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No results found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Rows per page:
            </p>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                const size = Number(value)
                setPageSize(size)
                table.setPageSize(size)
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100, 250].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
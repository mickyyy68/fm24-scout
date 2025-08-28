import { useRef, useCallback, useState, useEffect } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Table, flexRender } from '@tanstack/react-table'
import { Player } from '@/types'

// Configuration constants
const TABLE_CONFIG = {
  BASE_ROW_HEIGHT: 48,
  OVERSCAN_COUNT: 10, // Number of extra rows to render outside viewport
  DEFAULT_ZOOM: 100,
} as const

interface VirtualizedTableProps {
  table: Table<Player>
  zoom?: number
}

export function VirtualizedTable({ table, zoom = TABLE_CONFIG.DEFAULT_ZOOM }: VirtualizedTableProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerHeight, setHeaderHeight] = useState(0)
  const { rows } = table.getRowModel()
  
  // Measure header height
  useEffect(() => {
    if (headerRef.current) {
      const height = headerRef.current.getBoundingClientRect().height
      setHeaderHeight(height)
    }
  }, [table.getHeaderGroups()])
  
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => TABLE_CONFIG.BASE_ROW_HEIGHT, []), // Keep row height constant - zoom is applied via transform
    overscan: TABLE_CONFIG.OVERSCAN_COUNT, // Render extra rows outside viewport
  })

  const virtualItems = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()
  
  return (
    <div 
      ref={parentRef} 
      className="h-[600px] overflow-auto rounded-md border"
      style={{ contain: 'strict' }}
    >
      <div style={{ height: `${totalSize + headerHeight}px`, width: '100%', position: 'relative' }}>
        {/* Sticky Header */}
        <div 
          ref={headerRef}
          className="sticky top-0 z-10 bg-background border-b"
          style={{ position: 'sticky', top: 0 }}
        >
          <table 
            className="w-full tabular-nums" 
            style={{ 
              tableLayout: 'fixed',
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top left',
              width: `${100 / (zoom / 100)}%`
            }}>
            <thead className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-sm font-medium"
                      style={{ width: header.getSize() }}
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
          </table>
        </div>
        
        {/* Virtual Body */}
        <div
          style={{
            position: 'absolute',
            top: headerHeight,
            left: 0,
            width: '100%',
            transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
          }}
        >
          <table 
            className="w-full tabular-nums" 
            style={{ 
              tableLayout: 'fixed',
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top left',
              width: `${100 / (zoom / 100)}%`
            }}>
            <tbody>
              {virtualItems.map((virtualRow) => {
                const row = rows[virtualRow.index]
                return (
                  <tr
                    key={row.id}
                    data-index={virtualRow.index}
                    className="border-t transition-colors hover:bg-muted/50"
                    style={{
                      height: `${virtualRow.size}px`,
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td 
                        key={cell.id} 
                        className="px-4 py-3 text-sm"
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

import { useRef, useCallback } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Table, flexRender } from '@tanstack/react-table'
import { Player } from '@/types'

interface VirtualizedTableProps {
  table: Table<Player>
}

export function VirtualizedTable({ table }: VirtualizedTableProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const { rows } = table.getRowModel()
  
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 48, []), // Estimated row height
    overscan: 10, // Render 10 extra rows outside viewport
  })

  const virtualItems = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()
  
  return (
    <div 
      ref={parentRef} 
      className="h-[600px] overflow-auto rounded-md border"
      style={{ contain: 'strict' }}
    >
      <div style={{ height: `${totalSize}px`, width: '100%', position: 'relative' }}>
        {/* Sticky Header */}
        <div 
          className="sticky top-0 z-10 bg-background border-b"
          style={{ position: 'sticky', top: 0 }}
        >
          <table className="w-full">
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
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
          }}
        >
          <table className="w-full">
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
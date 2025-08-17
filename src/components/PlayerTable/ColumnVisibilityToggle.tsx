import { Table } from '@tanstack/react-table'
import { Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Player } from '@/types'

interface ColumnVisibilityToggleProps {
  table: Table<Player>
}

export function ColumnVisibilityToggle({ table }: ColumnVisibilityToggleProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="h-4 w-4 mr-2" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 p-2 max-h-96 overflow-y-auto"
      >
        <div className="px-2 py-1.5 text-sm font-semibold">Toggle columns</div>
        <div className="h-px bg-border my-2" />
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <label
                key={column.id}
                className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded"
              >
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                  className="rounded border-input"
                />
                <span className="capitalize">
                  {column.id.replace(/_/g, ' ')}
                </span>
              </label>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
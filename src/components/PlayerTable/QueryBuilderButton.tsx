import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Filter } from 'lucide-react'
import { QueryBuilder } from './QueryBuilder'
import { useFilterStore } from '@/store/filter-store'

export function QueryBuilderButton() {
  const [open, setOpen] = useState(false)
  const { currentQuery } = useFilterStore()
  const active = !!currentQuery && (currentQuery.rules?.length ?? 0) > 0

  return (
    <>
      <Button variant={active ? 'default' : 'outline'} size="sm" onClick={() => setOpen(true)}>
        <Filter className="h-4 w-4 mr-2" />
        Query
      </Button>
      <QueryBuilder open={open} onOpenChange={setOpen} />
    </>
  )
}


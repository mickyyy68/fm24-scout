import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Search, Check, Eye, EyeOff } from 'lucide-react'
import { useAppStore } from '@/store/app-store'
import { DataManager } from '@/lib/data-manager'
import { cn } from '@/lib/utils'

const dataManager = new DataManager()

export function RoleSelector() {
  const { 
    selectedRoles, 
    visibleRoleColumns,
    addRole, 
    removeRole, 
    clearRoles,
    toggleRoleColumnVisibility 
  } = useAppStore()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  
  const allRoles = useMemo(() => dataManager.getAllRoles(), [])
  
  const filteredRoles = useMemo(() => {
    const searchLower = search.toLowerCase()
    return allRoles.filter(role =>
      role.name.toLowerCase().includes(searchLower) ||
      role.code.toLowerCase().includes(searchLower)
    )
  }, [allRoles, search])

  const groupedRoles = useMemo(() => {
    const groups: Record<string, typeof filteredRoles> = {
      'Goalkeeper': [],
      'Defender': [],
      'Wing Back': [],
      'Midfielder': [],
      'Winger': [],
      'Striker': [],
      'Other': []
    }
    
    filteredRoles.forEach(role => {
      const name = role.name.toLowerCase()
      if (name.includes('goalkeeper') || name.includes('sweeper keeper')) {
        groups['Goalkeeper'].push(role)
      } else if (name.includes('defender') || name.includes('libero') || name.includes('stopper')) {
        groups['Defender'].push(role)
      } else if (name.includes('wing back') || name.includes('full back')) {
        groups['Wing Back'].push(role)
      } else if (name.includes('midfielder') || name.includes('playmaker') || 
                 name.includes('mezzala') || name.includes('carrilero') ||
                 name.includes('regista') || name.includes('anchor')) {
        groups['Midfielder'].push(role)
      } else if (name.includes('winger') || name.includes('inverted') || name.includes('wide')) {
        groups['Winger'].push(role)
      } else if (name.includes('forward') || name.includes('striker') || 
                 name.includes('poacher') || name.includes('target') ||
                 name.includes('false') || name.includes('pressing')) {
        groups['Striker'].push(role)
      } else {
        groups['Other'].push(role)
      }
    })
    
    return Object.entries(groups).filter(([_, roles]) => roles.length > 0)
  }, [filteredRoles])

  const handleSelectRole = (role: { code: string; name: string }) => {
    const isSelected = selectedRoles.some(r => r.code === role.code)
    if (isSelected) {
      removeRole(role.code)
    } else {
      addRole(role)
    }
  }

  const handleSelectAll = () => {
    filteredRoles.forEach(role => {
      if (!selectedRoles.some(r => r.code === role.code)) {
        addRole(role)
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Role Selection & Table Columns</CardTitle>
          <div className="flex gap-2">
            {selectedRoles.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearRoles}
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Selected Roles Display */}
          <div>
            {selectedRoles.length === 0 ? (
              <p className="text-sm text-muted-foreground">No roles selected</p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Choose which role columns to show in the table:
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {selectedRoles.map(role => {
                    const isVisible = visibleRoleColumns.includes(role.code)
                    return (
                      <div
                        key={role.code}
                        className="flex items-center justify-between p-2 border rounded-md"
                      >
                        <span className="text-sm truncate mr-2">{role.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRoleColumnVisibility(role.code)}
                          className="h-auto p-1"
                        >
                          {isVisible ? (
                            <Eye className="h-4 w-4 text-primary" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {visibleRoleColumns.length} of {selectedRoles.length} columns visible in table
                </p>
              </div>
            )}
          </div>

          {/* Add Roles Button */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Roles ({selectedRoles.length}/{allRoles.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Select Player Roles</DialogTitle>
                <DialogDescription>
                  Choose the roles you want to evaluate players against
                </DialogDescription>
              </DialogHeader>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search roles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  Select All Visible ({filteredRoles.length})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearRoles}
                >
                  Clear Selection
                </Button>
              </div>

              {/* Roles List */}
              <div className="h-[400px] overflow-y-auto border rounded-md p-4">
                <div className="space-y-6">
                  {groupedRoles.map(([group, roles]) => (
                    <div key={group}>
                      <h3 className="font-semibold text-sm mb-2 text-muted-foreground">
                        {group} ({roles.length})
                      </h3>
                      <div className="grid grid-cols-4 gap-2">
                        {roles.map(role => {
                          const isSelected = selectedRoles.some(r => r.code === role.code)
                          return (
                            <button
                              key={role.code}
                              onClick={() => handleSelectRole(role)}
                              className={cn(
                                "flex items-center justify-between p-2 rounded-md text-sm transition-colors",
                                "hover:bg-accent",
                                isSelected && "bg-primary text-primary-foreground hover:bg-primary/90"
                              )}
                            >
                              <span className="truncate mr-2">{role.name}</span>
                              {isSelected && <Check className="h-4 w-4 shrink-0" />}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {selectedRoles.length} roles selected
                </p>
                <Button onClick={() => setOpen(false)}>
                  Done
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}

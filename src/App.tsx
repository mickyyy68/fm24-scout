import { ThemeProvider } from '@/components/theme-provider'
import { FileImport } from '@/components/FileImport'
import { RoleSelector } from '@/components/RoleSelector/index'
import { PlayerTable } from '@/components/PlayerTable/index'
import { PlayerComparison } from '@/components/PlayerComparison'
import { Squad } from '@/components/Squad/index'
import { useAppStore } from '@/store/app-store'
import { AppLayout } from '@/components/layout/AppLayout'
import * as React from 'react'

function App() {
  const { players } = useAppStore()
  const ACTIVE_PAGE_KEY = 'fm24-active-page'
  const [activePage, setActivePage] = React.useState<'players' | 'squad' | 'settings'>(() => {
    const saved = localStorage.getItem(ACTIVE_PAGE_KEY)
    if (saved === 'players' || saved === 'squad' || saved === 'settings') return saved
    return 'players'
  })

  React.useEffect(() => {
    localStorage.setItem(ACTIVE_PAGE_KEY, activePage)
  }, [activePage])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="fm24-theme">
      <AppLayout activePage={activePage} onSelectPage={setActivePage}>
        <div className="space-y-6">
          {activePage === 'players' && (
            <>
              <FileImport />
              {players.length > 0 ? (
                <div className="space-y-6">
                  <RoleSelector />
                  <PlayerTable />
                  <PlayerComparison />
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Import player data to get started</p>
                </div>
              )}
            </>
          )}

          {activePage === 'squad' && (
            <div className="space-y-6">
              <Squad />
            </div>
          )}

          {activePage === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Settings</h2>
              <p className="text-muted-foreground">App settings will appear here.</p>
            </div>
          )}
        </div>
      </AppLayout>
    </ThemeProvider>
  )
}

export default App

import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/layout/Header'
import { FileImport } from '@/components/FileImport'
import { RoleSelector } from '@/components/RoleSelector'
import { PlayerTable } from '@/components/PlayerTable'
import { useAppStore } from '@/store/app-store'

function App() {
  const { players } = useAppStore()

  return (
    <ThemeProvider defaultTheme="dark" storageKey="fm24-theme">
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto p-6">
          <div className="space-y-6">
            <FileImport />
            {players.length > 0 && (
              <>
                <RoleSelector />
                <PlayerTable />
              </>
            )}
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App

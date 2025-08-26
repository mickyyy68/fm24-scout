import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/layout/Header'
import { FileImport } from '@/components/FileImport'
import { RoleSelector } from '@/components/RoleSelector/index'
import { PlayerTable } from '@/components/PlayerTable/index'
import { PlayerComparison } from '@/components/PlayerComparison'
import { Squad } from '@/components/Squad/index'
import { useAppStore } from '@/store/app-store'
import { useSquadStore } from '@/store/squad-store'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

function App() {
  const { players } = useAppStore()
  const { getSquadPlayerCount, getStartingEleven } = useSquadStore()
  
  const squadCount = getSquadPlayerCount()
  const startingCount = getStartingEleven().length

  return (
    <ThemeProvider defaultTheme="dark" storageKey="fm24-theme">
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto p-6">
          <div className="space-y-6">
            <FileImport />
            {players.length > 0 ? (
              <Tabs defaultValue="players" className="space-y-4">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                  <TabsTrigger value="players" className="flex items-center gap-2">
                    Players
                    {players.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {players.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="squad" className="flex items-center gap-2">
                    Squad
                    {squadCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {startingCount}/11
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="players" className="space-y-6">
                  <RoleSelector />
                  <PlayerTable />
                  <PlayerComparison />
                </TabsContent>
                
                <TabsContent value="squad" className="space-y-6">
                  <Squad />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Import player data to get started</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App

import { useCallback, useState } from 'react'
import { useAppStore } from '@/store/app-store'
import { FileParser } from '@/lib/file-parser'
import { Alert } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { FileUpload } from '@/components/ui/file-upload'

export function FileImport() {
  const [progress, setProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const setPlayers = useAppStore(state => state.setPlayers)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setError(null)
    setIsProcessing(true)
    setProgress(10)

    try {
      const content = await file.text()
      setProgress(30)

      const parser = new FileParser()
      let players

      if (file.name.endsWith('.csv')) {
        players = parser.parseCSV(content)
      } else {
        players = parser.parseHTML(content)
      }

      setProgress(70)

      if (players.length > 20000) {
        throw new Error(`Too many players: ${players.length} (max 20,000)`)
      }

      setPlayers(players)
      setProgress(100)

      setTimeout(() => {
        setIsProcessing(false)
        setProgress(0)
      }, 500)
    } catch (error) {
      console.error('Import failed:', error)
      const message = (error instanceof Error && error.message) ? error.message : 'Failed to import file. Please ensure it is a valid FM export (HTML/CSV).'
      setError(message)
      setIsProcessing(false)
      setProgress(0)
    }
  }, [setPlayers])

  return (
    <div className="space-y-3">
      <FileUpload
        variant="dashed"
        onDrop={onDrop}
        accept={{ 'text/html': ['.html', '.htm'], 'text/csv': ['.csv'] }}
        multiple={false}
        disabled={isProcessing}
        processing={isProcessing}
        progress={progress}
      />
      {error && (
        <Alert
          variant="destructive"
          icon={AlertCircle}
          title="Import failed"
          dismissible
          onDismiss={() => setError(null)}
        >
          {error}
        </Alert>
      )}
    </div>
  )
}

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Upload, FileText } from 'lucide-react'
import { useAppStore } from '@/store/app-store'
import { FileParser } from '@/lib/file-parser'

export function FileImport() {
  const [progress, setProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const setPlayers = useAppStore(state => state.setPlayers)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

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
      setIsProcessing(false)
      setProgress(0)
    }
  }, [setPlayers])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/html': ['.html', '.htm'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    disabled: isProcessing,
  })

  return (
    <Card className={`transition-all ${isDragActive ? 'border-primary' : 'border-dashed'}`}>
      <CardContent className="p-12">
        <div
          {...getRootProps()}
          className={`text-center cursor-pointer ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
        >
          <input {...getInputProps()} />
          
          {isProcessing ? (
            <div className="space-y-4">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground animate-pulse" />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Processing file...</p>
                <Progress value={progress} className="w-full max-w-xs mx-auto" />
              </div>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">
                {isDragActive ? 'Drop the file here' : 'Drop file here or click to browse'}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Supports HTML and CSV files (max 20,000 players)
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
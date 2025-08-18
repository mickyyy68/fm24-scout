import Papa from 'papaparse'
import { Player } from '@/types'

export class FileParser {
  parseHTML(content: string): Player[] {
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const table = doc.querySelector('table')
    
    if (!table) {
      throw new Error('No table found in HTML file')
    }
    
    const headers: string[] = []
    const headerRow = table.querySelector('tr')
    
    if (!headerRow) {
      throw new Error('No header row found in table')
    }
    
    // Extract headers
    headerRow.querySelectorAll('th, td').forEach(cell => {
      let text = cell.textContent?.trim() || ''
      // Map common abbreviations and field names
      if (text === 'Nat') text = 'Nationality'
      if (text === 'Transfer Value') text = 'Value'
      headers.push(text)
    })
    
    // Extract data rows
    const players: Player[] = []
    const rows = table.querySelectorAll('tr')
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      const cells = row.querySelectorAll('td')
      
      if (cells.length !== headers.length) continue
      
      const playerData: any = {}
      
      cells.forEach((cell, index) => {
        const header = headers[index]
        const value = cell.textContent?.trim() || ''
        
        playerData[header] = this.parseAttributeValue(value)
      })
      
      // Skip invalid entries
      if (!playerData.Name || playerData.Name === '-') continue
      
      players.push(playerData as Player)
    }
    
    return players
  }
  
  parseCSV(content: string): Player[] {
    const result = Papa.parse<any>(content, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true
    })
    
    if (result.errors.length > 0) {
      console.warn('CSV parsing warnings:', result.errors)
    }
    
    return result.data
      .map(row => {
        const player: any = {}
        
        Object.entries(row).forEach(([key, value]) => {
          player[key] = this.parseAttributeValue(String(value))
        })
        
        return player as Player
      })
      .filter(p => p.Name && p.Name !== '-')
  }
  
  private parseAttributeValue(value: string): number | string {
    // Handle missing values
    if (!value || value === '-' || value === '') {
      return 0
    }
    
    // Handle range values (e.g., "14-16")
    if (value.includes('-') && !value.startsWith('-')) {
      const parts = value.split('-')
      if (parts.length === 2) {
        const min = parseFloat(parts[0])
        const max = parseFloat(parts[1])
        if (!isNaN(min) && !isNaN(max)) {
          return (min + max) / 2
        }
      }
    }
    
    // Try to parse as number
    const num = parseFloat(value)
    if (!isNaN(num)) {
      return num
    }
    
    // Return as string
    return value
  }
}
# FM Data Import Guide for Tauri App

## Overview
This guide shows multiple methods to import the FM roles data and player data files into your Tauri application.

## Method 1: Embed Data at Build Time (Recommended for roles.json)

### Frontend Approach (JavaScript/TypeScript)

#### Option A: Direct Import (Recommended)
```javascript
// src/data/rolesData.js
import rolesData from './roles.json';

export const getRoles = () => rolesData;
export const getRoleByCode = (code) => 
  rolesData.find(role => role.RoleCode === code);
export const getRolesByDuty = (duty) => 
  rolesData.filter(role => role.Role.includes(duty));
```

#### Option B: Async Import for Code Splitting
```javascript
// src/data/dataLoader.js
let rolesCache = null;

export async function loadRoles() {
  if (!rolesCache) {
    const module = await import('./roles.json');
    rolesCache = module.default;
  }
  return rolesCache;
}
```

### Backend Approach (Rust)

#### Include at Compile Time
```rust
// src-tauri/src/data/mod.rs
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Role {
    #[serde(rename = "Role")]
    pub role: String,
    #[serde(rename = "RoleCode")]
    pub role_code: String,
    #[serde(rename = "1v1")]
    pub one_v_one: u8,
    #[serde(rename = "Acc")]
    pub acceleration: u8,
    // ... add all 40 attributes
}

// Embed the JSON file at compile time
const ROLES_JSON: &str = include_str!("../../data/roles.json");

lazy_static::lazy_static! {
    pub static ref ROLES: Vec<Role> = {
        serde_json::from_str(ROLES_JSON)
            .expect("Failed to parse roles.json")
    };
}

// Tauri command to get roles
#[tauri::command]
pub fn get_roles() -> Vec<Role> {
    ROLES.clone()
}
```

## Method 2: Load from App Resources Directory

### Frontend with Tauri API
```javascript
// src/data/resourceLoader.js
import { readTextFile, BaseDirectory } from '@tauri-apps/api/fs';
import { resourceDir } from '@tauri-apps/api/path';

export async function loadRolesFromResource() {
  try {
    // Read from resources directory
    const resourcePath = await resourceDir();
    const content = await readTextFile('data/roles.json', {
      dir: BaseDirectory.Resource
    });
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to load roles:', error);
    // Fallback to embedded data
    return import('./roles.json').then(m => m.default);
  }
}
```

### Rust Backend Resource Loading
```rust
// src-tauri/src/data/resource_loader.rs
use std::fs;
use tauri::Manager;

#[tauri::command]
pub fn load_roles_from_resource(app_handle: tauri::AppHandle) -> Result<Vec<Role>, String> {
    let resource_path = app_handle
        .path_resolver()
        .resolve_resource("data/roles.json")
        .ok_or("Failed to resolve resource path")?;
    
    let content = fs::read_to_string(resource_path)
        .map_err(|e| e.to_string())?;
    
    serde_json::from_str(&content)
        .map_err(|e| e.to_string())
}
```

## Method 3: Dynamic File Import (For Player Data Files)

### Frontend File Dialog and Processing
```javascript
// src/fileImport/playerDataImport.js
import { open } from '@tauri-apps/api/dialog';
import { readTextFile } from '@tauri-apps/api/fs';

export async function importPlayerFile() {
  try {
    // Open file dialog
    const selected = await open({
      multiple: false,
      filters: [{
        name: 'HTML/CSV Files',
        extensions: ['html', 'htm', 'csv']
      }]
    });
    
    if (!selected) return null;
    
    // Read file content
    const content = await readTextFile(selected);
    
    // Process based on file type
    if (selected.endsWith('.html') || selected.endsWith('.htm')) {
      return parseHTMLFile(content);
    } else if (selected.endsWith('.csv')) {
      return parseCSVFile(content);
    }
  } catch (error) {
    console.error('File import failed:', error);
    throw error;
  }
}

function parseHTMLFile(htmlContent) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const table = doc.querySelector('table');
  
  if (!table) {
    throw new Error('No table found in HTML file');
  }
  
  const headers = Array.from(table.querySelectorAll('thead th'))
    .map(th => th.textContent.trim());
  
  const rows = Array.from(table.querySelectorAll('tbody tr'))
    .map(tr => {
      const cells = Array.from(tr.querySelectorAll('td'));
      const player = {};
      
      headers.forEach((header, index) => {
        const value = cells[index]?.textContent.trim() || '-';
        // Handle range values like "14-16"
        if (value.includes('-') && value !== '-') {
          const [min, max] = value.split('-').map(Number);
          player[header] = (min + max) / 2;
        } else if (value === '-') {
          player[header] = 0;
        } else {
          player[header] = Number(value) || value;
        }
      });
      
      return player;
    });
  
  return { headers, players: rows };
}

function parseCSVFile(csvContent) {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const players = lines.slice(1)
    .filter(line => line.trim())
    .map(line => {
      const values = line.split(',');
      const player = {};
      
      headers.forEach((header, index) => {
        const value = values[index]?.trim() || '-';
        // Same range handling as HTML
        if (value.includes('-') && value !== '-') {
          const [min, max] = value.split('-').map(Number);
          player[header] = (min + max) / 2;
        } else if (value === '-') {
          player[header] = 0;
        } else {
          player[header] = Number(value) || value;
        }
      });
      
      return player;
    });
  
  return { headers, players };
}
```

### Rust Backend File Processing
```rust
// src-tauri/src/file_import/mod.rs
use tauri::command;
use serde_json::Value;
use std::fs;

#[derive(Debug, Serialize, Deserialize)]
pub struct PlayerData {
    pub name: String,
    pub nationality: String,
    pub club: String,
    pub position: String,
    pub attributes: HashMap<String, f32>,
}

#[tauri::command]
pub async fn import_player_file(file_path: String) -> Result<Vec<PlayerData>, String> {
    let content = fs::read_to_string(&file_path)
        .map_err(|e| format!("Failed to read file: {}", e))?;
    
    if file_path.ends_with(".html") || file_path.ends_with(".htm") {
        parse_html_file(&content)
    } else if file_path.ends_with(".csv") {
        parse_csv_file(&content)
    } else if file_path.ends_with(".json") {
        parse_json_file(&content)
    } else {
        Err("Unsupported file format".to_string())
    }
}

fn parse_html_file(content: &str) -> Result<Vec<PlayerData>, String> {
    use scraper::{Html, Selector};
    
    let document = Html::parse_document(content);
    let table_selector = Selector::parse("table").unwrap();
    let row_selector = Selector::parse("tr").unwrap();
    let cell_selector = Selector::parse("td, th").unwrap();
    
    // Implementation details...
    Ok(vec![])
}
```

## Method 4: Drag and Drop Import

### Frontend Implementation
```javascript
// src/components/DropZone.js
import { listen } from '@tauri-apps/api/event';
import { readTextFile } from '@tauri-apps/api/fs';

export function setupDropZone(elementId, onFileLoaded) {
  const dropZone = document.getElementById(elementId);
  
  // Tauri drag and drop events
  listen('tauri://file-drop', async (event) => {
    const files = event.payload;
    
    for (const file of files) {
      if (file.endsWith('.html') || file.endsWith('.csv')) {
        const content = await readTextFile(file);
        const data = parseFileContent(content, file);
        onFileLoaded(data);
      }
    }
  });
  
  // Prevent browser default drag behavior
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
  
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });
}
```

## Method 5: Batch Import Multiple Files

### Frontend Batch Processing
```javascript
// src/fileImport/batchImport.js
import { open } from '@tauri-apps/api/dialog';
import { readTextFile } from '@tauri-apps/api/fs';
import { invoke } from '@tauri-apps/api/tauri';

export async function batchImportFiles() {
  const selected = await open({
    multiple: true,
    filters: [{
      name: 'Data Files',
      extensions: ['html', 'htm', 'csv', 'json']
    }]
  });
  
  if (!selected || selected.length === 0) return null;
  
  const results = await Promise.all(
    selected.map(async (filePath) => {
      try {
        // Use Rust backend for processing large files
        const data = await invoke('process_player_file', { filePath });
        return { success: true, filePath, data };
      } catch (error) {
        return { success: false, filePath, error: error.toString() };
      }
    })
  );
  
  return results;
}
```

## Project Structure for Tauri App

```
fm24-scout-tauri/
├── src/                      # Frontend source
│   ├── data/
│   │   ├── roles.json       # Embedded role data
│   │   ├── rolesData.js     # Role data utilities
│   │   └── dataLoader.js    # Data loading functions
│   ├── fileImport/
│   │   ├── playerDataImport.js
│   │   ├── batchImport.js
│   │   └── fileParser.js
│   ├── components/
│   │   ├── DropZone.js
│   │   └── FileImporter.js
│   └── main.js
├── src-tauri/               # Rust backend
│   ├── src/
│   │   ├── data/
│   │   │   ├── mod.rs      # Role data module
│   │   │   └── roles.json  # Copy for Rust embedding
│   │   ├── file_import/
│   │   │   └── mod.rs      # File processing
│   │   └── main.rs
│   └── tauri.conf.json
└── data/                    # Resource files
    └── roles.json          # Master data file
```

## Tauri Configuration

Add to `tauri.conf.json`:
```json
{
  "tauri": {
    "allowlist": {
      "fs": {
        "all": false,
        "readFile": true,
        "writeFile": false,
        "readDir": false,
        "scope": ["$RESOURCE/*", "$HOME/*"]
      },
      "dialog": {
        "all": false,
        "open": true,
        "save": false
      }
    },
    "bundle": {
      "resources": [
        "data/roles.json"
      ]
    }
  }
}
```

## Usage Examples

### Complete Implementation Example
```javascript
// src/app.js
import { loadRoles } from './data/rolesData.js';
import { importPlayerFile } from './fileImport/playerDataImport.js';
import { calculatePlayerScores } from './scoring/calculator.js';

async function initializeApp() {
  // Load role data on startup
  const roles = await loadRoles();
  console.log(`Loaded ${roles.length} tactical roles`);
  
  // Setup file import button
  document.getElementById('importBtn').addEventListener('click', async () => {
    try {
      const playerData = await importPlayerFile();
      if (playerData) {
        const scores = calculatePlayerScores(playerData.players, roles);
        displayResults(scores);
      }
    } catch (error) {
      showError(`Import failed: ${error.message}`);
    }
  });
}

// Calculate scores for imported players
function calculatePlayerScores(players, roles) {
  return players.map(player => {
    const scores = {};
    
    roles.forEach(role => {
      let totalScore = 0;
      let weightSum = 0;
      
      // Calculate weighted score for each attribute
      Object.keys(role).forEach(attr => {
        if (attr !== 'Role' && attr !== 'RoleCode') {
          const weight = role[attr];
          const value = player[attr] || 0;
          
          if (weight > 0) {
            totalScore += value * weight;
            weightSum += weight;
          }
        }
      });
      
      scores[role.RoleCode] = weightSum > 0 
        ? Math.round((totalScore / weightSum) * 100) / 100 
        : 0;
    });
    
    return {
      ...player,
      roleScores: scores
    };
  });
}
```

## Performance Considerations

1. **Embedded Data**: Fastest loading, increases bundle size by ~61KB
2. **Resource Loading**: Small startup delay, allows updates without recompiling
3. **Large Files**: Process in Rust backend for better performance
4. **Caching**: Cache parsed data in memory to avoid re-parsing

## Error Handling

```javascript
// src/utils/errorHandler.js
export function handleImportError(error) {
  if (error.message.includes('No table found')) {
    return 'Invalid HTML file: No player data table found';
  }
  if (error.message.includes('Failed to parse')) {
    return 'File format error: Unable to parse player data';
  }
  if (error.message.includes('Too many rows')) {
    return 'File too large: Maximum 20,000 players supported';
  }
  return `Import failed: ${error.message}`;
}
```

This comprehensive guide provides everything needed to import both the static roles data and dynamic player files into your Tauri application.
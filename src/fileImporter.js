/**
 * FM24 Scout - Tauri File Importer
 * Handles file imports using Tauri's native file dialog and file system APIs
 */

import { open } from '@tauri-apps/api/dialog';
import { readTextFile } from '@tauri-apps/api/fs';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import { parseHTMLFile, parseCSVFile, calculatePlayerScores } from './dataManager.js';

// File import state
let isImporting = false;
let importListeners = [];

/**
 * Register a listener for import events
 * @param {Function} callback - Function to call when import completes
 */
export function onImportComplete(callback) {
  importListeners.push(callback);
}

/**
 * Notify all listeners of import completion
 * @param {Object} data - Import result data
 */
function notifyImportComplete(data) {
  importListeners.forEach(listener => listener(data));
}

/**
 * Open file dialog and import player data
 * @returns {Promise<Object>} Import result with player data
 */
export async function importPlayerFile() {
  if (isImporting) {
    throw new Error('Import already in progress');
  }
  
  isImporting = true;
  
  try {
    // Open native file dialog
    const selected = await open({
      multiple: false,
      title: 'Select Player Data File',
      filters: [{
        name: 'Player Data',
        extensions: ['html', 'htm', 'csv']
      }]
    });
    
    if (!selected) {
      isImporting = false;
      return null;
    }
    
    console.log(`Importing file: ${selected}`);
    
    // Read file content
    const content = await readTextFile(selected);
    
    // Parse based on file extension
    let result;
    if (selected.toLowerCase().endsWith('.html') || selected.toLowerCase().endsWith('.htm')) {
      result = parseHTMLFile(content);
    } else if (selected.toLowerCase().endsWith('.csv')) {
      result = parseCSVFile(content);
    } else {
      throw new Error('Unsupported file format');
    }
    
    // Add file info to result
    result.fileName = selected.split(/[\\/]/).pop();
    result.filePath = selected;
    result.importedAt = new Date().toISOString();
    
    // Notify listeners
    notifyImportComplete(result);
    
    console.log(`Successfully imported ${result.count} players`);
    
    return result;
    
  } catch (error) {
    console.error('Import failed:', error);
    throw error;
  } finally {
    isImporting = false;
  }
}

/**
 * Import multiple files at once
 * @returns {Promise<Array>} Array of import results
 */
export async function batchImportFiles() {
  if (isImporting) {
    throw new Error('Import already in progress');
  }
  
  isImporting = true;
  
  try {
    // Open dialog for multiple files
    const selected = await open({
      multiple: true,
      title: 'Select Multiple Player Data Files',
      filters: [{
        name: 'Player Data',
        extensions: ['html', 'htm', 'csv']
      }]
    });
    
    if (!selected || selected.length === 0) {
      isImporting = false;
      return [];
    }
    
    console.log(`Importing ${selected.length} files...`);
    
    // Process all files
    const results = await Promise.allSettled(
      selected.map(async (filePath) => {
        const content = await readTextFile(filePath);
        
        let data;
        if (filePath.toLowerCase().endsWith('.html') || filePath.toLowerCase().endsWith('.htm')) {
          data = parseHTMLFile(content);
        } else if (filePath.toLowerCase().endsWith('.csv')) {
          data = parseCSVFile(content);
        } else {
          throw new Error(`Unsupported format: ${filePath}`);
        }
        
        data.fileName = filePath.split(/[\\/]/).pop();
        data.filePath = filePath;
        
        return data;
      })
    );
    
    // Separate successful and failed imports
    const successful = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);
    
    const failed = results
      .filter(r => r.status === 'rejected')
      .map((r, i) => ({
        file: selected[i].split(/[\\/]/).pop(),
        error: r.reason.message || r.reason
      }));
    
    const batchResult = {
      successful,
      failed,
      totalFiles: selected.length,
      successCount: successful.length,
      failCount: failed.length,
      totalPlayers: successful.reduce((sum, r) => sum + r.count, 0)
    };
    
    // Notify listeners
    notifyImportComplete(batchResult);
    
    console.log(`Batch import complete: ${successful.length}/${selected.length} successful`);
    
    return batchResult;
    
  } catch (error) {
    console.error('Batch import failed:', error);
    throw error;
  } finally {
    isImporting = false;
  }
}

/**
 * Use Rust backend for large file processing
 * @param {string} filePath - Optional file path, opens dialog if not provided
 * @returns {Promise<Object>} Import result from Rust backend
 */
export async function importWithRustBackend(filePath = null) {
  try {
    // Get file path if not provided
    if (!filePath) {
      filePath = await open({
        multiple: false,
        title: 'Select Player Data File',
        filters: [{
          name: 'Player Data',
          extensions: ['html', 'htm', 'csv']
        }]
      });
      
      if (!filePath) return null;
    }
    
    console.log(`Processing with Rust backend: ${filePath}`);
    
    // Call Rust function
    const result = await invoke('import_player_file', { filePath });
    
    // Notify listeners
    notifyImportComplete(result);
    
    return result;
    
  } catch (error) {
    console.error('Rust import failed:', error);
    throw error;
  }
}

/**
 * Setup drag and drop for file imports
 * @param {string} elementId - ID of the drop zone element
 */
export function setupDropZone(elementId) {
  const dropZone = document.getElementById(elementId);
  
  if (!dropZone) {
    console.error(`Drop zone element not found: ${elementId}`);
    return;
  }
  
  // Listen for Tauri file drop events
  const unlisten = listen('tauri://file-drop', async (event) => {
    const files = event.payload;
    
    // Filter for supported files
    const supportedFiles = files.filter(file => 
      file.toLowerCase().endsWith('.html') ||
      file.toLowerCase().endsWith('.htm') ||
      file.toLowerCase().endsWith('.csv')
    );
    
    if (supportedFiles.length === 0) {
      console.warn('No supported files in drop');
      return;
    }
    
    // Show drop zone is active
    dropZone.classList.add('drop-active');
    
    try {
      // Process dropped files
      if (supportedFiles.length === 1) {
        // Single file
        const content = await readTextFile(supportedFiles[0]);
        let result;
        
        if (supportedFiles[0].toLowerCase().endsWith('.csv')) {
          result = parseCSVFile(content);
        } else {
          result = parseHTMLFile(content);
        }
        
        result.fileName = supportedFiles[0].split(/[\\/]/).pop();
        result.filePath = supportedFiles[0];
        
        notifyImportComplete(result);
        
      } else {
        // Multiple files - use batch import
        const results = await Promise.allSettled(
          supportedFiles.map(async (filePath) => {
            const content = await readTextFile(filePath);
            
            let data;
            if (filePath.toLowerCase().endsWith('.csv')) {
              data = parseCSVFile(content);
            } else {
              data = parseHTMLFile(content);
            }
            
            data.fileName = filePath.split(/[\\/]/).pop();
            data.filePath = filePath;
            
            return data;
          })
        );
        
        const successful = results
          .filter(r => r.status === 'fulfilled')
          .map(r => r.value);
        
        const batchResult = {
          successful,
          totalPlayers: successful.reduce((sum, r) => sum + r.count, 0)
        };
        
        notifyImportComplete(batchResult);
      }
      
    } catch (error) {
      console.error('Drop import failed:', error);
    } finally {
      dropZone.classList.remove('drop-active');
    }
  });
  
  // Listen for drag over events
  listen('tauri://file-drop-hover', (event) => {
    dropZone.classList.add('drop-hover');
  });
  
  // Listen for drag leave events  
  listen('tauri://file-drop-cancelled', (event) => {
    dropZone.classList.remove('drop-hover');
  });
  
  // Return cleanup function
  return () => {
    unlisten();
  };
}

/**
 * Calculate scores using Rust backend (for performance)
 * @param {Array} players - Array of player objects
 * @param {Array} selectedRoles - Array of role codes
 * @returns {Promise<Array>} Players with calculated scores
 */
export async function calculateScoresWithRust(players, selectedRoles) {
  try {
    const result = await invoke('calculate_player_scores', {
      players,
      selectedRoles
    });
    
    return result;
  } catch (error) {
    console.error('Rust calculation failed, falling back to JS:', error);
    // Fallback to JavaScript calculation
    return calculatePlayerScores(players, selectedRoles);
  }
}

/**
 * Get supported file extensions
 * @returns {Array} Array of supported extensions
 */
export function getSupportedExtensions() {
  return ['html', 'htm', 'csv'];
}

/**
 * Validate file before import
 * @param {string} filePath - Path to file
 * @returns {Promise<Object>} Validation result
 */
export async function validateFile(filePath) {
  try {
    const content = await readTextFile(filePath);
    const extension = filePath.split('.').pop().toLowerCase();
    
    let isValid = false;
    let message = '';
    let playerCount = 0;
    
    if (extension === 'html' || extension === 'htm') {
      try {
        const result = parseHTMLFile(content);
        isValid = true;
        playerCount = result.count;
        message = `Valid HTML file with ${playerCount} players`;
      } catch (e) {
        message = `Invalid HTML: ${e.message}`;
      }
    } else if (extension === 'csv') {
      try {
        const result = parseCSVFile(content);
        isValid = true;
        playerCount = result.count;
        message = `Valid CSV file with ${playerCount} players`;
      } catch (e) {
        message = `Invalid CSV: ${e.message}`;
      }
    } else {
      message = `Unsupported file extension: .${extension}`;
    }
    
    return {
      isValid,
      message,
      playerCount,
      fileName: filePath.split(/[\\/]/).pop(),
      extension
    };
    
  } catch (error) {
    return {
      isValid: false,
      message: `Failed to read file: ${error.message}`,
      playerCount: 0
    };
  }
}

// Export all functions
export default {
  importPlayerFile,
  batchImportFiles,
  importWithRustBackend,
  setupDropZone,
  calculateScoresWithRust,
  onImportComplete,
  getSupportedExtensions,
  validateFile
};
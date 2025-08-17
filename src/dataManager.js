/**
 * FM24 Scout - Data Manager
 * Handles loading and managing Football Manager roles and player data
 */

import rolesData from '../data/roles.json';

// Cache for loaded data
let rolesCache = null;
let playersCache = [];

/**
 * Initialize and load all role data
 * @returns {Array} Array of role objects
 */
export function loadRoles() {
  if (!rolesCache) {
    rolesCache = rolesData;
    console.log(`Loaded ${rolesCache.length} tactical roles`);
  }
  return rolesCache;
}

/**
 * Get a specific role by its code
 * @param {string} code - Role code (e.g., 'afa' for Advanced Forward Attack)
 * @returns {Object|null} Role object or null if not found
 */
export function getRoleByCode(code) {
  const roles = loadRoles();
  return roles.find(role => role.RoleCode === code) || null;
}

/**
 * Get all roles for a specific duty
 * @param {string} duty - Duty type ('Attack', 'Support', 'Defend')
 * @returns {Array} Array of matching roles
 */
export function getRolesByDuty(duty) {
  const roles = loadRoles();
  return roles.filter(role => role.Role.includes(duty));
}

/**
 * Get all available role names
 * @returns {Array} Array of role names
 */
export function getAllRoleNames() {
  const roles = loadRoles();
  return roles.map(role => ({
    name: role.Role,
    code: role.RoleCode
  }));
}

/**
 * Get all unique attributes from roles
 * @returns {Array} Array of attribute names
 */
export function getAllAttributes() {
  const roles = loadRoles();
  if (roles.length === 0) return [];
  
  return Object.keys(roles[0])
    .filter(key => key !== 'Role' && key !== 'RoleCode')
    .sort();
}

/**
 * Parse HTML file content to extract player data
 * @param {string} htmlContent - HTML file content
 * @returns {Object} Parsed player data
 */
export function parseHTMLFile(htmlContent) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const table = doc.querySelector('table');
  
  if (!table) {
    throw new Error('No table found in HTML file');
  }
  
  // Extract headers
  const headers = Array.from(table.querySelectorAll('thead th'))
    .map(th => th.textContent.trim());
  
  if (headers.length === 0) {
    // Try first row as headers
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      headers.push(...Array.from(firstRow.querySelectorAll('th, td'))
        .map(cell => cell.textContent.trim()));
    }
  }
  
  // Extract player data
  const rows = Array.from(table.querySelectorAll('tbody tr'))
    .map(tr => {
      const cells = Array.from(tr.querySelectorAll('td'));
      const player = {};
      
      headers.forEach((header, index) => {
        const value = cells[index]?.textContent.trim() || '-';
        player[header] = parseAttributeValue(value);
      });
      
      // Add calculated attributes
      player.Speed = calculateSpeed(player);
      player.WorkRate = calculateWorkRate(player);
      player.SetPieces = calculateSetPieces(player);
      
      return player;
    });
  
  // Validate we have player data
  const validRows = rows.filter(player => 
    player.Name && player.Name !== '-'
  );
  
  if (validRows.length === 0) {
    throw new Error('No valid player data found in table');
  }
  
  if (validRows.length > 20000) {
    throw new Error(`File too large: ${validRows.length} players found (maximum 20,000)`);
  }
  
  return {
    headers,
    players: validRows,
    count: validRows.length
  };
}

/**
 * Parse CSV file content to extract player data
 * @param {string} csvContent - CSV file content
 * @returns {Object} Parsed player data
 */
export function parseCSVFile(csvContent) {
  const lines = csvContent.split(/\r?\n/);
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  const players = lines.slice(1)
    .filter(line => line.trim())
    .map(line => {
      // Handle CSV with potential commas in quoted values
      const values = parseCSVLine(line);
      const player = {};
      
      headers.forEach((header, index) => {
        const value = values[index]?.trim() || '-';
        player[header] = parseAttributeValue(value);
      });
      
      // Add calculated attributes
      player.Speed = calculateSpeed(player);
      player.WorkRate = calculateWorkRate(player);
      player.SetPieces = calculateSetPieces(player);
      
      return player;
    })
    .filter(player => player.Name && player.Name !== '-');
  
  if (players.length === 0) {
    throw new Error('No valid player data found in CSV');
  }
  
  if (players.length > 20000) {
    throw new Error(`File too large: ${players.length} players found (maximum 20,000)`);
  }
  
  return {
    headers,
    players,
    count: players.length
  };
}

/**
 * Parse a single CSV line handling quoted values
 * @param {string} line - CSV line
 * @returns {Array} Array of values
 */
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current);
  return values.map(v => v.replace(/^"|"$/g, ''));
}

/**
 * Parse attribute value handling ranges and special cases
 * @param {string} value - Raw attribute value
 * @returns {number|string} Parsed value
 */
function parseAttributeValue(value) {
  // Handle missing values
  if (value === '-' || value === '' || value === null || value === undefined) {
    return 0;
  }
  
  // Handle range values (e.g., "14-16")
  if (typeof value === 'string' && value.includes('-') && !value.startsWith('-')) {
    const parts = value.split('-').map(p => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return (parts[0] + parts[1]) / 2;
    }
  }
  
  // Try to parse as number
  const num = parseFloat(value);
  if (!isNaN(num)) {
    return num;
  }
  
  // Return as string if not a number
  return value;
}

/**
 * Calculate Speed from Pace and Acceleration
 * @param {Object} player - Player object
 * @returns {number} Calculated speed
 */
function calculateSpeed(player) {
  const pace = parseFloat(player.Pac) || 0;
  const acceleration = parseFloat(player.Acc) || 0;
  return Math.round((pace + acceleration) / 2 * 10) / 10;
}

/**
 * Calculate Work Rate from Work Rate and Stamina
 * @param {Object} player - Player object
 * @returns {number} Calculated work rate
 */
function calculateWorkRate(player) {
  const workRate = parseFloat(player.Wor) || 0;
  const stamina = parseFloat(player.Sta) || 0;
  return Math.round((workRate + stamina) / 2 * 10) / 10;
}

/**
 * Calculate Set Pieces average
 * @param {Object} player - Player object
 * @returns {number} Calculated set pieces value
 */
function calculateSetPieces(player) {
  const corners = parseFloat(player.Cor) || 0;
  const freeKicks = parseFloat(player.Fre) || 0;
  const penalties = parseFloat(player.Pen) || 0;
  const throwIns = parseFloat(player.Thr) || 0;
  
  const values = [corners, freeKicks, penalties, throwIns].filter(v => v > 0);
  
  if (values.length === 0) return 0;
  
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round(sum / values.length * 10) / 10;
}

/**
 * Calculate player scores for all roles
 * @param {Array} players - Array of player objects
 * @param {Array} selectedRoles - Array of role codes to calculate
 * @returns {Array} Players with calculated role scores
 */
export function calculatePlayerScores(players, selectedRoles = null) {
  const roles = loadRoles();
  const rolesToCalculate = selectedRoles 
    ? roles.filter(r => selectedRoles.includes(r.RoleCode))
    : roles;
  
  return players.map(player => {
    const roleScores = {};
    
    rolesToCalculate.forEach(role => {
      let totalScore = 0;
      let weightSum = 0;
      
      // Calculate weighted score for each attribute
      Object.keys(role).forEach(attr => {
        if (attr !== 'Role' && attr !== 'RoleCode') {
          const weight = role[attr];
          const playerValue = parseFloat(player[attr]) || 0;
          
          if (weight > 0) {
            // Normalize player value (assuming max attribute value is 20)
            const normalizedValue = Math.min(playerValue / 20, 1);
            totalScore += normalizedValue * weight;
            weightSum += weight;
          }
        }
      });
      
      // Calculate percentage score
      roleScores[role.RoleCode] = weightSum > 0 
        ? Math.round((totalScore / weightSum) * 100 * 100) / 100
        : 0;
    });
    
    // Find best roles
    const sortedRoles = Object.entries(roleScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    return {
      ...player,
      roleScores,
      bestRoles: sortedRoles.map(([code, score]) => ({
        code,
        name: roles.find(r => r.RoleCode === code)?.Role,
        score
      }))
    };
  });
}

/**
 * Store players in cache
 * @param {Array} players - Array of player objects
 */
export function cachePlayers(players) {
  playersCache = players;
  console.log(`Cached ${players.length} players`);
}

/**
 * Get cached players
 * @returns {Array} Cached players array
 */
export function getCachedPlayers() {
  return playersCache;
}

/**
 * Clear all cached data
 */
export function clearCache() {
  playersCache = [];
  console.log('Player cache cleared');
}

// Export for use in other modules
export default {
  loadRoles,
  getRoleByCode,
  getRolesByDuty,
  getAllRoleNames,
  getAllAttributes,
  parseHTMLFile,
  parseCSVFile,
  calculatePlayerScores,
  cachePlayers,
  getCachedPlayers,
  clearCache
};
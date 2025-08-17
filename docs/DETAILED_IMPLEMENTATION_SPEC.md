# FM Client App - Complete Implementation Specification

## Table of Contents
1. [Exact HTML Structure](#exact-html-structure)
2. [CSS Styling Details](#css-styling-details)
3. [JavaScript Module Specifications](#javascript-module-specifications)
4. [Bootstrap Table Configuration](#bootstrap-table-configuration)
5. [LocalStorage Data Formats](#localstorage-data-formats)
6. [User Interface Flow](#user-interface-flow)
7. [Error Handling and Validation](#error-handling-and-validation)
8. [External Dependencies](#external-dependencies)

## Exact HTML Structure

### Document Setup
```html
<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>FM Player Scoring</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    
    <!-- Bootstrap Table CSS -->
    <link rel="stylesheet" href="https://unpkg.com/bootstrap-table@1.21.4/dist/bootstrap-table.min.css">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="js/libraries/sticky-header/bootstrap-table-sticky-header.css">
</head>
```

### Navigation Bar
```html
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
        <a class="navbar-brand" href="https://www.youtube.com/@TheDeepLyingPlaymaker">
            <img src="assets/img/yt-logo.png" alt="Logo" width="30" height="24" class="d-inline-block align-text-top">
            The Deep Lying Playmaker
        </a>
        <div class="navbar-nav ms-auto">
            <a class="nav-link" href="https://twitter.com/HarrisonRClark/status/1631988808817557506">Twitter Suggestions</a>
            <button class="btn btn-outline-secondary me-2" type="button" id="modeToggle">Toggle Theme</button>
            <button class="btn btn-outline-danger" type="button" id="reset-button">Restore Defaults</button>
        </div>
    </div>
</nav>
```

### Main Content Container
```html
<div class="container-fluid">
    <!-- File Upload Card -->
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Upload HTML File</h5>
                    <input class="form-control" type="file" id="fileInput" accept=".html">
                    <div class="spinner-border text-primary d-none" role="status" id="loadingSpinner">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Role Selection Card -->
    <div class="row justify-content-center mt-4">
        <div class="col-md-6">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Select Player Roles</h5>
                    <div id="selected-roles-container"></div>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#roleListModal">
                        Select Roles
                    </button>
                    <button type="button" class="btn btn-success" id="calculate-btn" disabled>
                        Calculate Player Scores
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Results Table -->
    <div class="row mt-4">
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table id="playersTable" 
                               data-sticky-header="true"
                               data-sticky-header-offset-y="75"
                               class="table table-striped">
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
```

### Modal Dialogs

#### Role Selection Modal (Fullscreen)
```html
<div class="modal fade" id="roleListModal" tabindex="-1" aria-labelledby="roleListModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="roleListModalLabel">Select Player Roles</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Search roles..." id="search-roles">
                </div>
                <div class="row mb-3">
                    <div class="col">
                        <button type="button" class="btn btn-success" id="select-all-button">Select All</button>
                        <button type="button" class="btn btn-danger" id="clear-all-button">Clear All</button>
                    </div>
                </div>
                <ul class="list-group d-flex flex-row" id="roleList"></ul>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
```

#### Edit Role Modal
```html
<div class="modal fade" id="editRoleModal" tabindex="-1" aria-labelledby="editRoleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="editRoleModalLabel">Edit Role</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div id="editForm"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="saveChangesButton">Save changes</button>
            </div>
        </div>
    </div>
</div>
```

### Toast Container
```html
<div class="toast-container position-fixed bottom-0 end-0 p-3" id="toast-container"></div>
```

### Footer
```html
<footer class="bg-dark text-center text-lg-start">
    <div class="text-center p-3">
        © 2023 Harrison R Clark
    </div>
</footer>
```

## CSS Styling Details

### Custom CSS (css/main.css)
```css
/* Role list styling */
#roleList {
    flex-wrap: wrap;
    max-height: 75vh;
    overflow-y: auto;
}

/* Responsive role list columns */
@media (min-width: 992px) {
    #roleList li {
        width: 33.333%;
        box-sizing: border-box;
    }
}

/* Dropdown styling */
.dropdown-item {
    cursor: pointer;
}
```

### Sticky Header CSS
```css
.fix-sticky {
    position: fixed !important;
    overflow: hidden;
    z-index: 100;
}
```

## JavaScript Module Specifications

### dataProcessing.js

#### Global Constants
```javascript
const seedDataKey = 'seedData';
```

#### Core Functions

##### loadSeedData()
```javascript
async function loadSeedData() {
    try {
        // Check localStorage first
        const storedData = localStorage.getItem(seedDataKey);
        if (storedData) {
            const seedData = JSON.parse(storedData);
            dispatchSeedDataLoadedEvent(seedData);
            return seedData;
        }
        
        // Fetch from server
        const response = await fetch('/assets/data/roles.json');
        const seedData = await response.json();
        
        // Store in localStorage
        localStorage.setItem(seedDataKey, JSON.stringify(seedData));
        
        // Dispatch event
        dispatchSeedDataLoadedEvent(seedData);
        
        // Show success toast
        showToast('Seed data loaded successfully.', 'Success', 'success');
        
        return seedData;
    } catch (error) {
        showToast('Failed to load seed data.', 'Error', 'error');
        throw error;
    }
}
```

##### calculateScores()
```javascript
function calculateScores(tableData, seedData) {
    const startTime = performance.now();
    const playerScores = {};
    
    try {
        tableData.forEach(player => {
            playerScores[player.Name] = {};
            
            seedData.forEach(role => {
                let totalScore = 0;
                let weightSum = 0;
                
                Object.keys(role).forEach(attr => {
                    if (attr !== 'Role' && attr !== 'RoleCode') {
                        const weight = role[attr];
                        const playerValue = parseFloat(player[attr]) || 0;
                        
                        if (weight > 0) {
                            const normalizedValue = Math.min(playerValue / 20, 1);
                            totalScore += normalizedValue * weight;
                            weightSum += weight;
                        }
                    }
                });
                
                playerScores[player.Name][role.RoleCode] = weightSum > 0 
                    ? (totalScore / weightSum) * 100 
                    : 0;
            });
        });
        
        const endTime = performance.now();
        
        return {
            playerScores,
            timeTaken: (endTime - startTime) / 1000,
            errorOccurred: false
        };
    } catch (error) {
        return {
            playerScores: {},
            timeTaken: 0,
            errorOccurred: true,
            errorMessage: error.message
        };
    }
}
```

### fileUpload.js

#### Validation Functions
```javascript
function isValidFileName(fileName) {
    return fileName && fileName.trim() !== '';
}

function isHtmlFileType(file) {
    return file.type === 'text/html' || 
           file.name.toLowerCase().endsWith('.html');
}

function isValidFile(file) {
    if (!file) {
        showToast('Please select a file.', 'File Error', 'error');
        return false;
    }
    if (!isValidFileName(file.name)) {
        showToast('Please select a file with a valid name.', 'File Error', 'error');
        return false;
    }
    if (!isHtmlFileType(file)) {
        showToast('Please select an HTML file.', 'File Error', 'error');
        return false;
    }
    return true;
}
```

#### File Processing
```javascript
function processSelectedFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(e.target.result, 'text/html');
        
        if (!hasValidTable(doc)) {
            $('#loadingSpinner').addClass('d-none');
            return;
        }
        
        const table = doc.querySelector('table');
        
        if (!hasValidRowCount(table)) {
            $('#loadingSpinner').addClass('d-none');
            return;
        }
        
        const tableData = convertTableToObject(table);
        
        // Store in session
        sessionStorage.setItem('tableData', JSON.stringify(tableData));
        
        // Enable calculate button if roles selected
        const selectedRoles = JSON.parse(localStorage.getItem('selectedRoles')) || [];
        if (selectedRoles.length > 0) {
            $('#calculate-btn').prop('disabled', false);
        }
        
        $('#loadingSpinner').addClass('d-none');
        showToast('File processed successfully.', 'Success', 'success');
    };
    
    reader.readAsText(file);
}
```

### processFile.js

#### Table Conversion
```javascript
function convertTableToObject(table) {
    const headers = [];
    const headerRow = table.querySelector('tr');
    
    // Extract headers
    headerRow.querySelectorAll('th').forEach(th => {
        let headerText = th.textContent.trim();
        
        // Special mapping for abbreviated headers
        if (headerText === 'Nat') {
            headerText = 'Nationality';
        }
        
        headers.push(headerText);
    });
    
    // Extract data rows
    const data = [];
    const rows = table.querySelectorAll('tr');
    
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.querySelectorAll('td, th');
        const rowData = {};
        
        cells.forEach((cell, index) => {
            if (headers[index]) {
                let value = cell.textContent.trim();
                
                // Handle range values
                if (value.includes('-') && !value.startsWith('-')) {
                    const parts = value.split('-');
                    if (parts.length === 2) {
                        const min = parseFloat(parts[0]);
                        const max = parseFloat(parts[1]);
                        if (!isNaN(min) && !isNaN(max)) {
                            value = (min + max) / 2;
                        }
                    }
                }
                
                // Handle missing values
                if (value === '-') {
                    value = 0;
                }
                
                rowData[headers[index]] = value;
            }
        });
        
        // Only add rows with valid data
        if (rowData.Name && rowData.Name !== '-') {
            data.push(rowData);
        }
    }
    
    return data;
}
```

### listFilter.js

#### Role List Generation
```javascript
function populateRoleList(seedData) {
    const roleList = $('#roleList');
    roleList.empty();
    
    seedData.forEach(role => {
        const listItem = $(`
            <li class="list-group-item">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" 
                           value="${role.RoleCode}" 
                           id="role-${role.RoleCode}">
                    <label class="form-check-label" for="role-${role.RoleCode}">
                        ${role.Role}
                    </label>
                    <button type="button" class="btn btn-sm btn-secondary float-end edit-role-btn" 
                            data-role-code="${role.RoleCode}">
                        Edit
                    </button>
                </div>
            </li>
        `);
        
        roleList.append(listItem);
    });
}
```

#### Search Implementation
```javascript
function roleFilterEventListener() {
    $('#search-roles').on('input', function() {
        const searchValue = $(this).val().toLowerCase();
        
        $('#roleList li').each(function() {
            const text = $(this).text().toLowerCase();
            
            if (text.includes(searchValue)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
    
    // Clear search on modal close
    $('#roleListModal').on('hidden.bs.modal', function() {
        $('#search-roles').val('');
        $('#roleList li').show();
    });
}
```

#### Selection Pills
```javascript
function updateSelectedRolesSummary() {
    const selectedRoles = JSON.parse(localStorage.getItem('selectedRoles')) || [];
    const container = $('#selected-roles-container');
    
    container.empty();
    
    selectedRoles.forEach(role => {
        const pill = $(`
            <span class="badge bg-primary me-2 mb-2">
                ${role.name}
                <button type="button" class="btn-close btn-close-white ms-2" 
                        data-role-code="${role.code}" 
                        data-role-name="${role.name}"></button>
            </span>
        `);
        
        container.append(pill);
    });
    
    // Attach remove handlers
    container.find('.btn-close').on('click', function() {
        const code = $(this).data('role-code');
        removeRole(code);
    });
}
```

### tableGeneration.js

#### Complete Column Configuration
```javascript
function generateColumns(data) {
    const columns = [
        { field: 'Inf', title: 'Inf', sortable: true },
        { field: 'Name', title: 'Name', sortable: true },
        { field: 'Age', title: 'Age', sortable: true },
        { field: 'Club', title: 'Club', sortable: true },
        { field: 'Transfer Value', title: 'Transfer Value', sortable: true },
        {
            field: 'Wage',
            title: 'Wage',
            sortable: true,
            formatter: function(value, row) {
                return row['Wage'] || row['Salary'] || '';
            }
        },
        { field: 'Nationality', title: 'Nat', sortable: true },
        { field: 'Position', title: 'Position', sortable: true },
        // Physical attributes
        { field: 'Acc', title: 'Acc', sortable: true },
        { field: 'Pac', title: 'Pac', sortable: true },
        { field: 'Sta', title: 'Sta', sortable: true },
        { field: 'Str', title: 'Str', sortable: true },
        { field: 'Agi', title: 'Agi', sortable: true },
        { field: 'Bal', title: 'Bal', sortable: true },
        { field: 'Jum', title: 'Jum', sortable: true },
        // Technical attributes
        { field: 'Cor', title: 'Cor', sortable: true },
        { field: 'Cro', title: 'Cro', sortable: true },
        { field: 'Dri', title: 'Dri', sortable: true },
        { field: 'Fin', title: 'Fin', sortable: true },
        { field: 'Fir', title: 'Fir', sortable: true },
        { field: 'Hea', title: 'Hea', sortable: true },
        { field: 'Lon', title: 'Lon', sortable: true },
        { field: 'Mar', title: 'Mar', sortable: true },
        { field: 'Pas', title: 'Pas', sortable: true },
        { field: 'Tck', title: 'Tck', sortable: true },
        { field: 'Tec', title: 'Tec', sortable: true },
        // Mental attributes
        { field: 'Agg', title: 'Agg', sortable: true },
        { field: 'Ant', title: 'Ant', sortable: true },
        { field: 'Bra', title: 'Bra', sortable: true },
        { field: 'Cmp', title: 'Cmp', sortable: true },
        { field: 'Cnt', title: 'Cnt', sortable: true },
        { field: 'Dec', title: 'Dec', sortable: true },
        { field: 'Det', title: 'Det', sortable: true },
        { field: 'Fla', title: 'Fla', sortable: true },
        { field: 'Ldr', title: 'Ldr', sortable: true },
        { field: 'OtB', title: 'OtB', sortable: true },
        { field: 'Pos', title: 'Pos', sortable: true },
        { field: 'Tea', title: 'Tea', sortable: true },
        { field: 'Vis', title: 'Vis', sortable: true },
        { field: 'Wor', title: 'Wor', sortable: true },
        // Goalkeeper attributes
        { field: '1v1', title: '1v1', sortable: true },
        { field: 'Aer', title: 'Aer', sortable: true },
        { field: 'Cmd', title: 'Cmd', sortable: true },
        { field: 'Han', title: 'Han', sortable: true },
        { field: 'Kic', title: 'Kic', sortable: true },
        { field: 'Ref', title: 'Ref', sortable: true },
        { field: 'TRO', title: 'TRO', sortable: true },
        { field: 'Thr', title: 'Thr', sortable: true }
    ];
    
    // Add dynamic role columns
    const selectedRoles = JSON.parse(localStorage.getItem('selectedRoles')) || [];
    selectedRoles.forEach(role => {
        columns.push({
            field: role.code,
            title: role.name,
            sortable: true,
            formatter: function(value) {
                if (value === undefined || value === null) return '';
                return parseFloat(value).toFixed(2);
            }
        });
    });
    
    // Add summary columns
    columns.push(
        { 
            field: 'highestRoleScore', 
            title: 'Highest Role Score', 
            sortable: true,
            formatter: function(value) {
                if (!value) return '';
                return parseFloat(value).toFixed(2);
            }
        },
        { 
            field: 'resultingRole', 
            title: 'Resulting Role', 
            sortable: true 
        }
    );
    
    return columns;
}
```

#### Table Initialization
```javascript
function initializeTable(data) {
    $('#playersTable').bootstrapTable('destroy');
    
    $('#playersTable').bootstrapTable({
        data: data,
        columns: generateColumns(data),
        pagination: true,
        pageSize: 25,
        pageList: [10, 25, 50, 100, 'All'],
        search: true,
        searchAlign: 'left',
        showExport: true,
        exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'excel', 'pdf'],
        exportOptions: {
            fileName: 'fm_player_scores'
        },
        stickyHeader: true,
        stickyHeaderOffsetY: 75,
        stickyHeaderOffsetLeft: 0,
        stickyHeaderOffsetRight: 0,
        toolbar: '#toolbar',
        classes: 'table table-striped',
        theadClasses: 'table-dark',
        showColumns: true,
        showColumnsToggleAll: true,
        minimumCountColumns: 2,
        clickToSelect: false,
        sortable: true,
        silentSort: false
    });
}
```

### toastNotifications.js

#### Complete Toast Implementation
```javascript
function showToast(message, title = 'Error', type = 'error') {
    const toastId = 'toast-' + Date.now();
    const iconClass = type === 'success' 
        ? 'bi-check-circle-fill text-success' 
        : 'bi-exclamation-circle-fill text-danger';
    const headerClass = type === 'success' 
        ? 'bg-success text-white' 
        : 'bg-danger text-white';
    
    const toastHTML = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header ${headerClass}">
                <i class="bi ${iconClass} me-2"></i>
                <strong class="me-auto">${title}</strong>
                <small class="text-white-50">Just now</small>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    $('#toast-container').append(toastHTML);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
        animation: true,
        autohide: true,
        delay: 5000
    });
    
    toast.show();
    
    // Remove from DOM after hidden
    toastElement.addEventListener('hidden.bs.toast', function() {
        toastElement.remove();
    });
}
```

### themeToggle.js

#### Theme Implementation
```javascript
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-bs-theme', newTheme);
    
    // Store preference
    localStorage.setItem('theme', newTheme);
    
    // Update button text
    const button = document.getElementById('modeToggle');
    button.textContent = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
    
    const button = document.getElementById('modeToggle');
    button.textContent = savedTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initializeTheme);

// Attach listener
function toggleThemeListener() {
    document.getElementById('modeToggle').addEventListener('click', toggleTheme);
}
```

### editWeighting.js

#### Dynamic Form Generation
```javascript
function generateEditForm(roleData) {
    let formHTML = '<div class="container-fluid"><div class="row">';
    
    const attributeGroups = {
        'Technical': ['Cor', 'Cro', 'Dri', 'Fin', 'Fir', 'Hea', 'Lon', 'Mar', 'Pas', 'Tck', 'Tec'],
        'Mental': ['Agg', 'Ant', 'Bra', 'Cmp', 'Cnt', 'Dec', 'Det', 'Fla', 'Ldr', 'OtB', 'Pos', 'Tea', 'Vis', 'Wor'],
        'Physical': ['Acc', 'Agi', 'Bal', 'Jum', 'Pac', 'Sta', 'Str'],
        'Goalkeeper': ['1v1', 'Aer', 'Cmd', 'Han', 'Kic', 'Ref', 'TRO', 'Thr']
    };
    
    // Role info (read-only)
    formHTML += `
        <div class="col-12 mb-3">
            <h6>Role Information</h6>
            <div class="row">
                <div class="col-md-6">
                    <label class="form-label">Role Name</label>
                    <input type="text" class="form-control" value="${roleData.Role}" disabled>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Role Code</label>
                    <input type="text" class="form-control" value="${roleData.RoleCode}" disabled>
                </div>
            </div>
        </div>
    `;
    
    // Attribute weightings
    Object.entries(attributeGroups).forEach(([group, attributes]) => {
        formHTML += `<div class="col-12 mb-3"><h6>${group} Attributes</h6><div class="row">`;
        
        attributes.forEach(attr => {
            if (roleData.hasOwnProperty(attr)) {
                formHTML += `
                    <div class="col-md-3 mb-2">
                        <label for="${attr}" class="form-label">${attr}</label>
                        <input type="number" 
                               class="form-control" 
                               id="${attr}" 
                               value="${roleData[attr]}" 
                               min="0" 
                               max="5" 
                               step="1">
                    </div>
                `;
            }
        });
        
        formHTML += '</div></div>';
    });
    
    formHTML += '</div></div>';
    
    document.getElementById('editForm').innerHTML = formHTML;
}
```

#### Save Changes Handler
```javascript
function saveRoleChanges(roleCode) {
    const seedData = JSON.parse(localStorage.getItem(seedDataKey));
    const roleIndex = seedData.findIndex(r => r.RoleCode === roleCode);
    
    if (roleIndex === -1) {
        showToast('Role not found.', 'Error', 'error');
        return;
    }
    
    // Get all input values
    const inputs = document.querySelectorAll('#editForm input[type="number"]');
    
    inputs.forEach(input => {
        const attr = input.id;
        const value = parseInt(input.value);
        
        if (!isNaN(value) && value >= 0 && value <= 5) {
            seedData[roleIndex][attr] = value;
        }
    });
    
    // Save to localStorage
    localStorage.setItem(seedDataKey, JSON.stringify(seedData));
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editRoleModal'));
    modal.hide();
    
    showToast('Role data updated successfully.', 'Success', 'success');
    
    // Dispatch update event
    document.dispatchEvent(new CustomEvent('RoleDataUpdated', { detail: seedData }));
}
```

## LocalStorage Data Formats

### Key Names and Structure

#### seedData
```javascript
// Key: 'seedData'
// Format: Array of role objects
[
    {
        "Role": "Advanced Forward Attack",
        "RoleCode": "afa",
        "1v1": 0,
        "Acc": 5,
        "Aer": 0,
        // ... all 40 attributes
        "Cor": 0
    }
    // ... 85 total roles
]
```

#### selectedRoles
```javascript
// Key: 'selectedRoles'
// Format: Array of selected role objects
[
    {
        "code": "afa",
        "name": "Advanced Forward Attack"
    },
    {
        "code": "ws",
        "name": "Winger Support"
    }
]
```

#### theme
```javascript
// Key: 'theme'
// Format: String
"dark" // or "light"
```

### SessionStorage Data

#### tableData
```javascript
// Key: 'tableData'
// Format: Array of player objects
[
    {
        "Name": "Player Name",
        "Age": "23",
        "Club": "Club Name",
        "Nationality": "ENG",
        "Position": "ST",
        "Acc": "15",
        "Pac": "16",
        // ... all attributes
    }
]
```

## User Interface Flow

### 1. Initial Load
1. Page loads with dark theme
2. `loadSeedData()` fetches roles.json
3. Roles stored in localStorage
4. UI elements initialized

### 2. File Upload Flow
1. User clicks file input
2. File validation checks
3. Loading spinner shows
4. HTML parsed for table data
5. Data stored in sessionStorage
6. Success toast shown
7. Calculate button enabled (if roles selected)

### 3. Role Selection Flow
1. User clicks "Select Roles"
2. Modal opens with all 85 roles
3. User can search/filter roles
4. Checkboxes for selection
5. Edit buttons for each role
6. Selected roles show as pills
7. Modal closes on completion

### 4. Calculation Flow
1. User clicks "Calculate Player Scores"
2. Scores calculated for each player/role combination
3. Highest scoring role identified
4. Table generated with results
5. Performance time shown in toast

### 5. Export Flow
1. User selects export format from dropdown
2. Table data converted to selected format
3. File downloads automatically

## Error Handling and Validation

### File Validation Messages
- "Please select a file."
- "Please select a file with a valid name."
- "Please select an HTML file."
- "No table found in the HTML file."
- "Table has too many rows. Please reduce the number of rows to 20,000 or less."

### Success Messages
- "File processed successfully."
- "Seed data loaded successfully."
- "Role data updated successfully."
- "Scores calculated in X.XX seconds."

### Validation Rules
- **File Type**: Must be .html or text/html MIME type
- **Table Size**: Maximum 20,000 rows
- **Player Name**: Cannot be empty or "-"
- **Attribute Values**: Converted to numbers, ranges averaged
- **Role Weights**: Must be 0-5 integer values

## External Dependencies

### CDN Resources (Exact Versions)
```html
<!-- Bootstrap 5.3.2 -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<!-- Bootstrap Icons 1.11.1 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

<!-- jQuery 3.7.1 -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<!-- Bootstrap Table 1.21.4 -->
<link rel="stylesheet" href="https://unpkg.com/bootstrap-table@1.21.4/dist/bootstrap-table.min.css">
<script src="https://unpkg.com/bootstrap-table@1.21.4/dist/bootstrap-table.min.js"></script>

<!-- Table Export Dependencies -->
<script src="https://unpkg.com/tableexport.jquery.plugin/tableExport.min.js"></script>
<script src="https://unpkg.com/bootstrap-table@1.21.4/dist/extensions/export/bootstrap-table-export.min.js"></script>

<!-- PDF Export -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>
```

### Project File Structure
```
fm_client_app/
├── index.html
├── css/
│   └── main.css
├── js/
│   ├── dataProcessing.js
│   ├── editWeighting.js
│   ├── fileUpload.js
│   ├── listFilter.js
│   ├── processFile.js
│   ├── tableGeneration.js
│   ├── themeToggle.js
│   ├── toastNotifications.js
│   └── libraries/
│       └── sticky-header/
│           ├── bootstrap-table-sticky-header.css
│           └── bootstrap-table-sticky-header.js
├── assets/
│   ├── data/
│   │   └── roles.json (61,007 bytes)
│   └── img/
│       └── yt-logo.png
└── README.md
```

## Application Initialization Sequence

```javascript
// Main initialization (called on DOMContentLoaded)
$(document).ready(function() {
    // 1. Initialize theme
    initializeTheme();
    
    // 2. Load seed data
    loadSeedData();
    
    // 3. Setup event listeners
    setupFileChangeListener();      // fileUpload.js
    roleFilterEventListener();      // listFilter.js
    toggleThemeListener();          // themeToggle.js
    
    // 4. Setup role selection handlers
    setupRoleSelectionHandlers();   // listFilter.js
    
    // 5. Setup calculate button
    $('#calculate-btn').on('click', function() {
        const tableData = JSON.parse(sessionStorage.getItem('tableData'));
        const seedData = JSON.parse(localStorage.getItem('seedData'));
        const selectedRoles = JSON.parse(localStorage.getItem('selectedRoles'));
        
        if (!tableData || !seedData || !selectedRoles) {
            showToast('Missing data for calculation.', 'Error', 'error');
            return;
        }
        
        // Calculate scores
        const result = calculateScores(tableData, seedData);
        
        if (result.errorOccurred) {
            showToast(result.errorMessage, 'Calculation Error', 'error');
            return;
        }
        
        // Generate table
        const enhancedData = enhanceTableData(tableData, result.playerScores, selectedRoles);
        initializeTable(enhancedData);
        
        // Show completion message
        showToast(`Scores calculated in ${result.timeTaken.toFixed(2)} seconds.`, 'Success', 'success');
    });
    
    // 6. Setup reset button
    assignResetButton();
});
```

This detailed specification document provides every implementation detail needed to recreate the FM Client App exactly as it functions in the original.
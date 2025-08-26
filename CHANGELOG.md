# Changelog

All notable changes to the FM24 Scout App will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2025-08-26

### Added
- **Comprehensive Tactic and Squad Management System** - Full squad building and formation management
  - **Formation Editor** with visual football pitch representation
    - Support for 8 preset formations (4-4-2, 4-2-3-1, 4-3-3, 3-5-2, 4-1-2-1-2, 5-3-2, 4-2-2-2, 3-4-3)
    - Custom formation creation with drag-and-drop positioning
    - Visual pitch with realistic field markings and grass patterns
    - Real-time position preview with player assignments
  
  - **Advanced Position Management**
    - 23 distinct position types (GK, LB, LCB, CB, RCB, RB, LWB, RWB, LDMF, CDMF, RDMF, LCM, CM, RCM, LAMF, CAMF, RAMF, LW, RW, LST, ST, RST)
    - Each position supports all 85 FM24 tactical roles (e.g., Deep Lying Playmaker Support, Ball Winning Midfielder Defend)
    - Multiple players per position with depth chart functionality
    - Drag-and-drop player reordering within positions
    - Position-specific role assignment and modification
  
  - **Player Assignment System**
    - Smart assignment modal with all position scores calculated in real-time
    - Best position recommendation based on role scores
    - Color-coded position quality indicators (Green 85+, Yellow 70-84, Red <70)
    - Player status tracking (Bought, Loan, Trial, Youth Academy)
    - Visual status indicators with unique colors and icons
    - Quick add-to-squad buttons in player table with copy name functionality
  
  - **Squad Import/Export**
    - JSON-based squad data format with version control
    - Complete player snapshots including all attributes and calculated scores
    - Formation layout preservation with position coordinates
    - Drag-and-drop file import support
    - Automatic filename generation based on squad name
  
  - **Player Update Notifications**
    - Automatic detection of squad players in new imports
    - Attribute change tracking with diff display
    - Position score recalculation on updates
    - Accept/reject individual or bulk updates
    - Visual notification queue system

- **Table Zoom Functionality** - Comprehensive zoom controls for the Player Analysis table
  - Adjustable zoom range from 50% to 200% for optimal data viewing
  - Three control methods: interactive slider, zoom buttons, and keyboard shortcuts
  - Keyboard shortcuts: `Ctrl/Cmd+Plus` (zoom in), `Ctrl/Cmd+Minus` (zoom out), `Ctrl/Cmd+0` (reset to 100%)
  - Smooth performance with 100ms debouncing to prevent lag during adjustments
  - Smart width compensation ensures table fills container at any zoom level
  - Full accessibility support with ARIA labels and screen reader announcements
  - Zoom preference persists between sessions via localStorage
  - Visual feedback with real-time percentage display
  - Optimized for both regular tables and virtualized tables (100+ rows)

### UI/UX Improvements
- **Tabbed Navigation** - Clean separation between Players and Squad views
  - Player count badge in Players tab
  - Starting XI indicator (X/11) in Squad tab
  - Smooth tab transitions with content preservation
  
- **Formation Pitch Visualization**
  - Realistic football pitch with gradient grass effect
  - SVG-based field markings (penalty areas, center circle, goals)
  - Position cards with hover effects and selection states
  - Mini player cards showing name, score, and status
  - Empty position indicators with quick-add functionality
  
- **Squad Management Interface**
  - Editable squad name with inline editing
  - Formation template selector dropdown
  - Squad statistics display (total players, starting XI)
  - Split view with pitch on left, position cards on right
  - Responsive design for different screen sizes

### Technical Improvements
- **New State Management**
  - Created dedicated `squad-store.ts` using Zustand
  - Formation and player position state persistence
  - Squad data versioning for future compatibility
  - Optimized state updates with immutable patterns
  
- **Component Architecture**
  - 10+ new components for squad functionality
  - Modular design with clear separation of concerns
  - Reusable UI components following shadcn patterns
  - Type-safe with comprehensive TypeScript interfaces
  
- **Data Structures**
  - `SquadPosition` type for formation positions
  - `SquadPlayer` type extending base Player with squad metadata
  - `PlayerStatus` enum for player categorization
  - `FormationTemplate` for preset formations

- Added Radix UI components (Tabs, ScrollArea) for enhanced UI
- Implemented UUID generation for unique entity IDs
- Added CSS transform-based scaling for GPU-accelerated performance
- Input validation for zoom values (NaN, Infinity handling)
- Extracted magic numbers to configuration constants for maintainability

### Performance Optimizations
- Role score calculations cached at squad save time
- React.memo usage on heavy components
- Virtual scrolling for position player lists
- Debounced zoom updates to prevent excessive re-renders
- CSS transforms instead of layout changes for better performance
- Width compensation formula ensures proper layout at all zoom levels

### Accessibility Enhancements
- ARIA labels on all interactive elements
- Keyboard navigation support throughout squad interface
- Focus management in modals and dropdowns
- Status badges with screen reader friendly text
- Tooltips for position abbreviations and controls
- Live region announcements for zoom percentage changes

### Dependencies Added
- `uuid` (v11.1.0) - Unique ID generation
- `@types/uuid` (v10.0.0) - TypeScript definitions
- `@radix-ui/react-tabs` (v1.1.13) - Tab navigation component
- `@radix-ui/react-scroll-area` (v1.2.10) - Scrollable containers

## [Previous Versions]

See commit history for changes in previous versions.
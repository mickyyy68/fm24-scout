# FM24 Scout App

<div align="center">
  
![FM24 Scout](https://img.shields.io/badge/FM24-Scout_App-purple?style=for-the-badge)
![Tauri](https://img.shields.io/badge/Tauri-2.0-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=for-the-badge)
![Performance](https://img.shields.io/badge/Players-20%2C000%2B-green?style=for-the-badge)

**A high-performance Football Manager 2024 scouting application built with Tauri, React, and TypeScript**

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Performance](#performance) • [Development](#development)

</div>

## Overview

FM24 Scout App is a powerful desktop application designed to help Football Manager 2024 players analyze and compare player data efficiently. With support for databases containing over 20,000 players, advanced role analysis, and real-time performance calculations, it's the ultimate companion for FM24 managers.

## ✨ Features

### 📊 Data Import & Export
- **Multi-format Import**: Support for CSV and HTML exports from FM24
- **Large Dataset Handling**: Process databases with 20,000+ players smoothly
- **Export Options**: Export filtered data to CSV or JSON formats
- **Drag & Drop**: Simple file import with progress tracking

### 🎯 Role Analysis
- **40+ Tactical Roles**: Complete database of FM24 tactical roles
- **Smart Scoring Algorithm**: Calculate player suitability for each role (based on [squirrel_plays'](https://www.youtube.com/@squirrel_plays_fof4318) methodology)
- **Best Role Detection**: Automatically identify each player's optimal position
- **Custom Role Selection**: Choose specific roles to analyze via modal interface

### 🔍 Advanced Filtering & Search
- **Real-time Search**: Instant player search with debouncing
- **Multi-criteria Filters**: 
  - Age range (min/max)
  - Position filtering
  - Club search
  - Custom attribute filters
- **Column Visibility**: Show/hide specific data columns
- **Smart Sorting**: Sort by any column including calculated scores

### 🎨 Football Manager-Inspired Design
- **Authentic FM Theme**: Purple CTAs and green accents matching FM24's aesthetic
- **Dark/Light Modes**: Full theme support with optimized contrast
- **Responsive Layout**: Clean, modern interface that scales beautifully
- **FM-style Components**: Cards, badges, and UI elements inspired by the game

### ⚡ Performance Optimizations
- **Web Worker Processing**: Background calculations prevent UI freezing
- **Virtual Scrolling**: Render only visible rows for 90% performance boost
- **Smart Caching**: Avoid redundant calculations with intelligent caching
- **Progressive Loading**: See results immediately while processing continues
- **Debounced Inputs**: Smooth, lag-free filtering and searching

### 📈 Player Comparison
- **Side-by-side Analysis**: Compare up to 4 players simultaneously
- **Attribute Differences**: Visual indicators for stat comparisons
- **Role Suitability**: Compare players across multiple tactical roles

## 🚀 Installation

### 📥 Download Pre-built Releases (Recommended)

**[⬇️ Download Latest Release](https://github.com/mickyyy68/fm24-scout-app/releases/latest)**

Choose your platform:
- **Windows**: Download `FM24-Scout-App_x64-setup.exe` 
- **macOS Intel**: Download `FM24-Scout-App_x64.dmg`
- **macOS Apple Silicon**: Download `FM24-Scout-App_aarch64.dmg`
- **Linux**: Download `fm24-scout-app_amd64.AppImage`

### 🔧 Build from Source

Prerequisites:
- Node.js 18+ and npm/yarn
- Rust (for Tauri development)
- Git

```bash
# Clone the repository
git clone https://github.com/mickyyy68/fm24-scout-app.git
cd fm24-scout-app

# Install dependencies
npm install

# Run in development mode
npm run tauri dev

# Build for production
npm run tauri build
```

### Platform-specific Builds

The app supports Windows, macOS, and Linux:

```bash
# Windows (.exe, .msi)
npm run tauri build -- --target x86_64-pc-windows-msvc

# macOS (.dmg, .app)
npm run tauri build -- --target x86_64-apple-darwin

# Linux (.deb, .AppImage)
npm run tauri build -- --target x86_64-unknown-linux-gnu
```

## 📖 Usage

### 1. Import Player Data

1. **Export from FM24**: 
   - In FM24, go to your squad/search screen
   - Select players → Print → Web Page (or CSV)
   - Choose all attributes and save the file

2. **Import to Scout App**:
   - Click the import area or drag & drop your file
   - Supports HTML and CSV formats
   - Progress bar shows import status

### 2. Select Roles for Analysis

1. Click **"Add Roles"** button
2. Search or browse role categories:
   - Goalkeeper (GK, SK)
   - Defender (CB, BPD, Libero)
   - Wing Back (WB, FB, IWB)
   - Midfielder (CM, DLP, AP, BBM)
   - Winger (W, IW, IF)
   - Striker (AF, TM, F9, Poacher)
3. Select multiple roles for comprehensive analysis
4. Click **"Calculate Scores"** to analyze all players

### 3. Analyze & Filter Results

- **Sort**: Click any column header to sort
- **Filter**: Use the Filters dropdown for age, position, club
- **Search**: Type in the search box for instant results
- **Export**: Download filtered results as CSV or JSON

### 4. Compare Players

1. Select players from the comparison interface
2. View side-by-side attribute comparisons
3. See visual indicators for strengths/weaknesses

## ⚡ Performance

### Benchmarks

| Dataset Size | Calculation Time | Memory Usage | Frame Rate |
|-------------|-----------------|--------------|------------|
| 1,000 players | <0.5s | 50MB | 60 FPS |
| 5,000 players | ~1s | 150MB | 60 FPS |
| 10,000 players | ~2s | 250MB | 60 FPS |
| 20,000+ players | ~4s | 400MB | 60 FPS |

### Optimization Techniques

- **Web Workers**: Parallel processing keeps UI responsive
- **Virtual Scrolling**: Only render visible table rows
- **Caching**: Store calculated scores to avoid redundant work
- **Debouncing**: 300ms delay on search/filter inputs
- **Progressive Rendering**: Show results as they're calculated

## 🛠️ Development

### Tech Stack

- **Frontend**: React 19 + TypeScript 5.8
- **Desktop Framework**: Tauri 2.0
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Table**: TanStack Table + Virtual
- **Build Tool**: Vite

### Project Structure

```
fm24-scout-app/
├── src/
│   ├── components/       # React components
│   │   ├── PlayerTable/  # Table with virtual scrolling
│   │   ├── RoleSelector/ # Role selection modal
│   │   └── ui/           # Reusable UI components
│   ├── lib/              # Core logic
│   │   ├── data-manager.ts         # Score calculations
│   │   └── data-manager-optimized.ts # Web Worker version
│   ├── workers/          # Web Workers
│   ├── store/            # Zustand store
│   └── styles/           # Global styles & theme
├── src-tauri/            # Tauri backend
└── docs/                 # Documentation
```

### Key Components

#### Data Manager
Handles all score calculations and role analysis:
```typescript
// Optimized with Web Worker support
const dataManager = new OptimizedDataManager()
await dataManager.calculateAllScoresOptimized(
  players,
  selectedRoles,
  onProgress
)
```

#### Virtual Table
Renders large datasets efficiently:
```typescript
// Automatically activates for >100 rows
<VirtualizedTable table={table} />
```

#### Theme System
FM24-inspired design tokens:
```css
--primary: hsl(255.5 54% 58%);  /* FM Purple */
--accent: hsl(122 41% 51%);     /* FM Green */
```

### Development Commands

```bash
# Development
npm run dev           # Web development
npm run tauri dev    # Desktop development

# Testing
npm run test         # Run tests
npm run test:e2e    # E2E tests

# Building
npm run build        # Build web app
npm run tauri build  # Build desktop app

# Code Quality
npm run lint         # ESLint
npm run type-check   # TypeScript checks
```

## 📝 Configuration

### Settings Storage
User preferences are persisted in:
- **Windows**: `%APPDATA%/fm24-scout-app`
- **macOS**: `~/Library/Application Support/fm24-scout-app`
- **Linux**: `~/.config/fm24-scout-app`

### Customization
- Theme preference (dark/light)
- Selected roles persist between sessions
- Window size and position remembered

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[squirrel_plays](https://www.youtube.com/@squirrel_plays_fof4318)** - For the role suitability algorithm and FM24 insights
- Football Manager 2024 by Sports Interactive
- The FM community for data structure insights
- Tauri team for the excellent framework
- All contributors and testers

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on [GitHub](https://github.com/mickyyy68/fm24-scout-app/issues)
- Check the [documentation](./docs)

---

<div align="center">
Made with ❤️ for the FM community
</div>
# Changelog

All notable changes to the FM24 Scout App will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
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

### Technical Improvements
- Added Radix UI Slider component for smooth zoom control
- Implemented CSS transform-based scaling for GPU-accelerated performance
- Added input validation for zoom values (NaN, Infinity handling)
- Extracted magic numbers to configuration constants for maintainability
- Integrated zoom state management with Zustand store

### Performance Optimizations
- Debounced zoom updates to prevent excessive re-renders
- Used CSS transforms instead of font-size changes for better performance
- Maintained constant row height estimation in virtualized tables
- Width compensation formula ensures proper layout at all zoom levels

### Accessibility Enhancements
- Added comprehensive ARIA labels to all zoom controls
- Implemented keyboard navigation with industry-standard shortcuts
- Added live region announcements for zoom percentage changes
- Included visual tooltips showing keyboard shortcuts

## [Previous Versions]

See commit history for changes in previous versions.
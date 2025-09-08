# Byterover Handbook: XML Viewer Project

## Layer 1: System Overview

### Purpose
The XML Viewer is a modern React-based application designed specifically for viewing, searching, and navigating T24 banking system XML help files. It provides a rich, interactive interface for parsing XML documentation with features like dark mode, search highlighting, and in-app Markdown documentation.

### Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Express.js for file API
- **Build Tools**: Vite, PostCSS, Autoprefixer
- **Styling**: Tailwind CSS with custom prose classes
- **Parsing**: Custom XML and Markdown parsers (no external dependencies)

### Architecture
The application follows a component-based architecture with a clear separation of concerns:
- **Frontend**: Single-page React application with component-based UI
- **Backend**: Minimal Express server for file system API
- **State Management**: React hooks (useState, useEffect) with custom hooks for theme and preferences
- **Data Flow**: Centralized state in App component with props drilling to child components

### Key Technical Decisions
- Custom XML parser to avoid external dependencies and ensure performance
- Tailwind CSS for utility-first styling and responsive design
- Vite for fast development and building
- Intersection Observer for efficient scroll handling and anchor navigation
- Local storage for persisting user preferences

## Layer 2: Module Map

### Core Modules

#### 1. XML Parsing Module (`scr/lib/parseT24HelpXML.js`)
- **Responsibility**: Parses T24 Help XML files into structured JavaScript objects
- **Key Functions**: `parseT24HelpXML()` - extracts product, table, overview paragraphs, and field entries
- **Features**: Obsolete field detection, validation rules identification, anchor generation

#### 2. Markdown Rendering Module (`scr/lib/markdown.js`)
- **Responsibility**: Converts Markdown to HTML with Tailwind CSS styling
- **Key Functions**: `renderMarkdown()` - handles headings, lists, code blocks, tables, links
- **Features**: Custom styling with Tailwind classes, dark mode support, safe HTML escaping

#### 3. State Management Module (`scr/hooks/`)
- **Responsibility**: Manages application state and user preferences
- **Key Hooks**: 
  - `useTheme()` - Light/dark theme management with localStorage persistence
  - `usePrefs()` - User preferences (compact mode, font size, width)
- **Features**: Persistence across sessions, reactive state updates

#### 4. UI Components Module (`scr/components/`)
- **Responsibility**: Reusable React components for the interface
- **Key Components**:
  - `App` - Root component managing global state
  - `Header` - Navigation with search, file info, and actions
  - `Sidebar` - Table of contents and navigation
  - `Content` - Main content rendering with anchor support
  - `HelpModal` - In-app documentation viewer
  - `Diagnostics` - Runtime validation and testing panel

#### 5. Backend API Module (`server.js`)
- **Responsibility**: Provides file system API for directory browsing
- **Key Endpoint**: `/api/files` - Lists directory contents with security validation
- **Features**: Path traversal protection, CORS enabled, XML file filtering

### Data Layer
- **XML Data Model**: Structured object with product, table, overview paragraphs, and entries
- **Preferences Storage**: localStorage for theme and user settings
- **File Metadata**: File name, size, and path information

### Utilities Module (`scr/lib/utils.js`)
- **Responsibility**: Helper functions for common tasks
- **Key Functions**: `slugify()` - Converts field names to URL-friendly anchors

## Layer 3: Integration Guide

### API Interfaces

#### Frontend-Backend Integration
- **Endpoint**: `GET /api/files?path=directory_path`
- **Response**: JSON array of file/folder objects with name, type, path, and size
- **Security**: Path validation to prevent directory traversal attacks

#### Component Communication
- **Props Drilling**: State passed from App component to children (Header, Sidebar, Content)
- **Event Handling**: onClick handlers for navigation and actions
- **State Updates**: useState and useEffect for reactive updates

#### Markdown Documentation System
- **Auto-discovery**: Markdown files in `/scr/docs/` are automatically indexed
- **Rendering**: Custom renderer with Tailwind prose classes
- **Modal Interface**: Blocking overlay with scroll locking

### Configuration Files

#### Build Configuration (`vite.config.js`)
- **React Plugin**: Enables React support
- **Build Options**: Standard Vite configuration

#### Styling Configuration (`tailwind.config.js`)
- **Content Paths**: Configured for React components
- **Dark Mode**: Class-based dark mode support
- **Custom Styles**: Extended color palette and prose classes

#### PostCSS Configuration (`postcss.config.js`)
- **Plugins**: Tailwind CSS and Autoprefixer

### External Dependencies
- **React**: UI framework
- **Express**: Backend server
- **Tailwind CSS**: Styling framework
- **Vite**: Build tool
- **CORS**: Cross-origin resource sharing middleware

## Layer 4: Extension Points

### Design Patterns

#### Component Pattern
- **Reusable Components**: All UI components are modular and reusable
- **Props Interface**: Clear props definitions for each component
- **Custom Hooks**: useTheme and usePrefs for state management

#### Factory Pattern
- **XML Parsing**: parseT24HelpXML acts as a factory for creating data models
- **Markdown Rendering**: renderMarkdown creates HTML from Markdown text

### Customization Areas

#### Adding New File Formats
- **Location**: `scr/lib/parseT24HelpXML.js`
- **Method**: Extend parser function to support additional XML schemas
- **Integration**: Update file loading logic in App component

#### Extending Preferences
- **Location**: `scr/hooks/usePrefs.js`
- **Method**: Add new preference fields to the hook
- **UI**: Update OptionsPanel component to include new settings

#### Adding New Documentation
- **Location**: `scr/docs/` directory
- **Method**: Add new Markdown files - they are auto-discovered
- **Content**: Follow existing Markdown format for consistency

#### Styling Customization
- **Location**: `tailwind.config.js`
- **Method**: Extend theme with new colors, fonts, or utilities
- **Components**: Update Tailwind classes in components for new styles

### Recent Changes Patterns
- **Multi-file Refactor**: Project was refactored from single-file to modular structure
- **Component Extraction**: Components were extracted from monolithic App component
- **Hook Creation**: Custom hooks created for theme and preferences management

### Performance Optimization Points
- **XML Parsing**: Custom parser avoids DOM overhead for better performance
- **Scroll Handling**: Intersection Observer for efficient scroll detection
- **Search Filtering**: Client-side filtering for instant search results

### Security Considerations
- **Path Validation**: Backend API validates paths to prevent traversal attacks
- **CORS Setup**: Proper CORS configuration for frontend-backend communication
- **Sandbox Mode**: Handling for embedded environments with restricted History API

## Validation Checklist

- [x] All 4 required sections present
- [x] Architecture pattern identified (Component-based with centralized state)
- [x] At least 3 core modules documented (XML Parsing, Markdown Rendering, State Management)
- [x] Tech stack matches project reality (React, Express, Tailwind, Vite)
- [x] Extension points or patterns identified (Component, Factory patterns, multiple customization areas)
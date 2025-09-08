# XML Viewer Project Index

## Project Overview
A modern React-based XML viewer application designed specifically for T24 banking system help files. Provides parsing, navigation, search functionality, and in-app documentation with dark mode support.

## Technical Stack
- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with custom prose classes
- **Backend**: Express.js server for file API
- **Build Tools**: Vite, PostCSS, Autoprefixer
- **Parsing**: Custom XML and Markdown parsers

## Key Functions

### Core Parsing Functions
- [`parseT24HelpXML()`](scr/lib/parseT24HelpXML.js:4) - Parses T24 Help XML files into structured data model
- [`renderMarkdown()`](scr/lib/markdown.js:2) - Custom Markdown to HTML renderer with Tailwind styling
- [`slugify()`](scr/lib/utils.js) - Converts field names to URL-friendly anchors

### State Management
- [`useTheme()`](scr/hooks/useTheme.js) - Manages light/dark mode with localStorage persistence
- [`usePrefs()`](scr/hooks/usePrefs.js) - Handles user preferences (compact mode, font size, width)

### UI Components
- [`App`](scr/app.jsx) - Root component managing global state and layout
- [`Header`](scr/components/Header.jsx) - Navigation with search, file info, and actions
- [`Sidebar`](scr/components/Sidebar.jsx) - Table of contents and navigation
- [`Content`](scr/components/Content.jsx) - Main content rendering with anchor support
- [`HelpModal`](scr/components/HelpModal.jsx) - In-app documentation viewer
- [`Diagnostics`](scr/components/Diagnostics.jsx) - Runtime validation and testing panel

### Backend API
- [`/api/files`](server.js:17) - Express endpoint for directory browsing and file listing
- Security measures include path validation and CORS enablement

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Run `npm install` to install dependencies
3. Start development server: `npm run dev`
4. Backend server: `node server.js` (runs on port 3001)

### Build Configuration
- **Vite Config**: [vite.config.js](vite.config.js)
- **Tailwind Config**: [tailwind.config.js](tailwind.config.js)
- **PostCSS Config**: [postcss.config.js](postcss.config.js)

## Current Status

### Working Features
- ✅ XML file parsing and structured data extraction
- ✅ Search with highlighting and filtering
- ✅ Dark/light theme toggle with persistence
- ✅ Responsive design for mobile/desktop
- ✅ Drag-and-drop file loading
- ✅ Deep linking with anchor navigation
- ✅ In-app Markdown documentation system
- ✅ Diagnostics panel for testing
- ✅ Backend file API for directory browsing

### File Structure Status
```
xml-viewer/
├── public/
│   └── Docs/ (markdown documentation)
├── scr/
│   ├── components/ (11 React components)
│   ├── hooks/ (2 custom hooks)
│   ├── lib/ (5 utility libraries)
│   └── docs/ (9 markdown documentation files)
├── server.js (Express backend)
├── package.json
├── tailwind.config.js
└── vite.config.js
```

### Documentation Status
- Comprehensive documentation available in [`scr/docs/`](scr/docs/)
- Files cover architecture, components, data model, styling, testing, and troubleshooting
- Markdown files are auto-discovered and rendered in HelpModal

### Security Status
- Backend API includes path traversal protection
- CORS enabled for frontend-backend communication
- Sandbox mode handling for embedded environments

## Dependencies
- **Frontend**: react, react-dom, vite, tailwindcss, postcss, autoprefixer
- **Backend**: express, cors
- **Development**: Various Vite plugins and build tools

## Performance Notes
- Custom XML parser avoids external dependencies
- Tailwind CSS provides optimized styling
- Vite ensures fast development and building
- Intersection Observer used for efficient scroll handling

## Extension Points
- Additional file formats can be added to parser
- New Markdown docs auto-discovered in docs directory
- Preferences system easily extendable
- Component structure supports new features
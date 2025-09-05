# XML Help Viewer — React + Tailwind

A modern, three‑panel XML help viewer for T24 help files (e.g., `PM.LD.PARAM.xml`). This project is a **multi‑file** refactor of the previous single‑file prototype, keeping all features while improving structure, maintainability, and extensibility.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Directory Structure](#directory-structure)
4. [Quick Start](#quick-start)
5. [Usage](#usage)
6. [Component Overview](#component-overview)
7. [Markdown Help Modal](#markdown-help-modal)
8. [Sandboxed Environments](#sandboxed-environments)
9. [Diagnostics & Testing](#diagnostics--testing)
10. [Extending the App](#extending-the-app)
11. [License](#license)

---

## Features

- **Load local `.xml`** via file picker or drag‑and‑drop
- **Dynamic document title:** `<product> : <table>`
- **Search with inline highlight:** filters TOC and highlights matches in content
- **TOC ⇄ Content sync:** scroll‑spy and deep linking with sandbox‑safe URL updates
- **Dark/Light mode:** persisted across sessions
- **Obsolete badge detection:** highlights obsolete sections
- **Diagnostics panel:** runtime tests for parser, slugify, and validation rules
- **In-app Markdown documentation:** Help modal with auto-discovered docs
- **Responsive design:** works on desktop and mobile

---

## Tech Stack

- **React** (functional components, hooks)
- **Tailwind CSS** (utility-first styling)
- **Vite** (fast dev/build tooling)
- **No extra libraries** for markdown or XML parsing—custom logic for performance and control

---

## Directory Structure

```
xml-viewer/
├─ public/
│  └─ Docs/
│     ├─ readme.md
│     ├─ architecture.md
│     ├─ components.md
│     ├─ data_model.md
│     ├─ styling.md
│     ├─ testing.md
│     └─ troubleshooting.md
├─ scr/
│  ├─ app.jsx
│  ├─ index.css
│  ├─ main.jsx
│  ├─ components/
│  │  ├─ Header.jsx
│  │  ├─ Sidebar.jsx
│  │  ├─ Content.jsx
│  │  ├─ Diagnostics.jsx
│  │  ├─ EmptyState.jsx
│  │  ├─ HelpButton.jsx
│  │  ├─ HelpModal.jsx
│  │  └─ icons.jsx
│  ├─ hooks/
│  │  ├─ useTheme.js
│  │  └─ usePrefs.js
│  └─ lib/
│     ├─ parseT24HelpXML.js
│     ├─ utils.js
│     ├─ history.js
│     ├─ markdown.js
│     └─ docsIndex.js
├─ tailwind.config.js
├─ postcss.config.js
├─ index.html
└─ package.json
```

---

## Quick Start

```bash
npm create vite@latest xml-viewer -- --template react
cd xml-viewer
npm i
# Tailwind setup
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
# tailwind.config.cjs -> content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"]
# src/index.css -> @tailwind base; @tailwind components; @tailwind utilities;
# Replace src/App.jsx with this repo’s src/App.jsx and copy other files accordingly.
npm run dev
```

---

## Usage

1. **Run the dev server** and open the app in your browser.
2. **Load a file:** Click **Load File** or drag a `.xml` file into the window.
3. **Navigate:** Use the left **Menu** (Sidebar) to jump between sections; search filters and highlights.
4. **Copy deep links:** Click **Copy Link** on a section to copy a direct anchor link.
5. **Change preferences:** Use the options panel for compact mode, font size, and width.
6. **View documentation:** Click the **Help [?]** button to open the Markdown Help Modal.

---

## Component Overview

| Component      | Responsibility                                 |
|----------------|------------------------------------------------|
| `App`          | Root, manages global state and layout          |
| `Header`       | Title, search, file info, actions, Help button |
| `Sidebar`      | Table of contents, anchors, navigation         |
| `Content`      | Main XML content rendering                     |
| `Diagnostics`  | Runtime tests and parser validation            |
| `EmptyState`   | Shown when no file is loaded                   |
| `HelpModal`    | Modal for Markdown documentation               |
| `OptionsPanel` | User preferences (theme, font, width)          |
| `HelpButton`   | Opens HelpModal from Header                    |
| `Icons`        | SVG icon set                                   |

See [`components.md`](./components.md) for full details.

---

## Markdown Help Modal

- **Help button** (`?`) in header opens a modal.
- **Dropdown list** of Markdown docs auto-discovered from `/scr/docs`.
- **Rendered with Tailwind prose styles:** headings, lists, code, links, tables, blockquotes, images.
- **Blocking overlay:** background scroll locked, closes only via "Close ×" or Escape key.

---

## Sandboxed Environments

In embeds (e.g., `about:srcdoc`), the History API is restricted. We use `safeReplaceHash`/`safePushHash` which fall back gracefully to `location.hash` or no‑op. Copy Link still works.

---

## Diagnostics & Testing

Open the Diagnostics panel in the sidebar. It runs runtime tests:

- `slugify("POS.FWD.VAR.INT") → "pos-fwd-var-int"`
- Parser sanity: product/table + obsolete detection
- Nested **Validation Rules:** detection

---

## Extending the App

- **Add new Markdown docs:** Place `.md` files in `/scr/docs` for instant HelpModal access.
- **Add new components:** Place in `/scr/components` and import as needed.
- **Customize preferences:** Extend `OptionsPanel` and hooks for more user settings.
- **Improve XML parsing:** Update `parseT24HelpXML.js` for new formats or validation.

---

## License

MIT

---

## References

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [XML Viewer Architecture](./architecture.md)
- [XML Viewer Components](./components.md)

---

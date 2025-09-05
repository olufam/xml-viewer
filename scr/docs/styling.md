# Styling

> This document describes the styling approach, conventions, and customization options for the XML Viewer app.

---

## Table of Contents

1. [Overview](#overview)
2. [Tailwind CSS](#tailwind-css)
3. [Prose Styling for Markdown](#prose-styling-for-markdown)
4. [Dark Mode](#dark-mode)
5. [Responsive Design](#responsive-design)
6. [Custom Classes](#custom-classes)
7. [Extending Styles](#extending-styles)
8. [References](#references)

---

## Overview

The XML Viewer uses [Tailwind CSS](https://tailwindcss.com/) for utility-first styling, enabling rapid development and easy customization. Markdown content is rendered with Tailwind's `prose` classes for readable documentation.

---

## Tailwind CSS

- **Utility-first:** Classes like `bg-white`, `text-slate-900`, `rounded-xl`, etc.
- **Configurable:** See `tailwind.config.js` for theme, colors, and breakpoints.
- **Custom utilities:** Used for spacing, layout, borders, and typography.

Example:

```jsx
<div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-xl shadow p-4">
  {/* ... */}
</div>
```

---

## Prose Styling for Markdown

- Markdown rendered in HelpModal uses `prose` and `prose-slate` for readable, well-spaced documentation.
- Dark mode uses `prose-invert`.
- Custom styles for code blocks, tables, blockquotes, and images.

Example:

```jsx
<div className="prose prose-slate dark:prose-invert">
  {/* Markdown HTML here */}
</div>
```

---

## Dark Mode

- Toggle via theme switch in Header.
- Uses Tailwind's `dark:` modifier for colors and backgrounds.
- Persists user preference via local storage.

Example:

```jsx
<div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
  {/* ... */}
</div>
```

---

## Responsive Design

- Uses Tailwind's responsive utilities (`sm:`, `md:`, `lg:`, `xl:`).
- Layout adapts for mobile, tablet, and desktop.
- Sidebar collapses on small screens.

Example:

```jsx
<div className="grid grid-cols-12">
  <aside className="col-span-4 sm:col-span-3 md:col-span-3 xl:col-span-3" />
  <main className="col-span-8 sm:col-span-9 md:col-span-9 xl:col-span-9" />
</div>
```

---

## Custom Classes

- **Obsolete badge:** `bg-rose-900/20 text-rose-200 border-rose-800/50`
- **Validation rules:** `font-semibold text-xs text-sky-600`
- **Help modal overlay:** `bg-black/40`
- **Code blocks:** `bg-slate-900 border border-slate-800 text-slate-100 rounded-lg p-3`

---

## Extending Styles

- Add new styles in `tailwind.config.js` or via custom CSS.
- Use Tailwind's plugin ecosystem for forms, typography, etc.
- Extend Markdown rendering in `markdown.js` for more block types.

---

## References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind Typography (prose)](https://tailwindcss.com/docs/typography-plugin)
- [XML Viewer Architecture](./architecture.md)
- [Components](./components.md)

---

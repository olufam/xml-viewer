# Testing

> This document describes how to test the XML Viewer app, including runtime diagnostics, unit tests, and troubleshooting folder loading issues during development.

---

## Table of Contents

1. [Runtime Diagnostics](#runtime-diagnostics)
2. [Unit Tests](#unit-tests)
3. [Folder Loading Service Troubleshooting](#folder-loading-service-troubleshooting)
4. [Recommended Development Commands](#recommended-development-commands)
5. [Stopping Services](#stopping-services)
6. [References](#references)
7. [Summary](#summary)

---

## Runtime Diagnostics

Open the Diagnostics section in the Sidebar to run built‑in checks:

- `slugify("POS.FWD.VAR.INT") → "pos-fwd-var-int"`
- Parser header sanity and obsolete detection
- Nested "Validation Rules:" detection

These checks help verify that the XML parser and anchor logic are working as expected.

npm run dev:full

---

## Unit Tests (Optional)

Use [Vitest](https://vitest.dev/) or [Jest](https://jestjs.io/) for testing core logic such as `parseT24HelpXML` and `slugify`.

**Example cases to add:**

- Rejects malformed XML (throws)
- Handles empty `overview` gracefully
- Detects multiple `Validation Rules:` blocks
- Preserves paragraph order; strips `/` lines

---

## Folder Loading Service Troubleshooting

### Problem

When starting the app with:

```bash
npm run dev
```

You may encounter errors like:

```
- Failed to load folder contents: 
- Failed to load directory contents: 
- Failed to fetch. Make sure the API server is running on port 3001.
```

This happens because the folder/file picker modal relies on a backend API server (e.g., `server.js`) to list and serve files from `scr/datafiles`.  
If the API server is not running, folder loading will fail.

---

### Solution

Use the combined development command to start both the frontend and the API server:

```bash
npm run dev:full
```

**Example output:**
```
> xml-viewer@0.0.0 dev:full
> concurrently "npm run api" "npm run dev"

[0] > xml-viewer@0.0.0 api
[0] > node server.js
[0] File API server running on http://localhost:3001

[1] > xml-viewer@0.0.0 dev
[1] > vite
[1] VITE v5.4.19  ready in 317 ms
[1] ➜  Local:   http://localhost:5173/
```

This ensures both the frontend and backend are running, and folder loading works correctly.

---

## Recommended Development Commands

1. **Install Vite (if missing):**
   ```bash
   npm install vite --save-dev
   ```
   OR
   ```bash
   npm install concurrently --save-dev
   ```
   

2. **Check your `package.json` scripts:**
   ```json
   "scripts": {
     "dev": "vite",
     "api": "node server.js",
     "dev:full": "concurrently \"npm run api\" \"npm run dev\""
   }
   ```
   *(Remove or fix `"dev:full"` if it’s not defined.)*

3. **Start the full development environment:**
   ```bash
   npm run dev:full
   ```

---

## Stopping Services

- Press `CTRL+C` in the terminal to stop both servers.
- If ports are stuck (e.g., 5173 or 5174), run:
  ```bash
  npx kill-port 5173 5174
  ```

---

## References

- [Vitest Documentation](https://vitest.dev/)
- [Jest Documentation](https://jestjs.io/)
- [Vite Documentation](https://vitejs.dev/)
- [Node.js](https://nodejs.org/)
- [concurrently](https://www.npmjs.com/package/concurrently)

---

## Summary

- Always use `npm run dev:full` for development to ensure folder loading works.
- Use Diagnostics and unit tests to verify core logic.
- Stop services with `CTRL+C` or `npx kill-port`.
- Update scripts and dependencies as needed for a smooth development experience.

---
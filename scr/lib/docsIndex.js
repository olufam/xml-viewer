//## // src/lib/docsIndex.js
//## // Static index of .md files served at /Docs/*.md (lowercase fallback /docs/*)
//## export const DOCS_INDEX = [
//##   { key: "readme",          title: "README",          path: "/Docs/readme.md" },
//##   { key: "architecture",    title: "Architecture",    path: "/Docs/architecture.md" },
//##   { key: "components",      title: "Components",      path: "/Docs/components.md" },
//##   { key: "data_model",      title: "Data Model",      path: "/Docs/data_model.md" },
//##   { key: "styling",         title: "Styling",         path: "/Docs/styling.md" },
//##   { key: "testing",         title: "Testing",         path: "/Docs/testing.md" },
//##   { key: "troubleshooting", title: "Troubleshooting", path: "/Docs/troubleshooting.md" },
//## ];
//## 
//## // Resilient loader: tries /Docs then /docs
//## export async function loadMarkdown(path) {
//##   const candidates = [path, path.replace(/\/Docs\//, "/docs/")];
//##   let lastErr = null;
//##   for (const url of candidates) {
//##     try {
//##       const res = await fetch(url, { cache: "no-store" });
//##       if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
//##       return await res.text();
//##     } catch (e) { lastErr = e; }
//##   }
//##   throw new Error(`Unable to load markdown from ${path}. ${lastErr ? String(lastErr) : ""}`);
//## }

//hh# // Dynamic load the docs/*.md files with Vite's glob import
//hh# // auto-index and load raw content (Vite only)
//hh# export const files = import.meta.glob("../docs/*.md", { as: "raw" });
//hh# export const DOCS_INDEX = Object.keys(files).map((k) => {
//hh#   const name = k.split("/").pop().replace(/\.md$/, "");
//hh#   return { key: name, title: name.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()), path: k };
//hh# });
//hh# export async function loadMarkdown(path) { return await files[path](); }

// Auto-discover Markdown files in /scr/docs (Vite import.meta.glob)
export function getDocsIndex() {
  // Vite import.meta.glob returns an object with file paths as keys
  const files = import.meta.glob("/scr/docs/*.md", { query: "?raw", import: "default" });
  // Convert to array of { name, path }
  return Object.keys(files).map((path) => ({
    name: path.split("/").pop(),
    path,
    loader: files[path]
  }));
}

// src/components/Header.jsx
import React from "react";
import { Icon } from "./icons";

export default function Header({
  title,
  product,
  table,
  query,
  setQuery,
  theme,
  setTheme,
  onPickFile,
  activeAnchor
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <div className="h-1 bg-gradient-to-r from-blue-600 via-sky-500 to-purple-600" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-xl overflow-hidden shadow ring-1 ring-white/10">
            <Icon.Logo />
          </div>
          <div className="leading-tight">
            <div className="font-semibold tracking-tight text-sm sm:text-base">{title}</div>
            <div className="text-[10px] text-slate-400">Product={product || "LD"}, Table={table || "PM.LD.PARAM"}</div>
          </div>
        </div>

        {/* Search pill */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-xl">
            <input
              id="search"
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-2 rounded-full bg-slate-800/80 border border-slate-700 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {query && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-700"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <Icon.X />
              </button>
            )}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon.Search />
            </div>
          </div>
        </div>

        {/* Actions with icons */}
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 cursor-pointer text-xs px-3 py-2 rounded-full bg-slate-800/70 border border-slate-700 hover:bg-slate-700">
            <Icon.Upload />
            <span className="hidden sm:inline">Load File</span>
            <input type="file" accept=".xml" onChange={onPickFile} className="hidden" />
          </label>

          <button className="text-xs px-3 py-2 rounded-full bg-slate-800/70 border border-slate-700 hover:bg-slate-700 flex items-center gap-2" title="View Options">
            <Icon.Cog />
            <span className="hidden sm:inline">View Options</span>
          </button>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-xs px-3 py-2 rounded-full bg-slate-800/70 border border-slate-700 hover:bg-slate-700 flex items-center gap-2"
            aria-label="Toggle color mode"
          >
            {theme === "dark" ? <Icon.Sun /> : <Icon.Moon />}
            <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"} Mode</span>
          </button>

          <button
            onClick={async () => {
              const link = location.href.includes("srcdoc") ? `#${activeAnchor || "overview"}` : `${location.href}`;
              try { await navigator.clipboard.writeText(link); } catch {}
            }}
            className="text-xs px-3 py-2 rounded-full bg-slate-800/70 border border-slate-700 hover:bg-slate-700 flex items-center gap-2"
            title="Copy Link"
          >
            <Icon.Link />
            <span className="hidden sm:inline">Copy Link</span>
          </button>
        </div>
      </div>
    </header>
  );
}

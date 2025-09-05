import React, { useState, useRef, useEffect } from "react";
import { Icon } from "./icons";
import OptionsPanel from "./OptionsPanel";

// Help Button (question mark icon only)
function HelpButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-full bg-slate-200/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center text-slate-700 dark:text-slate-200"
      title="Help"
      aria-label="Help"
    >
      <span className="text-xl font-bold">?</span>
    </button>
  );
}

export default function Header({
  title,
  product,
  table,
  query,
  setQuery,
  theme,
  setTheme,
  onPickFile,
  onOpenFilePicker,
  activeAnchor,
  prefs,
  setCompact,
  setFontSize,
  setWidth,
  fileMeta,
  showHelp,
  onHelp
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
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

        {/* File Info - Centered */}
        {fileMeta && (
          <div className="flex-1 flex justify-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span>File:</span>
              <span className="font-medium text-slate-700 dark:text-slate-200">{fileMeta.name}</span>
              <span className="opacity-70">({(fileMeta.size / 1024).toFixed(1)} KB)</span>
            </div>
          </div>
        )}

        {/* Search pill */}
        <div className={`${fileMeta ? 'w-80' : 'flex-1'} flex items-center justify-center`}>
          <div className="relative w-full max-w-xl">
            <input
              id="search"
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-2 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {query && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <Icon.X />
              </button>
            )}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
              <Icon.Search />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3" ref={wrapRef}>
          <button
            onClick={onOpenFilePicker}
            className="inline-flex items-center cursor-pointer p-2 rounded-full bg-slate-200/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
            title="Load File"
          >
            <Icon.Upload />
          </button>

          <button
            className="relative p-2 rounded-full bg-slate-200/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center text-slate-700 dark:text-slate-200"
            title="View Options"
            onClick={() => setOpen((v) => !v)}
          >
            <Icon.Cog />
            <OptionsPanel
              open={open}
              onClose={() => setOpen(false)}
              prefs={prefs}
              setCompact={setCompact}
              setFontSize={setFontSize}
              setWidth={setWidth}
            />
          </button>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-slate-200/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center text-slate-700 dark:text-slate-200"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? <Icon.Sun /> : <Icon.Moon />}
          </button>

          <button
            onClick={async () => {
              const link = location.href.includes("srcdoc") ? `#${activeAnchor || "overview"}` : `${location.href}`;
              try { await navigator.clipboard.writeText(link); } catch {}
            }}
            className="p-2 rounded-full bg-slate-200/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center text-slate-700 dark:text-slate-200"
            title="Copy Link"
          >
            <Icon.Link />
          </button>

          {/* Help Button - next to Copy Link */}
          {showHelp && <HelpButton onClick={onHelp} />}
        </div>
      </div>
    </header>
  );
}

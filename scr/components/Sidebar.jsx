// src/components/Sidebar.jsx — compact-aware
import React from "react";
import { Icon } from "./icons";
import Diagnostics from "./Diagnostics";
import { HighlightedText } from "../lib/highlight";

export default function Sidebar({ xmlModel, filteredEntries, activeAnchor, onClickTOC, query = "", compact = false }) {
  const itemPad = compact ? "py-1.5" : "py-2";
  const gapY = compact ? "space-y-0.5" : "space-y-1";
  return (
    <nav className="col-span-12 sm:col-span-4 md:col-span-3 xl:col-span-3 border-r border-slate-800 overflow-y-auto bg-slate-900/30" aria-label="Table of Contents" role="navigation">
      <div className="p-4">
        <div className="mb-3 flex items-center gap-2 text-slate-300 text-xs font-medium uppercase tracking-wide">
          <Icon.Folder />
          <span>Menu</span>
          {xmlModel && (
            <span className="ml-auto inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-slate-800 border border-slate-700 text-[10px]">
              {xmlModel.entries.length}
            </span>
          )}
        </div>

        {!xmlModel && <div className="text-sm text-slate-400">Load a T24 help XML to populate the TOC.</div>}

        {xmlModel && (
          <ul className={gapY}>
            <li>
              <button
                className={`w-full text-left px-3 ${itemPad} rounded-lg flex items-center gap-2 border ${activeAnchor === "overview" ? "bg-slate-800/80 border-slate-700" : "border-transparent hover:bg-slate-800/50"}`}
                onClick={() => onClickTOC("overview")}
              >
                <Icon.File />
                <span className="truncate">Overview</span>
                {activeAnchor === "overview" && <Icon.ChevronRight />}
              </button>
            </li>
            {filteredEntries.map((e) => (
              <li key={e.anchor}>
                <button
                  className={`w-full text-left px-3 ${itemPad} rounded-lg flex items-center gap-2 border ${activeAnchor === e.anchor ? "bg-slate-800/80 border-slate-700" : "border-transparent hover:bg-slate-800/50"}`}
                  onClick={() => onClickTOC(e.anchor)}
                  aria-current={activeAnchor === e.anchor ? "true" : undefined}
                >
                  <Icon.File />
                  <span className="truncate"><HighlightedText text={e.field} query={query} /></span>
                  {e.obsolete && (
                    <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-700/40">Obsolete</span>
                  )}
                  {activeAnchor === e.anchor && <Icon.ChevronRight />}
                </button>
              </li>
            ))}
            {filteredEntries.length === 0 && <li className="text-sm text-slate-400 px-2 py-1.5">No matches.</li>}
          </ul>
        )}

        <Diagnostics />
      </div>
    </nav>
  );
}

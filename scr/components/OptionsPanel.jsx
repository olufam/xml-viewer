// src/components/OptionsPanel.jsx
import React from "react";

export default function OptionsPanel({ open, onClose, prefs, setCompact, setFontSize, setWidth }) {
  if (!open) return null;
  return (
    <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl p-3 z-40">
      <div className="text-xs font-semibold text-slate-300 mb-2">View Options</div>

      {/* Compact mode */}
      <label className="flex items-center justify-between text-sm py-1.5">
        <span>Compact mode</span>
        <input
          type="checkbox"
          className="accent-sky-500 h-4 w-4"
          checked={!!prefs.compact}
          onChange={(e) => setCompact(e.target.checked)}
        />
      </label>

      {/* Font size */}
      <div className="text-sm py-1.5">
        <div className="mb-1">Font size</div>
        <div className="flex gap-1">
          {[
            { k: "s", label: "S" },
            { k: "m", label: "M" },
            { k: "l", label: "L" }
          ].map((opt) => (
            <button
              key={opt.k}
              onClick={() => setFontSize(opt.k)}
              className={`px-2 py-1 rounded-full border text-xs ${
                prefs.fontSize === opt.k ? "border-sky-500 bg-slate-800" : "border-slate-700 hover:bg-slate-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content width */}
      <div className="text-sm py-1.5">
        <div className="mb-1">Content width</div>
        <div className="flex gap-1 flex-wrap">
          {[
            { k: "narrow", label: "Narrow" },
            { k: "normal", label: "Normal" },
            { k: "wide", label: "Wide" }
          ].map((opt) => (
            <button
              key={opt.k}
              onClick={() => setWidth(opt.k)}
              className={`px-2 py-1 rounded-full border text-xs ${
                prefs.width === opt.k ? "border-sky-500 bg-slate-800" : "border-slate-700 hover:bg-slate-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2 flex justify-end">
        <button onClick={onClose} className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800">Close</button>
      </div>
    </div>
  );
}

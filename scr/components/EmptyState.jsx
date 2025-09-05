// src/components/EmptyState.jsx
import React from "react";

export default function EmptyState() {
  return (
    <div className="border border-dashed border-slate-700 rounded-2xl p-10 text-center bg-slate-900/40">
      <div className="text-3xl mb-2">📄</div>
      <h2 className="font-semibold mb-1">Load a T24 Help XML</h2>
      <p className="text-sm text-slate-400 max-w-prose mx-auto">
        Click <span className="font-medium">Load File</span> or drag & drop a <code>.xml</code> file anywhere. The app will
        extract <code>&lt;product&gt;</code>, <code>&lt;table&gt;</code>, overview text, and all fields under <code>&lt;menu&gt;</code>,
        then render a clean, readable view with a clickable table of contents.
      </p>
    </div>
  );
}

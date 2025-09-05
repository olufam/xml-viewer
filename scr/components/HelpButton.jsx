// src/components/HelpButton.jsx
//#h#  import React from "react";
//#h#  
//#h#  function HelpIcon() {
//#h#    return (<svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 15a1.25 1.25 0 110 2.5A1.25 1.25 0 0112 17zm0-11a4 4 0 00-4 4h2a2 2 0 114 0c0 .9-.47 1.35-1.55 2.06C11.45 12.7 11 13.3 11 15h2c0-.83.27-1.13 1.23-1.77C15.3 12.3 16 11.5 16 10a4 4 0 00-4-4z"/></svg>);
//#h#  }
//#h#  
//#h#  export default function HelpButton({ onClick }) {
//#h#    return (
//#h#      <button
//#h#        onClick={onClick}
//#h#        className="text-xs px-3 py-2 rounded-full bg-slate-800/70 border border-slate-700 hover:bg-slate-700 flex items-center gap-2"
//#h#        title="Help & Docs"
//#h#        aria-haspopup="dialog"
//#h#      >
//#h#        <HelpIcon />
//#h#        <span className="hidden sm:inline">Help</span>
//#h#      </button>
//#h#    );
//#h#  }

import React, { useEffect, useRef } from "react";

export default function HelpModal({ open, onClose, files, file, setFile, content }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEsc);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-16">
      <div
        ref={modalRef}
        className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-2xl w-full mx-4 relative overflow-hidden flex flex-col"
        tabIndex={-1}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="font-semibold text-lg">Help Docs</div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 text-xl font-bold px-2 py-1"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-6 py-2 gap-2 overflow-x-auto">
          {files.map((f) => (
            <button
              key={f.name}
              onClick={() => setFile(f)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${file.name === f.name ? "bg-sky-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-sky-100 dark:hover:bg-sky-800"}`}
            >
              {f.name.replace(".md", "")}
            </button>
          ))}
        </div>
        <div className="overflow-y-auto px-6 py-4 prose prose-slate dark:prose-invert max-h-[60vh]" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}
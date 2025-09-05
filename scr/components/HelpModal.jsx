// src/components/HelpModal.jsx
import React, { useEffect, useState } from "react";
import { getDocsIndex } from "../lib/docsIndex";
import { renderMarkdown } from "../lib/markdown";

function XIcon() {
  return (<svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M18.3 5.7L12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z"/></svg>);
}

export default function HelpModal({ open, onClose }) {
  const [docsIndex] = useState(() => getDocsIndex());
  const [active, setActive] = useState(null);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const orig = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = orig; };
  }, [open]);

  useEffect(() => {
    if (!open) { setActive(null); setBody(""); setErr(""); }
  }, [open]);

  async function handleOpenDoc(doc) {
    setActive(doc.name); setBody(""); setErr(""); setLoading(true);
    try { 
      const content = await doc.loader();
      setBody(content); 
    }
    catch (e) { setErr(String(e?.message || e)); }
    finally { setLoading(false); }
  }

  if (!open) return null;

  const doc = docsIndex.find(d => d.name === active);
  const html = body ? renderMarkdown(body) : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />
      <div className="relative z-10 w-[92vw] max-w-5xl max-h-[82vh] rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        <div className="flex h-[82vh]">
          <aside className="w-60 border-r border-slate-800 p-3 bg-slate-900/60">
            <div className="text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide">Docs</div>
            <ul className="space-y-1 text-sm">
              {docsIndex.map((d) => (
                <li key={d.name}>
                  <button
                    onClick={() => handleOpenDoc(d)}
                    className={`w-full text-left px-2 py-1.5 rounded-md border ${
                      active === d.name ? "bg-slate-800/80 border-slate-700" : "border-transparent hover:bg-slate-800/40"
                    }`}
                  >
                    {d.name.replace('.md', '').replace(/_/g, ' ')}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <section className="flex-1 relative">
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
              <div className="text-sm text-slate-300">{doc ? doc.name.replace('.md', '').replace(/_/g, ' ') : "Select a document"}</div>
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1 text-xs px-2 py-1.5 rounded-md border border-slate-700 hover:bg-slate-800"
                aria-label="Close help"
                title="Close"
              >
                <XIcon /> Close
              </button>
            </div>
            <div className="p-4 overflow-auto h-[calc(82vh-44px)]">
              {!doc && <div className="text-sm text-slate-400">Choose a markdown file from the left.</div>}
              {loading && <div className="text-sm text-slate-400">Loading…</div>}
              {err && <div className="text-sm text-rose-300 border border-rose-800/50 bg-rose-900/20 rounded-md p-2">{err}</div>}
              {doc && !loading && !err && body && (
                <article className="prose prose-sm dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: html }} />
                </article>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

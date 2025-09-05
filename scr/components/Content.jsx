// src/components/Content.jsx — width + font/prose + compact
import React from "react";
import { canUseHistory } from "../lib/history";
import { HighlightedText } from "../lib/highlight";

function renderParagraphs(paragraphs, query) {
  const nodes = [];
  for (let i = 0; i < paragraphs.length; i++) {
    const text = paragraphs[i];
    if (/^\s*validation rules\s*:*/i.test(text)) {
      nodes.push(
        <h4 key={`h4-${i}`} className="text-[13px] font-semibold mt-4 mb-2 text-slate-200">Validation Rules</h4>
      );
      continue;
    }
    nodes.push(
      <p key={`p-${i}`} className="text-slate-200/90">
        <HighlightedText text={text} query={query} />
      </p>
    );
  }
  return nodes;
}

export default function Content({ xmlModel, sectionRefs, contentRef, query, widthClass = "max-w-4xl", compact = false, fontSize = "m" }) {
  if (!xmlModel) return null;
  const cardPad = compact ? "p-3" : "p-4";
  const between = compact ? "space-y-3" : "space-y-4";

  const proseSize = fontSize === "s" ? "prose-sm" : fontSize === "l" ? "prose-lg" : "prose";

  return (
    <main ref={contentRef} className="col-span-12 sm:col-span-8 md:col-span-9 xl:col-span-9 overflow-y-auto" role="main">
      <div className={`${widthClass} mx-auto px-4 sm:px-8 py-6`}>
        {/* Overview */}
        <section id="overview" ref={(el) => sectionRefs.current.set("overview", el)} className="mb-6">
          <h2 className="text-lg font-semibold tracking-tight mb-3">Overview</h2>
          <div className={`rounded-2xl border border-slate-800 bg-slate-900/50 ${cardPad} shadow-sm`}>
            <div className={`${proseSize} dark:prose-invert max-w-none`}>
              {xmlModel.overviewPs.length === 0 ? (
                <p className="text-slate-400">No overview content.</p>
              ) : (
                xmlModel.overviewPs.map((p, i) => (
                  <p key={i}>
                    <HighlightedText text={p} query={query} />
                  </p>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Entries */}
        <div className={between}>
          {xmlModel.entries.map((e) => (
            <section id={e.anchor} key={e.anchor} ref={(el) => sectionRefs.current.set(e.anchor, el)}>
              <div className={`rounded-2xl border border-slate-800 bg-slate-900/60 ${cardPad} shadow-sm`}>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-base font-semibold tracking-tight">
                    <HighlightedText text={e.field} query={query} />
                  </h3>
                  {e.obsolete && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-700/40">Obsolete</span>
                  )}
                  <button
                    onClick={async () => {
                      const can = canUseHistory();
                      const base = can ? `${location.origin}${location.pathname}${location.search}` : "";
                      const link = `${base}#${e.anchor}`;
                      try { await navigator.clipboard.writeText(link); } catch {}
                    }}
                    className="ml-auto text-[11px] px-2 py-1 rounded-full bg-slate-800/70 border border-slate-700 hover:bg-slate-700"
                    title="Copy link to this section"
                  >
                    Copy Link
                  </button>
                </div>

                <div className={`${proseSize} dark:prose-invert max-w-none`}>
                  {renderParagraphs(e.paragraphs, query)}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

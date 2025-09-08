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

// New block-aware renderer
function renderBlocks(blocks, query) {
  // --- helpers
  const H = ({children}) => <h4 className="text-[13px] font-semibold mt-4 mb-2 text-slate-200">{children}</h4>;
  const Callout = ({tone="info", title, children}) => {
    const tones = {
      info:    "border-sky-500 bg-sky-500/5",
      note:    "border-amber-500 bg-amber-500/5",
      warn:    "border-rose-500 bg-rose-500/5",
      muted:   "border-slate-500 bg-slate-500/5"
    };
    return (
      <div className={`not-prose my-3 rounded-lg border-l-4 p-3 text-[13px] ${tones[tone]}`}>
        {title && <div className="font-medium mb-1">{title}</div>}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {children}
        </div>
      </div>
    );
  };
  const isListItem = (s) =>
    /^(\(?\d+\)?[.)]|[A-Z][.)]|[-–•*])\s+/.test(s);
  const isRuleHeading = (s) => /^\s*validation rules\s*:?\s*$/i.test(s);
  const isNote = (s) => /^\s*note\s*[:\-–]/i.test(s);
  const isExample = (s) => /^\s*example\s*[:\-–]/i.test(s);
  const isUnavailable = (s) => /help text .*unavailable/i.test(s);
  const isNotUsed = (s) => /not used at present/i.test(s);
  const isShort = (s) => s.length < 60;

  // Merge "broken" paragraphs: if previous didn't end a sentence and next looks like a continuation
  const merged = [];
  for (const b of blocks) {
    if (b.type !== "p") { merged.push(b); continue; }
    const s = b.text;
    const prev = merged[merged.length - 1];
    const endsSentence = /[.!?]"?$/.test(prev?.text || "");
    const looksCont = /^[a-z(]/.test(s) || /^(and|or|but|so|to|of|for|with|in|on|at|by|the)\b/i.test(s);
    if (prev && prev.type === "p" && !endsSentence && looksCont) {
      prev.text = (prev.text + " " + s).replace(/\s+/g, " ").trim();
    } else {
      merged.push({ ...b, text: s });
    }
  }

  // Tokenize into blocks: paragraphs, lists, headings, callouts, tables
  const out = [];
  let i = 0;
  while (i < merged.length) {
    const b = merged[i];

    if (b.type === "table") {
      out.push(<div key={`tb-${i}`} className="my-3 overflow-auto"
        dangerouslySetInnerHTML={{ __html: b.html.replace(/<table/g, '<table class="table-auto border-collapse w-full text-xs"') }} />);
      i++; continue;
    }

    const s = b.text;

    // 2.1 Rule heading
    if (isRuleHeading(s)) {
      out.push(<H key={`h-${i}`}>Validation Rules</H>);
      i++;
      // Gather following list-ish lines into bullets until the pattern breaks
      const items = [];
      while (i < merged.length && merged[i].type === "p" && (isListItem(merged[i].text) || isShort(merged[i].text))) {
        items.push(merged[i].text.replace(/^(\(?\d+\)?[.)]|[A-Z][.)]|[-–•*])\s+/, "").trim());
        i++;
      }
      if (items.length) {
        out.push(<ul key={`ul-rules-${i}`} className="list-disc pl-6 my-2">
          {items.map((t, k) => <li key={k}><HighlightedText text={t} query={query} /></li>)}
        </ul>);
      }
      continue;
    }

    // 2.2 Callouts
    if (isNote(s)) {
      out.push(
        <Callout key={`note-${i}`} tone="note" title="Note">
          <p><HighlightedText text={s.replace(/^note\s*[:\-–]\s*/i, "")} query={query} /></p>
        </Callout>
      );
      i++; continue;
    }
    if (isExample(s)) {
      out.push(
        <Callout key={`ex-${i}`} tone="info" title="Example">
          <p><HighlightedText text={s.replace(/^example\s*[:\-–]\s*/i, "")} query={query} /></p>
        </Callout>
      );
      i++; continue;
    }
    if (isUnavailable(s)) {
      out.push(
        <Callout key={`un-${i}`} tone="warn">
          <p><HighlightedText text={s} query={query} /></p>
        </Callout>
      );
      i++; continue;
    }
    if (isNotUsed(s)) {
      out.push(
        <Callout key={`nu-${i}`} tone="muted">
          <p><HighlightedText text={s} query={query} /></p>
        </Callout>
      );
      i++; continue;
    }

    // 2.3 Lists: consume consecutive list-items
    if (isListItem(s)) {
      const items = [];
      while (i < merged.length && merged[i].type === "p" && isListItem(merged[i].text)) {
        items.push(merged[i].text.replace(/^(\(?\d+\)?[.)]|[A-Z][.)]|[-–•*])\s+/, "").trim());
        i++;
      }
      out.push(<ul key={`ul-${i}`} className="list-disc pl-6 my-2">
        {items.map((t, k) => <li key={k}><HighlightedText text={t} query={query} /></li>)}
      </ul>);
      continue;
    }

    // 2.4 Plain paragraph
    out.push(
      <p key={`p-${i}`} className="text-slate-200/90">
        <HighlightedText text={s} query={query} />
      </p>
    );
    i++;
  }

  return out;
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
                  {e.blocks ? renderBlocks(e.blocks, query) : renderParagraphs(e.paragraphs, query)}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

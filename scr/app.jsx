import React, { useEffect, useMemo, useRef, useState } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Content from "./components/Content";
import EmptyState from "./components/EmptyState";
import HelpModal from "./components/HelpModal";
import FilePickerModal from "./components/FilePickerModal";

import { useTheme } from "./hooks/useTheme";
import { usePrefs } from "./hooks/usePrefs";
import { parseT24HelpXML } from "./lib/parseT24HelpXML";
import { readFileText } from "./lib/utils";
import { safeReplaceHash, safePushHash } from "./lib/history";
import { getDocsIndex } from "./lib/docsIndex";
import { renderMarkdown } from "./lib/markdown";

export default function App() {
  const { theme, setTheme } = useTheme();
  const { prefs, setCompact, setFontSize, setWidth } = usePrefs();

  const [xmlModel, setXmlModel] = useState(null);
  const [fileMeta, setFileMeta] = useState(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [activeAnchor, setActiveAnchor] = useState("");

  const sectionRefs = useRef(new Map());
  const contentRef = useRef(null);

  // Sort entries: overview first, then numbers, then alphabetically
  function sortEntries(entries) {
    const overview = entries.find((e) => e.anchor === "overview");
    const rest = entries.filter((e) => e.anchor !== "overview");
    rest.sort((a, b) => {
      // Numbers first (leading digits), then alphabetically
      const numA = /^\d+/.exec(a.field);
      const numB = /^\d+/.exec(b.field);
      if (numA && numB) {
        return parseInt(numA[0], 10) - parseInt(numB[0], 10);
      }
      if (numA) return -1;
      if (numB) return 1;
      return a.field.localeCompare(b.field, undefined, { sensitivity: "base" });
    });
    return overview ? [overview, ...rest] : rest;
  }


  // Filtered & sorted entries based on search query
  const filteredEntries = useMemo(() => {
  if (!xmlModel) return [];
  if (!query.trim()) return sortEntries(xmlModel.entries);
  const q = query.trim().toLowerCase();
  return sortEntries(
    xmlModel.entries.filter(
      (e) =>
        e.field.toLowerCase().includes(q) ||
        e.paragraphs.some((p) => p.toLowerCase().includes(q))
    )
  );
}, [xmlModel, query]);

  // Scroll spy
  useEffect(() => {
    if (!xmlModel) return;
    const rootEl = contentRef.current || undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((en) => en.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const first = visible[0];
        if (first?.target?.id) {
          setActiveAnchor(first.target.id);
          safeReplaceHash(`#${first.target.id}`);
        }
      },
      { root: rootEl, rootMargin: "0px 0px -70% 0px", threshold: [0, 1] }
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [xmlModel]);


  // No default file loading - show welcome screen instead
  useEffect(() => {
    // Set default title when no file is loaded
    document.title = "XML Viewer";
  }, []);


  // Deep-link on load
  useEffect(() => {
    if (!xmlModel) return;
    const raw = (window.location && window.location.hash) || "";
    const hash = decodeURIComponent(String(raw).replace(/^#/, ""));
    if (!hash) return;
    const el = sectionRefs.current.get(hash);
    if (el && contentRef.current) {
      contentRef.current.scrollTo({ top: el.offsetTop - 8, behavior: "smooth" });
      setActiveAnchor(hash);
    }
  }, [xmlModel]);

  const onPickFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    await loadFile(f);
  };

  const loadFile = async (f) => {
    setError("");
    try {
      const text = await readFileText(f);
      const model = parseT24HelpXML(text);
      setXmlModel(model);
      setFileMeta({ name: f.name, size: f.size });
      try { document.title = model.product && model.table ? `${model.product} : ${model.table}` : "XML Viewer"; } catch {}
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to read XML file.");
      setXmlModel(null);
      setFileMeta(null);
    }
  };

  // Drag & Drop
  useEffect(() => {
    const onDrop = async (ev) => {
      ev.preventDefault();
      const f = ev.dataTransfer?.files?.[0];
      if (f && f.name.toLowerCase().endsWith(".xml")) await loadFile(f);
    };
    const onDragOver = (ev) => ev.preventDefault();
    window.addEventListener("drop", onDrop);
    window.addEventListener("dragover", onDragOver);
    return () => {
      window.removeEventListener("drop", onDrop);
      window.removeEventListener("dragover", onDragOver);
    };
  }, []);

  const title = xmlModel?.product && xmlModel?.table ? `${xmlModel.product} : ${xmlModel.table}` : "LD : PM.LD.PARAM";

  const onClickTOC = (anchor) => {
    const el = sectionRefs.current.get(anchor);
    if (el && contentRef.current) {
      contentRef.current.scrollTo({ top: el.offsetTop - 8, behavior: "smooth" });
      setActiveAnchor(anchor);
      safePushHash(`#${anchor}`);
    }
  };

  // Pref-driven classes
  const fontClass = prefs.fontSize === "s" ? "text-sm" : prefs.fontSize === "l" ? "text-lg" : "text-base";
  const widthClass = prefs.width === "narrow" ? "max-w-3xl" : prefs.width === "wide" ? "max-w-5xl" : "max-w-4xl";

  // Help modal state
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpFiles] = useState(getDocsIndex());
  const [helpFile, setHelpFile] = useState(helpFiles[0]);
  const [helpContent, setHelpContent] = useState("");

  // File picker modal state
  const [filePickerOpen, setFilePickerOpen] = useState(false);

  useEffect(() => {
    if (!helpOpen || !helpFile) return;
    helpFile.loader().then((txt) => setHelpContent(renderMarkdown(txt))).catch(() => setHelpContent("Failed to load documentation."));
  }, [helpOpen, helpFile]);

  return (
    <div className={`h-screen w-full flex flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 ${fontClass}`}>
      <Header
        title={title}
        product={xmlModel?.product}
        table={xmlModel?.table}
        query={query}
        setQuery={setQuery}
        theme={theme}
        setTheme={setTheme}
        onPickFile={onPickFile}
        onOpenFilePicker={() => setFilePickerOpen(true)}
        activeAnchor={activeAnchor}
        prefs={prefs}
        setCompact={setCompact}
        setFontSize={setFontSize}
        setWidth={setWidth}
        fileMeta={fileMeta}
        // Help button props
        showHelp
        onHelp={() => setHelpOpen(true)}
      />

      <div className="flex-1 min-h-0 grid grid-cols-12">
        <Sidebar xmlModel={xmlModel} filteredEntries={filteredEntries} activeAnchor={activeAnchor} onClickTOC={onClickTOC} query={query} compact={prefs.compact} />
        {xmlModel ? (
          <Content xmlModel={xmlModel} sectionRefs={sectionRefs} contentRef={contentRef} query={query} widthClass={widthClass} compact={prefs.compact} fontSize={prefs.fontSize} />
        ) : (
          <main className="col-span-12 sm:col-span-8 md:col-span-9 xl:col-span-9 overflow-y-auto" role="main">
            <div className={`${widthClass} mx-auto px-4 sm:px-8 py-6`}><EmptyState /></div>
          </main>
        )}
      </div>

      {error && (
        <div className="max-w-4xl mx-auto my-3 rounded-xl border border-rose-800/50 bg-rose-900/20 text-rose-200 p-3 text-sm">{error}</div>
      )}

      <HelpModal
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        files={helpFiles}
        file={helpFile}
        setFile={setHelpFile}
        content={helpContent}
      />

      <FilePickerModal
        open={filePickerOpen}
        onClose={() => setFilePickerOpen(false)}
        onFileSelect={loadFile}
      />
    </div>
  );
}

// src/lib/parseT24HelpXML.js
import { slugify } from "./utils";

export function parseT24HelpXML(xmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "text/xml");
  const parserErr = doc.getElementsByTagName("parsererror")[0];
  if (parserErr) throw new Error("Invalid XML file.");

  const getText = (sel, root = doc) => {
    const el = root.querySelector(sel);
    return el ? el.textContent.trim() : "";
  };

  const product = getText("t24help > header > product");
  const table = getText("t24help > header > table");

  const overviewPs = Array.from(doc.querySelectorAll("t24help > overview > ovdesc p"))
    .map((p) => p.textContent.trim())
    .filter(Boolean);

  const tNodes = Array.from(doc.querySelectorAll("t24help > menu > t"));
  const entries = tNodes
    .map((t) => {
      const field = getText("field", t);
      
      // Parse description blocks (paragraphs and tables)
      function getDescBlocks(t) {
        const desc = t.querySelector("desc");
        if (!desc) return [];
        const blocks = [];
        desc.childNodes.forEach((node) => {
          if (node.nodeType !== 1) return; // element only
          const tag = node.tagName.toLowerCase();
          if (tag === "p") {
            const txt = (node.textContent || "")
              .replace(/\s+/g, " ")      // collapse big gaps
              .replace(/\s+([,.:%);])/g, "$1") // tidy spaces before punctuation
              .trim();
            if (txt) blocks.push({ type: "p", text: txt });
          } else if (tag === "table") {
            blocks.push({ type: "table", html: node.outerHTML });
          }
        });
        // Fallback: if no direct <p>, pull nested <p> (badly embedded XML)
        if (blocks.length === 0) {
          Array.from(desc.querySelectorAll("p")).forEach(p => {
            const txt = (p.textContent || "").replace(/\s+/g, " ").trim();
            if (txt) blocks.push({ type: "p", text: txt });
          });
          Array.from(desc.querySelectorAll("table")).forEach(tb => {
            blocks.push({ type: "table", html: tb.outerHTML });
          });
        }
        return blocks;
      }

      const blocks = getDescBlocks(t);
      let paras = blocks.filter(b => b.type === "p").map(b => b.text);
      // keep your existing filters:
      paras = paras.filter(x => x && x !== "/");
      const obsolete = paras.some(x => /\bobsolete\b/i.test(x));
      const ruleIdxs = [];
      paras.forEach((val, idx) => {
        if (/^\s*validation rules\s*:*/i.test(val)) ruleIdxs.push(idx);
      });
      return { field, anchor: slugify(field), paragraphs: paras, blocks, obsolete, ruleIdxs };
    })
    .filter((e) => e.field);

  return { product, table, overviewPs, entries };
}

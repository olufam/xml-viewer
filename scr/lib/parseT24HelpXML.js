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
      let paras = Array.from(t.querySelectorAll("desc p")).map((p) => p.textContent.trim());
      paras = paras.filter((x) => x && x !== "/");
      const obsolete = paras.some((x) => /\bobsolete\b/i.test(x));
      const ruleIdxs = [];
      paras.forEach((val, idx) => {
        if (/^\s*validation rules\s*:*/i.test(val)) ruleIdxs.push(idx);
      });
      return { field, anchor: slugify(field), paragraphs: paras, obsolete, ruleIdxs };
    })
    .filter((e) => e.field);

  return { product, table, overviewPs, entries };
}

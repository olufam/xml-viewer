// src/components/Diagnostics.jsx
import React, { useMemo, useState } from "react";
import { canUseHistory } from "../lib/history";
import { slugify } from "../lib/utils";
import { parseT24HelpXML } from "../lib/parseT24HelpXML";

export default function Diagnostics() {
  const [open, setOpen] = useState(false);
  const tests = useMemo(() => runTests(), []);
  const ok = tests.every((t) => t.pass);
  const hist = canUseHistory();

  return (
    <div className="mt-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className={
          "w-full text-left text-xs px-2 py-1.5 rounded-lg border " +
          (ok ? "border-emerald-400/40 text-emerald-300" : "border-amber-400/40 text-amber-300")
        }
      >
        {open ? "▾" : "▸"} Diagnostics {ok ? "(all tests passed)" : "(check warnings)"} — history: {String(hist)}
      </button>
      {open && (
        <div className="mt-2 space-y-1 text-[11px] text-slate-400">
          {tests.map((t, i) => (
            <div key={i} className={t.pass ? "text-emerald-300" : "text-amber-300"}>
              {t.pass ? "✔" : "✖"} {t.name} {t.pass ? "" : `— ${t.msg || "failed"}`}
            </div>
          ))}
          <div className="text-[10px] opacity-70">
            Note: In sandboxed iframes (about:srcdoc), URL updates are disabled; deep links still work via Copy Link.
          </div>
        </div>
      )}
    </div>
  );
}

function runTests() {
  const cases = [];
  // Test 1: slugify
  try {
    const input = "POS.FWD.VAR.INT";
    const out = slugify(input);
    const expect = "pos-fwd-var-int";
    cases.push({ name: "slugify basic", pass: out === expect, msg: `got ${out}` });
  } catch (e) {
    cases.push({ name: "slugify basic", pass: false, msg: String(e) });
  }

  // Test 2: parse minimal XML header/title + obsolete
  try {
    const xml = `<?xml version="1.0" encoding="utf-8"?>\n<t24help><header><product>LD</product><table>PM.LD.PARAM</table></header><overview><ovdesc><p>Intro</p></ovdesc></overview><menu><t><field>F1</field><desc><p>Alpha</p><p>Validation Rules:</p><p>Must be A</p></desc></t><t><field>F2</field><desc><p>This field is obsolete at 14.2.0</p></desc></t></menu></t24help>`;
    const model = parseT24HelpXML(xml);
    const pass = model.product === "LD" && model.table === "PM.LD.PARAM" && model.entries.length === 2 && model.entries[1].obsolete === true;
    cases.push({ name: "parse header + entries + obsolete", pass, msg: `entries=${model.entries.length}` });
  } catch (e) {
    cases.push({ name: "parse header + entries + obsolete", pass: false, msg: String(e) });
  }

  // Test 3: validation rules detection (nested)
  try {
    const xml = `<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<t24help><header><product>X</product><table>Y</table></header><menu><t><field>F3</field><desc><p><p>Validation Rules:</p></p><p>Line1</p><p>Line2</p></desc></t></menu></t24help>`;
    const model = parseT24HelpXML(xml);
    const hasRule = model.entries[0].ruleIdxs.length > 0;
    cases.push({ name: "detect nested Validation Rules", pass: hasRule, msg: hasRule ? "ok" : "not found" });
  } catch (e) {
    cases.push({ name: "detect nested Validation Rules", pass: false, msg: String(e) });
  }

  return cases;
}

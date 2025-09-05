// src/hooks/usePrefs.js
import { useEffect, useState } from "react";

const DEFAULTS = { compact: false, fontSize: "m", width: "normal" };
const KEY = "xmlv-prefs";

function loadPrefs() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
}

function savePrefs(p) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
}

export function usePrefs() {
  const [prefs, setPrefs] = useState(loadPrefs());

  useEffect(() => { savePrefs(prefs); }, [prefs]);

  const setCompact = (v) => setPrefs((p) => ({ ...p, compact: v }));
  const setFontSize = (v) => setPrefs((p) => ({ ...p, fontSize: v })); // 's'|'m'|'l'
  const setWidth = (v) => setPrefs((p) => ({ ...p, width: v })); // 'narrow'|'normal'|'wide'

  return { prefs, setCompact, setFontSize, setWidth };
}

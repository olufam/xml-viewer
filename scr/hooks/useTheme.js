// src/hooks/useTheme.js
const getLocalTheme = () => {
  try {
    const stored = localStorage.getItem("xmlv-theme");
    if (stored === "dark" || stored === "light") return stored;
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  } catch {}
  return "dark";
};

const setLocalTheme = (t) => {
  try { localStorage.setItem("xmlv-theme", t); } catch {}
};

import { useEffect, useState } from "react";
export function useTheme() {
  const [theme, setTheme] = useState(getLocalTheme());
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    setLocalTheme(theme);
  }, [theme]);
  return { theme, setTheme };
}

// src/lib/highlight.jsx
import React from "react";

export function HighlightedText({ text, query }) {
  if (!query) return <>{text}</>;
  const q = query.trim();
  if (!q) return <>{text}</>;
  try {
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
    const parts = String(text).split(re);
    return (
      <>
        {parts.map((part, i) =>
          re.test(part) ? (
            <mark key={i} className="rounded px-1 bg-yellow-200/60 dark:bg-yellow-300/20">{part}</mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  } catch (e) {
    return <>{text}</>;
  }
}

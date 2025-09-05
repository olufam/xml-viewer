// src/lib/history.js
export function canUseHistory() {
  try {
    const href = String(window.location?.href || "");
    if (href.startsWith("about:") || href.includes("srcdoc")) return false;
    if (!("pushState" in history) || !("replaceState" in history)) return false;
    return true;
  } catch {
    return false;
  }
}

export function safeReplaceHash(hash) {
  try {
    if (canUseHistory()) {
      history.replaceState(null, "", hash);
    } else {
      try { window.location.hash = hash.replace(/^#/, "#"); } catch {}
    }
  } catch {}
}

export function safePushHash(hash) {
  try {
    if (canUseHistory()) {
      history.pushState(null, "", hash);
    } else {
      try { window.location.hash = hash.replace(/^#/, "#"); } catch {}
    }
  } catch {}
}

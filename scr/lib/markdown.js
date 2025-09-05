// Minimal, safe-ish Markdown to HTML (headings, lists, bold/italic, code, links, blockquotes, images, hr, tables)
export function renderMarkdown(md) {
  if (!md) return "";
  let html = md;

  // Escape HTML
  html = html.replace(/[&<>"]/g, (ch) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch])
  );

  // Horizontal rule
  html = html.replace(/^\s*([-*_]){3,}\s*$/gm, '<hr class="my-6 border-slate-300 dark:border-slate-700"/>');

  // Blockquotes
  html = html.replace(/^>\s?(.*)$/gm, '<blockquote class="border-l-4 border-sky-400 pl-4 italic text-slate-600 dark:text-slate-300 my-2">$1</blockquote>');

  // Images ![alt](src)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" class="my-4 rounded shadow max-w-full" />');

  // Tables
  html = html.replace(/((?:\|.+\|(?:\n|$))+)/g, (table) => {
    const rows = table.trim().split('\n').filter(Boolean);
    if (rows.length < 2) return table;
    const header = rows[0].split('|').filter(Boolean).map(h => `<th class="px-3 py-2 border-b font-semibold">${h.trim()}</th>`).join('');
    const body = rows.slice(2).map(row =>
      `<tr>${row.split('|').filter(Boolean).map(d => `<td class="px-3 py-2 border-b">${d.trim()}</td>`).join('')}</tr>`
    ).join('');
    return `<table class="my-4 border-collapse w-full"><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>`;
  });

  // Code blocks (do this before inline code)
  html = html.replace(/```([\s\S]*?)```/g,
    (_m, code) => `</p><pre class="not-prose rounded-lg bg-slate-900 border border-slate-800 p-3 overflow-auto text-sm text-slate-100"><code>${code.replace(/\n/g,"<br/>")}</code></pre><p>`);

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="px-1 rounded bg-slate-800 border border-slate-700 text-slate-100">$1</code>');

  // Headings
  html = html.replace(/^######\s+(.+)$/gm, '<h6 class="mt-2 mb-1 text-slate-400 font-semibold text-xs">$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm,  '<h5 class="mt-3 mb-1 text-slate-400 font-semibold text-sm">$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm,   '<h4 class="mt-3 mb-2 text-slate-300 font-semibold text-base">$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm,    '<h3 class="mt-4 mb-2 text-slate-200 font-semibold text-lg">$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm,     '<h2 class="mt-5 mb-3 text-slate-200 font-semibold text-xl">$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm,      '<h1 class="mt-6 mb-3 text-slate-100 font-bold text-2xl">$1</h1>');

  // Bold / Italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g,     '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer" class="text-sky-400 underline">$1</a>');

  // Simple bullet lists
  html = html.replace(/(^|\n)-\s+(.+)(?=\n(?!-\s)|$)/gm, (m) => {
    const items = m.trim().split(/\n-\s+/).map(s => s.replace(/^-\s+/, '').trim()).filter(Boolean)
      .map(li => `<li class="my-1">${li}</li>`).join('');
    return `\n<ul class="list-disc pl-6 my-2">${items}</ul>`;
  });

  // Numbered lists
  html = html.replace(/(^|\n)\d+\.\s+(.+)(?=\n(?!\d+\.\s)|$)/gm, (m) => {
    const items = m.trim().split(/\n\d+\.\s+/).map(s => s.replace(/^\d+\.\s+/, '').trim()).filter(Boolean)
      .map(li => `<li class="my-1">${li}</li>`).join('');
    return `\n<ol class="list-decimal pl-6 my-2">${items}</ol>`;
  });

  // Split into paragraphs and wrap non-block elements
  const parts = html.split(/\n\n+/).map(b => b.trim()).filter(Boolean);
  html = parts.map(b => (/^<(h\d|ul|ol|pre|blockquote|table|hr|img)/.test(b) ? b : `<p class="my-2">${b}</p>`)).join('\n');

  return html;
}

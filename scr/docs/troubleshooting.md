# Troubleshooting

## SecurityError on `history.replaceState`
If running inside `about:srcdoc` (sandbox), history mutation is restricted. We guard with `canUseHistory()` and fall back to `location.hash` or no‑op. Use the **Copy Link** button to share deep links.

## No matches in search
Search matches both field names and description paragraphs; try different terms. Clear via the × icon.

## XML fails to load
- Ensure the file is valid XML with a `t24help` root.
- See console for parse errors.

## Fonts or width don’t change
The View Options panel persists settings in `localStorage` under `xmlv-prefs`. Clear LS or toggle settings again.


# Data Model

> This document describes the structure of the parsed XML data model used throughout the XML Viewer app.

---

## Overview

The XML Viewer parses T24 Help XML files into a normalized JavaScript object for rendering, searching, and navigation. The parser (`parseT24HelpXML`) extracts key metadata, overview paragraphs, and a list of field entries with anchors for deep-linking.

---

## Parsed Model Structure

```ts
{
  product: string,     // <t24help><header><product>
  table: string,       // <t24help><header><table>
  overviewPs: string[],// <t24help><overview><p>...
  entries: Array<{
    field: string,       // <t><field>
    anchor: string,      // slug(field) for deep-linking
    paragraphs: string[],// <t><desc><p>...
    obsolete: boolean,   // true if any paragraph contains "obsolete"
    ruleIdxs: number[]   // indices of paragraphs matching /^Validation Rules:/i
  }>
}
```

---

## Field Descriptions

- **product**: Product code or name, from `<header><product>`.
- **table**: Table name, from `<header><table>`.
- **overviewPs**: Array of overview paragraphs, from `<overview><p>`.
- **entries**: List of field sections, each with:
  - **field**: Field name or code.
  - **anchor**: Slugified field name for anchor navigation (e.g., `"POS.INT"` → `"pos-int"`).
  - **paragraphs**: Array of description paragraphs.
  - **obsolete**: Boolean, true if any paragraph contains "obsolete" (case-insensitive).
  - **ruleIdxs**: Array of indices for paragraphs that start with "Validation Rules:".

---

## Data Flow

1. **XML File Loaded**: User loads a `.xml` file.
2. **Parsing**: `parseT24HelpXML(xmlText)` parses the file and returns the model.
3. **State**: The model is stored in React state and passed to components.
4. **Rendering**: Sidebar and Content use `entries` and `overviewPs` for navigation and display.
5. **Anchors**: Each entry's `anchor` is used for deep-linking and scroll sync.

---

## Example

```json
{
  "product": "LD",
  "table": "PM.LD.PARAM",
  "overviewPs": [
    "This table contains parameters for ...",
    "Use this for configuration of ..."
  ],
  "entries": [
    {
      "field": "POS.INT",
      "anchor": "pos-int",
      "paragraphs": [
        "Interest posting field.",
        "Obsolete: Use POS.FWD.INT instead.",
        "Validation Rules: Must be numeric."
      ],
      "obsolete": true,
      "ruleIdxs": [2]
    }
    // ...more entries
  ]
}
```

---

## Notes

- Blank or `/` paragraphs are dropped during parsing.
- `anchor` is used for deep-linking (`#pos-int`) and scroll sync.
- "Validation Rules:" lines are interpreted as small headings in the UI.
- The model is designed for fast filtering, searching, and rendering.

---

## References

- [XML Viewer Architecture](./architecture.md)
- [Components](./components.md)
- [parseT24HelpXML.js](../lib/parseT24HelpXML.js)

---

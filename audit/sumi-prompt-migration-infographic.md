Create a single 16:9 infographic in **isometric-technical** style using a **linear-progression** layout. All text in English. Use rich visual scenes with clear hierarchy and ample whitespace. This is a Hirslanden hospital website migration case study — 290 static prototype pages reborn as Adobe Edge Delivery Services pages — rendered as a NASA-style systems documentation diagram showing the end-to-end pipeline.

---

## Layout Guidelines — Linear Progression (Process Variant, Horizontal)

The composition is a strict left-to-right horizontal sequence with four distinct zones occupying a single shared isometric ground plane:

- **Zone A (left ~22%)**: Source — the Variant C static prototype, depicted as a stacked archive of 290 isometric HTML page-blocks.
- **Zone B (center ~48%)**: Pipeline — four sequential isometric processing stations (01 Audit → 02 Build → 03 Emit → 04 Measure), connected by dashed alignment lines and directional flow arrows.
- **Zone C (right ~22%)**: Destination — an isometric Edge Delivery Services server rack / cloud module with Document Authoring data backbone.
- **Zone D (bottom strip, full width)**: a numerical legend strip — Lighthouse-style stat tiles (290 / 6 / 8 / ~7h / 79).

Anchored at the very top is a structured title block band spanning the full width with the headline, eyebrow, and a date stamp — like a drawing-set title block on an engineering drawing. The space immediately below the title is generous; the diagram itself sits below this header band, breathing.

Two dashed horizontal trajectory lines run the full width of the diagram zone, threading through every component — one above the pipeline modules (input bus), one below (output bus). Numbered callout circles (1, 2, 3, 4, 5, 6, 7, 8) connect to specific components by angled leader lines terminating in small filled dots, with a legend list off to one side, in the lower-right corner.

The whole image looks like a single page torn from a Rolls-Royce engine maintenance manual or a NASA spacecraft systems specification: ruled lines, parallel projection, no perspective convergence, every element annotated.

---

## Style Guidelines — Isometric Technical

Precise three-dimensional diagrams drawn at exact 30-degree axonometric angles — clean white surfaces with calculated shadow planes, cutaway sections revealing color-coded internals, exploded assemblies floating in perfect mathematical alignment along dashed trajectory lines, numbered callouts on leader lines pointing to every bolt and bracket. This is a NASA systems manual, a Haynes engine cross-section, a Siemens turbine specification — where bewildering complexity is rendered comprehensible through the disciplined geometry of parallel projection. No vanishing points. No artistic license. Every line serves documentation.

### Color Palette (use the Blueprint Classic + System Architecture combination)

- **Primary surfaces**: Clean white (#FFFFFF) for all top-facing isometric planes.
- **Secondary surfaces**: Light gray (#E5E7EB) for front-right faces; medium gray (#9CA3AF) for left/shadow faces.
- **Outlines**: Dark charcoal (#1F2937) for primary 2px outlines; medium gray (#6B7280) for 1px secondary structure.
- **Background**: Soft warm gray (#F3F4F6) with a faint 30°-aligned isometric grid of pale blueprint blue (#E0E7FF), barely visible — atmospheric, not decorative.
- **Cyan accent**: Hirslanden brand cyan (#0094D4) reserved exclusively for the EDS destination zone (cloud module, output flows, success indicators) — this is the signal that connects to the rest of the page's design language.
- **Dimension lines & technical annotations**: Blueprint blue (#2563EB) at 0.5–1px weight, dashed where required.
- **Signal red (#DC2626)**: Reserved for the single most critical callout — the "MD5 cross-check: 289 of 291 pages byte-identical" finding inside the Audit station — and for one warning indicator on the Source zone (the "hand-built HTML+CSS" stress label).
- **Safety yellow (#EAB308)**: For one caution indicator on the Measure station — the `getComputedStyle` annotation.
- **System green (#16A34A)**: Reserved exclusively for the final output node and the `290/290 OK` status pill in the legend strip.
- **Section fills (pale cutaway washes)**: Light blue (#DBEAFE) for data-bearing interiors (page stacks, DA storage), light orange (#FFEDD5) for processing units (Build, Emit modules), light violet (#EDE9FE) for measurement instruments.

### Visual Elements (apply throughout)

- **True 30° isometric projection.** Every horizontal line runs at exactly 30 degrees off the page horizontal; every vertical line is perfectly vertical. Parallel lines remain parallel to infinity. No vanishing points anywhere.
- **Three-value surface shading** for every isometric face, light source in the upper left.
- **Cutaway section planes** on at least one module (the Build module) — the exterior shell of one of the four pipeline stations is sliced open at a clean diagonal, revealing the eight EDS blocks stacked inside as small color-coded cubes (one per block: hero, audience-tabs, finder, head-row, cards, list-rows, aside-card, meta-strip, tabs — pick 8 of these for the cubes).
- **Exploded view** on the Source zone — the 290 page-blocks are mostly compressed into a tall isometric stack, but the top ~5 pages are exploded upward along dashed vertical alignment trajectories, each labeled with a faint German placeholder text suggesting hand-coded HTML.
- **Numbered callout system**: Eight numbered circles (1–8) on angled leader lines connecting to specific components, listed in a legend in the lower-right corner.
- **Dimension lines with arrow terminals** in blueprint blue annotating key measurements: the 290-page stack height labeled "290 PAGES", the pipeline length labeled "4 STAGES", the EDS rack height labeled "8 BLOCKS".
- **Flow direction arrows** — filled triangular arrowheads on the dashed trajectory lines connecting Source → 01 → 02 → 03 → 04 → EDS, all in dark charcoal except the final arrow into the EDS zone which is cyan.
- **Status indicator nodes** — small filled circles at each pipeline-to-pipeline junction: green for "complete", with one yellow at the Measure station indicating "open thread: mobile not yet measured".
- **Grid patterns on the floor plane** — a faint pale blueprint-blue isometric grid on the shared ground beneath all modules, suggesting scale and continuity.
- **NO perspective convergence**, **NO decorative embellishment**, **NO atmospheric lighting effects**, **NO marketing colors**, **NO rounded friendly shapes** — every element serves documentation.

### Compositional Pattern (Flow/Process)

Left-to-right sequence of isometric stages on a shared ground plane, connected by directional flow arrows. Each stage is a distinct isometric module showing the system at a discrete process phase. The transformation is visible between stages: at the Source the pages are static and uniform; entering Audit they are scanned (a thin red MD5 ribbon overlay); at Build they are reassembled into colored block-cubes inside a cutaway shell; at Emit they multiply (the 290 figure made tangible — small isometric page tokens flowing out in a fan); at Measure they pass through a caliper-like sensor; and they arrive at the EDS destination as a clean rack of cyan-accented servers.

### Visual Metaphor Mappings — Specific to this Content

| Concept from the content | Isometric technical metaphor in this image |
|---|---|
| Variant C static prototype (290 pages) | Tall isometric stack of identical thin page-blocks, each ~5mm thin, ~A4 footprint, like a ream of paper rendered as a perfect axonometric block. Top 5 pages exploded upward on dashed lines. Faint German lorem text on the top page. A small red flag annotates "HAND-CODED HTML+CSS". |
| 289 of 291 byte-identical CSS (the MD5 finding) | An isometric cylindrical scanning instrument (the Audit station) with a red horizontal scan beam passing across the page stack, and a callout reading "MD5 CROSS-CHECK · 289/291 IDENTICAL" in monospace inside a thin red-bordered annotation box. |
| 8 custom EDS blocks (hero, audience-tabs, finder, head-row, cards, list-rows, aside-card, meta-strip, tabs) | A rectangular isometric box (the Build station) cut away diagonally to reveal eight small color-coded isometric cubes stacked inside — each cube labeled with the block name in tiny technical sans-serif: HERO, AUDIENCE-TABS, FINDER, HEAD-ROW, CARDS, LIST-ROWS, ASIDE-CARD, META-STRIP. Use pale orange fill for the cutaway interior. |
| Bulk emission of 290 pages (migrate-to-eds.mjs) | An isometric extruder/conveyor module (the Emit station) with small page-tokens flowing out in a horizontal fan, each token a thin isometric rectangle. A counter callout reads "290 / 290 POSTED". |
| getComputedStyle + offsetHeight measurement | An isometric caliper or precision measurement instrument (the Measure station) — like a Mitutoyo bore gauge — with thin blueprint-blue dimension lines extending in three directions and a digital readout showing "0.00 PX". A safety-yellow annotation reads "PER-ELEMENT AUDIT". |
| Adobe Edge Delivery Services / DA-backed | A clean isometric server rack on the right with a cyan-accented vertical strip down its front edge. Above the rack, a small isometric cloud module labeled "aem.live" with a thin cyan connection line down into the rack. Below the rack, a horizontal data-storage drum labeled "DA · Document Authoring" with cyan flow lines feeding in. Status pill: "290 PAGES LIVE" in green. |
| ~7h active work / 4 sessions / 79 commits | A bottom legend strip with five Lighthouse-style square stat tiles: 290 / 6 / 8 / ~7h / 79 — each tile shown as a small isometric pedestal with the number on top in heavy technical numerals and the unit label below in tabular monospace. |
| Template-recipe driven, EDS-native, Measurement-driven, Snowflake-pattern chrome (the chips) | A horizontal strip of four small label plates positioned directly below the title block — each plate is a thin isometric rectangle with the chip text in uppercase monospace, separated by interpunct dots. |
| Pipeline as documented system | The four pipeline stations sit on a shared isometric platform with a faint pale blueprint grid underneath, like equipment on a factory floor. Two dashed alignment buses run the full width above and below the stations. |

### Typography

- **Headline / drawing title**: Bold technical sans-serif (DIN, Eurostile, or IBM Plex Sans Bold), uppercase, in a structured rectangular header band at the top of the composition. The band has a thin double rule top and bottom.
- **Section labels (SOURCE, PIPELINE, DESTINATION)**: Uppercase technical sans-serif, smaller than the headline, positioned as ribbon labels at the top of each zone.
- **Stage labels (01 AUDIT, 02 BUILD, 03 EMIT, 04 MEASURE)**: Uppercase technical sans-serif, two-line format with the stage number on the first line in larger weight and the verb on the second line.
- **Annotations and component labels**: Regular weight technical sans-serif (IBM Plex Sans, Barlow, or Roboto), connected to components by 0.5px angled blueprint-blue leader lines terminating in small filled dots.
- **Numerical figures (290, 6, 8, ~7h, 79)**: Heavy/bold tabular monospace (IBM Plex Mono, Roboto Mono) — figures must align in columns at the bottom stat strip.
- **Code-like annotations** (`getComputedStyle`, `migrate-to-eds.mjs`, `MD5`): Monospace, slightly smaller, in a pale gray panel behind the text.
- **Dimension text**: Tiny precise blueprint-blue, centered on dimension lines, always horizontal regardless of the dimension line angle.
- **NO serifs, NO decorative or script faces.** Pure engineered precision throughout.

### Anti-Patterns (avoid these)

- NOT perspective drawing (no vanishing points anywhere).
- NOT a loose sketch (every line ruled).
- NOT 3D rendered with glossy lighting effects or reflections (this is diagrammatic, not Cinema 4D).
- NOT kawaii, friendly, or rounded shapes.
- NOT a colorful marketing infographic with rainbow palettes — color is functional and sparing.
- NOT IKEA assembly style (this is full engineering annotation, not consumer assembly).
- NOT a "2D diagram with 3D-ish boxes" — the projection must be mathematically consistent throughout, all elements following identical 30° angles.

---

## Content (described as visual scenes — what to DRAW)

### TITLE BLOCK (top, full width, ~12% of frame height)

A structured rectangular header band with a thin double-rule top edge and double-rule bottom edge. Inside, three rows of text in a left-aligned column:

- Tiny eyebrow label in monospace: `MIGRATION JOURNEY · 2026-05-22`
- Main headline in heavy uppercase technical sans-serif: **FROM STATIC HTML TO EDGE DELIVERY SERVICES**
- Subhead in regular weight: `290 pages · 6 templates · ~7h active work`

To the right of the text column, inside the same header band, a small drawing-number style block: `SHEET 01 OF 01 · REV. A · SCALE: CONCEPTUAL` in tiny monospace, framed in a tabular cell grid like an engineering title block.

Immediately below the title block but above the diagram zone: a thin horizontal strip of four label plates reading (left to right, separated by interpuncts):
`TEMPLATE-RECIPE DRIVEN · EDS-NATIVE · MEASUREMENT-DRIVEN · SNOWFLAKE-PATTERN CHROME`

### ZONE A — SOURCE (left ~22% of frame, occupies vertical mid-band)

**Ribbon label** at the top of the zone: `SOURCE · VARIANT C PROTOTYPE`

**Main visual**: A tall isometric stack of identical thin page-blocks rendered in three-value gray shading. The stack reads as a ream of 290 sheets compressed into a perfect axonometric block, about 1.5x as tall as it is wide. Each page is approximately 5mm thin in the projection. The top ~5 pages are exploded upward along precise dashed vertical trajectories, separated by measured gaps, each floating slightly higher than the last.

**Annotations**:
- A small dimension line on the left side of the stack, blueprint blue, terminating in small arrows top and bottom, labeled `290 PAGES` in tiny tabular monospace.
- On the topmost exploded page, faint pale gray lorem-style German placeholder text suggesting a hospital website: a header line, two paragraphs of horizontal placeholder bars, a small image rectangle, a button.
- A small red-bordered warning flag pinned to the side of the stack, reading in tiny uppercase: `HAND-CODED HTML+CSS`.
- A callout circle "1" with leader line pointing to the stack.

**Sub-label** below the stack: `6 TEMPLATES · HOME / DOCTOR / FACHGEBIET / KRANKHEITSBILD / NEWS / JOBS` in small monospace, distributed across two lines.

### ZONE B — PIPELINE (center ~48% of frame, full vertical height)

**Ribbon label** at the top of the zone: `PIPELINE · TEMPLATE-RECIPE DRIVEN`

**Shared ground plane**: All four stations sit on a shared isometric platform with a faint pale blueprint-blue grid pattern. Two dashed alignment buses (one above, one below the stations) run the full horizontal length of the zone, threading through every station with small connector dots at each crossing.

**Flow arrows** between every adjacent pair of stations: filled triangular arrowheads in dark charcoal, riding along the lower dashed bus.

**Four stations, left to right**:

**Station 01 — AUDIT** (cylindrical scanning instrument)
- Shape: A short isometric cylinder, like a precision scanning drum, with a thin red horizontal beam emerging from its left face (pointing back toward the Source zone, as if it's scanning the page stack from a distance).
- Internal detail: A small isometric needle gauge on the front face with the dial pointed to the right.
- Annotation box (in tiny monospace inside a thin red-bordered rectangle): `MD5 CROSS-CHECK · 289 / 291 IDENTICAL`
- Stage label below: large `01` over `AUDIT`
- Callout circle "2" on leader line.

**Station 02 — BUILD** (cutaway box revealing 8 block-cubes)
- Shape: A clean isometric box, larger than Station 01, with a clean diagonal cutaway slice removing the upper-right corner.
- Cutaway interior: pale orange wash (#FFEDD5), with eight small color-coded isometric cubes stacked in a 2×4 arrangement inside. Each cube is labeled in tiny uppercase technical sans-serif on its top face: `HERO`, `AUDIENCE-TABS`, `FINDER`, `HEAD-ROW`, `CARDS`, `LIST-ROWS`, `ASIDE-CARD`, `META-STRIP`. (8 cubes total.)
- Cut edge marked with a bold blueprint-blue line.
- Stage label below: large `02` over `BUILD`
- Annotation: `8 CUSTOM EDS BLOCKS` in a thin gray-bordered rectangle.
- Callout circles "3" and "4" with leaders pointing into the cutaway and to the cut plane.

**Station 03 — EMIT** (extruder / conveyor)
- Shape: An isometric extruder module — a rectangular box with a small horizontal output spout on its right face.
- Out of the spout, small isometric page-tokens fan outward to the right, each a thin rectangle, distributed in a measured horizontal flow toward Station 04. About 8–10 visible tokens drawn, suggesting many more.
- Annotation box: `290 / 290 POSTED · DA SOURCE PUT API` in tiny monospace.
- A small concurrency annotation: `CONCURRENCY: 5`
- Stage label below: large `03` over `EMIT`
- Callout circle "5" on leader line.

**Station 04 — MEASURE** (precision instrument)
- Shape: An isometric caliper or precision bore-gauge style instrument — narrow, tall, with three thin dimension lines extending outward (one up, one to the right, one diagonal forward), each terminating in a blueprint-blue arrowhead.
- A small digital-readout display panel on its top face shows `0.00 PX` in monospace.
- A safety-yellow annotation: `PER-ELEMENT AUDIT · getComputedStyle()` — the `getComputedStyle()` portion shown in a pale gray code-style panel.
- Stage label below: large `04` over `MEASURE`
- Callout circle "6" on leader line.

**Status indicator nodes** at each station-to-station junction along the lower bus: small filled green circles between 01→02, 02→03, and 03→04. One filled yellow circle next to Station 04 with a tiny annotation `MOBILE: NOT YET MEASURED`.

### ZONE C — DESTINATION (right ~22% of frame, occupies vertical mid-band)

**Ribbon label** at the top of the zone: `DESTINATION · EDGE DELIVERY SERVICES`

**Main visual** (three stacked elements aligned on a shared vertical axis):
- **Top**: A small isometric cloud module — a soft cloud-shape drawn in flat isometric using two intersecting rounded prisms — labeled in tiny uppercase: `aem.live`. A thin cyan vertical connection line descends from the cloud to the server rack below.
- **Middle**: A clean isometric server rack, about the same height as the Source page stack, with a strong cyan accent strip running vertically down its front-right edge. The rack shows several horizontal slots, each labeled with tiny monospace identifiers. A status pill at the top of the rack reads `290 PAGES LIVE` in green tabular monospace.
- **Bottom**: A horizontal isometric data-storage drum (like a wide low cylinder) labeled `DA · DOCUMENT AUTHORING` in monospace on its visible face. Two thin cyan flow lines arc upward from the drum into the bottom of the server rack.

**Annotations**:
- A dimension line beside the rack labeled `8 BLOCKS · 3 FRAGMENTS` in tabular monospace.
- A small URL annotation in pale gray monospace: `eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page` — wrapped over two lines, positioned just outside the rack zone.
- Callout circles "7" and "8" on leaders pointing to the cloud and the DA drum.

**Sub-label** below the destination cluster: `DA-BACKED · BRANCH PREVIEW · STATIC-FRAGMENT CHROME`

### ZONE D — LEGEND STRIP (bottom, full width, ~14% of frame height)

A horizontal strip across the full bottom of the diagram zone, separated from the diagram above by a thin charcoal rule. Inside the strip, two elements:

**Left ~60% — Stat tiles** (five isometric pedestal tiles in a horizontal row):
- Tile 1: `290` on top in heavy tabular monospace, `PAGES` below in tiny uppercase.
- Tile 2: `6` on top, `TEMPLATES` below.
- Tile 3: `8` on top, `BLOCKS` below.
- Tile 4: `~7h` on top, `ACTIVE WORK` below.
- Tile 5: `79` on top, `COMMITS` below.

Each tile is a small isometric pedestal in three-value gray, with the number on the top face. Tiles are spaced evenly with thin blueprint-blue interpunct dots between them.

**Right ~40% — Callout legend** (a tabular list in a thin gray-bordered panel):
```
1  SOURCE STACK · 290 STATIC HTML PAGES
2  AUDIT · MD5 CROSS-CHECK
3  BUILD · 8 EDS BLOCKS (CUTAWAY)
4  BUILD · BLOCK INVENTORY
5  EMIT · BULK 290 → DA
6  MEASURE · getComputedStyle()
7  aem.live CLOUD DELIVERY
8  DA · DOCUMENT AUTHORING STORE
```

Each row in the legend has a small numbered circle on the left, the label in regular weight, monospace.

### BOTTOM-RIGHT CORNER METADATA

Below the legend, in tiny pale gray monospace: `4 SESSIONS · 21H ELAPSED · 2026-05-21 → 2026-05-22 · CATALAN-ADOBE/HIRSLANDEN-EDS-PROTOTYPE`

---

## Text Labels (all text that should appear in the infographic)

### Title block
- Eyebrow: `MIGRATION JOURNEY · 2026-05-22`
- Headline: `FROM STATIC HTML TO EDGE DELIVERY SERVICES`
- Subhead: `290 pages · 6 templates · ~7h active work`
- Title block metadata: `SHEET 01 OF 01 · REV. A · SCALE: CONCEPTUAL`
- Chip strip: `TEMPLATE-RECIPE DRIVEN · EDS-NATIVE · MEASUREMENT-DRIVEN · SNOWFLAKE-PATTERN CHROME`

### Zone A — Source labels
- Ribbon: `SOURCE · VARIANT C PROTOTYPE`
- Dimension: `290 PAGES`
- Warning flag: `HAND-CODED HTML+CSS`
- Sub-label: `6 TEMPLATES · HOME / DOCTOR / FACHGEBIET / KRANKHEITSBILD / NEWS / JOBS`

### Zone B — Pipeline labels
- Ribbon: `PIPELINE · TEMPLATE-RECIPE DRIVEN`
- Station 01: `01` / `AUDIT` / `MD5 CROSS-CHECK · 289 / 291 IDENTICAL`
- Station 02: `02` / `BUILD` / `8 CUSTOM EDS BLOCKS`
- Station 02 inner cube labels: `HERO`, `AUDIENCE-TABS`, `FINDER`, `HEAD-ROW`, `CARDS`, `LIST-ROWS`, `ASIDE-CARD`, `META-STRIP`
- Station 03: `03` / `EMIT` / `290 / 290 POSTED · DA SOURCE PUT API` / `CONCURRENCY: 5`
- Station 04: `04` / `MEASURE` / `PER-ELEMENT AUDIT · getComputedStyle()` / `0.00 PX`
- Status: `MOBILE: NOT YET MEASURED`

### Zone C — Destination labels
- Ribbon: `DESTINATION · EDGE DELIVERY SERVICES`
- Cloud: `aem.live`
- Server rack status: `290 PAGES LIVE`
- Dimension: `8 BLOCKS · 3 FRAGMENTS`
- URL: `eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page`
- DA drum: `DA · DOCUMENT AUTHORING`
- Sub-label: `DA-BACKED · BRANCH PREVIEW · STATIC-FRAGMENT CHROME`

### Zone D — Legend strip
- Stat tiles: `290 / PAGES`, `6 / TEMPLATES`, `8 / BLOCKS`, `~7h / ACTIVE WORK`, `79 / COMMITS`
- Legend rows (numbered 1–8):
  - `1  SOURCE STACK · 290 STATIC HTML PAGES`
  - `2  AUDIT · MD5 CROSS-CHECK`
  - `3  BUILD · 8 EDS BLOCKS (CUTAWAY)`
  - `4  BUILD · BLOCK INVENTORY`
  - `5  EMIT · BULK 290 → DA`
  - `6  MEASURE · getComputedStyle()`
  - `7  aem.live CLOUD DELIVERY`
  - `8  DA · DOCUMENT AUTHORING STORE`

### Bottom-right metadata
- `4 SESSIONS · 21H ELAPSED · 2026-05-21 → 2026-05-22 · CATALAN-ADOBE/HIRSLANDEN-EDS-PROTOTYPE`

---

## Final Quality Bar

This infographic must look like a single page lifted from an engineering documentation set — clean, ruled, mathematically consistent, dense with accurate annotation, sparing in its use of color, authoritative in its presentation. The viewer should feel they are reading a technical specification, not a marketing infographic. Every line must be ruled, every angle exactly 30° (horizontals) or 90° (verticals), every label legible, every number tabular and aligned. The Hirslanden brand cyan (#0094D4) appears only at the EDS destination zone, signaling the migration's endpoint and harmonizing with the surrounding website's design language. All other accents (red, yellow, green, blueprint blue) are functional indicators, never decoration. The composition reads left-to-right as a complete migration pipeline at a single glance, then rewards close inspection with the eight numbered callout details.

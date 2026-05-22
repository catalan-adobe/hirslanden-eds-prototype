# EDS block mapping for the 6 site templates

**Date:** 2026-05-21
**Source:** Per-template `data-section` inventory from the Phase 01 HTML audit, cross-referenced with the 21 EDS skills under `.agents/skills/` (notably `page-import`, `identify-page-structure`, `block-inventory`, `content-modeling`). Applied David's Model heuristics: minimize blocks, prefer default content, reuse Block Collection where possible.

## Finding

Every `data-section` across the 290 content pages decomposes cleanly into one of three EDS authoring primitives: **default content** (Markdown/HTML), the **Block Collection `cards`** block, or one of **7 new custom blocks**. 4 of the 7 custom blocks (`hero`, `meta-strip`, `list-rows`, `aside-card`) serve 2 or more templates; `tabs` is fachgebiet-only; `audience-tabs` and `finder` are exclusive to the home page. Header, footer, and breadcrumb are explicitly out of scope — handled by the EDS theme's `nav.html` / `footer.html` and auto-generation.

## Evidence

### Per-template section → EDS mapping

Excluded from every template: `data-section="header"`, `data-section="footer"`, and the `<nav class="crumb">` breadcrumb.

#### 1 · `doctor-profile` (150 pages)

| `data-section` | EDS approach | Block / style | Notes |
|---|---|---|---|
| `hero` | Custom block | **`hero`** (split-portrait variant) | text + portrait + 2 CTAs + 4-up KPI strip |
| `meta` | Custom block | **`meta-strip`** | icon + text key-value items + termin link |
| `body` | Two-column section | section style `two-column` | left = article default content + **`list-rows`** (Bereiche); right = **`aside-card`** (form variant) |

#### 2 · `fachgebiet` (60 pages — fachgebiete 50 + ueber-uns 5 + kliniken-und-zentren 5)

| `data-section` | EDS approach | Block / style | Notes |
|---|---|---|---|
| `hero` | Reuses `doctor-profile`'s hero block | **`hero`** | identical structural shape |
| `tabs` | Custom block | **`tabs`** | 5-tab sub-navigation (Krankheitsbilder · Behandlungen · Zentren · Forschung · Ärzteschaft) |
| `conditions-list` | Default content + custom block | header default + **`list-rows`** | A–Z related items |

#### 3 · `krankheitsbild` (50 pages)

| `data-section` | EDS approach | Block / style | Notes |
|---|---|---|---|
| `hero` | Reused | **`hero`** | |
| `meta` | Reused with different content | **`meta-strip`** | Geprüft von / Aktualisiert / Lesezeit / Drucken |
| `body` | Two-column section | section style `two-column` | left = article default content (H2/H3/P/UL); right = **`aside-card`** (TOC variant — derivable from H2s) |

#### 4 · `news-article` (25 pages)

| `data-section` | EDS approach | Block / style | Notes |
|---|---|---|---|
| `article-hero` | Default content on styled section | section style `bg-surface` | eyebrow + h1 + lede + meta-strip line — no block needed |
| `body` | Two-column section | section style `two-column` | left = article default content; right = **`aside-card`** (facts variant — dl/dt/dd) |

#### 5 · `jobs-landing` (4 pages)

| `data-section` | EDS approach | Block / style | Notes |
|---|---|---|---|
| `hero` | Reused | **`hero`** | |
| `content` | Default content + custom block | header default + **`list-rows`** | Content items |

#### 6 · `home` (1 page)

| `data-section` | EDS approach | Block / style | Notes |
|---|---|---|---|
| `hero` | Reused (image-only variant, no portrait) | **`hero`** | |
| `audience-tabs` + `audience-panel` | Custom block (composite) | **`audience-tabs`** | Home-exclusive |
| `finder` | Custom block on styled section | **`finder`** on section style `bg-secondary` | Home-exclusive search widget with tabs + form |
| `schwerpunkte` | Block Collection | **`cards`** | 4-up service grid |
| `news` | Reused | **`list-rows`** | |
| `events` | Block Collection (events variant) | **`cards`** | 4-up date+title grid |

### Consolidated custom block library

| Block | Pages | Variants needed | Effort |
|---|---:|---|---|
| `hero` | 290 | split-portrait (doctor); split-image (fachgebiet, krankheitsbild, jobs); image-only-with-kpi (home) | 1 block, 3 variants |
| `meta-strip` | 225 | doctor (location/lang/insurance); krankheitsbild (geprüft/aktualisiert/lesezeit/drucken) | 1 block, content-driven |
| `list-rows` | ~234 | base (date / title / tag / →) | 1 block, single variant |
| `aside-card` | ~225 | form (doctor); toc (krankheitsbild); facts (news) | 1 block, 3 variants |
| `tabs` | 60 | sub-navigation | 1 block |
| `audience-tabs` | 1 | home-only composite | 1 block |
| `finder` | 1 | home-only search widget | 1 block |

Plus Block Collection reuse:

| Block | Pages | Source |
|---|---:|---|
| `cards` | ~6 (home services + events) | Block Collection — needs verification via `block-inventory` skill at Phase 03 start; events may need a date-prefix variant |

### Default content coverage

- **Article body** (H1/H2/H3/P/UL/IMG) — primary content of `krankheitsbild` (50) and `news-article` (25); section headers on `fachgebiet` / `jobs-landing`
- **News-template `article-hero`** — eyebrow + h1 + lede + author/date line, all default content under a `bg-surface` section
- **Section eyebrow + h2** preceding every `list-rows` and `cards` block

### Section metadata styles needed

| Style | Used by | Effect |
|---|---|---|
| `bg-surface` | `meta` sections; news `article-hero` | Light gray (`#F7F6F5`) background band |
| `bg-secondary` | `finder` section (home) | Dark blue (`#27455C`) background, white text |
| `two-column` | `body` sections (doctor, krankheitsbild, news) | Article + sticky aside layout |

## Implications

- **7 custom blocks + Block Collection `cards`** is the minimum viable EDS block library to cover the entire content surface of the 290 pages.
- **Concentrated reuse** — 4 of the 7 custom blocks serve multiple templates, and `hero` alone touches all 5 content templates. That's what makes Approach A (template-recipe driven) viable: building each shared block pays off across many templates.
- **The `aside-card` variant model** lets one block serve three semantically distinct right-rails. If variants prove unwieldy, the fallback is three sibling blocks at the cost of duplicated CSS.
- **Bulk emission** (Phase 05) can adapt the existing `migrate.mjs` pattern — that script already iterates 289 captured pages through template renderers, so swapping the renderer output to EDS-import HTML is structurally the same job.
- **No header/footer migration is required by this evaluation** — the EDS theme will provide them via `nav.html` and `footer.html` (separate phase, separate scope).

## Related

- [journal/02 — EDS content migration evaluation](../journal/02-eds-content-migration-evaluation.md)
- [decisions/0002 — EDS migration approach](../decisions/0002-eds-migration-approach.md)
- [discoveries/site-template-structure](./site-template-structure.md) — the Phase 01 audit this analysis builds on
- EDS skills under `.agents/skills/`: `page-import`, `block-inventory`, `content-modeling`, `building-blocks`, `create-site`

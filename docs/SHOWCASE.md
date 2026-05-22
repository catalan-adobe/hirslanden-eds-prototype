# From static HTML to Edge Delivery — 290 pages, ~7h of active work

A short story of how we took 290 pages of a German hospital-group static site (a Variant C prototype) and migrated them into Adobe Edge Delivery Services in **roughly 7 hours of active work** (across 4 sessions, over a 21h elapsed window), with **high visual fidelity at 1440px** and a handful of small documented gaps still on the open-thread list.

> **What the team sees if they only have 30 seconds**
>
> 1. **The site:** https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/ — 290 pages live on EDS preview, all six templates, matching the source closely at 1440px.
> 2. **The proof:** `audit/side-by-side/sbs-*.png` — 6 full-page comparisons (original on the left, migrated on the right, one image per template).
> 3. **The receipts:** `docs/journal/` (11 phase narratives) + `docs/decisions/` (5 ADRs) + git log (79 commits across 2 repos).
>
> **What's not 1:1:** Tab heights ~8px taller than source, breadcrumb section-links point at parent listing pages we didn't migrate (so they 404), mobile (375px) never measured. All listed under "Deliberate non-goals" + "What's still not 1:1" below.

---

## By the numbers

| Metric | Value |
|---|---|
| **Pages migrated** | 290 (1 home + 150 doctor + 50 fachgebiet + 50 krankheitsbild + 25 news + 4 jobs + 5 kliniken + 5 ueber-uns) |
| **Templates** | 6 distinct shapes |
| **Custom EDS blocks** | 8 (hero, audience-tabs, finder, head-row, cards, list-rows, aside-card, meta-strip, tabs) |
| **Migration script** | 1 (`migrate-to-eds.mjs`) + 2 bulk runners |
| **Static fragments** | 3 (`fragments/header.html`, `header-home.html`, `footer.html`) |
| **Commits on EDS prototype** | 49 |
| **Commits on this repo** | 30 (docs + migration scripts) |
| **Lines changed (EDS repo)** | +2,390 / −481 across 25 files |
| **Lines changed (this repo)** | +18,584 across 373 files (mostly bulk-emitted page HTML) |
| **Documentation** | 11 journal phases, 5 ADRs, 3 discoveries, 1 showcase (this doc) |
| **Time elapsed** | First commit 2026-05-21 14:21 — last 2026-05-22 10:50 |
| **Repos** | `migrate-hirslanden` (source + scripts + docs), `hirslanden-eds-prototype` (the EDS project) |

---

## What's deployed (one-line per template)

| Template | Migrated URL example |
|---|---|
| Home | https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/ |
| Doctor (150) | https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/de/corporate/aerzte/1/docteur-christian-jaccard |
| Fachgebiet (50) | https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/de/corporate/fachgebiete/akupunktur-traditionelle-chinesische-medizin |
| Krankheitsbild (50) | https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/de/corporate/krankheitsbilder/angina-pectoris |
| News (25) | https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/de/corporate/medien-und-news/medienmitteilungen-und-news/archiv |
| Jobs (4) | https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/de/corporate/jobs-und-karriere/arbeitgeberin |

Random 15-sample spot-check at session end: **15/15 200 OK** on deeply nested paths across all templates.

DA browser: https://da.live/#/catalan-adobe/hirslanden-eds-prototype/de/corporate
GitHub: https://github.com/catalan-adobe/hirslanden-eds-prototype

---

## The arc — 11 phases, told as a story

Each phase has its own journal at `docs/journal/NN-*.md` with full context. This is the skim.

### Act I — Understanding the artifact (phases 01–02)

**01 · HTML structure audit.** 291 static HTML files, all in German, all roughly the same shape. We did a deep look: same boilerplate `<head>`, same chrome (header/footer/breadcrumb), six body templates. Crucially, the `<style>` block was 289 of 291 times **byte-identical** — a single Variant C design system. *That MD5 finding rerouted everything that followed: a template-recipe migration was clearly going to win.*

**02 · EDS migration approach.** Picked **Approach A — template-recipe driven** (build a block library, validate via per-template pilots, then bulk-emit). Documented as [ADR-0002](decisions/0002-eds-migration-approach.md). Rejected the per-page `page-import` approach (290× slower) and a generic-block-only approach (lossy).

### Act II — Building the foundation (phases 03–04)

**03 · EDS project bootstrap.** Created `catalan-adobe/hirslanden-eds-prototype` via the EDS create-site flow, linked the GitHub App, set up DA at `https://da.live/#/catalan-adobe/hirslanden-eds-prototype`. **First branch decision recorded here:** [ADR-0004 — work on feature branches, never push without explicit ask](decisions/0004-branch-workflow.md). This rule held for the entire session.

**04 · Block library.** Built 8 custom blocks (hero, list-rows, head-row, aside-card, meta-strip, tabs, audience-tabs, finder) + extended boilerplate `cards` with an events variant. Adopted the design tokens directly from the source's `<style>` `:root` block. Imported `metropolis` font with Helvetica/Arial fallback (matches source's font-family declaration).

### Act III — Per-template pilots + first fidelity pass (phases 05–07)

**05 · Template pilots** (home deferred). Ran the migration through one page per template: doctor, fachgebiet, krankheitsbild, news, jobs. Validated the block library against actual content; tightened block decoration logic per template.

**06 · Fidelity pass.** First serious comparison against `127.0.0.1:8080` originals. Caught the things you only notice when you put pages side by side: aside-card width, two-column grid, list-rows layout.

**07 · Polish + home pilot.** Home page assembled (the only multi-section heterogeneous template). At this point the prototype "looked good" but no rigorous measurement had happened yet.

### Act IV — Bulk + the first 1:1 audit (phases 08–09)

**08 · Bulk emission (290 pages).** `migrate-to-eds.mjs` + `migrate-bulk.mjs` + `post-bulk.mjs`. Generated all 290 EDS-import HTMLs, uploaded to DA via the admin API (concurrency 5), triggered previews. Hit and fixed a slug-normalization gotcha (admin.hlx.page rejects `--` and trailing `-`). 290/290 posted, 290/290 previewed.

**09 · 1:1 fidelity audit.** User said *"close but not yet 1:1"*. We did a systematic side-by-side at 1440px across all 6 templates. **Caught 5 structural gaps** (KPI strip position, hero image caption, article-body width, doctor form fields, events grid layout). Fixed and re-emitted. The bar was now explicit: **strict 1:1, not "near"**.

### Act V — Chrome (phases 10–10.1)

**10 · Static header/footer fragments.** Adopted the **snowflake skill's** static-fragment sub-pattern: chrome ships as plain HTML files (`fragments/header.html`, `fragments/header-home.html`, `fragments/footer.html`) fetched by minimal block decorators. Tradeoff documented as [ADR-0005 — chrome trades authorability for fidelity](decisions/0005-static-chrome-via-snowflake.md). Replaced the boilerplate's 273-line `header.css` with the source's actual styling, scoped under `.header.block`. Pushed.

**10.1 · Strict 1:1 audit caught 4 sub-pixel bugs.** User reviewed: *"close but not yet 1:1"* (again). This is the moment that taught us *screenshots lie*. Going element-by-element with `getComputedStyle` + `offsetHeight` surfaced four discrete bugs:

| Symptom | Root cause |
|---|---|
| Search circle 39×39 instead of 36×36 | Source has global `*{box-sizing:border-box}`; prototype only applied border-box to buttons |
| Heights +1–2px per text line across the chrome | Source `body{line-height:1.55}`, prototype `body{line-height:1.6}` |
| f-brand logo container 56px instead of 34px | Source has global `img{display:block}`; prototype defaulted to inline → baseline descender added space |
| (And a broken CSS comment from a stylelint autofix turning `</style>` into `\3c style>`) | Cosmetic but exposed by lint |

The **three load-bearing source globals** (`*{box-sizing:border-box}`, `body{line-height:1.55}`, `img{max-width:100%;display:block}`) became the key insight that drove Phase 11.

### Act VI — Every block, computed-style audited (phases 11 + 11.1)

**11 · Per-block 1:1 sweep.** Promoted the three source globals into the prototype's `styles.css` once → fixed cascading gaps across all 8 blocks in one commit. Then walked each block individually with `getComputedStyle`:

- **hero** — buttons stacked vertically (EDS auto-wraps each in `<p class="button-wrapper">`); hero.js now groups consecutive wrappers into a `.hero-cta` flex div mirroring source's `<div style="display:flex;gap:12px;flex-wrap:wrap">`. Plus 5 other margin/padding fixes.
- **audience-tabs + tabs** — tab height inflated by 34px due to EDS auto-`<p>` margins inside `.atab-label` / `.atab-sub`. Fix: `.atab-bar .atab p { margin: 0 }`.
- **cards (events variant)** — boilerplate's `.cards-card-body { margin: 16px }` shrunk each cell by 32px, making cards 77px taller than source. Fix: scoped reset for events variant.
- **meta-strip** — block-level padding doubled with the row's padding. Fix: block becomes a passthrough, row owns spacing.
- **finder** — added the missing "Tipp: Mehrere Filter kombinieren ist erlaubt." hint in finder.js.
- **head-row, list-rows, aside-card** — already 1:1 after the global resets landed. Zero block-level changes needed.

Then heading sizes globally — source uses 41/26/20/16 with text-transform uppercase + letter-spacing on h1/h2; prototype was using 45/36/28/22. Updated globally + added two context overrides (article-body sentence-case + news-template h1 36px sentence-case).

**Then section styling.** Sources sections use `padding: 48px 0` so backgrounds fill the full vertical band; prototype used `margin: 40px 0` so bg only filled content. Fixed globally. Plus three section-style additions emitted by the migration script:
- `bg-surface` (default) — schwerpunkte + events sections on home
- `bg-surface meta-band` (14px 0 padding) — thin meta-strip band on doctor + krankheitsbild
- `bg-surface article-hero-band` (32px 0 24px padding) — asymmetric band on news

Bulk re-emitted 290 pages, re-POSTed to DA, re-previewed. The whole loop took ~3 minutes.

**11.1 · Breadcrumb closed.** The last visible gap. JS-derived from `window.location.pathname` + page H1, appended as `<nav class="crumb">` inside `<header>` but outside the sticky block. 5-entry path-to-label map covers all template families. Home returns null (matches source).

---

## What made this work

### 1 · Template-recipe was the right gamble

Phase 01's MD5 finding (289 of 291 source pages share byte-identical CSS) was the unlock. It meant we could:
- Build the block library once, validate per-template, bulk-emit per-page
- Trust that visual fidelity on one doctor page meant fidelity on all 150
- Iterate the migration script — not 290 page authors

Without that, this would have been a 290× workflow, not a one-pass workflow.

### 2 · `getComputedStyle` beats screenshots for fidelity work

Screenshots stop at "looks close." Computed-style measurement surfaces the ±2–8px discrepancies screenshots miss. Phase 10.1 caught 4 chrome bugs that screenshots passed; Phase 11 caught a dozen more across blocks. The methodology pattern, applied to every block:

1. Query both pages with the **same selectors** in a headless browser
2. Capture `offsetHeight`, `offsetWidth`, `getComputedStyle(el)` for every meaningful property
3. Build a comparison table — every row is a gap or a ✓
4. Fix the gap, re-measure, repeat until the table is all checks

The journal entries (especially [Phase 10.1](journal/10-static-chrome.md#phase-101)) document this loop with the actual gap tables — worth reading as a methodology reference.

### 3 · Three source-globals were load-bearing

Every block ported from the source's inline `<style>` assumed:
- `*{box-sizing:border-box}` (universal reset)
- `body{line-height:1.55}` (default rhythm)
- `img{max-width:100%;display:block}` (no inline baseline descender)

Without those, every cell measurement, every text line, every image container was off by a few px in some compounding way. **Promoting them once** to `styles.css` fixed cascading gaps across all blocks. This is the kind of insight that's only obvious in hindsight — and it cost us Phases 09 and 10.1 to discover.

### 4 · EDS auto-`<p>` wrapping is a recurring trap

EDS wraps every cell's text content in a `<p>` element during block decoration. The prototype's default `p { margin-top: 0.8em; margin-bottom: 0.25em }` then adds ~18px above and below every cell's text. We hit this in **four separate blocks** (audience-tabs, tabs, meta-strip, hero KPIs). The fix is always the same shape — `.block-name p { margin: 0 }` — but you only learn to grep for it after the second occurrence.

### 5 · The snowflake skill's static-fragment pattern travels

Chrome (header, footer, breadcrumb) all use variations of the same idea: a static or computed HTML fragment fetched (or built) by a minimal block decorator, with the block element itself styled to mirror source. Worked for all three; the pattern is documented in [ADR-0005](decisions/0005-static-chrome-via-snowflake.md) and adapted slightly for the breadcrumb (no fragment, just URL→label map + H1).

### 6 · Section metadata = visual rhythm

The biggest user-visible improvement in Phase 11 wasn't typography — it was section banding. Source alternates surface/white/secondary across the home; doctor + krankheitsbild get a thin meta-band; news gets an asymmetric article-hero band. Each of these is one `pushSection('style-name')` call in `migrate-to-eds.mjs` plus a 4-line CSS override. The trick was discovering that section padding (not margin) is what makes the band visual work — backgrounds need padding to fill.

---

## How fast was it actually?

Wall-clock window: First commit 2026-05-21 14:21 CET → last commit 2026-05-22 11:24 CET (~21 hours). But most of that was overnight or breaks. **Actual active work: ~6h 45min across 4 sessions**, reconstructed from git commit timestamps (any gap >60 minutes counted as a break).

| Session | Day · Time | Span | What happened |
|---|---|---|---|
| 1 | Thu 21 May · 14:21 → 17:15 | **2h 54min** | Bootstrap → 8 blocks → pilots → bulk-emit (290 pages) → first 1:1 audit → start of chrome |
| — | (3h 34min break — dinner) | | |
| 2 | Thu 21 May · 20:49 → 20:57 | **8min** | Quick check-in: chrome docs commit + strict-audit prep |
| — | (2h 10min break) | | |
| 3 | Thu 21 May · 23:07 → 00:27 | **1h 19min** | `getComputedStyle` strict audit (4 chrome bugs) + 3 source globals + start of per-block sweep |
| — | (8h 34min overnight) | | |
| 4 | Fri 22 May · 09:01 → 11:24 | **2h 23min** | Per-block sweep finish + section styling + breadcrumb + showcase docs |
| **Total** | | **~6h 45min** | |

Per-phase active time, estimated from commit clusters within sessions:

| Phase | Focus | Active |
|---|---|---|
| 01–02 | Audit + approach (pre-feature-branch research) | ~30min |
| 03 | EDS project bootstrap | ~15min |
| 04 | Block library (8 blocks built) | ~80min |
| 05–07 | Template pilots + polish + home pilot | ~65min |
| 08 | Bulk emission script + first run | ~35min |
| 09 | First 1:1 audit (5 structural gaps fixed) | ~30min |
| 10 | Static chrome via snowflake pattern | ~25min |
| 10.1 | Strict `getComputedStyle` audit (4 chrome bugs + 3 globals) | ~50min |
| 11 | Per-block sweep (all 8 blocks audited individually) | ~90min |
| 11 + 11.1 | Section styling overhaul + breadcrumb | ~35min |
| X | SHOWCASE.md + HTML showcase + this page | ~60min |

**The bulk emission step itself is ~3 minutes wall-clock** — `node migrate-bulk.mjs && node post-bulk.mjs` does 290 page POSTs + previews with concurrency 5. The bulk of "Phase 08" was building the migration script, not running it.

**The fast part is the loop, not the keystrokes.** Of the ~7 hours active, roughly 60% was iterative measurement → fix → re-measure cycles (the gap-table methodology from Phase 10.1 onward). The remaining 40% was bootstrapping, block-building, and documentation. The migration script + bulk runners combined are ~750 lines, written in roughly 90 minutes.

---

## Tools and skills used

EDS-native by intent — no build step, no bundler, no CSS framework, no overlay engine, no React/Vue. Just the EDS ecosystem + a handful of Node scripts + a headless browser for measurement.

### Adobe / EDS ecosystem

- **Document Authoring (DA)** — content storage at `da.live/#/catalan-adobe/hirslanden-eds-prototype`. All 290 pages live here as authored HTML.
- **aem.live (EDS)** — delivery platform. Branch previews at `<branch>--<repo>--<owner>.aem.page` get rebuilt automatically on push via aem-code-sync.
- **admin.da.live** — content source PUT API. `post-bulk.mjs` uploads 290 pages with concurrency 5 (~3 minutes wall-clock).
- **admin.hlx.page** — preview/publish trigger. One POST per slug, also concurrency-bounded.
- **aem-code-sync** — GitHub App that keeps the EDS code bus in sync with the prototype repo on push.
- **aem-boilerplate** — base template the prototype repo extends. We kept most of `scripts/`, replaced `blocks/header/` and `blocks/footer/`, extended `blocks/cards/`.
- **aem-block-collection** — reusable vetted blocks. Extended `cards` with an `events` variant; the rest of the 8 custom blocks are bespoke.

### Skills consulted from `.agents/skills/`

The agent's skills catalogue has 21 EDS-related skills. The ones actively used or referenced during this work:

| Skill | Role |
|---|---|
| **`snowflake`** | Static-fragment chrome pattern (used the header/footer/breadcrumb sub-pattern, not the full overlay flow). See [ADR-0005](decisions/0005-static-chrome-via-snowflake.md). |
| **`page-import`** | Considered as Approach B in [ADR-0002](decisions/0002-eds-migration-approach.md) — rejected because the 290× per-page workflow would have been an order of magnitude slower. |
| **`eds-da-content`** | DA admin API contract, block HTML format (canonical `<div class="…">`), section metadata syntax. Referenced throughout Phase 04 and Phase 08. |
| **`create-site`** | Phase 03 EDS project bootstrap (created `catalan-adobe/hirslanden-eds-prototype`, linked the GitHub App, set up DA). |
| **`da-auth`** | IMS token cache management (`~/.aem/da-token.json`) for the bulk POST runner. |
| **`building-blocks`** | EDS block decoration patterns — referenced while authoring 8 custom blocks. |
| **`identify-page-structure`** + **`page-decomposition`** | Phase 01 source audit (the MD5 cross-file check that proved template uniformity). |
| **`block-inventory`** + **`block-collection-and-party`** | Phase 04 block library research — surveyed what already exists in Block Collection before authoring custom blocks. |

### Code we wrote

| File | Lines | What |
|---|---|---|
| `migrate-to-eds.mjs` | 571 | Per-page converter. Reads `site/*.html` via `node-html-parser`, dispatches by template, emits EDS-import HTML. |
| `migrate-bulk.mjs` | 95 | Iterates `site/*.html`, calls the converter per file, normalizes slugs (admin.hlx.page rejects `--` and trailing `-`). |
| `post-bulk.mjs` | 98 | DA POST + preview trigger, concurrency-bounded worker pool. |
| `blocks/{8 blocks}/*.{js,css}` | ~1,800 total | 8 custom block decorators + CSS (hero, audience-tabs, finder, head-row, cards events variant, list-rows, aside-card, meta-strip, tabs). |
| `fragments/{header,header-home,footer}.html` | ~80 lines | Static chrome fragments per the snowflake pattern. |
| `audit/side-by-side/compose.sh` | ~50 lines | ImageMagick reproducer for the comparison images. |

**Total bespoke code:** ~2,700 lines across both repos. The EDS prototype's `styles.css` overrides + section metadata add another ~150 lines.

### Browser + measurement

- **Playwright MCP** — headless browser controlled from the agent. Used for `getComputedStyle()` + `offsetHeight` measurements (the methodology that beat screenshots) and for the side-by-side full-page captures at 1440px.
- **`getComputedStyle()` / `offsetHeight`** — the actual measurement primitives. The gap-table loop is just: query the same selectors on both pages, log the differences, build a table, fix, re-measure.

### Asset / build tooling

- **ImageMagick (`magick`)** — composing side-by-side comparisons, optimizing JPGs for the showcase folder (1400px wide, 85% quality → ~100–330 KB per template).
- **Python 3** — ad-hoc data analysis (the active-time reconstruction was a 30-line Python script that clustered commits by gap-threshold).
- **bash / curl / jq** — quick one-liners for DA API testing and HTTP spot-checks.

### Workflow tooling

- **Git** — both repos use feature branches per [ADR-0004](decisions/0004-branch-workflow.md). Explicit-push policy means the agent only pushes when asked.
- **Architecture Decision Records** — 5 ADRs in `docs/decisions/`, written when non-obvious choices were locked in.
- **Phase journals** — 11 narratives in `docs/journal/`, written *during* each phase (not after). The journal-during-the-phase pattern is the real audit trail.
- **No issue tracker, no Jira, no PR review** — single-developer + agent workflow over a short session. The branch + ADR + journal triad replaced those for now.

## Things we deliberately didn't do

These are written down so reviewers don't need to play "did they miss this?":

- **Mobile (375px) validation.** Every audit was at 1440px. Documented as an open thread in the journal. The block CSS has mobile media queries ported from source, but they weren't measured rigorously.
- **Live functional behavior.** Doctor form submit is `preventDefault`-only, finder search is visual, audience-tab panel content doesn't swap. Prototype-grade interactivity (per ADR-0002).
- **Authorability of chrome.** Header / footer / breadcrumb ship as code-side artifacts. To make them authorable, we'd extend toward snowflake's full `[data-slot]` pattern. Out of scope per ADR-0005's deliberate authorability/fidelity trade-off.
- **Parent listing pages.** We migrated 290 specific content pages, not the parent listing pages they link to (e.g., the breadcrumb section link to `/de/corporate/aerzte` 404s). To close: migrate the listing pages or add `.htaccess`-style redirects. Out of scope here.

---

## Artifacts to walk the team through

In order of "skim → deep":

1. **`audit/side-by-side/sbs-*.png`** — 6 full-page screenshots, original vs migrated, one per template. Open these full-screen and scroll both columns together.
2. **`docs/SHOWCASE.md`** (this doc) — the narrative
3. **`docs/README.md`** — the documentation map (journals + ADRs + discoveries)
4. **`docs/journal/11-block-fidelity.md`** — the deepest single phase, showing the `getComputedStyle` audit pattern with actual gap tables
5. **`docs/decisions/0005-static-chrome-via-snowflake.md`** — the chrome ADR; shows how we reasoned about the authorability/fidelity tradeoff
6. **`git log eds-migration`** (in both repos) — every change in the order it was made, with descriptive messages

Branch preview URL is the live artifact. The DA browser shows the content side of the project (https://da.live/#/catalan-adobe/hirslanden-eds-prototype).

---

## The collaboration model

What made this fast wasn't AI or human alone — it was a tight feedback loop:

- **Human** held the strict 1:1 bar (no "near-fidelity" framing accepted), picked the major architectural moves (Approach A; static chrome over overlay; JS-derived breadcrumb), set the branch-workflow rule, and reviewed each phase before approving the next.
- **AI** ran the per-element measurements, wrote the migration script + bulk runners, ported and scoped CSS, did the iterative gap-table loops, and kept the documentation in sync with the work.

Every phase has a journal entry written **during** the phase, not after — which means we have a real audit trail of how each decision was made and which trade-offs we accepted. That's the part worth showing the team beyond the visuals.

---

*Last updated: 2026-05-22 — at end of session, with all 290 pages live on the eds-migration branch preview.*

# Project Documentation

Living record of the work happening in this repo: what we do, what we discover, and what we decide. Separate from the `_provenance`-tagged spec docs at the repo root (`README.md`, `PRODUCT.md`, `DESIGN.md`, `DESIGN.json`), which describe target state, not session activity.

> **First time here?** Start with [SHOWCASE.md](SHOWCASE.md) — the high-to-low story of how 290 pages went from static HTML to EDS in ~7 hours of active work, with high visual fidelity at 1440px and a handful of documented gaps. It links into the journal, ADRs, and side-by-side image artifacts.

## Current state (as of Phase 11)

**Goal (aspirational):** Migrate the 290 Variant C static-prototype pages in `site/` to AEM Edge Delivery Services with strict 1:1 visual fidelity. The stricter the bar, the more useful as a methodology rehearsal.

**Status:** All 290 pages live in DA at semantic paths; 8 custom EDS blocks authored; 1 migration script (`migrate-to-eds.mjs`) and 2 bulk runners (`migrate-bulk.mjs`, `post-bulk.mjs`) produce + upload the EDS-import HTML. Header/footer chrome ships as static fragments (see [ADR 0005](decisions/0005-static-chrome-via-snowflake.md)). Phase 11 swept every block with `getComputedStyle` audits and aligned heading defaults, button line-heights, section wrapper widths, EDS auto-`<p>` margin handling, and per-block layout gaps with the source.

**Actual outcome:** Close — chrome and most blocks measure within ±1px of the source at 1440px. **Not strictly 1:1** — tab heights remain ~8px taller (minor line-height interactions), mobile (375px) was never measured, breadcrumb section-links target parent listing pages we didn't migrate (so they 404), interactive behavior is visual-only per ADR-0002. See "Residual known gaps" below.

**Two repos coordinate the work:**
- **`migrate-hirslanden`** (this repo) — source `site/` HTML + migration scripts + bulk output + all documentation
- **`hirslanden-eds-prototype`** (sibling, at `~/repos/ai/paolomoz/hirslanden-eds-prototype/`) — the actual EDS project: 8 custom blocks, styles, theme tokens. Deployed via `aem-code-sync` to `https://main--hirslanden-eds-prototype--catalan-adobe.aem.page/` (main) and `https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/` (active branch).

Both repos work on `eds-migration` feature branches per [ADR 0004](decisions/0004-branch-workflow.md). The EDS repo's branch is pushed; this repo's branch is local-only.

**Live entry points for review:**
- Branch preview index: https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/
- DA content browser: https://da.live/#/catalan-adobe/hirslanden-eds-prototype/de/corporate
- GitHub repo: https://github.com/catalan-adobe/hirslanden-eds-prototype

## Residual known gaps (updated post-Phase 11)

Closed in Phase 11.1 (breadcrumb):
- ~~Breadcrumb~~ — derived at render time in `blocks/header/header.js` from `window.location.pathname` + page H1; appended as `<nav class="crumb">` sibling of `.header-wrapper` inside `<header>`. 5-entry path-to-label map covers all template sections.

Closed in Phase 11 (block-level audits):
- ~~Subtle typography metrics~~ — h1-h4 sizes/line-heights/letter-spacing aligned with source defaults (41/26/20/16px vs prototype 45/36/28/22)
- ~~Button heights~~ — line-height 1.25 → 1.55 made every button 4px taller, matching source
- ~~Section wrapper width~~ — 1200 → 1280 max-width, every block now 96px wider matching source `.wrap`
- ~~Hero button stacking~~ — hero.js groups consecutive `.button-wrapper` into a flex `.hero-cta` div
- ~~Audience-tabs / tabs height inflation~~ — `<tab> p { margin: 0 }` strips EDS auto-`<p>` margins
- ~~Cards events grid date/gap dimensions~~ — date col 56px, ul gap 20px, body margin reset
- ~~Meta-strip doubled padding~~ — block padding stripped, row owns spacing
- ~~Finder "Tipp" hint~~ — re-emitted from finder.js, actions row uses `space-between`
- ~~Section bands (hero/audience/finder/schwerpunkte/news/events)~~ — `padding: 48px 0` global so bg-surface/bg-secondary fill the full vertical band; per-section style metadata via migrate-to-eds.mjs
- ~~Doctor + krankheitsbild meta-strip band~~ — its own bg-surface section with thin 14px 0 padding (meta-band style)
- ~~News article-hero band~~ — its own bg-surface section with 32 0 24 padding (article-hero-band style)

Closed in Phase 10:
- ~~Header / footer chrome~~ → now static fragments, pixel-aligned with source at 1440px (see [ADR 0005](decisions/0005-static-chrome-via-snowflake.md))

Still acceptable / documented:
- **Tab heights**: ~8px taller than source (minor line-height interactions)
- **Mobile (375px) validation** — never done; all phases validated at 1200/1440 only

Out of scope (design decisions, not gaps):
- **Authorability of chrome content** — header/footer ship as static fragments, breadcrumb is JS-derived from URL + H1 (not DA-authored). Per [ADR 0005](decisions/0005-static-chrome-via-snowflake.md), the prototype trades authorability for fidelity.
- **Section breadcrumb links** target `/de/corporate/{section}` which 404 — we only migrated 290 content pages, not the parent listing pages
- **Interactive behavior** — doctor form submit, finder search, audience-tab panel switching

## Layout

| Folder | Purpose | Naming |
|---|---|---|
| [`journal/`](journal/) | Chronological narrative of each work phase | `NN-slug.md` (one file per phase/milestone) |
| [`decisions/`](decisions/) | Light ADRs for choices we make | `NNNN-slug.md` (zero-padded, never renumbered) |
| [`discoveries/`](discoveries/) | Findings about the existing artifact or external systems | `slug.md` (keyed by topic) |

## Index

### Journal
- [01 — HTML structure audit](journal/01-html-structure-audit.md)
- [02 — EDS content migration evaluation](journal/02-eds-content-migration-evaluation.md)
- [03 — EDS project bootstrap](journal/03-eds-project-bootstrap.md)
- [04 — Block library](journal/04-block-library.md)
- [05 — Template pilots](journal/05-template-pilots.md) *(home deferred)*
- [06 — Fidelity pass](journal/06-fidelity-pass.md)
- [07 — Polish pass + home pilot](journal/07-polish-pass.md)
- [08 — Bulk emission (290 pages)](journal/08-bulk-emission.md)
- [09 — 1:1 fidelity audit](journal/09-fidelity-audit.md)
- [10 — Static header/footer fragments](journal/10-static-chrome.md)
- [11 — Per-block 1:1 fidelity sweep](journal/11-block-fidelity.md)

### Decisions
- [0001 — Documentation system](decisions/0001-documentation-system.md)
- [0002 — EDS content migration approach](decisions/0002-eds-migration-approach.md)
- [0003 — Phase numbering refinement](decisions/0003-phase-numbering-refinement.md)
- [0004 — Branch workflow and explicit-push policy](decisions/0004-branch-workflow.md)
- [0005 — Static header/footer chrome via snowflake fragment pattern](decisions/0005-static-chrome-via-snowflake.md)

### Discoveries
- [Site template structure (291 pages)](discoveries/site-template-structure.md)
- [EDS block mapping for the 6 site templates](discoveries/eds-block-mapping.md)
- [EDS boilerplate + Block Collection inventory](discoveries/eds-boilerplate-inventory.md)

## How to add an entry

The shape and rules for each type are spelled out in [decisions/0001-documentation-system.md](decisions/0001-documentation-system.md). In short:

- **Journal entry** — new phase or session: copy the previous file, bump the number, fill in `Summary`, `What happened`, link to discoveries/decisions made.
- **Decision** — when a non-obvious choice is locked in: new ADR with `Context · Options · Decision · Consequences`. Don't edit accepted ADRs — supersede them.
- **Discovery** — when we learn something non-obvious about the existing system: new file under `discoveries/` with `Source · Finding · Evidence · Implications`.

Cross-link liberally with relative paths. Commit each new entry on its own with a `docs: …` prefix so `git log` becomes a second-layer journal.

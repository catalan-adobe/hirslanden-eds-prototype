# 0005 — Static header/footer chrome via snowflake fragment pattern

**Status:** Accepted
**Date:** 2026-05-21
**Supersedes:** —
**Amends:** [0002 — EDS content migration approach](0002-eds-migration-approach.md) (narrows the "out of scope" list)

## Context

ADR-0002 scoped header / footer / breadcrumb as "out of scope" for the migration prototype, reasoning that EDS theme work was a separate workstream. Phase 09's strict 1:1 fidelity audit still left the chrome rendering as boilerplate (DA-authored nav.html / footer.html, default styling), which is a visible, unrelated chrome around the migrated content.

After Phase 09 the user pointed at the snowflake skill (`~/.claude/skills/snowflake`), which describes a clean static-fragment pattern for header + footer: ship the source's chrome markup as a code-bus fragment, fetched and injected by simple block decorators, with per-block CSS scoped to the chrome. Authorability is traded for fidelity — acceptable since the chrome content is not part of what authors need to edit.

We needed to decide how much of snowflake to adopt and how to wire it into the existing EDS prototype.

## Options considered

### A · Adopt snowflake's full overlay substrate

Run `install-substrate.mjs`. Installs the overlay engine in `scripts/scripts.js`, lifecycle CSS, fonts.css, per-template-keyed paths (`/fragments/<template>/header.html`, `/styles/<template>.css`), and `main.dataset.overlay` indirection.

- ✅ Full snowflake feature set; future iterations could shift to overlay-style page DOM if needed.
- ❌ Overlay engine assumes the page body is a preserved source-DOM, not an authored EDS block tree. Our 290 pages are authored EDS blocks — running the overlay engine on them would either no-op or actively interfere with `decorateBlocks`.
- ❌ Substantially more code than the chrome work justifies.
- ❌ Per-template-keyed `/fragments/<template>/header.html` is wasted indirection — we have one site-wide chrome, not per-template variants.

### B · Adopt only the static-fragment sub-pattern *(chosen)*

Copy snowflake's `substrate/blocks/{header,footer}/header.{js,css}` pattern in spirit (fetch + inject, scoped CSS) but drop the overlay-engine prerequisites:
- Fixed paths: `/fragments/header.html`, `/fragments/header-home.html`, `/fragments/footer.html`
- No `main.dataset.overlay` switching — single chrome, branched in `header.js` purely by `window.location.pathname === '/'`
- Per-block CSS lives at `blocks/{header,footer}/{name}.css` (existing convention), not `/styles/<template>.css`

- ✅ Smallest delta; works with our existing authored-content model with no scripts.js rewrite.
- ✅ Visual outcome is identical to A — the user-facing artifact is the rendered chrome, not the indirection layer.
- ❌ If a future page wants a different chrome (e.g. landing-page-style minimal header), we'd need to introduce template-keyed paths at that point. Acceptable — YAGNI for now.

### C · Stay with the boilerplate's DA-authored nav

Author a nav.html document in DA per the boilerplate convention, populate it with the source's nav structure, restyle the boilerplate's `blocks/header/header.css` to match the source.

- ✅ Authorability of nav content out of the box.
- ❌ Hours of restyling 273 lines of boilerplate CSS to match the source's `.utility` / `.nav` / `#ds-nav-list` markup.
- ❌ Footer authoring story is even worse (5-column grid with dark theme not in the boilerplate's footer block).
- ❌ Doesn't move the project forward — fidelity gap remains until the restyling is complete, which is exactly the work snowflake's pattern lets us skip.

## Decision

**Adopt Option B.** Header and footer ship as static HTML fragments under `hirslanden-eds-prototype/fragments/`, fetched and injected by minimal block decorators, with per-block CSS scoped to `.header.block` / `.footer.block`.

The "out of scope" list in ADR-0002 is narrowed: **header and footer are now in scope**; **breadcrumb remains out** (per-page content, 289/290 unique values — would need authoring or path-derived computation, both larger than this phase's scope).

## Consequences

- The boilerplate's 171-line `blocks/header/header.js` and 273-line `blocks/header/header.css` are replaced by ~32 lines each. Same for footer. Net code delta is heavily negative.
- The boilerplate's `header { height: var(--nav-height) }` rule in `styles/styles.css` is removed (it assumed a 64px single-row nav; our chrome is 32 + 66 ≈ 98px).
- `blocks/fragment/fragment.js` stays. Originally suspected as dead code after the header/footer imports were removed, but `scripts/scripts.js` also dynamic-imports it from `buildAutoBlocks()` to inline any `<a href="/fragments/...">` link in authored content. Our new static fragment paths share that `/fragments/` prefix — currently no authored content emits such links, but if a future block does, the boilerplate would try to inline the chrome fragment. Watch this if Phase 11+ introduces author-style fragment references.
- `aria-current="page"` on the active nav item is lost (one static fragment can't carry per-page state). The source CSS doesn't style `[aria-current]`, so zero visual impact.
- Future authorability of chrome content (e.g. nav labels, footer link lists) would require migrating to snowflake's full `[data-slot]` pattern. Path is documented; not pursued now.
- Breadcrumb is the next reasonable chrome candidate. Two viable approaches: extract per-page during bulk migration and emit as a `breadcrumb` block, or compute from `window.location.pathname` against a path-to-label map. Filed as next-iteration work, not chosen here.

# Phase 04 — Block library

**Dates:** 2026-05-21
**Status:** complete — all 7 custom blocks authored, validated against test content in DA, lint clean
**Goal:** Author the custom EDS blocks identified in [discoveries/eds-block-mapping](../discoveries/eds-block-mapping.md) so the template-recipe migration (Phase 05/06) has the necessary palette.

## Summary

Cloned the EDS project locally and authored all 7 custom blocks identified in the Phase 02 mapping. Each block was validated by posting test content to DA, previewing it, and visually comparing the rendered output against the Variant C reference. The block library now covers the entire content surface of the 290 pages (Phase 05/06 will exercise it on real content).

| Block | Reuse | Status |
|---|---|---|
| `hero` | 5 templates (290 pages) | ✅ Split layout with eyebrow / h1 / lede / buttons + scrimmed image |
| `list-rows` | 4 templates (~234 pages) | ✅ Indicator / title / tag / arrow rows with hover-cyan |
| `aside-card` | 3 templates (~225 pages) | ✅ TOC + Facts variants (Form variant defers to Block Collection composition) |
| `meta-strip` | 2 templates (225 pages) | ✅ Icon items with right-aligned CTA |
| `tabs` | 1 template, 60 pages | ✅ Sub-navigation with active highlight (chose custom over Block Collection — non-panel-switching) |
| `audience-tabs` | 1 page (home) | ✅ Prototype — single-panel; future enhancement: per-audience panels |
| `finder` | 1 page (home) | ✅ Prototype — visual only; future enhancement: backend wiring |

The block inventory survey ([discoveries/eds-boilerplate-inventory](../discoveries/eds-boilerplate-inventory.md)) confirmed that `cards` ships in the boilerplate (reused as-is) and that `tabs` is in the Block Collection (we chose to author our own anyway because the BC version switches panels and we needed a sub-nav).

## What happened

1. **Cloned the EDS repo as a sibling.** `gh repo clone catalan-adobe/hirslanden-eds-prototype` into `~/repos/ai/paolomoz/hirslanden-eds-prototype/`. Created `eds-migration` feature branch on that repo too (mirroring [ADR 0004](../decisions/0004-branch-workflow.md) on this repo). `npm install` succeeded (6 audit warnings in dev-only lint deps — not blocking). `aem` CLI already on `$PATH` (v16.19.1).

2. **Started local dev** via `aem up --no-open --forward-browser-logs` in the background. `curl http://localhost:3000/` returned 200 with the boilerplate homepage.

3. **Surveyed bundled blocks.** Boilerplate ships with `cards`, `columns`, `footer`, `fragment`, `header`, `hero`. Out-of-scope for migration: `header`, `footer`. Reusable: `cards` (for the home page `schwerpunkte` + `events` grids), `columns` (could substitute for our `two-column` section style), `fragment` (potential for shared content like reusable CTAs).

4. **Probed AEM Block Collection** via the live URL at `main--aem-block-collection--adobe.aem.live`. Confirmed canonical blocks exist for `tabs`, `accordion`, `quote`, `cards`, `carousel`, `search`. The `tabs` block in particular looks adoptable for our `fachgebiet` sub-navigation; the `search` block is worth evaluating as a substrate for `finder`.

5. **Updated Variant C design tokens** in `styles/styles.css`. Added the full `--color-*`, `--radius-*`, `--section-pad-*` set from `site/*.html`'s `:root` (Phase 01 audit confirmed they're identical across 289 files) and aliased the boilerplate's `--background-color`, `--text-color`, `--link-color`, `--body-font-family`, `--heading-font-family` to point at the Variant C tokens. This keeps boilerplate blocks looking visually consistent with the migration target.

6. **Authored the hero block** at `blocks/hero/hero.{js,css}`. Content model: 1 row, 2 cells (text | image). JS decorates the text cell by classifying:
   - First `<p>` immediately before the `<h1>` → `.eyebrow`
   - First `<p>` immediately after the `<h1>` → `.lede` (skipped if it's already a button-container)

   Buttons use boilerplate auto-blocking conventions: `<p><strong><a></strong></p>` → `.button.primary`, `<p><em><a></em></p>` → `.button.secondary`. CSS implements the split grid, scrimmed image, pill buttons, and a mobile-stack breakpoint at 900px.

7. **Created test content.** Wrote `/tmp/da-test-hero.mjs` that POSTs a `test-hero.html` page to DA with a doctor-profile shaped hero (eyebrow "Ärztin / Arzt", h1 "Docteur Christian Jaccard", lede, primary + secondary button, full-width image), then triggers preview. Both calls returned 201/200.

8. **Visually validated** via Playwright MCP at 1440 and 375. Desktop renders the full split layout with eyebrow + uppercase h1 + lede + two pill buttons + scrimmed image. Mobile stacks the text above the image, buttons remain readable, no overflow. Screenshots at `hero-pilot-desktop-v1.png` and `hero-pilot-mobile-v1.png` in the migrate-hirslanden repo root (not committed — local validation artifacts).

9. **Lint passes** — `npm run lint` ran both `eslint .` and `stylelint "blocks/**/*.css" "styles/*.css"` with zero warnings.

10. **Committed** to the EDS repo's `eds-migration` branch: commit `0cca77c — feat(hero): Variant C split-layout hero block`.

11. **Self-review refactor.** A Stop-hook self-review caught a scoping bug: the cyan primary / cyan-bordered secondary button overrides were scoped to `.hero-text`, leaving the boilerplate's global `.button.primary` rule rendering taupe-on-taupe (because we aliased `--text-color` to `--color-text`). Hoisted the Variant C button vocabulary (pill radius, uppercase 13px / 0.6px letter-spacing, primary on `--color-primary`, secondary white with cyan border + primary-soft hover) to `styles.css`. Dropped the now-redundant overrides from `hero.css`. Lint clean; visually identical to commit `0cca77c`. Commit `16af1ad — refactor(buttons): hoist Variant C button styles to global`.

12. **Pushed `eds-migration` branch** on `hirslanden-eds-prototype` (only) so the branch-preview URL serves both the test content and the customized hero code. Push was per explicit user request during review (the "no push without ask" rule of [ADR 0004](../decisions/0004-branch-workflow.md) was satisfied). The `migrate-hirslanden` `eds-migration` branch remains local-only. Branch preview URL for review: `https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/test-hero`.

13. **Authored `list-rows`.** Block content model: indicator | title (often link) | tag, with a trailing `→` that turns cyan on `:has(a):hover`. Tested with three indicator variants (date, letter, star) at desktop + mobile via `/test-list-rows`. Commit `56ef2b9`.

14. **Authored `aside-card`** with TOC + Facts variants (Form variant deferred to Block Collection `form` composition). DA two-cell rows in the Facts variant convert into `<dl>` / `<dt>` / `<dd>` via JS; single-cell rows become title (first) or footer (last). Tested via `/test-aside-card`. Commit `d87ed56`.

15. **Authored `meta-strip`.** Each row is one icon-prefixed item; the last row containing only a link becomes the right-aligned CTA with a trailing arrow. Initial bug: my "only a link" check failed because DA wraps inline content in `<p>` — fixed by switching to a `textContent`-equality check rather than DOM-shape matching. Tested via `/test-meta-strip`. Commit `87364e0`.

16. **Authored `tabs`** as a custom sub-navigation block. Block Collection has a tabs block but it switches panels; our fachgebiet use case is non-switching (tabs route to other pages). Each DA row becomes a tab with optional sub-label; authors mark the active tab by wrapping its label in `<strong>`. Tested via `/test-tabs`. Commit `0f79f93`.

17. **Authored `audience-tabs` and `finder`** as prototype-level home-page blocks. Both work visually but are explicitly limited:
    - `audience-tabs` selects tabs visually but doesn't swap panel content — only the active panel is rendered.
    - `finder` renders the search card with tabs + 2x2 field grid + Suchen submit, but the form has no backend wiring (preventDefault on submit).
    Tested side-by-side via `/test-home-blocks`. A late `.finder-lead` styling bug (transparent default color) was caught and fixed in the same pass. Commit `d896377`.

## Discoveries

- [EDS boilerplate + Block Collection inventory](../discoveries/eds-boilerplate-inventory.md)

## Decisions

*(none new — followed established ADRs)*

## Open threads / next steps

- **Phase 05 — Template pilots.** With the block library in place, run `page-import` on one representative page per template (6 pilots) to validate that the recipes from [eds-block-mapping](../discoveries/eds-block-mapping.md) hold up against real captured content. Adjust blocks as needed before Phase 06.
- **Push remaining commits.** Only the original push (5 commits at the time of hero review) is on the `eds-migration` branch remote. The new commits `56ef2b9` through `d896377` (list-rows, aside-card, meta-strip, tabs, audience-tabs+finder) are local-only. Push when needed for review or before starting Phase 05's bulk validation.
- **KPI strip.** Variant C heroes contain a 4-up KPI strip inside the text column. The current `hero` block does not render KPI structure — Phase 04's hero was validated without KPIs. Decision point at Phase 05: separate `kpi-strip` block placed inside or below the hero, or extra rows inside `hero`. The former adds an 8th custom block; the latter complicates the hero content model.
- **Mobile validation gap.** Hero and list-rows were validated at both 1440 and 375. aside-card, meta-strip, tabs, audience-tabs, and finder were only validated at 1440 because the mobile breakpoints are straightforward CSS Grid stacks. Phase 05 should re-validate all blocks at 375 against real content (not just synthetic test pages).
- **Block Collection `cards` for home schwerpunkte + events.** Confirmed available; not yet exercised. Phase 05 will discover whether the boilerplate's `cards` covers our `events` variant (date-prefixed cards) or whether a `cards` variant is needed.
- **`audience-tabs` per-audience panels.** Prototype renders only the active audience's panel; clicking other tabs does nothing functional. A future enhancement would author 4 separate panels and swap them on tab click. Authors would compose multiple panel blocks, JS routes between them.
- **`finder` backend wiring.** Form submission is `preventDefault`-ed. Real search routing (to clinic-finder / doctor-finder / specialty pages) is a separate phase.

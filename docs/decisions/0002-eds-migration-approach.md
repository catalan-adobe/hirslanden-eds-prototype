# 0002 — EDS content migration approach (template-recipe driven)

**Status:** Accepted
**Date:** 2026-05-21
**Supersedes:** —

## Context

Phase 01 confirmed that all 290 content pages in `site/` are output of a single static-site generator with 6 distinct body templates and a homogeneous chrome (header/footer/nav). The user scoped the next migration step as "main content of each page (no header/footer for now) into Edge Delivery Services".

We have 21 EDS skills in `.agents/skills/`, with `page-import` as the canonical orchestrator. The repo has no EDS project yet — the target will be bootstrapped fresh. The detailed section-by-section mapping that informs this decision lives in [discoveries/eds-block-mapping](../discoveries/eds-block-mapping.md).

We had to choose how to actually execute the migration once the analysis was done.

## Options considered

### A · Template-recipe driven *(chosen)*

Build the 7-custom-block library (plus Block Collection `cards`) first, run `page-import` once per template (6 pilots) to validate the block decompositions, then adapt the existing `migrate.mjs` pattern to bulk-emit EDS-import HTML for the remaining 284 pages.

- ✅ Leverages the Phase 01 finding that the 290 pages are template-uniform — exactly the property a recipe-driven approach exploits.
- ✅ Bulk emission is cheap because `migrate.mjs` already iterates the captured content through template renderers; we change only the output target.
- ✅ Block usage is enforced consistent across all pages of a given template.
- ❌ Requires up-front custom-block authoring (8 blocks) before any page can be migrated.
- ❌ Per-template assumptions could mask edge cases in individual pages; pilots in Phase 04 act as the validation gate.

### B · Page-by-page via `page-import`

Invoke the `page-import` skill chain on every URL (290 times).

- ✅ Canonical EDS workflow; matches what the skills were designed for.
- ✅ Catches per-page quirks because each page is analyzed independently.
- ❌ 290 manual invocations is expensive in tokens, time, and review burden.
- ❌ Risk of inconsistent block selection across pages that *should* be using the same blocks — re-derives template uniformity we already proved.
- ❌ Discards the bulk-emission leverage we get from `migrate.mjs`'s existing iteration.

### C · Default-content first

Skip most custom blocks, emit default content (H1/H2/P/IMG/UL + buttons via auto-blocking) for the entire content surface, refine in DA later if needed.

- ✅ Fastest path to authorable content.
- ✅ Lowest custom-block authoring effort.
- ❌ Loses the distinctive Variant-C visual system (no KPI strips, no split heroes, no list-rows density, no aside-cards).
- ❌ Pushes work onto authors — every page would need post-migration enrichment in DA to recover the design.
- ❌ Wastes the design system that Phase 01 verified is already pinned in the source.

## Decision

**Approach A — template-recipe driven.**

Phase structure:

- **Phase 03 — Block library.** Bootstrap a fresh EDS project via the `create-site` skill. Author the 8 custom blocks (`hero`, `list-rows`, `aside-card`, `meta-strip`, `tabs`, `audience-tabs`, `finder`, plus a `cards` variant if Block Collection's stock `cards` doesn't fit) via `content-driven-development` + `building-blocks`. Verify with `block-inventory` that no Block Collection block already covers `tabs` or `finder` before authoring duplicates.
- **Phase 04 — Template pilots.** Run `page-import` on one representative page per template — 6 pilots. These validate that the block library actually serves each template before scale.
- **Phase 05 — Bulk emission.** Adapt the existing `migrate.mjs` pattern to emit EDS-import HTML for the remaining 284 pages. Upload all 290 to Document Authoring.

## Consequences

**Easier:**
- Block usage is consistent and predictable across the migrated site.
- Bulk emission is a contained scripting task once the pilots validate the recipe.
- Each phase has a single clear output — easy to scope, review, and gate.

**Harder:**
- Phase 03 (8 custom blocks) is the long pole. Nothing migrates until the library exists.
- If a pilot in Phase 04 surfaces a block that doesn't fit one template's content, we either add a variant (cheap) or split the block (medium effort, ripples to Phase 03 work).
- The `migrate.mjs` adaptation in Phase 05 needs to understand DA's import-HTML format — a new format to learn, but well-documented in the `generate-import-html` skill.

## Notes on scope

This decision explicitly excludes:
- Header, footer, and navigation (separate phase, separate skills: `migrate-header` and the EDS theme's `nav.html` / `footer.html`)
- The breadcrumb (`<nav class="crumb">`) — auto-derived from the EDS nav in DA
- Multi-language variants (FR / EN / IT) — current scope is DE only

Re-scoping any of these would justify a new ADR; superseding this one would require evidence that Approach A no longer fits.

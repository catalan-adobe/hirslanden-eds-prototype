# Phase 02 — EDS content migration evaluation

**Dates:** 2026-05-21
**Status:** complete
**Goal:** Determine how to migrate the main content (no header/footer) of the 290 content pages in `site/` into AEM Edge Delivery Services.

## Summary

Surveyed the 21 EDS skills in `.agents/skills/`, confirmed `page-import` is the canonical orchestrator, and verified no EDS project scaffolding exists in this repo yet. Scoped the evaluation to `site/` HTML as source, a fresh EDS target, and a template-level depth. Mapped the 6 body templates (discovered in Phase 01) to EDS sections + blocks; identified a 7-block custom library plus the Block Collection `cards` block — together they cover the entire content surface alongside default content. Compared three migration strategies and selected the template-recipe-driven approach.

## What happened

1. **Surveyed the EDS skill inventory.** Read SKILL.md headers for 8 of the most directly migration-relevant skills: `page-import` (orchestrator), `scrape-webpage`, `identify-page-structure`, `page-decomposition`, `authoring-analysis`, `block-inventory`, `content-modeling`, `generate-import-html`. Noted that `page-import` explicitly excludes header/footer (matches the user's scope) and follows David's Model — minimize blocks, prefer default content.

2. **Checked the repo for an EDS target.** No `blocks/`, no `scripts/`, no `fstab.yaml`, no `head.html`. `package.json` carries only Playwright. The migration target will be a new EDS project; the `create-site` skill handles that bootstrap when Phase 03 starts.

3. **Scoped the evaluation** via three clarifying choices:
   - Source: `site/` HTML (we already validated structural uniformity)
   - Target: fresh EDS project (none exists)
   - Depth: template-level analysis (not per-page; not a prototype)

4. **Mapped each of the 6 body templates** to a section-by-section EDS decomposition. Result: every `data-section` falls into one of three buckets — default content, an existing Block Collection block (`cards`), or one of 7 new custom blocks. Cross-template reuse: 4 of the 7 custom blocks (`hero`, `meta-strip`, `list-rows`, `aside-card`) serve 2 or more templates; `tabs` is fachgebiet-only; `audience-tabs` and `finder` are home-exclusive.

5. **Compared three migration strategies:**
   - A · Template-recipe driven (build blocks → 6 pilots → bulk emission)
   - B · Page-by-page via `page-import` (run skill 290 times)
   - C · Default-content first (skip most custom blocks, refine later in DA)

6. **User selected Approach A.** Captured as decision [0002](../decisions/0002-eds-migration-approach.md). The detail of the template-to-block mapping is captured as discovery [eds-block-mapping](../discoveries/eds-block-mapping.md).

## Discoveries

- [EDS block mapping for the 6 site templates](../discoveries/eds-block-mapping.md)

## Decisions

- [0002 — EDS content migration approach (template-recipe driven)](../decisions/0002-eds-migration-approach.md)

## Open threads / next steps

- **Phase 03 — Block library.** Bootstrap a fresh EDS project via `create-site`, then author the 7 custom blocks via `content-driven-development` + `building-blocks`. Order suggested by reuse count: `hero` → `list-rows` → `aside-card` → `meta-strip` → `tabs` → `audience-tabs` → `finder`. Block Collection `cards` (and any required `events` variant) folds in alongside this work.
- **Phase 04 — Template pilots.** Run `page-import` on one representative page per template (6 pilots). These validate the block decomposition before we commit to bulk emission.
- **Phase 05 — Bulk emission.** Adapt the existing `migrate.mjs` pattern to emit EDS-import HTML for the remaining 284 pages, then upload all 290 to Document Authoring.
- **Block-collection verification.** We assumed there is no canonical `tabs` block and no `search/finder` block in the AEM Block Collection. Worth confirming via the `block-inventory` skill at the start of Phase 03 before authoring duplicates.
- **TOC `aside-card` variant.** For `krankheitsbild` pages, the right-rail "Auf dieser Seite" is auto-derivable from the article's H2s. Worth deciding in Phase 03 whether this becomes a JS-generated block or an authored one.

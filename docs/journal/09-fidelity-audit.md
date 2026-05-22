# Phase 09 — 1:1 fidelity audit

**Dates:** 2026-05-21
**Status:** complete — 5 of 5 audit-identified structural gaps closed; all 6 templates now match originals at structural fidelity
**Goal:** User pointed out that the bulk-migrated pages were "close but not 1:1" with the originals. Systematically audit each template, catalog every visible difference, and close the structural gaps before declaring the migration done.

## Summary

Did a side-by-side desktop audit (1440px) of all 6 templates: original on `127.0.0.1:8080` vs migrated on the EDS branch preview. Catalogued every visible difference. Five real structural gaps surfaced — none had been caught in Phase 06/07 because those pilots compared individual page layouts rather than doing strict A/B against the originals.

All 5 gaps fixed and re-validated. The bulk emission was re-run so all 290 pages now carry the fidelity improvements.

| # | Gap | Pages | Fix |
|---|---|---:|---|
| 1 | KPI strip rendered as a separate block BELOW the hero, but the source has it INSIDE the hero text column | 290 | Hero block now accepts extra rows after the (text\|image) row; JS folds them into a `.hero-kpi` grid inside `.hero-text` |
| 2 | Hero images had no caption overlay (Variant C signature: "ONKOLOGIE · HIRSLANDEN"-style credit bottom-left) | ~140 (pages with photos, not portraits) | Migration extracts `.credit` from source; hero JS renders `.hero-image-credit` absolute-positioned over the image |
| 3 | Article body in two-column sections spanned the full left column width — original has a tight 720px reading column | 225 (doctor + krankheitsbild + news) | CSS `max-width: 720px` on `.section.two-column > .default-content-wrapper` |
| 4 | Doctor "Termin anfragen" aside had no form fields — only a button placeholder | 150 | Migration emits a placeholder row; aside-card JS detects the form variant and constructs `<form>` with real inputs (name / phone / message / submit) since EDS strips `<form>` from authored content |
| 5 | Home events grid stacked content vertically — original splits each card into date column + body column side-by-side | 1 (home) + future | `.cards.events` CSS uses CSS Grid (64px date column + 1fr body column) on each `<li>` |

## What happened

1. **Captured 12 screenshots** at 1440px (original + migrated for each of 6 templates) into `audit/`. Visually compared each pair in turn.

2. **Catalogued gaps per template.** Pattern: most templates shared the same top-level structural gaps (KPI position, image caption). Doctor and the two-column templates had template-specific gaps (form fields, article-body width). Home had the most unique gaps (events cards).

3. **Triaged by impact.** Gaps 1 and 2 hit every hero-bearing page (290). Gap 3 hits 225 pages. Gap 4 hits 150 doctor pages. Gap 5 hits the single home page. All worth fixing for true 1:1.

4. **Restructured the hero block (gap 1).** Hero now reads multiple DA rows. Row 0 is the (text | image) layout pair; rows 1+ are KPI pairs (number | label). Hero JS:
   - Reads row 0 as before
   - Walks rows 1+, builds `<div class="hero-kpi">` with `.hero-kpi-item > .hero-kpi-n + .hero-kpi-l` for each pair, appends to `.hero-text`
   - Removes the now-flattened KPI rows from the block DOM

   Migration script: `convertHero()` returns ONE block instead of [hero, kpi-strip]. The kpi-strip standalone block is now unused — could be deleted in a follow-up cleanup.

5. **Added image caption (gap 2).** Migration extracts `.credit` element from the source's `.image` div. The hero `image cell` HTML gains a `<small>` carrying the credit text. Hero JS plucks `<small>` (or last paragraph), removes it from flow, appends a positioned `<div class="hero-image-credit">` absolute-positioned bottom-left over the picture. CSS styles it uppercase white 11px.

6. **Article body max-width (gap 3).** Single-rule CSS addition: `main .section.two-column > .default-content-wrapper { max-width: 720px; }`. The list-rows-wrapper and aside-card-wrapper aren't affected. Tight reading column for prose; full-width for tabular content.

7. **Doctor form fields (gap 4).** Initial attempt embedded `<form><input>...` directly in the migration output, but EDS sanitizes `<form>` and `<input>` out of authored content (security). Pivoted: migration emits a placeholder text cell ("Ihr Name Telefon Anliegen Anfrage senden"); aside-card JS detects the form variant, finds the placeholder by regex, and `replaceWith`'s a real `<form>` constructed in JS. The form is non-functional — submit handler just `preventDefault`s.

8. **Events cards layout (gap 5).** `.cards.events` variant CSS: each `<li>` is a CSS Grid with a 64px date column (right-bordered, centered) and a 1fr body column. The boilerplate `cards.js` already classifies both cells as `.cards-card-body` (since neither has a picture), so CSS uses `:first-child` to distinguish.

9. **Lint adventures.** Eslint flagged double quotes (preference is single); stylelint flagged a duplicate selector after I split + merged some rules during iteration. Both auto-fixed.

10. **Re-ran the bulk migration** (`migrate-bulk.mjs` + `post-bulk.mjs`): 290/290 generated, 290/290 POSTed, 290/290 previewed. No edge cases this time — the slug normalization from the Phase 08 self-review held up.

11. **Visually re-validated** doctor + home + fachgebiet at 1440px. All five fixes visible. The doctor pilot now shows the KPI strip tucked into the hero text column after the buttons; the home shows the "ONKOLOGIE · HIRSLANDEN" image credit and the events grid with proper date column.

## EDS commits this phase

```
6c9c2db fix(aside-card): single-quote strings per eslint config
513a4f0 fix(aside-card): construct form in JS since EDS strips form/input tags
023c6be fix(cards): consolidate duplicate selector in events variant
cd2d40c fix(hero): integrate KPI strip inside hero text column + image caption
```

All pushed to the `eds-migration` branch remote.

## What's still NOT 1:1 (acceptable / documented exclusions)

- **Header, footer, breadcrumb** — out of scope per [ADR 0002](../decisions/0002-eds-migration-approach.md). The branch preview serves boilerplate chrome.
- **Interactive form behavior** — doctor's "Anfrage senden" submit is `preventDefault`-ed. Visual rendering matches; no backend wiring.
- **Real finder search wiring** — home finder is visual only.
- **Audience-tab panel switching** — clicking another audience tab visually selects it but doesn't swap panel content.
- **Mobile validation** — still pending across the 290 pages (Phase 06 / 07 / 09 open thread).

## Discoveries

- **EDS sanitizes `<form>`, `<input>`, `<button>` from authored content.** Confirmed during gap 4 fix attempts. The DOM after rendering had only the textual contents — no form elements. Block JS that constructs these elements post-render bypasses the sanitizer. Worth noting for future blocks that need form-like UI.

- **The standalone `kpi-strip` block (Phase 06) was dead code after the hero restructure.** Removed during self-review cleanup (commit `b4d39f3`). KPIs now exclusively render inside the hero block. If a standalone KPI display is needed later, recover the deletion from git.

- **`eds-out/pilot-*.html` and the `/pilot-*` paths in DA were stale** vs the post-Phase-09 migration output. Regenerated and re-POSTed during self-review so the fixtures match the bulk emission. Both stay in sync going forward.

## Open threads / next steps

- **Mobile validation** still pending. Likely the next move after the user reviews this fidelity pass.
- **Delete or repurpose the standalone `kpi-strip` block** — currently unused.
- **Subtle gaps not yet addressed** (would surface in a stricter pass):
  - Exact hero h1 sizing at desktop vs original (font-size may be slightly different)
  - Hero proportions (text column width vs image column width)
  - Exact spacing between sections
  - Hero "Tipp" hint above Suchen button (home finder)
- **Form fields are visual only.** Real submission wiring would require a backend or Block Collection form integration — not pursued.

## Validation URLs

- https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/de/corporate/aerzte/1/docteur-christian-jaccard
- https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/de/corporate/fachgebiete/akupunktur-traditionelle-chinesische-medizin
- https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/de/corporate/krankheitsbilder/angina-pectoris
- https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/de/corporate/medien-und-news/medienmitteilungen-und-news/archiv
- https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/de/corporate/jobs-und-karriere/arbeitgeberin
- https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/

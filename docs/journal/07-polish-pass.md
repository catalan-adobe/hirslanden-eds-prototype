# Phase 07 — Polish pass + home pilot

**Dates:** 2026-05-21
**Status:** complete — all 6 templates including home now render at near-fidelity vs. the originals
**Goal:** Close the 5 documented gaps from Phase 06 and round out template coverage by adding the home pilot. After this, bulk emission of the 284 remaining pages can proceed against a complete, validated recipe.

## Summary

Closed every open thread that Phase 06 flagged as a polish gap:

| Gap | Fix | Pages affected |
|---|---|---|
| News article-hero eyebrow rendered italic instead of uppercase eyebrow | Drop the `<em>` wrap in the script; add CSS for "first `<p>` in `.section.bg-surface`" | 25 |
| Section "eyebrow + h2 + right-link" header pattern missing | New `head-row` block + extraction; applied to fachgebiet, jobs, all home cards sections | 64+ |
| Doctor portrait placeholder missing (blank image cell) | New hero `portrait` variant + auto-derived initials (skip honorifics like Dr/Prof/Med) | 150 |
| Doctor body's "VITA & SCHWERPUNKTE" + h2 + "Bereiche" h3 structure missing | Script extracts the full pattern; CSS styles first-`<p>`-before-`<h2>` in two-column sections as eyebrow + h2 sentence-case | 150 |
| Home pilot not generated — script lacked handlers | Added converters: `convertAudienceTabs`, `convertFinder`, `convertServicesGrid`, `convertEventsGrid`, `convertHomeNewsList`; new `home` template branch | 1 |

Result: the 6 pilots now visually match their originals at near-fidelity. Header, footer, breadcrumb remain out of scope per [ADR 0002](../decisions/0002-eds-migration-approach.md).

## What happened

1. **News article-hero eyebrow (task 31).** Tiny script + CSS pair: emit the eyebrow as plain `<p>` (no `<em>`), then style `main .section.bg-surface > .default-content-wrapper > p:first-child` as uppercase cyan-deep. Single fix covers all 25 news pages.

2. **`head-row` block (task 32).** Variant C's "section header" pattern (eyebrow + h2 left, "Alle X →" right) was authored 6+ times in the source under `.head-row` and `.head` classes. Promoted to a dedicated EDS block with 1 row × 2 cells. CSS uses flex `justify-content: space-between; align-items: baseline;`. Script's `convertHeadRow()` extracts from any `.head-row` or `.head` element and emits the block.

3. **Doctor portrait variant (task 33).** Hero block gained a `portrait` class variant. When the image cell is empty AND the variant is `portrait`, JS:
   - Reads the H1 text
   - Strips honorifics (`dr`, `dr.`, `doktor`, `docteur`, `prof`, `prof.`, `professor`, `med`, `med.`, `dent`, `dent.`, `phd`, `mba`, `fmh`, `sir`, `dame`)
   - Takes the first letter of the last two remaining tokens (e.g. "Docteur Christian Jaccard" → "CJ", "Prof. Dr. med. Sebastian Kos" → "SK")
   - Injects `<div class="hero-portrait">` with circular initials avatar + "PORTRAIT · PLATZHALTER" caption
   CSS swaps the scrim-on-image for a flat secondary→primary gradient. Migration script applies `hero (named portrait)` for doctor profiles.

4. **Doctor body structure (task 34).** Doctor body section has more structure than other two-column templates: eyebrow + h2 (doctor name again) + vita paragraph + h3 ("Bereiche") + list-rows + form aside. Script now extracts all five elements from `.two-col > div:first-child`. CSS targets `.section.two-column > .default-content-wrapper > p:first-child:has(+ h2)` as the eyebrow and overrides the h2 to sentence-case at 22px. Uses CSS `:has()` so no per-block class needed.

5. **Home pilot (task 35).** The largest piece. Added five converters:
   - `convertAudienceTabs(sectionEl)` — extracts 4 tab labels + sub-labels and the active-tab marker (`is-active` class → `<strong>` wrap), plus the panel below (lead column with eyebrow + h3 + lede + outline-button CTA, paths column as `<ul>` of links).
   - `convertFinder(sectionEl)` — extracts the lead column (eyebrow + h2 + lede), tab labels (joined by `|`), and 4 field rows (label + placeholder).
   - `convertServicesGrid(sectionEl)` — converts `.svc` articles into `cards` block rows (image | body with kicker + h3 + p + link).
   - `convertEventsGrid(sectionEl)` — converts `.event` articles into `cards events` variant rows (date column | body).
   - `convertHomeNewsList(sectionEl)` — converts the home's bare `<ul>` of news items into a `list-rows` block (time + linked title + tag).

   The home template branch then assembles: hero + KPI strip + audience-tabs + (finder on `bg-secondary` section) + (head-row + services cards) + (head-row + news list-rows) + (head-row + events cards). Output matches the source layout including the dark finder band, the 8-link audience-paths grid, and the date-prefixed event cards.

6. **Lint adventures.** Stylelint `no-descending-specificity` flagged 2 ordering issues each time CSS landed: I had to move the lower-specificity selector before the higher-specificity sibling. Also caught an eslint `no-bitwise` error in the head-row JS (was using `compareDocumentPosition & DOCUMENT_POSITION_FOLLOWING`); refactored to use index comparison via `[...querySelectorAll].indexOf()` instead. Lint now clean across all blocks + styles.

7. **Regenerated all 6 pilots + POSTed to DA + previewed.** All return HTTP 200. Visually validated each against the local-server original at 1200px+. The doctor pilot is now a near-perfect match (portrait, KPI strip, sentence-case H1, VITA & SCHWERPUNKTE eyebrow + h2, two-column body); fachgebiet shows the head-row pattern; home renders all five custom block sections.

## Discoveries

*(none new — this was applied work)*

## Decisions

*(none new — followed established ADRs)*

## EDS commits this phase

```
4699c69 fix(audience-tabs): order rules by ascending specificity
d5e7a67 fix(styles): reorder rules to satisfy stylelint specificity ordering
329c2bf fix(head-row): use index comparison instead of bitwise check
abaac2e fix(head-row): avoid bitwise & to satisfy eslint no-bitwise
65ffaa6 feat: head-row block, hero portrait variant, bg-secondary section
```

All pushed to the `eds-migration` branch remote.

## Validated pilot URLs

- https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/pilot-doctor
- https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/pilot-fachgebiet
- https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/pilot-krankheitsbild
- https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/pilot-news
- https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/pilot-jobs
- https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/pilot-home

## Open threads / next steps

- **Phase 08 — Bulk emission.** Run `migrate-to-eds.mjs` against all 285 remaining pages (290 minus 5 already done; home is unique and already done). POST in batches with backoff. Spot-check ~10 random pages per template. Estimated effort: ~30–45 minutes.
- **Mobile re-validation.** Still not done at 375. Should pass through all 6 pilots at mobile width before bulk-emitting. ~15 minutes.
- **Cards events variant styling.** Migration emits `<div class="cards events">` for the events grid, but no `.cards.events` CSS has been authored yet. Boilerplate's `cards` styling renders the events visibly (date + body), but a date-prefix variant would polish the look. Defer to a Phase 09 polish if needed.
- **Form fields (doctor aside).** Still the same scope-deferred placeholder per Phase 04. Real form composition via Block Collection `form` block is not started.

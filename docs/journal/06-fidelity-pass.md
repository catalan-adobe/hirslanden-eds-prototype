# Phase 06 — Fidelity pass (pre-bulk)

**Dates:** 2026-05-21
**Status:** complete
**Goal:** Before bulk-emitting 290 pages, do a careful visual diff of each Phase 05 pilot against its original `site/*.html` and close the highest-impact gaps. The bulk emission inherits whatever quality this pass leaves on the table.

## Summary

User stood up a local static server at `http://127.0.0.1:8080` serving the original `site/*.html` files. I screenshot-compared each of the 5 Phase 05 pilots side-by-side with its original at 1440px and catalogued every visible gap. Three critical gaps (highest reuse, most visible impact) were closed in this phase:

1. **KPI strip block** authored — every hero's missing 4-up scale claim now renders
2. **Hero `named` variant** — sentence-case H1 for doctor and krankheitsbild (200 pages)
3. **`two-column` section style** — article + sticky aside grid for 3 templates (225 pages)

Also added section styles for `bg-surface` (news article-hero band) and `bg-secondary` (home finder band, for Phase 06+).

Result: all 5 non-home pilots now render at fidelity close to the original. Header, footer, and breadcrumb remain out of scope per [ADR 0002](../decisions/0002-eds-migration-approach.md). Five smaller gaps are documented as open threads for a polish pass later.

## What happened

1. **Verified local server.** `curl http://127.0.0.1:8080/` returned 200; representative pages all reachable.

2. **Screenshot-compared each pilot.** Captured both the original (on `127.0.0.1:8080`) and the EDS pilot (on the branch-preview URL) at 1440px, full-page. Catalogued visible differences.

3. **Triaged the gap list.** Three buckets:
   - **Critical** (broad reuse, high visual impact): KPI strip; H1 sentence-case; two-column body
   - **Important** (template-scoped): news article-hero `bg-surface` band; section "eyebrow + h2 + right-link" header pattern; doctor portrait gradient placeholder; doctor body's "VITA & SCHWERPUNKTE" + Bereiche h3 structure
   - **Out of scope**: header, footer, breadcrumb, doctor form fields (per [ADR 0002](../decisions/0002-eds-migration-approach.md) and [discoveries/eds-block-mapping](../discoveries/eds-block-mapping.md))

4. **Authored `kpi-strip` block** in the EDS repo. Content model: one DA row per KPI with two cells (number | label). CSS: 4-up grid that drops to 2-up at 520px. Decision: keep it as a separate block (instead of folding into hero) because it's flexible — a hero can appear without KPIs, KPIs can appear without a hero (e.g. inside an article).

5. **Added `hero.named` variant** in `blocks/hero/hero.css`. Drops the default uppercase and shrinks the H1 (from 41 → 34px at desktop, 28 → 26px at mobile). Migration script now applies the class for `doctor-profile` and `krankheitsbild` templates.

6. **Added section styles** to `styles/styles.css`:
   - `.section.bg-surface` — light gray band (matches Variant C `bg-surface`)
   - `.section.bg-secondary` — dark blue band (will be needed for home page finder in Phase 06+)
   - `.section.two-column` — 2-column grid with the aside-card-wrapper pinned to column 2 spanning all rows

7. **Updated the migration script** to:
   - Extract the `.kpi-strip` from the hero and emit a separate `kpi-strip` block
   - Apply `hero (named)` for `doctor-profile` and `krankheitsbild`
   - Group `body` content (article + list-rows + aside-card) into its own EDS section with `style: two-column` section metadata
   - Group `article-hero` into its own section with `style: bg-surface` (news template)

8. **CSS bug caught during validation.** First attempt at `.two-column` applied `display: grid` to each *wrapper* (default-content-wrapper, list-rows-wrapper, aside-card-wrapper) instead of the section itself. Each wrapper had only one block child, so the grid declared two columns but only filled column 1 — visually identical to the broken stacked layout. Fixed in `0c70dfa`: target the section, override the boilerplate's per-wrapper max-width/padding, pin `.aside-card-wrapper` to column 2 with `grid-row: 1 / 100`, route all other direct children to column 1.

9. **Regenerated 5 pilots, re-POSTed to DA, re-previewed at 1440.** All four critical fixes (KPI strip, sentence-case H1, two-column body, bg-surface news hero) validated visually. The doctor pilot now matches the original's structure: hero + KPI strip + meta-strip + two-column body with vita & list-rows on the left and aside-card on the right.

## Discoveries

*(none new — this was a fidelity pass on existing artifacts)*

## Decisions

*(none new — applied existing ADRs)*

## EDS commits this phase

```
0c70dfa fix(styles): two-column grid on section, not on each wrapper
c14d2a1 feat: kpi-strip block, hero named variant, section styles
```

Pushed to the `eds-migration` branch remote (under explicit user direction at the start of this session, when the first push enabled review).

## Open threads / next steps

- **Doctor portrait placeholder.** Original uses a gradient div with initials (`<div class="image" style="background: linear-gradient(135deg, #27455C, #0094D4)"><div>CJ</div></div>`). Pilot leaves the image cell blank. Could add a "portrait" hero variant that generates the gradient + initials when no `<img>` is present. Medium effort, doctor-specific.
- **News article-hero eyebrow style.** Currently rendered as `<p><em>News</em></p>` (italic). Original is uppercase cyan-deep `.eyebrow` style. A small CSS tweak (target the first `<p>` in the `bg-surface` section and apply eyebrow styling) would close this. Low effort.
- **Section "eyebrow + h2 + right-link" headers.** Affects fachgebiet, jobs, home (Diagnosen A–Z + Alle Krankheitsbilder, Inhalte + Mehr erfahren, Schwerpunkte aktuell + Alle Themen). A small "section-header" block or smart default-content styling could close this. Medium effort.
- **Doctor body's section structure.** Original has "VITA & SCHWERPUNKTE" eyebrow → "Docteur Christian Jaccard" h2 → vita paragraph → "Bereiche" h3 → list-rows. Pilot has just the vita paragraph + list-rows. The migration script should extract these from the source's body section. Low-medium effort.
- **Home pilot.** Still not generated — script needs handlers for `audience-tabs` (composite block + panel content), `finder` (with `bg-secondary` section), and `cards` for `schwerpunkte` + `events`. Medium-large effort.
- **Phase 07 — bulk emission.** Now that the recipes are close-to-fidelity, run the script on the remaining 284 pages, POST in batches, spot-check. Estimated effort: ~30–45 minutes of script run + POST + spot validation.

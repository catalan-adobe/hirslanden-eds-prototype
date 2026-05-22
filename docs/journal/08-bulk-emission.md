# Phase 08 — Bulk emission of all 290 pages

**Dates:** 2026-05-21
**Status:** complete — 290/290 content pages migrated to DA and previewed at near-fidelity
**Goal:** Run the validated Phase 07 recipe against every `site/*.html` and upload the results to Document Authoring so the migration becomes an actual artifact, not just a recipe.

## Summary

Wrote a thin bulk runner (`migrate-bulk.mjs`) that iterates every `site/*.html` (excluding the directory-navigator `site-index.html`), invokes `migrate-to-eds.mjs` per file, and writes the EDS-import HTML to `eds-out/bulk/` with the source file's `__`-separated name converted to `/`-separated path. Wrote a companion bulk POST script (`post-bulk.mjs`) that walks the generated tree, POSTs each file to DA at its semantic path, and triggers preview — with a concurrency cap of 5 to stay polite with the admin APIs.

**Outcome:** 290 generated, 290 POSTed, 290 previewed. Initial run had 4 preview failures (consecutive-dash slugs that `admin.hlx.page` rejects); fixed by renaming those 4 files to single-dash and re-POSTing.

Spot-checked 3 random pages from different templates — all render at the expected fidelity (hero + KPI strip + meta-strip + two-column body where applicable). Phase 07 recipe holds at scale.

## What happened

1. **Inventoried the work.** `site/` has 291 HTML files; `site-index.html` is the directory navigator (out of scope). 290 content pages remain. Of those, the 6 pilots from Phase 05/07 already exist in DA at `/pilot-*` paths — those stay as test fixtures; the bulk run writes to the real semantic paths.

2. **Wrote `migrate-bulk.mjs`.** Uses `execFileSync` to invoke `migrate-to-eds.mjs` per file (one subprocess per page, ~50ms each). Keeps the bulk runner thin and lets any script-level failure per file be a non-zero subprocess exit. Outputs go to `eds-out/bulk/<dotted-path>/...html`. Naming: source `site/de__corporate__aerzte__1__docteur-christian-jaccard.html` → output `eds-out/bulk/de/corporate/aerzte/1/docteur-christian-jaccard.html`.

3. **Ran the generation.** 290/290 generated cleanly in ~30 seconds. File counts by directory matched the original audit exactly (24+34+36+44+12 = 150 doctors, 50 fachgebiete, 50 krankheitsbilder, 25 news, 5 ueber-uns, 5 kliniken-und-zentren, 4 jobs, 1 index).

4. **Spot-checked outputs on disk.** Inspected 3 random generated HTMLs (random doctor, random krankheitsbild, random news). All matched the expected Phase 07 shape — hero with variant classes, KPI strip extracted, meta-strip, article body, asides.

5. **Wrote `post-bulk.mjs`.** Walks `eds-out/bulk/`, POSTs to DA at the relative path, triggers preview at the matching slug. Concurrency 5 via a small worker-pool loop. Includes a `--dry-run` flag for path verification.

6. **Dry-ran first** to verify the 290 destination paths. Output sample matched expected (e.g. `de/corporate/aerzte/1/docteur-christian-jaccard.html`). No path-mangling issues spotted.

7. **Ran the live bulk POST.** Took ~2 minutes wall-clock with concurrency 5. Result: **290/290 POSTed, 286/290 previewed.** The 4 preview failures all returned HTTP 404 from `admin.hlx.page` and all had consecutive or trailing dashes in the slug:
   - `herz--und-thorakalegefaesschirurgie`
   - `tauch--und-hyperbarmedizin`
   - `tropen--und-reisemedizin`
   - `sachkunde-fuer-dosisintensive-untersuchungen-und-therapeutische-`

8. **Fixed the 4 edge cases.** Wrote `/tmp/fix-dashes.mjs` to rename each file (collapsing `--` to `-` and stripping trailing `-`), re-POST to DA, and re-trigger preview. All 4 returned HTTP 201/200 on the second pass.

9. **Spot-checked 3 live pages visually** via Playwright at 1200px:
   - https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/de/corporate/aerzte/2/docteur-benjamin-gold — hero with "BG" portrait initials, KPI strip, meta-strip, two-column body
   - https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/de/corporate/krankheitsbilder/brustkrebs — KRANKHEITSBILD eyebrow, sentence-case h1 "Brustkrebs", KPI strip, meta-strip with "Drucken →" CTA
   - https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/de/corporate/fachgebiete/kardiologie — FACHGEBIET eyebrow, uppercase h1 "KARDIOLOGIE (HERZ & GEFÄSSE)", KPI strip, tab bar with KRANKHEITSBILDER active

10. **Self-review prompted a broader programmatic spot-check.** Wrote `/tmp/spot-check-bulk.mjs` to GET 12 random pages across all templates and verify HTTP 200 + correct `<title>` + presence of expected `.hero` + `.kpi-strip` classes in the raw HTML:

    | Template | Path | HTTP | Hero | KPI | Title |
    |---|---|---:|:-:|:-:|---|
    | doctor | `/de/corporate/aerzte/3/dr-med-julia-dahm` | 200 | ✓ | ✓ | Dr. med. Julia Dahm |
    | doctor | `/de/corporate/aerzte/5/dr-med-elias-ammann` | 200 | ✓ | ✓ | Dr. med. Elias Ammann |
    | doctor | `/de/corporate/aerzte/4/prof-dr-med-daniel-hausmann` | 200 | ✓ | ✓ | Prof. Dr. med. Daniel Hausmann |
    | fachgebiet | `/de/corporate/fachgebiete/radiologie` | 200 | ✓ | ✓ | Radiologie |
    | fachgebiet | `/de/corporate/fachgebiete/herz-und-thorakalegefaesschirurgie` (formerly `herz--und-…`) | 200 | ✓ | ✓ | Herz- und thorakale Gefässchirurgie |
    | krankheitsbild | `/de/corporate/krankheitsbilder/herzinfarkt` | 200 | ✓ | ✓ | Herzinfarkt (Myokardinfarkt) |
    | krankheitsbild | `/de/corporate/krankheitsbilder/prostatakrebs` | 200 | ✓ | ✓ | Prostatakrebs |
    | news | `/de/corporate/medien-und-news/.../swiss-lgbti-label` | 200 | (n/a) | (n/a) | Hirslanden erhält das Swiss LGBTI-Label… |
    | jobs | `/de/corporate/jobs-und-karriere/karrierepfade` | 200 | ✓ | ✓ | Dein Karriereweg führt über Hirslanden |
    | ueber-uns | `/de/corporate/ueber-uns/nachhaltigkeit` | 200 | ✓ | ✓ | Nachhaltigkeit bei der Hirslanden-Gruppe |
    | kliniken | `/de/corporate/kliniken-und-zentren/medizinische-zentren` | 200 | ✓ | ✓ | Medizinische Zentren |
    | home | `/` (NOT `/index`, EDS serves it via root) | 200 | (default content) | ✓ | Kompetenz, die Vertrauen schafft |

    News articles correctly skip `.hero` and `.kpi-strip` (the template uses `bg-surface` default content); all 7 templates render at expected fidelity.

11. **Slug normalization promoted to `migrate-bulk.mjs`.** The `/tmp/fix-dashes.mjs` one-off from step 8 was a workaround; the permanent fix lives in `migrate-bulk.mjs`'s `flatNameToPath()`: collapse consecutive dashes, strip trailing dashes before `.html` / `/`. The 4 originally-failed slugs would now generate correctly on a clean re-run.

## Discoveries

- **`admin.hlx.page` rejects consecutive / trailing dashes in slugs** even when the source file at that path POSTs successfully to DA. Workaround: normalize slugs to single-dash, single-trailing form before POSTing.

## Decisions

*(none new — applied existing ADRs)*

## Migration artifacts

### Scripts (in `migrate-hirslanden`)

```
migrate-to-eds.mjs   — per-file converter (Phase 05+, reused as-is here)
migrate-bulk.mjs     — iterates site/ and invokes migrate-to-eds per file
post-bulk.mjs        — walks eds-out/bulk/ and POSTs + previews each
```

### Output (in `migrate-hirslanden/eds-out/bulk/`)

```
  1  /              (index.html)
 24  /de/corporate/aerzte/1
 34  /de/corporate/aerzte/2
 36  /de/corporate/aerzte/3
 44  /de/corporate/aerzte/4
 12  /de/corporate/aerzte/5
 50  /de/corporate/fachgebiete
  4  /de/corporate/jobs-und-karriere
  5  /de/corporate/kliniken-und-zentren
 50  /de/corporate/krankheitsbilder
 25  /de/corporate/medien-und-news/medienmitteilungen-und-news
  5  /de/corporate/ueber-uns
```

### Live URLs

Browse via DA: https://da.live/#/catalan-adobe/hirslanden-eds-prototype/de/corporate

Branch preview root: https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/

Sample real-path URLs (no `/pilot-` prefix):
- `/de/corporate/aerzte/1/docteur-christian-jaccard`
- `/de/corporate/krankheitsbilder/angina-pectoris`
- `/de/corporate/fachgebiete/akupunktur-traditionelle-chinesische-medizin`
- `/de/corporate/medien-und-news/medienmitteilungen-und-news/lucerne-toolbox-3`
- `/de/corporate/jobs-und-karriere/karrierepfade`
- `/index` (boilerplate placeholder was overwritten with the migrated home)

## Open threads / next steps

- **Mobile re-validation still pending.** Phase 07 only validated at 1200px+. The 290 pages should pass through a 375px review before this is considered production-ready.
- **The 6 `/pilot-*` paths are now redundant.** They were test fixtures during Phases 05–07. Could be deleted from DA to keep the navigator clean. Low priority.
- **Slug normalization** moved into `migrate-bulk.mjs`'s `flatNameToPath()` during self-review (collapses `-+` → `-`, strips trailing `-` before `.html`/`/`). Next bulk re-run will produce clean slugs automatically; no rename pass needed.
- **Cards events variant CSS** still not authored. Events render with default cards styling. Polish if needed.
- **Doctor form fields** still scope-deferred per [ADR 0002](../decisions/0002-eds-migration-approach.md).

## Closing the loop on the original migration goal

[ADR 0002](../decisions/0002-eds-migration-approach.md) chose Approach A — template-recipe driven — to migrate the 290 content pages from the static `site/` prototype into AEM Edge Delivery Services. As of this phase:

- ✅ 8 custom blocks authored ([Phase 04](04-block-library.md))
- ✅ 6 templates piloted ([Phase 05](05-template-pilots.md))
- ✅ 3 critical fidelity gaps closed ([Phase 06](06-fidelity-pass.md))
- ✅ 5 polish gaps + home pilot ([Phase 07](07-polish-pass.md))
- ✅ 290 pages live in DA at semantic paths ([this phase](08-bulk-emission.md))

The strategic choice from Phase 02 played out as predicted: the template-recipe approach scaled cleanly because the source was structurally uniform (Phase 01 audit). Effort went into the recipe; the bulk emission was mechanical.

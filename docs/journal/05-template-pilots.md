# Phase 05 — Template pilots

**Dates:** 2026-05-21
**Status:** mostly complete — 5 of 6 templates validated end-to-end; `home` deferred
**Goal:** Run the Phase 04 block library against real captured content by generating one EDS-import HTML per template and previewing each on the EDS branch URL. Catch any block-decomposition gaps before scaling to all 290 pages in Phase 06.

## Summary

Authored a migration script (`migrate-to-eds.mjs`) that reads a `site/<page>.html` file (Variant C static prototype output) and emits an EDS-import HTML using our block library. Ran it against one representative page per template, POSTed each to DA, triggered preview, and visually validated against the branch-preview URL. **5 of the 6 templates (doctor-profile, fachgebiet, krankheitsbild, news-article, jobs-landing) render correctly end-to-end.** The home template was deferred because it requires three additional handlers (audience-tabs, finder, image-cards) that weren't covered by the script.

Validation surfaced **2 real bugs** in the migration mapping which were caught and fixed in-loop:
1. The news template embeds a `meta-strip` *inside* its `article-hero` section — the initial article-hero converter dropped it.
2. The facts aside on news pages is `<aside class="aside-card">` containing `<dl class="facts">` — the original selector tried to match `aside.aside-card.facts` which never resolves.

Both fixes shipped in the same commit as the script.

## What happened

1. **Pushed the remaining EDS commits.** Phase 04 had landed `list-rows`, `aside-card`, `meta-strip`, `tabs`, `audience-tabs`, `finder` locally but only `hero` + the button refactor were on the remote. Push ran cleanly; branch preview URL now serves the full block library.

2. **Installed `node-html-parser`** as a runtime dep on `migrate-hirslanden` (small, no transitive deps, just enough DOM-query power to extract `data-section` content from the static HTML).

3. **Authored `migrate-to-eds.mjs`** with per-section converters: `convertHero`, `convertMetaStrip`, `convertTabs`, `convertListRows`, `convertArticleBody`, `convertTocAside`, `convertFactsAside`, `convertFormAside`, `renderDefaultArticleHero`. The script reads `<body data-template>` to dispatch to the right template path. Output: `wrapBlock(className, rows)` produces the `<div class="block">…</div>` shape that EDS picks up.

4. **Generated 5 EDS-import HTMLs** under `eds-out/`:
   - `pilot-doctor.html` ← `site/de__corporate__aerzte__1__docteur-christian-jaccard.html`
   - `pilot-fachgebiet.html` ← `site/de__corporate__fachgebiete__akupunktur-traditionelle-chinesische-medizin.html`
   - `pilot-krankheitsbild.html` ← `site/de__corporate__krankheitsbilder__angina-pectoris.html`
   - `pilot-news.html` ← `site/de__corporate__medien-und-news__medienmitteilungen-und-news__archiv.html`
   - `pilot-jobs.html` ← `site/de__corporate__jobs-und-karriere__arbeitgeberin.html`

5. **POSTed each to DA + triggered preview** via `/tmp/da-post-pilots.mjs`. All five returned HTTP 201/200. Pilot URLs:
   - https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/pilot-doctor
   - https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/pilot-fachgebiet
   - https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/pilot-krankheitsbild
   - https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/pilot-news
   - https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/pilot-jobs

6. **Visually validated each pilot** via Playwright MCP at 1440. Caught the two bugs above on the news pilot (missing meta-strip + missing facts aside). Updated the script's `renderDefaultArticleHero` to also extract embedded meta-strips, and rewrote the facts-aside selector to use `aside.aside-card:has(dl)`. Re-generated and re-POSTed `pilot-news`; second pass clean.

7. **Committed.** EDS repo had nothing new (block library already on branch). `migrate-hirslanden` got commit `b5a2e51 — feat: migrate-to-eds.mjs — site/*.html → EDS-import HTML` containing the script, the 5 pilots in `eds-out/`, and the `node-html-parser` dep addition.

## Discoveries

*(no new discovery docs in this phase — the section→block mapping was already captured in [eds-block-mapping](../discoveries/eds-block-mapping.md). The two bugs found are described above; no broader pattern surfaced.)*

## Decisions

*(none new — followed established ADRs; no new strategic choices required.)*

## Known fidelity gap across all 5 pilots: KPI strip absent

Every Variant C hero contains a 4-up KPI strip inside the text column (e.g. `16 Privatkliniken / 300+ Kompetenzzentren / 3 000+ Ärztinnen / 24/7 Healthline` on home; `5 Bereiche / DE / CH / FMH` on doctor profiles). The Phase 04 block library does not yet include a `kpi-strip` block, so the migration script does not extract or emit them. All 5 pilots therefore render with empty space where the KPI strip would sit — visually missing relative to the source `site/` HTML.

This is a known omission flagged in [Phase 04 journal](04-block-library.md#open-threads--next-steps) and not a regression from the migration. **Decision point at Phase 06:** add a `kpi-strip` block (8th custom) and rerun all 290 pages, or extend `hero` to embed KPI rows. Either path adds an authoring step in DA.

## Per-pilot validation outcomes

| Template | Pilot URL slug | Renders | Notes |
|---|---|---|---|
| doctor-profile | `/pilot-doctor` | ✅ | Hero (no portrait image — the source uses a gradient avatar placeholder), meta-strip with right-aligned CTA, vita article body, Bereiche list-rows (5 stars), aside-card.form |
| fachgebiet | `/pilot-fachgebiet` | ✅ | Hero with full image, 5-tab sub-nav (Krankheitsbilder active), Diagnosen A–Z list-rows (2 conditions) |
| krankheitsbild | `/pilot-krankheitsbild` | ✅ | Hero with ECG image, meta-strip (Geprüft von / Aktualisiert / Lesezeit + Drucken right-aligned), article body with 6 H2 sections, aside-card.toc |
| news-article | `/pilot-news` | ✅ (after 2 fixes) | Eyebrow + h1 + lede default content, meta-strip (Redaktion + Lesezeit + Drucken), article body, aside-card.facts (Quelle / Jahr / Thema) |
| jobs-landing | `/pilot-jobs` | ✅ | Hero with nurse image, Inhalte list-rows (3 items, "Karriere" tag) |
| home | *(not generated)* | — | Script needs handlers for `audience-tabs`, `finder`, and image-cards (`schwerpunkte`, `events`). Deferred. |

## Open threads / next steps

- **Phase 06 — Bulk emission.** Run `migrate-to-eds.mjs` against the remaining 284 pages and bulk-upload to DA. Should be largely mechanical now that the per-template mappings are validated. Estimated effort: ~20 minutes of script run + ~30 minutes of POST batching + spot-check validation on a few randomly-selected pages per template.
- **Home pilot.** Add handlers to `migrate-to-eds.mjs` for `audience-tabs` (composite block with tab labels + panel), `finder` (lead + form fields, on `bg-secondary` section style), and image-cards (`schwerpunkte` + `events` → `cards` Block Collection block). Then a 6th pilot completes the template coverage. Estimated: ~45 minutes.
- **KPI strip — see fidelity gap section above.** Resolve before Phase 06 bulk emission or the 290 emitted pages will all be missing KPI strips.
- **Script structure asymmetry.** The migration script handles fachgebiet and jobs-landing via a generic top-loop (extracting hero/tabs/conditions-list/content/article-hero/meta-strip if present) but uses explicit per-template branches for doctor-profile, krankheitsbild, and news-article. Functional but inconsistent. Worth a small refactor at Phase 06 kickoff: move all template-specific dispatch into the per-template branches so a reader can see "this is what the doctor template emits" in one place.
- **Two-column layouts.** The doctor / krankheitsbild / news pilots currently render the article body and aside-card *stacked* rather than side-by-side. The Variant C source uses a `two-col` CSS class for this. EDS expresses this via section metadata (e.g. `style: two-column` on the section that wraps article + aside). The migration script needs to wrap the body block + aside in a separate EDS section with that metadata. Deferred to Phase 06.
- **Image fidelity in the doctor template.** Doctor profile heroes use a gradient avatar + initials, not a real photo, in the source. The current pilot renders the right text but no image. Acceptable for prototype; flag if a real headshot field is added later.
- **No-source heroes.** When a template uses a placeholder image (gradient + emoji-like initials), the script currently omits the image cell. The hero block degrades gracefully, but if we ever want a default fallback image we should add it here.
- **`bg-secondary` section style for finder.** The finder block's CSS handles white text via `.bg-secondary .finder-lead` — but EDS sections need this style applied via section metadata. Add `style: bg-secondary` to the finder section when home pilot ships.

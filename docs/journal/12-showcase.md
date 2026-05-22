# Phase 12 — Showcase, timings, and repo split

**Dates:** 2026-05-22
**Status:** complete — long-form story + landing page + searchable 290-page index live on the branch preview; docs+audit relocated to this repo so aem-code-sync auto-deploys everything
**Goal:** Package the migration into something a teammate can open in one URL: the high-to-low story, side-by-side proof images, timing breakdown, what was kept / changed / dropped, and a way to spot-check every migrated page.

## Summary

After Phase 11 closed the fidelity bar, the work was usable but invisible to anyone outside the session. This phase produced three deliverables:

1. **[`SHOWCASE.md`](../SHOWCASE.md)** — long-form narrative covering origin → end state, per-phase highlights, visual fidelity gaps, tools/skills used, source-specific caveats.
2. **[`showcase/index.html`](../showcase/index.html)** — a single-page landing built in raw HTML/CSS/SVG using the source's Variant C palette (cyan #0094D4, ink, surface). Hero with stats strip, 3-column infographic, side-by-side gallery (lightbox), source caveats, vertical phase timeline, sessions strip + per-phase Gantt bars, tools-and-skills section, deep links to journal/ADRs.
3. **[`showcase/pages.html`](../showcase/pages.html)** — searchable index of all 290 migrated pages, grouped by template, with text filter + tag-button filter and a live count.

Plus a structural decision documented as [ADR-0006](../decisions/0006-repo-split-docs-vs-tooling.md): docs + audit live in this repo (auto-deployed via aem-code-sync), migration scripts + source content stay in `migrate-hirslanden`. The two-repo split is now official.

## What happened

### 1. SHOWCASE.md — long-form story

Single-file narrative organized as 30-second pitch → origin/constraints → per-phase highlights (11 entries) → visual fidelity scorecard → source-specific caveats → tools/skills used → "where to go next". Threaded throughout: links to phase journals, ADRs, discoveries, and audit images. Calibrated to "high visual fidelity with documented gaps" rather than "1:1" after user feedback ("let's not brag and state about 1:1 fidelity because we did not achieve it").

### 2. showcase/index.html — engaging landing page

Variant C palette extracted from the source (cyan #0094D4, deep #0073A8, ink #534C46, surface #F7F6F5) and re-used everywhere — including in the SVG infographic. No external CSS, no JS framework — just a single HTML file under 1500 lines.

Structure (top-to-bottom):

| Section | Purpose |
|---|---|
| Hero | Strike-through "in days" headline + CTA pointing at `pages.html` |
| Stats strip | 290 pages / 6 templates / ~7h active / 8 blocks |
| Infographic | 3-column horizontal flow (Source → Pipeline → EDS) with SVG iconography, positioned below stats per user feedback |
| 30s pitch | Plain-language summary including "what's not 1:1" callout |
| SBS gallery | 6 side-by-side review cards — clicking opens lightbox at full resolution |
| Source caveats | 3-column: Changed from source / Looks functional but never was / Absent from source itself |
| Timeline | Vertical line with 11 phase milestones |
| Patterns | 6 cards on EDS-specific learnings (auto-`<p>`, cards.css collisions, etc.) |
| Sessions strip | 4 Gantt-style cumulative bars showing 4 work sessions across 21h wall-clock |
| Per-phase bars | Per-phase Gantt across 515min total (active time) |
| Tools & skills | 3-column: Adobe ecosystem / Skills consulted / Code + tooling |
| Explore | Deep links into journal, ADRs, discoveries, repos (all use GitHub blob URLs since `.hlxignore` keeps `*.md` out of EDS routing) |

Footer was removed mid-iteration ("Can we just remove the footer?") — chrome is intentionally absent so the page reads as a standalone artifact.

### 3. showcase/pages.html — searchable 290-page index

Generated from `migrate-hirslanden/eds-out/bulk/*.html` via a small Node script that extracted each file's `<h1>` and grouped by URL prefix:

| Template | Count |
|---|---|
| Home | 1 |
| Ärzte (doctors) | 150 |
| Fachgebiete | 50 |
| Krankheitsbilder | 50 |
| News (medien-und-news) | 25 |
| Jobs & Karriere | 4 |
| Kliniken | 5 |
| Über uns | 5 |
| **Total** | **290** |

Dark hero matching the showcase style; 8-cell stat strip with per-template counts; filter row (text input + 9 tag buttons + live count); per-group sections with icon, eyebrow, h2, count chip; 2-column page grid with title + slug. ~30 lines of vanilla JS for the filter. A "Heads up" note acknowledges that parent listing pages (`/de/corporate/aerzte` etc.) 404 since only content pages were migrated.

### 4. Timings — git-commit clustering for active periods

User noticed the wall-clock duration didn't reflect actual work time ("I know we started the session yesterday and I kept it over today but of course I did not work during night"). Solved by clustering commit timestamps with a Python script: any gap >60min between consecutive commits counts as a break. Result: ~6h 45min of active work across 4 sessions vs ~21h wall-clock.

Sessions strip on showcase reads as a Gantt chart — each session's bar starts where the previous ended (cumulative % across the active total), showing continuity rather than scattered blocks (per user: "make them more Gantt chart so the next one is aligned at the end of the previous, to show the 'continuity'").

### 5. Side-by-side images

12 review screenshots composed via ImageMagick — 6 in `audit/side-by-side/sbs-*.png` (the gallery), plus phase-10/-11 raw screenshots. SBS naming: `sbs-{template}-{1440|375}.png`.

### 6. Repo relocation (ADR-0006)

User: *"As it's an EDS repository, pushing HTML there will deploy it automatically and make it available to everyone OOTB."* — relocated `docs/` and `audit/` from `migrate-hirslanden` into this repo. Side-effects:

- `aem-code-sync` deploys every `*.html` in the code bus, so `showcase/index.html`, `showcase/pages.html`, and the 12 SBS PNGs in `audit/side-by-side/` are now reachable at branch-preview URLs without any extra hosting.
- `.hlxignore` excludes `*.md` from EDS web routing — markdown cross-links inside the showcase HTML use GitHub blob URLs (`github.com/.../blob/eds-migration/docs/...`). GitHub renders the markdown nicely so the UX is fine.
- `migrate-hirslanden/docs/README.md` became a brief forwarding stub pointing at this repo as the canonical docs location.
- `migrate-hirslanden`'s `eds-migration` branch carries the cleanup commit (docs+audit deletions + forwarding stub) but stays **local-only** per [ADR-0004](../decisions/0004-branch-workflow.md). This repo is the canonical artifact going forward.

Documented in [ADR-0006](../decisions/0006-repo-split-docs-vs-tooling.md), which amends [ADR-0001](../decisions/0001-documentation-system.md) (the documentation system now spans two repos).

## EDS commits this phase

```
806e6b8 docs: relocate docs + audit from migrate-hirslanden
948063a feat(showcase): pages.html — searchable index of all 290 migrated pages
```

Plus the doc-trio (ADR-0006, this journal, README refresh) landing as a single follow-up commit.

The pre-relocation showcase work (SHOWCASE.md, showcase/index.html, audit/side-by-side/*, the timing analysis, Gantt iterations, source-caveat section, infographic, footer removal) happened over many small edits in `migrate-hirslanden` before the relocation — none of them survive as discrete EDS commits because the relocation bundled the final state into one commit.

## Patterns and lessons

### aem-code-sync as zero-infra showcase host

Any `*.html` outside `.hlxignore` deploys to the branch preview URL on push. No Netlify, no S3, no GitHub Pages config. The showcase URL pattern is `https://<branch>--<repo>--<owner>.aem.page/<path>`. For prototypes where the docs themselves are part of the story, putting them in the EDS repo means zero hosting work — and reviewers get a stable URL to share.

### `.hlxignore` excludes markdown — link strategy matters

`*.md` is excluded from EDS routing by default. Cross-links inside the showcase HTML can't be relative `.md` paths — they need `github.com/.../blob/...` URLs. GitHub renders markdown so the UX is unchanged, but the constraint shaped how the showcase's "Explore" section is wired.

### Git-commit clustering for active-time reconstruction

Wall-clock duration is meaningless across multi-day sessions. Clustering commit timestamps with a configurable gap threshold (>60min = break) gives a real "hands on keyboard" number. Works for any project that commits frequently. The script took ~10min to write; it produced the data for both the long-form table in SHOWCASE.md and the Gantt-style sessions strip on the landing page.

### Variant C palette anchors the showcase to the migrated artifact

Re-using the source's exact tokens (cyan #0094D4, deep #0073A8, ink #534C46, surface #F7F6F5) in the showcase makes it read as part of the same family as the migrated pages, not a generic Adobe template. Worth doing — the visual continuity reinforces what the showcase is *about*.

## Validation URLs

- Showcase: https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/docs/showcase/index.html
- Pages index: https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/docs/showcase/pages.html
- Side-by-side images: https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/audit/side-by-side/sbs-doctor-1440.png (and 5 others)

## What's still open

- **Mobile (375px) validation** — every phase including this one looked at 1440px only. The showcase explicitly documents this as a known gap.
- **Authored chrome** — header/footer ship as static fragments, breadcrumb is JS-derived. Per [ADR-0005](../decisions/0005-static-chrome-via-snowflake.md) the prototype trades authorability for fidelity; a future iteration could lift these into DA.
- **Parent listing pages** — breadcrumb section-links target `/de/corporate/{section}` which 404 since only the 290 content pages were migrated. Visually correct, navigationally incomplete.

## Related

- [ADR-0006](../decisions/0006-repo-split-docs-vs-tooling.md) — the repo split this phase locks in
- [SHOWCASE.md](../SHOWCASE.md) — the long-form story
- [`migrate-hirslanden/docs/README.md`](https://github.com/catalan-adobe/migrate-hirslanden/blob/eds-migration/docs/README.md) — forwarding stub on the source-repo side (note: that branch is local-only, so the link works only after a manual push)

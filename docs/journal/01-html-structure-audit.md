# Phase 01 — HTML structure audit

**Dates:** 2026-05-21
**Status:** complete
**Goal:** Confirm whether the 291 HTML files in `site/` are part of a single website with a shared template, or a heterogeneous collection.

## Summary

The audit confirmed that all 291 files in `site/` are output of one static-site generator (the repo's `build.mjs` + `migrate.mjs`). They share a single DOCTYPE, language, header, footer, and primary navigation. The inline `<style>` block is byte-identical across 289 of 291 files; the two outliers (`index.html`, `site-index.html`) extend it with page-specific additions. Structural variation is confined to six explicitly-declared body templates (`data-template="…"`) that map cleanly to the seven content categories on disk.

## What happened

1. **Inventory.** Listed `site/` — 291 HTML files. Categorized by filename prefix:
   - 150 `aerzte` (doctor profiles)
   - 50 `krankheitsbilder` (disease pictures)
   - 50 `fachgebiete` (specialty pages)
   - 25 `medien-und-news` (news articles)
   - 5 `ueber-uns` (about)
   - 5 `kliniken-und-zentren` (clinics)
   - 4 `jobs-und-karriere` (careers)
   - 1 `index.html` (home)
   - 1 `site-index.html` (directory listing)

2. **Sampled 9 representative pages** — one from each category plus the two singletons — and read them in full to inventory `<head>`, `<header>`, body templates, breadcrumb, hero variants, and footer.

3. **Hashed shared regions** across all 291 files:
   - `<style>` block → 3 unique MD5s (289 + 1 + 1).
   - `<header class="header">` block → 4 unique MD5s, differing only by `aria-current="page"` placement and one URL variant on the home page.
   - `<footer data-section="footer">` block → 3 unique MD5s, with 289 byte-identical and 2 cosmetic whitespace variants on the two singletons.

4. **Tallied `data-template`** values on `<body>`:
   - `doctor-profile` × 150
   - `fachgebiet` × 60 (reused by fachgebiete + ueber-uns + kliniken-und-zentren)
   - `krankheitsbild` × 50
   - `news-article` × 25
   - `jobs-landing` × 4
   - `home` × 1
   - none × 1 (`site-index.html`)

5. **Verified shared markers** — `id="ds-nav-list"`, `class="f-brand"`, copyright string, Healthline phone, logo URL, `aria-label="Hauptnavigation"`: all 291/291. Breadcrumb `<nav class="crumb">`: 289/291 (missing only on home and site-index, semantically correct).

6. **Recorded findings** as a discovery doc and proposed a documentation system to capture this and future work.

## Discoveries

- [Site template structure (291 pages)](../discoveries/site-template-structure.md)

## Decisions

- [0001 — Documentation system](../decisions/0001-documentation-system.md)

## Open threads / next steps

- The repo name `migrate-hirslanden` and the presence of stardust artifacts suggest a downstream migration target (likely Edge Delivery Services based on adjacent skills in the environment). The next phase is not yet defined — pending user direction.
- The `fachgebiet` template is reused by three categories (fachgebiete, ueber-uns, kliniken-und-zentren). Whether this is intentional template-sharing or a migration shortcut worth refactoring is unresolved.
- All 290 content pages carry `data-variant="C"`; `site-index.html` does not. Confirmed harmless (it's the directory navigator, not a content page) but worth flagging if a future check treats `data-variant` as a required marker.

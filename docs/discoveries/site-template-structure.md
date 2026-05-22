# Site template structure (291 pages)

**Date:** 2026-05-21
**Source:** Read 9 representative HTML files in full; ran MD5 hashing and ripgrep counts over all `site/*.html`.

## Finding

All 291 files in `site/` are output of a single static-site generator producing one website. They share a single design system, navigation, and footer. Structural variation is confined to six explicitly-declared body templates that map cleanly to the seven content categories on disk.

## Evidence

### Cross-cutting invariants (291/291)

| Invariant | Count |
|---|---|
| `<!doctype html>` on line 1 | 291 |
| `<html lang="de">` | 291 |
| `<meta charset="utf-8">` + viewport | 291 |
| Sticky `<header class="header" data-section="header">` with `id="ds-nav-list"` | 291 |
| Dark `<footer data-section="footer">` with `.f-brand` block | 291 |
| Identical 4-link primary nav (Healthline · Kliniken · Ärzte · Fachgebiete) | 291 |
| Same logo URL (`hirslanden.ch/.../hirslanden-logo.png`) | 291 |
| Copyright `© 2026 Hirslanden AG, ein Unternehmen der Mediclinic Gruppe` | 291 |
| Healthline phone `0848 333 999` in footer | 291 |
| `aria-label="Hauptnavigation"` on nav | 291 |

### Inline `<style>` block — 289 byte-identical

| MD5 | Files | Description |
|---|---:|---|
| `3a6c5c3b3e5eb40346a4a55d5a348f8f` | 289 | Shared template CSS (design tokens + component classes) |
| `e9e4fe18abf040f870b9a0a2c1666953` | 1 | `index.html` — home-specific extensions (audience tabs, services, news rows, events grid, finder) |
| `1e0ceef8817035eab10e1ecd56b704f7` | 1 | `site-index.html` — directory-listing extensions (page-grid, count chips) |

The 289-file CSS block carries the same `:root` token contract: `--color-primary:#0094D4`, `--color-text:#534C46`, `--font-sans:"Metropolis"…`, `--radius-btn:999px`, `--section-pad:48px`, etc.

### `<header>` variants — driven only by `aria-current`

| MD5 | Files | What differs |
|---|---:|---|
| `d2337dc44dfa7d18f64fff7f6229bc93` | 150 | `aria-current="page"` on **Ärzte** (all doctor pages) |
| `225cf20812c62abf751a3130d1724ee8` | 110 | `aria-current="page"` on **Fachgebiete** (fachgebiete 50 + krankheitsbilder 50 + ueber-uns 5 + kliniken-und-zentren 5) |
| `e863083361cb814a09802d945763f795` | 30 | No `aria-current` (news 25 + jobs 4 + site-index 1) |
| `4d1027aabcea6e2fc9b425c0cee95d32` | 1 | `index.html` — utility "Jobs" link points to `/de/corporate/jobs-und-karriere.html` (others use `/jobs-und-karriere/karrierepfade.html`) |

### `<footer>` — 289 byte-identical (`0b01f8aa1c18503f663a22b88b509e4d`); the 2 outliers are `index.html` and `site-index.html` with cosmetic whitespace differences only (same content, same links).

### Body templates declared on `<body data-template="…">`

| Template | Count | Sections inside (`data-section`) |
|---|---:|---|
| `doctor-profile` | 150 | header · hero · meta · body · footer (+ breadcrumb) |
| `fachgebiet` | 60 | header · hero · tabs · conditions-list · footer (+ breadcrumb). Reused by ueber-uns & kliniken-und-zentren |
| `krankheitsbild` | 50 | header · hero · meta · body · footer (+ breadcrumb) |
| `news-article` | 25 | header · article-hero · body · footer (+ breadcrumb) |
| `jobs-landing` | 4 | header · hero · content · footer (+ breadcrumb) |
| `home` | 1 | header · hero · audience-tabs · audience-panel · finder · schwerpunkte · news · events · footer |
| *(none)* | 1 | `site-index.html` — directory navigator |

All 290 content pages also carry `data-variant="C"` and (except `site-index.html`) the `_provenance` HTML comment identifying them as outputs of `stardust:prototype (impeccable craft via build.mjs)`, variant `C`, mode `brand-faithful-A`.

### Breadcrumb pattern

`<nav class="crumb" aria-label="Brotkrumen">` appears on 289/291. The 2 exclusions (`index.html`, `site-index.html`) are landing pages and semantically should not have breadcrumbs.

## Implications

- Future migration work can rely on a stable DOM shape across all 290 content pages — `data-section` attributes are reliable hooks for extraction.
- The shared `<style>` block on 289 files is a single replaceable unit; updating styles repo-wide is a 289-file find-and-replace, not 289 independent edits.
- The 4-variant header difference is purely semantic (`aria-current` placement); a future template can collapse it to a single source with a per-page input.
- The `fachgebiet` template's reuse by three categories (60 total) is intentional template sharing in the generator, not a content collision.
- Only 2 files (`index.html`, `site-index.html`) need bespoke CSS treatment — every other migration step can treat the 289 as a homogeneous set.

## Related

- [journal/01 — HTML structure audit](../journal/01-html-structure-audit.md) — the chronological narrative that produced this discovery.
- Source generators in the repo root: `build.mjs`, `migrate.mjs`, `build-index.mjs`.
- Root-level `_provenance`-tagged spec docs that define the target system: `README.md`, `PRODUCT.md`, `DESIGN.md`, `DESIGN.json`.

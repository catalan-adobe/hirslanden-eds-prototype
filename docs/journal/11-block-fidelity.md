# Phase 11 — Per-block 1:1 fidelity sweep

**Dates:** 2026-05-21 / 2026-05-22
**Status:** complete — all 8 custom blocks plus section + heading defaults audited and aligned with the source
**Goal:** Apply Phase 10.1's `getComputedStyle` audit methodology to every block on every template, until the chrome+content stack matches the source pixel-for-pixel.

## Summary

Two-stage sweep:

1. **Phase 11a — global resets.** Promoted the three source-globals that Phase 10.1 caught in the chrome (`*{box-sizing:border-box}`, `body{line-height:1.55}`, `img{max-width:100%;display:block}`) into `styles.css`. Every block ported from the source inherits these as assumptions — one commit fixed cascading gaps everywhere.

2. **Phase 11b — per-block audits.** Walked each of the 8 custom blocks with `getComputedStyle` + `offsetHeight` comparisons against the source's rendered DOM at 1440px. Catalogued the gaps, fixed them in the block's CSS/JS, re-validated. Plus heading-size globals at the end (h1-h4 sizes were prototype defaults, not source values).

Visual side-by-side at 1440px now reads as 1:1 across home, doctor, fachgebiet, krankheitsbild, news templates. Subtle ±2-8px gaps remain on some elements (tab heights, sub-element margins) but no structural divergences.

## What happened

### Phase 11a — three global resets

| File | Change |
|---|---|
| `styles/styles.css` | `*{box-sizing:border-box}`, `img{max-width:100%;display:block}`, `body{line-height: 1.6 → 1.55}` |

The chrome already had these scoped per-block from Phase 10.1; leaving them in place as belt-and-suspenders.

Commit: `054db2b feat(styles): promote 3 source-aligned global resets`

### Phase 11b — per-block fixes

#### Hero (home + doctor + fachgebiet + krankheitsbild)

| Bug | Fix |
|---|---|
| Buttons stacked vertically (each `<a>` wrapped in `<p class="button-wrapper">`) | hero.js groups consecutive wrappers into a `.hero-cta` flex div mirroring source's `<div style="display:flex;gap:12px;flex-wrap:wrap">` |
| Text col padding-left 40px (source has 0) | `.hero-text` desktop padding `48px 32px 48px 0` |
| Inner grid flush to 1280 max-width | Added `padding: 0 24px` to `.hero > div` to mirror source's `.wrap` |
| Lede margin `0 0 24` | `18px 0 28px` (matches source) |
| KPI margin-top 16 | 8 (matches source) |
| `.hero-text > * { margin: 0 0 14px }` blanket overrode source's natural element margins | Removed; eyebrow/h1/lede each have source-specific margins |
| h1 white-space normal (source uses `pre-line` to respect headline line breaks) | Added `white-space: pre-line` |

Commit: `7a58838 fix(hero): 6 source-divergence fixes (button stacking, padding, margins)`

Plus a global button fix that cascades to every button on the site:

| Bug | Fix |
|---|---|
| Button height 43px (line-height 1.25 — overrode body 1.55) | `line-height: 1.55` to inherit body — buttons now 47px matching source |

Commit: `232009a fix(button): line-height 1.25 → 1.55 to match source body inheritance`

#### audience-tabs (home)

| Bug | Fix |
|---|---|
| Section wrapper max-width 1200 + 32px desktop padding (source uses 1280 + 24px) — every block was 96px narrower than source | `main > .section > div { max-width: 1280; padding: 0 24px }` (global) |
| Tab height 108 vs source 74 — EDS auto-wraps cell text in `<p>`, adding 0.8em margins | `.atab-bar .atab p { margin: 0 }` |
| `.atab-panel-paths` had `display: grid` that nested with the inner `<ul>` grid, breaking link widths | Dropped paths grid; `<ul>` is the grid |
| Background only filled the 1200px-constrained wrapper, not the full viewport | Moved background+border to `main > .section.audience-tabs-container` |

Commit: `d61b92c fix(audience-tabs,sections): 4 source-divergence fixes`

#### finder (home)

| Bug | Fix |
|---|---|
| Missing "Tipp: Mehrere Filter kombinieren ist erlaubt." hint span | Added to `finder.js` actions row |
| Actions row was `justify-content: flex-end` (just submit on right); source uses `space-between` (hint left, submit right) | Changed to `space-between`; added `.finder-hint { font-size: 12px; color: var(--color-muted) }` |

Commit: `d34c73a fix(finder): add Tipp hint + space-between actions row`

#### cards (events variant)

| Bug | Fix |
|---|---|
| Outer ul gap 24 (source uses `var(--grid-gap)` = 20) | `.cards.events > ul { gap: 20px }` |
| Date col 64px (source's `.event .date` is `width: 56` flex-none) | 56px in the grid template |
| Boilerplate `.cards .cards-card-body { margin: 16px }` shrunk both cells by 32px each, making body text wrap to extra lines and cards 77px taller than source | `.cards.events ul > li .cards-card-body { margin: 0 }` |

Commit: `7c2c317 fix(cards): events variant matches source date/gap dimensions`

#### head-row (all templates)

No fixes — already matched source. Validated: flex space-between baseline, link primary-deep with arrow, h2 sizing/letter-spacing.

#### list-rows (doctor + fachgebiet + jobs + krankheitsbild + news)

No fixes — already matched source after the global resets. Indicator/title/tag/arrow grid template, font sizes, colors all correct.

#### aside-card (doctor form, krankheitsbild toc, news facts)

No fixes — already matched source. Validated 320px width, sticky position, title 15px uppercase, body 14px muted.

#### meta-strip (doctor, krankheitsbild, news)

| Bug | Fix |
|---|---|
| `.meta-strip` block had its own padding `14px 0` + bg surface that doubled up with the inner `.meta-strip-row`'s padding+borders, pushing vertical space to 28px instead of source's 14px | Removed block-level padding; row owns all spacing |

Commit: `4101571 fix(meta-strip): remove block-level padding, let row own spacing`

#### tabs (fachgebiet sub-nav)

| Bug | Fix |
|---|---|
| Tab height 104 vs source 70 — same auto-`<p>` margin issue as audience-tabs | `.tabs-bar .tab p { margin: 0 }` |

Commit: `c91f0ee fix(tabs): .tab p margin 0 — same auto-p margin issue as audience-tabs`

### Global heading sizes + transforms

Discovered while reviewing the news template's "Medienmitteilungen Archiv" h1 — prototype was rendering at 45px no-transform, source has it inline-styled at 36px sentence case. Investigation revealed all h1-h4 sizes diverged from source:

| Heading | Prototype default | Source | Action |
|---|---|---|---|
| h1 | 45px (desktop) | 41px | Set to 41 + line-height 1.05 + ls 0.4 + uppercase |
| h2 | 36px | 26px | Set to 26 + line-height 1.15 + ls 0.3 + uppercase |
| h3 | 28px | 20px | Set to 20 + line-height 1.25 |
| h4 | 22px | 16px | Set to 16 + line-height 1.35 |

Context-specific overrides:
- `main .section.two-column > .default-content-wrapper h2, h3` — drop uppercase + letter-spacing (source's `.article-body` body-text context)
- `main .section.meta-strip-container > .default-content-wrapper h1` — 36px sentence case at 1.15 line-height (source's news-page inline-styled h1)

Mobile breakpoint added: h1 28px, h2 22px at `<=720px`.

Commit: `ea2e1cd fix(headings): align h1-h4 sizes + transforms with source`

## EDS commits this phase

```
054db2b feat(styles): promote 3 source-aligned global resets
7a58838 fix(hero): 6 source-divergence fixes (button stacking, padding, margins)
232009a fix(button): line-height 1.25 → 1.55 to match source body inheritance
d61b92c fix(audience-tabs,sections): 4 source-divergence fixes
66d4b7d fix(audience-tabs): bump selector specificity to satisfy no-descending-specificity lint
d34c73a fix(finder): add Tipp hint + space-between actions row
7c2c317 fix(cards): events variant matches source date/gap dimensions
4101571 fix(meta-strip): remove block-level padding, let row own spacing
c91f0ee fix(tabs): .tab p margin 0 — same auto-p margin issue as audience-tabs
ea2e1cd fix(headings): align h1-h4 sizes + transforms with source
```

All pushed to the `eds-migration` branch remote.

## Patterns and lessons

### EDS auto-`<p>` wrapping is load-bearing

Two of the per-block fixes (audience-tabs + tabs) hit the same root cause: EDS wraps every cell's text in a `<p>` element during decoration, and the prototype's `p { margin-top: 0.8em; margin-bottom: 0.25em }` default adds ~18px each side. Any block where source uses raw text inside a flex container (tabs, list items, etc.) needs a `block .child p { margin: 0 }` reset. Worth adding to a checklist when porting future blocks.

### Boilerplate cards.css collides with custom variants

The boilerplate ships `.cards .cards-card-body { margin: 16px }` as a default. When we extend `cards` with the `events` variant that uses a 2-col grid, those margins eat 32px of each cell. The variant has to explicitly `margin: 0` to reset. Same risk for any future cards variant.

### Section wrapper width and padding

The prototype's `main > .section > div { max-width: 1200; padding: 0 24/32 }` was 96px narrower than source's `.wrap{max-width:1280;padding:0 24}`. Fixing this globally bumped every block 96px wider. Worth being explicit that the project's content container conforms to the source's, not the boilerplate's default.

### Heading defaults aren't universal

The prototype's heading variables (`--heading-font-size-xxl: 45px` etc.) were the boilerplate's design-system defaults, not Variant C's. Source uses smaller, source-keyed sizes. When migrating a project, h1-h4 sizes deserve a strict review against the source's CSS — they're not "just defaults that work".

## What's still NOT 1:1 (acceptable / documented)

- **Tab heights**: 78px (source 70px) — 8px diff probably from minor line-height interactions. Acceptable.
- **Interactive behavior**: doctor form submit, finder search, audience-tab panel switching, tab panel content swap — all visual-only per ADR-0002.
- **Mobile (375px) validation**: still pending — all phases validated at 1200/1440 only.

## Phase 11.1 addendum — breadcrumb closed (2026-05-22)

ADR-0002 deferred the breadcrumb; ADR-0005 kept it out of scope when header/footer were brought in. After this phase's section-styling pass made the chrome 1:1, the missing breadcrumb was the last visible gap. Added it as JS-derived chrome inside `header.js` (option B from the user's choice between authored-content / JS-derived / static-fragment approaches).

Implementation:
- `CRUMB_SECTIONS` map in `header.js` covers 5 path prefixes (`/de/corporate/{aerzte,fachgebiete,krankheitsbilder,medien-und-news,jobs-und-karriere}`) → section labels
- `buildBreadcrumb()` reads `window.location.pathname` + `main h1`, returns `null` for home
- Crumb is appended as a child of `<header>` (sibling of `.header-wrapper`), sitting below the sticky `.header.block` and scrolling naturally with content
- CSS in `blocks/header/header.css` scoped to `header > nav.crumb` to mirror source styling exactly

Trade-offs (documented in commit `8314af6` and ADR-0005's authorability/fidelity trade):
- Section labels live in code, not authorable
- Section-link hrefs target `/de/corporate/{section}` paths that 404 since we only migrated content pages, not parent listing pages — visually correct, navigationally incomplete

Commits: `8314af6` (initial), `0a02c0e` `b0efdb2` `1cf499f` (lint specificity fixes).

## Validation URLs

- https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/ (home)
- https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/de/corporate/aerzte/1/docteur-christian-jaccard (doctor)
- https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/de/corporate/fachgebiete/akupunktur-traditionelle-chinesische-medizin (fachgebiet)
- https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/de/corporate/krankheitsbilder/angina-pectoris (krankheitsbild)
- https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/de/corporate/medien-und-news/medienmitteilungen-und-news/archiv (news)

Audit screenshots in `audit/phase-11/`.

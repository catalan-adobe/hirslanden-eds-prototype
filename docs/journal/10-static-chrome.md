# Phase 10 — Static header/footer fragments

**Dates:** 2026-05-21
**Status:** complete — pixel-perfect at 1440px after 10.1 audit
**Goal:** Lift the header and footer out of ADR-0002's "out of scope" bucket by adopting the snowflake skill's static-fragment pattern. Trade authorability for visual fidelity, since EDS theme work is not the current focus.

## Summary

The snowflake skill (`~/.claude/skills/snowflake`) describes a full static-to-EDS overlay flow — preserve the source DOM, surface only text/images as authorable. Its full substrate is overkill for this project (our pages are already authored as EDS blocks), but the **header/footer-as-static-fragment** sub-pattern is exactly what we need.

Adapted that sub-pattern in isolation:
- Two header fragments (`header.html` for 289 non-home pages, `header-home.html` for `/` — only the "Jobs" link target differs)
- One footer fragment (verified byte-identical across home + 4 non-home templates, modulo whitespace)
- Block decorators reduced to fetch-and-inject (snowflake substrate baseline) — minus the `main.dataset.overlay` indirection (we have one site-wide chrome, not per-template)
- Header/footer CSS lifted from the source's inline `<style>` and scoped under `.header.block` / `.footer.block`
- Boilerplate `header { height: var(--nav-height) }` rule dropped — our chrome is taller (utility strip + nav) than the boilerplate's 64px assumption

aria-current="page" on the active nav item is lost (one fragment can't carry per-page state); the source doesn't style it, so zero visual loss. The hamburger toggle moved from inline `onclick` to a `block.querySelector` listener inside `header.js` for CSP safety.

## What happened

1. **Read the snowflake bundle** at `~/.claude/skills/snowflake/` — confirmed the relevant slice is `substrate/blocks/header/header.{js,css}` + `substrate/blocks/footer/footer.{js,css}` + the `/fragments/<template>/header.html` convention from `knowledge/architecture.md`.

2. **Scoped down the snowflake pattern** to our case. Differences:
   - We don't need `main.dataset.overlay` — one chrome serves all pages
   - We don't need `/fragments/<template>/` indirection — fragments live at `/fragments/{header,footer}.html`
   - Header.css lives at `blocks/header/header.css` (not `/styles/<template>.css`) — matches our existing block-CSS convention
   - No `install-substrate.mjs` run — that would also rewire `scripts/scripts.js` to the overlay engine, which conflicts with our authored-content model

3. **Confirmed scope with the user** via two questions:
   - Per-page header variations → "Two fragments: home + non-home" (restores the Jobs link variant on home; aria-current still lost)
   - Breadcrumb → "Defer — keep ADR-0002" (per-page content, not chrome)

4. **Verified footer uniformity.** Diff across home + 3 non-home templates: pure whitespace differences (indentation, line breaks). Same DOM. One footer fragment suffices.

5. **Verified design tokens.** The source's `--fs-12` and `--fs-13` tokens are not defined in our `styles.css`, but `--color-border`, `--color-surface`, `--color-muted`, `--color-text`, `--color-primary-deep` all are. Matched the prototype's existing convention (inline literal `px` values for `--fs-*` use sites) rather than introducing new tokens.

6. **Wrote the fragments** at `hirslanden-eds-prototype/fragments/{header,header-home,footer}.html`. Markup is verbatim from the source, minus the outer `<header>`/`<footer>` tag (the EDS block element provides one) and minus `aria-current="page"` on the active nav item.

7. **Replaced the block decorators.** The boilerplate's `blocks/header/header.js` (171 lines of DA-nav decoration + hamburger keyboard handling) and `blocks/footer/footer.js` (DA-fragment loader) collapse to 24 + 13 lines. The hamburger toggle was preserved as a JS event listener.

8. **Replaced the block CSS.** The boilerplate's `blocks/header/header.css` (273 lines targeting `header nav .nav-sections .nav-drop`, etc.) is now entirely the source's header rules scoped under `.header.block`. Same swap for `blocks/footer/footer.css`.

9. **Dropped `header { height: var(--nav-height) }` from styles.css.** That rule capped the EDS `<header>` element to 64px — fine for the boilerplate's single-row nav, fatal for ours (32px utility strip + 66px nav = 98px content). Replaced with a comment explaining why; visibility-during-load rules kept.

10. **Lint adventures.** Stylelint flagged `media-feature-range-notation` (`(max-width: 820px)` → `(width <= 820px)`); auto-fix took care of it but also escaped `<` in the leading docstring comment to `\3c `. Reworded the comments to drop the angle brackets.

11. **Visual validation at 1440px.** Side-by-side at `127.0.0.1:8080/index.html` vs branch preview `/` and `127.0.0.1:8080/de__corporate__aerzte__1__docteur-christian-jaccard.html` vs branch preview `/de/corporate/aerzte/1/docteur-christian-jaccard`. Header utility strip, nav layout, sticky positioning, logo sizing, search-circle — all match. Footer dark background, 5-column grid, brand block + 4 link columns, copyright row — all match. Confirmed the Jobs link variant: home uses `/de/corporate/jobs-und-karriere.html`, non-home uses `/de/corporate/jobs-und-karriere/karrierepfade.html`.

## EDS commits this phase

```
d1128e8 feat(chrome): static header/footer fragments per snowflake pattern
```

Pushed to the `eds-migration` branch remote.

## What's NOT 1:1 (documented losses)

- **`aria-current="page"` on the active nav item.** Source set it per-page; a static fragment can't. Source has no CSS targeting `[aria-current]`, so zero visual loss.
- **`onclick` inline hamburger handler.** Replaced with `addEventListener` in `header.js`. Functionally identical, CSP-safe.

## Out-of-scope per user direction

- **Authorability of header/footer content.** Snowflake's overlay model surfaces text/image as DA-authored slots; we took only the static-fragment slice. If a future iteration needs authorability, the snowflake `[data-slot]` pattern is the path.
- **Breadcrumb** (`<nav class="crumb">` on 289 of 290 pages). Per-page content, deferred per ADR-0002. Next iteration's call.
- **Mobile (375px) validation.** Inherited open thread from Phase 06/07/09 — still pending.

## Discoveries

- **The boilerplate's `header { height: var(--nav-height) }` is silently destructive when the chrome is taller than the assumed 64px.** Removed and replaced with a comment. Worth flagging if any future iteration drops back a single-row nav and forgets to restore the rule.
- **EDS block-status visibility gate works for static fragments too.** `header .header[data-block-status="loaded"]` toggles `visibility:visible` once the block JS completes, including our fragment fetch + innerHTML write — no FOUC.
- **`blocks/fragment/fragment.js` stays — it's not dead code.** The original header/footer imports were two of its callers, but `scripts/scripts.js` (boilerplate's `buildAutoBlocks`) also dynamic-imports it to auto-load any `<a href="/fragments/...">` link found in authored content. Worth flagging: our static fragment paths (`/fragments/header.html`, `/fragments/footer.html`) collide with the boilerplate's authored-fragment convention. If a future migration ever emits an author-style fragment link, the boilerplate would try to inline it. Not a concern with our current content but a sharp edge to watch.

## Validation URLs

- https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/ (home variant)
- https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/de/corporate/aerzte/1/docteur-christian-jaccard (non-home variant)

Audit screenshots at `audit/phase-10/`.

## Phase 10.1 — strict 1:1 audit after initial validation

User reviewed the first push and reported "really close to original ones but not yet 1:1". Per the strict fidelity bar I went element-by-element with `getComputedStyle` and `offsetHeight` instead of trusting screenshots. Four discrete bugs surfaced and got fixed:

| # | Symptom | Root cause | Fix | Commit |
|---|---|---|---|---|
| 1 | Search circle 39×39 (should be 36×36); footer grid columns 50px wider; element heights +1px across the chrome | Source has global `*{box-sizing:border-box}` (line 25 of inline style); prototype only applies border-box to buttons | Scope `box-sizing: border-box` to `.header.block *` and `.footer.block *` | `35cae2e` |
| 2 | Utility 37 vs 36, f-brand paragraph 62 vs 60, grid 155 vs 146 — all 1-2px taller per text line | Source `body { line-height: 1.55 }`, prototype `body { line-height: 1.6 }`; chrome inherits the body value | Apply `line-height: 1.55` to chrome blocks. *Initial attempt set it on the block element only — h5 still showed 16px because the prototype's element-level `h5 { line-height: 1.25 }` won the cascade. Final form applies per-descendant via `.header.block *, .footer.block *`* | `e9820cf` → `2ce6fd3` |
| 3 | CSS comment `/* …h*/p rules… */` terminated early at `*/`, breaking stylelint with 37 parse errors | Trivial — `*/` inside the comment closed it | Reword to "h-tag and p" | `2ce6fd3` |
| 4 | Footer brand `.logo-w` container 56px instead of 34px (still 5-6px off after fixes 1–2) | Source has global `img { max-width: 100%; display: block }` (line 31); prototype has no such rule, so inline image inherits the 21.7px line-box and adds a baseline descender below the 34px logo | Scope `img { max-width: 100%; display: block }` to `.header.block img` and `.footer.block img` | `df455b2` |

### Post-fix measurements (1440px)

| Property | Original | Migrated |
|---|---|---|
| Header total | 103px | 103px ✓ |
| Utility / Nav / Logo | 36 / 66 / 38 | 36 / 66 / 38 ✓ |
| Search circle | 36×36 | 36×36 ✓ |
| Footer total | 316px | 316px ✓ |
| Grid / Brand col / Brand logo | 146 / 286 / 34 | 146 / 286 / 34 ✓ |
| h5 height / line-height | 20 / 20.15px | 20 / 20.15px ✓ |
| f-brand paragraph | 60px (3 lines × 20.15) | 60px ✓ |

Final screenshots: `audit/phase-10/migrated-*-v2.png`.

### Lessons

- "Visually close" lied. The screenshot review missed all four bugs because they were ±3px in stable layouts — invisible to the naked eye but real. Computed-style/`offsetHeight` measurement was the only way to catch them.
- The source's three global resets (`*{box-sizing:border-box}`, `body{line-height:1.55}`, `img{max-width:100%;display:block}`) are load-bearing. Every block we port from the source assumes them. Phase 09's content blocks may have the same cascading-default gaps — worth re-auditing the rest of the site with the same getComputedStyle methodology.
- Element-level selectors (`h5 { line-height: 1.25 }`) shadow block-level rules of the same effective specificity. When porting source CSS that relies on body-level inheritance, the safe pattern is `.block, .block * { property: value }` — not `.block { property: value }`.

### Phase 10.1 commits

```
35cae2e fix(chrome): scope box-sizing:border-box reset to header/footer blocks
e9820cf fix(chrome): line-height 1.55 to match source body metrics
365d3f0 fix(chrome): apply line-height:1.55 to chrome descendants  (broken CSS comment)
2ce6fd3 fix(chrome): avoid */p sequence in CSS comment
df455b2 fix(chrome): img{display:block} scoped to chrome to collapse baseline gap
```

All pushed to the `eds-migration` branch.

## Related

- Source pattern: `~/.claude/skills/snowflake/SKILL.md`, `knowledge/architecture.md`, `substrate/blocks/{header,footer}/`
- Supersedes the "header / footer / breadcrumb chrome" entry under ADR-0002's out-of-scope list (header + footer only; breadcrumb still out)

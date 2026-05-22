# EDS boilerplate + Block Collection inventory

**Date:** 2026-05-21
**Source:** `ls blocks/` in the freshly cloned `hirslanden-eds-prototype` repo (from `adobe/aem-boilerplate` template); HTTP probes against the live AEM Block Collection at `main--aem-block-collection--adobe.aem.live`.

## Finding

The fresh EDS boilerplate ships with 6 blocks. The AEM Block Collection adds 6+ canonical, vetted blocks reachable via URL probe. Cross-referencing both against the 7-custom block plan from [eds-block-mapping](./eds-block-mapping.md) potentially reduces the custom-authoring scope: `tabs` exists canonically in Block Collection; `search` may serve as a substrate for `finder` with a custom variant.

## Evidence

### Blocks shipped with `adobe/aem-boilerplate`

| Block | Reuse status |
|---|---|
| `cards` | ✅ Reuse — matches home page `schwerpunkte` + `events` grids (with possible `events` variant for date-prefixed cards) |
| `columns` | ⚠️ Evaluate — could substitute for our planned `two-column` section style |
| `fragment` | ⚠️ Available — useful if we extract reusable content like the Healthline CTA |
| `header` | ❌ Out of scope (header excluded from this migration) |
| `footer` | ❌ Out of scope (footer excluded) |
| `hero` | ✅ Customized — boilerplate's hero is too basic (background image + h1 only); we replaced with the Variant C split-layout version in Phase 04 |

### Blocks in the AEM Block Collection

Probed at `https://main--aem-block-collection--adobe.aem.live/block-collection/<block>`. All returned HTTP 200.

| Block | Status | Use case |
|---|---|---|
| `tabs` | ✅ Adoptable | Direct match for our `fachgebiet` 5-tab sub-navigation (Krankheitsbilder · Behandlungen · Zentren · Forschung · Ärzteschaft). Content model: each row = one tab (name \| content). |
| `search` | ⚠️ Evaluate | Possible substrate for the home `finder` block. Block Collection's search is simpler than our finder's multi-tab form with region/specialty/insurance filters — likely needs a custom variant or full custom replacement. |
| `accordion` | — | Not currently mapped to any template. Could be useful if a future template needs collapsible Q&A. |
| `quote` | — | Not in the 6 templates' content patterns. |
| `cards` | (already in boilerplate) | — |
| `carousel` | — | Not in any current template; Variant C explicitly avoids rotating banners (per `home-improvements.md`). |

### Block code reuse impact on the original plan

| Block (planned) | Original status | Updated status |
|---|---|---|
| `hero` | Customize boilerplate | ✅ Done (Phase 04 pilot) |
| `list-rows` | Custom | Custom (still required — no Block Collection match) |
| `aside-card` | Custom (3 variants) | Custom (still required) |
| `meta-strip` | Custom | Custom (still required) |
| `tabs` | Custom | ⚠️ Likely adoptable from Block Collection — validate before authoring |
| `audience-tabs` | Custom | Custom (home-specific composite — unlikely match) |
| `finder` | Custom | ⚠️ Possibly extendable from Block Collection `search` — validate complexity match |
| `cards` | Block Collection reuse | ✅ Confirmed in boilerplate already |

## Implications

- **Custom block count likely drops from 7 to 5** if `tabs` adoption holds up: `list-rows`, `aside-card`, `meta-strip`, `audience-tabs`, plus a custom `finder` (if Block Collection's `search` is too narrow). Phase 04 effort estimate down by ~15%.
- **`columns` is a real choice point.** EDS-canonical pattern is to use section metadata + `columns` block for two-column layouts. Our plan called for a `two-column` section style. Either approach can serve; using `columns` is more idiomatic if it works for the doctor / krankheitsbild / news article+aside layouts.
- **No `kpi-strip` exists** in either inventory. It will be a fully custom block (or get folded into `hero` as extra rows).

## Related

- [discoveries/eds-block-mapping](./eds-block-mapping.md) — the original 7-custom plan from Phase 02
- [journal/04 — Block library](../journal/04-block-library.md) — the phase where this inventory was used and the hero pilot was authored
- AEM Block Collection live: https://main--aem-block-collection--adobe.aem.live/

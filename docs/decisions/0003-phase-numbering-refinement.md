# 0003 — Phase numbering refinement (bootstrap split from block library)

**Status:** Accepted
**Date:** 2026-05-21
**Supersedes:** — (refines [0002](./0002-eds-migration-approach.md) without changing the chosen approach)

## Context

[ADR 0002](./0002-eds-migration-approach.md) defined three implementation phases under the template-recipe-driven approach:

- Phase 03 — Block library (bootstrap + author 7 custom blocks)
- Phase 04 — Template pilots
- Phase 05 — Bulk emission

When Phase 03 actually kicked off, the bootstrap step turned out to be a sizeable workstream on its own — the `create-site` skill is a 7-step external flow (GitHub repo creation, GitHub App install, Adobe IMS auth, DA content writes, preview triggers) with human-action gates inside it. Bundling that with 7 custom-block authorings made for an unreviewable phase boundary.

## Options considered

| Option | Tradeoff |
|---|---|
| Keep 03 = bootstrap + blocks as originally planned | Single phase, simpler numbering; but unreviewable — one phase containing both external setup and ~7 internal authoring tasks. |
| **Split into 03 = bootstrap, 04 = blocks, 05 = pilots, 06 = bulk emission** (chosen) | Cleaner gates; each phase has one deliverable. Costs one extra journal/ADR pair. Renumbers downstream phases. |
| Make the block library a "phase 03.x" sub-phase scheme | Avoids renumbering but introduces a non-sequential pattern this docs system has no convention for. |

## Decision

**Split as follows:**

| Phase | Goal | Output |
|---|---|---|
| 03 | EDS project bootstrap | Live preview URL; DA wired; empty boilerplate site running |
| 04 | Block library | 7 custom blocks authored + tested in the EDS project |
| 05 | Template pilots | One EDS-import HTML per template (6 total) generated via `page-import` |
| 06 | Bulk emission | 284 remaining pages emitted as EDS-import HTML and uploaded to DA |

Phase 03 has already executed under this numbering (journal entry [03](../journal/03-eds-project-bootstrap.md)).

## Consequences

**Easier:**
- Each phase has a single clear deliverable, easier to review and gate.
- Phase 03's "live preview URL" is a concrete success signal independent of any block authoring.

**Harder:**
- Future references back to [ADR 0002](./0002-eds-migration-approach.md) need to remember its phase numbering predated this refinement.
- One extra ADR + journal entry to maintain (this one).

## Notes

This refinement does not change the strategic choice in [0002](./0002-eds-migration-approach.md) — Approach A (template-recipe driven) remains the chosen approach. Only the phase boundaries shift. If a future decision actually changes the approach, that would require superseding 0002.

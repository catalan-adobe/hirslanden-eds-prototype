# 0001 — Documentation system

**Status:** Accepted
**Date:** 2026-05-21
**Supersedes:** —

## Context

This repo is a migration prototype for hirslanden.ch. The root-level docs (`README.md`, `PRODUCT.md`, `DESIGN.md`, `DESIGN.json`) are `_provenance`-tagged outputs of an earlier `stardust:direct` pass — they describe the target state of the artifact, not the activity that builds it. Continued work on the repo (analysis, decisions, next migration phase) had no home.

We needed a place to capture three different kinds of information that have so far only lived in conversation transcripts:

1. **Chronology** — what we did, in what order, and why.
2. **Decisions** — non-obvious choices we locked in, with the alternatives we ruled out.
3. **Discoveries** — things we learned about the existing artifact or external systems.

## Options considered

| Option | Tradeoff |
|---|---|
| Single chronological journal | Easy to start, hard to reference. Decisions and findings get buried in narrative. |
| Decision log + discoveries doc only (no chronology) | Strong for reference; loses the "how did we get here" thread that helps when resuming work. |
| Single living analysis file | One file to maintain; collapses three concerns into one, becomes a grab-bag over time. |
| **All three, layered** (chosen) | Three lightweight tracks. Each has one clear purpose. Matches how the existing `_provenance`-tagged docs already separate concerns. Costs more discipline than a single file. |

## Decision

Three parallel tracks under `docs/`:

```
docs/
├── README.md          ← index + this how-to
├── journal/           ← chronological, one file per phase
├── decisions/         ← ADRs, zero-padded sequential
└── discoveries/       ← topical findings, slug-named
```

### Conventions

- **Journal files** are numbered sequentially by phase/milestone (`01-html-structure-audit.md`, `02-…`), not by date. One phase = one file; a phase can span multiple days, and multiple phases can be in flight at once. Filename uses kebab-case slug.
- **Decisions** are zero-padded 4-digit (`0001-…`, `0002-…`). Never renumbered, never deleted. Superseded ADRs keep a `Supersedes:` / `Superseded by:` line; status changes from `Accepted` to `Superseded`.
- **Discoveries** use slug-only filenames (`site-template-structure.md`). Keyed by topic — duplicates are merged, not appended.
- **Cross-links** are relative paths (e.g. `../discoveries/site-template-structure.md`) so the tree stays portable.
- **`docs/README.md`** is the index — every new file gets a one-line entry under the appropriate section.
- **Commits** for documentation use a `docs: …` prefix so `git log -- docs/` is a usable second-layer journal.

### File shapes

**Journal entry** — `docs/journal/NN-slug.md`
```
# Phase NN — <Title>

**Dates:** YYYY-MM-DD[ – YYYY-MM-DD]
**Status:** in progress | complete
**Goal:** one sentence.

## Summary
2–4 sentences.

## What happened
- Chronological bullets. Link to decisions/discoveries when relevant.

## Discoveries
- [<Topic>](../discoveries/<slug>.md)

## Decisions
- [NNNN — <Title>](../decisions/NNNN-slug.md)

## Open threads / next steps
- …
```

**Decision** — `docs/decisions/NNNN-slug.md`
```
# NNNN — <Title>

**Status:** Accepted | Superseded
**Date:** YYYY-MM-DD
**Supersedes:** — | NNNN

## Context
The situation that forced the choice.

## Options considered
| Option | Tradeoff |

## Decision
What we picked.

## Consequences
What becomes easier / harder.
```

**Discovery** — `docs/discoveries/<slug>.md`
```
# <Topic>

**Date:** YYYY-MM-DD
**Source:** how we verified.

## Finding
The claim, stated plainly.

## Evidence
Numbers, hashes, file lists, commands.

## Implications
What this lets us assume going forward.

## Related
- journal/decision links.
```

## Consequences

**Easier:**
- Resuming work after a break — read the latest journal entry, scan recent decisions.
- Justifying choices later — every non-obvious decision has a written `Context · Options · Decision · Consequences`.
- Sharing context with collaborators or future agents — three small typed surfaces beat one large prose dump.

**Harder:**
- Requires discipline to log as we go, not after the fact.
- Three files to maintain per significant change instead of one.
- Index file (`docs/README.md`) must be updated alongside new entries.

## Notes on backfill

We agreed to retroactively document the work that happened earlier in this session (the HTML structural audit of `site/`) before this ADR was accepted. That backfill produces:

- `journal/01-html-structure-audit.md`
- `discoveries/site-template-structure.md`

Both reference this ADR as the system under which they were written.

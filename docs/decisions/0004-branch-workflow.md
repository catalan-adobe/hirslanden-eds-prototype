# 0004 — Branch workflow and explicit-push policy

**Status:** Accepted
**Date:** 2026-05-21
**Supersedes:** —

## Context

Mid-Phase-03, after three commits had already landed on `main` locally (`docs: bootstrap documentation system`, `docs: phase 02 EDS migration evaluation`, `chore: vendor EDS skills under .agents/`), the user introduced a workflow rule:

> "Do not push anything, let's please switch to a branch from now on."

None of the three commits had been pushed to a remote. The instruction is forward-looking, not retroactive cleanup. We needed to codify the rule somewhere the repo can carry it — memory and in-line journal notes don't travel with the codebase.

## Options considered

| Option | Tradeoff |
|---|---|
| **Feature branches + explicit pushes** *(chosen)* | Standard, low-friction; `main` stays mergeable; PRs gate review; matches typical OSS / multi-collaborator workflows. |
| Continue committing to `main` locally, never push | Simpler in the short term but loses the safety net of a non-shared working branch; one mis-typed `git push` overwrites shared state. |
| Feature branches with auto-push to remote | Better for real-time collaboration but reintroduces the very behavior the user wants to avoid. |

## Decision

- **All new commits go on a feature branch**, not directly to `main`.
- **Never run `git push`** (or `gh pr create`, or any other remote-modifying git operation) without an explicit user instruction in the current conversation.
- The currently active branch for ongoing migration work is `eds-migration`.
- The three earlier commits on `main` (8773f82, 6af5afa, 97a0562) stay where they are — "from now on" applies forward, and they're not pushed anywhere.

The rule applies to `migrate-hirslanden` itself. The branch policy for the new `hirslanden-eds-prototype` repo (created in Phase 03) is a separate question deferred to Phase 04 kickoff.

## Consequences

**Easier:**
- `main` stays clean and PR-mergeable.
- Explicit gates before any remote visibility — fewer accidental publishes.
- Branch name becomes a quick scope-of-work signal in `git status`.

**Harder:**
- One more step at the start of any new piece of work — remember to branch.
- `main` can drift from active work if the branch lives long; needs periodic rebases or merges.

## Notes

External remote actions taken on behalf of `create-site` (creating the `hirslanden-eds-prototype` GitHub repo, writing to DA) are explicitly out of scope for this policy — those were direct user-approved actions inside the create-site flow, not implicit pushes from `migrate-hirslanden`.

Related conventions already codified in [0001 §Conventions](./0001-documentation-system.md): docs commits use a `docs:` prefix; each new doc entry is its own commit.

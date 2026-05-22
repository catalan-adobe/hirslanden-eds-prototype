# 0006 — Repo split: docs+audit live in the EDS repo, migration scripts stay in the source repo

**Status:** Accepted
**Date:** 2026-05-22
**Supersedes:** —
**Amends:** [0001 — Documentation system](0001-documentation-system.md) (the doc tree now lives in a different repo than the one ADR-0001 was written in)

## Context

When the documentation system was first set up (ADR-0001), everything lived in `migrate-hirslanden`:

```
migrate-hirslanden/
  site/*.html               # 290 source pages
  migrate-to-eds.mjs        # migration script
  migrate-bulk.mjs          # bulk runner
  post-bulk.mjs             # DA POST + preview
  eds-out/bulk/*.html       # 290 generated EDS-import HTML
  docs/{journal,decisions,discoveries}
  docs/SHOWCASE.md
  docs/showcase/index.html  # the engaging HTML showcase
  audit/side-by-side/*.png  # 12 review screenshots
  audit/phase-{10,11}/*.png
```

After the showcase HTML was built, we wanted it publicly accessible so reviewers could open it from a URL. Two paths to that:

1. Deploy the `migrate-hirslanden/docs/showcase/` folder somewhere (Netlify drop, S3, GitHub Pages on the source repo).
2. Move it into the EDS repo (`hirslanden-eds-prototype`), where **aem-code-sync auto-deploys any HTML file** in the code bus to the branch preview at `https://<branch>--<repo>--<owner>.aem.page/`.

Option 2 is free, instant, and gives us a stable URL — but means splitting the project across two repos by content type.

## Options considered

### A · Move docs+audit to EDS repo, migration scripts stay in source repo *(chosen)*

- `hirslanden-eds-prototype/docs/` — journals, ADRs, discoveries, SHOWCASE.md, showcase/index.html, showcase/pages.html
- `hirslanden-eds-prototype/audit/` — side-by-side review images, phase-10/-11 raw screenshots
- `migrate-hirslanden/` — keeps `site/`, `migrate-*.mjs`, `eds-out/bulk/`, `.agents/skills/`, and a forwarding-stub `docs/README.md` pointing at the EDS repo

✅ Showcase auto-deploys to `/docs/showcase/index.html` on the branch preview — zero extra infra
✅ Side-by-side PNGs served at `/audit/side-by-side/*` for free
✅ Reviewers get a single URL to share
✅ All review artifacts co-located with the code they describe
❌ Markdown files (`*.md`) are in `.hlxignore` so they're in the repo but not web-served — internal cross-links need GitHub URLs (`github.com/.../blob/...`) instead of relative paths
❌ Two-repo split adds a small navigation cost — `docs/README.md` in migrate-hirslanden becomes a forwarding pointer

### B · Move everything to the EDS repo

Move `site/`, `migrate-*.mjs`, `eds-out/`, AND docs/audit all into the EDS repo.

❌ Pollutes the EDS prototype with source content (290 static HTML files) and build tooling that has no role in EDS delivery
❌ Mixes "what gets deployed" with "what got migrated from" — confusing for anyone reading the EDS repo
❌ The `eds-out/bulk/` directory would conflict with EDS's own routing if filenames overlap

### C · Keep everything in migrate-hirslanden, deploy showcase separately

Stand up a Netlify drop, S3 bucket, or GitHub Pages site for `migrate-hirslanden/docs/showcase/`.

❌ Extra infra to set up and maintain
❌ Separate URL from the migrated content's URL — reviewers have two domains to remember
❌ No content-bus benefits (image optimization, CDN, branch previews)

## Decision

**Adopt Option A.** Move docs + audit to the EDS repo so they auto-deploy via aem-code-sync. Migration scripts (`migrate-to-eds.mjs`, `migrate-bulk.mjs`, `post-bulk.mjs`), source content (`site/`), and generated EDS-import HTML (`eds-out/bulk/`) stay in `migrate-hirslanden` — they're build tools and intermediate artifacts, not deliverables.

## Consequences

- **Showcase lives at** `https://eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/docs/showcase/index.html` — auto-deployed, no manual step.
- **Side-by-side PNGs** at `/audit/side-by-side/sbs-*.png` — also free to serve.
- **Markdown cross-links inside the showcase HTML** use GitHub blob URLs (`github.com/catalan-adobe/hirslanden-eds-prototype/blob/eds-migration/docs/...`) instead of relative `.md` paths, since `.hlxignore` excludes `*.md` from EDS routing. GitHub renders the markdown nicely so the UX is fine.
- **`migrate-hirslanden/docs/README.md`** becomes a brief forwarding stub pointing at the EDS repo as the canonical docs location.
- **`migrate-hirslanden` branch `eds-migration`** carries the cleanup commit (docs+audit deletions + forwarding stub) but stays **local-only** per [ADR-0004](0004-branch-workflow.md). The EDS repo is the canonical artifact going forward.
- **Migration script changes** (if any) still go in `migrate-hirslanden`. The split means a contributor touching both layers needs two clones — acceptable for the scale of this prototype.
- **Future migrations** can adopt the same split: put the source content + tooling in one repo, the EDS target + docs/audit in another. Or, for simpler projects, keep everything in the EDS repo (Option B's tradeoffs are smaller for greenfield work without 290 pages of source HTML).

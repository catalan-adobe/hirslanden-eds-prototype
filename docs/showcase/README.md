# Engaging showcase — single-file HTML landing page

Self-contained scrollytelling landing page for the Hirslanden EDS migration. Designed for sharing with stakeholders, embedding in a slack thread, or running on a screen as a demo backdrop.

## Files

- **`index.html`** — the landing page (one file, no build, no dependencies)
- **`sbs-{home,doctor,fachgebiet,krankheitsbild,news,jobs}.jpg`** — 6 optimized side-by-side comparison thumbnails (~100-330 KB each, derived from the master PNGs in `../audit/side-by-side/`)
- **`README.md`** — this file

Total folder weight: ~1.2 MB.

## How to view

### Locally (recommended)

```bash
cd docs/showcase
python3 -m http.server 8766
# then open http://localhost:8766/
```

Or with `npx`:

```bash
npx serve docs/showcase
```

### Distributing

Three options:

1. **Zip the folder and share** — recipients unzip and open `index.html` via a local server (file:// works in most browsers but breaks the image fetch on some — recommend the local-server route).
2. **Drop into the EDS preview** — the page is a normal static HTML+CSS+JS site; can be hosted anywhere (Netlify drop, Vercel, GitHub Pages, Cloudflare Pages, internal S3 bucket).
3. **Screenshot a section** — for a slack post or a slide, each section of the page is screenshot-friendly at 1440px wide.

## Design notes

- Uses the Hirslanden **Variant C design tokens** directly — `#0094D4` primary, `#534C46` ink, `#27455C` secondary, `#F43A11` accent — so the showcase matches the brand of the site it documents.
- The hero uses a radial gradient + grid mask to feel "Edge Delivery"-flavored without using stock AI imagery.
- Stats count up on scroll (IntersectionObserver, 900ms ease-out cubic).
- SBS cards lift on hover and open in a dark-backdrop lightbox on click.
- Timeline uses a CSS-only vertical line + circle markers.
- Patterns grid is a 3-column responsive layout, 2-col at 980px, 1-col at 560px.
- Footer mirrors the migrated site's footer (dark `#1f1c19` background, white-on-dark links).

## Updating

If the migration evolves and the side-by-side images change, regenerate the JPGs from the master PNGs:

```bash
cd docs/showcase
for src in ../../audit/side-by-side/sbs-*.png; do
  magick "$src" -resize 1400 -quality 85 "$(basename "${src%.png}.jpg")"
done
```

Then edit `index.html` if the metrics or template count change.

## See also

- **`../SHOWCASE.md`** — long-form text version of the same story
- **`../README.md`** — docs index
- **`../journal/`** — per-phase narratives
- **`../../audit/side-by-side/`** — master PNGs + `compose.sh` reproducer

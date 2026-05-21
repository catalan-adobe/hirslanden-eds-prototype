/*
 * Hirslanden Variant C — hero block
 *
 * Content model (authored in DA as a 1-row, 2-cell block):
 *   Cell 1 (text):  eyebrow <p>, <h1>, lede <p>, button <p>s
 *   Cell 2 (image): <picture>
 *
 * Classify the first <p> immediately before the h1 as `.eyebrow`,
 * and the first <p> immediately after the h1 as `.lede`. Buttons are
 * decorated by the boilerplate's scripts.js auto-blocking.
 *
 * Variants (applied via block-name suffix in DA, e.g. "Hero (named)"):
 *   named    → sentence-case H1 at reduced size (doctor names, condition names)
 *   portrait → when image cell is empty, render a Variant C gradient
 *              placeholder with initials derived from the H1
 */
const HONORIFICS = new Set([
  'dr', 'dr.', 'doktor', 'docteur', 'prof', 'prof.', 'professor',
  'med', 'med.', 'dent', 'dent.', 'phd', 'mba', 'fmh', 'sir', 'dame',
]);

const extractInitials = (name) => {
  if (!name) return '';
  // Take first letter of the last two non-honorific tokens.
  const tokens = name.split(/[\s.]+/).filter(Boolean)
    .filter((t) => !HONORIFICS.has(t.toLowerCase()));
  if (tokens.length === 0) return name.charAt(0).toUpperCase();
  const lastTwo = tokens.slice(-2);
  return lastTwo.map((t) => t.charAt(0).toUpperCase()).join('');
};

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const firstRow = rows[0];
  const [textCell, imageCell] = firstRow.children;

  if (textCell) {
    textCell.classList.add('hero-text');
    const children = [...textCell.children];
    const h1Index = children.findIndex((el) => el.tagName === 'H1');

    if (h1Index > 0) {
      const eyebrow = children[h1Index - 1];
      if (eyebrow.tagName === 'P') eyebrow.classList.add('eyebrow');
    }

    if (h1Index >= 0 && h1Index < children.length - 1) {
      const lede = children[h1Index + 1];
      if (lede.tagName === 'P' && !lede.classList.contains('button-container')) {
        lede.classList.add('lede');
      }
    }
  }

  // KPI rows (rows 2..N): each is one (number | label) pair. Build a
  // kpi-strip-grid inside the hero-text column so the KPIs tuck in
  // under the buttons, matching the Variant C source layout.
  if (rows.length > 1 && textCell) {
    const grid = document.createElement('div');
    grid.className = 'hero-kpi';
    rows.slice(1).forEach((kpiRow) => {
      const [numCell, labelCell] = kpiRow.children;
      if (!numCell) return;
      const kpi = document.createElement('div');
      kpi.className = 'hero-kpi-item';
      const n = document.createElement('div');
      n.className = 'hero-kpi-n';
      n.append(...numCell.childNodes);
      kpi.append(n);
      if (labelCell) {
        const l = document.createElement('div');
        l.className = 'hero-kpi-l';
        l.append(...labelCell.childNodes);
        kpi.append(l);
      }
      grid.append(kpi);
    });
    textCell.append(grid);
    // Remove the now-flattened KPI rows from the block.
    rows.slice(1).forEach((r) => r.remove());
  }

  if (imageCell) {
    imageCell.classList.add('hero-image');

    // Portrait variant: when the image cell has no picture, render
    // the Variant C gradient placeholder with initials from the H1.
    if (block.classList.contains('portrait') && !imageCell.querySelector('picture, img')) {
      const h1 = textCell?.querySelector('h1');
      const initials = extractInitials(h1?.textContent);
      imageCell.innerHTML = `
        <div class="hero-portrait">
          <div class="hero-portrait-initials">${initials}</div>
          <div class="hero-portrait-caption">Portrait · Platzhalter</div>
        </div>`;
    }

    // Image caption: if a <small> child of the image cell, render it
    // as an overlaid credit. Authored as a paragraph or small tag.
    const captionEl = imageCell.querySelector('small, p:last-child');
    const captionText = captionEl?.textContent.trim();
    const hasPicture = imageCell.querySelector('picture, img');
    if (hasPicture && captionText && captionText.length < 80) {
      // Avoid swallowing the image's alt-rendered paragraph.
      if (captionEl.tagName === 'SMALL'
          || (captionEl.tagName === 'P' && !captionEl.querySelector('picture, img'))) {
        captionEl.remove();
        const credit = document.createElement('div');
        credit.className = 'hero-image-credit';
        credit.textContent = captionText;
        imageCell.append(credit);
      }
    }
  }
}

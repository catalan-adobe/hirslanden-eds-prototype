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
 */
export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  const [textCell, imageCell] = row.children;

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

  if (imageCell) {
    imageCell.classList.add('hero-image');
  }
}

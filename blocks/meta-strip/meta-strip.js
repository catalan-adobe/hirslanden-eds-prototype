/*
 * Hirslanden Variant C — meta-strip block
 *
 * A thin row below the hero with icon-prefixed key/value items.
 * The last item, if it contains a link, is right-aligned as a CTA.
 *
 * Used by doctor-profile and krankheitsbild templates.
 *
 * Content model (DA: one item per row, single cell):
 *   | Meta Strip |
 *   | 📍 Hirslanden-Klinik |
 *   | 🗣 DE · FR · EN |
 *   | 🩺 Alle Versicherungsklassen |
 *   | [Termin anfragen](#)     ← last row, link-only → right-aligned CTA
 */
export default function decorate(block) {
  const items = [...block.children];
  if (items.length === 0) return;

  const strip = document.createElement('div');
  strip.className = 'meta-strip-row';

  items.forEach((row, idx) => {
    const cell = row.firstElementChild;
    if (!cell) return;
    const item = document.createElement('span');
    item.className = 'meta-strip-item';
    item.append(...cell.childNodes);

    // Last row containing only a link → right-aligned CTA.
    // DA often wraps inline content in a <p>, so check for "exactly one
    // link with no other meaningful text" rather than DOM-shape matching.
    const isLast = idx === items.length - 1;
    const links = item.querySelectorAll('a');
    const onlyLink = links.length === 1
      && item.textContent.trim() === links[0].textContent.trim();
    if (isLast && onlyLink && items.length > 1) {
      item.classList.add('meta-strip-cta');
    }

    strip.append(item);
  });

  block.replaceChildren(strip);
}

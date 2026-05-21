/*
 * Hirslanden Variant C — head-row block
 *
 * The "section heading row" pattern: eyebrow + h2 on the left, an
 * optional "Alle X →" link on the right, baseline-aligned.
 *
 * Used by fachgebiet (Diagnosen A–Z), jobs (Inhalte), home (News &
 * Mitteilungen, Schwerpunkte aktuell, Veranstaltungen, etc.).
 *
 * Content model (DA — 1 row, up to 2 cells):
 *   | Head Row |
 *   | Krankheitsbilder        | [Alle Krankheitsbilder](#) |
 *   | ## Diagnosen A–Z        |                            |
 *
 * The first cell holds the eyebrow paragraph and the h2 (separate
 * lines in DA). The second cell holds the right-aligned link.
 */
export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;
  const [titleCell, linkCell] = row.children;

  if (titleCell) {
    titleCell.classList.add('head-row-title');
    // Classify the first <p> (if it sits before the h2) as the eyebrow.
    const firstP = titleCell.querySelector(':scope > p:first-child, p:first-of-type');
    const h2 = titleCell.querySelector('h2');
    // h2 comes after firstP in document order? compareDocumentPosition
    // returns a bitmask; FOLLOWING (4) is set when h2 is after firstP.
    if (firstP && h2 && (firstP.compareDocumentPosition(h2) >>> 2) % 2 === 1) {
      firstP.classList.add('eyebrow');
    }
  }

  if (linkCell) linkCell.classList.add('head-row-link');
}

/*
 * Hirslanden Variant C — list-rows block
 *
 * Dense horizontal rows for related-content lists. Used by:
 *   - doctor-profile (Bereiche)
 *   - fachgebiet (conditions A–Z)
 *   - jobs-landing (content items)
 *   - home (news)
 *
 * Content model (DA table; one row per item, 3 cells each):
 *   | indicator | title (often a link) | tag |
 *
 * The indicator can be a date, a single letter, a star, or anything
 * short — it's styled as uppercase + tabular-nums + muted.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cells = [...row.children];

    if (cells[0]) {
      cells[0].classList.add('list-rows-indicator');
      li.append(cells[0]);
    }
    if (cells[1]) {
      cells[1].classList.add('list-rows-title');
      li.append(cells[1]);
    }
    if (cells[2]) {
      cells[2].classList.add('list-rows-tag');
      li.append(cells[2]);
    }

    ul.append(li);
  });
  block.replaceChildren(ul);
}

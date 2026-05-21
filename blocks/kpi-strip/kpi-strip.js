/*
 * Hirslanden Variant C — kpi-strip block
 *
 * 4-up strip of (number / label) pairs, used inside every template's
 * hero (or wherever a scale claim needs to be reinforced). Each DA
 * row is one KPI with two cells: the big number on top, the
 * small uppercase label below.
 *
 * Content model:
 *   | KPI Strip |
 *   | 16        | Privatkliniken    |
 *   | 300+      | Kompetenzzentren  |
 *   | 3 000+    | Ärzt:innen        |
 *   | 24/7      | Healthline        |
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const strip = document.createElement('div');
  strip.className = 'kpi-strip-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 1) return;
    const kpi = document.createElement('div');
    kpi.className = 'kpi';

    const num = document.createElement('div');
    num.className = 'kpi-num';
    num.append(...cells[0].childNodes);
    kpi.append(num);

    if (cells[1]) {
      const label = document.createElement('div');
      label.className = 'kpi-label';
      label.append(...cells[1].childNodes);
      kpi.append(label);
    }

    strip.append(kpi);
  });

  block.replaceChildren(strip);
}

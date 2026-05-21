/*
 * Hirslanden Variant C — aside-card block
 *
 * Sticky right-rail card used by doctor-profile (form), krankheitsbild
 * (TOC), and news-article (facts) templates. Variants come from the
 * block-name suffix the author picks in DA:
 *
 *   "Aside Card (toc)"   → table-of-contents list with CTA + footer
 *   "Aside Card (facts)" → key/value definition list
 *   "Aside Card (form)"  → contact form (basic styling for now;
 *                          richer form composition via Block Collection's
 *                          form block is future work)
 *
 * Content model:
 *   - First single-cell row  → title (.aside-card-title)
 *   - Last single-cell row   → footer (.aside-card-footer)
 *   - Facts variant: two-cell rows convert into <dl> with <dt>/<dd>
 *   - Other variants: middle single-cell rows become .aside-card-body
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  if (block.classList.contains('facts')) {
    const dl = document.createElement('dl');
    const titleParts = [];
    const footerParts = [];

    rows.forEach((row, idx) => {
      const cells = [...row.children];
      if (cells.length >= 2) {
        const dt = document.createElement('dt');
        const dd = document.createElement('dd');
        dt.append(...cells[0].childNodes);
        dd.append(...cells[1].childNodes);
        dl.append(dt, dd);
      } else if (cells.length === 1) {
        const bucket = idx === 0 ? titleParts : footerParts;
        bucket.push(cells[0]);
      }
    });

    block.replaceChildren();
    titleParts.forEach((el) => {
      el.classList.add('aside-card-title');
      block.append(el);
    });
    if (dl.children.length > 0) block.append(dl);
    footerParts.forEach((el) => {
      el.classList.add('aside-card-footer');
      block.append(el);
    });
    return;
  }

  // toc / form / default: label first and last single-cell rows.
  rows.forEach((row, idx) => {
    if (row.children.length !== 1) return;
    const cell = row.firstElementChild;
    if (idx === 0) cell.classList.add('aside-card-title');
    else if (idx === rows.length - 1 && rows.length > 1) cell.classList.add('aside-card-footer');
    else cell.classList.add('aside-card-body');
  });

  // Form variant: EDS sanitizes <form>/<input> from authored content,
  // so construct the appointment form in JS. The migration script
  // emits a placeholder row that we replace with the real form.
  if (block.classList.contains('form')) {
    const placeholder = [...block.querySelectorAll('.aside-card-body')]
      .find((el) => /\bIhr Name\b.*Telefon\b.*Anliegen\b/.test(el.textContent));
    if (placeholder) {
      const form = document.createElement('form');
      form.className = 'aside-form';
      form.addEventListener('submit', (e) => e.preventDefault());
      form.innerHTML = '<label><span>Ihr Name</span><input type="text" name="name"></label>'
        + '<label><span>Telefon</span><input type="tel" name="phone"></label>'
        + '<label><span>Anliegen</span><textarea name="message" rows="3"></textarea></label>'
        + '<button type="submit" class="button primary">Anfrage senden</button>';
      placeholder.replaceWith(form);
    }
  }
}

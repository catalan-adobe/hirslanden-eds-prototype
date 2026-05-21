/*
 * Hirslanden Variant C — tabs block (sub-navigation pattern)
 *
 * Used by fachgebiet templates as a horizontal sub-nav with active
 * highlight. Each tab has a primary label and an optional sub-label.
 * Unlike full panel-switching tabs, these tabs route to other pages
 * (or sections) via links — selecting a tab updates the URL, not the
 * surrounding content.
 *
 * Content model (DA: one tab per row, up to 2 cells):
 *   | Tabs |
 *   | [Krankheitsbilder](#)       | A–Z              |  ← first is active
 *   | [Behandlungen](#)           | Therapieformen   |
 *   | [Zentren](#)                | Standorte        |
 *
 * If a tab's label cell contains <strong>X</strong>, that tab is
 * marked active. If no tab is marked, the first tab is active by
 * default.
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  let activeIndex = -1;
  const tabs = rows.map((row, idx) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const subCell = cells[1];

    const button = document.createElement('button');
    button.className = 'tab';
    button.type = 'button';
    button.setAttribute('role', 'tab');

    // Detect "active" marker: <strong> wrapping the label
    const strong = labelCell?.querySelector('strong');
    const labelSource = strong || labelCell;
    if (strong && activeIndex === -1) activeIndex = idx;

    const labelSpan = document.createElement('span');
    labelSpan.className = 'tab-label';
    if (labelSource) labelSpan.append(...labelSource.childNodes);
    button.append(labelSpan);

    if (subCell) {
      const subSpan = document.createElement('span');
      subSpan.className = 'tab-sub';
      subSpan.append(...subCell.childNodes);
      button.append(subSpan);
    }

    return button;
  });

  if (activeIndex === -1) activeIndex = 0;
  tabs[activeIndex]?.classList.add('is-active');
  tabs[activeIndex]?.setAttribute('aria-selected', 'true');

  const bar = document.createElement('div');
  bar.className = 'tabs-bar';
  bar.setAttribute('role', 'tablist');
  bar.append(...tabs);

  block.replaceChildren(bar);
}

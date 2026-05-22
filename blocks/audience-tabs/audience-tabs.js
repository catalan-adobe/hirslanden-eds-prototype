/*
 * Hirslanden Variant C — audience-tabs block (home only)
 *
 * Composite block on the home page: a 4-up audience selector
 * (Patient/Family, Referring physicians, Careers, International) with
 * a panel below showing the active audience's content (label + h3 +
 * lede + CTA + quick-paths grid).
 *
 * Content model (DA):
 *   First N rows: each is a tab — label cell + sub-label cell.
 *     Mark the active tab by wrapping its label in <strong>.
 *   Remaining rows: the panel content for the active audience —
 *     authored as default markdown (label paragraph, h3, lede, button,
 *     list of quick paths).
 *
 * Scope note: this is a prototype. Only the active audience's panel
 * shows; clicking other tabs visually selects them but does not swap
 * panel content. Real per-audience panels are a future enhancement
 * (would require multiple panel blocks composed alongside).
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Tab rows: first cell is label, second is sub-label, both short.
  // Panel rows: everything else.
  const tabRows = [];
  const panelRows = [];
  let stillTabs = true;
  rows.forEach((row) => {
    const cells = [...row.children];
    const looksLikeTab = stillTabs && cells.length === 2
      && cells[0].textContent.trim().length < 60
      && cells[1].textContent.trim().length < 80
      && !cells[0].querySelector('h1, h2, h3, h4, ul, ol, picture');
    if (looksLikeTab) {
      tabRows.push(row);
    } else {
      stillTabs = false;
      panelRows.push(row);
    }
  });

  // Build tab bar
  let activeIndex = -1;
  const tabs = tabRows.map((row, idx) => {
    const [labelCell, subCell] = row.children;
    const strong = labelCell?.querySelector('strong');
    if (strong && activeIndex === -1) activeIndex = idx;

    const button = document.createElement('button');
    button.className = 'atab';
    button.type = 'button';
    button.setAttribute('role', 'tab');

    const label = document.createElement('span');
    label.className = 'atab-label';
    label.append(...(strong || labelCell).childNodes);
    button.append(label);

    if (subCell) {
      const sub = document.createElement('span');
      sub.className = 'atab-sub';
      sub.append(...subCell.childNodes);
      button.append(sub);
    }
    return button;
  });
  if (activeIndex === -1) activeIndex = 0;
  tabs[activeIndex]?.classList.add('is-active');
  tabs[activeIndex]?.setAttribute('aria-selected', 'true');

  // Click handler: visual selection only (no panel swap in this prototype)
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
    });
  });

  const bar = document.createElement('div');
  bar.className = 'atab-bar';
  bar.setAttribute('role', 'tablist');
  bar.append(...tabs);

  // Panel: flatten the remaining rows into a single panel container.
  // Convention: cell 1 of the first panel row is the lead column
  // (label + h3 + lede + button); cell 2 is the quick-paths grid.
  const panel = document.createElement('div');
  panel.className = 'atab-panel';

  if (panelRows.length > 0) {
    const firstPanel = panelRows[0];
    const cells = [...firstPanel.children];

    const lead = document.createElement('div');
    lead.className = 'atab-panel-lead';
    if (cells[0]) lead.append(...cells[0].childNodes);
    panel.append(lead);

    const paths = document.createElement('div');
    paths.className = 'atab-panel-paths';
    if (cells[1]) paths.append(...cells[1].childNodes);
    panel.append(paths);
  }

  block.replaceChildren(bar, panel);
}

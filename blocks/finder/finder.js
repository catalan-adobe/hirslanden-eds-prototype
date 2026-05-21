/*
 * Hirslanden Variant C — finder block (home only)
 *
 * Clinic / doctor / specialty / condition finder. Visually a sticky
 * search card with tabs across the top + a 2x2 grid of input fields +
 * a submit button. On the home page it sits in a dark `bg-secondary`
 * section with a lead-in headline on the left.
 *
 * Content model (DA):
 *   Row 1: lead column for the left-side intro (eyebrow + h2 + lede).
 *   Row 2: tab labels separated by " | " in a single cell, e.g.
 *          "Klinik | Ärztin / Arzt | Fachgebiet | Krankheitsbild"
 *          The first tab is active.
 *   Rows 3+: form fields, two cells per row (label | placeholder).
 *
 * Scope note: prototype only. The form has no submit handler; tab
 * clicks are visual. Real search wiring is a follow-up phase.
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const lead = rows[0];
  const tabRow = rows[1];
  const fieldRows = rows.slice(2);

  // Lead column — flatten the cell so direct children are the content,
  // letting `.finder-lead > p:first-child` style the eyebrow paragraph.
  if (lead) {
    const cell = lead.firstElementChild;
    if (cell) lead.replaceChildren(...cell.childNodes);
    lead.classList.add('finder-lead');
  }

  // Tabs
  const tabsBar = document.createElement('div');
  tabsBar.className = 'finder-tabs';
  tabsBar.setAttribute('role', 'tablist');
  if (tabRow) {
    const tabText = tabRow.textContent.trim();
    const labels = tabText.split('|').map((s) => s.trim()).filter(Boolean);
    labels.forEach((label, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'finder-tab';
      btn.setAttribute('role', 'tab');
      btn.textContent = label;
      if (idx === 0) {
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
      }
      btn.addEventListener('click', () => {
        tabsBar.querySelectorAll('.finder-tab').forEach((t) => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
      });
      tabsBar.append(btn);
    });
  }

  // Form
  const form = document.createElement('form');
  form.className = 'finder-form';
  form.action = '#';
  form.addEventListener('submit', (e) => e.preventDefault());

  const grid = document.createElement('div');
  grid.className = 'finder-grid';

  fieldRows.forEach((row, idx) => {
    const cells = [...row.children];
    if (cells.length < 2) return;
    const labelText = cells[0].textContent.trim();
    const placeholder = cells[1].textContent.trim();

    const field = document.createElement('div');
    field.className = 'finder-field';

    const id = `finder-f-${idx}`;
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = labelText;

    const input = document.createElement('input');
    input.id = id;
    input.type = 'text';
    input.name = labelText.toLowerCase().replace(/\s+/g, '-');
    input.placeholder = placeholder;

    field.append(label, input);
    grid.append(field);
  });

  const actions = document.createElement('div');
  actions.className = 'finder-actions';
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'button primary';
  submit.textContent = 'Suchen';
  actions.append(submit);

  form.append(grid, actions);

  const card = document.createElement('div');
  card.className = 'finder-card';
  card.append(tabsBar, form);

  block.replaceChildren(lead, card);
}

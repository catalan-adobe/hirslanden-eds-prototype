/**
 * Fetches a static header fragment (snowflake skill pattern, simplified
 * for a single site-wide chrome). The home page ("/") uses
 * fragments/header-home.html — same shape, different "Jobs" link target.
 * All other paths use fragments/header.html.
 *
 * The fragment markup mirrors the original site/ HTML byte-for-byte
 * (minus aria-current="page" which can't ride on a static fragment).
 * The hamburger menu toggle is wired here rather than via inline onclick
 * so the markup stays CSP-friendly.
 */
export default async function decorate(block) {
  const isHome = window.location.pathname === '/';
  const name = isHome ? 'header-home.html' : 'header.html';
  const path = `${window.hlx.codeBasePath}/fragments/${name}`;
  const resp = await fetch(path);
  if (!resp.ok) {
    // eslint-disable-next-line no-console
    console.warn(`[header] fragment not found at ${path}`);
    return;
  }
  block.innerHTML = await resp.text();

  const burger = block.querySelector('.ds-nav-burger');
  const list = block.querySelector('#ds-nav-list');
  if (burger && list) {
    burger.addEventListener('click', () => {
      const open = list.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
  }
}

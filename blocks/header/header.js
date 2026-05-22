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
 *
 * Breadcrumb is derived at render time from the URL path + the page's
 * H1. Source has `<nav class="crumb">` on 289 of 290 pages — every
 * non-home page in one of the 5 template families. We append it as a
 * sibling of `.header-wrapper` so it sits inside <header> but outside
 * the sticky block, scrolling naturally with the content.
 */

/* Path segments under /de/corporate/ that get a breadcrumb section
   label. Order doesn't matter — longest-match-first below. */
const CRUMB_SECTIONS = {
  '/de/corporate/aerzte': 'Ärzte',
  '/de/corporate/fachgebiete': 'Fachgebiete',
  '/de/corporate/krankheitsbilder': 'Krankheitsbilder',
  '/de/corporate/medien-und-news': 'Medien & News',
  '/de/corporate/jobs-und-karriere': 'Jobs & Karriere',
};

function buildBreadcrumb() {
  const path = window.location.pathname;
  if (path === '/') return null; // home has no breadcrumb in source
  const sectionPath = Object.keys(CRUMB_SECTIONS)
    .find((key) => path.startsWith(`${key}/`));
  if (!sectionPath) return null;
  const h1 = document.querySelector('main h1')?.textContent.trim();
  if (!h1) return null;

  const nav = document.createElement('nav');
  nav.className = 'crumb';
  nav.setAttribute('aria-label', 'Brotkrumen');
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  const homeLink = document.createElement('a');
  homeLink.href = '/';
  homeLink.textContent = 'Hirslanden';
  const sep1 = document.createElement('span');
  sep1.className = 'sep';
  sep1.textContent = '›';
  const sectionLink = document.createElement('a');
  sectionLink.href = sectionPath;
  sectionLink.textContent = CRUMB_SECTIONS[sectionPath];
  const sep2 = document.createElement('span');
  sep2.className = 'sep';
  sep2.textContent = '›';
  const here = document.createElement('span');
  here.className = 'here';
  here.textContent = h1;
  wrap.append(homeLink, sep1, sectionLink, sep2, here);
  nav.append(wrap);
  return nav;
}

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

  const crumb = buildBreadcrumb();
  if (crumb) {
    const headerEl = block.closest('header');
    if (headerEl) headerEl.append(crumb);
  }
}

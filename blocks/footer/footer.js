/**
 * Fetches the static footer fragment (snowflake skill pattern,
 * simplified for a single site-wide chrome). The fragment markup
 * mirrors the original site/ HTML byte-for-byte.
 */
export default async function decorate(block) {
  const path = `${window.hlx.codeBasePath}/fragments/footer.html`;
  const resp = await fetch(path);
  if (!resp.ok) {
    // eslint-disable-next-line no-console
    console.warn(`[footer] fragment not found at ${path}`);
    return;
  }
  block.innerHTML = await resp.text();
}

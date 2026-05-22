# Side-by-side review images — how to regenerate

Two stages: capture screenshots, then compose them.

## 1. Capture (per template)

For each of the 6 templates, take **two fullpage screenshots at 1440px viewport**: one of the original (127.0.0.1:8080), one of the migrated branch preview.

| Template | Original (127.0.0.1:8080/...) | Migrated (eds-migration--hirslanden-eds-prototype--catalan-adobe.aem.page/...) |
|---|---|---|
| home | `index.html` | `/` |
| doctor | `de__corporate__aerzte__1__docteur-christian-jaccard.html` | `/de/corporate/aerzte/1/docteur-christian-jaccard` |
| fachgebiet | `de__corporate__fachgebiete__akupunktur-traditionelle-chinesische-medizin.html` | `/de/corporate/fachgebiete/akupunktur-traditionelle-chinesische-medizin` |
| krankheitsbild | `de__corporate__krankheitsbilder__angina-pectoris.html` | `/de/corporate/krankheitsbilder/angina-pectoris` |
| news | `de__corporate__medien-und-news__medienmitteilungen-und-news__archiv.html` | `/de/corporate/medien-und-news/medienmitteilungen-und-news/archiv` |
| jobs | `de__corporate__jobs-und-karriere__arbeitgeberin.html` | `/de/corporate/jobs-und-karriere/arbeitgeberin` |

Save as `o-<template>.png` (original) and `m-<template>.png` (migrated) in this directory. Use `krank` for krankheitsbild.

Tip: before screenshotting, scroll the page to the bottom then back to top so lazy-loaded images settle.

Via Claude Code (or any Playwright session), the boilerplate is:

```js
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(URL);
await page.waitForTimeout(4000);
await page.evaluate(() => { window.scrollTo(0, document.body.scrollHeight); });
await page.waitForTimeout(2000);
await page.evaluate(() => { window.scrollTo(0, 0); });
await page.waitForTimeout(1500);
await page.screenshot({ path: 'o-doctor.png', fullPage: true });
```

## 2. Compose

```bash
./compose.sh
```

Produces `sbs-<template>.png` files (6 of them) by joining `o-` + 4px black separator + `m-` horizontally, with a labeled banner at the top.

Requires `magick` (ImageMagick 7+) and `/System/Library/Fonts/Helvetica.ttc` (macOS). Edit the FONT variable in the script for other systems.

## Output

Each `sbs-<template>.png` is ~2854px wide × tallest-of-(o, m) + 60px banner. Designed for fullscreen review on a wide display — open one at a time, scroll through both pages in parallel.

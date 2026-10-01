const fs = require('fs');

let indexTs = fs.readFileSync('src/i18n/index.ts', 'utf8');

if (!indexTs.includes('data-i18n-title')) {
  const insertIndex = indexTs.indexOf('// Update aria-labels');
  indexTs = indexTs.slice(0, insertIndex) + `  const titles = document.querySelectorAll<HTMLElement>("[data-i18n-title]");
  titles.forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    if (!key) return;
    el.setAttribute("title", t(key, lang));
  });

  const alts = document.querySelectorAll<HTMLElement>("[data-i18n-alt]");
  alts.forEach((el) => {
    const key = el.getAttribute("data-i18n-alt");
    if (!key) return;
    el.setAttribute("alt", t(key, lang));
  });

  ` + indexTs.slice(insertIndex);
  fs.writeFileSync('src/i18n/index.ts', indexTs);
  console.log('Added data-i18n-title and data-i18n-alt support.');
}

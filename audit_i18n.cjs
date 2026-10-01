const fs = require('fs');
const path = require('path');

const srcDir = './src';
const files = [];
function walk(dir) {
  for(const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if(fs.statSync(full).isDirectory()) walk(full);
    else if(f.endsWith('.astro') || f.endsWith('.ts')) files.push(full);
  }
}
walk(srcDir);

const usedKeys = new Set();
for(const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  // Match data-i18n="key", data-i18n-placeholder="key", data-i18n-aria-label="key"
  const re = /data-i18n(?:-placeholder|-aria-label)?="([^"]+)"/g;
  let m;
  while((m = re.exec(content)) !== null) usedKeys.add(m[1]);
}

const en = require('./src/i18n/en.json');
const enKeys = Object.keys(en);

console.log('Used data-i18n keys:', usedKeys.size);
const unusedInEn = enKeys.filter(k => !usedKeys.has(k));
console.log('\nEN keys NOT referenced in any .astro/.ts file (' + unusedInEn.length + '):');
console.log(unusedInEn.join('\n'));

// Also report keys used in astro that don't exist in EN
const missingFromEn = [...usedKeys].filter(k => !en[k]);
console.log('\nKeys used in templates but MISSING from en.json (' + missingFromEn.length + '):');
console.log(missingFromEn.join('\n'));

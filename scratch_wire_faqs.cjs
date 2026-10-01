const fs = require('fs');
const path = require('path');
const pages = ['1-minute-typing-test', '3-minute-typing-test', 'typing-test-for-beginners', 'numbers-punctuation-typing-test'];
let enDict = JSON.parse(fs.readFileSync('src/i18n/en.json', 'utf8'));

pages.forEach(p => {
  const fp = 'src/pages/' + p + '.astro';
  let content = fs.readFileSync(fp, 'utf8');
  let qCount = 1;
  const shortP = p.split('-')[0]; // e.g. '1', '3', 'typing', 'numbers'
  const titleRegex = /<FAQ items=\{faqs\} title=\"(.*?)\" \/>/;
  const titleMatch = content.match(titleRegex);
  if (titleMatch) {
     const tKey = `faq.${shortP}.title`;
     enDict[tKey] = titleMatch[1];
     content = content.replace(titleRegex, `<FAQ items={faqs} title="${titleMatch[1]}" titleKey="${tKey}" />`);
  }
  
  content = content.replace(/\{(\s*question:\s*\"(.*?)\",\s*answer:\s*\"(.*?)\"\s*)\}/g, (match, inner, q, a) => {
     const qKey = `faq.${shortP}.q${qCount}`;
     const aKey = `faq.${shortP}.a${qCount}`;
     enDict[qKey] = q;
     enDict[aKey] = a;
     qCount++;
     return `{${inner}, questionKey: "${qKey}", answerKey: "${aKey}"}`;
  });
  
  fs.writeFileSync(fp, content);
});

fs.writeFileSync('src/i18n/en.json', JSON.stringify(enDict, null, 2));

const locales = ['es', 'ja', 'fr', 'de', 'pt', 'ko', 'it'];
locales.forEach(l => {
  const file = path.join('src/i18n', l + '.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  Object.keys(enDict).forEach(k => {
     if (!data[k]) data[k] = enDict[k]; // fallback to english if missing for now
  });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
});
console.log('Other test pages wired. Fallback translations added.');

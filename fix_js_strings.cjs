const fs = require('fs');
const content = fs.readFileSync('./src/components/TypingEngine.astro', 'utf8');

// The · character in the file - identify it
const lines = content.split('\n');
const badgeLine = lines[1354]; // line 1355 (0-indexed)
console.log('Line content:', badgeLine);

// The dot char code
let dotChar = '';
for (let i = 0; i < badgeLine.length; i++) {
  const code = badgeLine.charCodeAt(i);
  if (code > 127) {
    console.log('Non-ASCII at pos', i, 'code:', code, 'hex:', code.toString(16), 'char:', badgeLine[i]);
    if (code === 183 || code === 0xb7 || code === 8901 || code === 0x22c5 || code === 0x00b7) {
      dotChar = badgeLine[i];
    }
  }
}

// Replace using a targeted string approach
const old = `badge.textContent = \`'\${item.key}' ${badgeLine.match(/'.*?'\s*(.).*?typo/)?.[1] || '·'} \${item.errors} typo\${item.errors > 1 ? "s" : ""}\`;`;
console.log('Trying match...');

// Do a direct string replacement on this specific line
const newLine = `          const typoWord = item.errors > 1 ? t("results.typos") : t("results.typo");\n          badge.textContent = \`'\${item.key}' \${typoWord[0] === 't' ? String.fromCharCode(183) : ''}\${item.errors} \${typoWord}\`;`;

// Simpler: just replace that whole line
const newContent = content.replace(
  /badge\.textContent = `'[^']*' . \$\{item\.errors\} typo\$\{item\.errors > 1 \? "s" : ""\}`;/,
  'const typoWord = item.errors > 1 ? t("results.typos") : t("results.typo");\n          badge.textContent = `\'${item.key}\' \u00b7 ${item.errors} ${typoWord}`;'
);

if (newContent === content) {
  console.log('Regex did not match. Trying character code approach...');
  // Find the exact index
  const searchStr = 'badge.textContent = ';
  const idx = content.indexOf(searchStr, content.indexOf('weakKeysListEl'));
  if (idx >= 0) {
    const endIdx = content.indexOf('`;', idx) + 2;
    console.log('Found badge.textContent at:', idx);
    console.log('Substring:', JSON.stringify(content.substring(idx, endIdx)));
    
    const replacement = 'const typoWord = item.errors > 1 ? t("results.typos") : t("results.typo");\n          badge.textContent = `\'${item.key}\' \u00b7 ${item.errors} ${typoWord}`;';
    const finalContent = content.substring(0, idx) + replacement + content.substring(endIdx);
    fs.writeFileSync('./src/components/TypingEngine.astro', finalContent, 'utf8');
    console.log('Fixed via index approach!');
  } else {
    console.log('Could not find badge.textContent');
  }
} else {
  fs.writeFileSync('./src/components/TypingEngine.astro', newContent, 'utf8');
  console.log('Regex replacement successful!');
}

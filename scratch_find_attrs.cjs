const fs = require('fs');
const path = require('path');
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) { walkDir(dirPath, callback); } else { callback(dirPath); }
  });
}
const ignoreDirs = ['data', 'utils', 'i18n'];
walkDir('src', filePath => {
  if (ignoreDirs.some(id => filePath.replace(/\\/g, '/').includes('/' + id + '/'))) return;
  if (!filePath.endsWith('.astro') && !filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    if (line.match(/(aria-label|title|placeholder|alt)="[^"]+"/)) {
      if (!line.includes('data-i18n')) {
         console.log(filePath + ':' + (i+1) + ': ' + line.trim());
      }
    }
    if (line.includes('<meta name="description" content="')) {
      if (!line.includes('data-i18n')) {
         console.log(filePath + ':' + (i+1) + ': ' + line.trim());
      }
    }
  });
});

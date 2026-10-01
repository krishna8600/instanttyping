const fs = require('fs');
let content = fs.readFileSync('src/components/TypingEngine.astro', 'utf8');

// Fix the syntax errors
content = content.replace(/classList\.remove\('bg-neutral-900', 'text-white', '', '', 'font-semibold'\)/g, 
  "classList.remove('bg-neutral-200', 'text-ds-text-primary', 'font-semibold')");
  
content = content.replace(/classList\.add\('bg-neutral-900', 'text-white', '', '', 'font-semibold'\)/g, 
  "classList.add('bg-neutral-200', 'text-ds-text-primary', 'font-semibold')");

content = content.replace(/classList\.remove\('font-semibold', 'border-neutral-900', ''\)/g, 
  "classList.remove('font-semibold', 'bg-neutral-200', 'text-ds-text-primary')");
  
content = content.replace(/classList\.add\('font-semibold', 'border-neutral-900', ''\)/g, 
  "classList.add('font-semibold', 'bg-neutral-200', 'text-ds-text-primary')");

fs.writeFileSync('src/components/TypingEngine.astro', content);
console.log('Fixed JS errors in TypingEngine.astro');

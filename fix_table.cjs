const fs = require('fs');

// 1. Fix the HTML in index.astro
let astro = fs.readFileSync('src/pages/index.astro', 'utf8');

// Replace table wrapper
astro = astro.replace(/<div class="overflow-x-auto">/g, '<div class="table-scroll">');

// Replace table tag
astro = astro.replace(/<table class="w-full text-left text-xs font-mono">/g, '<table class="benchmark-table font-mono">');

// Remove thead classes
astro = astro.replace(/<thead class="bg-neutral-50 text-ds-text-secondary border-b shadow-ds-border ">/g, '<thead>');

// Remove tbody classes
astro = astro.replace(/<tbody class="divide-y divide-neutral-200 text-ds-text-primary ">/g, '<tbody>');

// Remove tr hover classes
astro = astro.replace(/<tr class="hover:bg-neutral-50 transition-colors">/g, '<tr>');

// Remove p-3 from all th and td
astro = astro.replace(/<th class="p-3">/g, '<th>');
astro = astro.replace(/<td class="p-3">/g, '<td>');
astro = astro.replace(/ class="p-3 /g, ' class="');

fs.writeFileSync('src/pages/index.astro', astro);


// 2. Add BENCHMARK TABLE FIX CSS to global.css
let css = fs.readFileSync('src/styles/global.css', 'utf8');
const tableCSS = `
/* Benchmark Table Fix CSS */
.table-scroll {
  width: 100%;
  overflow-x: auto;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--card);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 4px 16px rgba(0,0,0,0.05);
  margin-bottom: 32px;
}

.benchmark-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.875rem;
}

.benchmark-table th {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  color: var(--muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.75rem;
}

.benchmark-table td {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  color: var(--text);
  transition: background 0.15s;
}

.benchmark-table tr:last-child td {
  border-bottom: none;
}

.benchmark-table tr:hover td {
  background: rgba(120, 120, 120, 0.1);
}
`;

if (!css.includes('.benchmark-table')) {
  css += tableCSS;
  fs.writeFileSync('src/styles/global.css', css);
}

console.log('Fixed benchmark table');

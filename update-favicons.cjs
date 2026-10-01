const fs = require('fs');

let layout = fs.readFileSync('src/layouts/Layout.astro', 'utf8');

const oldFavicons = `  <!-- Favicons -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" href="/favicon.svg" />`;

const newFavicons = `  <!-- Favicons -->
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />`;

layout = layout.replace(oldFavicons, newFavicons);
fs.writeFileSync('src/layouts/Layout.astro', layout);

let header = fs.readFileSync('src/components/Header.astro', 'utf8');
const oldBadge = `<span class="brand-mark" aria-hidden="true">PT</span>`;
const newBadge = `<img src="/logo-192.png" alt="Practice Test Typing" width="32" height="32" class="w-8 h-8 rounded-md" />`;

header = header.replace(oldBadge, newBadge);

// Handle the case where the user's prompt originally asked to replace the div:
const oldDivBadge = `<div class="w-8 h-8 rounded-md bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center text-white dark:text-neutral-950 font-mono text-sm font-semibold tracking-tight">
    PT
  </div>`;
header = header.replace(oldDivBadge, newBadge);
fs.writeFileSync('src/components/Header.astro', header);

if (fs.existsSync('public/favicon.svg')) {
  fs.unlinkSync('public/favicon.svg');
}
console.log('Replaced favicons and header badge');

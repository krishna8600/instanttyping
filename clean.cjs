const fs = require('fs');
const path = require('path');
const glob = require('glob');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove all dark: classes
    content = content.replace(/\bdark:[^\s\"\'\>]+/g, '');
    
    // Replace border border-neutral-200 etc. with shadow-ds-border bg-ds-bg-100
    content = content.replace(/border border-neutral-200 bg-white/g, 'shadow-ds-border bg-ds-bg-100');
    content = content.replace(/border border-neutral-200/g, 'shadow-ds-border');
    content = content.replace(/border-neutral-200/g, 'shadow-ds-border');
    content = content.replace(/bg-white/g, 'bg-ds-bg-100');
    
    // Replace neutral text colors with Vercel ds text colors
    content = content.replace(/text-neutral-900/g, 'text-ds-text-primary');
    content = content.replace(/text-neutral-800/g, 'text-ds-text-primary');
    content = content.replace(/text-neutral-700/g, 'text-ds-text-secondary');
    content = content.replace(/text-neutral-600/g, 'text-ds-text-secondary');
    content = content.replace(/text-neutral-500/g, 'text-ds-text-secondary');
    content = content.replace(/text-neutral-400/g, 'text-ds-text-muted');
    
    // Clean up multiple spaces
    content = content.replace(/ +(?= )/g, '');
    
    fs.writeFileSync(filePath, content);
}

const files = glob.sync('src/**/*.astro', { cwd: process.cwd(), absolute: true });
files.forEach(processFile);
console.log('Cleaned up Astro files.');

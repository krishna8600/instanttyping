const fs = require('fs');
let content = fs.readFileSync('src/styles/global.css', 'utf8');

const customCSS = `
:root {
  --bg: #000;
  --text: #f5f5f7;
  --muted: #a1a1a6;
  --border: rgba(255, 255, 255, 0.12);
  --card: rgba(255, 255, 255, 0.06);
  --accent: #0070f3;
  --radius: 20px;
  color-scheme: dark;
}

[data-theme="light"] {
  --bg: #fafafa;
  --text: #1d1d1f;
  --muted: #6e6e73;
  --border: #e5e5e5;
  --card: rgba(255, 255, 255, 0.7);
  color-scheme: light;
}

html, body {
  background: var(--bg) !important;
  color: var(--text) !important;
}

.typing-box {
  background: var(--card) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border) !important;
  border-radius: var(--radius);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 8px 32px rgba(0, 0, 0, 0.12);
}

.stat-card {
  background: var(--card) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border) !important;
  border-radius: var(--radius);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
`;

content += customCSS;
fs.writeFileSync('src/styles/global.css', content);

// Also add classes to HTML
let astro = fs.readFileSync('src/components/TypingEngine.astro', 'utf8');
astro = astro.replace(/id="typing-display" class=".*?"/, 'id="typing-display" class="typing-box"');

fs.writeFileSync('src/components/TypingEngine.astro', astro);
console.log('Appended custom CSS');

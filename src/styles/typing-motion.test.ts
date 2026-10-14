import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('Typing Motion System & Inviolable Guardrails (Unit 5)', () => {
  const cssPath = path.resolve(process.cwd(), 'src/styles/typing-motion.css');
  const globalCssPath = path.resolve(process.cwd(), 'src/styles/global.css');
  const cssContent = fs.readFileSync(cssPath, 'utf-8');
  const globalCss = fs.readFileSync(globalCssPath, 'utf-8');

  it('imports typing-motion.css in global.css', () => {
    assert.match(globalCss, /@import\s+["']\.\/typing-motion\.css["'];/);
  });

  it('defines --spring motion token with cubic-bezier(0.32, 0.72, 0, 1)', () => {
    assert.match(cssContent, /--spring:\s*cubic-bezier\(0\.32,\s*0\.72,\s*0,\s*1\);/);
  });

  it('HARD EXCLUSION: zero transitions or animations on typing-critical selectors', () => {
    const forbiddenSelectors = [
      '.typing-caret',
      '.char-correct',
      '.char-error',
      '.char-extra',
      '.char-untyped',
      '.char-pending',
      '.char-incorrect',
    ];

    // Split css into rules
    for (const forbidden of forbiddenSelectors) {
      // Must not appear as a selector before an opening brace with transition or animation
      const regex = new RegExp(`\\${forbidden}\\s*\\{[^}]*?(transition|animation)[^}]*?\\}`, 'g');
      const matches = cssContent.match(regex);
      assert.strictEqual(
        matches,
        null,
        `Forbidden transition or animation found targeting typing-critical selector: ${forbidden}`
      );
    }
  });

  it('focus calming: dims auxiliary elements to opacity 0.35 with 250ms spring', () => {
    assert.match(cssContent, /\.engine-running[\s\S]*?opacity:\s*0\.35/);
    assert.match(cssContent, /250ms\s+var\(--spring\)/);
    assert.match(cssContent, /200ms\s+var\(--spring\)/);
  });

  it('corpus crossfade: provides 90ms fade out and 90ms fade in for 180ms total', () => {
    assert.match(cssContent, /#words-wrapper\.words-crossfade-out[\s\S]*?opacity:\s*0/);
    assert.match(cssContent, /#words-wrapper\.words-crossfade-in[\s\S]*?opacity:\s*1/);
    assert.match(cssContent, /90ms\s+var\(--spring\)/);
  });

  it('results reveal: 300ms spring reveal on #results-panel', () => {
    assert.match(cssContent, /#results-panel:not\(\.hidden\)[\s\S]*?results-spring-reveal\s+300ms\s+var\(--spring\)/);
    assert.match(cssContent, /@keyframes\s+results-spring-reveal[\s\S]*?translateY\(16px\)[\s\S]*?translateY\(0\)/);
  });

  it('shine button: 600ms CSS-only light sweep on hover with no JavaScript', () => {
    assert.match(cssContent, /cta-shine-sweep\s+600ms\s+var\(--spring\)/);
    assert.match(cssContent, /@keyframes\s+cta-shine-sweep/);
  });

  it('reduced motion: includes prefers-reduced-motion overrides for all animations', () => {
    assert.match(cssContent, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    assert.match(cssContent, /opacity:\s*1\s*!important/);
    assert.match(cssContent, /transition:\s*none\s*!important/);
    assert.match(cssContent, /animation:\s*none\s*!important/);
  });
});

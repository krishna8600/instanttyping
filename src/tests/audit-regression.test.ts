import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Source-level regression tests for the 2026-10-15 audit fixes.
// These guard the exact defects found in the audit: if a future change
// reintroduces one, the test names say what broke and why it matters.
const root = process.cwd();
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

test('2.1 global keydown handler never hijacks real form fields', () => {
  const src = read('src/components/TypingEngine.astro');
  const guardAnchor = 'Never hijack keystrokes typed into real form fields';
  assert.ok(src.includes(guardAnchor), 'form-field target guard present in handleKeydown');
  assert.ok(src.includes('HTMLTextAreaElement'), 'textarea is guarded');
  assert.ok(src.includes('HTMLInputElement'), 'input is guarded');
  assert.ok(src.includes('HTMLSelectElement'), 'select is guarded');
  assert.ok(src.includes('isContentEditable'), 'contenteditable is guarded');
  // The hidden typing input itself must stay exempt (it IS the typing surface)
  assert.ok(
    src.includes('kdTarget !== hiddenInput'),
    'hidden typing input stays exempt from the guard'
  );
});

test('2.2 settings panel and backdrop open/close through one synced function', () => {
  const src = read('src/components/TypingEngine.astro');
  assert.ok(
    src.includes('function setSettingsPanelOpen'),
    'centralized setSettingsPanelOpen exists'
  );
  assert.ok(
    src.includes("settingsBackdropEl.classList.toggle('hidden', !open)"),
    'backdrop visibility is toggled in lockstep with the panel'
  );
});

test('2.3 resetTest focus decision uses pre-reset state, not dead post-reset check', () => {
  const src = read('src/components/TypingEngine.astro');
  assert.ok(
    src.includes('if (wasActiveOrCompleted) {'),
    'focus decision uses state captured before reset'
  );
  assert.ok(
    !/if \(testActive \|\| testCompleted\) \{\s*\n\s*focusTyping\(\);/.test(src),
    'dead post-reset condition (always false) is gone'
  );
});

test('2.4 finishTest per-second flush is clamped against hidden-tab time jumps', () => {
  const src = read('src/components/TypingEngine.astro');
  assert.ok(
    src.includes('lastSecondRecorded + targetDuration + 10'),
    'flush loop clamped so a hidden tab cannot push thousands of chart entries'
  );
});

test('2.5 engine passes the keystroke count to recordTest', () => {
  const src = read('src/components/TypingEngine.astro');
  assert.ok(
    src.includes(
      'recordTest(testSummary.netWpm, testSummary.accuracy, currentMode, correctKeystrokes + incorrectKeystrokes)'
    ),
    'recordTest receives correctKeystrokes + incorrectKeystrokes'
  );
});

test('4.x footer links use data-i18n spans (no hardcoded English)', () => {
  const src = read('src/components/Footer.astro');
  for (const k of ['footer.keyboard_tester', 'footer.wpm_calculator', 'footer.measurement']) {
    assert.ok(src.includes(`data-i18n="${k}"`), `footer label uses ${k}`);
  }
});

test('5.x JSON-LD does not advertise a search the site does not implement', () => {
  const src = read('src/layouts/Layout.astro');
  assert.ok(!src.includes('SearchAction'), 'no misleading SearchAction');
  assert.ok(
    src.includes('application/ld+json'),
    'other structured data is preserved'
  );
});

test('6.x coarse-pointer buttons meet 44px and viewport uses dvh with fallback', () => {
  const css = read('src/styles/global.css');
  assert.ok(css.includes('@media (pointer: coarse)'), 'coarse-pointer block present');
  assert.ok(css.includes('min-height: 44px'), '44px touch target present');
  const dvhIdx = css.indexOf('100dvh');
  const vhIdx = css.indexOf('100vh');
  assert.ok(dvhIdx > 0 && vhIdx > 0 && vhIdx < dvhIdx, '100vh fallback precedes 100dvh');
});

test('7.x all eight locales contain the required footer/a11y keys with real labels', () => {
  const keys = [
    'footer.keyboard_tester',
    'footer.wpm_calculator',
    'footer.measurement',
    'header.aria_site',
    'switcher.aria_select',
    'engine.aria_textarea',
    'engine.aria_results',
    'engine.aria_wpm_chart',
  ];
  const get = (dict: any, key: string) => dict[key]; // flat dotted keys: t() does dict[key]
  for (const lang of ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko']) {
    const dict = JSON.parse(read(`src/i18n/${lang}.json`));
    for (const k of keys) {
      const v = get(dict, k);
      assert.ok(
        typeof v === 'string' && v.trim().length > 0 && !/^[a-z_]+\.[a-z_]+$/.test(v),
        `${lang}.${k} must be a human-readable label, got: ${JSON.stringify(v)}`
      );
    }
  }
});

test('3.x streak day keys use local calendar date, never UTC', () => {
  const src = read('src/scripts/progress.ts');
  assert.ok(src.includes('getFullYear()'), 'local calendar date in use');
  assert.ok(
    !src.includes('toISOString().slice(0, 10)'),
    'no UTC-derived day keys remain'
  );
});

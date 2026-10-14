import test from 'node:test';
import assert from 'node:assert/strict';
import {
  THEMED_PACKS,
  THEMED_PACK_METAS,
  THEME_ANIMALS_WORDS,
  THEME_FRUITS_WORDS,
  THEME_VEGETABLES_WORDS,
  THEME_COLORS_WORDS,
  THEME_FLOWERS_WORDS,
  THEME_SPORTS_WORDS,
  THEME_INSTRUMENTS_WORDS,
  THEME_CLOTHING_WORDS,
  THEME_HOUSEHOLD_WORDS,
  THEME_BODY_WORDS,
} from './themed-packs.ts';

test('themed packs exports all 10 expected themes', () => {
  const expectedThemes = [
    'theme-animals',
    'theme-fruits',
    'theme-vegetables',
    'theme-colors',
    'theme-flowers',
    'theme-sports',
    'theme-instruments',
    'theme-clothing',
    'theme-household',
    'theme-body',
  ];
  assert.deepEqual(Object.keys(THEMED_PACKS).sort(), [...expectedThemes].sort());
  assert.equal(THEMED_PACK_METAS.length, 10);
});

test('each themed pack contains the exact word counts specified', () => {
  assert.equal(THEME_ANIMALS_WORDS.length, 60);
  assert.equal(THEME_FRUITS_WORDS.length, 50);
  assert.equal(THEME_VEGETABLES_WORDS.length, 42);
  assert.equal(THEME_COLORS_WORDS.length, 42);
  assert.equal(THEME_FLOWERS_WORDS.length, 49);
  assert.equal(THEME_SPORTS_WORDS.length, 42);
  assert.equal(THEME_INSTRUMENTS_WORDS.length, 41);
  assert.equal(THEME_CLOTHING_WORDS.length, 60);
  assert.equal(THEME_HOUSEHOLD_WORDS.length, 60);
  assert.equal(THEME_BODY_WORDS.length, 41);
});

test('all words in all 10 themes are clean lowercase ASCII tokens without duplicates', () => {
  for (const [themeName, words] of Object.entries(THEMED_PACKS)) {
    const seen = new Set<string>();
    for (const word of words) {
      assert.match(
        word,
        /^[a-z]+$/,
        `Theme ${themeName} contains invalid non-lowercase-ASCII word: "${word}"`
      );
      assert.ok(
        !seen.has(word),
        `Theme ${themeName} contains duplicate word: "${word}"`
      );
      seen.add(word);
    }
  }
});

test('THEMED_PACK_METAS metadata aligns with THEMED_PACKS entries', () => {
  for (const meta of THEMED_PACK_METAS) {
    const pack = THEMED_PACKS[meta.id];
    assert.ok(pack, `Missing pack for metadata ID: ${meta.id}`);
    assert.equal(
      meta.wordCount,
      pack.length,
      `Word count mismatch for ${meta.id}: meta reports ${meta.wordCount}, array has ${pack.length}`
    );
    assert.ok(meta.labelKey.startsWith('options.corpus_theme_'));
  }
});

test('all 8 locale files contain translations for the optgroup and all 10 themes', async () => {
  const { readFileSync } = await import('node:fs');
  const locales = ['en', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'pt'];
  for (const loc of locales) {
    const data = JSON.parse(readFileSync(`src/i18n/${loc}.json`, 'utf8'));
    assert.ok(
      data['options.group_themed_packs'],
      `Locale ${loc} missing options.group_themed_packs`
    );
    for (const meta of THEMED_PACK_METAS) {
      assert.ok(
        data[meta.labelKey],
        `Locale ${loc} missing translation for ${meta.labelKey}`
      );
    }
  }
});

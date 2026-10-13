import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { t, DICTIONARIES } from './index.ts';

test.before(() => {
  const enPath = resolve(process.cwd(), 'src/i18n/en.json');
  DICTIONARIES.en = JSON.parse(readFileSync(enPath, 'utf8'));
});

test('t() interpolates params with explicit language', () => {
  const result = t('results.chart_peak', 'en', { wpm: 85 });
  assert.equal(result, 'peak 85');
});

test('t() interpolates params when language is omitted (2-argument form)', () => {
  const result = t('results.chart_peak', { wpm: 85 });
  assert.equal(result, 'peak 85');
});

test('t() interpolates params when language is undefined (3-argument form with undefined lang)', () => {
  const result = t('results.chart_peak', undefined, { wpm: 85 });
  assert.equal(result, 'peak 85');
});

test('t() interpolates coaching breakdown placeholders', () => {
  const result = t('results.coach_breakdown', 'en', {
    keys: 'E, T',
    hesitations: 2,
    wrong: 1,
    tax: 4,
    raw: 60,
    net: 56,
  });
  assert.equal(
    result,
    'Slowest keys: E, T · Hesitations: 2 · Wrong keys: 1 · Accuracy tax: 4 WPM (Raw 60 → Net 56)'
  );
});

test('t() interpolates coaching breakdown when language argument is undefined', () => {
  const result = t('results.coach_breakdown', undefined, {
    keys: 'E, T',
    hesitations: 2,
    wrong: 1,
    tax: 4,
    raw: 60,
    net: 56,
  });
  assert.equal(
    result,
    'Slowest keys: E, T · Hesitations: 2 · Wrong keys: 1 · Accuracy tax: 4 WPM (Raw 60 → Net 56)'
  );
});

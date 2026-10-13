import test from 'node:test';
import assert from 'node:assert/strict';
import { getRecommendedTier, type TestHistoryEntry } from './metrics.ts';

function makeEntry(netWpm: number): TestHistoryEntry {
  return {
    id: `test-${Math.random()}`,
    timestamp: Date.now(),
    mode: 'time',
    durationSeconds: 60,
    netWpm,
    rawWpm: netWpm,
    accuracy: 98,
    errors: 1,
    correctChars: netWpm * 5,
    incorrectChars: 1,
    missedWords: [],
  };
}

test('getRecommendedTier returns beginner for empty history', () => {
  assert.equal(getRecommendedTier([]), 'beginner');
});

test('getRecommendedTier returns beginner for average WPM < 40', () => {
  const history = [makeEntry(20), makeEntry(35), makeEntry(30)];
  assert.equal(getRecommendedTier(history), 'beginner');
});

test('getRecommendedTier returns beginner boundary at 39 WPM', () => {
  const history = [makeEntry(39)];
  assert.equal(getRecommendedTier(history), 'beginner');
});

test('getRecommendedTier returns intermediate for average WPM 40 to 70', () => {
  const history1 = [makeEntry(40)];
  assert.equal(getRecommendedTier(history1), 'intermediate');

  const history2 = [makeEntry(55), makeEntry(65)];
  assert.equal(getRecommendedTier(history2), 'intermediate');

  const history3 = [makeEntry(70)];
  assert.equal(getRecommendedTier(history3), 'intermediate');
});

test('getRecommendedTier returns advanced for average WPM > 70', () => {
  const history1 = [makeEntry(71)];
  assert.equal(getRecommendedTier(history1), 'advanced');

  const history2 = [makeEntry(85), makeEntry(95), makeEntry(110)];
  assert.equal(getRecommendedTier(history2), 'advanced');
});

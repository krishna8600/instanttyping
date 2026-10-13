import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateInstantaneousWpm, saveTestResult, getTestHistory, type TestHistoryEntry } from './metrics.ts';

test('calculateInstantaneousWpm calculates 0 WPM for 0 characters', () => {
  assert.equal(calculateInstantaneousWpm(0, 1), 0);
  assert.equal(calculateInstantaneousWpm(0, 0.5), 0);
});

test('calculateInstantaneousWpm calculates standard 60 WPM for 5 characters in 1 second', () => {
  // 5 chars = 1 word; 1 word/sec = 60 words/min
  assert.equal(calculateInstantaneousWpm(5, 1), 60);
});

test('calculateInstantaneousWpm calculates 120 WPM for 10 characters in 1 second', () => {
  assert.equal(calculateInstantaneousWpm(10, 1), 120);
});

test('calculateInstantaneousWpm calculates 84 WPM for 7 characters in 1 second', () => {
  // 7 chars / 5 = 1.4 words; 1.4 * 60 = 84 WPM
  assert.equal(calculateInstantaneousWpm(7, 1), 84);
});

test('calculateInstantaneousWpm calculates 12 WPM for 1 character in 1 second', () => {
  // 1 char / 5 = 0.2 words; 0.2 * 60 = 12 WPM
  assert.equal(calculateInstantaneousWpm(1, 1), 12);
});

test('calculateInstantaneousWpm returns 0 for non-positive duration or chars', () => {
  assert.equal(calculateInstantaneousWpm(-5, 1), 0);
  assert.equal(calculateInstantaneousWpm(5, 0), 0);
  assert.equal(calculateInstantaneousWpm(5, -1), 0);
});

test('calculateInstantaneousWpm scales correctly for custom time slices', () => {
  // 5 characters in 0.5 seconds = 120 WPM
  assert.equal(calculateInstantaneousWpm(5, 0.5), 120);
  // 10 characters in 2 seconds = 60 WPM
  assert.equal(calculateInstantaneousWpm(10, 2), 60);
});

test('saveTestResult caps wpmHistory at 180 points to prevent storage bloat', () => {
  const mockStorage: Record<string, string> = {};
  const originalLocalStorage = (globalThis as any).localStorage;
  const originalWindow = (globalThis as any).window;

  (globalThis as any).localStorage = {
    getItem: (k: string) => mockStorage[k] || null,
    setItem: (k: string, v: string) => { mockStorage[k] = v; },
    removeItem: (k: string) => { delete mockStorage[k]; },
    clear: () => { for (const k in mockStorage) delete mockStorage[k]; },
    length: 0,
    key: () => null,
  };
  (globalThis as any).window = globalThis;

  try {
    const longHistory = Array.from({ length: 250 }, (_, i) => i + 1);
    const entry: TestHistoryEntry = {
      id: 'telemetry-test-1',
      timestamp: Date.now(),
      mode: 'time',
      durationSeconds: 180,
      netWpm: 80,
      rawWpm: 85,
      accuracy: 96,
      errors: 2,
      correctChars: 400,
      incorrectChars: 2,
      missedWords: [],
      wpmHistory: longHistory,
    };

    saveTestResult(entry);
    const stored = getTestHistory();
    assert.equal(stored.length, 1);
    assert.equal(stored[0].wpmHistory?.length, 180);
    assert.equal(stored[0].wpmHistory?.[0], 1);
    assert.equal(stored[0].wpmHistory?.[179], 180);
  } finally {
    (globalThis as any).localStorage = originalLocalStorage;
    (globalThis as any).window = originalWindow;
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';

// In-memory localStorage shim so progress.ts persistence works under node:test.
// (In the browser this is the real localStorage; the module degrades gracefully
// without it, which is why the shim must be installed before import.)
const store = new Map<string, string>();
(globalThis as any).localStorage = {
  getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
  setItem: (k: string, v: string) => {
    store.set(k, v);
  },
  removeItem: (k: string) => {
    store.delete(k);
  },
  clear: () => {
    store.clear();
  },
};

import { recordTest, loadProgress } from './progress.ts';

function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

test.beforeEach(() => {
  store.clear();
});

test('zero-keystroke test earns no XP, streak, personal best, or achievements', () => {
  const r = recordTest(60, 96, 'time-15', 0);
  assert.equal(r.xpGained, 0);
  assert.equal(r.streakExtended, false);
  assert.equal(r.isNewPb, false);
  assert.equal(r.nearMiss, null);
  assert.deepEqual(r.newAchievements, []);
  // …and leaves no trace in stored progress
  const s = loadProgress();
  assert.equal(s.totalTests, 0);
  assert.equal(s.xp, 50); // endowed head start untouched
  assert.equal(s.streak, 0);
  assert.deepEqual(s.achievements, []);
  assert.equal(s.lastTestDate, '');
});

test('repeated zero-keystroke tests cannot farm progress', () => {
  for (let i = 0; i < 10; i++) recordTest(120, 100, 'time-60', 0);
  const s = loadProgress();
  assert.equal(s.totalTests, 0);
  assert.equal(s.xp, 50);
  assert.deepEqual(s.achievements, []);
  assert.deepEqual(s.pbs, {});
});

test('normal test with keystrokes still earns XP and records normally', () => {
  const r = recordTest(60, 96, 'time-15', 120);
  assert.ok(r.xpGained > 0, `expected XP, got ${r.xpGained}`);
  assert.equal(r.dailyCount, 1);
  assert.equal(r.streakExtended, true); // first ever test
  assert.equal(r.streak, 1);
  const s = loadProgress();
  assert.equal(s.totalTests, 1);
  assert.ok(s.xp > 50);
});

test('legacy 3-arg recordTest call still works (keystrokes defaults to unknown)', () => {
  const r = recordTest(60, 96, 'time-15');
  assert.ok(r.xpGained > 0, '3-arg call must not be treated as zero-keystroke');
  assert.equal(r.dailyCount, 1);
});

test('streak day keys use the local calendar date, not UTC', () => {
  recordTest(60, 96, 'time-15', 120);
  const s = loadProgress();
  assert.equal(s.lastTestDate, localDateKey(new Date()));
  const saved = JSON.parse(store.get('it_progress_v1')!);
  assert.ok(
    localDateKey(new Date()) in saved.dailyTests,
    'dailyTests keyed by local date'
  );
});

test('a test on the next local calendar day extends the streak', () => {
  const y = new Date();
  y.setDate(y.getDate() - 1);
  const seed = loadProgress();
  seed.lastTestDate = localDateKey(y);
  seed.streak = 3;
  store.set('it_progress_v1', JSON.stringify(seed));

  const r = recordTest(60, 96, 'time-15', 120);
  assert.equal(r.streakExtended, true);
  assert.equal(r.streak, 4);
});

test('zero-keystroke test does not extend or break an existing streak', () => {
  const y = new Date();
  y.setDate(y.getDate() - 1);
  const seed = loadProgress();
  seed.lastTestDate = localDateKey(y);
  seed.streak = 5;
  store.set('it_progress_v1', JSON.stringify(seed));

  const r = recordTest(60, 96, 'time-15', 0);
  assert.equal(r.streakExtended, false);
  assert.equal(r.streak, 5);
  const s = loadProgress();
  assert.equal(s.streak, 5);
  assert.equal(s.lastTestDate, localDateKey(y)); // untouched
});

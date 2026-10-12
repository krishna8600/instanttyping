# Weekly Personal Challenge — Build Spec

## Concept

Every Monday, the site generates ONE personal challenge from the user's own
history. Not a leaderboard, not competitive — personal progression only
(per the P1 retention research: "personal progression over global leaderboards").

Examples:
- "Complete 8 tests this week" (volume)
- "Hit 50+ WPM in 3 tests" (peak — 50 = just above their average)
- "Type 1,500 words total" (volume)
- "Finish 5 tests at 95%+ accuracy" (consistency)

The target always adapts: slightly above last week's performance, never
impossible. A beginner gets "complete 5 tests"; a 80 WPM user gets "hit 90 WPM twice".

## Rules

1. **One challenge per week.** Generated Monday 00:00 local time. Replaces the old one.
2. **Adaptive target.** Computed from the trailing 7 days:
   - Volume goals: last week's count + ~25%, rounded, min 5.
   - Peak goals: last week's best WPM + 5, rounded to 5s.
   - Accuracy goals: 95% (fixed — achievable, meaningful).
   - If no history (new user): "Complete 5 tests this week".
3. **No punishment.** Missing a week just generates a fresh one. Streak-freeze
   philosophy applies: humane, never guilt-tripping.
4. **Reward.** Completing = +100 XP bonus + `challenge-complete` achievement
   (toast via notify.ts). Progress visible all week.
5. **Opt-out.** A small "skip this week" link — respects autonomy, costs nothing.

## Data model (extends it_profile_v1)

```ts
challenge: {
  weekId: string;        // e.g. "2026-W42" (ISO week, local timezone)
  kind: 'volume-tests' | 'volume-words' | 'peak-wpm' | 'accuracy';
  target: number;        // e.g. 8 tests, or 50 wpm
  unit: string;          // 'tests' | 'words' | 'wpm' | 'accurate tests'
  progress: number;      // current count
  done: boolean;
  skipped: boolean;
}
```

- On each completed test: update `progress` per the active challenge kind.
- On week rollover: generate a new challenge from history, reset progress.
- Per-day counts (already being added for the heatmap) feed the volume math.

## UI

1. **Homepage card** (below the test, above footer): challenge text, progress
   bar (reuse xp-progress pattern: one driver for fill + count), "3 of 8 tests".
   Dismissible for the week via "skip".
2. **/profile section**: current challenge + last 4 weeks history (done/skipped).
3. **Completion**: notify.ts toast + XP receipt entry + achievement.

All copy monochrome; progress bar monochrome; the completion state may use
the standard green check (matches confirm-morph done state).

## i18n

New keys (en.json first, other locales later):
- `challenge.title` ("This week's challenge")
- `challenge.volume-tests` ("Complete {target} tests")
- `challenge.volume-words` ("Type {target} words")
- `challenge.peak-wpm` ("Hit {target}+ WPM in {n} tests")
- `challenge.accuracy` ("Finish {target} tests at 95%+ accuracy")
- `challenge.progress` ("{done} of {target}")
- `challenge.complete` ("Challenge complete! +100 XP")
- `challenge.skip` ("Skip this week")
- `challenge.new-week` ("New challenge")

## Out of scope

- No leaderboards, no friends, no sharing (deferred per research).
- No push notifications / email reminders (no backend).
- No mid-week challenge changes.
- Don't touch: typing engine, WPM math, caret code, SEO tags.

## Verification

- `npm run build` passes.
- Monday rollover: set system clock forward (or mock weekId) → new challenge generates, old progress archived.
- Adaptive math: seed a fake history (e.g. 20 tests @ 60 WPM avg) → challenge target ≈ 25 tests or 65 WPM peak.
- New user (empty profile): falls back to "Complete 5 tests".
- Skip: challenge hidden for the week, no XP, no guilt copy.
- Completion: toast + XP receipt + achievement fire exactly once.
- No console errors; reduced-motion respected.

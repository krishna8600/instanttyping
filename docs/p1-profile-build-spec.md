# P1 Build Spec: localStorage-First Profile (Streak + XP + Achievements)

*Spec for Antigravity implementation. No backend. Works on the static Astro site today.*
*Research basis: `retention-research-report.md` in this folder.*

## Design principles

1. **Every number must feel earned.** XP is itemized (base + bonuses shown as a receipt). No arbitrary points — answers the "gamification feels meaningless" critique.
2. **Accounts are opt-in sync, never a gate.** Everything works anonymously in localStorage. The 2-second onboarding rule is sacred: no signup wall, ever.
3. **Streaks survive real life.** 1 freeze per week, auto-applied. Marketing line: "streaks that survive real life."
4. **Private by default.** All data in localStorage. UI says "Your data never leaves this browser" (already the site's messaging — extend it).

## Data model

Single localStorage key: `it_profile_v1` (versioned for future migrations).

```ts
interface InstantTypingProfile {
  version: 1;
  createdAt: string;          // ISO date
  xp: number;                 // lifetime XP
  stats: {
    testsCompleted: number;
    totalSecondsTyped: number;
    bestWpm: number;           // net WPM PB
    bestAccuracy: number;
  };
  streak: {
    current: number;          // days
    longest: number;
    lastActiveDate: string | null;  // YYYY-MM-DD in user's timezone
    freezesAvailable: number; // resets to 1 every Monday
    freezeWeekStart: string | null; // YYYY-MM-DD of Monday
  };
  achievements: Record<string, string>; // id -> ISO unlock timestamp
  xpLedger: Array<{           // last 50 entries, for the receipt UI
    at: string;
    base: number;
    bonuses: Array<{ label: string; amount: number }>;
    total: number;
  }>;
}
```

Streak update rules (on any completed test):
- Compute today as YYYY-MM-DD in the **user's local timezone**.
- Same day as `lastActiveDate` → no-op (streak already counted).
- Next calendar day → `current + 1`, `lastActiveDate = today`.
- Gap of exactly 2 days AND `freezesAvailable > 0` → consume freeze, `current + 1` (streak survives), `lastActiveDate = today`.
- Larger gap → `current = 1`, `lastActiveDate = today` (streak restarts, `longest` preserved).
- Monday check: if `freezeWeekStart` is not this week's Monday → `freezesAvailable = 1`, `freezeWeekStart = thisMonday`.

## XP system

**Per completed test** (minimum 15 seconds of typing to count — prevents farming 5-second tests):

```
base = round(netWpm * (accuracy / 100))
```

Bonuses (each shown as a line item):
- **New personal best:** +50 ("Personal best!")
- **Accuracy tax improved** vs. rolling average of last 10 tests: +30 ("Cleaner than your average")
- **Streak day:** +10 ("Day N streak")
- **First test of the day:** +5 ("Daily warmup")

**Level curve** (Monkeytype-style sqrt, legible):
```
level = floor(sqrt(totalXp / 100)) + 1
```
- Level 1: 0 XP · Level 2: 100 XP · Level 3: 400 XP · Level 5: 1600 XP · Level 10: 8100 XP.
- Show "Level N — M XP to next" in the profile chip.

**XP receipt on the results screen** (below the diagnosis card):
```
+117 XP
Base 52 · Personal best +50 · Streak +10 · Warmup +5
Level 3 · 42 XP to Level 4   [progress bar]
```
Render as: total big, breakdown small, progress bar to next level. Monochrome. No confetti.

## Achievements (launch set — 8)

| ID | Name | Unlock condition |
|---|---|---|
| `first-test` | First Steps | Complete 1 test |
| `ten-tests` | Warming Up | Complete 10 tests |
| `hundred-tests` | Centurion | Complete 100 tests |
| `week-streak` | Week Warrior | 7-day streak |
| `month-streak` | Unstoppable | 30-day streak |
| `sharp` | Sharpshooter | Accuracy tax ≤ 5% on a 60s+ test |
| `speed-50` | Speed Demon | Net WPM ≥ 50 |
| `driller` | Practice Makes Permanent | Complete 5 mistake drills |

- Unlock check runs at test completion (and drill completion for `driller`).
- On unlock: small toast "🏆 Achievement unlocked: Week Warrior" (respect `prefers-reduced-motion`).
- Rarity: show tier label now (`Common` / `Rare` / `Epic`); real rarity % comes with cloud sync later.
- Achievement list UI: new section on results screen? No — keep v1 minimal: toast on unlock + display in the nav profile popover. Full `/profile` page is a later task.

## UI placement (v1 — minimal surface)

1. **Nav profile chip** (top-right, next to theme toggle): `Lv 3 · 🔥 12` — level + streak flame. Click → small popover: XP progress bar, streak stats (current/longest/freezes), achievement icons row. Monochrome, matches site.
2. **Results screen XP receipt** (below diagnosis card, above share buttons): total XP, itemized breakdown, level progress bar.
3. **Achievement toast** on unlock.

That's it for v1. No profile page, no settings UI, no reset UI (add "Delete my data" already exists — extend it to wipe the profile key too).

## Implementation notes

- New file: `src/scripts/profile.ts` — all profile logic (load/save, XP calc, streak update, achievement checks). Pure functions where possible; single `updateProfileAfterTest(summary)` entry point called from the engine's test-completion path.
- Touch points in `src/components/TypingEngine.astro`: call `updateProfileAfterTest` in `finishTest()` (after `lastCompletedSummary` is built — the plumbing from the P0 bugfix); render XP receipt in results; achievement toast.
- Nav chip: new small component or inline in `Layout.astro` nav. Popover must not break mobile nav.
- i18n: v1 ships English-only strings; add keys to `en` locale file, other locales fall back (existing pattern).
- Privacy: never send profile data anywhere. The existing "Your data never leaves this browser" + "Delete my data" covers it — extend delete to include `it_profile_v1`.
- Migration safety: if `it_profile_v1` parse fails, start fresh (don't crash). Version field for future schema changes.

## Out of scope (explicitly)

- Cloud sync / accounts / magic links (do later, per research).
- Full `/profile` page.
- Leaderboards (ignore per research — anti-cheat cost).
- Weekly personal challenge (separate P1 task, needs fixed-wordlist design).
- Changing any P0 feature behavior.

## Verification for the implementing agent

- `npm run build` passes, zero errors.
- On localhost: complete tests across fake dates (devtools override) — verify streak +1 next day, freeze consumes on 2-day gap, reset on 3-day gap.
- Verify XP receipt math on results screen with a PB test.
- Verify achievement toasts fire once each (no repeats).
- Verify "Delete my data" wipes the profile.
- Report `git status --short`. Do not commit, push, or deploy.

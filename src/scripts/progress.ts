// progress.ts — The psychology engine for Instant Typing.
// Science-backed engagement: streaks (Fogg habit loop), XP/levels (SDT competence),
// near-miss nudges (dopamine reward-prediction-error), daily goals (Tiny Habits),
// endowed progress (welcome XP head start). All localStorage, no backend.
// Ethical: informative feedback only, never guilt/manipulation (overjustification-safe).

export interface ProgressState {
  xp: number;
  streak: number;
  lastTestDate: string; // YYYY-MM-DD
  freezeUsedThisWeek: string | null; // week key when freeze was used
  dailyTests: Record<string, number>; // date -> count
  pbs: Record<string, number>; // mode -> best WPM
  totalTests: number;
  achievements: string[];
}

const KEY = 'it_progress_v1';

const LEVELS = [
  { xp: 0, title: 'Novice' },
  { xp: 100, title: 'Apprentice' },
  { xp: 300, title: 'Typist' },
  { xp: 600, title: 'Proficient' },
  { xp: 1000, title: 'Advanced' },
  { xp: 1500, title: 'Expert' },
  { xp: 2100, title: 'Master' },
  { xp: 2800, title: 'Grandmaster' },
  { xp: 3600, title: 'Legend' },
];

export const DAILY_GOAL = 3;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function weekKey(): string {
  const d = new Date();
  const onejan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil((((d.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as ProgressState;
  } catch { /* fresh start */ }
  // Endowed Progress Effect (Nunes & Drèze 2006): 50 XP head start
  return {
    xp: 50,
    streak: 0,
    lastTestDate: '',
    freezeUsedThisWeek: null,
    dailyTests: {},
    pbs: {},
    totalTests: 0,
    achievements: [],
  };
}

export function saveProgress(s: ProgressState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch { /* storage unavailable */ }
}

export function getLevel(xp: number): { index: number; title: string; progress: number } {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xp) idx = i;
  }
  const cur = LEVELS[idx];
  const next = LEVELS[idx + 1];
  const progress = next ? (xp - cur.xp) / (next.xp - cur.xp) : 1;
  return { index: idx, title: cur.title, progress: Math.min(1, Math.max(0, progress)) };
}

export interface TestResult {
  wpm: number;
  accuracy: number;
  mode: string;
  isNewPb: boolean;
  nearMiss: number | null; // WPM gap if within 5% of PB but not PB
  xpGained: number;
  streak: number;
  streakExtended: boolean;
  dailyCount: number;
  newAchievements: string[];
}

export function recordTest(wpm: number, accuracy: number, mode: string): TestResult {
  const s = loadProgress();
  const today = todayKey();
  const result: TestResult = {
    wpm, accuracy, mode,
    isNewPb: false,
    nearMiss: null,
    xpGained: 0,
    streak: s.streak,
    streakExtended: false,
    dailyCount: 0,
    newAchievements: [],
  };

  // ── Streak (Fogg: anchor + celebration; weekly freeze prevents guilt spiral) ──
  if (s.lastTestDate !== today) {
    if (s.lastTestDate === yesterdayKey()) {
      s.streak += 1;
      result.streakExtended = true;
    } else if (s.lastTestDate === '') {
      s.streak = 1; // first ever test
      result.streakExtended = true;
    } else {
      // Gap > 1 day: use weekly freeze if available, else reset (no guilt copy)
      if (s.freezeUsedThisWeek !== weekKey()) {
        s.freezeUsedThisWeek = weekKey();
        // streak preserved via freeze
      } else {
        s.streak = 1;
        result.streakExtended = true;
      }
    }
    s.lastTestDate = today;
  }
  result.streak = s.streak;

  // ── Daily goal ──
  s.dailyTests[today] = (s.dailyTests[today] || 0) + 1;
  result.dailyCount = s.dailyTests[today];

  // ── Personal best ──
  const prevPb = s.pbs[mode] || 0;
  if (wpm > prevPb && wpm > 0) {
    s.pbs[mode] = Math.round(wpm * 10) / 10;
    result.isNewPb = true;
  } else if (prevPb > 0 && wpm > 0) {
    const gap = prevPb - wpm;
    // Near-miss nudge: within 5% (dopamine reward-prediction-error, honest only)
    if (gap > 0 && gap / prevPb <= 0.05) {
      result.nearMiss = Math.round(gap * 10) / 10;
    }
  }

  // ── XP (informative, not controlling — overjustification-safe) ──
  let xp = Math.round(wpm); // 1 XP per WPM
  if (accuracy >= 99.5) xp += 50;
  else if (accuracy >= 98) xp += 25;
  else if (accuracy >= 95) xp += 10;
  if (result.isNewPb) xp += 100;
  if (result.streakExtended) xp += 10 * Math.min(s.streak, 7); // streak bonus, capped
  result.xpGained = xp;
  const oldLevel = getLevel(s.xp).index;
  s.xp += xp;
  const newLevel = getLevel(s.xp).index;
  result.newAchievements = [];

  // ── Silent achievements (ZenType pattern: no mid-session popups) ──
  s.totalTests += 1;
  const ach = s.achievements;
  const unlock = (id: string) => {
    if (!ach.includes(id)) {
      ach.push(id);
      result.newAchievements.push(id);
    }
  };
  if (s.totalTests >= 10) unlock('persistent_10');
  if (s.totalTests >= 50) unlock('persistent_50');
  if (s.totalTests >= 100) unlock('century');
  if (wpm >= 60) unlock('speed_60');
  if (wpm >= 80) unlock('speed_80');
  if (wpm >= 100) unlock('speed_100');
  if (accuracy >= 99 && wpm >= 40) unlock('precision');
  if (s.streak >= 3) unlock('streak_3');
  if (s.streak >= 7) unlock('streak_7');
  if (s.streak >= 30) unlock('streak_30');
  if (newLevel > oldLevel) unlock(`level_${newLevel}`);

  saveProgress(s);
  return result;
}

export function getDailyProgress(): { done: number; goal: number } {
  const s = loadProgress();
  return { done: s.dailyTests[todayKey()] || 0, goal: DAILY_GOAL };
}

export { LEVELS };

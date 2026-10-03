// src/scripts/daily-challenge.ts — Wordle-style daily typing challenge
// Same passage for everyone, resets midnight, one scored attempt per day
// Deterministic: no backend needed

export interface DailyResult {
  wpm: number;
  accuracy: number;
  completedAt: string; // ISO timestamp
}

export interface DailyState {
  [dateKey: string]: DailyResult; // dateKey = YYYY-MM-DD
}

const STORAGE_KEY = 'it_daily_v1';

// Simple deterministic hash for passage selection
function hashDate(dateKey: string): number {
  let h = 0;
  for (let i = 0; i < dateKey.length; i++) {
    h = (h * 31 + dateKey.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function getTodayKey(): string {
  // Local timezone (not UTC) — respects user's midnight
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getDailyPassageIndex(dateKey: string, totalPassages: number): number {
  return hashDate(dateKey) % totalPassages;
}

export function getDailyState(): DailyState {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveDailyResult(wpm: number, accuracy: number): void {
  const state = getDailyState();
  const today = getTodayKey();
  // Only first attempt counts (but allow viewing)
  if (!state[today]) {
    state[today] = {
      wpm: Math.round(wpm),
      accuracy: Math.round(accuracy),
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

export function hasCompletedToday(): boolean {
  return !!getDailyState()[getTodayKey()];
}

export function getDailyStreak(): number {
  const state = getDailyState();
  let streak = 0;
  const d = new Date();
  // Start from today, go backwards
  while (true) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const key = `${y}-${m}-${day}`;
    if (state[key]) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      // Allow today to be incomplete (streak not broken until tomorrow)
      const todayKey = getTodayKey();
      if (key === todayKey) {
        d.setDate(d.getDate() - 1);
        continue;
      }
      break;
    }
  }
  return streak;
}

export function getDailyHistory(days: number = 7): Array<{ date: string; result: DailyResult | null }> {
  const state = getDailyState();
  const out = [];
  const d = new Date();
  for (let i = 0; i < days; i++) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const key = `${y}-${m}-${day}`;
    out.push({ date: key, result: state[key] || null });
    d.setDate(d.getDate() - 1);
  }
  return out;
}

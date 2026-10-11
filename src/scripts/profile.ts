/**
 * src/scripts/profile.ts
 * P1 localStorage-first profile system: Streaks with weekly freeze, XP level curve,
 * itemized receipt, and 8 launch achievements.
 * Spec: docs/p1-profile-build-spec.md
 */

export const PROFILE_STORAGE_KEY = 'it_profile_v1';

export interface InstantTypingProfile {
  version: 1;
  createdAt: string;          // ISO date
  xp: number;                 // lifetime XP
  stats: {
    testsCompleted: number;
    totalSecondsTyped: number;
    bestWpm: number;           // net WPM PB
    bestAccuracy: number;
    mistakeDrillsCompleted?: number;
    recentAccuracyTaxes?: number[]; // rolling last 10
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

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  tier: 'Common' | 'Rare' | 'Epic';
  icon: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first-test', name: 'First Steps', description: 'Complete 1 test', tier: 'Common', icon: '👟' },
  { id: 'ten-tests', name: 'Warming Up', description: 'Complete 10 tests', tier: 'Common', icon: '🔥' },
  { id: 'hundred-tests', name: 'Centurion', description: 'Complete 100 tests', tier: 'Epic', icon: '👑' },
  { id: 'week-streak', name: 'Week Warrior', description: '7-day streak', tier: 'Rare', icon: '⚔️' },
  { id: 'month-streak', name: 'Unstoppable', description: '30-day streak', tier: 'Epic', icon: '⚡' },
  { id: 'sharp', name: 'Sharpshooter', description: 'Accuracy tax ≤ 5% on a 60s+ test', tier: 'Rare', icon: '🎯' },
  { id: 'speed-50', name: 'Speed Demon', description: 'Net WPM ≥ 50', tier: 'Common', icon: '🚀' },
  { id: 'driller', name: 'Practice Makes Permanent', description: 'Complete 5 mistake drills', tier: 'Rare', icon: '🛠️' },
];

/**
 * Format local date as YYYY-MM-DD in the user's local timezone.
 */
export function getLocalTodayDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get Monday of the current week as YYYY-MM-DD in user's local timezone.
 */
export function getMondayOfWeekString(d: Date = new Date()): string {
  const dayOfWeek = d.getDay(); // 0 is Sunday, 1 is Monday...
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() + diffToMonday);
  return getLocalTodayDateString(monday);
}

/**
 * Calendar days difference between two YYYY-MM-DD dates in local time.
 */
export function getDaysDifference(dateStr1: string, dateStr2: string): number {
  const [y1, m1, d1] = dateStr1.split('-').map(Number);
  const [y2, m2, d2] = dateStr2.split('-').map(Number);
  const dt1 = new Date(y1, m1 - 1, d1).getTime();
  const dt2 = new Date(y2, m2 - 1, d2).getTime();
  return Math.round((dt2 - dt1) / (1000 * 60 * 60 * 24));
}

/**
 * Level curve (Monkeytype-style sqrt): level = floor(sqrt(totalXp / 100)) + 1
 */
export function getLevelForXp(totalXp: number): number {
  return Math.floor(Math.sqrt(Math.max(0, totalXp) / 100)) + 1;
}

export function getXpProgressForLevel(totalXp: number): {
  level: number;
  currentLevelThreshold: number;
  nextLevelThreshold: number;
  currentLevelXp: number;
  xpNeededForNext: number;
  progressPercent: number;
} {
  const level = getLevelForXp(totalXp);
  const currentLevelThreshold = Math.pow(level - 1, 2) * 100;
  const nextLevelThreshold = Math.pow(level, 2) * 100;
  const currentLevelXp = Math.max(0, totalXp - currentLevelThreshold);
  const span = nextLevelThreshold - currentLevelThreshold;
  const xpNeededForNext = Math.max(0, nextLevelThreshold - totalXp);
  const progressPercent = span > 0 ? Math.min(100, Math.max(0, (currentLevelXp / span) * 100)) : 0;

  return {
    level,
    currentLevelThreshold,
    nextLevelThreshold,
    currentLevelXp,
    xpNeededForNext,
    progressPercent,
  };
}

export function getInitialProfile(): InstantTypingProfile {
  const now = new Date();
  return {
    version: 1,
    createdAt: now.toISOString(),
    xp: 0,
    stats: {
      testsCompleted: 0,
      totalSecondsTyped: 0,
      bestWpm: 0,
      bestAccuracy: 0,
      mistakeDrillsCompleted: 0,
      recentAccuracyTaxes: [],
    },
    streak: {
      current: 0,
      longest: 0,
      lastActiveDate: null,
      freezesAvailable: 1,
      freezeWeekStart: getMondayOfWeekString(now),
    },
    achievements: {},
    xpLedger: [],
  };
}

export function loadProfile(): InstantTypingProfile {
  if (typeof localStorage === 'undefined') return getInitialProfile();
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return getInitialProfile();
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === 1) {
      // Backfill defensive defaults if missing
      parsed.stats = parsed.stats || {};
      if (typeof parsed.stats.testsCompleted !== 'number') parsed.stats.testsCompleted = 0;
      if (typeof parsed.stats.totalSecondsTyped !== 'number') parsed.stats.totalSecondsTyped = 0;
      if (typeof parsed.stats.bestWpm !== 'number') parsed.stats.bestWpm = 0;
      if (typeof parsed.stats.bestAccuracy !== 'number') parsed.stats.bestAccuracy = 0;
      if (typeof parsed.stats.mistakeDrillsCompleted !== 'number') parsed.stats.mistakeDrillsCompleted = 0;
      if (!Array.isArray(parsed.stats.recentAccuracyTaxes)) parsed.stats.recentAccuracyTaxes = [];

      parsed.streak = parsed.streak || {};
      if (typeof parsed.streak.current !== 'number') parsed.streak.current = 0;
      if (typeof parsed.streak.longest !== 'number') parsed.streak.longest = 0;
      if (typeof parsed.streak.freezesAvailable !== 'number') parsed.streak.freezesAvailable = 1;

      parsed.achievements = parsed.achievements || {};
      parsed.xpLedger = Array.isArray(parsed.xpLedger) ? parsed.xpLedger : [];
      return parsed as InstantTypingProfile;
    }
  } catch (err) {
    console.error('Failed to parse it_profile_v1, initializing default profile', err);
  }
  return getInitialProfile();
}

export function saveProfile(profile: InstantTypingProfile): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent('it-profile-updated', { detail: profile }));
  } catch (err) {
    console.error('Failed to save profile to localStorage', err);
  }
}

export function deleteProfileData(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('it-profile-updated', { detail: getInitialProfile() }));
  } catch (err) {
    console.error('Failed to delete profile data', err);
  }
}

export interface CompletedTestInput {
  netWpm: number;
  rawWpm: number;
  accuracy: number;
  durationSeconds: number;
  isDrill?: boolean;
}

export interface ProfileUpdateResult {
  profile: InstantTypingProfile;
  xpAwarded: {
    base: number;
    bonuses: Array<{ label: string; amount: number }>;
    total: number;
    eligible: boolean;
  };
  levelBefore: number;
  levelAfter: number;
  newAchievements: AchievementDef[];
  streakUpdated: boolean;
  streakSurvivedByFreeze: boolean;
}

/**
 * Single entry point called on test completion.
 * Updates streak, XP, stats, checks achievements, and persists to localStorage.
 */
export function updateProfileAfterTest(input: CompletedTestInput): ProfileUpdateResult {
  const profile = loadProfile();
  const now = new Date();
  const today = getLocalTodayDateString(now);
  const thisMonday = getMondayOfWeekString(now);

  const levelBefore = getLevelForXp(profile.xp);

  // 1. Monday freeze refresh check
  if (profile.streak.freezeWeekStart !== thisMonday) {
    profile.streak.freezesAvailable = 1;
    profile.streak.freezeWeekStart = thisMonday;
  }

  // 2. Streak update rules
  let streakUpdated = false;
  let streakSurvivedByFreeze = false;
  const isFirstTestToday = profile.streak.lastActiveDate !== today;

  if (!profile.streak.lastActiveDate) {
    // First test ever
    profile.streak.current = 1;
    profile.streak.longest = Math.max(profile.streak.longest, 1);
    profile.streak.lastActiveDate = today;
    streakUpdated = true;
  } else {
    const diffDays = getDaysDifference(profile.streak.lastActiveDate, today);
    if (diffDays === 0) {
      // Same day -> no-op (streak already counted today)
      streakUpdated = false;
    } else if (diffDays === 1) {
      // Next calendar day -> current + 1
      profile.streak.current += 1;
      profile.streak.longest = Math.max(profile.streak.longest, profile.streak.current);
      profile.streak.lastActiveDate = today;
      streakUpdated = true;
    } else if (diffDays === 2 && profile.streak.freezesAvailable > 0) {
      // Gap of exactly 2 days AND freezesAvailable > 0 -> consume freeze, streak survives
      profile.streak.freezesAvailable -= 1;
      profile.streak.current += 1;
      profile.streak.longest = Math.max(profile.streak.longest, profile.streak.current);
      profile.streak.lastActiveDate = today;
      streakUpdated = true;
      streakSurvivedByFreeze = true;
    } else {
      // Larger gap -> reset streak to 1, longest preserved
      profile.streak.current = 1;
      profile.streak.lastActiveDate = today;
      streakUpdated = true;
    }
  }

  // 3. Stats update
  const previousBestWpm = profile.stats.bestWpm;
  profile.stats.testsCompleted += 1;
  profile.stats.totalSecondsTyped += Math.round(input.durationSeconds);
  const isNewPersonalBest = input.netWpm > previousBestWpm;
  if (isNewPersonalBest) {
    profile.stats.bestWpm = input.netWpm;
  }
  if (input.accuracy > profile.stats.bestAccuracy) {
    profile.stats.bestAccuracy = input.accuracy;
  }
  if (input.isDrill) {
    profile.stats.mistakeDrillsCompleted = (profile.stats.mistakeDrillsCompleted || 0) + 1;
  }

  // Accuracy tax tracking: accuracyTax = max(0, rawWpm - netWpm)
  const currentAccuracyTax = Math.max(0, input.rawWpm - input.netWpm);
  const recentTaxes = profile.stats.recentAccuracyTaxes || [];
  let accuracyTaxImproved = false;
  if (recentTaxes.length >= 1) {
    const rollingAvg = recentTaxes.reduce((a, b) => a + b, 0) / recentTaxes.length;
    if (currentAccuracyTax < rollingAvg) {
      accuracyTaxImproved = true;
    }
  }
  // Keep rolling last 10
  recentTaxes.push(currentAccuracyTax);
  if (recentTaxes.length > 10) recentTaxes.shift();
  profile.stats.recentAccuracyTaxes = recentTaxes;

  // 4. XP Calculation (minimum 15 seconds typing to qualify)
  const isEligibleForXp = input.durationSeconds >= 15;
  let base = 0;
  const bonuses: Array<{ label: string; amount: number }> = [];
  let totalXpGained = 0;

  if (isEligibleForXp) {
    // base = round(netWpm * (accuracy / 100))
    base = Math.round(input.netWpm * (input.accuracy / 100));

    // Bonus: New personal best (+50)
    if (isNewPersonalBest) {
      bonuses.push({ label: 'Personal best!', amount: 50 });
    }

    // Bonus: Accuracy tax improved (+30)
    if (accuracyTaxImproved) {
      bonuses.push({ label: 'Cleaner than your average', amount: 30 });
    }

    // Bonus: Streak day (+10)
    if (profile.streak.current >= 1) {
      bonuses.push({ label: `Day ${profile.streak.current} streak`, amount: 10 });
    }

    // Bonus: First test of the day (+5)
    if (isFirstTestToday) {
      bonuses.push({ label: 'Daily warmup', amount: 5 });
    }

    totalXpGained = base + bonuses.reduce((acc, b) => acc + b.amount, 0);

    profile.xp += totalXpGained;

    // Record in xpLedger (last 50 entries)
    profile.xpLedger.unshift({
      at: now.toISOString(),
      base,
      bonuses,
      total: totalXpGained,
    });
    if (profile.xpLedger.length > 50) {
      profile.xpLedger = profile.xpLedger.slice(0, 50);
    }
  }

  const levelAfter = getLevelForXp(profile.xp);

  // 5. Achievement checks (launch set of 8)
  const newAchievements: AchievementDef[] = [];
  function checkUnlock(id: string, condition: boolean) {
    if (!profile.achievements[id] && condition) {
      profile.achievements[id] = now.toISOString();
      const def = ACHIEVEMENTS.find(a => a.id === id);
      if (def) newAchievements.push(def);
    }
  }

  // 1. first-test: Complete 1 test
  checkUnlock('first-test', profile.stats.testsCompleted >= 1);
  // 2. ten-tests: Complete 10 tests
  checkUnlock('ten-tests', profile.stats.testsCompleted >= 10);
  // 3. hundred-tests: Complete 100 tests
  checkUnlock('hundred-tests', profile.stats.testsCompleted >= 100);
  // 4. week-streak: 7-day streak
  checkUnlock('week-streak', profile.streak.current >= 7);
  // 5. month-streak: 30-day streak
  checkUnlock('month-streak', profile.streak.current >= 30);
  // 6. sharp: Accuracy tax <= 5% on a 60s+ test
  const accuracyTaxPercent = input.rawWpm > 0 ? ((input.rawWpm - input.netWpm) / input.rawWpm) * 100 : 0;
  checkUnlock('sharp', input.durationSeconds >= 60 && accuracyTaxPercent <= 5);
  // 7. speed-50: Net WPM >= 50
  checkUnlock('speed-50', input.netWpm >= 50);
  // 8. driller: Complete 5 mistake drills
  checkUnlock('driller', (profile.stats.mistakeDrillsCompleted || 0) >= 5);

  // 6. Save and broadcast
  saveProfile(profile);

  return {
    profile,
    xpAwarded: {
      base,
      bonuses,
      total: totalXpGained,
      eligible: isEligibleForXp,
    },
    levelBefore,
    levelAfter,
    newAchievements,
    streakUpdated,
    streakSurvivedByFreeze,
  };
}

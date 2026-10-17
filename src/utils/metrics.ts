export interface TestHistoryEntry {
  id: string;
  timestamp: number;
  mode: string;
  durationSeconds: number;
  netWpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  correctChars: number;
  incorrectChars: number;
  missedWords: string[];
  wpmHistory?: number[];
}

export interface MetricSummary {
  netWpm: number;
  rawWpm: number;
  accuracy: number;
  totalKeystrokes: number;
  correctChars: number;
  incorrectChars: number;
  elapsedSeconds: number;
  consistency: number;
  percentileText: string;
  rankTitle: string;
}

export interface KeyMistakeStat {
  key: string;
  errors: number;
  total: number;
  errorRate: number;
}

/**
 * Calculates instantaneous Net WPM for a discrete time slice (default 1 second).
 * Formula: (characters typed during slice ÷ 5) ÷ (slice duration in seconds / 60)
 * Evaluates to: (characters typed ÷ 5) * (60 / slice duration)
 */
export function calculateInstantaneousWpm(charsInSlice: number, sliceDurationSeconds: number = 1): number {
  if (sliceDurationSeconds <= 0 || charsInSlice <= 0) return 0;
  const wpm = Math.round((charsInSlice / 5) * (60 / sliceDurationSeconds));
  // cap at human limit — anything higher is a paste/autocorrect/timing glitch
  return Math.max(0, Math.min(wpm, 250));
}

export function calculateMetrics(
  correctChars: number,
  incorrectChars: number,
  elapsedSeconds: number,
  wpmHistory: number[] = []
): MetricSummary {
  const timeMinutes = Math.max(elapsedSeconds / 60, 0.001);
  const totalKeystrokes = correctChars + incorrectChars;

  // Standard international typing speed definition: 5 characters = 1 word
  const rawWpm = Math.round((totalKeystrokes / 5) / timeMinutes);
  const netWpm = Math.max(0, Math.round((correctChars / 5) / timeMinutes));

  const accuracy = totalKeystrokes > 0
    ? Math.min(100, Math.max(0, Math.round((correctChars / totalKeystrokes) * 1000) / 10))
    : 100;

  // Consistency: measure standard deviation of WPM across seconds
  let consistency = 100;
  if (wpmHistory.length > 2) {
    const mean = wpmHistory.reduce((a, b) => a + b, 0) / wpmHistory.length;
    if (mean > 0) {
      const variance = wpmHistory.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / wpmHistory.length;
      const stdDev = Math.sqrt(variance);
      const cv = (stdDev / mean) * 100;
      consistency = Math.max(0, Math.min(100, Math.round(100 - cv)));
    }
  }

  const { rankTitle, percentileText } = getPercentileRank(netWpm);

  return {
    netWpm,
    rawWpm,
    accuracy,
    totalKeystrokes,
    correctChars,
    incorrectChars,
    elapsedSeconds,
    consistency,
    percentileText,
    rankTitle
  };
}

export function getPercentileRank(wpm: number): { rankTitle: string; percentileText: string } {
  // Honest skill bands — no fabricated percentiles.
  if (wpm >= 110) {
    return { rankTitle: "Elite", percentileText: "Elite skill band · 110+ WPM" };
  } else if (wpm >= 80) {
    return { rankTitle: "Advanced", percentileText: "Advanced skill band · 80+ WPM" };
  } else if (wpm >= 65) {
    return { rankTitle: "Upper-Intermediate", percentileText: "Upper-intermediate band · 65+ WPM" };
  } else if (wpm >= 50) {
    return { rankTitle: "Intermediate", percentileText: "Intermediate band · 50+ WPM" };
  } else if (wpm >= 38) {
    return { rankTitle: "Developing", percentileText: "Developing band · 38+ WPM" };
  } else {
    return { rankTitle: "Starting", percentileText: "Starting band · below 38 WPM" };
  }
}

// Local storage history helpers
const STORAGE_KEY = 'ptt_test_history_v1';

export function saveTestResult(entry: TestHistoryEntry): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getTestHistory();
    const sanitizedEntry: TestHistoryEntry = {
      ...entry,
      wpmHistory: entry.wpmHistory ? entry.wpmHistory.slice(0, 180) : undefined,
    };
    const updated = [sanitizedEntry, ...existing].slice(0, 50); // keep last 50
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function getTestHistory(): TestHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getPersonalBest(): { highestWpm: number; highestAccuracy: number; totalTests: number } {
  const history = getTestHistory();
  if (history.length === 0) {
    return { highestWpm: 0, highestAccuracy: 0, totalTests: 0 };
  }
  let highestWpm = 0;
  let highestAccuracy = 0;
  history.forEach(item => {
    if (item.netWpm > highestWpm) highestWpm = item.netWpm;
    if (item.accuracy > highestAccuracy) highestAccuracy = item.accuracy;
  });
  return { highestWpm, highestAccuracy, totalTests: history.length };
}

export type WordPoolTier = "beginner" | "intermediate" | "advanced";

/**
 * Determines the recommended word pool difficulty tier based on the user's test history.
 * Reads the user's average net WPM from completed tests in localStorage.
 *
 * Cutoff rationale:
 * - < 40 WPM: 'beginner'
 *   Targets typists in 'Starting' (<25 WPM) and 'Developing' (25–39 WPM) skill bands.
 *   Focuses on building basic muscle memory and finger positioning on common, forgiving words.
 * - 40–70 WPM: 'intermediate'
 *   Targets solid 'Intermediate' (40–59 WPM) and early 'Upper-Intermediate' (60–70 WPM) typists.
 *   Standard balanced everyday English vocabulary.
 * - > 70 WPM: 'advanced'
 *   Targets fast typists in late 'Upper-Intermediate' (70–79 WPM), 'Advanced' (80–99 WPM),
 *   and 'Elite' (100+ WPM). Challenges high-speed typists with polysyllabic, academic,
 *   and complex orthographical rhythm.
 *
 * New users with no completed tests default to 'beginner'.
 */
export function getRecommendedTier(history?: TestHistoryEntry[]): WordPoolTier {
  const entries = history ?? getTestHistory();
  if (!entries || entries.length === 0) {
    return "beginner";
  }
  const totalNet = entries.reduce((acc, t) => acc + (t.netWpm || 0), 0);
  const avgWpm = totalNet / entries.length;

  if (avgWpm < 40) {
    return "beginner";
  } else if (avgWpm <= 70) {
    return "intermediate";
  } else {
    return "advanced";
  }
}


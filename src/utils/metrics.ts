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
  if (wpm >= 100) {
    return { rankTitle: "Elite", percentileText: "Elite skill band · 100+ WPM" };
  } else if (wpm >= 80) {
    return { rankTitle: "Advanced", percentileText: "Advanced skill band · 80+ WPM" };
  } else if (wpm >= 60) {
    return { rankTitle: "Upper-Intermediate", percentileText: "Upper-intermediate band · 60+ WPM" };
  } else if (wpm >= 40) {
    return { rankTitle: "Intermediate", percentileText: "Intermediate band · 40+ WPM" };
  } else if (wpm >= 25) {
    return { rankTitle: "Developing", percentileText: "Developing band · 25+ WPM" };
  } else {
    return { rankTitle: "Starting", percentileText: "Starting band · below 25 WPM" };
  }
}

// Local storage history helpers
const STORAGE_KEY = 'ptt_test_history_v1';

export function saveTestResult(entry: TestHistoryEntry): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getTestHistory();
    const updated = [entry, ...existing].slice(0, 50); // keep last 50
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

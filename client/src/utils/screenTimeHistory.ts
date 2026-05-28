import type {
  DailyUsageHistoryEntry,
  ScreenTimeReportDay,
} from "@/src/api/device";
import { getJerusalemDateKey, getJerusalemWeekDateKeys } from "@/src/utils/time";

const WEEKDAY_CHART_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

// Keeps only valid daily history rows with non-negative minutes.
function normalizeDailyHistory(
  history: DailyUsageHistoryEntry[] | undefined
): DailyUsageHistoryEntry[] {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter((entry) => entry?.dateKey)
    .map((entry) => ({
      dateKey: String(entry.dateKey),
      usedMinutes: Math.max(0, Number(entry.usedMinutes ?? 0)),
    }));
}

// Finds one day in normalized daily history.
function getHistoryEntry(
  history: DailyUsageHistoryEntry[],
  dateKey: string
): DailyUsageHistoryEntry | null {
  return history.find((entry) => entry.dateKey === dateKey) ?? null;
}

// Resolves used minutes for a calendar day from DB history and live today usage.
export function getUsedMinutesForDateKey(
  history: DailyUsageHistoryEntry[] | undefined,
  dateKey: string,
  todayKey: string,
  usedTodayMinutes: number
): number {
  const normalized = normalizeDailyHistory(history);
  const entry = getHistoryEntry(normalized, dateKey);

  if (entry) {
    return entry.usedMinutes;
  }

  if (dateKey === todayKey) {
    return Math.max(0, Number(usedTodayMinutes ?? 0));
  }

  return 0;
}

// Returns true when the DB has a history row or live usage for that day.
export function hasUsageDataForDateKey(
  history: DailyUsageHistoryEntry[] | undefined,
  dateKey: string,
  todayKey: string,
  usedTodayMinutes: number
): boolean {
  if (getHistoryEntry(normalizeDailyHistory(history), dateKey)) {
    return true;
  }

  return dateKey === todayKey && Number(usedTodayMinutes ?? 0) > 0;
}

// Builds the current Jerusalem week day breakdown from DB dailyUsageHistory.
export function buildReportDaysFromHistory(
  dailyUsageHistory: DailyUsageHistoryEntry[] | undefined,
  usedTodayMinutes: number,
  now: Date = new Date()
): ScreenTimeReportDay[] {
  const todayKey = getJerusalemDateKey(now);
  const weekDateKeys = getJerusalemWeekDateKeys(now);

  return weekDateKeys.map((dateKey, index) => ({
    weekdayLabel: WEEKDAY_CHART_LABELS[index] ?? "",
    dateKey,
    date: "",
    usedMinutes: getUsedMinutesForDateKey(
      dailyUsageHistory,
      dateKey,
      todayKey,
      usedTodayMinutes
    ),
    hasData: hasUsageDataForDateKey(
      dailyUsageHistory,
      dateKey,
      todayKey,
      usedTodayMinutes
    ),
  }));
}

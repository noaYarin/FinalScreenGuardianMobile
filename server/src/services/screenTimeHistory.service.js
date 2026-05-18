import moment from "moment-timezone";
import {
  getJerusalemDateKey,
  getJerusalemWeekDateKeys,
  isSameJerusalemDay,
  JERUSALEM_TZ,
  WEEKDAY_CHART_LABELS
} from "../utils/time.js";
import {
  findDeviceScreenTimeById,
  resetDailyScreenTime,
  updateDeviceUsedTodayMinutes
} from "../dal/device.dal.js";

// Maximum number of history entries to keep
const MAX_HISTORY_ENTRIES = 30;

// Validates time history 
function normalizeHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter((entry) => entry?.dateKey)
    .map((entry) => ({
      dateKey: String(entry.dateKey),
      usedMinutes: Math.max(0, Number(entry.usedMinutes ?? 0)),
      recordedAt: entry.recordedAt ? new Date(entry.recordedAt) : new Date()
    }));
}

// Updates an existing date's screen time or pushes a new entry, maintaining a sorted list capped at 30 entries
function upsertHistoryEntry(history, dateKey, usedMinutes) {
  const nextHistory = normalizeHistory(history);
  const safeMinutes = Math.max(0, Number(usedMinutes ?? 0));
  const existingIndex = nextHistory.findIndex((entry) => entry.dateKey === dateKey);

  if (existingIndex >= 0) {
    nextHistory[existingIndex] = {
      dateKey,
      usedMinutes: safeMinutes,
      recordedAt: new Date()
    };
  } else {
    nextHistory.push({
      dateKey,
      usedMinutes: safeMinutes,
      recordedAt: new Date()
    });
  }

  // Sort the history by date key and keep only the last 30 entries;
  return nextHistory
    .sort((left, right) => left.dateKey.localeCompare(right.dateKey))
    .slice(-MAX_HISTORY_ENTRIES);
}

// Builds a map of date keys to used minutes
function buildHistoryMap(history, todayKey, usedTodayMinutes) {
  const map = new Map();

  for (const entry of normalizeHistory(history)) {
    map.set(entry.dateKey, entry.usedMinutes);
  }

  map.set(todayKey, Math.max(0, Number(usedTodayMinutes ?? 0)));
  return map;
}

// Calculates the total screen time minutes accumulated across all days of the current week
export function calculateUsedWeekMinutes(history, todayKey, usedTodayMinutes) {
  const weekKeys = getJerusalemWeekDateKeys();
  const map = buildHistoryMap(history, todayKey, usedTodayMinutes);

  return weekKeys.reduce((total, dateKey) => total + (map.get(dateKey) ?? 0), 0);
}

// Saves today's current usage minutes and updates both history logs and the weekly totals
export async function persistDailyUsageSnapshot(deviceId, usedTodayMinutes, now = new Date()) {
  const device = await findDeviceScreenTimeById(deviceId);

  if (!device) {
    return null;
  }

  const todayKey = getJerusalemDateKey(now);
  const screenTime = device.screenTime ?? {};
  const nextHistory = upsertHistoryEntry(
    screenTime.dailyUsageHistory,
    todayKey,
    usedTodayMinutes
  );
  const usedWeekMinutes = calculateUsedWeekMinutes(
    nextHistory,
    todayKey,
    usedTodayMinutes
  );

  return updateDeviceUsedTodayMinutes(deviceId, usedTodayMinutes, {
    "screenTime.dailyUsageHistory": nextHistory,
    "screenTime.usedWeekMinutes": usedWeekMinutes
  });
}

// Archives the screen time for the day 
export async function archiveScreenTimeDayBeforeReset(device, now = new Date()) {
  if (!device) {
    return normalizeHistory([]);
  }

  const screenTime = device.screenTime ?? {};
  const usedTodayMinutes = Math.max(0, Number(screenTime.usedTodayMinutes ?? 0));

  if (usedTodayMinutes <= 0) {
    return normalizeHistory(screenTime.dailyUsageHistory);
  }

  const lastResetAt = screenTime.lastDailyResetAt
    ? new Date(screenTime.lastDailyResetAt)
    : now;
  const archiveDateKey = getJerusalemDateKey(lastResetAt);

  return upsertHistoryEntry(
    screenTime.dailyUsageHistory,
    archiveDateKey,
    usedTodayMinutes
  );
}

export async function resetDailyScreenTimeWithHistory(deviceId, now = new Date()) {
  const device = await findDeviceScreenTimeById(deviceId);

  if (!device) {
    return null;
  }

  const archivedHistory = await archiveScreenTimeDayBeforeReset(device, now);

  return resetDailyScreenTime(deviceId, now, archivedHistory);
}

// Finds the top application by used today minutes
function findTopApp(applications) {
  if (!Array.isArray(applications) || applications.length === 0) {
    return null;
  }

  const sorted = [...applications].sort(
    (left, right) =>
      Number(right?.screenTime?.usedTodayMinutes ?? 0) -
      Number(left?.screenTime?.usedTodayMinutes ?? 0)
  );
  const top = sorted[0];
  const usedMinutes = Number(top?.screenTime?.usedTodayMinutes ?? 0);

  if (!top || usedMinutes <= 0) {
    return null;
  }

  return top.appName ?? top.name ?? top.packageName ?? null;
}

// Builds a usage report for the screen time
export function buildScreenTimeUsageReport(device, now = new Date()) {
  const screenTime = device?.screenTime ?? {};
  const todayKey = getJerusalemDateKey(now);
  const weekDateKeys = getJerusalemWeekDateKeys(now);
  const historyMap = buildHistoryMap(
    screenTime.dailyUsageHistory,
    todayKey,
    screenTime.usedTodayMinutes
  );

  const days = weekDateKeys.map((dateKey, index) => {
    const date = moment.tz(dateKey, "YYYY-MM-DD", JERUSALEM_TZ).toDate();

    return {
      weekdayLabel: WEEKDAY_CHART_LABELS[index],
      dateKey,
      date: date.toISOString(),
      usedMinutes: historyMap.get(dateKey) ?? 0
    };
  });

  const weeklyTotalMinutes = days.reduce(
    (total, day) => total + day.usedMinutes,
    0
  );
  const dailyAverageMinutes = Math.round(weeklyTotalMinutes / 7);

  return {
    days,
    weeklyTotalMinutes,
    dailyAverageMinutes,
    topApp: findTopApp(device?.applications) ?? null,
    hasLinkedDevice: true
  };
}

// Checks whether a calendar day has passed in Jerusalem time since the last reset, indicating a new reset is required
export function isDeviceDayResetDue(device, now = new Date()) {
  const lastReset = device?.screenTime?.lastDailyResetAt
    ? new Date(device.screenTime.lastDailyResetAt)
    : null;

  return !lastReset || !isSameJerusalemDay(lastReset, now);
}

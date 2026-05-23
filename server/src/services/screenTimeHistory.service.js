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
const MAX_HISTORY_ENTRIES = 35;

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

// Updates an existing date's screen time or pushes a new entry, maintaining a sorted list capped at 35 entries
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

  // Sort the history by date key and keep only the last 35 entries;
  return nextHistory
    .sort((left, right) => left.dateKey.localeCompare(right.dateKey))
    .slice(-MAX_HISTORY_ENTRIES);
}

function getHistoryEntry(history, dateKey) {
  return normalizeHistory(history).find((entry) => entry.dateKey === dateKey) ?? null;
}

export function getUsedMinutesForDateKey(
  history,
  dateKey,
  todayKey,
  usedTodayMinutes
) {
  const entry = getHistoryEntry(history, dateKey);

  if (entry) {
    return entry.usedMinutes;
  }

  if (dateKey === todayKey) {
    return Math.max(0, Number(usedTodayMinutes ?? 0));
  }

  return 0;
}

export function hasUsageDataForDateKey(
  history,
  dateKey,
  todayKey,
  usedTodayMinutes
) {
  if (getHistoryEntry(history, dateKey)) {
    return true;
  }

  return dateKey === todayKey && Number(usedTodayMinutes ?? 0) > 0;
}

function sumMinutesForWeek(history, weekDateKeys, todayKey, usedTodayMinutes) {
  return weekDateKeys.reduce(
    (total, dateKey) =>
      total + getUsedMinutesForDateKey(history, dateKey, todayKey, usedTodayMinutes),
    0
  );
}

function weekHasUsageData(history, weekDateKeys, todayKey, usedTodayMinutes) {
  return weekDateKeys.some((dateKey) =>
    hasUsageDataForDateKey(history, dateKey, todayKey, usedTodayMinutes)
  );
}

// Calculates the total screen time minutes accumulated across all days of the current week
export function calculateUsedWeekMinutes(history, todayKey, usedTodayMinutes, now = new Date()) {
  const weekKeys = getJerusalemWeekDateKeys(now);

  return weekKeys.reduce(
    (total, dateKey) =>
      total + getUsedMinutesForDateKey(history, dateKey, todayKey, usedTodayMinutes),
    0
  );
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
    usedTodayMinutes,
    now
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
  const history = normalizeHistory(screenTime.dailyUsageHistory);

  if (usedTodayMinutes <= 0) {
    return history;
  }

  const todayKey = getJerusalemDateKey(now);
  const archiveDateKey = moment
    .tz(todayKey, "YYYY-MM-DD", JERUSALEM_TZ)
    .subtract(1, "day")
    .format("YYYY-MM-DD");

  return upsertHistoryEntry(history, archiveDateKey, usedTodayMinutes);
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
  const history = normalizeHistory(screenTime.dailyUsageHistory);
  const usedTodayMinutes = Math.max(0, Number(screenTime.usedTodayMinutes ?? 0));

  const days = weekDateKeys.map((dateKey, index) => {
    const date = moment.tz(dateKey, "YYYY-MM-DD", JERUSALEM_TZ).toDate();
    const usedMinutes = getUsedMinutesForDateKey(
      history,
      dateKey,
      todayKey,
      usedTodayMinutes
    );

    return {
      weekdayLabel: WEEKDAY_CHART_LABELS[index],
      dateKey,
      date: date.toISOString(),
      usedMinutes,
      hasData: hasUsageDataForDateKey(history, dateKey, todayKey, usedTodayMinutes)
    };
  });

  const weeks = [3, 2, 1, 0].map((weeksAgo) => {
    const weekDateKeys = getJerusalemWeekDateKeys(
      moment(now).tz(JERUSALEM_TZ).subtract(weeksAgo * 7, "days").toDate()
    );

    return {
      weekLabel: moment.tz(weekDateKeys[0], "YYYY-MM-DD", JERUSALEM_TZ).format("D/M"),
      weekStartKey: weekDateKeys[0],
      weekEndKey: weekDateKeys[6],
      usedMinutes: sumMinutesForWeek(history, weekDateKeys, todayKey, usedTodayMinutes),
      hasData: weekHasUsageData(history, weekDateKeys, todayKey, usedTodayMinutes)
    };
  });

  const weeklyTotalMinutes = days.reduce((total, day) => total + day.usedMinutes, 0);
  const monthlyTotalMinutes = weeks.reduce((total, week) => total + week.usedMinutes, 0);
  const daysWithData = days.filter((day) => day.hasData).length;
  const weeksWithData = weeks.filter((week) => week.hasData).length;

  return {
    days,
    weeks,
    weeklyTotalMinutes,
    monthlyTotalMinutes,
    dailyAverageMinutes:
      daysWithData > 0 ? Math.round(weeklyTotalMinutes / daysWithData) : 0,
    monthlyAverageMinutes:
      weeksWithData > 0 ? Math.round(monthlyTotalMinutes / weeksWithData) : 0,
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

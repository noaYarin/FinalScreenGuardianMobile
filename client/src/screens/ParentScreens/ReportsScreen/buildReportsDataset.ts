import type { ScreenTimeUsageReport } from "@/src/api/parent";
import type { Device } from "@/src/api/device";
import type { HomeSummaryChild } from "@/src/api/parent";
import type { ReportsTimeRange } from "@/src/redux/slices/reports-slice";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const CHART_TITLE = {
  daily: "Daily usage",
  weekly: "Weekly usage",
} as const;
const NO_DATA = "No data yet";

type AppUsage = {
  name: string;
  usedTodayMinutes: number;
};

export type ScreenTimeSnapshot = {
  usedTodayMinutes: number;
  usedWeekMinutes: number;
  dailyLimitMinutes: number | null;
  applications: AppUsage[];
};

export type ReportsBarPoint = {
  value: number;
  label: string;
};

export type ReportsMetrics = {
  dailyAverageMinutes: number;
  weeklyTotalMinutes: number;
  topApp: string;
};

export type ReportsDataset = {
  chartTitle: string;
  bars: ReportsBarPoint[];
  metrics: ReportsMetrics;
};

export function pickRepresentativeDevice(devices: Device[]): Device | null {
  if (!Array.isArray(devices) || devices.length === 0) {
    return null;
  }

  const activeDevices = devices.filter((device) => device?.isActive !== false);

  if (activeDevices.length === 0) {
    return devices[0];
  }

  const lockedDevice = activeDevices.find((device) => device?.isLocked === true);
  if (lockedDevice) {
    return lockedDevice;
  }

  return activeDevices[0];
}

function minutesToChartHours(minutes: number): number {
  return Number((minutes / 60).toFixed(1));
}

function buildWeekDaysFromSnapshot(snapshot: ScreenTimeSnapshot) {
  const todayIndex = new Date().getDay();
  const usedToday = snapshot.usedTodayMinutes;
  const minutesBeforeToday = Math.max(snapshot.usedWeekMinutes - usedToday, 0);
  const pastDayCount = todayIndex;
  const minutesPerPastDay =
    pastDayCount > 0 ? minutesBeforeToday / pastDayCount : 0;

  return WEEKDAY_LABELS.map((weekdayLabel, index) => {
    let usedMinutes = 0;

    if (index === todayIndex) {
      usedMinutes = usedToday;
    } else if (index < todayIndex) {
      usedMinutes = minutesPerPastDay;
    }

    return {
      weekdayLabel,
      dateKey: "",
      date: "",
      usedMinutes: Math.round(usedMinutes),
    };
  });
}

export function buildUsageReportFromSnapshot(
  snapshot: ScreenTimeSnapshot
): ScreenTimeUsageReport {
  const days = buildWeekDaysFromSnapshot(snapshot);
  const weeklyTotalMinutes = days.reduce(
    (total, day) => total + day.usedMinutes,
    0
  );

  const sortedApps = [...snapshot.applications].sort(
    (left, right) => right.usedTodayMinutes - left.usedTodayMinutes
  );
  const topAppEntry = sortedApps[0];

  return {
    days,
    weeklyTotalMinutes,
    dailyAverageMinutes: Math.round(weeklyTotalMinutes / 7),
    topApp:
      topAppEntry && topAppEntry.usedTodayMinutes > 0
        ? topAppEntry.name
        : null,
    hasLinkedDevice: true,
  };
}

export function buildReportsDatasetFromReport(
  timeRange: ReportsTimeRange,
  report: ScreenTimeUsageReport
): ReportsDataset {
  const bars = (report.days ?? []).map((day) => ({
    label: day.weekdayLabel,
    value: minutesToChartHours(day.usedMinutes),
  }));

  return {
    chartTitle: CHART_TITLE[timeRange],
    bars,
    metrics: {
      dailyAverageMinutes: report.dailyAverageMinutes ?? 0,
      weeklyTotalMinutes: report.weeklyTotalMinutes ?? 0,
      topApp: report.topApp?.trim() ? report.topApp : NO_DATA,
    },
  };
}

export function screenTimeSnapshotFromDevice(
  device: Device | null
): ScreenTimeSnapshot | null {
  if (!device) {
    return null;
  }

  const screenTime = device.screenTime ?? {};
  const isLimitEnabled = screenTime.isLimitEnabled === true;
  const dailyLimitMinutes = isLimitEnabled
    ? Number(screenTime.dailyLimitMinutes ?? 0) +
      Number(screenTime.extraMinutesToday ?? 0)
    : null;

  return {
    usedTodayMinutes: Number(screenTime.usedTodayMinutes ?? 0),
    usedWeekMinutes: Number(screenTime.usedWeekMinutes ?? 0),
    dailyLimitMinutes,
    applications: (device.applications ?? []).map((app) => {
      const appScreenTime = (
        app as { screenTime?: { usedTodayMinutes?: number }; name?: string }
      ).screenTime;
      const label =
        (app as { appName?: string; name?: string }).appName ??
        (app as { name?: string }).name ??
        app.packageName;

      return {
        name: label,
        usedTodayMinutes: Number(appScreenTime?.usedTodayMinutes ?? 0),
      };
    }),
  };
}

export function mergeSnapshotWithHomeSummary(
  snapshot: ScreenTimeSnapshot,
  summary?: HomeSummaryChild | null
): ScreenTimeSnapshot {
  if (!summary) {
    return snapshot;
  }

  return {
    ...snapshot,
    usedTodayMinutes:
      summary.usedTodayMinutes ?? snapshot.usedTodayMinutes,
    dailyLimitMinutes:
      summary.dailyLimitMinutes ?? snapshot.dailyLimitMinutes,
  };
}

import type { ScreenTimeUsageReport } from "@/src/api/parent";
import type { Device } from "@/src/api/device";
import type { HomeSummaryChild } from "@/src/api/parent";
import type { ReportsTimeRange } from "@/src/redux/slices/reports-slice";
import { formatJerusalemWeekStartLabel } from "@/src/utils/time";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const CHART_TITLE = {
  daily: "Daily usage",
  weekly: "Last 4 weeks",
} as const;

const NO_DATA = "No data yet";

export function reportHasChartUsage(report: ScreenTimeUsageReport): boolean {
  return (
    (report.days?.some((day) => (day.usedMinutes ?? 0) > 0) ?? false) ||
    (report.weeks?.some((week) => (week.usedMinutes ?? 0) > 0) ?? false)
  );
}

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
  hasData?: boolean;
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
  isWeeklyChart: boolean;
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
  if (minutes <= 0) {
    return 0;
  }

  const hours = minutes / 60;
  const rounded = Number(hours.toFixed(1));

  return rounded > 0 ? rounded : 0.1;
}

function buildEmptyWeekDays(): ScreenTimeUsageReport["days"] {
  return WEEKDAY_LABELS.map((weekdayLabel) => ({
    weekdayLabel,
    dateKey: "",
    date: "",
    usedMinutes: 0,
    hasData: false,
  }));
}


function buildEmptyWeeks(): NonNullable<ScreenTimeUsageReport["weeks"]> {
  return Array.from({ length: 4 }, (_, index) => ({
    weekLabel: `W${index + 1}`,
    weekStartKey: "",
    weekEndKey: "",
    usedMinutes: 0,
    hasData: false,
  }));
}

export function buildEmptyUsageReport(): ScreenTimeUsageReport {
  return {
    days: buildEmptyWeekDays(),
    weeks: buildEmptyWeeks(),
    weeklyTotalMinutes: 0,
    monthlyTotalMinutes: 0,
    dailyAverageMinutes: 0,
    monthlyAverageMinutes: 0,
    topApp: null,
    hasLinkedDevice: true,
  }
}

export function buildReportsDatasetFromReport(
  timeRange: ReportsTimeRange,
  report: ScreenTimeUsageReport
): ReportsDataset {
  const hasChartUsage = reportHasChartUsage(report);
  const dailyTopAppLabel =
    hasChartUsage && report.dailyTopApp?.trim()
      ? report.dailyTopApp
      : hasChartUsage && report.topApp?.trim()
        ? report.topApp
        : NO_DATA;

  const weeklyTopAppLabel =
    hasChartUsage && report.weeklyTopApp?.trim()
      ? report.weeklyTopApp
      : hasChartUsage && report.topApp?.trim()
        ? report.topApp
        : NO_DATA;

  if (timeRange === "weekly") {
    const bars = (report.weeks ?? buildEmptyWeeks()).map((week) => ({
      label: formatJerusalemWeekStartLabel(week.weekStartKey),
      value: minutesToChartHours(week.usedMinutes),
      hasData: week.usedMinutes > 0,
    }));


    return {
      chartTitle: CHART_TITLE.weekly,
      bars,
      isWeeklyChart: true,
      metrics: {
        dailyAverageMinutes: report.monthlyAverageMinutes ?? 0,
        weeklyTotalMinutes: report.monthlyTotalMinutes ?? 0,
        topApp: weeklyTopAppLabel,
      },
    };
  }

  const bars = (report.days ?? buildEmptyWeekDays()).map((day) => ({
    label: day.weekdayLabel,
    value: minutesToChartHours(day.usedMinutes),
    hasData: day.usedMinutes > 0,
  }));

  return {
    chartTitle: CHART_TITLE.daily,
    bars,
    isWeeklyChart: false,
    metrics: {
      dailyAverageMinutes: report.dailyAverageMinutes ?? 0,
      weeklyTotalMinutes: report.weeklyTotalMinutes ?? 0,
      topApp: dailyTopAppLabel,
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


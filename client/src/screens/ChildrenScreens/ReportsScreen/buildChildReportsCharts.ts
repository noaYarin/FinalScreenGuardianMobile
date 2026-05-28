import type { ScreenTimeReportDay } from "@/src/api/device";
import { CHILD_MOOD_COLORS } from "@/src/components/ReportsScreen/childReportsTheme";
import { getJerusalemDateKey } from "@/src/utils/time";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export type ChildScreenTimeInput = {
  usedTodayMinutes: number;
  dailyLimitMinutes: number | null;
  days: ScreenTimeReportDay[];
};

export type ChildDayStatus = {
  label: string;
  usedMinutes: number;
  color: string;
  emoji: string;
  message: string;
  isToday: boolean;
  isFuture: boolean;
};

export type ChildDonutSlice = {
  value: number;
  color: string;
  label: string;
};

export type ChildReportsChartsData = {
  weekDays: ChildDayStatus[];
  donutSlices: ChildDonutSlice[];
  donutCenterLabel: string;
  donutCenterValue: string;
  donutNote: string | null;
  isLimitReached: boolean;
};

// Clamps usage to zero and to the daily limit when one exists.
function capUsedMinutes(
  usedMinutes: number,
  dailyLimitMinutes: number | null
): number {
  if (dailyLimitMinutes == null || dailyLimitMinutes <= 0) {
    return Math.max(0, usedMinutes);
  }

  return Math.min(Math.max(0, usedMinutes), dailyLimitMinutes);
}

// Formats minutes as a short duration label.
export function formatChildReportDuration(minutes: number) {
  const safeMinutes = Math.max(0, Math.round(minutes));
  const hours = Math.floor(safeMinutes / 60);
  const mins = safeMinutes % 60;

  if (hours === 0) {
    return `${mins}m`;
  }

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
}

// Picks emoji, color, and message for one day row.
function getDayDisplay(
  usedMinutes: number,
  dailyLimitMinutes: number | null
): { color: string; emoji: string; message: string } {
  const used = capUsedMinutes(usedMinutes, dailyLimitMinutes);

  if (used <= 0) {
    return {
      color: CHILD_MOOD_COLORS.empty,
      emoji: "😴",
      message: "No screen time",
    };
  }

  if (dailyLimitMinutes == null || dailyLimitMinutes <= 0) {
    return {
      color: CHILD_MOOD_COLORS.used,
      emoji: "📱",
      message: "Screen time logged",
    };
  }

  return {
    color: CHILD_MOOD_COLORS.good,
    emoji: "😊",
    message: "Within your limit",
  };
}

// Builds the today donut from live usage and the daily limit.
function buildTodayDonut(input: ChildScreenTimeInput) {
  const limit = input.dailyLimitMinutes;
  const used = capUsedMinutes(input.usedTodayMinutes, limit);

  if (limit == null || limit <= 0) {
    if (used <= 0) {
      return {
        slices: [
          { value: 1, color: CHILD_MOOD_COLORS.empty, label: "No data yet" },
        ],
        centerLabel: "Used today",
        centerValue: "No data yet",
        donutNote: null,
        isLimitReached: false,
      };
    }

    return {
      slices: [{ value: used, color: CHILD_MOOD_COLORS.donutUsed, label: "Used" }],
      centerLabel: "Used today",
      centerValue: formatChildReportDuration(used),
      donutNote: null,
      isLimitReached: false,
    };
  }

  const remaining = Math.max(0, limit - used);

  if (remaining === 0) {
    return {
      slices: [
        {
          value: Math.max(used, 1),
          color: CHILD_MOOD_COLORS.donutUsed,
          label: "Used",
        },
      ],
      centerLabel: "Limit reached",
      centerValue: formatChildReportDuration(used),
      donutNote:
        "Your daily limit is full. Only your parent can add more time.",
      isLimitReached: true,
    };
  }

  return {
    slices: [
      {
        value: Math.max(used, 1),
        color: CHILD_MOOD_COLORS.donutUsed,
        label: "Used",
      },
      {
        value: Math.max(remaining, 1),
        color: CHILD_MOOD_COLORS.donutUnused,
        label: "Not used yet",
      },
    ],
    centerLabel: "Left today",
    centerValue: formatChildReportDuration(remaining),
    donutNote: "Limits are set by your parent and stay on this device.",
    isLimitReached: false,
  };
}

// Builds week rows from the same daily report days the parent screen uses.
function buildWeekDays(input: ChildScreenTimeInput): ChildDayStatus[] {
  const todayKey = getJerusalemDateKey();
  const dailyLimit = input.dailyLimitMinutes;
  const reportDays = input.days.length > 0 ? input.days : buildEmptyWeekDays();

  const baseDays = reportDays.map((day, index) => {
    const label = WEEKDAY_LABELS[index] ?? day.weekdayLabel;
    const isFuture = Boolean(day.dateKey && day.dateKey > todayKey);
    const isToday = day.dateKey === todayKey;
    const usedMinutes = capUsedMinutes(Math.round(day.usedMinutes), dailyLimit);

    if (isFuture) {
      return {
        label,
        usedMinutes,
        color: CHILD_MOOD_COLORS.empty,
        emoji: "🌟",
        message: "Upcoming",
        isToday: false,
        isFuture: true,
      };
    }

    const display = getDayDisplay(usedMinutes, dailyLimit);

    return {
      label,
      usedMinutes,
      color: display.color,
      emoji: display.emoji,
      message: display.message,
      isToday,
      isFuture: false,
    };
  });

  const pastWithUsage = baseDays.filter(
    (day) => !day.isFuture && day.usedMinutes > 0
  );

  if (pastWithUsage.length === 0) {
    return baseDays;
  }

  const bestMinutes = Math.min(...pastWithUsage.map((day) => day.usedMinutes));

  return baseDays.map((day) => {
    if (
      day.isFuture ||
      day.usedMinutes <= 0 ||
      day.usedMinutes !== bestMinutes
    ) {
      return day;
    }

    return {
      ...day,
      message: "Lightest day this week",
      emoji: "🏆",
      color: CHILD_MOOD_COLORS.best,
    };
  });
}

// Returns an empty Sun–Sat row set when the server sends no day breakdown yet.
function buildEmptyWeekDays(): ScreenTimeReportDay[] {
  return WEEKDAY_LABELS.map((weekdayLabel) => ({
    weekdayLabel,
    dateKey: "",
    date: "",
    usedMinutes: 0,
    hasData: false,
  }));
}

// Turns DB screen-time data into child report chart props.
export function buildChildChartsFromScreenTime(
  input: ChildScreenTimeInput
): ChildReportsChartsData {
  const donut = buildTodayDonut(input);

  return {
    weekDays: buildWeekDays(input),
    donutSlices: donut.slices,
    donutCenterLabel: donut.centerLabel,
    donutCenterValue: donut.centerValue,
    donutNote: donut.donutNote,
    isLimitReached: donut.isLimitReached,
  };
}

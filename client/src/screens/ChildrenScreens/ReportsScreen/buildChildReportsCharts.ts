import { CHILD_MOOD_COLORS } from "@/src/components/ReportsScreen/childReportsTheme";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export type ScreenTimeSnapshot = {
  usedTodayMinutes: number;
  usedWeekMinutes: number;
  dailyLimitMinutes: number | null;
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

function capUsedMinutes(
  usedMinutes: number,
  dailyLimitMinutes: number | null
): number {
  if (dailyLimitMinutes == null || dailyLimitMinutes <= 0) {
    return Math.max(0, usedMinutes);
  }

  return Math.min(Math.max(0, usedMinutes), dailyLimitMinutes);
}

function formatDuration(minutes: number) {
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

function buildTodayDonut(snapshot: ScreenTimeSnapshot) {
  const limit = snapshot.dailyLimitMinutes;
  const used = capUsedMinutes(snapshot.usedTodayMinutes, limit);

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
      centerValue: formatDuration(used),
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
      centerValue: formatDuration(used),
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
    centerValue: formatDuration(remaining),
    donutNote: "Limits are set by your parent and stay on this device.",
    isLimitReached: false,
  };
}

function buildWeekDays(snapshot: ScreenTimeSnapshot): ChildDayStatus[] {
  const todayIndex = new Date().getDay();
  const dailyLimit = snapshot.dailyLimitMinutes;
  const usedToday = snapshot.usedTodayMinutes;
  const minutesBeforeToday = Math.max(
    snapshot.usedWeekMinutes - usedToday,
    0
  );
  const minutesPerPastDay =
    todayIndex > 0 ? minutesBeforeToday / todayIndex : 0;

  const baseDays = WEEKDAYS.map((label, index) => {
    const isFuture = index > todayIndex;
    let rawMinutes = 0;

    if (index === todayIndex) {
      rawMinutes = usedToday;
    } else if (index < todayIndex) {
      rawMinutes = minutesPerPastDay;
    }

    const usedMinutes = capUsedMinutes(Math.round(rawMinutes), dailyLimit);

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
      isToday: index === todayIndex,
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
      day.usedMinutes !== bestMinutes     ) {
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

export function buildChildChartsFromSnapshot(
  snapshot: ScreenTimeSnapshot
): ChildReportsChartsData {
  const donut = buildTodayDonut(snapshot);

  return {
    weekDays: buildWeekDays(snapshot),
    donutSlices: donut.slices,
    donutCenterLabel: donut.centerLabel,
    donutCenterValue: donut.centerValue,
    donutNote: donut.donutNote,
    isLimitReached: donut.isLimitReached,
  };
}

export { formatDuration as formatChildReportDuration };

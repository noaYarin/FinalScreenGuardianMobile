import type { Device } from "@/src/api/device";

export type ChildDetailsDeviceRow = {
  id: string;
  name: string;
  typeLabel: string;
  platformLabel: string;
  active: boolean;
  locationText: string;

  isLocked: boolean;
  isLimitEnabled: boolean;

  limitMode: "NONE" | "DAILY" | "WEEKLY" | "SCHEDULE";

  dailyLimitMinutes: number | null;
  weeklyLimitMinutes: number | null;
  extraMinutesToday: number;

  usedTodayMinutes: number;
  usedWeekMinutes: number;

  usedMinutes: number | null;
  limitMinutes: number | null;
  remainingMinutes: number | null;

  manualLockEnabled: boolean;
  dailyLimitLockActive: boolean;
  weeklyLimitLockActive: boolean;
  scheduleLockActive: boolean;
};

function translateDeviceType(raw: string | undefined): string {
  const key = (raw ?? "").toUpperCase();
  if (key === "PHONE") return "Phone";
  if (key === "TABLET") return "Tablet";
  return "Other";
}

function translateDevicePlatform(raw: string | undefined): string {
  const key = (raw ?? "").toUpperCase();
  if (key === "ANDROID") return "Android";
  if (key === "IOS") return "IOS";
  return "Other";
}

function normalizeLimitMode(raw: string | undefined): ChildDetailsDeviceRow["limitMode"] {
  const key = (raw ?? "").toUpperCase();

  if (key === "DAILY") return "DAILY";
  if (key === "WEEKLY") return "WEEKLY";
  if (key === "SCHEDULE") return "SCHEDULE";

  return "NONE";
}

export function mapDevicesToRows(devices: Device[]): ChildDetailsDeviceRow[] {
  return devices.map((d) => {
    const name = d.name?.trim() ? d.name : "—";

    const lat = typeof d.location?.lat === "number" ? d.location.lat : 0;
    const lng = typeof d.location?.lng === "number" ? d.location.lng : 0;

    const loc =
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      (lat !== 0 || lng !== 0)
        ? `${lat.toFixed(5)}, ${lng.toFixed(5)}`
        : "Unknown";

    const isLimitEnabled = d.screenTime?.isLimitEnabled === true;

    const limitMode = isLimitEnabled
      ? normalizeLimitMode(d.screenTime?.limitMode)
      : "NONE";

    const dailyLimitMinutes = isLimitEnabled
      ? Number(d.screenTime?.dailyLimitMinutes ?? 0)
      : null;

    const weeklyLimitMinutes = isLimitEnabled
      ? Number(d.screenTime?.weeklyLimitMinutes ?? 0)
      : null;

    const extraMinutesToday = Number(d.screenTime?.extraMinutesToday ?? 0);
    const usedTodayMinutes = Number(d.screenTime?.usedTodayMinutes ?? 0);
    const usedWeekMinutes = Number(d.screenTime?.usedWeekMinutes ?? 0);

    let usedMinutes: number | null = null;
    let limitMinutes: number | null = null;

    if (isLimitEnabled && limitMode === "DAILY") {
      usedMinutes = usedTodayMinutes;
      limitMinutes = Number(dailyLimitMinutes ?? 0) + extraMinutesToday;
    }

    if (isLimitEnabled && limitMode === "WEEKLY") {
      usedMinutes = usedWeekMinutes;
      limitMinutes = Number(weeklyLimitMinutes ?? 0);
    }

    const remainingMinutes =
      usedMinutes !== null && limitMinutes !== null
        ? Math.max(limitMinutes - usedMinutes, 0)
        : null;

    return {
      id: String(d._id),
      name,
      typeLabel: translateDeviceType(d.type),
      platformLabel: translateDevicePlatform(d.platform),
      active: Boolean(d.isActive),
      locationText: loc,

      isLocked: Boolean(d.isLocked),
      isLimitEnabled,

      limitMode,

      dailyLimitMinutes,
      weeklyLimitMinutes,
      extraMinutesToday,

      usedTodayMinutes,
      usedWeekMinutes,

      usedMinutes,
      limitMinutes,
      remainingMinutes,

      manualLockEnabled: d.manualLockEnabled === true,
      dailyLimitLockActive: d.dailyLimitLockActive === true,
      weeklyLimitLockActive: d.weeklyLimitLockActive === true,
      scheduleLockActive: d.scheduleLockActive === true,
    };
  });
}
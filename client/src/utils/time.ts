import moment from "moment-timezone";

export const JERUSALEM_TZ = "Asia/Jerusalem";

function jerusalemMoment(date: Date) {
  return moment(date).tz(JERUSALEM_TZ);
}

function jerusalemDayFromKey(dateKey: string) {
  return moment.tz(dateKey, "YYYY-MM-DD", JERUSALEM_TZ).startOf("day");
}

export function getJerusalemDateKey(date: Date = new Date()): string {
  return jerusalemMoment(date).format("YYYY-MM-DD");
}

export function formatJerusalemDisplayDate(dateKey: string): string {
  return jerusalemDayFromKey(dateKey).format("DD/MM/YYYY");
}

export function formatJerusalemWeekStartLabel(dateKey: string): string {
  if (!dateKey) {
    return "";
  }

  return jerusalemDayFromKey(dateKey).format("D/M");
}

// Returns Sunday–Saturday date keys for the Jerusalem week containing the given date.
export function getJerusalemWeekDateKeys(date: Date = new Date()): string[] {
  const today = jerusalemMoment(date).startOf("day");
  const sunday = today.clone().subtract(today.day(), "days");

  return Array.from({ length: 7 }, (_, index) =>
    getJerusalemDateKey(sunday.clone().add(index, "days").toDate())
  );
}

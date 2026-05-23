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

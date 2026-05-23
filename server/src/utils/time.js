import moment from "moment-timezone";
// Use Jerusalem timezone for all time calculations
export const JERUSALEM_TZ = "Asia/Jerusalem";

export const WEEKDAY_CHART_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function jerusalemMoment(date = new Date()) {
  return moment(date).tz(JERUSALEM_TZ);
}

function jerusalemDayFromKey(dateKey) {
  return moment.tz(dateKey, "YYYY-MM-DD", JERUSALEM_TZ).startOf("day");
}

export function formatJerusalemOffsetIsoNow(date = new Date()) {
  return jerusalemMoment(date).format();
}

export function getJerusalemDateKey(date = new Date()) {
  return jerusalemMoment(date).format("YYYY-MM-DD");
}

export function isSameJerusalemDay(left, right) {
  return getJerusalemDateKey(left) === getJerusalemDateKey(right);
}

export function getJerusalemWeekStartKey(date = new Date()) {
  return getJerusalemWeekDateKeys(date)[0];
}

export function isSameJerusalemWeek(left, right) {
  return (
    getJerusalemWeekStartKey(left) === getJerusalemWeekStartKey(right)
  );
}

// Get the date for the current week
export function getJerusalemWeekDateKeys(date = new Date()) {
  const today = jerusalemMoment(date).startOf("day");
  // Get number of the day of the week
  const sunday = today.clone().subtract(today.day(), "days");

  return WEEKDAY_CHART_LABELS.map((_, index) =>
    getJerusalemDateKey(sunday.clone().add(index, "days").toDate())
  );
}

export function iterateJerusalemDateKeys(startKey, endKey) {
  const keys = [];
  const startDate = jerusalemDayFromKey(startKey);
  const endDate = jerusalemDayFromKey(endKey);

  while (startDate.isSameOrBefore(endDate, "day")) {
    keys.push(startDate.format("YYYY-MM-DD"));
    startDate.add(1, "day");
  }

  return keys;
}

export function formatJerusalemDisplayDate(dateKey) {
  return jerusalemDayFromKey(dateKey).format("DD/MM/YYYY");
}

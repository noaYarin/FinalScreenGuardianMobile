import moment from "moment-timezone";
// Use Jerusalem timezone for all time calculations
export const JERUSALEM_TZ = "Asia/Jerusalem";

export const WEEKDAY_CHART_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function formatJerusalemOffsetIsoNow(date = new Date()) {
  return moment(date).tz(JERUSALEM_TZ).format();
}

export function getJerusalemDateKey(date = new Date()) {
  return moment(date).tz(JERUSALEM_TZ).format("YYYY-MM-DD");
}

export function isSameJerusalemDay(left, right) {
  return getJerusalemDateKey(left) === getJerusalemDateKey(right);
}

// Get the date for the current week
export function getJerusalemWeekDateKeys(date = new Date()) {
  const today = moment(date).tz(JERUSALEM_TZ).startOf("day");
  // Get number of the day of the week
  const sunday = today.clone().subtract(today.day(), "days");

  return WEEKDAY_CHART_LABELS.map((_, index) =>
    sunday.clone().add(index, "days").format("YYYY-MM-DD")
  );
}

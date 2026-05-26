import moment from "moment-timezone";

import { JERUSALEM_TZ } from "@/src/utils/time";

export function formatReportHours(minutes: number): string {
  return `${(minutes / 60).toFixed(1)}h`;
}

export function defaultReportRange(): { from: Date; to: Date } {
  const to = moment().tz(JERUSALEM_TZ).startOf("day").toDate();
  const from = moment(to).subtract(6, "days").toDate();
  return { from, to };
}

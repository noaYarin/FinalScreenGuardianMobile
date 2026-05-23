import moment from "moment-timezone";
import { AppError } from "../utils/appError.js";
import { Common as CommonErrors } from "../constants/errors.js";
import { getChildByParentId } from "../dal/parent.dal.js";
import { findDevicesByChildId } from "../dal/device.dal.js";
import { getTasksByChildId } from "../dal/task.dal.js";
import { findRequestsByChild } from "../dal/request.dal.js";
import {
  formatJerusalemDisplayDate,
  getJerusalemDateKey,
  iterateJerusalemDateKeys,
  JERUSALEM_TZ
} from "../utils/time.js";
import {
  getUsedMinutesForDateKey,
  hasUsageDataForDateKey,
  isDeviceDayResetDue,
  resetDailyScreenTimeWithHistory
} from "./screenTimeHistory.service.js";
const MAX_REPORT_RANGE_DAYS = 35;

function pickRepresentativeDevice(devices) {
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

function normalizeHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history.filter((entry) => entry?.dateKey);
}

function parseDateKey(value, fieldName) {
  const key = String(value ?? "").trim();
  const parsed = moment.tz(key, "YYYY-MM-DD", JERUSALEM_TZ);

  if (!parsed.isValid() || parsed.format("YYYY-MM-DD") !== key) {
    throw new AppError({
      status: 400,
      code: "VALIDATION_ERROR",
      message: `Invalid ${fieldName}. Use YYYY-MM-DD.`
    });
  }

  return key;
}

function getDailyLimitMinutes(screenTime) {
  if (screenTime?.isLimitEnabled !== true) {
    return null;
  }

  const daily = Number(screenTime.dailyLimitMinutes ?? 0);
  const extra = Number(screenTime.extraMinutesToday ?? 0);

  if (daily <= 0 && extra <= 0) {
    return null;
  }

  return daily + extra;
}

function countTasksApprovedInRange(tasks, fromKey, toKey) {
  const from = moment.tz(fromKey, "YYYY-MM-DD", JERUSALEM_TZ).startOf("day");
  const to = moment.tz(toKey, "YYYY-MM-DD", JERUSALEM_TZ).endOf("day");

  return tasks.filter((task) => {
    if (!task?.approvedAt || task?.isApproved !== true) {
      return false;
    }

    const approvedAt = moment(task.approvedAt).tz(JERUSALEM_TZ);
    return approvedAt.isBetween(from, to, null, "[]");
  }).length;
}

function countExtensionRequestsInRange(requests, fromKey, toKey) {
  const from = moment.tz(fromKey, "YYYY-MM-DD", JERUSALEM_TZ).startOf("day");
  const to = moment.tz(toKey, "YYYY-MM-DD", JERUSALEM_TZ).endOf("day");

  return requests.filter((request) => {
    const createdAt = moment(request?.createdAt).tz(JERUSALEM_TZ);
    return createdAt.isBetween(from, to, null, "[]");
  }).length;
}

function summarizeUsageForRange({
  dateKeys,
  history,
  todayKey,
  usedTodayMinutes,
  dailyLimitMinutes
}) {
  let totalMinutes = 0;
  let daysWithData = 0;
  let limitExceededDays = 0;

  for (const dateKey of dateKeys) {
    const usedMinutes = getUsedMinutesForDateKey(
      history,
      dateKey,
      todayKey,
      usedTodayMinutes
    );
    const hasData = hasUsageDataForDateKey(
      history,
      dateKey,
      todayKey,
      usedTodayMinutes
    );

    totalMinutes += usedMinutes;

    if (!hasData) {
      continue;
    }

    daysWithData += 1;

    if (dailyLimitMinutes != null && usedMinutes > dailyLimitMinutes) {
      limitExceededDays += 1;
    }
  }

  const dailyAverageMinutes =
    daysWithData > 0 ? Math.round(totalMinutes / daysWithData) : 0;

  return {
    totalMinutes,
    daysWithData,
    dailyAverageMinutes,
    limitExceededDays
  };
}

function buildExecutiveSummary({
  childName,
  fromLabel,
  toLabel,
  totalMinutes,
  daysWithData,
  dailyAverageMinutes,
  trendPercent,
  limitExceededDays,
  tasksApprovedCount,
  extensionRequestsCount
}) {
  const totalHours = (totalMinutes / 60).toFixed(1);
  const avgHours = (dailyAverageMinutes / 60).toFixed(1);
  const parts = [
    `In the period from ${fromLabel} to ${toLabel}, ${childName} logged ${totalHours} hours of screen time across ${daysWithData} days with recorded usage (daily average: ${avgHours} hours).`
  ];

  if (trendPercent != null) {
    const direction =
      trendPercent > 0
        ? `an increase of ${Math.abs(trendPercent)}%`
        : trendPercent < 0
          ? `a decrease of ${Math.abs(trendPercent)}%`
          : "no significant change";
    parts.push(
      `Compared to the previous period of the same length, total screen time shows ${direction}.`
    );
  }

  if (limitExceededDays > 0) {
    parts.push(
      `The daily limit was exceeded on ${limitExceededDays} days in this period.`
    );
  } else if (daysWithData > 0) {
    parts.push("No daily limit exceedances were recorded in this period.");
  }

  if (extensionRequestsCount > 0) {
    parts.push(
      `${extensionRequestsCount} extension requests were submitted during this period.`
    );
  }

  if (tasksApprovedCount > 0) {
    parts.push(
      `${tasksApprovedCount} tasks were approved by the parent during this period.`
    );
  }

  return parts.join("\n");
}

function buildReportPayload({
  child,
  childId,
  device,
  fromKey,
  toKey,
  now,
  usageSummary,
  trendPercent,
  tasksApprovedCount,
  extensionRequestsCount
}) {
  const childName = String(child?.name ?? "Child");
  const fromLabel = formatJerusalemDisplayDate(fromKey);
  const toLabel = formatJerusalemDisplayDate(toKey);

  return {
    childId,
    childName,
    deviceId: device ? String(device._id) : null,
    hasLinkedDevice: Boolean(device),
    fromKey,
    toKey,
    fromLabel,
    toLabel,
    generatedAtLabel: formatJerusalemDisplayDate(getJerusalemDateKey(now)),
    executiveSummary: buildExecutiveSummary({
      childName,
      fromLabel,
      toLabel,
      totalMinutes: usageSummary.totalMinutes,
      daysWithData: usageSummary.daysWithData,
      dailyAverageMinutes: usageSummary.dailyAverageMinutes,
      trendPercent,
      limitExceededDays: usageSummary.limitExceededDays,
      tasksApprovedCount,
      extensionRequestsCount
    }),
    indicators: {
      totalMinutes: usageSummary.totalMinutes,
      dailyAverageMinutes: usageSummary.dailyAverageMinutes,
      limitExceededDays: usageSummary.limitExceededDays,
      tasksApprovedCount,
      extensionRequestsCount
    },
    trendPercent
  };
}

export async function buildParentAnalyticsReport(
  parentId,
  childId,
  fromKeyInput,
  toKeyInput,
  now = new Date()
) {
  const child = await getChildByParentId(parentId, childId);

  if (!child) {
    throw new AppError(CommonErrors.CHILD_NOT_FOUND);
  }

  const fromKey = parseDateKey(fromKeyInput, "from");
  const toKey = parseDateKey(toKeyInput, "to");

  if (fromKey > toKey) {
    throw new AppError({
      status: 400,
      code: "VALIDATION_ERROR",
      message: "from date must be on or before to date"
    });
  }

  const dateKeys = iterateJerusalemDateKeys(fromKey, toKey);

  if (dateKeys.length > MAX_REPORT_RANGE_DAYS) {
    throw new AppError({
      status: 400,
      code: "VALIDATION_ERROR",
      message: `Date range cannot exceed ${MAX_REPORT_RANGE_DAYS} days`
    });
  }

  const devices = await findDevicesByChildId(childId);
  let device = pickRepresentativeDevice(devices);

  if (!device) {
    return {
      ...buildReportPayload({
        child,
        childId,
        device: null,
        fromKey,
        toKey,
        now,
        usageSummary: {
          totalMinutes: 0,
          daysWithData: 0,
          dailyAverageMinutes: 0,
          limitExceededDays: 0
        },
        trendPercent: null,
        tasksApprovedCount: 0,
        extensionRequestsCount: 0
      }),
      executiveSummary:
        "No device is linked to this child. Connect a device to generate usage analytics."
    };
  }

  if (isDeviceDayResetDue(device)) {
    device = (await resetDailyScreenTimeWithHistory(device._id)) ?? device;
  }

  const todayKey = getJerusalemDateKey(now);
  const history = normalizeHistory(device.screenTime?.dailyUsageHistory);
  const usedTodayMinutes = Math.max(
    0,
    Number(device.screenTime?.usedTodayMinutes ?? 0)
  );
  const dailyLimitMinutes = getDailyLimitMinutes(device.screenTime);

  const usageSummary = summarizeUsageForRange({
    dateKeys,
    history,
    todayKey,
    usedTodayMinutes,
    dailyLimitMinutes
  });

  const periodLength = dateKeys.length;
  const previousTo = moment
    .tz(fromKey, "YYYY-MM-DD", JERUSALEM_TZ)
    .subtract(1, "day")
    .format("YYYY-MM-DD");
  const previousFrom = moment
    .tz(previousTo, "YYYY-MM-DD", JERUSALEM_TZ)
    .subtract(periodLength - 1, "days")
    .format("YYYY-MM-DD");
  const previousKeys = iterateJerusalemDateKeys(previousFrom, previousTo);
  const previousTotal = previousKeys.reduce(
    (sum, dateKey) =>
      sum +
      getUsedMinutesForDateKey(history, dateKey, todayKey, usedTodayMinutes),
    0
  );
  const trendPercent =
    previousTotal > 0
      ? Math.round(
          ((usageSummary.totalMinutes - previousTotal) / previousTotal) * 100
        )
      : null;

  const tasks = await getTasksByChildId(childId);
  const tasksApprovedCount = countTasksApprovedInRange(tasks, fromKey, toKey);

  const requests = await findRequestsByChild({ parentId, childId });
  const extensionRequestsCount = countExtensionRequestsInRange(
    requests,
    fromKey,
    toKey
  );

  return buildReportPayload({
    child,
    childId,
    device,
    fromKey,
    toKey,
    now,
    usageSummary,
    trendPercent,
    tasksApprovedCount,
    extensionRequestsCount
  });
}

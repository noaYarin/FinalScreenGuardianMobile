import moment from "moment-timezone";
import { findDevicesByChildId } from "../dal/device.dal.js";
import { findDeviceById } from "../dal/device.dal.js";
import {
  addCompletedBadgeIdDal,
  getCompletedBadgeIdsDal,
} from "../dal/badge.dal.js";
import { badgesSeed } from "../seeds/badges.seed.js";
import { getDeviceCurrentStatusForChild } from "./device.service.js";
import { notifyChild } from "./notification.service.js";
import { NotificationType } from "../constants/notificationType.js";
import { NotificationSeverity } from "../constants/severity.js";
import { AppError } from "../utils/appError.js";
import { Common as CommonErrors } from "../constants/errors.js";
import {
  getJerusalemDateKey,
  getJerusalemWeekDateKeys,
  getJerusalemWeekStartKey,
  isSameJerusalemDay,
  JERUSALEM_TZ,
} from "../utils/time.js";

export const badges = badgesSeed;

const badgeOrder = badges.map((b) => b.id);

function getBadgeConfig(badgeId) {
  return badges.find((b) => Number(b.id) === Number(badgeId));
}

function getDayMinutes(history, dateKey) {
  const entry = history.find((item) => item.dateKey === dateKey);
  return entry ? Number(entry.usedMinutes) || 0 : 0;
}

function getWeekMinutesByStartKey(history, weekStartKey) {
  const entry = history.find((item) => item.weekStartKey === weekStartKey);
  return entry ? Number(entry.usedMinutes) || 0 : 0;
}

function getYesterdayDateKey(todayKey) {
  return moment
    .tz(todayKey, "YYYY-MM-DD", JERUSALEM_TZ)
    .subtract(1, "day")
    .format("YYYY-MM-DD");
}

function getPreviousWeekStartKey(now) {
  const todayKey = getJerusalemDateKey(now);
  return getJerusalemWeekStartKey(
    moment.tz(todayKey, "YYYY-MM-DD", JERUSALEM_TZ).subtract(1, "day").toDate()
  );
}

// weekStartKey is sunday so the function returns the date of sunday in the last week
function getWeekStartKeyBefore(weekStartKey) {
  return moment
    .tz(weekStartKey, "YYYY-MM-DD", JERUSALEM_TZ)
    .subtract(7, "days")
    .format("YYYY-MM-DD");
}

function isWeekJustReset(screenTime, now) {
  const lastWeeklyResetAt = screenTime.lastWeeklyResetAt;
  if (!lastWeeklyResetAt) return false;
  return isSameJerusalemDay(new Date(lastWeeklyResetAt), now);
}

function countCompletedDaysUnderLimit(
  dailyUsageHistory,
  maxMinutes,
  todayKey,
  now
) {
  const weekKeys = getJerusalemWeekDateKeys(now);
  let count = 0;

  for (const dateKey of weekKeys) {
    if (dateKey >= todayKey) continue;
    if (getDayMinutes(dailyUsageHistory, dateKey) <= maxMinutes) {
      count += 1;
    }
  }

  return count;
}

function isBadgeCompleteAfterMidnight(badgeId, screenTime, now = new Date()) {
  const config = getBadgeConfig(badgeId);
  if (!config) return false;

  const todayKey = getJerusalemDateKey(now);
  const dailyUsageHistory = screenTime.dailyUsageHistory ?? [];
  const weeklyUsageHistory = screenTime.weeklyUsageHistory ?? [];

  switch (config.rule) {
    case "single_day": {
      const yesterdayKey = getYesterdayDateKey(todayKey);
      return getDayMinutes(dailyUsageHistory, yesterdayKey) <= config.maxMinutes;
    }

    case "days_in_week":
      return (
        countCompletedDaysUnderLimit(
          dailyUsageHistory,
          config.maxMinutes,
          todayKey,
          now
        ) >= config.daysRequired
      );

    case "weekly_total": {
      if (!isWeekJustReset(screenTime, now)) return false;
      const prevWeekStartKey = getPreviousWeekStartKey(now);
      return (
        getWeekMinutesByStartKey(weeklyUsageHistory, prevWeekStartKey) <=
        config.maxMinutes
      );
    }

    case "beat_last_week": {
      if (!isWeekJustReset(screenTime, now)) return false;
      const prevWeekStartKey = getPreviousWeekStartKey(now);
      const beforePrevWeekStartKey = getWeekStartKeyBefore(prevWeekStartKey);
      const hasPriorWeek = weeklyUsageHistory.some(
        (entry) => entry.weekStartKey === beforePrevWeekStartKey
      );
      if (!hasPriorWeek) return false;

      const prevWeekMinutes = getWeekMinutesByStartKey(
        weeklyUsageHistory,
        prevWeekStartKey
      );
      const beforePrevWeekMinutes = getWeekMinutesByStartKey(
        weeklyUsageHistory,
        beforePrevWeekStartKey
      );
      return prevWeekMinutes < beforePrevWeekMinutes;
    }

    default:
      return false;
  }
}

function getCurrentBadgeId(completedBadgeIds) {
  return badgeOrder.find((id) => !completedBadgeIds.includes(id)) ?? null;
}

async function findActiveDeviceForChild(childId) {
  const devices = await findDevicesByChildId(childId);
  if (!devices?.length) return null;
  return devices.find((device) => device.isActive !== false) ?? devices[0];
}

async function unlockBadgeIfEligible({
  parentId,
  childId,
  deviceId,
  badgeId,
  title,
}) {
  const screenTime = await getDeviceCurrentStatusForChild({
    deviceId,
    childId,
    parentId,
  });

  if (!isBadgeCompleteAfterMidnight(badgeId, screenTime)) {
    return null;
  }

  const completedBadgeIds = await addCompletedBadgeIdDal(
    parentId,
    childId,
    badgeId
  );

  if (!completedBadgeIds) {
    throw new AppError(CommonErrors.CHILD_NOT_FOUND);
  }

  await notifyChild({
    parentId,
    childId,
    type: NotificationType.ACHIEVEMENT_UNLOCKED,
    severity: NotificationSeverity.SUCCESS,
    title: "Badge unlocked!",
    description: title || "You earned a new badge",
    data: {
      badgeId,
      link: "/Child/goals",
    },
  });

  return completedBadgeIds;
}

// Check badge completion after midnight
async function evaluateBadgesAfterMidnight({ parentId, childId }) {
  let completedBadgeIds = await getCompletedBadgeIdsDal(parentId, childId);
  const device = await findActiveDeviceForChild(childId);

  if (device) {
    const currentBadgeId = getCurrentBadgeId(completedBadgeIds);

    if (currentBadgeId) {
      const config = getBadgeConfig(currentBadgeId);
      const unlockedIds = await unlockBadgeIfEligible({
        parentId,
        childId,
        deviceId: String(device._id),
        badgeId: currentBadgeId,
        title: config?.title,
      });

      if (unlockedIds) {
        completedBadgeIds = unlockedIds;
      }
    }
  }
  return completedBadgeIds;
}

export async function getChildBadgeProgressService({ parentId, childId }) {
  const completedBadgeIds = await evaluateBadgesAfterMidnight({
    parentId,
    childId,
  });

  if (completedBadgeIds === null) {
    throw new AppError(CommonErrors.CHILD_NOT_FOUND);
  }

  return { completedBadgeIds };
}

export async function getChildBadgesService({ parentId, childId }) {
  const progress = await getChildBadgeProgressService({ parentId, childId });
  const completedSet = new Set(progress.completedBadgeIds);

  return {
    badges: badges.map((badge) => ({
      ...badge,
      completed: completedSet.has(badge.id),
    })),
  };
}

export async function unlockChildBadgeService({
  deviceId,
  childId,
  parentId,
  badgeId,
  title,
}) {
  const device = await findDeviceById(deviceId);

  if (!device) {
    throw new AppError(CommonErrors.DEVICE_NOT_FOUND);
  }

  if (String(device.childId) !== String(childId)) {
    throw new AppError(CommonErrors.DEVICE_NOT_OWNED);
  }

  const numericBadgeId = Number(badgeId);
  const existingIds = await getCompletedBadgeIdsDal(parentId, childId);

  if (existingIds === null) {
    throw new AppError(CommonErrors.CHILD_NOT_FOUND);
  }

  if (existingIds.includes(numericBadgeId)) {
    return { success: true, completedBadgeIds: existingIds };
  }

  const completedBadgeIds = await unlockBadgeIfEligible({
    parentId,
    childId,
    deviceId,
    badgeId: numericBadgeId,
    title,
  });

  if (!completedBadgeIds) {
    throw new AppError(CommonErrors.VALIDATION_ERROR);
  }

  return { success: true, completedBadgeIds };
}

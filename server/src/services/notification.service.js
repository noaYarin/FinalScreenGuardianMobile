import {
  createNotification,
  findNotificationsWithPagination,
  markNotificationAsReadById,
  markAllNotificationsAsRead,
  deleteNotificationByIdForParent,
  findChildNotificationsWithPagination,
  markAllChildNotificationsAsRead,
} from "../dal/notification.dal.js";

import { TargetRole } from "../constants/role.js";
import { AppError } from "../utils/appError.js";
import { Common as CommonErrors } from "../constants/errors.js";
import { getIO } from "../socketHandler.js";
import { NOTIFICATION_CREATED } from "../constants/socketEvents.js";
import {
  sendNotification,
  sendChildNotification,
} from "./pushNotification.service.js";
import ParentModel from "../models/parent.model.js";
import { NotificationType } from "../constants/notificationType.js";
import { NotificationSeverity } from "../constants/severity.js";

function includesAny(value, keywords) {
  return keywords.some((keyword) => value.includes(keyword));
}

function isAppNotification(type) {
  return (
    type.includes("APPLICATION") ||
    type.startsWith("APP_") ||
    type.includes("_APP_")
  );
}

function getDefaultNotificationLink(type, targetRole) {
  const normalizedType = String(type ?? "").toUpperCase();

  if (targetRole === TargetRole.CHILD) {
    if (isAppNotification(normalizedType)) {
      return "/Child/apps";
    }

    if (includesAny(normalizedType, ["TASK"])) {
      return "/Child/tasks";
    }

    if (includesAny(normalizedType, ["PRIZE", "REWARD", "STORE"])) {
      return "/Child/store";
    }

    if (includesAny(normalizedType, ["GOAL"])) {
      return "/Child/goals";
    }

    if (includesAny(normalizedType, ["ACHIEVEMENT", "AVATAR", "COIN"])) {
      return "/Child/achievements";
    }

    if (
      normalizedType === NotificationType.EXTENSION_REQUEST_APPROVED ||
      normalizedType === NotificationType.EXTENSION_REQUEST_REJECTED ||
      normalizedType === NotificationType.SCREEN_TIME_ENDING ||
      normalizedType === NotificationType.SCREEN_TIME_ENDED ||
      normalizedType === NotificationType.SCREEN_TIME_UPDATED
    ) {
      return "/Child";
    }

    return "/Child";
  }

  if (targetRole === TargetRole.PARENT) {
    if (includesAny(normalizedType, ["EXTENSION_REQUEST", "REQUEST"])) {
      return "/Parent/extensionRequests";
    }

    if (includesAny(normalizedType, ["TASK"])) {
      return "/Parent/tasks";
    }

    if (includesAny(normalizedType, ["PRIZE", "REWARD", "STORE"])) {
      return "/Parent/rewards";
    }

    return "/Parent/systemAlerts";
  }

  return null;
}

function normalizeNotificationData({
  notificationId,
  childId,
  type,
  severity,
  data,
  targetRole,
}) {
  const provided = data && typeof data === "object" ? data : {};

  const defaultLink = getDefaultNotificationLink(type, targetRole);

  const rawLink =
    typeof provided.link === "string" && provided.link.trim()
      ? provided.link.trim()
      : defaultLink;

  const link =
    typeof rawLink === "string" && rawLink.trim()
      ? rawLink.startsWith("/")
        ? rawLink
        : `/${rawLink}`
      : null;

  return {
    reason: provided.reason ?? type,
    ...provided,

    notificationId: notificationId ? String(notificationId) : undefined,
    type,
    severity,
    targetRole,
    childId: childId != null ? String(childId) : undefined,
    link,
  };
}

function normalizePushDataForFcm(data) {
  const safeData = data && typeof data === "object" ? data : {};

  return Object.fromEntries(
    Object.entries(safeData)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [
        key,
        typeof value === "string" ? value : JSON.stringify(value),
      ])
  );
}

function shouldSendParentPush(type, data = {}) {
  const pushTypes = new Set([
    NotificationType.SOS_TRIGGERED,
    NotificationType.SCREEN_TIME_ENDED,
    NotificationType.EXTENSION_REQUEST_CREATED,
    NotificationType.TASK_PENDING_APPROVAL,
  ]);

  if (pushTypes.has(type)) {
    return true;
  }

  if (type === NotificationType.DEVICE_LOCKED) {
    const reason = String(data?.reason ?? "").toUpperCase();

    return (
      reason.includes("DAILY_LIMIT") ||
      reason.includes("WEEKLY_LIMIT") ||
      reason.includes("SCHEDULE") ||
      reason.includes("SCREEN_TIME")
    );
  }

  if (type === NotificationType.BYPASS_ATTEMPT) {
    const reason = String(data?.reason ?? "").toUpperCase();

    return (
      reason.includes("ACCESSIBILITY") ||
      reason.includes("USAGE_ACCESS") ||
      reason.includes("USAGE_STATS") ||
      reason.includes("USAGE_PERMISSION")
    );
  }

  return false;
}

/**
 * Child push whitelist.
 *
 * Very important:
 * Not every child notification becomes a push notification.
 * Only the three requested cases are allowed:
 * 1. Extension request approved
 * 2. Task approved
 * 3. Screen time ending, only when allowChildPush === true
 */
function shouldSendChildPush(type, data = {}) {
  if (type === NotificationType.EXTENSION_REQUEST_APPROVED) {
    return true;
  }

  if (type === NotificationType.TASK_APPROVED) {
    return true;
  }

  if (type === NotificationType.SCREEN_TIME_ENDING) {
    return data?.allowChildPush === true;
  }

  return false;
}

export async function notifyParent({
  parentId,
  childId,
  type,
  severity,
  title,
  description,
  data,
}) {
  const normalizedDataBeforeCreate = normalizeNotificationData({
    childId,
    type,
    severity,
    data,
    targetRole: TargetRole.PARENT,
  });

  const notification = await createNotification({
    parentId,
    childId,
    targetRole: TargetRole.PARENT,
    type,
    severity,
    title,
    description,
    data: normalizedDataBeforeCreate,
  });

  const normalizedData = normalizeNotificationData({
    notificationId: notification._id,
    childId,
    type,
    severity,
    data: normalizedDataBeforeCreate,
    targetRole: TargetRole.PARENT,
  });

  const socketNotification = {
    ...(typeof notification.toObject === "function"
      ? notification.toObject()
      : notification),
    data: normalizedData,
  };

  try {
    const io = getIO();

    if (io && parentId) {
      io.to(`parent_${parentId}`).emit(
        NOTIFICATION_CREATED,
        socketNotification
      );
    }
  } catch (err) {
    console.error("socket emit failed in notifyParent", err.message);
  }

  if (shouldSendParentPush(type, normalizedData)) {
    try {
      const pushResult = await sendNotification(
        parentId,
        title,
        description,
        normalizePushDataForFcm({
          ...normalizedData,
          targetRole: TargetRole.PARENT,
          type,
        })
      );

      console.log("[Push] notifyParent result:", pushResult);
    } catch (err) {
      console.error("push send failed in notifyParent", err.message);
    }
  } else {
    console.log("[Push] skipped for parent notification type:", type);
  }

  return notification;
}

export async function notifyChild({
  parentId,
  childId,
  type,
  severity,
  title,
  description,
  data,
}) {
  const normalizedDataBeforeCreate = normalizeNotificationData({
    childId,
    type,
    severity,
    data,
    targetRole: TargetRole.CHILD,
  });

  const notification = await createNotification({
    parentId,
    childId,
    targetRole: TargetRole.CHILD,
    type,
    severity,
    title,
    description,
    data: normalizedDataBeforeCreate,
  });

  const normalizedData = normalizeNotificationData({
    notificationId: notification._id,
    childId,
    type,
    severity,
    data: normalizedDataBeforeCreate,
    targetRole: TargetRole.CHILD,
  });

  const socketNotification = {
    ...(typeof notification.toObject === "function"
      ? notification.toObject()
      : notification),
    data: normalizedData,
  };

  try {
    const io = getIO();

    if (io && childId) {
      io.to(`child_${childId}`).emit(
        NOTIFICATION_CREATED,
        socketNotification
      );
    }
  } catch (err) {
    console.error("socket emit failed in notifyChild", err.message);
  }

  if (shouldSendChildPush(type, normalizedData)) {
    try {
      const pushResult = await sendChildNotification(
        parentId,
        childId,
        title,
        description,
        normalizePushDataForFcm({
          ...normalizedData,
          targetRole: TargetRole.CHILD,
          type,
        })
      );

      console.log("[Push] notifyChild result:", pushResult);
    } catch (err) {
      console.error("push send failed in notifyChild", err.message);
    }
  } else {
    console.log("[Push] skipped for child notification type:", type);
  }

  return notification;
}

export async function getParentNotifications(parentId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const { notifications, total, unreadCount } =
    await findNotificationsWithPagination(parentId, skip, limit);

  return {
    notifications,
    total,
    pages: Math.ceil(total / limit),
    unreadCount,
  };
}

export async function markNotificationAsRead(parentId, notificationId) {
  return markNotificationAsReadById(parentId, notificationId);
}

export async function readAllNotifications(parentId) {
  await markAllNotificationsAsRead(parentId);

  return { success: true };
}

export async function deleteParentNotification(parentId, notificationId) {
  const deleted = await deleteNotificationByIdForParent(
    parentId,
    notificationId
  );

  if (!deleted) {
    throw new AppError(CommonErrors.NOT_FOUND);
  }

  return { success: true };
}

export async function getChildNotifications(
  parentId,
  childId,
  page = 1,
  limit = 10
) {
  const skip = (page - 1) * limit;

  const { notifications, total, unreadCount } =
    await findChildNotificationsWithPagination(parentId, childId, skip, limit);

  return {
    notifications,
    total,
    pages: Math.ceil(total / limit),
    unreadCount,
  };
}

export async function readAllChildNotifications(parentId, childId) {
  await markAllChildNotificationsAsRead(parentId, childId);

  return { success: true };
}

export async function registerParentFcmToken(parentId, fcmToken) {
  const updated = await ParentModel.findByIdAndUpdate(
    parentId,
    { fcmToken },
    { new: false }
  );

  if (!updated) {
    throw new AppError(CommonErrors.NOT_FOUND);
  }

  return { success: true };
}

export async function registerChildFcmToken(parentId, childId, fcmToken) {
  const updated = await ParentModel.findOneAndUpdate(
    {
      _id: parentId,
      "children._id": childId,
    },
    {
      $set: {
        "children.$.fcmToken": fcmToken,
      },
    },
    { new: false }
  );

  if (!updated) {
    throw new AppError(CommonErrors.NOT_FOUND);
  }

  return { success: true };
}

export async function getChildNotificationSettings(parentId, childId) {
  const parent = await ParentModel.findOne(
    {
      _id: parentId,
      "children._id": childId,
    },
    {
      "children.$": 1,
    }
  ).lean();

  const child = parent?.children?.[0];

  if (!child) {
    throw new AppError(CommonErrors.NOT_FOUND);
  }

  return {
    lowTimePushEnabled:
      child.notificationSettings?.lowTimePushEnabled !== false,
    lowTimeThresholdMinutes:
      Number(child.notificationSettings?.lowTimeThresholdMinutes) || 5,
  };
}

export async function updateChildNotificationSettings(
  parentId,
  childId,
  payload
) {
  const lowTimePushEnabled = payload?.lowTimePushEnabled === true;

  const updated = await ParentModel.findOneAndUpdate(
    {
      _id: parentId,
      "children._id": childId,
    },
    {
      $set: {
        "children.$.notificationSettings.lowTimePushEnabled":
          lowTimePushEnabled,
      },
    },
    { new: true }
  );

  if (!updated) {
    throw new AppError(CommonErrors.NOT_FOUND);
  }

  return {
    lowTimePushEnabled,
  };
}

export async function createChildScreenTimeEndingNotification({
  parentId,
  childId,
  remainingMinutes,
}) {
  const safeRemaining = Math.max(0, Number(remainingMinutes) || 0);

  const parent = await ParentModel.findOne(
    {
      _id: parentId,
      "children._id": childId,
    },
    {
      "children.$": 1,
    }
  );

  const child = parent?.children?.[0];

  if (!child) {
    throw new AppError(CommonErrors.NOT_FOUND);
  }

  const settings = child.notificationSettings || {};
  const lowTimePushEnabled = settings.lowTimePushEnabled !== false;
  const threshold = Number(settings.lowTimeThresholdMinutes) || 5;

  if (!lowTimePushEnabled) {
    return {
      success: true,
      skipped: true,
      reason: "disabled_by_child",
    };
  }

  if (safeRemaining > threshold) {
    return {
      success: true,
      skipped: true,
      reason: "above_threshold",
    };
  }

  const lastSentAt = settings.lowTimeLastSentAt
    ? new Date(settings.lowTimeLastSentAt)
    : null;

  const now = new Date();

  if (
    lastSentAt &&
    Number.isFinite(lastSentAt.getTime()) &&
    now.getTime() - lastSentAt.getTime() < 60 * 60 * 1000
  ) {
    return {
      success: true,
      skipped: true,
      reason: "debounced",
    };
  }

  await ParentModel.findOneAndUpdate(
    {
      _id: parentId,
      "children._id": childId,
    },
    {
      $set: {
        "children.$.notificationSettings.lowTimeLastSentAt": now,
      },
    }
  );

  const notification = await notifyChild({
    parentId,
    childId,
    type: NotificationType.SCREEN_TIME_ENDING,
    severity: NotificationSeverity.WARNING,
    title: "Time is almost up",
    description: `You have ${safeRemaining} minutes left.`,
    data: {
      remainingMinutes: safeRemaining,
      thresholdMinutes: threshold,
      reason: "SCREEN_TIME_ENDING",
      link: "/Child",
      allowChildPush: true,
    },
  });

  return {
    success: true,
    skipped: false,
    notification,
  };
}
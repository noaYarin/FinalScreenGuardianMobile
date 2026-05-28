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
import { sendNotification } from "./pushNotification.service.js";
import ParentModel from "../models/parent.model.js";

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

    return null;
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

    return null;
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

  try {
    await sendNotification(
      parentId,
      title,
      description,
      normalizePushDataForFcm(normalizedData)
    );
  } catch (err) {
    console.error("push send failed in notifyParent", err.message);
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

  try {
    const io = getIO();

    if (io && childId) {
      const socketNotification = {
        ...(typeof notification.toObject === "function"
          ? notification.toObject()
          : notification),
        data: normalizedData,
      };

      io.to(`child_${childId}`).emit(
        NOTIFICATION_CREATED,
        socketNotification
      );
    }
  } catch (err) {
    console.error("socket emit failed in notifyChild", err.message);
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
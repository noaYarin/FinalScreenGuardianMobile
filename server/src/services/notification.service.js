import {
  createNotification,
  findNotificationsWithPagination,
  markNotificationAsReadById,
  markAllNotificationsAsRead,
  deleteNotificationByIdForParent,
} from "../dal/notification.dal.js";
import { TargetRole } from "../constants/role.js";
import { AppError } from "../utils/appError.js";
import { Common as CommonErrors } from "../constants/errors.js";
import { getIO } from "../socketHandler.js";
import { NOTIFICATION_CREATED } from "../constants/socketEvents.js";
import { sendNotification } from "./pushNotification.service.js";
import ParentModel from "../models/parent.model.js";

function normalizePushData({ notification, childId, type, severity, data }) {
  const base = {
    notificationId: String(notification._id),
    type,
    severity,
    childId: childId != null ? String(childId) : undefined,
  };

  const provided = data && typeof data === "object" ? data : {};
  const rawLink =
    typeof provided.link === "string" && provided.link.trim()
      ? provided.link.trim()
      : "/Parent/systemAlerts";
  const link = rawLink.startsWith("/") ? rawLink : `/${rawLink}`;

  return {
    ...provided,
    ...base,
    link,
  };
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
  const notification = await createNotification({
    parentId,
    childId,
    targetRole: TargetRole.PARENT,
    type,
    severity,
    title,
    description,
    data: data && typeof data === "object" ? data : {},
  });

  try {
    const io = getIO();
    if (io && parentId) {
      io.to(`parent_${parentId}`).emit(NOTIFICATION_CREATED, notification);
    }
  } catch (err) {
    console.error("socket emit failed in notifyParent", err.message);
  }

  try {
    await sendNotification(
      parentId,
      title,
      description,
      normalizePushData({ notification, childId, type, severity, data })
    );
  } catch (err) {
    console.error("push send failed in notifyParent", err.message);
  }

  return notification;
}

// Creates a child notification and emits it to the child socket room with optional extra data.
export async function notifyChild({
  parentId,
  childId,
  type,
  severity,
  title,
  description,
  data,
}) {
  const notification = await createNotification({
    parentId,
    childId,
    targetRole: TargetRole.CHILD,
    type,
    severity,
    title,
    description,
    data: data && typeof data === "object" ? data : {},
  });

  try {
    const io = getIO();

    if (io && childId) {
      const socketNotification = {
        ...(typeof notification.toObject === "function"
          ? notification.toObject()
          : notification),
        data: data && typeof data === "object" ? data : {},
      };

      io.to(`child_${childId}`).emit(NOTIFICATION_CREATED, socketNotification);
    }
  } catch (err) {
    console.error("socket emit failed in notifyChild", err.message);
  }

  return notification;
}


export async function getParentNotifications(parentId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const { notifications, total, unreadCount } = await findNotificationsWithPagination(parentId, skip, limit);

  return {
    notifications,
    total,
    pages: Math.ceil(total / limit),
    unreadCount
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
  const deleted = await deleteNotificationByIdForParent(parentId, notificationId);
  if (!deleted) {
    throw new AppError(CommonErrors.NOT_FOUND);
  }
  return { success: true };
}

export async function registerParentFcmToken(parentId, fcmToken) {
  const updated = await ParentModel.findByIdAndUpdate(parentId, { fcmToken }, { new: false });
  if (!updated) {
    throw new AppError(CommonErrors.NOT_FOUND);
  }
  return { success: true };
}
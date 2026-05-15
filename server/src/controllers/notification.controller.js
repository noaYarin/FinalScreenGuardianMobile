import {
  getParentNotifications,
  markNotificationAsRead,
  readAllNotifications,
  deleteParentNotification,
  registerParentFcmToken,
  getChildNotifications,
  readAllChildNotifications,
} from "../services/notification.service.js";

// Return notifications for the logged-in parent
export async function getParentNotificationsController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { notifications, total, pages, unreadCount } = await getParentNotifications(parentId, page, limit);


    res.status(200).json({
      ok: true,
      data: {
        notifications,
        pagination: {
          total,
          page,
          pages,
          limit
        },
        unreadCount
      }
    });
  } catch (err) {
    next(err);
  }
}

// Mark notification as read
export async function markNotificationAsReadController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { notificationId } = req.params;

    const data = await markNotificationAsRead(parentId, notificationId);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}


export async function readAllNotificationsController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const data = await readAllNotifications(parentId);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function deleteParentNotificationController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { notificationId } = req.params;
    const data = await deleteParentNotification(parentId, notificationId);
    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getChildNotificationsController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const childId = req.user.childId;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { notifications, total, pages, unreadCount } =
      await getChildNotifications(parentId, childId, page, limit);

    res.status(200).json({
      ok: true,
      data: {
        notifications,
        pagination: {
          total,
          page,
          pages,
          limit,
        },
        unreadCount,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function readAllChildNotificationsController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const childId = req.user.childId;

    const data = await readAllChildNotifications(parentId, childId);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/notifications/register-token
// Register or update FCM token for the logged-in parent user
export async function registerFcmTokenController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const fcmToken = req.body?.fcmToken;

    if (!fcmToken || typeof fcmToken !== "string") {
      return res.status(400).json({
        ok: false,
        error: { code: "BAD_REQUEST", message: "fcmToken is required" },
      });
    }

    const data = await registerParentFcmToken(parentId, fcmToken);
    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}
import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireParent } from "../middlewares/requireParent.js";
import { requireChild } from "../middlewares/requireChild.js";
import {
  getParentNotificationsController,
  readAllNotificationsController,
  markNotificationAsReadController,
  deleteParentNotificationController,
  registerFcmTokenController,
  getChildNotificationsController,
  readAllChildNotificationsController,
  registerChildFcmTokenController,
getChildNotificationSettingsController,
updateChildNotificationSettingsController,
createChildScreenTimeEndingNotificationController,
} from "../controllers/notification.controller.js";

const router = Router();

// GET /api/v1/notifications/child
router.get(
  "/child",
  authJwt,
  requireChild,
  getChildNotificationsController
);
// POST /api/v1/notifications/child/register-token
router.post(
  "/child/register-token",
  authJwt,
  requireChild,
  registerChildFcmTokenController
);

// GET /api/v1/notifications/child/settings
router.get(
  "/child/settings",
  authJwt,
  requireChild,
  getChildNotificationSettingsController
);

// PATCH /api/v1/notifications/child/settings
router.patch(
  "/child/settings",
  authJwt,
  requireChild,
  updateChildNotificationSettingsController
);

// POST /api/v1/notifications/child/screen-time-ending
router.post(
  "/child/screen-time-ending",
  authJwt,
  requireChild,
  createChildScreenTimeEndingNotificationController
);
// PATCH /api/v1/notifications/child/read-all
router.patch(
  "/child/read-all",
  authJwt,
  requireChild,
  readAllChildNotificationsController
);

//GET /api/v1/notifications/parent
// Get notifications for parent
router.get("/parent", authJwt, requireParent, getParentNotificationsController);

//PATCH /api/v1/notifications/parent/:notificationId/read
// Mark notification as read
router.patch("/parent/:notificationId/read", authJwt, requireParent, markNotificationAsReadController);

// PATCH /api/v1/notifications/parent/read-all
// Mark all parent notifications as read
router.patch("/parent/read-all", authJwt, requireParent, readAllNotificationsController);

// DELETE /api/v1/notifications/parent/:notificationId
router.delete(
  "/parent/:notificationId",
  authJwt,
  requireParent,
  deleteParentNotificationController
);

router.post("/register-token", authJwt, requireParent, registerFcmTokenController);

export default router;
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
} from "../controllers/notification.controller.js";

const router = Router();

// GET /api/v1/notifications/child
router.get(
  "/child",
  authJwt,
  requireChild,
  getChildNotificationsController
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
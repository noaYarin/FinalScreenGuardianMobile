import { NotificationType } from "../constants/notificationType.js";
import { NotificationSeverity } from "../constants/severity.js";
import { notifyParent } from "./notification.service.js";
import { AppError } from "../utils/appError.js";
import { Common as CommonErrors } from "../constants/errors.js";

export async function sendSosAlertService({ parentId, childId, deviceId }) {
  if (!parentId) {
    throw new AppError(CommonErrors.INVALID_PARENT_ID);
  }

  if (!childId) {
    throw new AppError(CommonErrors.INVALID_CHILD_ID);
  }

  const notification = await notifyParent({
    parentId,
    childId,
    type: NotificationType.SOS_TRIGGERED,
    severity: NotificationSeverity.CRITICAL,
    title: "SOS Alert",
    description: "Your child sent an SOS alert.",
    data: {
      childId: String(childId),
      deviceId: deviceId ? String(deviceId) : "",
      source: "DISTRESS_BUTTON",
      link: "/Parent/systemAlerts",
    },
  });

  return notification;
}
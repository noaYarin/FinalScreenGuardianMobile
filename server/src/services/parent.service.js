import { AppError } from "../utils/appError.js";
import { Common as CommonErrors } from "../constants/errors.js";
import { ScreenTimeStatus } from "../constants/status.js";
import {
  getChildrenByParentId,
  updateChildActiveByParentId,
  pushChildToParent,
  updateChildInterestsByParentId,
  getChildByParentId,
  deleteChildByParentId,
  updateCurrentChildProfileByParentId

} from "../dal/parent.dal.js";
import { validateAndBuildChildDoc } from "./child.service.js";
import { assertBoolean } from "../utils/validators.js";
import { findDevicesByChildId } from "../dal/device.dal.js";
import {
  buildScreenTimeUsageReport,
  isDeviceDayResetDue,
  isDeviceWeekResetDue,
  resetDailyScreenTimeWithHistory,
  resetWeeklyScreenTimeWithHistory
} from "./screenTimeHistory.service.js";
import { notifyParent } from "./notification.service.js";
import { NotificationType } from "../constants/notificationType.js";
import { NotificationSeverity } from "../constants/severity.js";
import { sendAuditLog } from "./audit.service.js";
import { AuditActionType } from "../constants/auditActionType.js";
import { LimitMode } from "../constants/limitMode.js";

export async function addChild(parentId, body) {
  const childDoc = validateAndBuildChildDoc(body);
  const updated = await pushChildToParent(parentId, childDoc);
  const addedChild = updated.children[updated.children.length - 1];

  try {
    await notifyParent({
      parentId,
      childId: addedChild?._id,
      type: NotificationType.CHILD_ADDED,
      severity: NotificationSeverity.INFO,
      title: "Child Added",
      description: `A new child profile was added${addedChild?.name ? `: ${addedChild.name}` : ""}`
    });
  } catch (err) {
    console.error("notifyParent failed in addChild:", err.message);
  }

  try {
    await sendAuditLog({
      parentId,
      childId: addedChild?._id,
      actionType: AuditActionType.CHILD_ADDED,
    });
  } catch (err) {
    console.error("sendAuditLog failed in addChild:", err.message);
  }

  return { child: addedChild };
}

export async function getChildren(parentId, options = {}) {
  const includeInactive = options.includeInactive === true;
  const childList = await getChildrenByParentId(parentId);
  const filtered = includeInactive ? childList : childList.filter((c) => c.isActive === true);
  return { children: filtered };
}


export async function getChild(parentId, childId) {
  const child = await getChildByParentId(parentId, childId);

  if (!child) {
    throw new AppError(CommonErrors.CHILD_NOT_FOUND);
  }

  return { child };
}

export async function setChildActive(parentId, childId, isActive) {
  assertBoolean(isActive, CommonErrors.VALIDATION_IS_ACTIVE);

  const updatedParent = await updateChildActiveByParentId(parentId, childId, isActive);

  if (!updatedParent) {
    throw new AppError(CommonErrors.NOT_FOUND);
  }

  const list = updatedParent.children || [];
  const updatedChild = list.find((c) => String(c._id) === String(childId));
  if (!updatedChild) {
    throw new AppError(CommonErrors.NOT_FOUND);
  }
  return { child: updatedChild };
}


export async function updateChildInterests(parentId, childId, interests) {
  if (!Array.isArray(interests)) {
    throw new AppError(CommonErrors.VALIDATION_INTERESTS);
  }

  const cleanedInterests = interests
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  const updated = await updateChildInterestsByParentId(
    parentId,
    childId,
    cleanedInterests
  );

  if (!updated) {
    throw new AppError(CommonErrors.CHILD_NOT_FOUND);
  }

  const child = (updated.children || []).find(
    (c) => String(c._id) === String(childId)
  );

  if (!child) {
    throw new AppError(CommonErrors.CHILD_NOT_FOUND);
  }

  return {
    childId: child._id,
    interests: child.interests || []
  };
}

function calculateHomeStatus(used, limit) {
  if (!limit || limit <= 0) {
    return ScreenTimeStatus.GOOD;
  }

  const ratio = used / limit;

  if (ratio >= 1) {
    return ScreenTimeStatus.BAD;
  }

  if (ratio >= 0.8) {
    return ScreenTimeStatus.WARN;
  }

  return ScreenTimeStatus.GOOD;
}

export async function getParentHomeSummary(parentId) {
  const childList = await getChildrenByParentId(parentId);

  const summary = [];

  for (const child of childList) {
    if (child.isActive === false) {
      continue;
    }

    const devices = await findDevicesByChildId(child._id);
    const device = pickRepresentativeDevice(devices);

    if (!device) {
      summary.push({
        childId: child._id,
        name: child.name,
        img: child.img ?? null,
        deviceId: null,
        deviceName: null,

        limitMode: LimitMode.NONE,
        isLimitEnabled: false,

        usedTodayMinutes: null,
        usedWeekMinutes: null,

        dailyLimitMinutes: null,
        weeklyLimitMinutes: null,
        extraMinutesToday: null,

        usedMinutes: null,
        limitMinutes: null,
        remainingMinutes: null,

        status: ScreenTimeStatus.GOOD,

        isLocked: false,
        manualLockEnabled: false,
        dailyLimitLockActive: false,
        weeklyLimitLockActive: false,
        scheduleLockActive: false
      });
      continue;
    }

    const screenTime = device.screenTime || {};

    const isLimitEnabled = screenTime.isLimitEnabled === true;
    const limitMode = isLimitEnabled
      ? screenTime.limitMode || LimitMode.DAILY
      : LimitMode.NONE;

    const usedTodayMinutes = Number(screenTime.usedTodayMinutes || 0);
    const usedWeekMinutes = Number(screenTime.usedWeekMinutes || 0);

    const dailyLimitMinutes = Number(screenTime.dailyLimitMinutes || 0);
    const weeklyLimitMinutes = Number(screenTime.weeklyLimitMinutes || 0);
    const extraMinutesToday = Number(screenTime.extraMinutesToday || 0);

    let usedMinutes = null;
    let limitMinutes = null;
    let remainingMinutes = null;

    if (isLimitEnabled && limitMode === LimitMode.DAILY) {
      usedMinutes = usedTodayMinutes;
      limitMinutes = dailyLimitMinutes + extraMinutesToday;
    }

    if (isLimitEnabled && limitMode === LimitMode.WEEKLY) {
      usedMinutes = usedWeekMinutes;
      limitMinutes = weeklyLimitMinutes;
    }

    if (limitMinutes != null && usedMinutes != null) {
      remainingMinutes = Math.max(limitMinutes - usedMinutes, 0);
    }

    summary.push({
      childId: child._id,
      name: child.name,
      img: child.img ?? null,
      deviceId: device._id,
      deviceName: device.name || null,

      limitMode,
      isLimitEnabled,

      usedTodayMinutes,
      usedWeekMinutes,

      dailyLimitMinutes,
      weeklyLimitMinutes,
      extraMinutesToday,

      usedMinutes,
      limitMinutes,
      remainingMinutes,

      status: calculateHomeStatus(usedMinutes, limitMinutes),

      isLocked: device.isLocked === true,
      manualLockEnabled: device.manualLockEnabled === true,
      dailyLimitLockActive: device.dailyLimitLockActive === true,
      weeklyLimitLockActive: device.weeklyLimitLockActive === true,
      scheduleLockActive: device.scheduleLockActive === true
    });
  }

  return { children: summary };
}


export async function getChildScreenTimeReports(parentId, childId) {
  const child = await getChildByParentId(parentId, childId);

  if (!child) {
    throw new AppError(CommonErrors.CHILD_NOT_FOUND);
  }

  const devices = await findDevicesByChildId(childId);
  let device = pickRepresentativeDevice(devices);

  if (!device) {
    return {
      days: [],
      weeks: [],
      weeklyTotalMinutes: 0,
      monthlyTotalMinutes: 0,
      dailyAverageMinutes: 0,
      monthlyAverageMinutes: 0,
      topApp: null,
      hasLinkedDevice: false
    };
  }

  if (isDeviceDayResetDue(device)) {
    device =
      (await resetDailyScreenTimeWithHistory(device._id)) ?? device;
  }

  if (isDeviceWeekResetDue(device)) {
    device =
      (await resetWeeklyScreenTimeWithHistory(device._id)) ?? device;
  }

  return buildScreenTimeUsageReport(device);
}

export async function updateCurrentChildProfile(parentId, childId, name, birthDate, gender) {
  const updated = await updateCurrentChildProfileByParentId(parentId, childId, name, birthDate, gender);

  if (!updated) {
    throw new AppError(CommonErrors.CHILD_NOT_FOUND);
  }

  return { child: updated };
}


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


export async function deleteChild(parentId, childId) {
  const child = await getChildByParentId(parentId, childId);

  if (!child) {
    throw new AppError(CommonErrors.CHILD_NOT_FOUND);
  }

  const childName = child?.name != null ? String(child.name) : "";

  const devices = await findDevicesByChildId(childId);

  if (devices && devices.length > 0) {
    throw new AppError({
      code: "CHILD_HAS_CONNECTED_DEVICES",
      message: "Cannot delete child with connected devices",
      statusCode: 400
    });
  }

  const updatedParent = await deleteChildByParentId(parentId, childId);

  if (!updatedParent) {
    throw new AppError(CommonErrors.CHILD_NOT_FOUND);
  }

  try {
    await notifyParent({
      parentId,
      childId,
      type: NotificationType.CHILD_DELETED,
      severity: NotificationSeverity.WARNING,
      title: "Child Deleted",
      description: childName ? `Child profile removed: ${childName}` : "A child profile was removed"
    });
  } catch (err) {
    console.error("notifyParent failed in deleteChild:", err.message);
  }

  try {
    await sendAuditLog({
      parentId,
      childId,
      actionType: AuditActionType.CHILD_DELETED,
    });
  } catch (err) {
    console.error("sendAuditLog failed in deleteChild:", err.message);
  }

  return {
    deletedChildId: childId
  };
}

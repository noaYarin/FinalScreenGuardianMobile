import ParentModel from "../models/parent.model.js";
import { getFirebaseAdmin } from "../config/firebaseAdmin.js";

// Converts all notification data values to strings,
// as FCM data payloads only support string key-value pairs.
function stringifyData(data) {
  if (!data) return undefined;

  const out = {};

  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null) continue;
    out[k] = typeof v === "string" ? v : JSON.stringify(v);
  }

  return Object.keys(out).length ? out : undefined;
}

async function sendPushToToken(token, title, body, data, options = {}) {
  if (!token) {
    return { sent: false, reason: "no_fcm_token" };
  }

  const admin = getFirebaseAdmin();

  const priority = options.priority === "high" ? "high" : "normal";
  const channelId = options.channelId || "default";

  const message = {
    token,
    notification: {
      title,
      body,
    },
    android: {
      priority,
      notification: {
        channelId,
        priority: priority === "high" ? "high" : "default",
        defaultSound: true,
        defaultVibrateTimings: true,
        visibility: "public",
      },
    },
    data: stringifyData(data),
  };

  const messageId = await admin.messaging().send(message);

  return { sent: true, messageId };
}

// Parent push notification.
// Uses ParentModel.fcmToken.
export async function sendNotification(userId, title, body, data) {
  const parent = await ParentModel.findById(userId).select("fcmToken").lean();
  const token = parent?.fcmToken;

  const isSos =
    data?.type === "SOS_TRIGGERED" ||
    data?.source === "DISTRESS_BUTTON";

  return sendPushToToken(token, title, body, data, {
    priority: isSos ? "high" : "normal",
    channelId: isSos ? "sos_alerts" : "default",
  });
}

// Child push notification.
// Uses ParentModel.children.$.fcmToken.
export async function sendChildNotification(
  parentId,
  childId,
  title,
  body,
  data
) {
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
  const token = child?.fcmToken;

  return sendPushToToken(token, title, body, data, {
    priority: "normal",
    channelId: "default",
  });
}
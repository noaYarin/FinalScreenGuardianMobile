import ParentModel from "../models/parent.model.js";
import { getFirebaseAdmin } from "../config/firebaseAdmin.js";

// Converts all notification data values to strings, as FCM data payloads only support string key-value pairs
function stringifyData(data) {
  if (!data) return undefined;
  const out = {};
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null) continue;
    out[k] = typeof v === "string" ? v : JSON.stringify(v);
  }
  return Object.keys(out).length ? out : undefined;
}

// Fetches the parent's FCM token from MongoDB and sends a push notification via Firebase Admin SDK
export async function sendNotification(userId, title, body, data) {
  const parent = await ParentModel.findById(userId).select("fcmToken").lean();
  const token = parent?.fcmToken;

  if (!token) {
    return { sent: false, reason: "no_fcm_token" };
  }

  const admin = getFirebaseAdmin();
  const message = {
    token,
    notification: { title, body },
    data: stringifyData(data),
  };

  const messageId = await admin.messaging().send(message);
  return { sent: true, messageId };
}


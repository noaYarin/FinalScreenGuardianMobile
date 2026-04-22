import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadServiceAccount() {
  const jsonFromEnv = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (jsonFromEnv) {
    return JSON.parse(jsonFromEnv);
  }

  const configuredPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    path.resolve(__dirname, "..", "..", "..", "serviceAccountKey.json");

  try {
    const absolutePath = path.isAbsolute(configuredPath)
      ? configuredPath
      : path.resolve(process.cwd(), configuredPath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Service account file not found at: ${absolutePath}`);
    }

    const contents = fs.readFileSync(absolutePath, "utf8");
    return JSON.parse(contents);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(
      [
        "Firebase Admin service account not configured.",
        msg,
        "Set FIREBASE_SERVICE_ACCOUNT_JSON (stringified JSON) or FIREBASE_SERVICE_ACCOUNT_PATH / GOOGLE_APPLICATION_CREDENTIALS (path to JSON).",
      ].join(" ")
    );
  }
}

// Initializes the Firebase Admin SDK if it hasn't been initialized yet.
// Returns the active admin instance to be used throughout the application.
export function getFirebaseAdmin() {
  if (admin.apps.length === 0) {
    const serviceAccount = loadServiceAccount();
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  return admin;
}


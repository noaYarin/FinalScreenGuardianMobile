import * as SecureStore from "expo-secure-store";

// Stores the currently displayed activity id per interest.
// It should only change when the child presses "Shuffle" in Ideas screen.
const KEY = "local_child_current_idea_by_interest";

export async function getLastIdeaIdByInterest(): Promise<Record<string, string>> {
  try {
    const raw = await SecureStore.getItemAsync(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    if (parsed == null || typeof parsed !== "object") return {};
    const obj = parsed as Record<string, unknown>;
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(obj)) {
      const key = String(k || "").trim();
      const val = String(v || "").trim();
      if (!key || !val) continue;
      out[key] = val;
    }
    return out;
  } catch {
    return {};
  }
}

export async function setLastIdeaIdByInterest(map: Record<string, string>): Promise<void> {
  const cleaned: Record<string, string> = {};
  if (map && typeof map === "object") {
    for (const [k, v] of Object.entries(map)) {
      const key = String(k || "").trim();
      const val = String(v || "").trim();
      if (!key || !val) continue;
      cleaned[key] = val;
    }
  }
  await SecureStore.setItemAsync(KEY, JSON.stringify(cleaned));
}

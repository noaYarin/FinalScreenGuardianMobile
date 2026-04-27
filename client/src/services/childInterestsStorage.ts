import * as SecureStore from "expo-secure-store";

const KEY = "local_child_interest_keys";

export async function getLocalChildInterestKeys(): Promise<string[]> {
  try {
    const interestKeys = await SecureStore.getItemAsync(KEY);
    const parsed = interestKeys ? JSON.parse(interestKeys) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export async function setLocalChildInterestKeys(keys: string[]): Promise<void> {
  const cleaned = Array.from(
    new Set((Array.isArray(keys) ? keys : []).map((k) => String(k || "").trim()).filter(Boolean))
  );
  await SecureStore.setItemAsync(KEY, JSON.stringify(cleaned));
}


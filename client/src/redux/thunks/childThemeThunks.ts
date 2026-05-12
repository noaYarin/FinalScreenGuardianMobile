import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";

const KEY_HUE = "child_theme_hue_v1";

function hueFromStoredString(raw: string | null): number | null {
  if (raw == null || raw === "") return null;
  const n = Number.parseFloat(raw);
  if (Number.isFinite(n) && n >= 0 && n <= 360) return n;
  return null;
}

type ChildThemeSlicePick = { childTheme: { storageEpoch: number } };

export type ChildThemeHydrateResult = {
  epochAtStart: number;
  stored: number | null;
};

export const hydrateChildTheme = createAsyncThunk<
  ChildThemeHydrateResult,
  void,
  { state: ChildThemeSlicePick }
>("childTheme/hydrate", async (_, { getState }) => {
  const epochAtStart = getState().childTheme.storageEpoch;

  try {
    const stored = hueFromStoredString(await AsyncStorage.getItem(KEY_HUE));
    return { epochAtStart, stored };
  } catch {
    return { epochAtStart, stored: null };
  }
});

export const setChildThemeHueAndPersist = createAsyncThunk<number, number>(
  "childTheme/setHueAndPersist",
  async (hue) => {
    const H = ((hue % 360) + 360) % 360;
    await AsyncStorage.setItem(KEY_HUE, String(H));
    return H;
  }
);

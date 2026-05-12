import { createSelector, createSlice } from "@reduxjs/toolkit";
import {
  hydrateChildTheme,
  setChildThemeHueAndPersist,
} from "../thunks/childThemeThunks";

export const DEFAULT_CHILD_THEME_HUE = 195;

export type ChildPalette = {
  id: string;
  label: string;
  headerBg: string;
  accent: string;
  accentSoft: string;
  screenBg: string;
  cardBg: string;
  cardBorder: string;
  text: string;
  textMuted: string;
  success: string;
  danger: string;
  chipSelectedBorder: string;
};

function hsl(h: number, s: number, l: number): string {
  const H = Math.round(((h % 360) + 360) % 360);
  return `hsl(${H}, ${s}%, ${l}%)`;
}

export function paletteFromHue(h: number): ChildPalette {
  const H = ((h % 360) + 360) % 360;
  return {
    id: `hue-${Math.round(H)}`,
    label: "My color",
    headerBg: hsl(H, 72, 41),
    accent: hsl(H, 78, 48),
    accentSoft: hsl(H, 62, 92),
    screenBg: hsl(H, 38, 94),
    cardBg: "#FFFFFF",
    cardBorder: hsl(H, 42, 86),
    text: "#0F172A",
    textMuted: "#475569",
    success: "#15803D",
    danger: "#DC2626",
    chipSelectedBorder: hsl(H, 72, 36),
  };
}

export type ChildThemeState = {
  hue: number;
};

const initialState: ChildThemeState = {
  hue: DEFAULT_CHILD_THEME_HUE,
};

const childThemeSlice = createSlice({
  name: "childTheme",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(hydrateChildTheme.fulfilled, (state, action) => {
      if (action.payload.stale) return;
      const { stored } = action.payload;
      state.hue =
        stored != null && Number.isFinite(stored) ? stored : DEFAULT_CHILD_THEME_HUE;
    });
    builder.addCase(setChildThemeHueAndPersist.fulfilled, (state, action) => {
      state.hue = action.payload;
    });
  },
});

export const selectChildThemeHue = (state: { childTheme: ChildThemeState }) =>
  state.childTheme.hue;

export const selectChildPalette = createSelector(
  [selectChildThemeHue],
  (hue): ChildPalette => paletteFromHue(hue)
);

export {
  hydrateChildTheme,
  setChildThemeHueAndPersist,
  hydrateChildTheme as hydrateChildPalette,
} from "../thunks/childThemeThunks";

export default childThemeSlice.reducer;

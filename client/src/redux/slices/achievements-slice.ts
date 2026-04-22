import { createSlice } from "@reduxjs/toolkit";
import { fetchChildAchievementsThunk } from "../thunks/achievementsThunks";
import type { AchievementUiItem } from "@/src/api/achievements";

type AchievementsState = {
  achievements: AchievementUiItem[];
  isLoading: boolean;
  error: string | null;
};

const initialState: AchievementsState = {
  achievements: [],
  isLoading: false,
  error: null,
};

const achievementsSlice = createSlice({
  name: "achievements",
  initialState,
  reducers: {
    clearAchievementsError(state) {
      state.error = null;
    },
    clearAchievements(state) {
      state.achievements = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChildAchievementsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChildAchievementsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.achievements = action.payload;
      })
      .addCase(fetchChildAchievementsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Could not load achievements.";
      });
  },
});

export const { clearAchievementsError, clearAchievements } =
  achievementsSlice.actions;

export default achievementsSlice.reducer;
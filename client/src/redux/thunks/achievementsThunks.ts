import { createAsyncThunk } from "@reduxjs/toolkit";
import * as achievementsApi from "@/src/api/achievements";
import type { AchievementUiItem } from "@/src/api/achievements";

export const fetchChildAchievementsThunk = createAsyncThunk<
  AchievementUiItem[],
  string,
  { rejectValue: string }
>("achievements/fetchChildAchievements", async (childId, thunkAPI) => {
  try {
    const response = await achievementsApi.fetchChildAchievements(childId);

    if (!Array.isArray(response?.achievements)) {
      return thunkAPI.rejectWithValue("achievements.fetch_failed");
    }

    return response.achievements;
  } catch (error) {
    const message =
      (error as Error)?.message ?? "achievements.fetch_failed";

    return thunkAPI.rejectWithValue(message);
  }
});
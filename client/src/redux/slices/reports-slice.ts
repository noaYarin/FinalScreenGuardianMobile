import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ReportsTimeRange = "daily" | "weekly";

type ReportsState = {
  selectedChildId: string | null;
  selectedTimeRange: ReportsTimeRange;
};

const initialState: ReportsState = {
  selectedChildId: null,
  selectedTimeRange: "daily",
};

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    setReportsSelectedChildId(state, action: PayloadAction<string | null>) {
      state.selectedChildId = action.payload;
    },
    setReportsTimeRange(state, action: PayloadAction<ReportsTimeRange>) {
      state.selectedTimeRange = action.payload;
    },
    resetReportsState() {
      return initialState;
    },
  },
});

export const {
  setReportsSelectedChildId,
  setReportsTimeRange,
  resetReportsState,
} = reportsSlice.actions;

export default reportsSlice.reducer;

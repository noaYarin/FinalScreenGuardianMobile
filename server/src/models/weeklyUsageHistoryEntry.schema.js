import mongoose from "mongoose";

export const WeeklyUsageHistoryEntrySchema = new mongoose.Schema(
  {
    weekStartKey: { type: String, required: true },
    weekEndKey: { type: String, default: "" },
    usedMinutes: { type: Number, default: 0, min: 0 },
    recordedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

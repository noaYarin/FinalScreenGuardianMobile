import mongoose from "mongoose";

export const DailyUsageHistoryEntrySchema = new mongoose.Schema(
  {
    //Date of the usage
    dateKey: { type: String, required: true },
    //Minutes used
    usedMinutes: { type: Number, default: 0, min: 0 },
    //Time usage was recorded
    recordedAt: { type: Date, default: Date.now }
  }
);

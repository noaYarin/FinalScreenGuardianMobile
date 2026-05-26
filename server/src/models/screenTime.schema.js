import mongoose from "mongoose";
import { DayScheduleSchema } from "./daySchedule.schema.js";
import { LimitMode } from "../constants/limitMode.js";

import { DailyUsageHistoryEntrySchema } from "./dailyUsageHistoryEntry.schema.js";
import { WeeklyUsageHistoryEntrySchema } from "./weeklyUsageHistoryEntry.schema.js";

export const ScreenTimeSchema = new mongoose.Schema(
    {
        isLimitEnabled: { type: Boolean, default: false },
        limitMode: {
            type: String,
            enum: Object.values(LimitMode),
            default: LimitMode.NONE,
        },
        dailyLimitMinutes: {
            type: Number,
            default: 0,
            min: 0,
            max: 1440
        },
        extraMinutesToday: { type: Number, default: 0 },
        lastDailyResetAt: { type: Date, default: Date.now },
        weeklyLimitMinutes: {
            type: Number,
            default: 0,
            min: 0,
            max: 10080
        },
        lastWeeklyResetAt: { type: Date, default: Date.now },
        usedTodayMinutes: { type: Number, default: 0 },
        usedWeekMinutes: { type: Number, default: 0 },
        dailyUsageHistory: {
            type: [DailyUsageHistoryEntrySchema],
            default: []
        },
        // For weekly usage history, we store the start and end keys of the week
        weeklyUsageHistory: {
            type: [WeeklyUsageHistoryEntrySchema],
            default: []
        },
        // For weekly schedule, we store the schedule for each day of the week
        weeklySchedule: {
            type: [DayScheduleSchema],
            default: []
        }
    },
    { _id: false }
);
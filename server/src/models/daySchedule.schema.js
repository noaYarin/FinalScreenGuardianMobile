import mongoose from "mongoose";

export const DayScheduleSchema = new mongoose.Schema(
  {
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
    },

    isEnabled: {
      type: Boolean,
      default: false,
    },

    startTime: {
      type: String,
      default: "21:00",
    },

    endTime: {
      type: String,
      default: "07:00",
    },
  },
  { _id: false }
);
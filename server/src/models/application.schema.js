import mongoose from "mongoose";
import { ScreenTimeSchema } from "./screenTime.schema.js";

export const ApplicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, default: "default.png" },
    packageName: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    lastUsedAt: { type: Date, default: null },
    screenTime: {
      type: ScreenTimeSchema,
      default: () => ({})
    }
  },
  { _id: false }
);
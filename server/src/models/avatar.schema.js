import mongoose from "mongoose";

export const AvatarSchema = new mongoose.Schema(
  {
    level: { type: Number, default: 1, min: 1 },
    img: { type: String, default: "default.png" },
    currentXp: { type: Number, default: 0, min: 0 },
    nextLevelXp: { type: Number, default: 100, min: 1 },
  },
  { _id: false }
);


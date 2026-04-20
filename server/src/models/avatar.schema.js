import mongoose from "mongoose";

export const AvatarSchema = new mongoose.Schema(
  {
    level: { type: Number, default: 1, min: 1 },
    img: { type: String, default: "avatar_stage_1.png" },
    currentXp: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);


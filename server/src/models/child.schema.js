import mongoose from "mongoose";
import { Role } from "../constants/role.js";
import { Gender } from "../constants/gender.js";
import { AvatarSchema } from "./avatar.schema.js";


export const ChildSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 30 },
    img: { type: String, default: "" },
    birthDate: { type: Date },
    gender: { type: String, enum: Object.values(Gender), default: Gender.OTHER },
    interests: { type: [String], default: [] },
    coins: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    role: { type: String, enum: Object.values(Role), default: Role.CHILD },
    achievements: {
      type: [
        {
          achievementId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Achievement",
            required: true,
          },
          unlockedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
    avatar: { type: AvatarSchema, default: () => ({}) },
  },

  { timestamps: true }
);

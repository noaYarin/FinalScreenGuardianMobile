import mongoose from "mongoose";

export const AchievementSchema = new mongoose.Schema(
    {
        key: { type: String, required: true, unique: true, trim: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, default: "default.png" },
        xpReward: { type: Number, default: 0 },
    }, { timestamps: true }
);

export default mongoose.model("Achievement", AchievementSchema);
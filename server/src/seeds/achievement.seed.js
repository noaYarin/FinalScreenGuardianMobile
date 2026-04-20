import mongoose from "mongoose";
import dotenv from "dotenv";
import AchievementModel from "../models/achievement.schema.js";

dotenv.config();

// Initial achievement catalog for the gamification system.
// These achievements are simple, positive, and easy to connect to real backend flows.
const achievementsSeed = [
  {
    key: "first_task_submitted",
    title: "First Step",
    description: "Submitted your first task",
    icon: "achievement_first_task.png",
    xpReward: 20,
  },
  {
    key: "five_tasks_submitted",
    title: "Task Champion",
    description: "Submitted 5 tasks",
    icon: "achievement_five_tasks.png",
    xpReward: 40,
  },
  {
    key: "first_reward_redeemed",
    title: "First Reward",
    description: "Redeemed your first reward",
    icon: "achievement_first_reward.png",
    xpReward: 20,
  },
  {
    key: "avatar_level_2",
    title: "Level Up",
    description: "Reached avatar level 2",
    icon: "achievement_level_2.png",
    xpReward: 15,
  },
  {
    key: "avatar_level_5",
    title: "Rising Star",
    description: "Reached avatar level 5",
    icon: "achievement_level_5.png",
    xpReward: 50,
  },
];

// Connects to MongoDB and inserts or updates achievements by key.
async function seedAchievements() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    for (const achievement of achievementsSeed) {
      await AchievementModel.updateOne(
        { key: achievement.key },
        { $set: achievement },
        { upsert: true }
      );
    }

    console.log("Achievements seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding achievements:", error);
    process.exit(1);
  }
}

seedAchievements();
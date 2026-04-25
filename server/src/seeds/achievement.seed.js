import mongoose from "mongoose";
import dotenv from "dotenv";
import AchievementModel from "../models/achievement.model.js";

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
    key: "first_photo_task",
    title: "Proof Star",
    description: "Submitted a task with a photo",
    icon: "achievement_photo_task.png",
    xpReward: 25,
  },
  {
    key: "first_reward_redeemed",
    title: "First Reward",
    description: "Redeemed your first reward",
    icon: "achievement_first_reward.png",
    xpReward: 20,
  },
  {
    key: "saved_100_coins",
    title: "Smart Saver",
    description: "Saved 100 coins",
    icon: "achievement_saver.png",
    xpReward: 30,
  },
  {
    key: "first_day_under_limit",
    title: "Balanced Day",
    description: "Stayed within your daily screen-time limit",
    icon: "achievement_balanced_day.png",
    xpReward: 25,
  },
  {
    key: "three_days_under_limit",
    title: "Balance Builder",
    description: "Stayed within the daily limit for 3 days",
    icon: "achievement_balance_builder.png",
    xpReward: 40,
  },
  {
    key: "first_extension_request",
    title: "Good Communication",
    description: "Sent your first screen-time request",
    icon: "achievement_request.png",
    xpReward: 15,
  },
  {
    key: "first_goal_completed",
    title: "Goal Getter",
    description: "Completed your first weekly goal",
    icon: "achievement_goal.png",
    xpReward: 30,
  },
  {
    key: "perfect_week",
    title: "Perfect Week",
    description: "Completed all weekly goals",
    icon: "achievement_perfect_week.png",
    xpReward: 80,
  },
  {
    key: "avatar_level_2",
    title: "Level Up",
    description: "Reached avatar level 2",
    icon: "achievement_level_2.png",
    xpReward: 0,
  },
  {
    key: "avatar_level_5",
    title: "Rising Star",
    description: "Reached avatar level 5",
    icon: "achievement_level_5.png",
    xpReward: 0,
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
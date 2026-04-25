import mongoose from "mongoose";
import dotenv from "dotenv";
import AchievementModel from "../models/achievement.model.js";

dotenv.config();

// Initial achievement catalog for the gamification system.
// These achievements are simple, positive, and easy to connect to real backend flows.
const achievementsSeed = [
  // Direct API response: unlock after the child submits any task.
  // No socket needed because the child is already performing the action in the app.
  {
    key: "first_task_submitted",
    title: "First Step",
    description: "Submitted your first task",
    icon: "achievement_first_task.png",
    xpReward: 20,
  },

  // Direct API response: unlock after the child reaches 5 submitted tasks.
  // No socket needed because it is checked during the task submission flow.
  {
    key: "five_tasks_submitted",
    title: "Task Champion",
    description: "Submitted 5 tasks",
    icon: "achievement_five_tasks.png",
    xpReward: 40,
  },

  // Direct API response: unlock after the child submits a task with a proof photo.
  // No socket needed because it is checked during the photo upload / task submission flow.
  {
    key: "first_photo_task",
    title: "Proof Star",
    description: "Submitted a task with a photo",
    icon: "achievement_photo_task.png",
    xpReward: 25,
  },

  // Direct API response: unlock after the child redeems a reward for the first time.
  // No socket needed if the child redeems the reward from the shop screen.
  {
    key: "first_reward_redeemed",
    title: "First Reward",
    description: "Redeemed your first reward",
    icon: "achievement_first_reward.png",
    xpReward: 20,
  },

  // Direct API response: unlock after a flow updates the child's coin balance to 100 or more.
  // No socket needed if checked after task approval / reward / coin update responses.
  {
    key: "saved_100_coins",
    title: "Smart Saver",
    description: "Saved 100 coins",
    icon: "achievement_saver.png",
    xpReward: 30,
  },

  // Usually socket/background event: unlock when the system detects the child finished the day under the limit.
  // This is not tied to a direct button press, so it should be checked after daily usage sync / daily reset.
  {
    key: "first_day_under_limit",
    title: "Balanced Day",
    description: "Stayed within your daily screen-time limit",
    icon: "achievement_balanced_day.png",
    xpReward: 25,
  },

  // Usually socket/background event: unlock after the system detects 3 separate days under the daily limit.
  // Requires daily history/streak tracking, so it is better for a later stage.
  {
    key: "three_days_under_limit",
    title: "Balance Builder",
    description: "Stayed within the daily limit for 3 days",
    icon: "achievement_balance_builder.png",
    xpReward: 40,
  },

  // Direct API response: unlock when the child sends the first extension request.
  // No socket needed because the child is already submitting the request in the app.
  {
    key: "first_extension_request",
    title: "Good Communication",
    description: "Sent your first screen-time request",
    icon: "achievement_request.png",
    xpReward: 15,
  },

  // Direct API response if weekly goals are submitted/completed by the child.
  // Socket may be needed only if the goal is completed automatically in the background.
  {
    key: "first_goal_completed",
    title: "Goal Getter",
    description: "Completed your first weekly goal",
    icon: "achievement_goal.png",
    xpReward: 30,
  },

  // Usually background/check event: unlock when the system detects all weekly goals are completed.
  // Socket is useful if this can happen from background sync or parent-side updates.
  {
    key: "perfect_week",
    title: "Perfect Week",
    description: "Completed all weekly goals",
    icon: "achievement_perfect_week.png",
    xpReward: 80,
  },

  // Internal gamification check: unlock after XP update causes avatar to reach level 2.
  // No socket needed if triggered inside the same API response that added XP.
  {
    key: "avatar_level_2",
    title: "Level Up",
    description: "Reached avatar level 2",
    icon: "achievement_level_2.png",
    xpReward: 0,
  },

  // Internal gamification check: unlock after XP update causes avatar to reach level 5.
  // No socket needed if triggered inside the same API response that added XP.
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
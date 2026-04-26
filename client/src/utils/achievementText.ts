// Returns the text shown for a locked achievement.
export function getLockedAchievementHint(key?: string, fallback?: string) {
  switch (key) {
    case "first_task_submitted":
      return "Submit your first task to unlock this badge.";

    case "five_tasks_submitted":
      return "Submit 5 tasks to unlock this badge.";

    case "first_photo_task":
      return "Submit a task with a photo to unlock this badge.";

    case "first_reward_redeemed":
      return "Redeem your first reward to unlock this badge.";

    case "saved_100_coins":
      return "Save 100 coins to unlock this badge.";

    case "first_day_under_limit":
      return "Stay within your daily screen-time limit to unlock this badge.";

    case "three_days_under_limit":
      return "Stay within your daily limit for 3 days to unlock this badge.";

    case "first_extension_request":
      return "Send your first screen-time request to unlock this badge.";

    case "first_goal_completed":
      return "Complete your first weekly goal to unlock this badge.";

    case "perfect_week":
      return "Complete all weekly goals to unlock this badge.";

    case "avatar_level_2":
      return "Reach avatar level 2 to unlock this badge.";

    case "avatar_level_5":
      return "Reach avatar level 5 to unlock this badge.";

    default:
      return fallback || "Keep making progress to unlock this badge.";
  }
}
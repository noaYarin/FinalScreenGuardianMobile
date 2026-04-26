import { MaterialCommunityIcons } from "@expo/vector-icons";

export type AchievementIconName =
  React.ComponentProps<typeof MaterialCommunityIcons>["name"];

// Returns the MaterialCommunityIcons icon that matches an achievement key.
export function getAchievementIconByKey(key?: string): AchievementIconName {
  switch (key) {
    case "first_task_submitted":
      return "clipboard-check-outline";

    case "five_tasks_submitted":
      return "clipboard-check-multiple-outline";

    case "first_photo_task":
      return "camera-outline";

    case "first_reward_redeemed":
      return "gift-outline";

    case "saved_100_coins":
      return "cash-multiple";

    case "first_day_under_limit":
      return "clock-check-outline";

    case "three_days_under_limit":
      return "calendar-check-outline";

    case "first_extension_request":
      return "message-text-clock-outline";

    case "first_goal_completed":
      return "target";

    case "perfect_week":
      return "calendar-star";

    case "avatar_level_2":
      return "shield-star-outline";

    case "avatar_level_5":
      return "star-circle-outline";

    default:
      return "trophy-outline";
  }
}
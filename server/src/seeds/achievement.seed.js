// Initial achievement catalog for the gamification system.
// The catalog includes achievements that are already easy to connect to existing flows,
// and achievements that are planned for later because they require reliable tracking over time.
const achievementsSeed = [
  // Implemented flow:
  // Can be unlocked directly after the child submits a task.
  // Socket can be used to notify/update the UI after the achievement is unlocked.
  {
    key: "first_task_submitted",
    title: "First Step",
    description: "Submitted your first task",
    icon: "achievement_first_task.png",
    xpReward: 20,
  },

  // Implemented flow:
  // Can be unlocked when the child reaches 5 submitted tasks.
  // This can be checked during the task submission flow and then pushed to the UI with socket.
  {
    key: "five_tasks_submitted",
    title: "Task Champion",
    description: "Submitted 5 tasks",
    icon: "achievement_five_tasks.png",
    xpReward: 40,
  },

  // Implemented flow:
  // Can be unlocked when the child submits a task with a proof photo.
  // The achievement check belongs to the task submission/photo flow, with socket used for live UI update.
  {
    key: "first_photo_task",
    title: "Proof Star",
    description: "Submitted a task with a photo",
    icon: "achievement_photo_task.png",
    xpReward: 25,
  },

  // Implemented flow:
  // Can be unlocked when the child redeems a reward for the first time.
  // The redeem action is direct, and socket can update the child/parent UI after the change.
  {
    key: "first_reward_redeemed",
    title: "First Reward",
    description: "Redeemed your first reward",
    icon: "achievement_first_reward.png",
    xpReward: 20,
  },

  // Implemented flow:
  // Can be unlocked after a flow updates the child's coin balance to 100 or more.
  // This can be checked after task approval, reward redemption, or any coin balance update.
  // Socket can be used to refresh the achievement and gamification state in the app.
  {
    key: "saved_100_coins",
    title: "Smart Saver",
    description: "Saved 100 coins",
    icon: "achievement_saver.png",
    xpReward: 30,
  },

  // Not fully implemented yet:
  // This requires reliable daily screen-time usage tracking and a clear end-of-day/daily-reset check.
  // Socket exists, but the achievement itself should wait until daily usage sync/reset logic is stable.
  {
    key: "first_day_under_limit",
    title: "Balanced Day",
    description: "Stayed within your daily screen-time limit",
    icon: "achievement_balanced_day.png",
    xpReward: 25,
  },

  // Not implemented yet:
  // Requires saving daily history or streak data across multiple days.
  // Socket can update the UI after unlock, but the backend still needs stable multi-day tracking.
  {
    key: "three_days_under_limit",
    title: "Balance Builder",
    description: "Stayed within the daily limit for 3 days",
    icon: "achievement_balance_builder.png",
    xpReward: 40,
  },

  // Implemented flow:
  // Can be unlocked when the child sends the first screen-time extension request.
  // The request action already happens through the app, and socket can update parent/child state live.
  {
    key: "first_extension_request",
    title: "Good Communication",
    description: "Sent your first screen-time request",
    icon: "achievement_request.png",
    xpReward: 15,
  },

  // Partially implemented / depends on weekly goals feature:
  // Can be unlocked if weekly goals are actually created and completed in the system.
  // Socket can be used to update the UI after completion, but this depends on the goal flow being connected.
  {
    key: "first_goal_completed",
    title: "Goal Getter",
    description: "Completed your first weekly goal",
    icon: "achievement_goal.png",
    xpReward: 30,
  },

  // Not implemented yet:
  // Requires full weekly-goals tracking and a reliable weekly summary/check.
  // Socket can notify the app after unlock, but the backend still needs the weekly completion logic.
  {
    key: "perfect_week",
    title: "Perfect Week",
    description: "Completed all weekly goals",
    icon: "achievement_perfect_week.png",
    xpReward: 80,
  },

  // Implemented flow:
  // Can be unlocked when an XP update causes the avatar to reach level 2.
  // This should be checked inside the same gamification flow that updates XP/level,
  // and socket can refresh the avatar and achievements UI.
  {
    key: "avatar_level_2",
    title: "Level Up",
    description: "Reached avatar level 2",
    icon: "achievement_level_2.png",
    xpReward: 0,
  },

  // Implemented flow:
  // Can be unlocked when an XP update causes the avatar to reach level 5.
  // This depends on the avatar level calculation being connected to XP updates,
  // with socket used to refresh the UI after the achievement is unlocked.
  {
    key: "avatar_level_5",
    title: "Rising Star",
    description: "Reached avatar level 5",
    icon: "achievement_level_5.png",
    xpReward: 0,
  },
];
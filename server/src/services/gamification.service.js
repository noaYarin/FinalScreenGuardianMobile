import {
  findAchievementByKeyDal,
  findAllAchievementsDal,
  findParentWithChildDal,
  getChildFromParent,
  saveParentDal,
} from "../dal/gamification.dal.js";

import { AppError } from "../utils/appError.js";
import { Common } from "../constants/errors.js";
import { notifyChild } from "./notification.service.js";
import { NotificationType } from "../constants/notificationType.js";
import { NotificationSeverity } from "../constants/severity.js";

// Returns how much XP is required to advance from the current level.
function getXpRequiredForLevel(level) {
  return 100 + (level - 1) * 50;
}

// Returns the avatar image name that matches the child's gender and current level.
function getAvatarImageByLevel(level, gender) {
  const prefix = gender === "girl" ? "avatar_girl" : "avatar_boy";

  if (level >= 9) return `${prefix}_stage_5.png`;
  if (level >= 7) return `${prefix}_stage_4.png`;
  if (level >= 5) return `${prefix}_stage_3.png`;
  if (level >= 3) return `${prefix}_stage_2.png`;

  return `${prefix}_stage_1.png`;
}

// Ensures the avatar object always has safe default values before calculations.
function normalizeAvatar(avatar = {}, gender) {
  return {
    level: avatar.level ?? 1,
    currentXp: avatar.currentXp ?? 0,
    img: avatar.img || getAvatarImageByLevel(1, gender),
  };
}

// Adds XP to the avatar, applies level-ups if needed, and updates the image.
export function addXpToAvatar(avatar, xpToAdd, gender) {
  const safeAvatar = normalizeAvatar(avatar, gender);
  let level = safeAvatar.level;
  let currentXp = safeAvatar.currentXp + xpToAdd;

  let requiredXp = getXpRequiredForLevel(level);

  while (currentXp >= requiredXp) {
    currentXp -= requiredXp;
    level += 1;
    requiredXp = getXpRequiredForLevel(level);
  }

  return {
    level,
    currentXp,
    img: getAvatarImageByLevel(level, gender),
  };
}


// Returns avatar-level achievement keys when the XP reward causes the avatar to cross a level milestone.
function getAvatarLevelAchievementKeys(previousLevel, newLevel) {
  const achievementKeys = [];

  if (previousLevel < 2 && newLevel >= 2) {
    achievementKeys.push("avatar_level_2");
  }

  if (previousLevel < 5 && newLevel >= 5) {
    achievementKeys.push("avatar_level_5");
  }

  return achievementKeys;
}


// Checks whether the child has already unlocked a specific achievement.
function hasChildUnlockedAchievement(child, achievementId) {
  const childAchievements = child.achievements ?? [];

  return childAchievements.some(
    (item) => String(item.achievementId) === String(achievementId)
  );
}

// Builds a full achievements list for the UI by merging the catalog with the child's unlocked achievements.
function buildAchievementsForUi(allAchievements, childAchievements = []) {
  return allAchievements.map((achievement) => {
    const unlockedItem = childAchievements.find(
      (item) => String(item.achievementId) === String(achievement._id)
    );

    return {
      _id: String(achievement._id),
      key: achievement.key,
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      xpReward: achievement.xpReward ?? 0,
      unlocked: Boolean(unlockedItem),
      unlockedAt: unlockedItem?.unlockedAt ?? null,
    };
  });
}

// Sends a real-time child notification for each achievement that was unlocked.
async function notifyChildAboutUnlockedAchievements(
  parentId,
  childId,
  unlockedAchievements
) {
  if (!Array.isArray(unlockedAchievements) || unlockedAchievements.length === 0) {
    return;
  }

  for (const achievement of unlockedAchievements) {
    try {
      await notifyChild({
        parentId,
        childId,
        type: NotificationType.ACHIEVEMENT_UNLOCKED,
        severity: NotificationSeverity.SUCCESS,
        title: "New achievement unlocked!",
        description: achievement.title,
        data: {
          achievement,
        },
      });
    } catch (err) {
      console.error(
        "notifyChild failed in notifyChildAboutUnlockedAchievements:",
        err.message
      );
    }
  }
}

// Unlocks an achievement for a child, grants its XP reward, and updates the avatar.
export async function unlockAchievementForChildService(
  parentId,
  childId,
  achievementKey
) {
  const achievement = await findAchievementByKeyDal(achievementKey);

  if (!achievement) {
    throw new AppError(Common.NOT_FOUND);
  }

  const parent = await findParentWithChildDal(parentId, childId);

  if (!parent) {
    throw new AppError(Common.CHILD_NOT_FOUND);
  }

  const child = getChildFromParent(parent, childId);

  if (!child) {
    throw new AppError(Common.CHILD_NOT_FOUND);
  }

  if (hasChildUnlockedAchievement(child, achievement._id)) {
    return {
      unlocked: false,
      reason: "already_unlocked",
      achievement: null,
      avatar: child.avatar,
    };
  }

  child.achievements = child.achievements ?? [];

  child.achievements.push({
    achievementId: achievement._id,
    unlockedAt: new Date(),
  });

  const previousAvatar = normalizeAvatar(child.avatar, child.gender);
  const previousLevel = previousAvatar.level;

  child.avatar = addXpToAvatar(
    child.avatar,
    achievement.xpReward ?? 0,
    child.gender
  );

  // Checks whether this XP reward caused the avatar to reach a level-based achievement.
  // The batch unlock service will handle duplicate prevention and notifications.
  const avatarLevelAchievementKeys = getAvatarLevelAchievementKeys(
    previousLevel,
    child.avatar.level
  );
  await saveParentDal(parent);

  return {
    unlocked: true,
    reason: null,
    achievement: {
      _id: String(achievement._id),
      key: achievement.key,
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      xpReward: achievement.xpReward ?? 0,
    },
    avatar: child.avatar,
    avatarLevelAchievementKeys,
  };
}

// Unlocks multiple achievements for a child, including avatar-level achievements triggered by XP rewards.
// Notifications are sent only for achievements that were actually unlocked in this flow.
export async function unlockAchievementsForChildService(
  parentId,
  childId,
  achievementKeys
) {
  const unlockedAchievements = [];

  // Uses a dynamic queue because unlocking one achievement can grant XP
  // and trigger additional avatar-level achievements in the same flow.
  const pendingKeys = [...new Set(achievementKeys)];

  for (let index = 0; index < pendingKeys.length; index += 1) {
    const key = pendingKeys[index];

    const result = await unlockAchievementForChildService(
      parentId,
      childId,
      key
    );

    if (result?.unlocked && result?.achievement) {
      unlockedAchievements.push(result.achievement);

      // Add avatar-level achievements that were triggered by the XP reward.
      // Duplicate keys are skipped here, and already-unlocked achievements are skipped by the single unlock service.
      for (const avatarKey of result.avatarLevelAchievementKeys ?? []) {
        if (!pendingKeys.includes(avatarKey)) {
          pendingKeys.push(avatarKey);
        }
      }
    }
  }

  await notifyChildAboutUnlockedAchievements(
    parentId,
    childId,
    unlockedAchievements
  );

  return unlockedAchievements;
}

// Returns the child's achievements data for the achievements screen.
export async function getChildAchievementsDataService(parentId, childId) {
  const parent = await findParentWithChildDal(parentId, childId);

  if (!parent) {
    throw new AppError(Common.CHILD_NOT_FOUND);
  }

  const child = getChildFromParent(parent, childId);

  if (!child) {
    throw new AppError(Common.CHILD_NOT_FOUND);
  }

  const allAchievements = await findAllAchievementsDal();

  return {
    achievements: buildAchievementsForUi(
      allAchievements,
      child.achievements ?? []
    ),
  };
}
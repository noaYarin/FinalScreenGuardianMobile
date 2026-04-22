import {
  findAchievementByKeyDal,
  findAllAchievementsDal,
  findParentWithChildDal,
  getChildFromParent,
  saveParentDal,
} from "../dal/gamification.dal.js";

import { AppError } from "../utils/appError.js";
import { Common } from "../constants/errors.js";

// Returns how much XP is required to advance from the current level.
function getXpRequiredForLevel(level) {
  return 100 + (level - 1) * 50;
}

// Returns the avatar image name that matches the child's current level.
function getAvatarImageByLevel(level) {
  if (level >= 9) return "avatar_stage_5.png";
  if (level >= 7) return "avatar_stage_4.png";
  if (level >= 5) return "avatar_stage_3.png";
  if (level >= 3) return "avatar_stage_2.png";

  return "avatar_stage_1.png";
}

// Ensures the avatar object always has safe default values before calculations.
function normalizeAvatar(avatar = {}) {
  return {
    level: avatar.level ?? 1,
    currentXp: avatar.currentXp ?? 0,
    img: avatar.img || "avatar_stage_1.png",
  };
}

// Adds XP to the avatar, applies level-ups if needed, and updates the image.
export function addXpToAvatar(avatar, xpToAdd) {
  const safeAvatar = normalizeAvatar(avatar);
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
    img: getAvatarImageByLevel(level),
  };
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

  child.achievements.push({
    achievementId: achievement._id,
    unlockedAt: new Date(),
  });

  child.avatar = addXpToAvatar(child.avatar, achievement.xpReward ?? 0);

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
  };
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
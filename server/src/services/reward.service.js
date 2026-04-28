import {
  findParentChildById,
  createManyRewards,
  findRewardsByParentId,
  findRewardsByParentIdAndChildId,
  findRewardsByChildId,
  findRewardById,
  deleteRewardById,
} from "../dal/reward.dal.js";
import { decrementChildCoinsByParentId } from "../dal/parent.dal.js";
import { unlockAchievementsForChildService } from "./gamification.service.js";
import { NotificationSeverity } from "../constants/severity.js";
import { NotificationType } from "../constants/notificationType.js";
import { notifyChild, notifyParent } from "./notification.service.js";

function badRequest(message) {
  const err = new Error(message);
  err.statusCode = 400;
  return err;
}

function notFound(message) {
  const err = new Error(message);
  err.statusCode = 404;
  return err;
}

function forbidden(message) {
  const err = new Error(message);
  err.statusCode = 403;
  return err;
}

export async function createRewards(parentId, payload) {
  const {
    title,
    description = "",
    icon = "default.png",
    coins,
    assignedChildIds,
  } = payload ?? {};

  const trimmedTitle = typeof title === "string" ? title.trim() : "";
  const normalizedDescription =
    typeof description === "string" ? description.trim() : "";
  const normalizedIcon =
    typeof icon === "string" && icon.trim() ? icon.trim() : "default.png";
  const normalizedCoins = Number(coins);

  if (!trimmedTitle) {
    throw badRequest("Reward title is required.");
  }

  if (!Number.isFinite(normalizedCoins) || normalizedCoins < 0) {
    throw badRequest("Reward coins must be a valid non-negative number.");
  }

  if (!Array.isArray(assignedChildIds) || assignedChildIds.length === 0) {
    throw badRequest("At least one child must be selected.");
  }

  for (const childId of assignedChildIds) {
    const child = await findParentChildById(parentId, childId);
    if (!child) {
      throw badRequest(`Child ${childId} does not belong to this parent.`);
    }
  }

  const docs = assignedChildIds.map((childId) => ({
    title: trimmedTitle,
    description: normalizedDescription,
    icon: normalizedIcon,
    coins: normalizedCoins,
    isActive: true,
    parentId,
    childId,
    redeemedAt: null,
  }));

  const createdRewards = await createManyRewards(docs);

  for (const reward of createdRewards) {
    try {
      await notifyChild({
        parentId,
        childId: reward.childId,
        type: NotificationType.REWARD_CREATED,
        severity: NotificationSeverity.INFO,
        title: "New reward",
        description: `A new reward was added: ${reward.title}`,
        data: {
          coins: Number(reward.coins ?? 0),
        },
      });
    } catch (err) {
      console.error("notifyChild failed in createRewards:", err.message);
    }
  }

  return {
    rewards: createdRewards,
  };
}

export async function getParentRewards(parentId, options = {}) {
  const { childId } = options;

  const rewards = childId
    ? await findRewardsByParentIdAndChildId(parentId, childId)
    : await findRewardsByParentId(parentId);

  return {
    rewards,
  };
}

export async function getChildRewards(childId) {
  const rewards = await findRewardsByChildId(childId);

  return {
    rewards,
  };
}

export async function redeemReward(childId, rewardId) {
  const reward = await findRewardById(rewardId);

  if (!reward) {
    throw notFound("Reward not found.");
  }

  if (String(reward.childId) !== String(childId)) {
    throw forbidden("You cannot redeem this reward.");
  }

  if (!reward.isActive) {
    throw badRequest("This reward is not active.");
  }

  if (reward.redeemedAt) {
    throw badRequest("This reward was already redeemed.");
  }

  const updatedChild = await decrementChildCoinsByParentId(
    reward.parentId,
    childId,
    reward.coins
  );

  if (!updatedChild) {
    throw badRequest("The child does not have enough coins for this reward.");
  }

  reward.redeemedAt = new Date();
  await reward.save();

  try {
    await notifyParent({
      parentId: reward.parentId,
      childId,
      type: NotificationType.REWARD_REDEEMED,
      severity: NotificationSeverity.INFO,
      title: "Reward redeemed",
      description: `Your child redeemed a reward: ${reward.title}`,
    });
  } catch (err) {
    console.error("notifyParent failed in redeemReward:", err.message);
  }

  // Unlocks the first reward redemption achievement without blocking the reward flow.
  try {
    await unlockAchievementsForChildService(reward.parentId, childId, [
      "first_reward_redeemed",
    ]);
  } catch (err) {
    console.error(
      "unlock first_reward_redeemed failed in redeemReward:",
      err.message
    );
  }

  return {
    reward,
    child: updatedChild,
    spentCoins: reward.coins,
  };
}

export async function toggleRewardActive(parentId, rewardId) {
  const reward = await findRewardById(rewardId);

  if (!reward) {
    throw notFound("Reward not found.");
  }

  if (String(reward.parentId) !== String(parentId)) {
    throw forbidden("You cannot change this reward.");
  }

  reward.isActive = !reward.isActive;

  await reward.save();

  return {
    reward,
  };
}

export async function deleteReward(parentId, rewardId) {
  const reward = await findRewardById(rewardId);

  if (!reward) {
    throw notFound("Reward not found.");
  }

  if (String(reward.parentId) !== String(parentId)) {
    throw forbidden("You cannot delete this reward.");
  }

  await deleteRewardById(rewardId);

  return {
    deletedRewardId: rewardId,
  };
}
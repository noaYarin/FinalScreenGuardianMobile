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
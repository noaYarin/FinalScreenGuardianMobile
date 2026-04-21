import {
  createRewards,
  getParentRewards,
  getChildRewards,
  redeemReward,
  toggleRewardActive,
  deleteReward,
} from "../services/reward.service.js";

export async function createRewardsController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const data = await createRewards(parentId, req.body);
    res.status(201).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getParentRewardsController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { childId } = req.query;

    const data = await getParentRewards(parentId, { childId });
    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getChildRewardsController(req, res, next) {
  try {
    const childId = req.user.childId;
    const data = await getChildRewards(childId);
    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function redeemRewardController(req, res, next) {
  try {
    const childId = req.user.childId;
    const { rewardId } = req.params;

    const data = await redeemReward(childId, rewardId);
    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function toggleRewardActiveController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { rewardId } = req.params;

    const data = await toggleRewardActive(parentId, rewardId);
    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function deleteRewardController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { rewardId } = req.params;

    const data = await deleteReward(parentId, rewardId);
    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}
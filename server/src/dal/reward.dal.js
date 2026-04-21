import mongoose from "mongoose";
import RewardModel from "../models/reward.model.js";
import ParentModel from "../models/parent.model.js";

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

export async function findParentChildById(parentId, childId) {
  if (!isValidObjectId(parentId) || !isValidObjectId(childId)) {
    return null;
  }

  const parent = await ParentModel.findOne(
    {
      _id: parentId,
      "children._id": childId,
    },
    {
      _id: 1,
      "children.$": 1,
    }
  ).lean();

  return parent?.children?.[0] ?? null;
}

export async function createManyRewards(docs) {
  return RewardModel.insertMany(docs);
}

export async function findRewardsByParentId(parentId) {
  return RewardModel.find({ parentId }).sort({ createdAt: -1 }).lean();
}

export async function findRewardsByParentIdAndChildId(parentId, childId) {
  return RewardModel.find({ parentId, childId }).sort({ createdAt: -1 }).lean();
}

export async function findRewardsByChildId(childId) {
  return RewardModel.find({ childId }).sort({ createdAt: -1 }).lean();
}

export async function findRewardById(rewardId) {
  if (!isValidObjectId(rewardId)) {
    return null;
  }

  return RewardModel.findById(rewardId);
}

export async function deleteRewardById(rewardId) {
  if (!isValidObjectId(rewardId)) {
    return null;
  }

  return RewardModel.findByIdAndDelete(rewardId).lean();
}
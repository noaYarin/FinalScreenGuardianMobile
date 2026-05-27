import ParentModel from "../models/parent.model.js";
import { assertValidObjectId } from "../utils/validators.js";
import { Common as CommonErrors } from "../constants/errors.js";

export async function getCompletedBadgeIdsDal(parentId, childId) {
  assertValidObjectId(parentId, CommonErrors.INVALID_PARENT_ID);
  assertValidObjectId(childId, CommonErrors.INVALID_CHILD_ID);

  const parent = await ParentModel.findOne(
    { _id: parentId, "children._id": childId },
    { children: { $elemMatch: { _id: childId } } }
  ).lean();

  const child = parent?.children?.[0];
  if (!child) return null;

  return Array.isArray(child.completedBadgeIds)
    ? child.completedBadgeIds.map((id) => Number(id)).filter((id) => id > 0)
    : [];
}

export async function addCompletedBadgeIdDal(parentId, childId, badgeId) {
  assertValidObjectId(parentId, CommonErrors.INVALID_PARENT_ID);
  assertValidObjectId(childId, CommonErrors.INVALID_CHILD_ID);

  const updated = await ParentModel.findOneAndUpdate(
    { _id: parentId, "children._id": childId },
    { $addToSet: { "children.$.completedBadgeIds": Number(badgeId) } },
    { new: true, projection: { children: { $elemMatch: { _id: childId } } } }
  ).lean();

  const child = updated?.children?.[0];
  if (!child) return null;

  return Array.isArray(child.completedBadgeIds)
    ? child.completedBadgeIds.map((id) => Number(id)).filter((id) => id > 0)
    : [];
}

import ParentModel from "../models/parent.model.js";
import AchievementModel from "../models/achievement.model.js";

// Finds a single achievement document by its unique key.
export async function findAchievementByKeyDal(key) {
  return await AchievementModel.findOne({ key });
}

// Finds the parent document that contains the requested child.
export async function findParentWithChildDal(parentId, childId) {
  return await ParentModel.findOne(
    {
      _id: parentId,
      "children._id": childId,
    }
  );
}

// Extracts the embedded child document from the parent document.
export function getChildFromParent(parent, childId) {
  if (!parent) {
    return null;
  }

  return parent.children.id(childId) || null;
}

// Persists the updated parent document, including embedded child changes.
export async function saveParentDal(parent) {
  return await parent.save();
}
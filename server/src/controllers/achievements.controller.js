import {
  getChildAchievementsDataService,
  unlockAchievementForChildService,
} from "../services/gamification.service.js";

export async function getChildAchievementsDataController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const childId = req.user.childId;

    const data = await getChildAchievementsDataService(parentId, childId);

    res.status(200).json({
      ok: true,
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function unlockAchievementForChildController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const childId = req.user.childId;
    const { achievementKey } = req.body;

    const data = await unlockAchievementForChildService(
      parentId,
      childId,
      achievementKey
    );

    res.status(200).json({
      ok: true,
      data,
    });
  } catch (err) {
    next(err);
  }
}
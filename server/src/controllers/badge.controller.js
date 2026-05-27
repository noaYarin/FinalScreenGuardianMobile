import {
  getChildBadgesService,
  getChildBadgeProgressService,
  unlockChildBadgeService,
} from "../services/badge.service.js";

export async function getChildBadgesController(req, res, next) {
  try {
    const childId = req.user.childId;
    const parentId = req.user.parentId;

    const data = await getChildBadgesService({ parentId, childId });

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getChildBadgeProgressController(req, res, next) {
  try {
    const childId = req.user.childId;
    const parentId = req.user.parentId;

    const data = await getChildBadgeProgressService({ parentId, childId });

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function unlockChildBadgeController(req, res, next) {
  try {
    const { deviceId, badgeId, title } = req.body;
    const childId = req.user.childId;
    const parentId = req.user.parentId;

    const data = await unlockChildBadgeService({
      deviceId,
      childId,
      parentId,
      badgeId,
      title,
    });

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

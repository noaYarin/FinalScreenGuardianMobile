import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireParent } from "../middlewares/requireParent.js";
import {
  getChildAchievementsDataController,
  unlockAchievementForChildController,
} from "../controllers/achievements.controller.js";

const router = Router();

// GET /api/v1/achievements/child/:childId/
// Get the child's avatar, achievements, and xp points
router.get(
  "/child/:childId",
  authJwt,
  requireParent,
  getChildAchievementsDataController
);


export default router;
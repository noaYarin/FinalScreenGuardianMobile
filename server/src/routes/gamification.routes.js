import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireParent } from "../middlewares/requireParent.js";
import {
  getChildAchievementsDataController,
  unlockAchievementForChildController,
} from "../controllers/gamification.controller.js";

const router = Router();

// GET /api/v1/gamification/child/:childId/achievements
// Get the child's avatar, achievements, and xp points
router.get(
  "/child/:childId/achievements",
  authJwt,
  requireParent,
  getChildAchievementsDataController
);


export default router;
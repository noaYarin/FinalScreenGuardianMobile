import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireChild } from "../middlewares/requireChild.js";

import {
  getChildAchievementsDataController,
  unlockAchievementForChildController,
} from "../controllers/achievements.controller.js";

const router = Router();

// GET /api/v1/achievements/child/:childId/
// Get the child's avatar, achievements, and xp points
router.get(
  "/me",
  authJwt,
  requireChild,
  getChildAchievementsDataController
);

export default router;
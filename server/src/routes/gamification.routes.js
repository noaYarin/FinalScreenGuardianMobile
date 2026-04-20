import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireParent } from "../middlewares/requireParent.js";
import {
  getChildGamificationDataController,
  unlockAchievementForChildController,
} from "../controllers/gamification.controller.js";

const router = Router();

// GET /api/v1/gamification/child/:childId
// Get the child's avatar, achievements, and xp points
router.get(
  "/child/:childId",
  authJwt,
  requireParent,
  getChildGamificationDataController
);


export default router;
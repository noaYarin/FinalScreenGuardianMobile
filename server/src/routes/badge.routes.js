import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireChild } from "../middlewares/requireChild.js";
import {
  getChildBadgesController,
  getChildBadgeProgressController,
  unlockChildBadgeController,
} from "../controllers/badge.controller.js";


const router = Router();

router.get(
  "/child/badges",
  authJwt,
  requireChild,
  getChildBadgesController
);
router.get("/child/progress", authJwt, requireChild, getChildBadgeProgressController);
router.post("/child/unlock", authJwt, requireChild, unlockChildBadgeController);

export default router;

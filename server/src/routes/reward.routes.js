import express from "express";
import {
  createRewardsController,
  getParentRewardsController,
  getChildRewardsController,
  redeemRewardController,
} from "../controllers/reward.controller.js";

import { authJwt } from "../middlewares/authJwt.js";
import { requireParent } from "../middlewares/requireParent.js";
import { requireChild } from "../middlewares/requireChild.js";

const router = express.Router();

router.post("/", authJwt, requireParent, createRewardsController);
router.get("/parent", authJwt, requireParent, getParentRewardsController);
router.get("/child", authJwt, requireChild, getChildRewardsController);
router.patch("/:rewardId/redeem", authJwt, requireChild, redeemRewardController);

export default router;
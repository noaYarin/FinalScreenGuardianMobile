import express from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireParent } from "../middlewares/requireParent.js";
import { requireChild } from "../middlewares/requireChild.js";
import {
  createTaskController,
  getParentTasksController,
  getChildTasksController,
  submitTaskController,
  approveTaskController,
} from "../controllers/task.controller.js";

const router = express.Router();

router.post("/", authJwt, requireParent, createTaskController);
router.get("/parent", authJwt, requireParent, getParentTasksController);
router.get("/child", authJwt, requireChild, getChildTasksController);
router.post("/:taskId/submit", authJwt, requireChild, submitTaskController);
router.post("/:taskId/approve", authJwt, requireParent, approveTaskController);

export default router;
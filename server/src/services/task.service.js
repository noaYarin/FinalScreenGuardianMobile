import {
  createTasksForChildren,
  getTasksByParentId,
  getTasksByChildId,
  getTaskById,
  submitTaskDal,
  approveTaskDal,
  countSubmittedTasksByChildId,
} from "../dal/task.dal.js";

import {
  getChildrenByParentId,
  incrementChildCoinsByParentId,
} from "../dal/parent.dal.js";

import { unlockAchievementsForChildService } from "./gamification.service.js";
import { AppError } from "../utils/appError.js";

import { NotificationSeverity } from "../constants/severity.js";
import { NotificationType } from "../constants/notificationType.js";
import { notifyChild, notifyParent } from "./notification.service.js";

// Creates one or more tasks for the selected children after validating parent ownership and task data.
export async function createTask(parentId, payload) {
  const title = String(payload?.title ?? "").trim();
  const description = String(payload?.description ?? "").trim();
  const coinsReward = Number(payload?.coinsReward ?? 0);
  const assignedChildIds = Array.isArray(payload?.assignedChildIds)
    ? payload.assignedChildIds.map(String)
    : [];
  const isRecurring = payload?.isRecurring === true;
  const requireProof = payload?.requireProof === true;

  if (!title) {
    throw new AppError({
      code: "TASK_TITLE_REQUIRED",
      message: "Task title is required",
      statusCode: 400,
    });
  }

  if (assignedChildIds.length === 0) {
    throw new AppError({
      code: "TASK_CHILD_REQUIRED",
      message: "At least one child must be assigned",
      statusCode: 400,
    });
  }

  if (!Number.isFinite(coinsReward) || coinsReward < 0) {
    throw new AppError({
      code: "INVALID_COINS_REWARD",
      message: "Coins reward is invalid",
      statusCode: 400,
    });
  }

  const parentChildren = await getChildrenByParentId(parentId);
  const allowedChildIds = new Set(
    (parentChildren || []).map((child) => String(child._id))
  );

  const hasInvalidChild = assignedChildIds.some(
    (childId) => !allowedChildIds.has(String(childId))
  );

  if (hasInvalidChild) {
    throw new AppError({
      code: "INVALID_ASSIGNED_CHILD",
      message: "One or more selected children do not belong to this parent",
      statusCode: 400,
    });
  }

  const tasks = await createTasksForChildren(parentId, {
    title,
    description,
    coinsReward,
    assignedChildIds,
    isRecurring,
    requireProof,
  });

  for (const task of tasks) {
    try {
      await notifyChild({
        parentId,
        childId: task.childId,
        type: NotificationType.TASK_CREATED,
        severity: NotificationSeverity.INFO,
        title: "New task",
        description: `A new task was added: ${task.title}`,
        data: {
          taskId: String(task._id),
        },
      });
    } catch (err) {
      console.error("notifyChild failed in createTask:", err.message);
    }
  }

  return {
    tasks,
    createdCount: tasks.length,
  };
}

// Returns all tasks created by a specific parent.
export async function getParentTasks(parentId) {
  const tasks = await getTasksByParentId(parentId);
  return { tasks };
}

// Returns all tasks assigned to a specific child.
export async function getChildTasks(childId) {
  const tasks = await getTasksByChildId(childId);
  return { tasks };
}

// Unlocks task-submission achievements. New achievements are sent to the child through the gamification socket notification flow.
async function unlockTaskSubmissionAchievements({
  parentId,
  childId,
  proofImg,
}) {
  const achievementKeys = ["first_task_submitted"];

  const normalizedProofImg =
    typeof proofImg === "string" ? proofImg.trim() : "";

  const hasProofImage =
    normalizedProofImg !== "" && normalizedProofImg !== "default.png";

  if (hasProofImage) {
    achievementKeys.push("first_photo_task");
  }

  const submittedTasksCount = await countSubmittedTasksByChildId(childId);

  if (submittedTasksCount >= 5) {
    achievementKeys.push("five_tasks_submitted");
  }

  await unlockAchievementsForChildService(parentId, childId, achievementKeys);
}

// Submits a child task and unlocks task-related achievements through the global socket notification flow.
export async function submitTask(taskId, childId, proofImg) {
  const task = await getTaskById(taskId);

  if (!task) {
    throw new AppError({
      code: "TASK_NOT_FOUND",
      message: "Task not found",
      statusCode: 404,
    });
  }

  if (String(task.childId) !== String(childId)) {
    throw new AppError({
      code: "FORBIDDEN_TASK_ACCESS",
      message: "Not your task",
      statusCode: 403,
    });
  }

  const normalizedProofImg =
    typeof proofImg === "string" ? proofImg.trim() : "";

  if (task.requireProof === true && !normalizedProofImg) {
    throw new AppError({
      code: "PROOF_IMAGE_REQUIRED",
      message: "Proof image is required",
      statusCode: 400,
    });
  }

  if (
    normalizedProofImg &&
    normalizedProofImg !== "default.png" &&
    !normalizedProofImg.startsWith("data:image/")
  ) {
    throw new AppError({
      code: "INVALID_PROOF_IMAGE",
      message: "Proof image must be a valid base64 image",
      statusCode: 400,
    });
  }

  const submittedTask = await submitTaskDal(taskId, normalizedProofImg);

  try {
    await notifyParent({
      parentId: task.parentId,
      childId: task.childId,
      type: NotificationType.TASK_PENDING_APPROVAL,
      severity: NotificationSeverity.INFO,
      title: "Task waiting for approval",
      description: `A task is waiting for your approval: ${task.title}`,
      data: {
        taskId: String(task._id),
        childId: String(task.childId),
      },
    });
  } catch (err) {
    console.error("notifyParent failed in submitTask:", err.message);
  }

  try {
    await unlockTaskSubmissionAchievements({
      parentId: task.parentId,
      childId: task.childId,
      proofImg: normalizedProofImg,
    });
  } catch (err) {
    console.error("Failed to unlock task achievements:", err);
  }

  return submittedTask;
}

// Approves a submitted task, adds coins to the child, and returns the updated task and child data.
export async function approveTask(parentId, taskId) {
  const task = await getTaskById(taskId);

  if (!task) {
    throw new AppError({
      code: "TASK_NOT_FOUND",
      message: "Task not found",
      statusCode: 404,
    });
  }

  if (String(task.parentId) !== String(parentId)) {
    throw new AppError({
      code: "FORBIDDEN_TASK_ACCESS",
      message: "This task does not belong to this parent",
      statusCode: 403,
    });
  }

  if (!task.completedAt) {
    throw new AppError({
      code: "TASK_NOT_COMPLETED",
      message: "Task cannot be approved before it is completed",
      statusCode: 400,
    });
  }

  if (task.isApproved) {
    throw new AppError({
      code: "TASK_ALREADY_APPROVED",
      message: "Task was already approved",
      statusCode: 400,
    });
  }

  const approvedTask = await approveTaskDal(taskId);

  const rewardAmount = Number(task.coinsReward ?? 0);

  const updatedChild = await incrementChildCoinsByParentId(
    task.parentId,
    task.childId,
    rewardAmount
  );

  if (!updatedChild) {
    throw new AppError({
      code: "CHILD_NOT_FOUND",
      message: "Child not found",
      statusCode: 404,
    });
  }

  // Unlocks the 100-coins achievement after a parent approves a task.
  if (Number(updatedChild.coins ?? 0) >= 100) {
    await unlockAchievementsForChildService(task.parentId, task.childId, [
      "saved_100_coins",
    ]);
  }

  try {
    await notifyChild({
      parentId: task.parentId,
      childId: task.childId,
      type: NotificationType.TASK_APPROVED,
      severity: NotificationSeverity.SUCCESS,
      title: "Task approved",
      description: `Your task "${task.title}" was approved. You earned ${rewardAmount} coins.`,
      data: {
        taskId: String(task._id),
        addedCoins: rewardAmount,
        coins: Number(updatedChild.coins ?? 0),
      },
    });
  } catch (err) {
    console.error("notifyChild failed in approveTask:", err.message);
  }

  return {
    task: approvedTask,
    child: updatedChild,
    addedCoins: rewardAmount,
  };
}
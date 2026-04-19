import {
  createTasksForChildren,
  getTasksByParentId,
  getTasksByChildId,
  getTaskById,
  submitTaskDal,
  approveTaskDal,
} from "../dal/task.dal.js";
import { getChildrenByParentId } from "../dal/parent.dal.js";
import { AppError } from "../utils/appError.js";

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

  return {
    tasks,
    createdCount: tasks.length,
  };
}

export async function getParentTasks(parentId) {
  const tasks = await getTasksByParentId(parentId);
  return { tasks };
}

export async function getChildTasks(childId) {
  const tasks = await getTasksByChildId(childId);
  return { tasks };
}

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

  if (task.requireProof === true && !proofImg) {
    throw new AppError({
      code: "PROOF_IMAGE_REQUIRED",
      message: "Proof image is required",
      statusCode: 400,
    });
  }

  return await submitTaskDal(taskId, proofImg);
}

export async function approveTask(taskId) {
  return await approveTaskDal(taskId);
}
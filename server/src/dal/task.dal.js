import TaskModel from "../models/task.model.js";

export async function createTasksForChildren(parentId, payload) {
  const docs = payload.assignedChildIds.map((childId) => ({
    title: payload.title,
    childId,
    parentId,
    description: payload.description ?? "",
    coinsReward: payload.coinsReward ?? 0,
    icon: "default.png",
    proofImg: "default.png",
    completedAt: null,
    startDate: null,
    endDate: null,
    isActive: true,
    isApproved: false,
    isRegulary: payload.isRecurring === true,
    isTemporary: payload.isRecurring === true ? false : true,
    requireProof: payload.requireProof === true,
  }));

  return TaskModel.insertMany(docs);
}

export async function getTasksByParentId(parentId) {
  return TaskModel.find({ parentId }).sort({ createdAt: -1 }).lean();
}

export async function getTasksByChildId(childId) {
  return TaskModel.find({ childId, isActive: true }).sort({ createdAt: -1 }).lean();
}

export async function getTaskById(taskId) {
  return TaskModel.findById(taskId).lean();
}

export async function submitTaskDal(taskId, proofImg) {
  return TaskModel.findByIdAndUpdate(
    taskId,
    {
      completedAt: new Date(),
      proofImg: proofImg || "",
    },
    { new: true }
  );
}

export async function approveTaskDal(taskId) {
  return TaskModel.findByIdAndUpdate(
    taskId,
    { isApproved: true },
    { new: true }
  );
}
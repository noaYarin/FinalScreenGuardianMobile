import TaskModel from "../models/task.model.js";

function getNextEndDate(recurrenceType) {
  const now = new Date();
  const end = new Date(now);

  if (recurrenceType === "weekly") {
    end.setDate(end.getDate() + 7);
  } else {
    end.setDate(end.getDate() + 1);
  }

  return { startDate: now, endDate: end };
}

export async function createTasksForChildren(parentId, payload) {
  const isRecurring = payload.isRecurring === true;
  const recurrenceType = isRecurring ? payload.recurrenceType : "none";
  const dates = isRecurring ? getNextEndDate(recurrenceType) : {};

  const docs = payload.assignedChildIds.map((childId) => ({
    title: payload.title,
    childId,
    parentId,
    description: payload.description ?? "",
    coinsReward: payload.coinsReward ?? 0,
    icon: "default.png",
    proofImg: "default.png",
    completedAt: null,
    approvedAt: null,
    rejectedAt: null,
    deletedAt: null,
    startDate: dates.startDate ?? null,
    endDate: dates.endDate ?? null,
    isActive: true,
    isApproved: false,
    isRegulary: isRecurring,
    recurrenceType,
    isTemporary: !isRecurring,
    requireProof: payload.requireProof === true,
  }));

  return TaskModel.insertMany(docs);
}

export async function getTasksByParentId(parentId) {
  return TaskModel.find({
    parentId,
    deletedAt: null,
  })
    .sort({ createdAt: -1 })
    .lean();
}

export async function getTasksByChildId(childId) {
  return TaskModel.find({
    childId,
    isActive: true,
    deletedAt: null,
  })
    .sort({ createdAt: -1 })
    .lean();
}

export async function getTaskById(taskId) {
  return TaskModel.findById(taskId).lean();
}

export async function submitTaskDal(taskId, proofImg) {
  return TaskModel.findByIdAndUpdate(
    taskId,
    {
      completedAt: new Date(),
      proofImg: proofImg || "default.png",
      rejectedAt: null,
    },
    { new: true }
  );
}

export async function approveTaskDal(taskId) {
  return TaskModel.findByIdAndUpdate(
    taskId,
    {
      isApproved: true,
      approvedAt: new Date(),
    },
    { new: true }
  );
}

export async function rejectTaskDal(taskId) {
  return TaskModel.findByIdAndUpdate(
    taskId,
    {
      completedAt: null,
      approvedAt: null,
      rejectedAt: new Date(),
      isApproved: false,
      proofImg: "default.png",
    },
    { new: true }
  );
}

export async function softDeleteTaskDal(taskId) {
  return TaskModel.findByIdAndUpdate(
    taskId,
    {
      isActive: false,
      deletedAt: new Date(),
    },
    { new: true }
  );
}

export async function countSubmittedTasksByChildId(childId) {
  return TaskModel.countDocuments({
    childId,
    isActive: true,
    completedAt: { $ne: null },
  });
}

export async function renewExpiredRecurringTasks(parentIdOrChildId, role) {
  const query =
    role === "parent"
      ? { parentId: parentIdOrChildId }
      : { childId: parentIdOrChildId };

  const now = new Date();

  const tasks = await TaskModel.find({
    ...query,
    isActive: true,
    isRegulary: true,
    recurrenceType: { $in: ["daily", "weekly"] },
    endDate: { $ne: null, $lt: now },
  });

  for (const task of tasks) {
    if (task.completedAt && !task.isApproved) {
      continue;
    }

    const dates = getNextEndDate(task.recurrenceType);

    if (!task.completedAt) {
      task.startDate = dates.startDate;
      task.endDate = dates.endDate;
      task.proofImg = "default.png";
      task.completedAt = null;
      task.approvedAt = null;
      task.rejectedAt = null;
      task.isApproved = false;
      await task.save();
      continue;
    }

    if (task.completedAt && task.isApproved) {
      task.isActive = false;
      await task.save();

      await TaskModel.create({
        title: task.title,
        childId: task.childId,
        parentId: task.parentId,
        description: task.description,
        coinsReward: task.coinsReward,
        icon: task.icon,
        proofImg: "default.png",
        completedAt: null,
        approvedAt: null,
        rejectedAt: null,
        deletedAt: null,
        startDate: dates.startDate,
        endDate: dates.endDate,
        isActive: true,
        isApproved: false,
        isRegulary: true,
        recurrenceType: task.recurrenceType,
        isTemporary: false,
        requireProof: task.requireProof,
      });
    }
  }
}
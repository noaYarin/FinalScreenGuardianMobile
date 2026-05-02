import {
  createTask,
  getParentTasks,
  getChildTasks,
  submitTask,
  approveTask,
  rejectTask,
  deleteTask,
} from "../services/task.service.js";
export async function rejectTaskController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { taskId } = req.params;

    const data = await rejectTask(parentId, taskId);

    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function deleteTaskController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { taskId } = req.params;

    const data = await deleteTask(parentId, taskId);

    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createTaskController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const data = await createTask(parentId, req.body);

    res.status(201).json({
      ok: true,
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function getParentTasksController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const data = await getParentTasks(parentId);

    res.status(200).json({
      ok: true,
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function getChildTasksController(req, res, next) {
  try {
    const childId = req.user.childId;
    const data = await getChildTasks(childId);

    res.status(200).json({
      ok: true,
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function submitTaskController(req, res, next) {
  try {
    const childId = req.user.childId;
    const { taskId } = req.params;
    const { proofImg } = req.body;

    const data = await submitTask(taskId, childId, proofImg);

    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
  
}

export async function approveTaskController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { taskId } = req.params;

    const data = await approveTask(parentId, taskId);

    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}
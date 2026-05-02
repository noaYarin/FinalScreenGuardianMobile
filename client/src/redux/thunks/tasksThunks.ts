import { createAsyncThunk } from "@reduxjs/toolkit";
import * as tasksApi from "../../api/tasks";
import type {
  CreateTaskResponse,
  GetTasksResponse,
} from "../../api/tasks";

export const createTaskThunk = createAsyncThunk<
  CreateTaskResponse,
  any,
  { rejectValue: string }
>(
  "tasks/createTask",
  async (payload, thunkAPI) => {
    try {
      return await tasksApi.createTask(payload);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        typeof error?.message === "string"
          ? error.message
          : "Failed to create task"
      );
    }
  }
);

export const getParentTasksThunk = createAsyncThunk<
  GetTasksResponse,
  void,
  { rejectValue: string }
>(
  "tasks/getParentTasks",
  async (_, thunkAPI) => {
    try {
      return await tasksApi.getParentTasks();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        typeof error?.message === "string"
          ? error.message
          : "Failed to fetch parent tasks"
      );
    }
  }
);

export const getChildTasksThunk = createAsyncThunk<
  GetTasksResponse,
  void,
  { rejectValue: string }
>(
  "tasks/getChildTasks",
  async (_, thunkAPI) => {
    try {
      return await tasksApi.getChildTasks();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        typeof error?.message === "string"
          ? error.message
          : "Failed to fetch child tasks"
      );
    }
  }
);

export const submitTaskThunk = createAsyncThunk<
  any,
  { taskId: string; proofImg: string },
  { rejectValue: string }
>(
  "tasks/submitTask",
  async ({ taskId, proofImg }, thunkAPI) => {
    try {
      return await tasksApi.submitTask(taskId, { proofImg });
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        typeof error?.message === "string"
          ? error.message
          : "Failed to submit task"
      );
    }
  }
);

export const approveTaskThunk = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>(
  "tasks/approveTask",
  async (taskId, thunkAPI) => {
    try {
      return await tasksApi.approveTask(taskId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        typeof error?.message === "string"
          ? error.message
          : "Failed to approve task"
      );
    }
  }
);

export const rejectTaskThunk = createAsyncThunk<any, string, { rejectValue: string }>(
  "tasks/rejectTask",
  async (taskId, thunkAPI) => {
    try {
      return await tasksApi.rejectTask(taskId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        typeof error?.message === "string" ? error.message : "Failed to reject task"
      );
    }
  }
);

export const deleteTaskThunk = createAsyncThunk<any, string, { rejectValue: string }>(
  "tasks/deleteTask",
  async (taskId, thunkAPI) => {
    try {
      await tasksApi.deleteTask(taskId);
      return taskId;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        typeof error?.message === "string" ? error.message : "Failed to delete task"
      );
    }
  }
);
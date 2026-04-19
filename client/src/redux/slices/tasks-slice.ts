// client/src/redux/slices/tasks-slice.ts
import { createSlice } from "@reduxjs/toolkit";
import {
  createTaskThunk,
  getParentTasksThunk,
  getChildTasksThunk,
} from "../thunks/tasksThunks";

type TasksState = {
  parentTasks: any[];
  childTasks: any[];
  isCreating: boolean;
  isLoadingParentTasks: boolean;
  isLoadingChildTasks: boolean;
  error: string | null;
};

const initialState: TasksState = {
  parentTasks: [],
  childTasks: [],
  isCreating: false,
  isLoadingParentTasks: false,
  isLoadingChildTasks: false,
  error: null,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTaskThunk.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createTaskThunk.fulfilled, (state, action) => {
        state.isCreating = false;
        state.error = null;
        const newTasks = Array.isArray(action.payload.tasks)
          ? action.payload.tasks
          : [];
        state.parentTasks = [...newTasks, ...state.parentTasks];
      })
      .addCase(createTaskThunk.rejected, (state, action) => {
        state.isCreating = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to create task";
      })

      .addCase(getParentTasksThunk.pending, (state) => {
        state.isLoadingParentTasks = true;
        state.error = null;
      })
      .addCase(getParentTasksThunk.fulfilled, (state, action) => {
        state.isLoadingParentTasks = false;
        state.error = null;
        state.parentTasks = Array.isArray(action.payload.tasks)
          ? action.payload.tasks
          : [];
      })
      .addCase(getParentTasksThunk.rejected, (state, action) => {
        state.isLoadingParentTasks = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to fetch parent tasks";
      })

      .addCase(getChildTasksThunk.pending, (state) => {
        state.isLoadingChildTasks = true;
        state.error = null;
      })
      .addCase(getChildTasksThunk.fulfilled, (state, action) => {
        state.isLoadingChildTasks = false;
        state.error = null;
        state.childTasks = Array.isArray(action.payload.tasks)
          ? action.payload.tasks
          : [];
      })
      .addCase(getChildTasksThunk.rejected, (state, action) => {
        state.isLoadingChildTasks = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to fetch child tasks";
      });
  },
});

export default tasksSlice.reducer;
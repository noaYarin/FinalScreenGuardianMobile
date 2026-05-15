import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Notification } from "@/src/api/notification";
import {
  fetchParentNotificationsThunk,
  markAllParentNotificationsReadThunk,
  markParentNotificationReadThunk,
  deleteParentNotificationThunk,
  fetchChildNotificationsThunk,
  markAllChildNotificationsReadThunk,
} from "@/src/redux/thunks/notificationThunks";

type NotificationsState = {
  items: Notification[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  unreadCount: number;
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
};

const initialState: NotificationsState = {
  items: [],
  status: "idle",
  error: null,
  unreadCount: 0,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  },
};

function upsertById(state: NotificationsState, notification: Notification) {
  if (!state.items) state.items = [];

  const idx = state.items.findIndex(
    (n) => n && String(n._id) === String(notification._id)
  );

  if (idx >= 0) {
    state.items[idx] = notification;
  } else {
    state.items.unshift(notification);
  }
}

function setPagination(
  state: NotificationsState,
  pagination?: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  }
) {
  if (!pagination) return;

  state.pagination = {
    total: Math.max(0, Number(pagination.total) || 0),
    page: Math.max(1, Number(pagination.page) || 1),
    pages: Math.max(1, Number(pagination.pages) || 1),
    limit: Math.max(1, Number(pagination.limit) || 10),
  };
}

function mergeFetchedNotifications(
  state: NotificationsState,
  data: Notification[],
  pagination?: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  }
) {
  setPagination(state, pagination);

  if (state.pagination.page === 1) {
    state.items = data;
    return;
  }

  const existingIds = new Set(state.items.map((i) => String(i._id)));

  state.items.push(...data.filter((n) => !existingIds.has(String(n._id))));
}

function recalculateUnreadCount(state: NotificationsState) {
  state.unreadCount = state.items.filter((n) => n && !n.isRead).length;
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotificationFromSocket(state, action: PayloadAction<Notification>) {
      const n = action.payload;

      const alreadyExists = state.items.some(
        (item) => String(item?._id) === String(n._id)
      );

      upsertById(state, n);

      if (!alreadyExists) {
        state.pagination.total += 1;
      }

      recalculateUnreadCount(state);
    },

    clearNotifications: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParentNotificationsThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchParentNotificationsThunk.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        if (!payload) return;

        const { data = [], pagination, unreadCount = 0 } = payload;

        mergeFetchedNotifications(state, data, pagination);
        state.unreadCount = unreadCount;
      })

      .addCase(fetchParentNotificationsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) ?? "Could not load notifications.";
      })

      .addCase(fetchChildNotificationsThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchChildNotificationsThunk.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        if (!payload) return;

        const { data = [], pagination, unreadCount = 0 } = payload;

        mergeFetchedNotifications(state, data, pagination);
        state.unreadCount = unreadCount;
      })

      .addCase(fetchChildNotificationsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) ??
          "Could not load child notifications.";
      })

      .addCase(markParentNotificationReadThunk.fulfilled, (state, { payload }) => {
        if (!payload) return;

        upsertById(state, payload);
        recalculateUnreadCount(state);
      })

      .addCase(markAllParentNotificationsReadThunk.fulfilled, (state) => {
        state.items.forEach((n) => {
          if (n?.targetRole === "PARENT") {
            n.isRead = true;
          }
        });

        recalculateUnreadCount(state);
      })

      .addCase(markAllChildNotificationsReadThunk.fulfilled, (state) => {
        state.items.forEach((n) => {
          if (n?.targetRole === "CHILD") {
            n.isRead = true;
          }
        });

        recalculateUnreadCount(state);
      })

      .addCase(deleteParentNotificationThunk.fulfilled, (state, { payload }) => {
        const id = String(payload.notificationId);
        const target = state.items.find((n) => String(n?._id) === id);

        if (!target) return;

        state.items = state.items.filter((n) => String(n?._id) !== id);
        state.pagination.total = Math.max(0, state.pagination.total - 1);

        recalculateUnreadCount(state);
      });
  },
});

export const { addNotificationFromSocket, clearNotifications } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
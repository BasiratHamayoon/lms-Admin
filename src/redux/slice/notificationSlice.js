import { createSlice } from '@reduxjs/toolkit';
import {
  fetchNotifications,
  fetchNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  publishNotification,
  archiveNotification,
  fetchNotificationStats
} from '../actions/notification';

const initialState = {
  notifications: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  },
  selectedNotification: null,
  stats: {
    totalNotifications: 0,
    publishedNotifications: 0,
    draftNotifications: 0,
    archivedNotifications: 0,
    urgentNotifications: 0,
    highPriorityNotifications: 0
  },
  loading: false,
  statsLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  publishLoading: false,
  archiveLoading: false,
  error: null,
  statsError: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  publishSuccess: false,
  archiveSuccess: false
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.statsError = null;
    },
    clearSuccess: (state) => {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
      state.publishSuccess = false;
      state.archiveSuccess = false;
    },
    setSelectedNotification: (state, action) => {
      state.selectedNotification = action.payload;
    },
    clearSelectedNotification: (state) => {
      state.selectedNotification = null;
    },
    resetNotificationState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload?.notifications || [];
        state.pagination = action.payload?.pagination || initialState.pagination;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notifications = [];
      })

      .addCase(fetchNotificationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedNotification = action.payload;
      })
      .addCase(fetchNotificationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createNotification.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;
        if (action.payload) {
          state.notifications.unshift(action.payload);
          state.pagination.total += 1;
        }
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })

      .addCase(updateNotification.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateNotification.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        if (action.payload) {
          const index = state.notifications.findIndex(n => n._id === action.payload._id);
          if (index !== -1) {
            state.notifications[index] = action.payload;
          }
          if (state.selectedNotification?._id === action.payload._id) {
            state.selectedNotification = action.payload;
          }
        }
      })
      .addCase(updateNotification.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })

      .addCase(deleteNotification.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
        state.notifications = state.notifications.filter(n => n._id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        if (state.selectedNotification?._id === action.payload) {
          state.selectedNotification = null;
        }
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      })

      .addCase(publishNotification.pending, (state) => {
        state.publishLoading = true;
        state.error = null;
        state.publishSuccess = false;
      })
      .addCase(publishNotification.fulfilled, (state, action) => {
        state.publishLoading = false;
        state.publishSuccess = true;
        if (action.payload) {
          const index = state.notifications.findIndex(n => n._id === action.payload._id);
          if (index !== -1) {
            state.notifications[index] = action.payload;
          }
        }
      })
      .addCase(publishNotification.rejected, (state, action) => {
        state.publishLoading = false;
        state.error = action.payload;
        state.publishSuccess = false;
      })

      .addCase(archiveNotification.pending, (state) => {
        state.archiveLoading = true;
        state.error = null;
        state.archiveSuccess = false;
      })
      .addCase(archiveNotification.fulfilled, (state, action) => {
        state.archiveLoading = false;
        state.archiveSuccess = true;
        if (action.payload) {
          const index = state.notifications.findIndex(n => n._id === action.payload._id);
          if (index !== -1) {
            state.notifications[index] = action.payload;
          }
        }
      })
      .addCase(archiveNotification.rejected, (state, action) => {
        state.archiveLoading = false;
        state.error = action.payload;
        state.archiveSuccess = false;
      })

      .addCase(fetchNotificationStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchNotificationStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = { ...initialState.stats, ...(action.payload || {}) };
      })
      .addCase(fetchNotificationStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload;
      });
  }
});

export const {
  clearErrors,
  clearSuccess,
  setSelectedNotification,
  clearSelectedNotification,
  resetNotificationState
} = notificationSlice.actions;

export default notificationSlice.reducer;
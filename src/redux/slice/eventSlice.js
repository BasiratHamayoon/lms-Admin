import { createSlice } from '@reduxjs/toolkit';
import {
  fetchEvents,
  fetchEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  fetchEventStats
} from '../actions/events';

const initialState = {
  events: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  },
  selectedEvent: null,
  stats: {
    totalEvents: 0,
    upcomingEvents: 0,
    pastEvents: 0,
    eventsByType: {},
    eventsByVisibility: {}
  },
  loading: false,
  statsLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  error: null,
  statsError: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false
};

const eventSlice = createSlice({
  name: 'events',
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
    },
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
    },
    resetEventState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload?.events || [];
        if (action.payload?.pagination) {
          state.pagination = {
            total: action.payload.pagination.total || 0,
            page: action.payload.pagination.page || 1,
            limit: action.payload.pagination.limit || 10,
            pages: action.payload.pagination.pages || 1
          };
        }
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.events = [];
      })
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEvent.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      .addCase(updateEvent.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      .addCase(deleteEvent.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
        state.events = state.events.filter(e => e._id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        if (state.selectedEvent?._id === action.payload) {
          state.selectedEvent = null;
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      })
      .addCase(fetchEventStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchEventStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = { ...initialState.stats, ...(action.payload || {}) };
      })
      .addCase(fetchEventStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload;
      });
  }
});

export const {
  clearErrors,
  clearSuccess,
  setSelectedEvent,
  clearSelectedEvent,
  resetEventState
} = eventSlice.actions;

export default eventSlice.reducer;
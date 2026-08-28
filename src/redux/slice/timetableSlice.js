import { createSlice } from '@reduxjs/toolkit';
import {
  fetchTimetables,
  fetchTimetableById,
  createTimetable,
  updateTimetable,
  deleteTimetable,
  fetchTimetableStats,
  fetchTimetableByClassChart,
  fetchTimetableStatusChart,
  fetchTimetableOptions,
  fetchTimetableByClass
} from '../actions/timetable';

const initialState = {
  timetables: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  },
  selectedTimetable: null,
  classTimetable: null,
  stats: {
    totalTimetables: 0,
    activeTimetables: 0,
    inactiveTimetables: 0,
    totalScheduleEntries: 0,
    classesWithTimetables: 0,
    averageEntriesPerTimetable: 0
  },
  byClassChart: [],
  statusChart: [],
  timetableOptions: [],
  loading: false,
  statsLoading: false,
  chartLoading: false,
  optionsLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  error: null,
  statsError: null,
  chartError: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false
};

const timetableSlice = createSlice({
  name: 'timetables',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.statsError = null;
      state.chartError = null;
    },
    clearSuccess: (state) => {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },
    setSelectedTimetable: (state, action) => {
      state.selectedTimetable = action.payload;
    },
    clearSelectedTimetable: (state) => {
      state.selectedTimetable = null;
    },
    clearClassTimetable: (state) => {
      state.classTimetable = null;
    },
    resetTimetableState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimetables.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimetables.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        state.timetables = payload?.timetables || [];
        state.pagination = payload?.pagination || initialState.pagination;
      })
      .addCase(fetchTimetables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.timetables = [];
      })
      .addCase(fetchTimetableById.pending, (state) => {
        state.loading = true; // Can be a separate isLoadingDetails if needed
        state.error = null;
      })
      .addCase(fetchTimetableById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTimetable = action.payload;
      })
      .addCase(fetchTimetableById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTimetable.pending, (state) => {
        state.createLoading = true;
        state.createSuccess = false;
      })
      .addCase(createTimetable.fulfilled, (state) => {
        state.createLoading = false;
        state.createSuccess = true;
      })
      .addCase(createTimetable.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })
      .addCase(updateTimetable.pending, (state) => {
        state.updateLoading = true;
        state.updateSuccess = false;
      })
      .addCase(updateTimetable.fulfilled, (state) => {
        state.updateLoading = false;
        state.updateSuccess = true;
      })
      .addCase(updateTimetable.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteTimetable.pending, (state) => {
        state.deleteLoading = true;
        state.deleteSuccess = false;
      })
      .addCase(deleteTimetable.fulfilled, (state) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
      })
      .addCase(deleteTimetable.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchTimetableStats.pending, (state) => { state.statsLoading = true; })
      .addCase(fetchTimetableStats.fulfilled, (state, action) => { state.statsLoading = false; state.stats = { ...initialState.stats, ...(action.payload || {}) }; })
      .addCase(fetchTimetableStats.rejected, (state, action) => { state.statsLoading = false; state.statsError = action.payload; })
      .addCase(fetchTimetableByClassChart.pending, (state) => { state.chartLoading = true; })
      .addCase(fetchTimetableByClassChart.fulfilled, (state, action) => { state.chartLoading = false; state.byClassChart = action.payload || []; })
      .addCase(fetchTimetableByClassChart.rejected, (state, action) => { state.chartLoading = false; state.chartError = action.payload; })
      .addCase(fetchTimetableStatusChart.pending, (state) => { state.chartLoading = true; })
      .addCase(fetchTimetableStatusChart.fulfilled, (state, action) => { state.chartLoading = false; state.statusChart = action.payload || []; })
      .addCase(fetchTimetableStatusChart.rejected, (state, action) => { state.chartLoading = false; state.chartError = action.payload; })
      .addCase(fetchTimetableOptions.pending, (state) => { state.optionsLoading = true; })
      .addCase(fetchTimetableOptions.fulfilled, (state, action) => { state.optionsLoading = false; state.timetableOptions = action.payload || []; })
      .addCase(fetchTimetableOptions.rejected, (state) => { state.optionsLoading = false; })
      .addCase(fetchTimetableByClass.pending, (state) => { state.loading = true; })
      .addCase(fetchTimetableByClass.fulfilled, (state, action) => { state.loading = false; state.classTimetable = action.payload; })
      .addCase(fetchTimetableByClass.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  }
});

export const {
  clearErrors, clearSuccess, setSelectedTimetable, clearSelectedTimetable, clearClassTimetable, resetTimetableState
} = timetableSlice.actions;

export default timetableSlice.reducer;
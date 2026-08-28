import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTodayOverview,
  fetchWeeklyTimetable,
  downloadTimetablePDF,
} from "../actions/teacherTimetable";

const initialState = {
  todayOverview: {
    totalClasses: 0,
    classesTaken: 0,
    remainingClasses: 0,
  },
  weeklyTimetable: {},
  loading: false,
  exportLoading: false,
  error: null,
};

const teacherTimetableSlice = createSlice({
  name: "teacherTimetable",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Today Overview
      .addCase(fetchTodayOverview.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodayOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.todayOverview = action.payload;
      })
      .addCase(fetchTodayOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Weekly Timetable
      .addCase(fetchWeeklyTimetable.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWeeklyTimetable.fulfilled, (state, action) => {
        state.loading = false;
        state.weeklyTimetable = action.payload;
      })
      .addCase(fetchWeeklyTimetable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Export PDF
      .addCase(downloadTimetablePDF.pending, (state) => {
        state.exportLoading = true;
      })
      .addCase(downloadTimetablePDF.fulfilled, (state) => {
        state.exportLoading = false;
      })
      .addCase(downloadTimetablePDF.rejected, (state) => {
        state.exportLoading = false;
      });
  },
});

export const { clearErrors } = teacherTimetableSlice.actions;
export default teacherTimetableSlice.reducer;

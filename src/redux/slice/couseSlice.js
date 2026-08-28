import { createSlice } from '@reduxjs/toolkit';
import {
  fetchCourses,
  fetchCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  fetchCourseStats,
  fetchCourseOptions
} from '../actions/course';

const initialState = {
  courses: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  },
  selectedCourse: null,
  stats: {
    totalCourses: 0,
    activeCourses: 0,
    inactiveCourses: 0,
    coursesWithTeachers: 0
  },
  courseOptions: [],
  loading: false,
  statsLoading: false,
  optionsLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  error: null,
  statsError: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false
};

const courseSlice = createSlice({
  name: 'courses',
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
    setSelectedCourse: (state, action) => {
      state.selectedCourse = action.payload;
    },
    clearSelectedCourse: (state) => {
      state.selectedCourse = null;
    },
    resetCourseState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload?.courses || [];
        state.pagination = action.payload?.pagination || initialState.pagination;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.courses = [];
      })

      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createCourse.pending, (state) => {
        state.createLoading = true;
        state.createSuccess = false;
      })
      .addCase(createCourse.fulfilled, (state) => {
        state.createLoading = false;
        state.createSuccess = true;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })

      .addCase(updateCourse.pending, (state) => {
        state.updateLoading = true;
        state.updateSuccess = false;
      })
      .addCase(updateCourse.fulfilled, (state) => {
        state.updateLoading = false;
        state.updateSuccess = true;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteCourse.pending, (state) => {
        state.deleteLoading = true;
        state.deleteSuccess = false;
      })
      .addCase(deleteCourse.fulfilled, (state) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchCourseStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchCourseStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = { ...initialState.stats, ...(action.payload || {}) };
      })
      .addCase(fetchCourseStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload;
      })

      .addCase(fetchCourseOptions.pending, (state) => {
        state.optionsLoading = true;
      })
      .addCase(fetchCourseOptions.fulfilled, (state, action) => {
        state.optionsLoading = false;
        state.courseOptions = action.payload || [];
      })
      .addCase(fetchCourseOptions.rejected, (state) => {
        state.optionsLoading = false;
      });
  }
});

export const {
  clearErrors,
  clearSuccess,
  setSelectedCourse,
  clearSelectedCourse,
  resetCourseState
} = courseSlice.actions;

export default courseSlice.reducer;
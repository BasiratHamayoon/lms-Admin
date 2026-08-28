import { createSlice } from '@reduxjs/toolkit';
import {
  fetchClasses,
  fetchClassById,
  createClass,
  updateClass,
  deleteClass,
  fetchClassStats,
  fetchStudentsPerClassChart,
  fetchClassStatusChart,
  fetchCourseOptions,
  fetchTeacherOptions,
  fetchClassOptions
} from '../actions/class';

const initialState = {
  classes: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
  selectedClass: null,

  stats: {
    totalClasses: 0,
    activeClasses: 0,
    inactiveClasses: 0,
    totalStudents: 0,
  },

  studentsPerClassChart: [],
  classStatusChart: { active: 0, inactive: 0 },

  courseOptions: [],
  teacherOptions: [],
  classOptions: [],

  isLoading: false,
  isLoadingDetails: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isLoadingStats: false,
  isLoadingCharts: false,
  isLoadingOptions: false,

  error: null,
  successMessage: null,
};

const classSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearSelectedClass: (state) => {
      state.selectedClass = null;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },

    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1;
    },

    resetPagination: (state) => {
      state.pagination.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.classes = action.payload.classes || [];

        state.pagination = {
          ...state.pagination,
          ...action.payload.pagination,
          limit: action.payload.pagination?.limit || state.pagination.limit,
        };
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchClassById.pending, (state) => {
        state.isLoadingDetails = true;
        state.error = null;
      })
      .addCase(fetchClassById.fulfilled, (state, action) => {
        state.isLoadingDetails = false;
        state.selectedClass = action.payload;
      })
      .addCase(fetchClassById.rejected, (state, action) => {
        state.isLoadingDetails = false;
        state.error = action.payload;
      })
      .addCase(createClass.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.isCreating = false;
        state.classes.unshift(action.payload);
        state.pagination.total += 1;
        state.successMessage = 'Class created successfully';
      })
      .addCase(createClass.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })
      .addCase(updateClass.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateClass.fulfilled, (state) => {
        state.isUpdating = false;
        state.successMessage = 'Class updated successfully';
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      .addCase(deleteClass.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.classes = state.classes.filter((c) => c._id !== action.payload);
        state.pagination.total -= 1;
        state.successMessage = 'Class deleted successfully';
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload;
      })
      .addCase(fetchClassStats.pending, (state) => {
        state.isLoadingStats = true;
      })
      .addCase(fetchClassStats.fulfilled, (state, action) => {
        state.isLoadingStats = false;
        state.stats = action.payload || initialState.stats;
      })
      .addCase(fetchClassStats.rejected, (state, action) => {
        state.isLoadingStats = false;
        state.error = action.payload;
      })
      .addCase(fetchStudentsPerClassChart.pending, (state) => {
        state.isLoadingCharts = true;
      })
      .addCase(fetchStudentsPerClassChart.fulfilled, (state, action) => {
        state.isLoadingCharts = false;
        state.studentsPerClassChart = action.payload || [];
      })
      .addCase(fetchStudentsPerClassChart.rejected, (state, action) => {
        state.isLoadingCharts = false;
        state.error = action.payload;
      })
      .addCase(fetchClassStatusChart.pending, (state) => {
        state.isLoadingCharts = true;
      })
      .addCase(fetchClassStatusChart.fulfilled, (state, action) => {
        state.isLoadingCharts = false;
        state.classStatusChart = action.payload || { active: 0, inactive: 0 };
      })
      .addCase(fetchClassStatusChart.rejected, (state, action) => {
        state.isLoadingCharts = false;
        state.error = action.payload;
      })
      .addCase(fetchCourseOptions.pending, (state) => {
        state.isLoadingOptions = true;
      })
      .addCase(fetchCourseOptions.fulfilled, (state, action) => {
        state.isLoadingOptions = false;
        state.courseOptions = action.payload || [];
      })
      .addCase(fetchCourseOptions.rejected, (state, action) => {
        state.isLoadingOptions = false;
        state.error = action.payload;
      })
      .addCase(fetchTeacherOptions.pending, (state) => {
        state.isLoadingOptions = true;
      })
      .addCase(fetchTeacherOptions.fulfilled, (state, action) => {
        state.isLoadingOptions = false;
        state.teacherOptions = action.payload || [];
      })
      .addCase(fetchTeacherOptions.rejected, (state, action) => {
        state.isLoadingOptions = false;
        state.error = action.payload;
      })
      .addCase(fetchClassOptions.pending, (state) => {
        state.isLoadingOptions = true;
      })
      .addCase(fetchClassOptions.fulfilled, (state, action) => {
        state.isLoadingOptions = false;
        state.classOptions = action.payload || [];
      })
      .addCase(fetchClassOptions.rejected, (state, action) => {
        state.isLoadingOptions = false;
        state.error = action.payload;
      });
  },
});


export const {
  clearError,
  clearSuccessMessage,
  clearSelectedClass,
  setPage,
  setLimit,
  resetPagination
} = classSlice.actions;

export const selectClassOptions = (state) => state.classes.classOptions;
export const selectCourseOptions = (state) => state.classes.courseOptions;

export default classSlice.reducer;
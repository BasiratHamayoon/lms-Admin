import { createSlice } from '@reduxjs/toolkit';
import {
  fetchDepartments,
  fetchDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  fetchDepartmentStats,
  fetchActiveInactiveChart,
  fetchMemberDistributionChart,
  fetchDepartmentOptions
} from '../actions/department';

const initialState = {
  departments: [],
  departmentsList: [],
  
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
  
  selectedDepartment: null,
  
  stats: {
    totalDepartments: 0,
    activeDepartments: 0,
    inactiveDepartments: 0,
    academicDepartments: 0,
    administrativeDepartments: 0,
  },
  
  statusChart: [],
  memberDistributionChart: [],
  listLoading: false,
  loading: false,
  statsLoading: false,
  chartLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  
  error: null,
  statsError: null,
  chartError: null,
  
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
};

const departmentSlice = createSlice({
  name: 'departments',
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
    setSelectedDepartment: (state, action) => {
      state.selectedDepartment = action.payload;
    },
    clearSelectedDepartment: (state) => {
      state.selectedDepartment = null;
    },
    resetDepartmentState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload?.departments || [];
        state.pagination = action.payload?.pagination || initialState.pagination;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.departments = [];
      })
          .addCase(fetchDepartmentOptions.pending, (state) => {
        state.listLoading = true;
      })
      .addCase(fetchDepartmentOptions.fulfilled, (state, action) => {
        state.listLoading = false;
        state.departmentsList = action.payload || [];
      })
      .addCase(fetchDepartmentOptions.rejected, (state, action) => {
        state.listLoading = false;
        state.departmentsList = [];
      })

      .addCase(fetchDepartmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDepartment = action.payload;
      })
      .addCase(fetchDepartmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createDepartment.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;
        if (action.payload) {
          state.departments.unshift(action.payload);
          state.pagination.total += 1;
        }
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })

      .addCase(updateDepartment.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        if (action.payload) {
          const index = state.departments.findIndex(
            (dept) => dept._id === action.payload._id
          );
          if (index !== -1) {
            state.departments[index] = action.payload;
          }
          if (state.selectedDepartment?._id === action.payload._id) {
            state.selectedDepartment = action.payload;
          }
        }
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })

      .addCase(deleteDepartment.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
        state.departments = state.departments.filter(
          (dept) => dept._id !== action.payload
        );
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        if (state.selectedDepartment?._id === action.payload) {
          state.selectedDepartment = null;
        }
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      })

      .addCase(fetchDepartmentStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchDepartmentStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = {
          ...initialState.stats,
          ...(action.payload || {}),
        };
      })
      .addCase(fetchDepartmentStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload;
        state.stats = state.stats || initialState.stats;
      })

      .addCase(fetchActiveInactiveChart.pending, (state) => {
        state.chartLoading = true;
        state.chartError = null;
      })
      .addCase(fetchActiveInactiveChart.fulfilled, (state, action) => {
        state.chartLoading = false;
        state.statusChart = action.payload || [];
      })
      .addCase(fetchActiveInactiveChart.rejected, (state, action) => {
        state.chartLoading = false;
        state.chartError = action.payload;
        state.statusChart = [];
      })

      .addCase(fetchMemberDistributionChart.pending, (state) => {
        state.chartLoading = true;
        state.chartError = null;
      })
      .addCase(fetchMemberDistributionChart.fulfilled, (state, action) => {
        state.chartLoading = false;
        state.memberDistributionChart = action.payload || [];
      })
      .addCase(fetchMemberDistributionChart.rejected, (state, action) => {
        state.chartLoading = false;
        state.chartError = action.payload;
        state.memberDistributionChart = [];
      });
  },
});

export const {
  clearErrors,
  clearSuccess,
  setSelectedDepartment,
  clearSelectedDepartment,
  resetDepartmentState,
} = departmentSlice.actions;

export default departmentSlice.reducer;
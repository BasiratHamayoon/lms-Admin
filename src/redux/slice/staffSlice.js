import { createSlice } from '@reduxjs/toolkit';
import {
  fetchStaffList,
  fetchStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  fetchStaffStats,
  fetchStaffMonthChart,
  fetchStaffRoleChart
} from '../actions/staff';

const initialState = {
  list: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  },
  selectedStaff: null,
  stats: {
    totalAll: 0,
    totalTeachers: 0,
    totalHR: 0,
    totalAccountant: 0
  },
  monthChart: [],
  roleChart: [],
  
  loading: false,
  statsLoading: false,
  chartsLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  
  error: null,
  statsError: null,
  
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false
};

const staffSlice = createSlice({
  name: 'staff',
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
    setSelectedStaff: (state, action) => {
      state.selectedStaff = action.payload;
    },
    clearSelectedStaff: (state) => {
      state.selectedStaff = null;
    },
    resetStaffState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaffList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
.addCase(fetchStaffList.fulfilled, (state, action) => {
  state.loading = false;
    state.list = action.payload?.users || [];
  
  const paginationData = action.payload?.pagination;
  if (paginationData) {
    state.pagination = {
      total: paginationData.total || 0,
      page: paginationData.page || 1,
      limit: paginationData.limit || 10,
      totalPages: paginationData.totalPages || 1
    };
  }
  
  console.log('✅ Staff loaded:', state.list.length);
  console.log('✅ Pagination:', state.pagination);
})
      .addCase(fetchStaffList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.list = [];
      })
      .addCase(fetchStaffById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStaff = action.payload;
      })
      .addCase(fetchStaffById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createStaff.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createStaff.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;
        if (action.payload) {
          state.list.unshift(action.payload);
          state.pagination.total += 1;
          state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit) || 1;
        }
      })
      .addCase(createStaff.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      .addCase(updateStaff.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateStaff.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        if (action.payload) {
          const index = state.list.findIndex(s => s.id === action.payload.id);
          if (index !== -1) {
            state.list[index] = action.payload;
          }
          if (state.selectedStaff?.id === action.payload.id) {
            state.selectedStaff = action.payload;
          }
        }
      })
      .addCase(updateStaff.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      .addCase(deleteStaff.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
        state.list = state.list.filter(s => s.id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit) || 1;
        if (state.selectedStaff?.id === action.payload) {
          state.selectedStaff = null;
        }
      })
      .addCase(deleteStaff.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      })
      .addCase(fetchStaffStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchStaffStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = { ...initialState.stats, ...(action.payload || {}) };
      })
      .addCase(fetchStaffStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload;
      })
      .addCase(fetchStaffMonthChart.pending, (state) => {
        state.chartsLoading = true;
      })
      .addCase(fetchStaffMonthChart.fulfilled, (state, action) => {
        state.chartsLoading = false;
        state.monthChart = action.payload?.chartData || [];
      })
      .addCase(fetchStaffMonthChart.rejected, (state) => {
        state.chartsLoading = false;
      })

      .addCase(fetchStaffRoleChart.pending, (state) => {
        state.chartsLoading = true;
      })
      .addCase(fetchStaffRoleChart.fulfilled, (state, action) => {
        state.chartsLoading = false;
        state.roleChart = action.payload?.chartData || [];
      })
      .addCase(fetchStaffRoleChart.rejected, (state) => {
        state.chartsLoading = false;
      });
  }
});

export const {
  clearErrors,
  clearSuccess,
  setSelectedStaff,
  clearSelectedStaff,
  resetStaffState
} = staffSlice.actions;

export default staffSlice.reducer;
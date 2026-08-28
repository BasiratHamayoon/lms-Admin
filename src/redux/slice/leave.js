import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance"; 

export const fetchAllLeaves = createAsyncThunk(
  "leave/fetchAll",
  async ({ 
    page = 1, 
    limit = 10, 
    status, 
    leaveType, 
    userRole, 
    search,
    fromDate,
    toDate,
    sortBy,
    sortOrder
  } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      
      params.append('page', page);
      params.append('limit', limit);
      
      if (status && status !== "all") params.append('status', status);
      if (leaveType && leaveType !== "all") params.append('leaveType', leaveType);
      if (userRole && userRole !== "all") params.append('userRole', userRole);
      if (search && search.trim()) params.append('search', search.trim());
      if (fromDate) params.append('fromDate', fromDate);
      if (toDate) params.append('toDate', toDate);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);
      
      const response = await axios.get(`/leaves?${params.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch leaves");
    }
  }
);

export const fetchLeaveDetails = createAsyncThunk(
  "leave/fetchDetails",
  async (leaveId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/leave/${leaveId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch leave details");
    }
  }
);

export const processLeave = createAsyncThunk(
  "leave/process",
  async ({ id, status, rejectReason, comment }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/leave/process/${id}`, { status, rejectReason, comment });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to process leave");
    }
  }
);

export const deleteLeave = createAsyncThunk(
  "leave/delete",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/leave/${id}`, { data: { reason } });
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete leave");
    }
  }
);

export const fetchAllQuotas = createAsyncThunk(
  "leave/fetchAllQuotas",
  async ({ page = 1, limit = 10, userRole, academicYear, search } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      
      params.append('page', page);
      params.append('limit', limit);
      
      if (userRole && userRole !== "all") params.append('userRole', userRole);
      if (academicYear && academicYear !== "all") params.append('academicYear', academicYear);
      if (search && search.trim()) params.append('search', search.trim());

      const response = await axios.get(`/all-quotas?${params.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch quotas");
    }
  }
);

export const updateUserQuota = createAsyncThunk(
  "leave/updateQuota",
  async ({ userId, academicYear, quotas, notes }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/user-quota/${userId}`, { academicYear, quotas, notes });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update quota");
    }
  }
);

export const bulkUpdateQuota = createAsyncThunk(
  "leave/bulkUpdateQuota",
  async ({ academicYear, userRole, quotas, notes }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/bulk-quota`, { academicYear, userRole, quotas, notes });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update bulk quotas");
    }
  }
);

export const fetchLeaveStats = createAsyncThunk(
  "leave/fetchStats",
  async ({ month, year, userRole } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (month) params.append('month', month);
      if (year) params.append('year', year);
      if (userRole) params.append('userRole', userRole);
      
      const response = await axios.get(`/leave-stats?${params.toString()}`); 
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch stats");
    }
  }
);

const leaveSlice = createSlice({
  name: "leave",
  initialState: {
    leaves: [],
    quotas: [],
    leaveDetails: null, // Added for storing single leave details
    stats: null,
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      pages: 0
    },
    quotaPagination: {
      total: 0,
      page: 1,
      limit: 10,
      pages: 0
    },
    
    currentFilters: {
      status: 'all',
      leaveType: 'all',
      userRole: 'all',
      search: '',
      fromDate: null,
      toDate: null
    },
    loading: false,
    actionLoading: false, 
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    
    setFilters: (state, action) => {
      state.currentFilters = { ...state.currentFilters, ...action.payload };
    },
    resetFilters: (state) => {
      state.currentFilters = {
        status: 'all',
        leaveType: 'all',
        userRole: 'all',
        search: '',
        fromDate: null,
        toDate: null
      };
    }
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchAllLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload.data.leaves;
        state.pagination = action.payload.data.pagination;
        
        if (action.payload.data.appliedFilters) {
          state.currentFilters = {
            ...state.currentFilters,
            ...action.payload.data.appliedFilters
          };
        }
      })
      .addCase(fetchAllLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchLeaveDetails.pending, (state) => {
        state.actionLoading = true;
        state.leaveDetails = null;
        state.error = null;
      })
      .addCase(fetchLeaveDetails.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.leaveDetails = action.payload.data;
      })
      .addCase(fetchLeaveDetails.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      
      .addCase(processLeave.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(processLeave.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.successMessage = action.payload.message;
        
        const updatedLeave = action.payload.data.leave;
        state.leaves = state.leaves.map((l) => 
          l._id === updatedLeave._id ? updatedLeave : l
        );
      })
      .addCase(processLeave.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteLeave.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteLeave.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.leaves = state.leaves.filter((l) => l._id !== action.payload.id);
        state.successMessage = action.payload.message;
        
        if (state.pagination.total > 0) {
          state.pagination.total -= 1;
        }
      })
      .addCase(deleteLeave.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllQuotas.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllQuotas.fulfilled, (state, action) => {
        state.loading = false;
        state.quotas = action.payload.data.users;
        state.quotaPagination = action.payload.data.pagination;
      })
      .addCase(fetchAllQuotas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateUserQuota.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateUserQuota.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { userId, quotas } = action.payload.data;
        state.quotas = state.quotas.map(u => 
          u.userId === userId ? { ...u, quotas: quotas } : u
        );
        state.successMessage = "Quota updated successfully";
      })
      .addCase(updateUserQuota.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(bulkUpdateQuota.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(bulkUpdateQuota.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(bulkUpdateQuota.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchLeaveStats.fulfilled, (state, action) => {
        state.stats = action.payload.data;
      });
  },
});

export const { clearMessages, setFilters, resetFilters } = leaveSlice.actions;
export default leaveSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    fetchOverallKPIs,
    fetchPerformanceSummary,
    fetchStaffKPIDetail,
    fetchStaffKPIs
} from '../actions/performance'


const initialState = {
  kpis: {
    totalKPIs: 0,
    feedbackCount: 0,
    averages: {}
  },
  summaryData: [],
  staffList: {
    rows: [],
    total: 0,
    page: 1,
    limit: 10
  },
  selectedStaff: null, // Stores the detail data
  loading: {
    kpis: false,
    summary: false,
    list: false,
    detail: false
  },
  error: null
};

const performanceSlice = createSlice({
  name: "performance",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearSelectedStaff: (state) => {
      state.selectedStaff = null;
    }
  },
  extraReducers: (builder) => {
    // KPIs
    builder
      .addCase(fetchOverallKPIs.pending, (state) => { state.loading.kpis = true; })
      .addCase(fetchOverallKPIs.fulfilled, (state, action) => {
        state.loading.kpis = false;
        state.kpis = action.payload;
      })
      .addCase(fetchOverallKPIs.rejected, (state, action) => {
        state.loading.kpis = false;
        state.error = action.payload;
      });

    // Summary (Charts)
    builder
      .addCase(fetchPerformanceSummary.pending, (state) => { state.loading.summary = true; })
      .addCase(fetchPerformanceSummary.fulfilled, (state, action) => {
        state.loading.summary = false;
        state.summaryData = action.payload;
      })
      .addCase(fetchPerformanceSummary.rejected, (state) => {
        state.loading.summary = false;
      });

    // Staff List
    builder
      .addCase(fetchStaffKPIs.pending, (state) => { state.loading.list = true; })
      .addCase(fetchStaffKPIs.fulfilled, (state, action) => {
        state.loading.list = false;
        state.staffList = action.payload;
      })
      .addCase(fetchStaffKPIs.rejected, (state, action) => {
        state.loading.list = false;
        state.error = action.payload;
      });

    // Staff Detail
    builder
      .addCase(fetchStaffKPIDetail.pending, (state) => { state.loading.detail = true; state.error = null; })
      .addCase(fetchStaffKPIDetail.fulfilled, (state, action) => {
        state.loading.detail = false;
        state.selectedStaff = action.payload;
      })
      .addCase(fetchStaffKPIDetail.rejected, (state, action) => {
        state.loading.detail = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  }
});

export const { clearErrors, clearSelectedStaff } = performanceSlice.actions;
export default performanceSlice.reducer;
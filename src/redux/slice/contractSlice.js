import { createSlice } from "@reduxjs/toolkit";
import {
  fetchContracts,
  fetchContractById,
  createContract,
  updateContract,
  deleteContract,
  fetchContractStats,
  fetchContractTypeChart,
  fetchContractExpiryChart
} from '../actions/contract';

const initialState = {
  list: [],
  pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
  stats: { totalContracts: 0, activeContracts: 0, expiredContracts: 0 },
  charts: { typeChart: [], expiryChart: [] },
  selectedContract: null,
  
  loading: false,
  statsLoading: false,
  chartsLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  
  error: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
};

const contractSlice = createSlice({
  name: "contracts",
  initialState,
  reducers: {
    clearErrors: (state) => { state.error = null; },
    clearSuccess: (state) => {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },
    clearSelectedContract: (state) => { state.selectedContract = null; },
  },
  extraReducers: (builder) => {
    builder
      // Fetch List
      .addCase(fetchContracts.pending, (state) => { state.loading = true; })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.contracts;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch By ID
      .addCase(fetchContractById.fulfilled, (state, action) => {
        state.selectedContract = action.payload;
      })
      // Create
      .addCase(createContract.pending, (state) => { state.createLoading = true; })
      .addCase(createContract.fulfilled, (state) => {
        state.createLoading = false;
        state.createSuccess = true;
      })
      .addCase(createContract.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateContract.pending, (state) => { state.updateLoading = true; })
      .addCase(updateContract.fulfilled, (state) => {
        state.updateLoading = false;
        state.updateSuccess = true;
      })
      .addCase(updateContract.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteContract.pending, (state) => { state.deleteLoading = true; })
      .addCase(deleteContract.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
        state.list = state.list.filter((c) => c.id !== action.payload);
        if(state.stats.totalContracts > 0) {
          state.stats.totalContracts -= 1;
        }
      })
      .addCase(deleteContract.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      })
      // Stats
      .addCase(fetchContractStats.pending, (state) => { state.statsLoading = true; })
      .addCase(fetchContractStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchContractStats.rejected, (state) => { state.statsLoading = false; })
      // Charts
      .addCase(fetchContractTypeChart.pending, (state) => { state.chartsLoading = true; })
      .addCase(fetchContractTypeChart.fulfilled, (state, action) => {
        state.chartsLoading = false;
        state.charts.typeChart = action.payload;
      })
      .addCase(fetchContractTypeChart.rejected, (state) => { state.chartsLoading = false; })
      .addCase(fetchContractExpiryChart.pending, (state) => { state.chartsLoading = true; })
      .addCase(fetchContractExpiryChart.fulfilled, (state, action) => {
        state.chartsLoading = false;
        state.charts.expiryChart = action.payload;
      })
      .addCase(fetchContractExpiryChart.rejected, (state) => { state.chartsLoading = false; });
  },
});

export const { clearErrors, clearSuccess, clearSelectedContract } = contractSlice.actions;

export default contractSlice.reducer;
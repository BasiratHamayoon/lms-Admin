// redux/slices/reportsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchReportCards, 
  fetchGraphData, 
  fetchFeeReports, 
  fetchExpenseReports 
} from '../actions/report';

const initialState = {
  cards: {
    totalFeeCollection: 0,
    totalExpense: 0,
    totalPendingFees: 0,
    netBalance: 0,
  },
  graphData: [],
  feeRecords: [],
  feePagination: {
    page: 1,
    limit: 20,
    totalRecords: 0,
    totalPages: 0,
  },
  expenseRecords: [],
  expensePagination: {
    page: 1,
    limit: 20,
    totalRecords: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearReportsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Cards
      .addCase(fetchReportCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportCards.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = action.payload;
      })
      .addCase(fetchReportCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Graph
      .addCase(fetchGraphData.fulfilled, (state, action) => {
        state.graphData = action.payload;
      })

      // Fee reports (now includes pagination)
      .addCase(fetchFeeReports.fulfilled, (state, action) => {
        state.feeRecords = action.payload.records || [];
        state.feePagination = action.payload.pagination || state.feePagination;
      })

      // Expense reports (now includes pagination)
      .addCase(fetchExpenseReports.fulfilled, (state, action) => {
        state.expenseRecords = action.payload.expenses || [];
        state.expensePagination =
          action.payload.pagination || state.expensePagination;
      });
  },
});

export const { clearReportsError } = reportsSlice.actions;
export default reportsSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';
import {
  fetchExpenses,
  fetchExpenseDetails,
  createExpense,
  updateExpense,
  deleteExpense,
  fetchExpenseStats,
  processExpense
} from '../actions/expense';

const initialState = {
  expenses: [],
  pagination: { totalExpenses: 0, currentPage: 1, totalPages: 1 },
  stats: { statusBreakdown: [] },
  selectedExpense: null,
  loading: false,
  detailsLoading: false,
  statsLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  processLoading: false,
  error: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  processSuccess: false,
};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    clearErrors: (state) => { state.error = null; },
    clearSuccess: (state) => {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
      state.processSuccess = false;
    },
    clearSelectedExpense: (state) => { state.selectedExpense = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => { state.loading = true; })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload.expenses;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchExpenses.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchExpenseDetails.pending, (state) => { state.detailsLoading = true; })
      .addCase(fetchExpenseDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedExpense = action.payload;
      })
      .addCase(fetchExpenseDetails.rejected, (state, action) => { state.detailsLoading = false; state.error = action.payload; })

      .addCase(createExpense.pending, (state) => { state.createLoading = true; })
      .addCase(createExpense.fulfilled, (state) => { state.createLoading = false; state.createSuccess = true; })
      .addCase(createExpense.rejected, (state, action) => { state.createLoading = false; state.error = action.payload; })

      .addCase(updateExpense.pending, (state) => { state.updateLoading = true; })
      .addCase(updateExpense.fulfilled, (state) => { state.updateLoading = false; state.updateSuccess = true; })
      .addCase(updateExpense.rejected, (state, action) => { state.updateLoading = false; state.error = action.payload; })

      .addCase(deleteExpense.pending, (state) => { state.deleteLoading = true; })
      .addCase(deleteExpense.fulfilled, (state) => { state.deleteLoading = false; state.deleteSuccess = true; })
      .addCase(deleteExpense.rejected, (state, action) => { state.deleteLoading = false; state.error = action.payload; })
      
      .addCase(processExpense.pending, (state) => { state.processLoading = true; })
      .addCase(processExpense.fulfilled, (state, action) => {
        state.processLoading = false;
        state.processSuccess = true;
        const index = state.expenses.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
        if (state.selectedExpense?._id === action.payload._id) {
          state.selectedExpense = action.payload;
        }
      })
      .addCase(processExpense.rejected, (state, action) => { state.processLoading = false; state.error = action.payload; })
      
      .addCase(fetchExpenseStats.pending, (state) => { state.statsLoading = true; })
      .addCase(fetchExpenseStats.fulfilled, (state, action) => { state.statsLoading = false; state.stats = action.payload; })
      .addCase(fetchExpenseStats.rejected, (state) => { state.statsLoading = false; });
  }
});

export const { clearErrors, clearSuccess, clearSelectedExpense } = expenseSlice.actions;

export default expenseSlice.reducer;
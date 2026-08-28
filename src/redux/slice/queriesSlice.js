import { createSlice} from "@reduxjs/toolkit";
import {
    deleteQuery,
    fetchQueries,
    fetchQueryDetails,
    fetchQueryStats,
    replyToQuery
} from '../actions/queries'

const initialState = {
  queries: [],
  queryDetails: null,
  stats: { total: 0, open: 0, "in-progress": 0, closed: 0 },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalQueries: 0,
    limit: 10
  },
  loading: false,
  detailsLoading: false,
  error: null,
};

const querySlice = createSlice({
  name: "queries",
  initialState,
  reducers: {
    clearDetails: (state) => {
      state.queryDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQueries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQueries.fulfilled, (state, action) => {
        state.loading = false;
        state.queries = action.payload.queries;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchQueries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchQueryStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchQueryDetails.pending, (state) => {
        state.detailsLoading = true;
      })
      .addCase(fetchQueryDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.queryDetails = action.payload;
      })
      .addCase(deleteQuery.fulfilled, (state, action) => {
        state.queries = state.queries.filter(q => q.id !== action.payload);
        state.stats.total -= 1;
      })
      .addCase(replyToQuery.fulfilled, (state, action) => {
         const index = state.queries.findIndex(q => q.id === action.payload.queryId);
         if (index !== -1) {
             state.queries[index].status = action.payload.status;
         }
      });
  },
});

export const { clearDetails } = querySlice.actions;
export default querySlice.reducer;
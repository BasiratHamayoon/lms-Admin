import { createSlice } from '@reduxjs/toolkit';
import asyncThunkRequest from '@utils/asyncThunkRequest';
import {
  getDashboardStatsApi,
  getDashboardQueryStatsApi,
  getDashboardChartsApi,
  getRecentActivitiesApi
} from '@redux/actions/dashboard';

export const fetchDashboardStats = asyncThunkRequest(
  'dashboard/fetchStats',
  () => getDashboardStatsApi()
);

export const fetchDashboardQueryStats = asyncThunkRequest(
  'dashboard/fetchQueryStats',
  () => getDashboardQueryStatsApi()
  
);

export const fetchDashboardCharts = asyncThunkRequest(
  'dashboard/fetchCharts',
  () => getDashboardChartsApi()
);

export const fetchRecentActivities = asyncThunkRequest(
  'dashboard/fetchRecentActivities',
  () => getRecentActivitiesApi()
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: null,
    queryStats: null,
    queries: [],
    charts: null,
    recentActivitiesRaw: null,
    loadingStats: false,
    loadingQueryStats: false,
    loadingCharts: false,
    loadingRecentActivities: false,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDashboardStats.pending, state => {
        state.loadingStats = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, { payload }) => {
        state.loadingStats = false;
        state.stats = payload || null;
      })
      .addCase(fetchDashboardStats.rejected, (state, { payload, error }) => {
        state.loadingStats = false;
        state.error = payload || error?.message || 'Failed to load dashboard stats';
      });

    builder
      .addCase(fetchDashboardQueryStats.pending, state => {
        state.loadingQueryStats = true;
        state.error = null;
      })
      .addCase(fetchDashboardQueryStats.fulfilled, (state, { payload }) => {
        state.loadingQueryStats = false;
        state.queryStats = payload?.stats || null;
        state.queries = payload?.recentQueries || [];
      })
      .addCase(fetchDashboardQueryStats.rejected, (state, { payload, error }) => {
        state.loadingQueryStats = false;
        state.error = payload || error?.message || 'Failed to load query stats';
      });

    builder
      .addCase(fetchDashboardCharts.pending, state => {
        state.loadingCharts = true;
        state.error = null;
      })
      .addCase(fetchDashboardCharts.fulfilled, (state, { payload }) => {
        state.loadingCharts = false;
        state.charts = payload || null;
      })
      .addCase(fetchDashboardCharts.rejected, (state, { payload, error }) => {
        state.loadingCharts = false;
        state.error = payload || error?.message || 'Failed to load charts';
      });

    builder
      .addCase(fetchRecentActivities.pending, state => {
        state.loadingRecentActivities = true;
        state.error = null;
      })
      .addCase(fetchRecentActivities.fulfilled, (state, { payload }) => {
        state.loadingRecentActivities = false;
        state.recentActivitiesRaw = payload || null;
      })
      .addCase(fetchRecentActivities.rejected, (state, { payload, error }) => {
        state.loadingRecentActivities = false;
        state.error = payload || error?.message || 'Failed to load recent activities';
      });
  }
});

export default dashboardSlice.reducer;
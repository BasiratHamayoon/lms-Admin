import api from '@utils/axiosInstance';

export const getDashboardStatsApi = () => api.get('/dashboard/stats');

export const getDashboardQueryStatsApi = () => api.get('/dashboard/queryStats');

export const getDashboardChartsApi = () => api.get('/dashboard/charts');

export const getRecentActivitiesApi = () => api.get('/dashboard/recent-activities');